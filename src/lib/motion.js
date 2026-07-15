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
