import { gsap, ScrollTrigger, prefersReducedMotion } from '../lib/motion.js';
import { lang, setLang, ui } from '../lib/i18n.js';

/**
 * Sticky nav: narrative progress bar (Dentons arrow traveling along the
 * track), active anchor highlighting and the PL|EN language switch.
 */
export function initNav() {
  const fill = document.getElementById('progress-fill');
  const arrow = document.getElementById('progress-arrow');
  const links = [...document.querySelectorAll('.nav__links a')];

  /* logo = hard reset: reload without the hash, back at the very top */
  document.querySelector('.nav__logo')?.addEventListener('click', (event) => {
    event.preventDefault();
    window.location.replace(window.location.pathname + window.location.search);
  });

  /* language switch: persist choice + reload (hash survives, so the reader
     lands back in the same section, now in the other language) */
  const langSwitch = document.getElementById('lang-switch');
  if (langSwitch) {
    langSwitch.setAttribute('aria-label', ui.switchAria);
    langSwitch.querySelectorAll('.lang-switch__btn').forEach((btn) => {
      const active = btn.dataset.lang === lang;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-pressed', String(active));
      btn.addEventListener('click', () => setLang(btn.dataset.lang));
    });
  }

  /* progress along the whole narrative */
  const update = () => {
    const doc = document.documentElement;
    const max = doc.scrollHeight - window.innerHeight;
    const progress = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
    fill.style.width = `${progress * 100}%`;
    arrow.style.left = `${progress * 100}%`;
  };
  window.addEventListener('scroll', update, { passive: true });
  update();

  /* active anchor */
  const anchorFor = (id) => links.find((a) => a.getAttribute('href') === `#${id}`);
  for (const section of document.querySelectorAll('main section[id]')) {
    const link = anchorFor(section.id);
    if (!link) continue;
    ScrollTrigger.create({
      trigger: section,
      start: 'top 45%',
      end: 'bottom 45%',
      onToggle: (self) => {
        if (self.isActive) {
          links.forEach((a) => a.classList.toggle('is-active', a === link));
        }
      },
    });
  }

  /* nav entrance */
  if (!prefersReducedMotion) {
    gsap.from('.nav', { y: -70, duration: 0.7, ease: 'power3.out', delay: 0.1 });
  }
}
