import { hierarchy, treemap, treemapSquarify } from 'd3-hierarchy';
import { gsap, prefersReducedMotion } from '../lib/motion.js';
import { htmlEl } from '../lib/svg.js';

/**
 * S3 — treemap of source categories actually retrieved in the research.
 * Tile area = number of unique observed domains (real, sample-based).
 * Percent shares are deliberately absent (DO_UZUPELNIENIA).
 */
export function initSourcesMap(sourcesData, copy) {
  const container = document.getElementById('treemap');
  const tooltip = document.getElementById('treemap-tooltip');
  const legend = document.getElementById('treemap-legend');
  const note = document.getElementById('treemap-note');
  if (!container) return;

  note.textContent = sourcesData.methodNote;

  for (const cat of sourcesData.categories) {
    const item = htmlEl('span');
    const swatch = htmlEl('i');
    swatch.style.background = cat.color;
    item.appendChild(swatch);
    item.appendChild(document.createTextNode(cat.label));
    legend.appendChild(item);
  }

  function layout() {
    container.innerHTML = '';
    const { width } = container.getBoundingClientRect();
    const height = container.getBoundingClientRect().height || 520;

    const root = hierarchy({
      children: sourcesData.categories.map((cat) => ({
        ...cat,
        // zero-domain categories (bank, fora) get a small fixed display area so
        // their absence is visible; the on-tile count shows the real number.
        value: Math.max(cat.domains.length, 1.6),
      })),
    })
      .sum((d) => d.value ?? 0)
      .sort((a, b) => b.value - a.value);

    treemap().tile(treemapSquarify).size([width, height]).paddingInner(0)(root);

    for (const leaf of root.leaves()) {
      const cat = leaf.data;
      const tile = htmlEl('button', 'treemap__tile');
      tile.type = 'button';
      tile.style.left = `${leaf.x0}px`;
      tile.style.top = `${leaf.y0}px`;
      tile.style.width = `${leaf.x1 - leaf.x0}px`;
      tile.style.height = `${leaf.y1 - leaf.y0}px`;
      tile.style.background = cat.color;
      tile.style.color = cat.textColor;
      tile.dataset.category = cat.id;

      const title = htmlEl('h4', '', cat.label);
      const count = htmlEl('span', 'count',
        cat.status === 'DO_UZUPELNIENIA'
          ? 'do uzupełnienia'
          : `${cat.domains.length} ${domainsWord(cat.domains.length)}`);
      tile.appendChild(title);
      tile.appendChild(count);

      tile.addEventListener('mouseenter', (e) => showTooltip(cat, e));
      tile.addEventListener('mousemove', (e) => moveTooltip(e));
      tile.addEventListener('mouseleave', hideTooltip);
      tile.addEventListener('focus', (e) => showTooltip(cat, e));
      tile.addEventListener('blur', hideTooltip);
      tile.addEventListener('click', (e) => showTooltip(cat, e, true));

      container.appendChild(tile);
    }

    if (!prefersReducedMotion) {
      gsap.from(container.querySelectorAll('.treemap__tile'), {
        opacity: 0,
        scale: 0.92,
        duration: 0.5,
        stagger: 0.07,
        ease: 'power2.out',
        scrollTrigger: { trigger: container, start: 'top 75%' },
        clearProps: 'scale,opacity',
      });
    }
  }

  function domainsWord(n) {
    if (n === 1) return 'domena';
    const mod10 = n % 10;
    const mod100 = n % 100;
    if (mod10 >= 2 && mod10 <= 4 && !(mod100 >= 12 && mod100 <= 14)) return 'domeny';
    return 'domen';
  }

  function showTooltip(cat, event) {
    tooltip.innerHTML = '';
    const heading = htmlEl('h5', '', cat.label);
    tooltip.appendChild(heading);

    if (cat.id === 'bank') {
      const strong = htmlEl('p');
      strong.innerHTML = `<strong>${copy.treemap.bankClickTitle}</strong>`;
      strong.style.margin = '0 0 4px';
      const body = htmlEl('p', '', cat.emptyMessage ?? copy.treemap.bankClickBody);
      body.style.margin = '0';
      tooltip.appendChild(strong);
      tooltip.appendChild(body);
    } else if (cat.domains.length === 0) {
      const body = htmlEl('p', '', cat.note ?? copy.treemap.tooltipEmpty);
      body.style.margin = '0';
      tooltip.appendChild(body);
    } else {
      const list = htmlEl('ul');
      const sample = cat.domains.slice(0, 8);
      for (const domain of sample) list.appendChild(htmlEl('li', '', domain));
      if (cat.domains.length > sample.length) {
        list.appendChild(htmlEl('li', '', `… i ${cat.domains.length - sample.length} więcej`));
      }
      tooltip.appendChild(list);
    }
    tooltip.classList.add('is-visible');
    moveTooltip(event);
  }

  function moveTooltip(event) {
    const wrapRect = container.parentElement.getBoundingClientRect();
    const x = (event.clientX ?? wrapRect.left + 40) - wrapRect.left;
    const y = (event.clientY ?? wrapRect.top + 40) - wrapRect.top;
    const clampedX = Math.min(Math.max(x + 16, 10), wrapRect.width - 330);
    tooltip.style.left = `${clampedX}px`;
    tooltip.style.top = `${y + 18}px`;
  }

  function hideTooltip() {
    tooltip.classList.remove('is-visible');
  }

  layout();

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(layout, 200);
  });
}
