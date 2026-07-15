/**
 * English dictionary for the static copy authored in index.html (Polish is
 * the in-file source). Keys match `data-i18n` attributes; values replace the
 * element's innerHTML, so simple inline markup (<em>, <strong>, <br>) is
 * allowed. Applied once at startup by applyHtmlTranslations() in main.js,
 * before any section initializes.
 */

export const EN_META = {
  title: 'AI Visibility · Dentons × Deutsche Bank',
  description: 'Interactive demo: how borrowers’ questions about EUR loans travel '
    + 'through AI models, and how to increase the visibility of the bank’s balanced position.',
};

export const EN_HTML = {
  /* ---------- nav ---------- */
  'nav.problem': 'Problem',
  'nav.mechanism': 'Mechanism',
  'nav.sources': 'Sources',
  'nav.gap': 'Gap',
  'nav.rules': 'Rules of the game',
  'nav.recommendations': 'Recommendations',

  /* ---------- S0 hero ---------- */
  'hero.title': 'Before filing the lawsuit, your client <em>asked AI</em>',
  'hero.ctaSee': 'See how AI answers',
  'hero.ctaRecs': 'Skip to recommendations →',

  /* ---------- S1 journey ---------- */
  'journey.eyebrow': '1 · Problem',
  'journey.title': 'The new client journey: from question to lawsuit',
  'journey.lead': 'An AI answer is now the borrower’s first advisor. Its tone and its '
    + 'sources shape the decision to sue before anyone at the bank gets a chance to talk '
    + 'to the client.',
  'journey.s1.title': 'The client asks a chatbot',
  'journey.s1.text': 'Instead of typing a keyword into a search engine, they ask a full '
    + 'question: „is it worth annulling my EUR loan?”.',
  'journey.s2.title': 'The model searches the web',
  'journey.s2.text': 'The chatbot generates a series of auxiliary search queries on its '
    + 'own and retrieves online sources.',
  'journey.s3.title': 'They receive a synthesis of sources',
  'journey.s3.text': 'The retrieved results are dominated by domains that specialize in '
    + 'litigation against banks.',
  'journey.s4.title': 'The client decides without the bank',
  'journey.s4.text': 'Armed with a ready-made narrative, the client goes to a law firm. '
    + 'The first conversation with the bank has been replaced by an AI answer.',
  'journey.cue': 'What exactly happens after the question is typed?',

  /* ---------- S2 query flow ---------- */
  'qflow.eyebrow': '2 · Mechanism',
  'qflow.title': 'One question. A dozen searches.',
  'qflow.lead': 'A question typed into a chat does not reach the search engine verbatim. '
    + 'The model rewrites it into a series of concrete Bing and Google queries (the '
    + 'so-called fan-out) and builds its answer on those results. Queries below are '
    + 'shown in the original Polish, exactly as observed in our research.',
  'qflow.colInput': '1 · The client types into the chat',
  'qflow.examplesLabel': 'Try the other example questions:',
  'qflow.colModels': '2 · The model processes the question',
  'qflow.gptEngine': 'searches via Bing',
  'qflow.geminiEngine': 'searches via Google',
  'qflow.colFanouts': '3 · Actual search-engine queries',
  'qflow.insightGptTitle': 'ChatGPT searches „officially”',
  'qflow.insightGeminiTitle': 'Gemini searches „like a guidebook”',
  'qflow.cue': 'See which sources win these searches',

  /* ---------- S3 sources map ---------- */
  'sources.eyebrow': '3 · Categorization',
  'sources.title': 'Who answers on the bank’s behalf today?',
  'sources.lead': 'Categorization of the domains actually retrieved by the models in our research',
  'sources.cue': 'How big is this gap?',

  /* ---------- S4 visibility gap ---------- */
  'gap.eyebrow': '4 · Culmination',
  'gap.title': 'The visibility gap',
  'gap.filterAll': 'All phrases',
  'gap.filterClaim': 'Pro-lawsuit',
  'gap.filterNeutral': 'Neutral / factual',
  'gap.cue': 'The good news: the rules of the game are known',

  /* ---------- S5 engine rules ---------- */
  'rules.eyebrow': '5 · Opportunity',
  'rules.title': 'AI engines reward specific content traits. That is good news.',
  'rules.lead': 'Models prefer content that is balanced, factual and well structured, '
    + 'with visible authorship and confirmation across multiple sources. That is the '
    + 'natural advantage of an institution with data, experts and authority, provided '
    + 'it publishes them in a machine-readable format.',
  'rules.commonTitle': 'The common denominator of all engines',
  'rules.common1': 'A direct answer at the top of the text',
  'rules.common2': 'A verifiable author',
  'rules.common3': 'Data instead of adjectives',
  'rules.common4': 'A consistent position across many sources',
  'rules.cue': 'Let’s turn this into an action plan',

  /* ---------- S6 recommendations ---------- */
  'recs.eyebrow': '5 · Action plan',
  'recs.title': 'Recommendations',
  'recs.lead': 'An action plan in three groups: quick wins to start with (30 days), '
    + 'longer content-foundation work (90 days), and the hardest, long-term work in the '
    + 'source ecosystem (6 months). Every action has an owner, an impact and difficulty '
    + 'rating, and an explanation of why it works.',
  'recs.filterAll': 'All owners',
  'recs.disclaimer': '<strong>Disclaimer:</strong> no action guarantees any specific '
    + 'content of AI answers. The goal is to systematically increase the presence of the '
    + 'bank’s reliable, balanced position in the sources the models draw on. Content '
    + 'and PR execution remains with the bank and its agency.',
  'recs.cue': 'Let’s talk about implementation',

  /* ---------- S8 closing ---------- */
  'closing.title': 'Dentons × Deutsche Bank: role and next step',
  'closing.lead': 'Dentons designs the strategy and measures its effect. The bank and '
    + 'its agency own the execution. Next step: a strategy workshop.',
  'closing.r1.title': 'Strategy',
  'closing.r1.text': 'An architecture of content, PR and technical actions grounded in '
    + 'the mechanics of AI models.',
  'closing.r2.title': 'Insights',
  'closing.r2.text': 'Our own, regularly repeated research into the query and source space.',
  'closing.r3.title': 'Oversight and measurement',
  'closing.r3.text': 'A prompt benchmark plus reporting of Share of Answer, Citation Rate '
    + 'and sentiment.',
  'closing.cta': 'Book a strategy workshop',

  /* ---------- footer ---------- */
  'footer.brand': 'Visualization prepared by the<br />Dentons: Innovation &amp; Intelligence team.',
  'footer.mailLabel': 'Email us',
  'footer.contactHeading': 'Contact',
  'footer.legalHeading': 'Legal notice',
  'footer.legal1': 'Dentons demonstration material. It does not constitute legal advice.',
  'footer.legal2': 'This material does not promise any influence over the content of '
    + 'AI-generated answers; it describes actions that increase the visibility of the '
    + 'bank’s reliable position in the ecosystem of sources used by search engines '
    + 'and models.',
  'footer.legal3': 'Fan-out data and source categorization: Dentons’ own research.',
  'footer.copyright': '© 2026 Dentons. All rights reserved.',
};

export const EN_ATTRS = {
  /* key → { selector-less: applied via data-i18n-attr="attr:key" } */
  'nav.logoAria': 'Dentons: back to the top of the page',
  'hero.chatAria': 'Go to section: Problem',
  'qflow.questionsAria': 'Choose an example question',
  'gap.filtersAria': 'Filter phrases',
  'recs.filtersAria': 'Filter actions by owner',
  'recs.masterAria': 'Actions by time horizon',
};
