import { gsap, prefersReducedMotion } from '../lib/motion.js';
import { htmlEl } from '../lib/svg.js';

const SVG_NS = 'http://www.w3.org/2000/svg';

/* one glyph per owner so the department reads at a glance */
const OWNER_ICONS = {
  IT: 'M16 18l6-6-6-6M8 6l-6 6 6 6',
  Content: 'M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z',
  PR: 'M3 11l18-5v12L3 13v-2zM11.6 16.8a3 3 0 1 1-5.8-1.6',
  Legal: 'M12 3v18M7 21h10M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2M5 7l-3 8c.87.65 1.92 1 3 1s2.13-.35 3-1l-3-8zM19 7l-3 8c.87.65 1.92 1 3 1s2.13-.35 3-1l-3-8z',
};

function ownerIcon(owner) {
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('fill', 'none');
  svg.setAttribute('stroke', 'currentColor');
  svg.setAttribute('stroke-width', '2.2');
  svg.setAttribute('stroke-linecap', 'round');
  svg.setAttribute('stroke-linejoin', 'round');
  svg.setAttribute('class', 'owner-glyph');
  svg.setAttribute('aria-hidden', 'true');
  const path = document.createElementNS(SVG_NS, 'path');
  path.setAttribute('d', OWNER_ICONS[owner] ?? '');
  svg.appendChild(path);
  return svg;
}

/**
 * S6 - recommendations as an asymmetric bento grid. Card size = priority
 * (quick wins get the widest tiles), horizon (30/90/180) shows as a badge
 * plus a soft color glow. Hovering a card lifts it and unfolds the hidden
 * description + "why it works" panel; the owner filter mutes non-matching
 * cards (scale down, grayscale, fade) instead of removing them, so the grid
 * composition survives. GSAP drives the staggered scroll-in entrance.
 */
export function initBento(recData) {
  const grid = document.getElementById('bento');
  const filters = document.getElementById('owner-filters');
  if (!grid) return;

  const horizonById = Object.fromEntries(recData.horizons.map((h) => [h.id, h]));
  const cards = [];

  /* ---------- build cards ---------- */

  for (const action of recData.actions) {
    const horizon = horizonById[action.horizon];
    const card = htmlEl('article', 'bento-card');
    card.tabIndex = 0; // keyboard: reveal via :focus-within
    if (action.quickWin) {
      card.classList.add(action.impact >= 5 ? 'bento-card--hero' : 'bento-card--wide');
    }
    card.style.setProperty('--h-color', horizon.color);

    const head = htmlEl('div', 'bento-card__head');
    head.appendChild(htmlEl('span', 'bento-badge bento-badge--horizon', horizon.label));
    if (action.quickWin) {
      head.appendChild(htmlEl('span', 'bento-badge bento-badge--qw', 'Quick win'));
    }
    card.appendChild(head);

    card.appendChild(htmlEl('h3', 'bento-card__title', action.title));

    const tags = htmlEl('div', 'bento-card__tags');
    for (const owner of action.owners) {
      const tag = htmlEl('span', 'bento-tag');
      tag.appendChild(ownerIcon(owner));
      tag.appendChild(document.createTextNode(owner));
      tags.appendChild(tag);
    }
    card.appendChild(tags);

    // hidden part: unfolds on hover/focus (grid-template-rows 0fr -> 1fr)
    const reveal = htmlEl('div', 'bento-card__reveal');
    const inner = htmlEl('div', 'bento-card__reveal-inner');
    inner.appendChild(htmlEl('p', 'bento-card__summary', action.summary));
    const why = htmlEl('div', 'bento-card__why');
    why.appendChild(htmlEl('strong', '', 'Dlaczego to działa (mechanika AI)'));
    why.appendChild(htmlEl('p', '', action.why));
    inner.appendChild(why);
    reveal.appendChild(inner);
    card.appendChild(reveal);

    grid.appendChild(card);
    cards.push({ el: card, owners: action.owners });
  }

  /* ---------- magic filtering: mute instead of remove ---------- */

  function applyFilter(owner) {
    for (const { el, owners } of cards) {
      const match = owner === 'all' || owners.includes(owner);
      el.classList.toggle('is-muted', !match && owner !== 'all');
      el.classList.toggle('is-focus', match && owner !== 'all');
    }
  }

  filters?.querySelectorAll('.chip').forEach((chip) => {
    if (OWNER_ICONS[chip.dataset.owner]) chip.prepend(ownerIcon(chip.dataset.owner));
    chip.addEventListener('click', () => {
      filters.querySelectorAll('.chip').forEach((c) => c.classList.toggle('is-active', c === chip));
      applyFilter(chip.dataset.owner);
    });
  });

  /* ---------- staggered scroll-in (GSAP) ---------- */

  if (!prefersReducedMotion) {
    gsap.from(cards.map((c) => c.el), {
      opacity: 0,
      y: 34,
      scale: 0.96,
      duration: 0.65,
      ease: 'power3.out',
      stagger: { each: 0.07, from: 'start' },
      scrollTrigger: { trigger: grid, start: 'top 80%' },
      // hover/filter transforms live in CSS - inline values must not linger
      clearProps: 'transform,opacity',
    });
  }
}
