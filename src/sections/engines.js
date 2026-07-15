import { gsap, prefersReducedMotion } from '../lib/motion.js';
import { htmlEl } from '../lib/svg.js';
import { t, ui } from '../lib/i18n.js';

const SVG_NS = 'http://www.w3.org/2000/svg';

/** Inline SVG from a path definition, sized for list/label icons. */
function icon(className, pathD, viewBox = '0 0 24 24') {
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('viewBox', viewBox);
  svg.setAttribute('fill', 'none');
  svg.setAttribute('stroke', 'currentColor');
  svg.setAttribute('stroke-width', '2.4');
  svg.setAttribute('stroke-linecap', 'round');
  svg.setAttribute('stroke-linejoin', 'round');
  svg.setAttribute('aria-hidden', 'true');
  if (className) svg.setAttribute('class', className);
  const path = document.createElementNS(SVG_NS, 'path');
  path.setAttribute('d', pathD);
  svg.appendChild(path);
  return svg;
}

const CHECK = 'M4 12.5l5 5L20 6.5';
const BULB = 'M9 18h6M10 21h4M12 3a6 6 0 0 0-4 10.5c.8.7 1 1.5 1 2.5h6c0-1 .2-1.8 1-2.5A6 6 0 0 0 12 3z';
const EYE = 'M2.5 12C5.4 6.8 8.6 4.5 12 4.5s6.6 2.3 9.5 7.5c-2.9 5.2-6.1 7.5-9.5 7.5S5.4 17.2 2.5 12z M12 12m-3.1 0a3.1 3.1 0 1 0 6.2 0a3.1 3.1 0 1 0 -6.2 0';
const CHEVRON = 'M6 9.5l6 6 6-6';

/**
 * S5 - 3-column engine infographic. Each card is a clearly sectioned fact
 * sheet: flat logo + name header, a labelled check list of ranking signals,
 * the "Dla banku" takeaway with a pulsing bulb, and a "Dla zainteresowanych"
 * expander animated via the grid-rows trick so opening one card never
 * stretches its siblings (the grid is align-items: start).
 */
export function initEngines(enginesData) {
  const grid = document.getElementById('engines');
  if (!grid) return;

  for (const engine of enginesData.engines) {
    const card = htmlEl('article', 'engine-card');
    card.style.setProperty('--accent', engine.accent);
    card.style.setProperty('--accent-soft', engine.accentSoft);

    const head = htmlEl('header', 'engine-card__head');
    const logo = htmlEl('span', 'engine-card__logo');
    const img = document.createElement('img');
    img.src = engine.logo;
    img.alt = '';
    img.loading = 'lazy';
    logo.appendChild(img);
    const headText = htmlEl('div', 'engine-card__head-text');
    headText.appendChild(htmlEl('h3', '', engine.name));
    headText.appendChild(htmlEl('p', 'engine-sub', t(engine.sub)));
    head.append(logo, headText);
    card.appendChild(head);

    const seeksLabel = htmlEl('span', 'engine-card__label');
    seeksLabel.appendChild(icon('engine-card__label-icon', EYE));
    seeksLabel.appendChild(document.createTextNode(ui.engineSeeks));
    card.appendChild(seeksLabel);

    const list = htmlEl('ul', 'engine-list');
    for (const point of t(engine.seeks)) {
      const item = htmlEl('li');
      item.appendChild(icon('engine-list__check', CHECK));
      item.appendChild(htmlEl('span', '', point));
      list.appendChild(item);
    }
    card.appendChild(list);

    const takeaway = htmlEl('div', 'engine-meaning');
    const bulb = htmlEl('span', 'engine-meaning__bulb');
    bulb.appendChild(icon('engine-meaning__icon', BULB));
    const takeawayBody = htmlEl('div', 'engine-meaning__body');
    takeawayBody.appendChild(htmlEl('span', 'engine-meaning__label', ui.engineForBank));
    takeawayBody.appendChild(htmlEl('p', '',
      t(engine.meaning).replace(/^(Dla banku|For the bank):\s*/, '')));
    takeaway.append(bulb, takeawayBody);
    card.appendChild(takeaway);

    const more = htmlEl('div', 'engine-more');
    const toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'engine-more__toggle';
    toggle.setAttribute('aria-expanded', 'false');
    toggle.appendChild(htmlEl('span', '', ui.engineMore));
    toggle.appendChild(icon('engine-more__arrow', CHEVRON));
    const body = htmlEl('div', 'engine-more__body');
    const inner = htmlEl('div', 'engine-more__inner');
    inner.appendChild(htmlEl('span', 'engine-more__label', t(engine.detailsLabel)));
    const factList = htmlEl('ul', 'engine-more__list');
    for (const fact of t(engine.details)) factList.appendChild(htmlEl('li', '', fact));
    inner.appendChild(factList);
    body.appendChild(inner);
    toggle.addEventListener('click', () => {
      const open = more.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
    });
    more.append(toggle, body);
    card.appendChild(more);

    grid.appendChild(card);
  }

  if (!prefersReducedMotion) {
    gsap.from(grid.querySelectorAll('.engine-card'), {
      opacity: 0,
      y: 28,
      duration: 0.7,
      ease: 'power3.out',
      stagger: 0.12,
      scrollTrigger: { trigger: grid, start: 'top 78%' },
      // inline transform/opacity must not linger - CSS hover lift needs them
      clearProps: 'transform,opacity',
    });
  }
}
