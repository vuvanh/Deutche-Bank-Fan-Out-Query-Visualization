import { gsap, ScrollTrigger, prefersReducedMotion } from '../lib/motion.js';
import { svgEl, htmlEl, curvedPath } from '../lib/svg.js';

/**
 * S2 - fan-out simulator. Precomputed data only (no live model calls):
 * the user picks one of the researched consumer questions and toggles
 * ChatGPT ⇄ Gemini; the question node branches into the queries the model
 * actually generated (research/report.json → src/data/fanout.json).
 */
export function initFanout(fanoutData, copy) {
  const canvas = document.getElementById('fanout-canvas');
  const questionsBox = document.getElementById('fanout-questions');
  const toggle = document.getElementById('model-toggle');
  const insightText = document.getElementById('fanout-insight-text');
  if (!canvas || !questionsBox) return;

  const state = {
    questionId: fanoutData.questions.find((q) => q.featured)?.id ?? fanoutData.questions[0].id,
    modelId: 'gpt',
    revealed: false, // becomes true once the pinned intro has played
  };

  /* ---------- question selector ---------- */
  for (const question of fanoutData.questions) {
    const btn = htmlEl('button', 'chip');
    btn.type = 'button';
    btn.setAttribute('role', 'tab');
    btn.dataset.question = question.id;
    btn.textContent = question.label;
    const isTodo = Object.values(question.models).every((m) => m.status === 'DO_UZUPELNIENIA');
    if (isTodo) {
      const todo = htmlEl('span', 'chip__todo', copy.fanout.todoBadge);
      btn.appendChild(todo);
    }
    if (question.id === state.questionId) btn.classList.add('is-active');
    btn.addEventListener('click', () => {
      state.questionId = question.id;
      state.revealed = true;
      questionsBox.querySelectorAll('.chip').forEach((c) => c.classList.toggle('is-active', c === btn));
      render({ animate: true });
    });
    questionsBox.appendChild(btn);
  }

  /* ---------- model toggle ---------- */
  toggle.querySelectorAll('button').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (btn.dataset.model === state.modelId) return;
      state.modelId = btn.dataset.model;
      state.revealed = true;
      toggle.querySelectorAll('button').forEach((b) => b.classList.toggle('is-active', b === btn));
      render({ animate: true });
    });
  });

  /* ---------- rendering ---------- */

  function currentModelData() {
    const question = fanoutData.questions.find((q) => q.id === state.questionId);
    return { question, model: question.models[state.modelId] };
  }

  function render({ animate }) {
    const { question, model } = currentModelData();
    canvas.innerHTML = '';
    insightText.textContent = copy.fanout.insights[state.modelId];

    if (model.status === 'DO_UZUPELNIENIA' || model.queries.length === 0) {
      renderEmpty();
      return;
    }

    const svg = svgEl('svg', { 'aria-hidden': 'true' });
    canvas.appendChild(svg);

    const center = htmlEl('div', 'fanout-center');
    const centerTag = htmlEl('small', '', copy.fanout.centerLabel);
    center.appendChild(centerTag);
    center.appendChild(document.createTextNode(`„${question.label}”`));
    canvas.appendChild(center);

    // split queries into left / right columns around the center node
    const nodes = model.queries.map((query, i) => {
      const node = htmlEl('div', 'fanout-node');
      node.appendChild(document.createTextNode(`„${query.text}”`));
      const tag = htmlEl(
        'span',
        `source-tag source-tag--${query.sourceType}`,
        fanoutData.sourceTypes[query.sourceType] ?? query.sourceType,
      );
      node.appendChild(tag);
      node.dataset.side = i % 2 === 0 ? 'left' : 'right';
      canvas.appendChild(node);
      return node;
    });

    positionAndConnect(svg, center, nodes);

    if (animate && !prefersReducedMotion) {
      playEntrance(svg, center, nodes);
    }
  }

  function positionAndConnect(svg, center, nodes) {
    const { width, height } = canvas.getBoundingClientRect();
    const narrow = width < 760;

    const left = nodes.filter((n) => n.dataset.side === 'left');
    const right = nodes.filter((n) => n.dataset.side === 'right');

    const placeColumn = (column, side) => {
      const usable = height - 40;
      column.forEach((node, i) => {
        const y = 20 + (usable / (column.length + 1)) * (i + 1);
        node.style.top = `${y}px`;
        node.style.transform = 'translateY(-50%)';
        if (narrow) {
          // single column below the center on small screens
          node.style.position = 'relative';
          node.style.top = 'auto';
          node.style.transform = 'none';
          node.style.margin = '10px auto';
          node.style.maxWidth = '100%';
        } else if (side === 'left') {
          node.style.left = '0';
        } else {
          node.style.right = '0';
        }
      });
    };

    if (narrow) {
      canvas.style.minHeight = 'auto';
      canvas.style.display = 'flex';
      canvas.style.flexDirection = 'column';
      canvas.style.gap = '6px';
      center.style.position = 'relative';
      center.style.left = 'auto';
      center.style.top = 'auto';
      center.style.transform = 'none';
      center.style.margin = '0 auto 14px';
      nodes.forEach((n) => placeColumn([n], n.dataset.side));
      return; // no connector paths in the stacked mobile layout
    }

    placeColumn(left, 'left');
    placeColumn(right, 'right');

    // paths need final layout - measure on next frame
    requestAnimationFrame(() => {
      const canvasRect = canvas.getBoundingClientRect();
      const centerRect = center.getBoundingClientRect();
      const cx = centerRect.left - canvasRect.left + centerRect.width / 2;
      const cy = centerRect.top - canvasRect.top + centerRect.height / 2;

      nodes.forEach((node) => {
        const rect = node.getBoundingClientRect();
        const ny = rect.top - canvasRect.top + rect.height / 2;
        const isLeft = node.dataset.side === 'left';
        const startX = isLeft ? cx - centerRect.width / 2 : cx + centerRect.width / 2;
        const endX = isLeft ? rect.right - canvasRect.left : rect.left - canvasRect.left;
        const path = svgEl('path', {
          class: 'branch-path',
          d: curvedPath(startX, cy, endX, ny),
        });
        svg.appendChild(path);
        node._path = path;
      });
    });
  }

  function playEntrance(svg, center, nodes) {
    gsap.from(center, { scale: 0.6, opacity: 0, duration: 0.45, ease: 'back.out(1.6)' });
    // paths exist one frame later - animate them then
    requestAnimationFrame(() => requestAnimationFrame(() => {
      nodes.forEach((node, i) => {
        const path = node._path;
        if (path) {
          const len = path.getTotalLength();
          path.style.strokeDasharray = String(len);
          path.style.strokeDashoffset = String(len);
          gsap.to(path, { strokeDashoffset: 0, duration: 0.5, delay: 0.15 + i * 0.09, ease: 'power2.out' });
        }
        gsap.from(node, {
          opacity: 0,
          scale: 0.85,
          duration: 0.4,
          delay: 0.3 + i * 0.09,
          ease: 'power2.out',
        });
      });
    }));
  }

  function renderEmpty() {
    const empty = htmlEl('div', 'fanout-empty');
    const badge = htmlEl('span', 'badge badge--todo', copy.fanout.todoBadge);
    const msg = htmlEl('p', '', copy.fanout.todoMessage);
    msg.style.maxWidth = '52ch';
    empty.appendChild(badge);
    empty.appendChild(msg);
    canvas.appendChild(empty);
  }

  /* ---------- pinned scroll intro (desktop, motion allowed) ---------- */

  function setupPinnedIntro() {
    if (prefersReducedMotion || window.innerWidth < 900) {
      render({ animate: false });
      return;
    }
    render({ animate: false });

    // Scrubbed reveal: the question "thinks", then branches appear in rhythm
    // with the scroll - the user scrolls through the model's fan-out process.
    const section = document.getElementById('mechanizm');
    const center = canvas.querySelector('.fanout-center');
    const nodes = [...canvas.querySelectorAll('.fanout-node')];
    const insight = document.getElementById('fanout-insight');

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: '+=130%',
        pin: true,
        scrub: 0.4,
        anticipatePin: 1,
      },
    });

    tl.from(center, { scale: 0.5, opacity: 0, duration: 0.6, ease: 'back.out(1.4)' });
    // draw paths + pop nodes, staggered along the scrub
    requestAnimationFrame(() => requestAnimationFrame(() => {
      nodes.forEach((node, i) => {
        const path = node._path;
        const at = 0.5 + i * 0.35;
        if (path) {
          const len = path.getTotalLength();
          path.style.strokeDasharray = String(len);
          path.style.strokeDashoffset = String(len);
          tl.to(path, { strokeDashoffset: 0, duration: 0.35, ease: 'none' }, at);
        }
        tl.from(node, { opacity: 0, y: 14, duration: 0.3 }, at + 0.12);
      });
      tl.from(insight, { opacity: 0, y: 20, duration: 0.5 }, '>-0.1');
    }));

    // Any interaction after the intro re-renders without the scrub.
    ScrollTrigger.refresh();
  }

  setupPinnedIntro();

  // re-layout on resize (positions + paths are measured)
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => render({ animate: false }), 200);
  });
}
