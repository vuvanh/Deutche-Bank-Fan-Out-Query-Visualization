import { staggerIn } from '../lib/motion.js';
import { htmlEl } from '../lib/svg.js';

/** S5 — engine rule cards with a "for the interested" accordion. */
export function initEngines(enginesData) {
  const grid = document.getElementById('engines');
  if (!grid) return;

  for (const engine of enginesData.engines) {
    const card = htmlEl('article', 'engine-card');

    card.appendChild(htmlEl('h3', '', engine.name));
    card.appendChild(htmlEl('p', 'engine-sub', engine.sub));

    const list = htmlEl('ul');
    for (const point of engine.seeks) list.appendChild(htmlEl('li', '', point));
    card.appendChild(list);

    card.appendChild(htmlEl('p', 'engine-meaning', engine.meaning));

    const details = htmlEl('details');
    const summary = htmlEl('summary', '', 'Dla zainteresowanych');
    details.appendChild(summary);
    details.appendChild(htmlEl('p', '', engine.details));
    card.appendChild(details);

    grid.appendChild(card);
  }

  staggerIn(grid.querySelectorAll('.engine-card'), { trigger: grid, stagger: 0.12 });
}
