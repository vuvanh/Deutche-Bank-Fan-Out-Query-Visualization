import { countUp } from '../lib/motion.js';
import { svgEl, htmlEl } from '../lib/svg.js';

/**
 * S7 — KPI dashboard mock. Every value is illustrative and labelled as such
 * on screen (badge in index.html + per-tile data). Counters animate on enter.
 */
export function initDashboard(kpiData) {
  const kpiRow = document.getElementById('kpi-row');
  const chartBox = document.getElementById('trend-chart');
  const tooltip = document.getElementById('trend-tooltip');
  if (!kpiRow) return;

  for (const kpi of kpiData.kpis) {
    const tile = htmlEl('div', 'kpi-tile');
    tile.appendChild(htmlEl('h4', '', kpi.name));
    tile.appendChild(htmlEl('p', 'kpi-def', kpi.definition));

    const value = htmlEl('div', 'kpi-value');
    const number = htmlEl('span');
    value.appendChild(number);
    if (kpi.unit) {
      const unit = htmlEl('small', '', ` ${kpi.unit}`);
      value.appendChild(unit);
    }
    tile.appendChild(value);
    tile.appendChild(htmlEl('div', 'kpi-delta', `${kpi.delta} · wartość ilustracyjna`));
    kpiRow.appendChild(tile);

    countUp(number, kpi.value, { decimals: kpi.decimals ?? 0 });
  }

  /* ---------- trend line (pure SVG) ---------- */

  const points = kpiData.trend.points;
  const W = 720;
  const H = 240;
  const M = { top: 20, right: 24, bottom: 34, left: 44 };
  const plotW = W - M.left - M.right;
  const plotH = H - M.top - M.bottom;
  const maxVal = Math.max(...points.map((p) => p.value)) * 1.25;

  const x = (i) => M.left + (i / (points.length - 1)) * plotW;
  const y = (v) => M.top + plotH - (v / maxVal) * plotH;

  const svg = svgEl('svg', { viewBox: `0 0 ${W} ${H}`, role: 'img' });
  svg.setAttribute('aria-label', `${kpiData.trend.label}: od ${points[0].value} do ${points[points.length - 1].value} ${kpiData.trend.unit}`);

  // horizontal grid + tick labels
  const gridSteps = 4;
  for (let i = 0; i <= gridSteps; i++) {
    const v = (maxVal / gridSteps) * i;
    svg.appendChild(svgEl('line', {
      x1: M.left, y1: y(v), x2: M.left + plotW, y2: y(v), class: 'grid-line',
    }));
    const tick = svgEl('text', { x: M.left - 8, y: y(v) + 4, 'text-anchor': 'end', class: 'tick-label' });
    tick.textContent = `${Math.round(v)}${kpiData.trend.unit}`;
    svg.appendChild(tick);
  }

  const lineD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${x(i)} ${y(p.value)}`).join(' ');
  svg.appendChild(svgEl('path', {
    class: 'trend-area',
    d: `${lineD} L ${x(points.length - 1)} ${y(0)} L ${x(0)} ${y(0)} Z`,
  }));
  const line = svgEl('path', { class: 'trend-line', d: lineD });
  svg.appendChild(line);

  points.forEach((p, i) => {
    svg.appendChild(svgEl('circle', {
      cx: x(i), cy: y(p.value), r: 4.5,
      fill: '#702082', stroke: '#ffffff', 'stroke-width': 2,
    }));
    const label = svgEl('text', { x: x(i), y: H - 10, 'text-anchor': 'middle', class: 'tick-label' });
    label.textContent = p.month;
    svg.appendChild(label);

    // generous invisible hit target for the tooltip
    const hit = svgEl('circle', { cx: x(i), cy: y(p.value), r: 16, fill: 'transparent' });
    hit.addEventListener('mouseenter', () => {
      tooltip.textContent = `${p.month}: ${p.value}${kpiData.trend.unit} (ilustracyjne)`;
      const rect = chartBox.getBoundingClientRect();
      tooltip.style.left = `${(x(i) / W) * rect.width}px`;
      tooltip.style.top = `${(y(p.value) / H) * rect.height}px`;
      tooltip.classList.add('is-visible');
    });
    hit.addEventListener('mouseleave', () => tooltip.classList.remove('is-visible'));
    svg.appendChild(hit);
  });

  const title = htmlEl('p', 'method-note', kpiData.trend.label);
  chartBox.appendChild(svg);
  chartBox.appendChild(title);
}
