import { useEffect } from "react";
import { useMap } from "react-leaflet";
import { animateSpring, prefersReducedMotion, project, rubberband, velocityFromHistory } from "./motion.js";

// Apple-style zooming for the Leaflet map, replacing Leaflet's stepped
// scroll-wheel zoom and its pinch zoom, which stops dead on release.
//
//   Trackpad / mouse wheel  – zoom follows the scroll continuously on a spring,
//                             so macOS's own scroll momentum carries it on.
//   Trackpad pinch          – ctrl+wheel in Chrome/Firefox, gesture events in Safari.
//   Touch pinch             – zooms around the fingers. On release, the zoom keeps
//                             going with the pinch's velocity and eases to rest.
//   Zoom limits             – pinching past them rubber-bands, then springs back.
//
// Every animation starts from the live zoom and velocity, so a new gesture
// interrupts it cleanly. Leaflet's own drag-to-pan (with its inertia) is untouched.

const WHEEL_ZOOM_PER_PX = 1 / 240; // two-finger scroll: ~240px per zoom level
const PINCH_ZOOM_PER_PX = 1 / 90; // ctrl+wheel deltas from a trackpad pinch are small
const MAX_VELOCITY = 6; // zoom levels per second
const OVERSCROLL = 0.6; // how far (in zoom levels) the rubber band can stretch

export default function MapGestures({ minZoom, maxZoom }) {
  const map = useMap();

  useEffect(() => {
    const el = map.getContainer();
    const reduced = prefersReducedMotion();
    let spring = null;
    let target = null;

    // The map itself allows OVERSCROLL beyond these so the rubber band can show.
    map.setMinZoom(minZoom - OVERSCROLL);
    map.setMaxZoom(maxZoom + OVERSCROLL);
    const limits = () => [minZoom, maxZoom];
    const clamp = (z) => {
      const [min, max] = limits();
      return Math.min(max, Math.max(min, z));
    };
    const stretch = (z) => {
      const [min, max] = limits();
      if (z > max) return max + rubberband(z - max, OVERSCROLL);
      if (z < min) return min - rubberband(min - z, OVERSCROLL);
      return z;
    };
    const pointFor = (clientX, clientY) => {
      const r = el.getBoundingClientRect();
      return [clientX - r.left, clientY - r.top];
    };

    // Show zoom `z` while keeping `latlng` under container point `point`.
    // zoomSnap is 0, so fractional zoom levels are rendered as-is.
    const viewAt = (z, latlng, point) => {
      const size = map.getSize();
      const center = map.project(latlng, z).subtract(point).add(size.divideBy(2));
      map.setView(map.unproject(center, z), z, { animate: false });
    };

    const stop = () => {
      spring?.stop();
      spring = null;
      target = null;
    };

    const animateTo = (to, velocity, anchorLatLng, anchorPoint, response) => {
      const from = map.getZoom();
      spring?.stop();
      target = to;
      if (reduced) {
        viewAt(to, anchorLatLng, anchorPoint);
        spring = null;
        target = null;
        return;
      }
      spring = animateSpring({
        from,
        to,
        velocity,
        damping: 1,
        response,
        restDelta: 0.002,
        onUpdate: (z) => viewAt(z, anchorLatLng, anchorPoint),
        onComplete: () => {
          spring = null;
          target = null;
        },
      });
    };

    // A gesture just ended: carry its velocity on, and settle back inside the limits.
    const release = (shownZoom, history, anchorLatLng, anchorPoint) => {
      let v = reduced ? 0 : velocityFromHistory(history);
      v = Math.max(-MAX_VELOCITY, Math.min(MAX_VELOCITY, v));
      const resting = clamp(shownZoom + project(v, 0.996) * 0.5);
      animateTo(resting, v, anchorLatLng, anchorPoint, 0.45);
    };

    // ---- Wheel: two-finger trackpad scroll, mouse wheel, Chrome trackpad pinch
    const onWheel = (e) => {
      e.preventDefault();
      const unit = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? el.clientHeight : 1;
      const delta = -e.deltaY * unit * (e.ctrlKey ? PINCH_ZOOM_PER_PX : WHEEL_ZOOM_PER_PX);
      const point = pointFor(e.clientX, e.clientY);
      const latlng = map.containerPointToLatLng(point);
      const base = target ?? map.getZoom();
      const to = clamp(base + delta);
      if (to === base && !spring) return;
      animateTo(to, spring ? spring.velocity : 0, latlng, point, 0.2);
    };

    // ---- Touch pinch
    let pinch = null;
    const touchInfo = (touches) => {
      const [a, b] = [touches[0], touches[1]];
      return {
        dist: Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY),
        point: pointFor((a.clientX + b.clientX) / 2, (a.clientY + b.clientY) / 2),
      };
    };
    const onTouchStart = (e) => {
      if (e.touches.length !== 2) return;
      e.preventDefault();
      stop();
      map.stop();
      map.dragging.disable(); // two fingers zoom; Leaflet's one-finger drag would fight it
      const { dist, point } = touchInfo(e.touches);
      pinch = {
        startDist: Math.max(1, dist),
        startZoom: map.getZoom(),
        latlng: map.containerPointToLatLng(point),
        point,
        shown: map.getZoom(),
        history: [],
      };
    };
    const onTouchMove = (e) => {
      if (!pinch || e.touches.length < 2) return;
      e.preventDefault();
      const { dist, point } = touchInfo(e.touches);
      const raw = pinch.startZoom + Math.log2(dist / pinch.startDist);
      pinch.shown = stretch(raw);
      pinch.point = point;
      pinch.history.push({ y: pinch.shown, t: performance.now() });
      if (pinch.history.length > 20) pinch.history.shift();
      viewAt(pinch.shown, pinch.latlng, point);
    };
    const onTouchEnd = (e) => {
      if (!pinch || e.touches.length >= 2) return;
      const { shown, history, latlng, point } = pinch;
      pinch = null;
      map.dragging.enable();
      release(shown, history, latlng, point);
    };

    // ---- Safari: trackpad pinch arrives as gesture events. On iOS the touch
    // handlers above do the work; we only stop Safari zooming the whole page.
    let gesture = null;
    const isTouch = () => document.documentElement.dataset.input === "touch";
    const onGestureStart = (e) => {
      e.preventDefault();
      if (isTouch()) return;
      stop();
      map.stop();
      const point = pointFor(e.clientX, e.clientY);
      gesture = { startZoom: map.getZoom(), latlng: map.containerPointToLatLng(point), point, shown: map.getZoom(), history: [] };
    };
    const onGestureChange = (e) => {
      e.preventDefault();
      if (!gesture) return;
      gesture.shown = stretch(gesture.startZoom + Math.log2(e.scale || 1));
      gesture.history.push({ y: gesture.shown, t: performance.now() });
      if (gesture.history.length > 20) gesture.history.shift();
      viewAt(gesture.shown, gesture.latlng, gesture.point);
    };
    const onGestureEnd = (e) => {
      e.preventDefault();
      if (!gesture) return;
      const { shown, history, latlng, point } = gesture;
      gesture = null;
      release(shown, history, latlng, point);
    };

    const active = { passive: false };
    el.addEventListener("wheel", onWheel, active);
    el.addEventListener("touchstart", onTouchStart, active);
    el.addEventListener("touchmove", onTouchMove, active);
    el.addEventListener("touchend", onTouchEnd);
    el.addEventListener("touchcancel", onTouchEnd);
    el.addEventListener("gesturestart", onGestureStart, active);
    el.addEventListener("gesturechange", onGestureChange, active);
    el.addEventListener("gestureend", onGestureEnd, active);
    // Buttons and double-tap zoom use Leaflet's own animation; don't fight them.
    map.on("zoomanim", stop);
    // If Leaflet's own zoom (buttons, double-tap) lands past a limit, spring back.
    const settle = () => {
      if (spring || pinch || gesture) return;
      const z = map.getZoom();
      if (z === clamp(z)) return;
      const mid = map.getSize().divideBy(2);
      animateTo(clamp(z), 0, map.containerPointToLatLng(mid), mid, 0.35);
    };
    map.on("zoomend", settle);

    return () => {
      stop();
      map.off("zoomanim", stop);
      map.off("zoomend", settle);
      el.removeEventListener("wheel", onWheel, active);
      el.removeEventListener("touchstart", onTouchStart, active);
      el.removeEventListener("touchmove", onTouchMove, active);
      el.removeEventListener("touchend", onTouchEnd);
      el.removeEventListener("touchcancel", onTouchEnd);
      el.removeEventListener("gesturestart", onGestureStart, active);
      el.removeEventListener("gesturechange", onGestureChange, active);
      el.removeEventListener("gestureend", onGestureEnd, active);
    };
  }, [map, minZoom, maxZoom]);

  return null;
}
