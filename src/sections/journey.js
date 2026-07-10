import { staggerIn } from '../lib/motion.js';

/** S1 — journey strip: steps appear in sequence as they scroll in. */
export function initJourney() {
  const journey = document.getElementById('journey');
  if (!journey) return;
  staggerIn(journey.querySelectorAll('.journey__step'), { trigger: journey, stagger: 0.16 });
  staggerIn('.journey-quote', { trigger: '.journey-quote', y: 20 });
}
