// Decide the layout from the kind of device first, and only then from width.
//
// Width alone can't tell a half-width Chrome window on a Mac from an iPad, so
// desktops kept getting the iPad tab bar. Instead:
//   input "pointer" – Mac / Windows / Linux browsers (mouse or trackpad)
//   input "touch"   – iPhone, iPad, Android
//
// iPadOS Safari reports itself as "Macintosh" by default, so a Mac-looking
// user agent with multi-touch is treated as an iPad. Real Macs report
// navigator.maxTouchPoints === 0.
//
// Layouts:
//   pointer: sidebar at 720px and wider, a top nav bar below that. Never a tab bar.
//   touch:   sidebar at 1024pt and wider (iPad landscape), floating tab bar below.
//
// ?device=desktop|touch forces one (used by the device preview).

const SIDEBAR_MIN = { pointer: 720, touch: 1024 };

export function detectInput() {
  const forced = new URLSearchParams(window.location.search).get("device");
  if (forced === "desktop") return "pointer";
  if (forced === "touch") return "touch";

  const ua = navigator.userAgent || "";
  const isIPadOS = /Macintosh/.test(ua) && navigator.maxTouchPoints > 1;
  const isMobileOS = /iPhone|iPad|iPod|Android/.test(ua) || isIPadOS;
  if (isMobileOS) return "touch";

  // Desktop OS. Touchscreen laptops still have a mouse/trackpad as the
  // primary pointer, so they stay on the desktop layout.
  return window.matchMedia("(pointer: fine)").matches || navigator.maxTouchPoints === 0 ? "pointer" : "touch";
}

export function layoutFor(input, width) {
  if (width >= SIDEBAR_MIN[input]) return "sidebar";
  return input === "pointer" ? "topnav" : "tabs";
}

export function installDeviceLayout() {
  const root = document.documentElement;
  const input = detectInput();
  root.dataset.input = input;
  const update = () => {
    const layout = layoutFor(input, window.innerWidth);
    if (root.dataset.layout !== layout) root.dataset.layout = layout;
  };
  update();
  window.addEventListener("resize", update);
}

export function isTouchInput() {
  return document.documentElement.dataset.input === "touch";
}
