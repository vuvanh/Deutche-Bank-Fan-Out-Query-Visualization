import { gsap, prefersReducedMotion } from '../lib/motion.js';
import { htmlEl } from '../lib/svg.js';

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
const ARROW = 'M5 12h14M13 6l6 6-6 6';

/**
 * S5 - 3-column engine infographic: logo medallion overlapping the card,
 * accent-colored check lists, a highlighted "Dla banku" key takeaway and a
 * pill-button expander. Hover focus (scale + dim siblings) is pure CSS.
 */
export function initEngines(enginesData) {
  const grid = document.getElementById('engines');
  if (!grid) return;

  for (const engine of enginesData.engines) {
    const card = htmlEl('article', 'engine-card');
    card.style.setProperty('--accent', engine.accent);
    card.style.setProperty('--accent-soft', engine.accentSoft);

    const medallion = htmlEl('span', 'engine-card__logo');
    const img = document.createElement('img');
    img.src = engine.logo;
    img.alt = '';
    img.loading = 'lazy';
    medallion.appendChild(img);
    card.appendChild(medallion);

    card.appendChild(htmlEl('h3', '', engine.name));
    card.appendChild(htmlEl('p', 'engine-sub', engine.sub));

    const list = htmlEl('ul', 'engine-list');
    for (const point of engine.seeks) {
      const item = htmlEl('li');
      item.appendChild(icon('engine-list__check', CHECK));
      item.appendChild(htmlEl('span', '', point));
      list.appendChild(item);
    }
    card.appendChild(list);

    const takeaway = htmlEl('div', 'engine-meaning');
    const takeawayHead = htmlEl('span', 'engine-meaning__label');
    takeawayHead.appendChild(icon('engine-meaning__icon', BULB));
    takeawayHead.appendChild(document.createTextNode('Dla banku'));
    takeaway.appendChild(takeawayHead);
    takeaway.appendChild(htmlEl('p', '', engine.meaning.replace(/^Dla banku:\s*/, '')));
    card.appendChild(takeaway);

    const details = htmlEl('details', 'engine-more');
    const summary = htmlEl('summary');
    summary.appendChild(htmlEl('span', '', 'Dla zainteresowanych'));
    summary.appendChild(icon('engine-more__arrow', ARROW));
    details.appendChild(summary);
    details.appendChild(htmlEl('span', 'engine-more__label', engine.detailsLabel));
    const factList = htmlEl('ul', 'engine-more__list');
    for (const fact of engine.details) factList.appendChild(htmlEl('li', '', fact));
    details.appendChild(factList);
    card.appendChild(details);

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
      // inline transform/opacity must not linger - CSS hover scale needs them
      clearProps: 'transform,opacity',
    });
  }
}
