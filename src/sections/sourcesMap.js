import { gsap, prefersReducedMotion } from '../lib/motion.js';
import { svgEl, htmlEl } from '../lib/svg.js';

/**
 * S3 — donut infographic of source categories actually retrieved in the
 * research. Slice size = number of unique observed domains; zero/unknown
 * categories get a small visual sliver (chartValue in sources.json) with the
 * real number on the label. Hover on a slice or on the legend explodes the
 * slice, dims the rest and shows details in the donut hole.
 */

const SIZE = 440;
const CX = SIZE / 2;
const CY = SIZE / 2;
const R_OUTER = 168;
const R_INNER = 104;
const PAD_ANGLE = 0.035; // rad gap between slices
const EXPLODE = 14; // px offset of the hovered slice

function polar(r, angle) {
  return [CX + r * Math.cos(angle), CY + r * Math.sin(angle)];
}

function arcPath(r0, r1, a0, a1) {
  const large = a1 - a0 > Math.PI ? 1 : 0;
  const [x0, y0] = polar(r1, a0);
  const [x1, y1] = polar(r1, a1);
  const [x2, y2] = polar(r0, a1);
  const [x3, y3] = polar(r0, a0);
  return [
    `M ${x0.toFixed(2)} ${y0.toFixed(2)}`,
    `A ${r1} ${r1} 0 ${large} 1 ${x1.toFixed(2)} ${y1.toFixed(2)}`,
    `L ${x2.toFixed(2)} ${y2.toFixed(2)}`,
    `A ${r0} ${r0} 0 ${large} 0 ${x3.toFixed(2)} ${y3.toFixed(2)}`,
    'Z',
  ].join(' ');
}

export function initSourcesMap(sourcesData, copy) {
  const container = document.getElementById('donut');
  const centerBox = document.getElementById('donut-center');
  const legend = document.getElementById('donut-legend');
  const note = document.getElementById('donut-note');
  const domainsPanel = document.getElementById('donut-domains');
  if (!container || !centerBox || !legend) return;

  note.textContent = sourcesData.methodNote;

  const categories = sourcesData.categories;
  const total = categories.reduce((sum, c) => sum + c.chartValue, 0);

  /* ---------- build the SVG ---------- */

  const svg = svgEl('svg', {
    viewBox: `0 0 ${SIZE} ${SIZE}`,
    role: 'img',
    'aria-label': 'Wykres kołowy: kategorie domen pobranych przez modele AI',
  });

  const slicesGroup = svgEl('g', { class: 'donut__slices' });
  const labelsGroup = svgEl('g', { class: 'donut__labels' });
  svg.appendChild(slicesGroup);
  svg.appendChild(labelsGroup);
  container.prepend(svg);

  const slices = [];
  let angle = -Math.PI / 2; // start at 12 o'clock

  for (const cat of categories) {
    const sweep = (cat.chartValue / total) * Math.PI * 2;
    const a0 = angle + PAD_ANGLE / 2;
    const a1 = Math.max(angle + sweep - PAD_ANGLE / 2, a0 + 0.02);
    const mid = (a0 + a1) / 2;
    angle += sweep;

    const path = svgEl('path', {
      class: 'donut-slice',
      d: arcPath(R_INNER, R_OUTER, a0, a1),
      fill: cat.color,
      tabindex: '0',
      'aria-label': `${cat.label}: ${cat.countLabel}`,
    });
    path.dataset.category = cat.id;
    // hover offset along the slice's mid-angle, consumed by CSS
    path.style.setProperty('--ex', `${(Math.cos(mid) * EXPLODE).toFixed(2)}px`);
    path.style.setProperty('--ey', `${(Math.sin(mid) * EXPLODE).toFixed(2)}px`);
    slicesGroup.appendChild(path);

    // count label inside slices wide enough to hold it
    if (a1 - a0 > 0.4) {
      const [lx, ly] = polar((R_INNER + R_OUTER) / 2, mid);
      const label = svgEl('text', {
        class: 'donut-slice-label',
        x: lx.toFixed(2),
        y: ly.toFixed(2),
        fill: cat.textColor,
        'text-anchor': 'middle',
        'dominant-baseline': 'central',
      });
      label.textContent = String(cat.domains.length);
      labelsGroup.appendChild(label);
    }

    // explicit "0" callout outside the sliver (the whole point of the chart)
    if (cat.calloutLabel != null) {
      const [sx, sy] = polar(R_OUTER + 4, mid);
      const [ex, ey] = polar(R_OUTER + 26, mid);
      const line = svgEl('line', {
        class: 'donut-callout-line',
        x1: sx.toFixed(2), y1: sy.toFixed(2),
        x2: ex.toFixed(2), y2: ey.toFixed(2),
        stroke: cat.color,
      });
      const [tx, ty] = polar(R_OUTER + 42, mid);
      const text = svgEl('text', {
        class: 'donut-callout-text',
        x: tx.toFixed(2),
        y: ty.toFixed(2),
        fill: cat.color,
        'text-anchor': 'middle',
        'dominant-baseline': 'central',
      });
      text.textContent = cat.calloutLabel;
      labelsGroup.appendChild(line);
      labelsGroup.appendChild(text);
    }

    slices.push({ cat, path });
  }

  /* ---------- donut hole: default state + dynamic tooltip ---------- */

  function renderCenterDefault() {
    centerBox.innerHTML = '';
    const big = htmlEl('span', 'donut-center__value', String(
      categories.reduce((sum, c) => sum + c.domains.length, 0),
    ));
    const caption = htmlEl('span', 'donut-center__caption',
      'unikalnych domen pobranych przez modele');
    const hint = htmlEl('span', 'donut-center__hint', 'najedź na wykres');
    centerBox.append(big, caption, hint);
  }

  function renderCenterFor(cat) {
    centerBox.innerHTML = '';
    const name = htmlEl('span', 'donut-center__name', cat.label);
    name.style.color = cat.color;
    const value = htmlEl('span', 'donut-center__value donut-center__value--sm',
      cat.countLabel);
    centerBox.append(name, value);

    const detail = cat.id === 'bank'
      ? (cat.emptyMessage ?? copy.treemap.bankClickBody)
      : cat.status === 'DO_UZUPELNIENIA'
        ? (cat.note ?? copy.treemap.tooltipEmpty)
        : null;
    if (detail) centerBox.appendChild(htmlEl('span', 'donut-center__note', detail));
  }

  renderCenterDefault();

  /* ---------- legend ---------- */

  const legendItems = new Map();

  for (const { cat } of slices) {
    const item = htmlEl('li', 'donut-legend__item');
    item.dataset.category = cat.id;
    item.tabIndex = 0;

    const swatch = htmlEl('i');
    swatch.style.background = cat.color;
    const label = htmlEl('span', 'donut-legend__label', cat.label);
    const count = htmlEl('span', 'donut-legend__count', cat.countLabel);
    item.append(swatch, label, count);
    legend.appendChild(item);
    legendItems.set(cat.id, item);
  }

  /* ---------- domain panel below the chart ---------- */

  let panelCategory = null;

  function renderDomainsPanel(cat) {
    if (!domainsPanel || panelCategory === cat.id) return;
    panelCategory = cat.id;
    const firstReveal = domainsPanel.hidden;
    domainsPanel.hidden = false;
    domainsPanel.innerHTML = '';
    domainsPanel.style.setProperty('--cat-color', cat.color);

    const head = htmlEl('div', 'donut-domains__head');
    const swatch = htmlEl('i');
    swatch.style.background = cat.color;
    const title = htmlEl('h3', 'donut-domains__title', cat.label);
    const count = htmlEl('span', 'donut-domains__count', cat.countLabel);
    head.append(swatch, title, count);
    domainsPanel.appendChild(head);

    let items;
    if (cat.domains.length > 0) {
      const list = htmlEl('ul', 'donut-domains__list');
      items = cat.domains.map((domain) => {
        const item = htmlEl('li');
        const chip = htmlEl('a', 'donut-domains__chip', domain);
        chip.href = `https://${domain}`;
        chip.target = '_blank';
        chip.rel = 'noopener noreferrer';
        item.appendChild(chip);
        list.appendChild(item);
        return item;
      });
      domainsPanel.appendChild(list);
    } else {
      const message = cat.id === 'bank'
        ? (cat.emptyMessage ?? copy.treemap.bankClickBody)
        : (cat.note ?? copy.treemap.tooltipEmpty);
      const empty = htmlEl('p', 'donut-domains__empty', message);
      domainsPanel.appendChild(empty);
      items = [empty];
    }

    if (!prefersReducedMotion) {
      if (firstReveal) {
        gsap.from(domainsPanel, {
          opacity: 0, y: 16, duration: 0.4, ease: 'power2.out',
          clearProps: 'transform,opacity',
        });
      }
      gsap.from(items, {
        opacity: 0, y: 12, scale: 0.88,
        duration: 0.4, stagger: 0.035, ease: 'back.out(1.5)',
        clearProps: 'transform,opacity',
      });
    }
  }

  /* ---------- shared highlight (chart ⇄ legend) ---------- */

  function highlight(id) {
    container.classList.add('has-hover');
    for (const { cat, path } of slices) {
      path.classList.toggle('is-active', cat.id === id);
    }
    for (const [catId, item] of legendItems) {
      item.classList.toggle('is-active', catId === id);
    }
    const active = slices.find((s) => s.cat.id === id);
    if (active) {
      renderCenterFor(active.cat);
      renderDomainsPanel(active.cat);
    }
  }

  function clearHighlight() {
    container.classList.remove('has-hover');
    for (const { path } of slices) path.classList.remove('is-active');
    for (const item of legendItems.values()) item.classList.remove('is-active');
    renderCenterDefault();
  }

  for (const { cat, path } of slices) {
    path.addEventListener('mouseenter', () => highlight(cat.id));
    path.addEventListener('mouseleave', clearHighlight);
    path.addEventListener('focus', () => highlight(cat.id));
    path.addEventListener('blur', clearHighlight);
  }

  for (const [catId, item] of legendItems) {
    item.addEventListener('mouseenter', () => highlight(catId));
    item.addEventListener('mouseleave', clearHighlight);
    item.addEventListener('focus', () => highlight(catId));
    item.addEventListener('blur', clearHighlight);
  }

  /* ---------- entrance animation ---------- */

  if (!prefersReducedMotion) {
    const tl = gsap.timeline({
      scrollTrigger: { trigger: container, start: 'top 72%' },
    });

    tl.from(slicesGroup, {
      rotation: -70,
      svgOrigin: `${CX} ${CY}`,
      duration: 1,
      ease: 'power3.out',
      clearProps: 'transform',
    }, 0);

    tl.from(slicesGroup.querySelectorAll('.donut-slice'), {
      scale: 0,
      opacity: 0,
      svgOrigin: `${CX} ${CY}`,
      duration: 0.7,
      stagger: 0.11,
      ease: 'back.out(1.4)',
      clearProps: 'transform,opacity',
    }, 0);

    tl.from(labelsGroup.children, {
      opacity: 0,
      y: 12,
      duration: 0.45,
      stagger: 0.08,
      ease: 'power2.out',
      clearProps: 'transform,opacity',
    }, 0.55);

    tl.from(centerBox, {
      opacity: 0,
      scale: 0.85,
      duration: 0.5,
      ease: 'power2.out',
      clearProps: 'transform,opacity',
    }, 0.4);

    tl.from(legend.children, {
      opacity: 0,
      y: 18,
      duration: 0.5,
      stagger: 0.08,
      ease: 'power3.out',
      clearProps: 'transform,opacity',
    }, 0.45);
  }
}
