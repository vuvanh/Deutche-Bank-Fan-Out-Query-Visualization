import { gsap, prefersReducedMotion } from '../lib/motion.js';
import { htmlEl } from '../lib/svg.js';
import { t, ui, formatRating } from '../lib/i18n.js';

const SVG_NS = 'http://www.w3.org/2000/svg';

/* one glyph per owner so the department reads at a glance */
const OWNER_ICONS = {
  IT: 'M16 18l6-6-6-6M8 6l-6 6 6 6',
  Content: 'M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z',
  PR: 'M3 11l18-5v12L3 13v-2zM11.6 16.8a3 3 0 1 1-5.8-1.6',
  Legal: 'M12 3v18M7 21h10M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2M5 7l-3 8c.87.65 1.92 1 3 1s2.13-.35 3-1l-3-8zM19 7l-3 8c.87.65 1.92 1 3 1s2.13-.35 3-1l-3-8z',
};

/**
 * Duotone action icons: `tone` is the soft fill layer (horizon-tinted),
 * `line` the stroke layer drawn on top. One icon per action id.
 */
const ACTION_ICONS = {
  'robots-txt': {
    tone: 'M12 3l7 2.6v4.9c0 4.4-2.9 8-7 9.5-4.1-1.5-7-5.1-7-9.5V5.6L12 3z',
    line: ['M12 3l7 2.6v4.9c0 4.4-2.9 8-7 9.5-4.1-1.5-7-5.1-7-9.5V5.6L12 3z', 'M8.8 11.8l2.2 2.2 4.2-4.8'],
  },
  'llms-txt': {
    tone: 'M6 3h8l4 4v14H6z',
    line: ['M6 3h8l4 4v14H6V3z', 'M14 3v4h4', 'M9 12.5h6', 'M9 16h6'],
  },
  'explainer-eur-chf': {
    tone: 'M4.5 10.5H10V20H4.5z',
    line: ['M4.5 10.5H10V20H4.5z', 'M14 5.5h5.5V20H14z', 'M3 20h18'],
  },
  'faq-bluf': {
    tone: 'M4 4h16v12h-11l-5 4V4z',
    line: ['M4 4h16v12h-11l-5 4V4z', 'M8 8.5h8', 'M8 11.8h5'],
  },
  'monitoring-tools': {
    tone: 'M3 5h18v12H3z',
    line: ['M3 5h18v12H3V5z', 'M6 11.5h2.6l1.7-3 2.6 5.4 1.6-2.4H18', 'M9 21h6'],
  },
  'benchmark-prompts': {
    tone: 'M12 5a7 7 0 1 1 0 14 7 7 0 0 1 0-14z',
    line: ['M12 5a7 7 0 1 1 0 14 7 7 0 0 1 0-14z', 'M12 9.4a2.6 2.6 0 1 1 0 5.2 2.6 2.6 0 0 1 0-5.2z', 'M12 2.5V5', 'M12 19v2.5', 'M2.5 12H5', 'M19 12h2.5'],
  },
  'content-hub': {
    tone: 'M12 8.8a3.2 3.2 0 1 1 0 6.4 3.2 3.2 0 0 1 0-6.4z',
    line: ['M12 8.8a3.2 3.2 0 1 1 0 6.4 3.2 3.2 0 0 1 0-6.4z', 'M5 4.5a1.7 1.7 0 1 1 0 3.4 1.7 1.7 0 0 1 0-3.4z', 'M19 4.5a1.7 1.7 0 1 1 0 3.4 1.7 1.7 0 0 1 0-3.4z', 'M5 16.1a1.7 1.7 0 1 1 0 3.4 1.7 1.7 0 0 1 0-3.4z', 'M19 16.1a1.7 1.7 0 1 1 0 3.4 1.7 1.7 0 0 1 0-3.4z', 'M6.3 7.1l3.3 2.9M17.7 7.1l-3.3 2.9M6.3 16.9l3.3-2.9M17.7 16.9l-3.3-2.9'],
  },
  'schema-claimreview': {
    tone: 'M4 4.5h16v15H4z',
    line: ['M4 4.5h16v15H4v-15z', 'M9.2 9.5L6.7 12l2.5 2.5', 'M14.8 9.5l2.5 2.5-2.5 2.5'],
  },
  'digital-pr': {
    tone: 'M14.5 4.5v15L5 15.4V8.6l9.5-4.1z',
    line: ['M14.5 4.5v15L5 15.4V8.6l9.5-4.1z', 'M17.5 9.2a4.2 4.2 0 0 1 0 5.6', 'M7.4 16.4V20'],
  },
  'eeat-authorship': {
    tone: 'M4 5h16v14H4z',
    line: ['M4 5h16v14H4V5z', 'M8.7 8.8a2 2 0 1 1 0 4 2 2 0 0 1 0-4z', 'M5.9 16c.7-1.7 4.9-1.7 5.6 0', 'M14 9.5h4', 'M14 12.5h4', 'M14 15.5h3'],
  },
  'risk-checklist': {
    tone: 'M5 3.5h14v17H5z',
    line: ['M5 3.5h14v17H5v-17z', 'M8.3 8l1.2 1.2 2.2-2.5', 'M14 8.2h2.5', 'M8.3 13l1.2 1.2 2.2-2.5', 'M14 13.2h2.5', 'M8.3 17.3h8.2'],
  },
  'myths-facts': {
    tone: 'M12 3.5a8.5 8.5 0 0 1 0 17z',
    line: ['M12 3.5a8.5 8.5 0 1 1 0 17 8.5 8.5 0 0 1 0-17z', 'M12 3.5v17', 'M5.7 11.2l1.7 1.7 2.4-2.8', 'M15 10l3 3M18 10l-3 3'],
  },
  'ssr-lcp': {
    tone: 'M4 17.5a8 8 0 0 1 16 0z',
    line: ['M4 17.5a8 8 0 0 1 16 0', 'M12 17.5l3.6-5', 'M12 9.5v-1', 'M6.3 12.2l.9.6', 'M17.7 12.2l-.9.6'],
  },
  'white-paper': {
    tone: 'M6 3h12v18H6z',
    line: ['M6 3h12v18H6V3z', 'M9 7.5h6', 'M9 10.8h6', 'M9 14h3', 'M15.2 14.2a2.4 2.4 0 1 1 0 4.8 2.4 2.4 0 0 1 0-4.8z', 'M14.3 18.6l-.8 2.4M16.1 18.6l.8 2.4'],
  },
};

/* 4-point AI sparkles: the "why it works" marker */
const SPARKLE_PATHS = [
  'M12 4l1.8 4.6L18.4 10l-4.6 1.6L12 16.4 10.2 11.6 5.6 10l4.6-1.4L12 4z',
  'M19 15.4l.9 2.1 2.1.9-2.1.9-.9 2.1-.9-2.1-2.1-.9 2.1-.9.9-2.1z',
];

function svgIcon(paths, { viewBox = '0 0 24 24', className = '' } = {}) {
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('viewBox', viewBox);
  svg.setAttribute('aria-hidden', 'true');
  if (className) svg.setAttribute('class', className);
  for (const p of paths) {
    const path = document.createElementNS(SVG_NS, 'path');
    path.setAttribute('d', p.d);
    if (p.cls) path.setAttribute('class', p.cls);
    svg.appendChild(path);
  }
  return svg;
}

/** Duotone icon: soft tone layer under a stroked line layer. */
function actionIcon(id, className) {
  const spec = ACTION_ICONS[id] ?? ACTION_ICONS['benchmark-prompts'];
  return svgIcon(
    [
      { d: spec.tone, cls: 'duo-tone' },
      ...spec.line.map((d) => ({ d, cls: 'duo-line' })),
    ],
    { className: `duo ${className ?? ''}` },
  );
}

function ownerIcon(owner) {
  return svgIcon([{ d: OWNER_ICONS[owner] ?? '', cls: 'duo-line' }], { className: 'owner-glyph duo' });
}

function ownerTag(owner) {
  const tag = htmlEl('span', 'recs-tag');
  tag.appendChild(ownerIcon(owner));
  tag.appendChild(document.createTextNode(owner));
  return tag;
}

/** 0-5 meter rendered as a track + fill; fill width animated on swap. */
function meter(label, value) {
  const wrap = htmlEl('div', 'recs-meter');
  const head = htmlEl('div', 'recs-meter__head');
  head.appendChild(htmlEl('span', 'recs-meter__label', label));
  head.appendChild(htmlEl('span', 'recs-meter__value', `${formatRating(value)} / 5`));
  wrap.appendChild(head);
  const track = htmlEl('div', 'recs-meter__track');
  const fill = htmlEl('div', 'recs-meter__fill');
  fill.style.width = `${(value / 5) * 100}%`;
  track.appendChild(fill);
  wrap.appendChild(track);
  return wrap;
}

/**
 * S6 - recommendations as an infographic master-detail split view.
 *
 * Master (left): a "guidepost" timeline - one rail, three horizon milestones
 * (30/90/180), each action a tab row with a duotone icon. Detail (right):
 * a sticky glass panel; selecting a row crossfades its content in with a
 * slight vertical drift, never reflowing the surrounding layout (the panel
 * keeps a fixed min-height). The owner filter mutes non-matching rows
 * (shrink + desaturate) and lights up matching ones instead of removing
 * anything, so the timeline composition survives filtering.
 */
export function initRecommendations(recData) {
  const master = document.getElementById('recs-master');
  const stage = document.getElementById('recs-detail-stage');
  const detail = document.getElementById('recs-detail');
  const filters = document.getElementById('owner-filters');
  if (!master || !stage) return;

  const horizonById = Object.fromEntries(recData.horizons.map((h) => [h.id, h]));
  const rows = []; // { el, action }
  const stacked = window.matchMedia('(max-width: 1100px)'); // detail sits below the master
  let activeId = null;
  let swapTween = null;

  /* ---------- master: timeline rail + horizon groups ---------- */

  const rail = htmlEl('span', 'recs-rail');
  rail.setAttribute('aria-hidden', 'true');
  master.appendChild(rail);

  for (const horizon of recData.horizons) {
    const group = htmlEl('section', 'recs-group');
    group.style.setProperty('--h-color', horizon.color);

    const head = htmlEl('header', 'recs-group__head');
    const node = htmlEl('span', 'recs-group__node');
    node.setAttribute('aria-hidden', 'true');
    node.appendChild(htmlEl('strong', '', String(horizon.id)));
    node.appendChild(htmlEl('small', '', ui.days));
    head.appendChild(node);
    const headText = htmlEl('div', 'recs-group__head-text');
    headText.appendChild(htmlEl('h3', 'recs-group__name', t(horizon.name)));
    headText.appendChild(htmlEl('p', 'recs-group__label', `${ui.horizon}: ${t(horizon.label)}`));
    head.appendChild(headText);
    group.appendChild(head);

    const list = htmlEl('div', 'recs-group__list');
    for (const action of recData.actions.filter((a) => a.horizon === horizon.id)) {
      const row = htmlEl('button', 'recs-item');
      row.type = 'button';
      row.id = `recs-tab-${action.id}`;
      row.setAttribute('role', 'tab');
      row.setAttribute('aria-selected', 'false');
      row.setAttribute('aria-controls', 'recs-detail');

      const chip = htmlEl('span', 'recs-item__icon');
      chip.appendChild(actionIcon(action.id));
      row.appendChild(chip);

      const body = htmlEl('span', 'recs-item__body');
      body.appendChild(htmlEl('span', 'recs-item__title', t(action.title)));
      const meta = htmlEl('span', 'recs-item__meta');
      if (action.quickWin) meta.appendChild(htmlEl('span', 'recs-item__qw', ui.quickWin));
      meta.appendChild(htmlEl('span', 'recs-item__owners', action.owners.join(' · ')));
      body.appendChild(meta);
      row.appendChild(body);

      row.addEventListener('click', () => select(action.id));
      list.appendChild(row);
      rows.push({ el: row, action });
    }
    group.appendChild(list);
    master.appendChild(group);
  }

  /* keyboard: vertical tablist over currently visible (non-muted) rows */
  master.addEventListener('keydown', (event) => {
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
    const visible = rows.filter((r) => !r.el.classList.contains('is-muted'));
    const index = visible.findIndex((r) => r.action.id === activeId);
    if (index === -1) return;
    event.preventDefault();
    const next = visible[(index + (event.key === 'ArrowDown' ? 1 : -1) + visible.length) % visible.length];
    select(next.action.id);
    next.el.focus();
  });

  /* ---------- detail: glass panel content ---------- */

  function buildDetail(action) {
    const horizon = horizonById[action.horizon];
    const card = htmlEl('div', 'recs-detail-card');
    card.style.setProperty('--h-color', horizon.color);

    const top = htmlEl('div', 'recs-detail-card__top');
    const badges = htmlEl('div', 'recs-detail-card__badges');
    badges.appendChild(htmlEl('span', 'recs-badge recs-badge--horizon',
      `${t(horizon.label)} · ${t(horizon.name)}`));
    if (action.quickWin) badges.appendChild(htmlEl('span', 'recs-badge recs-badge--qw', ui.quickWin));
    top.appendChild(badges);
    const index = recData.actions.findIndex((a) => a.id === action.id) + 1;
    top.appendChild(htmlEl('span', 'recs-detail-card__count',
      ui.action(String(index).padStart(2, '0'), recData.actions.length)));
    card.appendChild(top);

    const hero = htmlEl('div', 'recs-detail-card__hero');
    const heroIcon = htmlEl('span', 'recs-detail-card__icon');
    heroIcon.appendChild(actionIcon(action.id));
    hero.appendChild(heroIcon);
    hero.appendChild(htmlEl('h3', 'recs-detail-card__title', t(action.title)));
    card.appendChild(hero);

    const facts = htmlEl('div', 'recs-detail-card__facts');
    const owners = htmlEl('div', 'recs-facts-block');
    owners.appendChild(htmlEl('span', 'recs-facts-block__label', ui.owners));
    const tags = htmlEl('div', 'recs-facts-block__tags');
    for (const owner of action.owners) tags.appendChild(ownerTag(owner));
    owners.appendChild(tags);
    facts.appendChild(owners);
    const meters = htmlEl('div', 'recs-facts-block recs-facts-block--meters');
    meters.appendChild(meter(ui.impact, action.impact));
    meters.appendChild(meter(ui.difficulty, action.difficulty));
    facts.appendChild(meters);
    card.appendChild(facts);

    const summary = htmlEl('div', 'recs-detail-card__summary');
    summary.appendChild(htmlEl('span', 'recs-facts-block__label', ui.whatWeDo));
    summary.appendChild(htmlEl('p', '', t(action.summary)));
    card.appendChild(summary);

    const why = htmlEl('div', 'recs-why');
    const whyHead = htmlEl('div', 'recs-why__head');
    whyHead.appendChild(svgIcon(SPARKLE_PATHS.map((d) => ({ d, cls: 'sparkle' })), { className: 'recs-why__icon' }));
    whyHead.appendChild(htmlEl('strong', '', ui.whyTitle));
    why.appendChild(whyHead);
    why.appendChild(htmlEl('p', '', t(action.why)));
    card.appendChild(why);

    return card;
  }

  /* ---------- selection: silky crossfade, zero layout shift ---------- */

  function select(id, { instant = false } = {}) {
    if (id === activeId) return;
    activeId = id;
    const action = recData.actions.find((a) => a.id === id);
    const horizon = horizonById[action.horizon];

    for (const { el, action: a } of rows) {
      const active = a.id === id;
      el.classList.toggle('is-active', active);
      el.setAttribute('aria-selected', String(active));
      el.tabIndex = active ? 0 : -1;
    }
    detail?.style.setProperty('--h-color', horizon.color);
    detail?.setAttribute('aria-labelledby', `recs-tab-${action.id}`);

    const next = buildDetail(action);

    /* bring the panel on screen: below the list when stacked, or nudged
       back into view on desktop when it parked past the viewport edge */
    if (!instant) {
      detail?.scrollIntoView({
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
        block: stacked.matches ? 'start' : 'nearest',
      });
    }

    if (prefersReducedMotion || instant || !stage.firstElementChild) {
      swapTween?.kill();
      stage.replaceChildren(next);
      return;
    }

    /* outgoing drifts up and fades; incoming rises in with a spring */
    swapTween?.kill();
    // rapid re-selects can interrupt the previous swap before its onComplete
    // removed the old card - drop any card still mid-exit right away
    stage.querySelectorAll('.is-leaving').forEach((el) => el.remove());
    const previous = stage.firstElementChild;
    previous.classList.add('is-leaving'); // absolute overlay: both states share the stage
    stage.appendChild(next);

    swapTween = gsap.timeline({
      onComplete: () => previous.remove(),
    });
    swapTween
      .to(previous, { opacity: 0, y: -14, duration: 0.24, ease: 'power2.in' }, 0)
      .fromTo(next, { opacity: 0, y: 26 }, { opacity: 1, y: 0, duration: 0.55, ease: 'back.out(1.4)' }, 0.12)
      .from(next.children, {
        opacity: 0,
        y: 16,
        duration: 0.45,
        ease: 'power3.out',
        stagger: 0.055,
        clearProps: 'transform,opacity',
      }, 0.16)
      .from(next.querySelectorAll('.recs-meter__fill'), {
        scaleX: 0,
        transformOrigin: 'left center',
        duration: 0.7,
        ease: 'power3.out',
      }, 0.3);
  }

  /* ---------- owner filter: recede vs light up ---------- */

  function applyFilter(owner) {
    for (const { el, action } of rows) {
      const match = owner === 'all' || action.owners.includes(owner);
      el.classList.toggle('is-muted', !match);
      el.classList.toggle('is-lit', match && owner !== 'all');
    }
    for (const group of master.querySelectorAll('.recs-group')) {
      const empty = !group.querySelector('.recs-item:not(.is-muted)');
      group.classList.toggle('is-empty', empty);
    }
    /* keep the detail in sync: if the active row receded, jump to the first lit one */
    const active = rows.find((r) => r.action.id === activeId);
    if (active?.el.classList.contains('is-muted')) {
      const first = rows.find((r) => !r.el.classList.contains('is-muted'));
      if (first) select(first.action.id);
    }
  }

  filters?.querySelectorAll('.chip').forEach((chip) => {
    if (OWNER_ICONS[chip.dataset.owner]) chip.prepend(ownerIcon(chip.dataset.owner));
    chip.addEventListener('click', () => {
      filters.querySelectorAll('.chip').forEach((c) => c.classList.toggle('is-active', c === chip));
      applyFilter(chip.dataset.owner);
    });
  });

  /* ---------- initial state + scroll entrance ---------- */

  select(recData.actions[0].id, { instant: true });

  if (!prefersReducedMotion) {
    gsap.from(rail, {
      scaleY: 0,
      transformOrigin: 'top center',
      ease: 'none',
      scrollTrigger: { trigger: master, start: 'top 75%', end: 'bottom 65%', scrub: 0.6 },
    });
    gsap.from(master.querySelectorAll('.recs-group__head'), {
      opacity: 0,
      x: -26,
      duration: 0.6,
      ease: 'power3.out',
      stagger: 0.14,
      scrollTrigger: { trigger: master, start: 'top 76%' },
      clearProps: 'transform,opacity',
    });
    gsap.from(rows.map((r) => r.el), {
      opacity: 0,
      x: -18,
      duration: 0.5,
      ease: 'power3.out',
      stagger: 0.045,
      scrollTrigger: { trigger: master, start: 'top 72%' },
      // hover/filter transforms live in CSS - inline values must not linger
      clearProps: 'transform,opacity',
    });
    gsap.from(detail, {
      opacity: 0,
      y: 40,
      scale: 0.97,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: { trigger: detail, start: 'top 80%' },
      clearProps: 'transform,opacity',
    });
  }
}
