import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { animateSpring, project, rubberband, velocityFromHistory, prefersReducedMotion } from "./motion.js";
import { CloseIcon } from "./icons.jsx";

// Remember where the last press happened so a sheet can grow out of the thing
// that opened it (spatial consistency: things emerge from where they came).
let lastPress = null;
if (typeof window !== "undefined") {
  window.addEventListener(
    "pointerdown",
    (event) => {
      lastPress = { x: event.clientX, y: event.clientY, t: performance.now() };
    },
    { capture: true, passive: true }
  );
}

const COMPACT_QUERY = "(max-width: 699px)";

function useIsCompact() {
  const [compact, setCompact] = useState(() => window.matchMedia(COMPACT_QUERY).matches);
  useEffect(() => {
    const mq = window.matchMedia(COMPACT_QUERY);
    const onChange = () => setCompact(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return compact;
}

/**
 * An interruptible, spring-driven sheet.
 * - iPhone widths: a bottom sheet you can grab and fling away (1:1 tracking,
 *   momentum projection, rubber-banding, velocity hand-off).
 * - iPad / Mac widths: a centered panel that materializes from the press point.
 */
export default function Sheet({ open, onClose, title, subtitle, accessory, size = "md", children, label }) {
  const compact = useIsCompact();
  const [mounted, setMounted] = useState(open);
  const panelRef = useRef(null);
  const scrimRef = useRef(null);
  const bodyRef = useRef(null);
  const animRef = useRef(null);
  const valueRef = useRef(null); // compact: px offset from open; regular: progress 0..1
  const releaseVelocityRef = useRef(0);
  const dragRef = useRef(null);
  const returnFocusRef = useRef(null);
  const reduced = prefersReducedMotion();
  const sheetMode = compact && !reduced ? "drawer" : "panel";

  if (open && !mounted) setMounted(true);

  const height = () => panelRef.current?.offsetHeight || window.innerHeight;

  const apply = useCallback(
    (value) => {
      valueRef.current = value;
      const panel = panelRef.current;
      const scrim = scrimRef.current;
      if (!panel || !scrim) return;
      if (sheetMode === "drawer") {
        const h = height();
        panel.style.transform = `translate3d(0, ${value}px, 0)`;
        panel.style.opacity = "";
        panel.style.filter = "";
        scrim.style.opacity = String(Math.max(0, Math.min(1, 1 - value / h)));
      } else {
        const p = Math.max(0, value);
        panel.style.opacity = String(Math.min(1, p));
        if (reduced) {
          panel.style.transform = "none";
          panel.style.filter = "";
        } else {
          const s = 0.94 + 0.06 * p;
          panel.style.transform = `translate3d(0, ${(1 - p) * 10}px, 0) scale(${s})`;
          panel.style.filter = p < 0.995 ? `blur(${(1 - Math.min(1, p)) * 6}px)` : "";
        }
        scrim.style.opacity = String(Math.max(0, Math.min(1, p)));
      }
    },
    [sheetMode, reduced]
  );

  const runTo = useCallback(
    (target, { velocity = 0, damping = 1, response = 0.35, onDone } = {}) => {
      const from = valueRef.current ?? target;
      const carried = animRef.current && !animRef.current.done ? animRef.current.velocity : 0;
      animRef.current?.stop();
      animRef.current = animateSpring({
        from,
        to: target,
        velocity: velocity || carried,
        damping,
        response: reduced ? 0.22 : response,
        restDelta: sheetMode === "drawer" ? 0.5 : 0.002,
        onUpdate: apply,
        onComplete: onDone,
      });
    },
    [apply, reduced, sheetMode]
  );

  // Open / close choreography. Always starts from the live, on-screen value.
  useLayoutEffect(() => {
    if (!mounted) return;
    const panel = panelRef.current;
    if (!panel) return;

    if (open) {
      if (valueRef.current == null) {
        if (sheetMode === "panel" && lastPress && performance.now() - lastPress.t < 800 && !reduced) {
          const rect = panel.getBoundingClientRect();
          panel.style.transformOrigin = `${lastPress.x - rect.left}px ${lastPress.y - rect.top}px`;
        } else {
          panel.style.transformOrigin = "";
        }
        apply(sheetMode === "drawer" ? height() : 0);
      }
      runTo(sheetMode === "drawer" ? 0 : 1, { response: sheetMode === "drawer" ? 0.38 : 0.32 });
    } else {
      const velocity = releaseVelocityRef.current;
      releaseVelocityRef.current = 0;
      runTo(sheetMode === "drawer" ? height() : 0, {
        velocity,
        damping: 1,
        response: sheetMode === "drawer" ? 0.32 : 0.24,
        onDone: () => {
          valueRef.current = null;
          setMounted(false);
        },
      });
    }
  }, [open, mounted, sheetMode, apply, runTo, reduced]);

  useEffect(() => () => animRef.current?.stop(), []);

  // Escape to dismiss, lock background scroll, and manage focus.
  useEffect(() => {
    if (!mounted) return undefined;
    const onKey = (event) => {
      if (event.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKey);
    const root = document.documentElement;
    const prevOverflow = root.style.overflow;
    root.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      root.style.overflow = prevOverflow;
    };
  }, [mounted, onClose]);

  useEffect(() => {
    if (open) {
      returnFocusRef.current = document.activeElement;
      panelRef.current?.focus({ preventScroll: true });
    } else if (returnFocusRef.current && document.contains(returnFocusRef.current)) {
      returnFocusRef.current.focus?.({ preventScroll: true });
      returnFocusRef.current = null;
    }
  }, [open, mounted]);

  // Reset scroll when content identity changes (e.g. jumping to a similar tea).
  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = 0;
  }, [label]);

  // ---- Drag to dismiss (drawer only) -------------------------------------
  function onPointerDown(event) {
    if (sheetMode !== "drawer" || !open) return;
    if (event.pointerType === "mouse" && event.button !== 0) return;
    dragRef.current = {
      id: event.pointerId,
      startY: event.clientY,
      startValue: valueRef.current ?? 0,
      active: false,
      history: [{ y: event.clientY, t: performance.now() }],
    };
  }

  function onPointerMove(event) {
    const drag = dragRef.current;
    if (!drag || drag.id !== event.pointerId) return;
    const dy = event.clientY - drag.startY;
    if (!drag.active) {
      if (Math.abs(dy) < 6) return; // hysteresis before committing to a drag
      drag.active = true;
      drag.startY = event.clientY;
      animRef.current?.stop(); // grab it mid-flight
      drag.startValue = valueRef.current ?? 0;
      event.currentTarget.setPointerCapture(event.pointerId);
    }
    drag.history.push({ y: event.clientY, t: performance.now() });
    if (drag.history.length > 8) drag.history.shift();
    const raw = drag.startValue + (event.clientY - drag.startY);
    apply(raw < 0 ? -rubberband(-raw, height()) : raw);
  }

  function onPointerUp(event) {
    const drag = dragRef.current;
    dragRef.current = null;
    if (!drag || !drag.active) return;
    const velocity = velocityFromHistory(drag.history);
    const current = valueRef.current ?? 0;
    const projected = current + project(velocity);
    const h = height();
    if (projected > h * 0.5 && velocity > -50) {
      releaseVelocityRef.current = velocity;
      onClose?.();
    } else {
      // Settle back home, inheriting the finger's velocity; a little bounce
      // only because the gesture itself carried momentum.
      runTo(0, { velocity, damping: Math.abs(velocity) > 300 ? 0.82 : 1, response: 0.32 });
    }
    try {
      event.currentTarget.releasePointerCapture(event.pointerId);
    } catch {
      /* already released */
    }
  }

  if (!mounted) return null;

  return createPortal(
    <div className={`sheet-host sheet-host--${sheetMode}`}>
      <div ref={scrimRef} className="sheet-scrim" style={{ opacity: 0 }} onClick={onClose} aria-hidden="true" />
      <div
        ref={panelRef}
        className={`sheet sheet--${sheetMode} sheet--${size}`}
        role="dialog"
        aria-modal="true"
        aria-label={typeof title === "string" ? title : label}
        tabIndex={-1}
        style={sheetMode === "drawer" ? { transform: "translate3d(0,100%,0)" } : { opacity: 0 }}
      >
        <header
          className="sheet-header"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          {sheetMode === "drawer" && <div className="sheet-grabber" aria-hidden="true" />}
          <div className="sheet-titlebar">
            <div className="sheet-titles">
              <h2 className="sheet-title">{title}</h2>
              {subtitle && <div className="sheet-subtitle">{subtitle}</div>}
            </div>
            <div className="sheet-actions">
              {accessory}
              <button type="button" className="icon-btn pressable" onClick={onClose} aria-label="Close">
                <CloseIcon />
              </button>
            </div>
          </div>
        </header>
        <div ref={bodyRef} className="sheet-body">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}
