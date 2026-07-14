import './styles/main.css';

import fanoutData from './data/fanout.json';
import sourcesData from './data/sources.json';
import phrasesData from './data/phrases.json';
import enginesData from './data/engines.json';
import recData from './data/recommendations.json';
import kpiData from './data/kpi.json';
import copy from './data/copy.json';

import { initNav } from './sections/nav.js';
import { initHero } from './sections/hero.js';
import { initJourney } from './sections/journey.js';
import { initQueryFlow } from './sections/queryFlow.js';
import { initSourcesMap } from './sections/sourcesMap.js';
import { initPhraseCloud } from './sections/phraseCloud.js';
import { initEngines } from './sections/engines.js';
import { initBento } from './sections/bento.js';
import { initDashboard } from './sections/dashboard.js';

initNav();
initHero(copy);
initJourney();
initEngines(enginesData);
initBento(recData);
initDashboard(kpiData);
initQueryFlow(fanoutData, copy);
initSourcesMap(sourcesData, copy);
initPhraseCloud(phrasesData);
