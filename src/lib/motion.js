import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Central reduced-motion gate. When the user prefers reduced motion the page
 * must be fully readable with zero animation: sections skip GSAP setup and
 * render their final state immediately.
 */
export const prefersReducedMotion =
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export { gsap, ScrollTrigger };

/** Standard scroll-triggered entrance for a group of elements. */
export function staggerIn(targets, { trigger, y = 28, stagger = 0.1, start = 'top 78%' } = {}) {
  if (prefersReducedMotion) return;
  gsap.from(targets, {
    opacity: 0,
    y,
    duration: 0.7,
    ease: 'power3.out',
    stagger,
    scrollTrigger: { trigger: trigger ?? targets, start },
  });
}

/** Animate an SVG path being drawn, using dash offset (no paid plugins). */
export function drawPath(path, { trigger, start = 'top 75%', end = 'bottom 60%', scrub = true } = {}) {
  const length = path.getTotalLength();
  path.style.strokeDasharray = String(length);
  if (prefersReducedMotion) {
    path.style.strokeDashoffset = '0';
    return;
  }
  path.style.strokeDashoffset = String(length);
  gsap.to(path, {
    strokeDashoffset: 0,
    ease: 'none',
    scrollTrigger: { trigger: trigger ?? path, start, end, scrub },
  });
}

/** Count a number up when the element scrolls into view. */
export function countUp(el, value, { decimals = 0, suffix = '' } = {}) {
  const format = (v) =>
    v.toLocaleString('pl-PL', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) + suffix;
  if (prefersReducedMotion) {
    el.textContent = format(value);
    return;
  }
  const state = { v: 0 };
  el.textContent = format(0);
  gsap.to(state, {
    v: value,
    duration: 1.6,
    ease: 'power2.out',
    scrollTrigger: { trigger: el, start: 'top 85%' },
    onUpdate: () => { el.textContent = format(state.v); },
  });
}
