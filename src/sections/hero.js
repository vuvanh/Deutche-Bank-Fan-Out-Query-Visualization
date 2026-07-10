import { gsap, prefersReducedMotion } from '../lib/motion.js';
import { htmlEl } from '../lib/svg.js';

/**
 * S0 — hero. Query phrases drift through the gradient like particles: the
 * literal "stream of questions" flowing toward AI, not decoration.
 */
export function initHero(copy) {
  const stream = document.getElementById('hero-stream');
  if (!stream) return;

  const phrases = copy.heroStreamPhrases;

  if (prefersReducedMotion) return; // static gradient is enough without motion

  phrases.forEach((text, i) => {
    const span = htmlEl('span', '', text);
    const lane = (i + 0.5) / phrases.length; // vertical lane
    span.style.top = `${(lane * 92 + 4).toFixed(1)}%`;
    stream.appendChild(span);

    const duration = 26 + (i % 5) * 7;
    const fromX = -40 - (i % 3) * 20; // vw offscreen left
    gsap.fromTo(
      span,
      { x: `${fromX}vw` },
      {
        x: '110vw',
        duration,
        ease: 'none',
        repeat: -1,
        delay: -(duration * ((i * 0.37) % 1)), // desynchronised start positions
      },
    );
  });

  /* staggered text entrance */
  gsap.from('.hero__inner > *', {
    opacity: 0,
    y: 26,
    duration: 0.8,
    stagger: 0.12,
    ease: 'power3.out',
    delay: 0.25,
  });
}
