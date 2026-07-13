/**
 * S1 — journey infographic. The looping per-step animations are pure CSS;
 * JS only gates the left-to-right entrance (CSS keyframes + delays) behind
 * an IntersectionObserver so it plays when the section scrolls into view.
 * The [data-animate] hook is added here, so without JS nothing is hidden.
 */
export function initJourney() {
  const journey = document.getElementById('journey');
  if (!journey) return;

  journey.dataset.animate = '';

  const observer = new IntersectionObserver((entries) => {
    if (entries.some((entry) => entry.isIntersecting)) {
      journey.classList.add('is-visible');
      observer.disconnect();
    }
  }, { threshold: 0.25 });

  observer.observe(journey);
}
