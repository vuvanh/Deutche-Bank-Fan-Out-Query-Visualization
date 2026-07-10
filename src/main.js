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
import { initFanout } from './sections/fanout.js';
import { initSourcesMap } from './sections/sourcesMap.js';
import { initPhraseCloud } from './sections/phraseCloud.js';
import { initEngines } from './sections/engines.js';
import { initMatrix } from './sections/matrix.js';
import { initDashboard } from './sections/dashboard.js';

initNav();
initHero(copy);
initJourney();
initEngines(enginesData);
initMatrix(recData, copy);
initDashboard(kpiData);
initSourcesMap(sourcesData, copy);
initPhraseCloud(phrasesData);
// fanout last: it pins S2 and pinning changes layout offsets above/below
initFanout(fanoutData, copy);
