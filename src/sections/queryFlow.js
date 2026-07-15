import { gsap, prefersReducedMotion } from '../lib/motion.js';
import { svgEl, htmlEl, curvedPath } from '../lib/svg.js';
import { t, ui } from '../lib/i18n.js';

/**
 * S2 - query flow: how the customer's chat prompt is rewritten by the model
 * into concrete Bing/Google queries (fan-out). Three columns connected by
 * curved SVG paths: user query → AI models → generated search queries.
 * Only queries actually observed in Dentons' own research are shown.
 */
export function initQueryFlow(fanoutData, copy) {
  const stage = document.getElementById('qflow');
  const svg = document.getElementById('qflow-paths');
  const queryNode = document.getElementById('qflow-query');
  const questionsBox = document.getElementById('qflow-questions');
  const fanoutsBox = document.getElementById('qflow-fanouts');
  if (!stage || !svg || !queryNode || !questionsBox || !fanoutsBox) return;

  const modelNodes = {
    gpt: document.getElementById('qflow-model-gpt'),
    gemini: document.getElementById('qflow-model-gemini'),
  };

  const insightGpt = document.getElementById('qflow-insight-gpt');
  const insightGemini = document.getElementById('qflow-insight-gemini');
  if (insightGpt) insightGpt.textContent = t(copy.fanout.insights.gpt);
  if (insightGemini) insightGemini.textContent = t(copy.fanout.insights.gemini);

  // only questions with observed fan-outs make sense in the flow
  const questions = fanoutData.questions.filter((q) =>
    Object.values(q.models).some((m) => m.queries.length > 0));
  if (questions.length === 0) return;

  let activeId = questions.find((q) => q.featured)?.id ?? questions[0].id;
  let revealed = prefersReducedMotion; // reduced motion: no entrance gating
  let paths = []; // { el, model, key }
  let fanoutEls = []; // { el, model, key }

  /* ---------- question selector ---------- */

  for (const question of questions) {
    const btn = htmlEl('button', 'chip');
    btn.type = 'button';
    btn.setAttribute('role', 'tab');
    btn.textContent = question.label;
    if (question.id === activeId) btn.classList.add('is-active');
    btn.addEventListener('click', () => {
      if (question.id === activeId) return;
      activeId = question.id;
      questionsBox.querySelectorAll('.chip')
        .forEach((c) => c.classList.toggle('is-active', c === btn));
      render({ animate: revealed && !prefersReducedMotion });
    });
    questionsBox.appendChild(btn);
  }

  /* ---------- rendering ---------- */

  function activeQuestion() {
    return questions.find((q) => q.id === activeId);
  }

  function render({ animate }) {
    const question = activeQuestion();

    queryNode.innerHTML = '';
    queryNode.appendChild(htmlEl('small', '', t(copy.fanout.centerLabel)));
    queryNode.appendChild(document.createTextNode(`„${question.label}”`));

    fanoutsBox.innerHTML = '';
    fanoutEls = [];

    for (const modelId of ['gpt', 'gemini']) {
      const model = question.models[modelId];
      if (!model || model.queries.length === 0) continue;

      const group = htmlEl('div', `qflow-group qflow-group--${modelId}`);
      const engine = modelId === 'gpt' ? 'Bing' : 'Google';
      group.appendChild(htmlEl('span', 'qflow-group__label',
        ui.queriesTo(fanoutData.models[modelId].label, engine)));

      model.queries.forEach((query, i) => {
        // each query links to a live search for that exact phrase in the
        // engine the model actually uses (GPT → Bing, Gemini → Google)
        const node = htmlEl('a', `qflow-node qflow-fanout qflow-fanout--${modelId}`);
        node.href = modelId === 'gpt'
          ? `https://www.bing.com/search?q=${encodeURIComponent(query.text)}`
          : `https://www.google.com/search?q=${encodeURIComponent(query.text)}`;
        node.target = '_blank';
        node.rel = 'noopener noreferrer';
        node.title = ui.openQueryIn(engine);
        node.appendChild(document.createTextNode(`„${query.text}”`));
        node.appendChild(htmlEl('span',
          `source-tag source-tag--${query.sourceType}`,
          t(fanoutData.sourceTypes[query.sourceType]) ?? query.sourceType));
        node.dataset.model = modelId;
        node.dataset.key = `fo-${modelId}-${i}`;
        group.appendChild(node);
        fanoutEls.push({ el: node, model: modelId, key: node.dataset.key });
      });

      fanoutsBox.appendChild(group);
    }

    bindHover();

    // paths need the final layout - measure on the next frame
    requestAnimationFrame(() => {
      drawPaths();
      if (animate) playEntrance();
    });
  }

  function drawPaths() {
    svg.innerHTML = '';
    paths = [];
    // must match the CSS breakpoint that stacks the columns
    if (window.innerWidth <= 1100) return;

    const stageRect = stage.getBoundingClientRect();
    const edge = (el) => {
      const r = el.getBoundingClientRect();
      return {
        left: r.left - stageRect.left,
        right: r.right - stageRect.left,
        midY: r.top - stageRect.top + r.height / 2,
      };
    };

    const q = edge(queryNode);

    for (const modelId of ['gpt', 'gemini']) {
      const modelEdge = edge(modelNodes[modelId]);
      addPath(modelId, `link-${modelId}`,
        curvedPath(q.right, q.midY, modelEdge.left, modelEdge.midY));

      for (const fo of fanoutEls) {
        if (fo.model !== modelId) continue;
        const foEdge = edge(fo.el);
        addPath(modelId, fo.key,
          curvedPath(modelEdge.right, modelEdge.midY, foEdge.left, foEdge.midY));
      }
    }
  }

  function addPath(model, key, d) {
    const el = svgEl('path', { class: `qflow-path qflow-path--${model}`, d });
    el.dataset.key = key;
    svg.appendChild(el);
    paths.push({ el, model, key });
  }

  /* ---------- hover: highlight the related chain, dim the rest ---------- */

  function bindHover() {
    for (const modelId of ['gpt', 'gemini']) {
      const node = modelNodes[modelId];
      node.onmouseenter = () => focusModel(modelId);
      node.onmouseleave = clearFocus;
    }
    for (const fo of fanoutEls) {
      fo.el.addEventListener('mouseenter', () => focusFanout(fo));
      fo.el.addEventListener('mouseleave', clearFocus);
    }
  }

  function applyFocus(activeNodes, activeKeys) {
    stage.classList.add('has-focus');
    const nodes = [queryNode, modelNodes.gpt, modelNodes.gemini,
      ...fanoutEls.map((f) => f.el)];
    for (const node of nodes) {
      node.classList.toggle('is-active', activeNodes.includes(node));
    }
    for (const path of paths) {
      path.el.classList.toggle('is-active', activeKeys.includes(path.key));
    }
  }

  function focusModel(modelId) {
    applyFocus(
      [queryNode, modelNodes[modelId],
        ...fanoutEls.filter((f) => f.model === modelId).map((f) => f.el)],
      paths.filter((p) => p.model === modelId).map((p) => p.key),
    );
  }

  function focusFanout(fo) {
    applyFocus(
      [queryNode, modelNodes[fo.model], fo.el],
      [`link-${fo.model}`, fo.key],
    );
  }

  function clearFocus() {
    stage.classList.remove('has-focus');
    stage.querySelectorAll('.is-active').forEach((el) => el.classList.remove('is-active'));
    paths.forEach((p) => p.el.classList.remove('is-active'));
  }

  /* ---------- entrance: the queries "appear" step by step ---------- */

  function preparePathDraw(path) {
    const len = path.getTotalLength();
    path.style.strokeDasharray = String(len);
    path.style.strokeDashoffset = String(len);
    return len;
  }

  function playEntrance() {
    const modelLinks = paths.filter((p) => p.key.startsWith('link-'));
    const fanoutLinks = paths.filter((p) => !p.key.startsWith('link-'));
    const tl = gsap.timeline();

    tl.from(queryNode, { x: -26, opacity: 0, duration: 0.45, ease: 'power2.out' }, 0);

    modelLinks.forEach((p, i) => {
      preparePathDraw(p.el);
      tl.to(p.el, { strokeDashoffset: 0, duration: 0.4, ease: 'power1.inOut' }, 0.3 + i * 0.12);
    });

    tl.from([modelNodes.gpt, modelNodes.gemini], {
      scale: 0.88, opacity: 0, duration: 0.4, stagger: 0.12,
      ease: 'back.out(1.5)', clearProps: 'transform,opacity',
    }, 0.45);

    fanoutLinks.forEach((p, i) => {
      preparePathDraw(p.el);
      tl.to(p.el, { strokeDashoffset: 0, duration: 0.35, ease: 'power1.out' }, 0.95 + i * 0.06);
    });

    tl.from(fanoutEls.map((f) => f.el), {
      x: 22, opacity: 0, duration: 0.4, stagger: 0.06,
      ease: 'power2.out', clearProps: 'transform,opacity',
    }, 1.05);
  }

  /* ---------- boot: render, then reveal on scroll ---------- */

  render({ animate: false });

  if (!prefersReducedMotion) {
    // hide flow content until the section scrolls into view, then play
    stage.classList.add('is-pending');
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        observer.disconnect();
        revealed = true;
        requestAnimationFrame(() => {
          drawPaths();
          playEntrance(); // sets entrance from-states inline before unhiding
          stage.classList.remove('is-pending');
        });
      }
    }, { threshold: 0.2 });
    observer.observe(stage);
  }

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(drawPaths, 200);
  });
}
