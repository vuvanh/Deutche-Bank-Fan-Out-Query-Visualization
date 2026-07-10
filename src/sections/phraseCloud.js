import { gsap, prefersReducedMotion } from '../lib/motion.js';
import { htmlEl } from '../lib/svg.js';

/**
 * S4 — phrase cloud. Font size maps the phrase's real occurrence count in the
 * observed fan-out queries; tone (claim / neutral) maps to color. The filter
 * dims the other tone instead of removing it, so the asymmetry stays visible.
 */
export function initPhraseCloud(phrasesData) {
  const cloud = document.getElementById('cloud');
  const filters = document.getElementById('cloud-filters');
  if (!cloud) return;

  const weights = phrasesData.phrases.map((p) => p.weight);
  const min = Math.min(...weights);
  const max = Math.max(...weights);

  const fontFor = (weight) => {
    const t = max === min ? 1 : (weight - min) / (max - min);
    // sqrt so mid-weight phrases stay readable next to the dominant one
    return 0.9 + Math.sqrt(t) * 2.6; // rem
  };

  // shuffle deterministically so big phrases spread through the cloud
  const phrases = [...phrasesData.phrases];
  for (let i = phrases.length - 1; i > 0; i--) {
    const j = (i * 7 + 3) % (i + 1);
    [phrases[i], phrases[j]] = [phrases[j], phrases[i]];
  }

  for (const phrase of phrases) {
    const span = htmlEl('span', '', phrase.text);
    span.dataset.tone = phrase.tone;
    span.style.fontSize = `${fontFor(phrase.weight).toFixed(2)}rem`;
    span.title = `${phrase.weight} wystąpień w zaobserwowanych zapytaniach fan-out`;
    cloud.appendChild(span);
  }

  filters.querySelectorAll('.chip').forEach((btn) => {
    btn.addEventListener('click', () => {
      filters.querySelectorAll('.chip').forEach((c) => c.classList.toggle('is-active', c === btn));
      const filter = btn.dataset.filter;
      cloud.querySelectorAll('span').forEach((span) => {
        const dim = filter !== 'all' && span.dataset.tone !== filter;
        span.classList.toggle('is-dimmed', dim);
      });
    });
  });

  if (!prefersReducedMotion) {
    gsap.from(cloud.querySelectorAll('span'), {
      opacity: 0,
      y: 18,
      scale: 0.9,
      duration: 0.55,
      stagger: 0.045,
      ease: 'power2.out',
      scrollTrigger: { trigger: cloud, start: 'top 78%' },
      clearProps: 'y,scale,opacity',
    });
  }
}
