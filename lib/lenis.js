/**
 * Lenis singleton.
 *
 * The smooth-scroll instance is created once inside <ScrollFX /> (because it has
 * to be wired into GSAP's ticker). Any component that needs to scroll to an
 * anchor, or pause scrolling (mobile menu, lightbox), talks to it through here
 * instead of touching the DOM directly.
 */
let instance = null;

export function setLenis(lenis) {
  instance = lenis;
}

export function getLenis() {
  return instance;
}

export function stopScroll() {
  if (instance) instance.stop();
  else document.body.style.overflow = 'hidden';
}

export function startScroll() {
  if (instance) instance.start();
  else document.body.style.overflow = '';
}

/** Smoothly scroll to an element id ('#menu') or an element. */
export function scrollToId(target, options = {}) {
  const el = typeof target === 'string' ? document.querySelector(target) : target;
  if (!el) return;

  if (instance) {
    instance.scrollTo(el, { offset: 0, duration: 1.15, ...options });
  } else {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  }
}
