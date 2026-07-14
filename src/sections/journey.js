import { prefersReducedMotion } from '../lib/motion.js';

/**
 * S1 - journey infographic. The per-step animations are pure CSS keyed off
 * .is-current; JS only:
 *  1. gates the left-to-right entrance behind an IntersectionObserver,
 *  2. auto-cycles the selection step 1 → 2 → 3 → 4 → 1… so each step's
 *     animation plays out, then hands over to the next.
 * Durations match each step's CSS animation cycle, and every animation
 * starts/ends on its idle frame, so the handover never jumps.
 */

// step 1: full 3-logo crossfade (6s loop) · step 2: one magnifier sweep (4s)
// step 3: word pulses incl. 1.05s stagger (~5s) · step 4: check strike + hold
const STEP_DURATIONS = [6000, 4400, 5200, 3200];

export function initJourney() {
  const journey = document.getElementById('journey');
  if (!journey) return;

  journey.dataset.animate = '';

  const observer = new IntersectionObserver((entries) => {
    if (entries.some((entry) => entry.isIntersecting)) {
      observer.disconnect();
      journey.classList.add('is-visible');
      if (!prefersReducedMotion) {
        // let the entrance stagger finish (last step: 0.6s delay + 0.7s run)
        setTimeout(startCycle, 1500);
      }
    }
  }, { threshold: 0.25 });

  observer.observe(journey);

  function startCycle() {
    const steps = [...journey.querySelectorAll('.journey__step')];
    if (steps.length === 0) return;
    journey.classList.add('has-current');
    let index = 0;

    function step() {
      steps.forEach((el, i) => el.classList.toggle('is-current', i === index));
      const duration = STEP_DURATIONS[index] ?? 4000;
      index = (index + 1) % steps.length;
      setTimeout(step, duration);
    }

    step();
  }
}
