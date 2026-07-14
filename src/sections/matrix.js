import { drawPath, staggerIn, prefersReducedMotion, gsap } from '../lib/motion.js';
import { svgEl, htmlEl } from '../lib/svg.js';

/**
 * S6 - impact × difficulty matrix (pure SVG scatter), action card on click,
 * owner filter, and the 30/90/180 roadmap drawn on scroll.
 */
export function initMatrix(recData, copy) {
  const matrixBox = document.getElementById('matrix');
  const card = document.getElementById('action-card');
  const filters = document.getElementById('owner-filters');
  const legendBox = document.getElementById('matrix-legend');
  const roadmapCols = document.getElementById('roadmap-cols');
  if (!matrixBox) return;

  const horizonById = Object.fromEntries(recData.horizons.map((h) => [h.id, h]));

  /* ---------- scatter ---------- */

  const W = 720;
  const H = 480;
  const M = { top: 30, right: 26, bottom: 52, left: 56 };
  const plotW = W - M.left - M.right;
  const plotH = H - M.top - M.bottom;

  const xScale = (difficulty) => M.left + ((difficulty - 0.5) / 5) * plotW;
  const yScale = (impact) => M.top + plotH - ((impact - 0.5) / 5) * plotH;

  const svg = svgEl('svg', { viewBox: `0 0 ${W} ${H}`, role: 'img' });
  svg.setAttribute('aria-label', 'Macierz działań: wpływ na widoczność w AI względem trudności wdrożenia');

  // recessive grid
  for (let v = 1; v <= 5; v++) {
    svg.appendChild(svgEl('line', {
      x1: xScale(v), y1: M.top, x2: xScale(v), y2: M.top + plotH,
      stroke: 'rgba(112,32,130,0.08)', 'stroke-width': 1,
    }));
    svg.appendChild(svgEl('line', {
      x1: M.left, y1: yScale(v), x2: M.left + plotW, y2: yScale(v),
      stroke: 'rgba(112,32,130,0.08)', 'stroke-width': 1,
    }));
  }

  // quick-win quadrant tint (high impact, low difficulty = top-left)
  const qw = svgEl('rect', {
    x: M.left, y: M.top,
    width: plotW * 0.42, height: plotH * 0.42,
    fill: 'rgba(241,180,52,0.09)', rx: 8,
  });
  svg.appendChild(qw);
  const qwLabel = svgEl('text', { x: M.left + 12, y: M.top + 22, class: 'quadrant-label' });
  qwLabel.textContent = copy.matrix.quadrantQuickWin;
  svg.appendChild(qwLabel);

  // axes labels
  const xLabel = svgEl('text', { x: M.left + plotW / 2, y: H - 12, 'text-anchor': 'middle', class: 'axis-label' });
  xLabel.textContent = copy.matrix.axisX;
  svg.appendChild(xLabel);
  const yLabel = svgEl('text', {
    x: 18, y: M.top + plotH / 2, class: 'axis-label',
    transform: `rotate(-90 18 ${M.top + plotH / 2})`, 'text-anchor': 'middle',
  });
  yLabel.textContent = copy.matrix.axisY;
  svg.appendChild(yLabel);

  // dots
  const dots = [];
  for (const action of recData.actions) {
    const horizon = horizonById[action.horizon];
    const dot = svgEl('circle', {
      class: 'dot',
      cx: xScale(action.difficulty),
      cy: yScale(action.impact),
      r: action.quickWin ? 11 : 9,
      fill: horizon.color,
      stroke: '#ffffff',
      'stroke-width': 2,
      tabindex: 0,
      role: 'button',
    });
    dot.setAttribute('aria-label', `${action.title}: wpływ ${action.impact} na 5, trudność ${action.difficulty} na 5`);
    dot.dataset.id = action.id;

    const select = () => {
      svg.querySelectorAll('.dot').forEach((d) => d.classList.toggle('is-selected', d === dot));
      renderCard(action);
    };
    dot.addEventListener('click', select);
    dot.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); select(); }
    });

    svg.appendChild(dot);
    dots.push({ dot, action });
  }

  matrixBox.appendChild(svg);

  // legend: horizon colors (identity), quick-win = bigger gold-quadrant dots
  for (const horizon of recData.horizons) {
    const item = htmlEl('span');
    const swatch = htmlEl('i');
    swatch.style.background = horizon.color;
    item.appendChild(swatch);
    item.appendChild(document.createTextNode(`${horizon.label} · ${horizon.name}`));
    legendBox.appendChild(item);
  }

  /* ---------- action card ---------- */

  function renderCard(action) {
    const horizon = horizonById[action.horizon];
    card.innerHTML = '';

    const meta = htmlEl('div', 'action-meta');
    meta.appendChild(htmlEl('span', 'pill pill--horizon', `${horizon.label} · ${horizon.name}`));
    for (const owner of action.owners) meta.appendChild(htmlEl('span', 'pill', owner));

    card.appendChild(htmlEl('h3', '', action.title));
    card.appendChild(meta);
    card.appendChild(htmlEl('p', '', action.summary));

    const why = htmlEl('p', 'action-why');
    why.innerHTML = `<strong>Dlaczego to działa (mechanika AI):</strong> ${action.why}`;
    card.appendChild(why);

    if (!prefersReducedMotion) {
      gsap.from(card.children, { opacity: 0, y: 10, duration: 0.3, stagger: 0.05, ease: 'power2.out' });
    }
  }

  // preselect the first quick win - the "Monday morning" action
  const first = recData.actions.find((a) => a.quickWin) ?? recData.actions[0];
  svg.querySelector(`.dot[data-id="${first.id}"]`)?.classList.add('is-selected');
  renderCard(first);

  /* ---------- owner filter ---------- */

  filters.querySelectorAll('.chip').forEach((btn) => {
    btn.addEventListener('click', () => {
      filters.querySelectorAll('.chip').forEach((c) => c.classList.toggle('is-active', c === btn));
      const owner = btn.dataset.owner;
      for (const { dot, action } of dots) {
        const visible = owner === 'all' || action.owners.includes(owner);
        dot.classList.toggle('is-faded', !visible);
      }
    });
  });

  /* ---------- roadmap ---------- */

  for (const horizon of recData.horizons) {
    const col = htmlEl('div', 'roadmap-col');
    col.appendChild(htmlEl('span', 'roadmap-window', horizon.label));
    col.appendChild(htmlEl('h4', '', horizon.name));
    const list = htmlEl('ul');
    for (const action of recData.actions.filter((a) => a.horizon === horizon.id)) {
      list.appendChild(htmlEl('li', '', action.title));
    }
    col.appendChild(list);
    roadmapCols.appendChild(col);
  }

  const roadmapLine = document.getElementById('roadmap-line');
  if (roadmapLine) {
    drawPath(roadmapLine, {
      trigger: document.getElementById('roadmap'),
      start: 'top 80%',
      end: 'top 35%',
    });
  }
  staggerIn(roadmapCols.querySelectorAll('li'), {
    trigger: roadmapCols,
    y: 16,
    stagger: 0.05,
  });
}
