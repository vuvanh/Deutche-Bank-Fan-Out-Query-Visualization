/**
 * Runtime i18n. Polish is the source language (authored in index.html and in
 * the plain-string data fields); English lives in parallel `{pl, en}` data
 * fields and in the HTML dictionary (src/i18n/en.js). Switching languages
 * reloads the page so every GSAP/ScrollTrigger instance re-initializes
 * against the swapped copy.
 *
 * Deliberately NOT translated (real observed research data): the hero
 * typewriter phrases, the S2 example questions and fan-out queries, and the
 * S4 phrase-cloud keywords.
 */

const STORAGE_KEY = 'lang';

const stored = (() => {
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
})();

/** Active language for this page load: 'pl' (default) or 'en'. */
export const lang = stored === 'en' ? 'en' : 'pl';

/** Persist the choice and reload so all sections rebuild in the new language. */
export function setLang(next) {
  if (next === lang) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, next);
  } catch {
    /* private mode: the switch still works for this load via reload default */
  }
  window.location.reload();
}

/**
 * Resolve a possibly-bilingual data value. `{pl, en}` objects (and
 * `{pl: [...], en: [...]}` arrays) pick the active language; plain
 * strings/arrays pass through untouched, which is how untranslated research
 * data (queries, phrases) stays Polish in both versions.
 */
export function t(value) {
  if (value && typeof value === 'object' && !Array.isArray(value) && ('pl' in value)) {
    return value[lang] ?? value.pl;
  }
  return value;
}

/** Format a 0-5 rating with the locale decimal separator (3,5 vs 3.5). */
export function formatRating(value) {
  return String(value).replace('.', lang === 'pl' ? ',' : '.');
}

/* ---------- strings rendered from JS (not present in index.html) ---------- */

const UI = {
  pl: {
    owners: 'Właściciele',
    impact: 'Wpływ',
    difficulty: 'Trudność',
    whatWeDo: 'Co robimy',
    whyTitle: 'Dlaczego to działa · mechanika AI',
    quickWin: 'Quick win',
    days: 'dni',
    horizon: 'Horyzont',
    action: (i, n) => `Działanie ${i} / ${n}`,
    recsAria: 'Działania według horyzontu czasowego',
    donutAria: 'Wykres kołowy: kategorie domen pobranych przez modele AI',
    donutCaption: 'unikalnych domen pobranych przez modele',
    donutHint: 'kliknij kategorię, aby zobaczyć domeny',
    queriesTo: (model, engine) => `${model} → zapytania do ${engine}`,
    openQueryIn: (engine) => `Otwórz to zapytanie w ${engine}`,
    engineSeeks: 'Co premiuje ten silnik',
    engineForBank: 'Dla banku',
    engineMore: 'Dla zainteresowanych',
    switchAria: 'Zmień język strony',
  },
  en: {
    owners: 'Owners',
    impact: 'Impact',
    difficulty: 'Difficulty',
    whatWeDo: 'What we do',
    whyTitle: 'Why it works · AI mechanics',
    quickWin: 'Quick win',
    days: 'days',
    horizon: 'Horizon',
    action: (i, n) => `Action ${i} / ${n}`,
    recsAria: 'Actions by time horizon',
    donutAria: 'Donut chart: categories of domains retrieved by AI models',
    donutCaption: 'unique domains retrieved by the models',
    donutHint: 'click a category to see its domains',
    queriesTo: (model, engine) => `${model} → queries to ${engine}`,
    openQueryIn: (engine) => `Open this query in ${engine}`,
    engineSeeks: 'What this engine rewards',
    engineForBank: 'For the bank',
    engineMore: 'For the curious',
    switchAria: 'Change page language',
  },
};

/** UI strings resolved for the active language. */
export const ui = UI[lang];
