import { gsap, prefersReducedMotion } from '../lib/motion.js';

/**
 * S0 — hero. A decorative ChatGPT-style prompt bar types real consumer
 * questions in an endless loop: type → hold → backspace → next phrase.
 */
const TYPE_MS = 60;
const TYPE_JITTER_MS = 45;
const DELETE_MS = 24;
const HOLD_MS = 2200; // pause so the phrase can be read
const GAP_MS = 550; // empty-field pause before the next phrase

export function initHero(copy) {
  const target = document.getElementById('hero-typewriter');
  if (!target) return;

  const phrases = copy.heroPromptPhrases;

  if (prefersReducedMotion) {
    target.textContent = phrases[0]; // static prompt, no typing loop
    return;
  }

  /* staggered text entrance */
  gsap.from('.hero__inner > *', {
    opacity: 0,
    y: 26,
    duration: 0.8,
    stagger: 0.12,
    ease: 'power3.out',
    delay: 0.25,
  });

  let phraseIndex = 0;
  let length = 0;
  let deleting = false;

  const tick = () => {
    const phrase = phrases[phraseIndex];

    if (!deleting) {
      length += 1;
      target.textContent = phrase.slice(0, length);
      if (length === phrase.length) {
        deleting = true;
        setTimeout(tick, HOLD_MS);
      } else {
        setTimeout(tick, TYPE_MS + Math.random() * TYPE_JITTER_MS);
      }
      return;
    }

    length -= 1;
    target.textContent = phrase.slice(0, length);
    if (length === 0) {
      deleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      setTimeout(tick, GAP_MS);
    } else {
      setTimeout(tick, DELETE_MS);
    }
  };

  setTimeout(tick, 1000); // let the entrance animation land first
}
