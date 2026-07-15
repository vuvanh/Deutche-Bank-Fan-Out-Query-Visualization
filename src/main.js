import './styles/main.css';

import { lang } from './lib/i18n.js';
import { EN_HTML, EN_ATTRS, EN_META } from './i18n/en.js';

import fanoutData from './data/fanout.json';
import sourcesData from './data/sources.json';
import phrasesData from './data/phrases.json';
import enginesData from './data/engines.json';
import recData from './data/recommendations.json';
import copy from './data/copy.json';

import { initNav } from './sections/nav.js';
import { initHero } from './sections/hero.js';
import { initJourney } from './sections/journey.js';
import { initQueryFlow } from './sections/queryFlow.js';
import { initSourcesMap } from './sections/sourcesMap.js';
import { initPhraseCloud } from './sections/phraseCloud.js';
import { initEngines } from './sections/engines.js';
import { initRecommendations } from './sections/recommendations.js';

/**
 * English pass over the static HTML (Polish is authored in index.html).
 * Must run BEFORE the sections initialize, so every module measures and
 * animates the final, already-translated layout.
 */
function applyHtmlTranslations() {
  document.documentElement.lang = 'en';
  document.title = EN_META.title;
  document.querySelector('meta[name="description"]')?.setAttribute('content', EN_META.description);

  for (const el of document.querySelectorAll('[data-i18n]')) {
    const value = EN_HTML[el.dataset.i18n];
    if (value != null) el.innerHTML = value;
  }
  for (const el of document.querySelectorAll('[data-i18n-attr]')) {
    const [attr, key] = el.dataset.i18nAttr.split(':');
    const value = EN_ATTRS[key];
    if (attr && value != null) el.setAttribute(attr, value);
  }
}

if (lang === 'en') applyHtmlTranslations();

initNav();
initHero(copy);
initJourney();
initEngines(enginesData);
initRecommendations(recData);
initQueryFlow(fanoutData, copy);
initSourcesMap(sourcesData, copy);
initPhraseCloud(phrasesData);
