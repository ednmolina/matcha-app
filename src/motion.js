// Tiny physics helpers modeled on Apple's "Designing Fluid Interfaces" (WWDC18).
// Springs are described with Apple's designer-friendly parameters:
//   damping  – damping ratio. 1 = critically damped (no overshoot), < 1 = bouncy.
//   response – roughly how quickly the value reaches its target, in seconds.
// A spring always starts from the *current* value and velocity, so every
// animation is interruptible and can be re-targeted mid-flight.

export function animateSpring({
  from,
  to,
  velocity = 0,
  damping = 1,
  response = 0.35,
  restDelta = 0.5,
  onUpdate,
  onComplete,
}) {
  const stiffness = (2 * Math.PI / response) ** 2;
  const friction = (4 * Math.PI * damping) / response;
  const restSpeed = restDelta * 10;
  let value = from;
  let speed = velocity;
  let last = performance.now();
  let raf = 0;
  let done = false;

  function frame(now) {
    const dt = Math.min(0.064, (now - last) / 1000);
    last = now;
    const steps = Math.max(1, Math.ceil(dt / 0.004));
    const h = dt / steps;
    for (let i = 0; i < steps; i++) {
      const accel = -stiffness * (value - to) - friction * speed;
      speed += accel * h;
      value += speed * h;
    }
    if (Math.abs(speed) < restSpeed && Math.abs(value - to) < restDelta) {
      value = to;
      speed = 0;
      done = true;
      onUpdate(value);
      onComplete?.();
      return;
    }
    onUpdate(value);
    raf = requestAnimationFrame(frame);
  }

  raf = requestAnimationFrame(frame);

  return {
    stop() {
      cancelAnimationFrame(raf);
      done = true;
    },
    get value() {
      return value;
    },
    get velocity() {
      return speed;
    },
    get done() {
      return done;
    },
  };
}

// Where a flick would come to rest (Apple's exponential deceleration projection).
export function project(velocity, decelerationRate = 0.998) {
  return ((velocity / 1000) * decelerationRate) / (1 - decelerationRate);
}

// Progressive resistance past a boundary – real things slow before they stop.
export function rubberband(overshoot, dimension, constant = 0.55) {
  return (overshoot * dimension * constant) / (dimension + constant * Math.abs(overshoot));
}

// Velocity (px/s) from a short pointer history of { y, t } samples.
export function velocityFromHistory(history) {
  if (history.length < 2) return 0;
  const lastSample = history[history.length - 1];
  let first = history[0];
  for (let i = history.length - 1; i >= 0; i--) {
    if (lastSample.t - history[i].t > 100) break;
    first = history[i];
  }
  const dt = (lastSample.t - first.t) / 1000;
  return dt > 0 ? (lastSample.y - first.y) / dt : 0;
}

export function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

// Light haptic tick where supported (Android/Chrome); a no-op elsewhere.
export function tick() {
  try {
    navigator.vibrate?.(8);
  } catch {
    /* ignore */
  }
}
