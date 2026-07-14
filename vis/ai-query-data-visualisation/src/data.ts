export interface FanOutQuery {
  id: string;
  query: string;
  englishTranslation: string;
  category: "Legal" | "Regulatory" | "Forum" | "Opinions" | "Costs" | "Risk" | "Comparative";
  badgeText: string;
  riskLevel: "High" | "Medium" | "Low";
  explanation: string;
}

export interface ModelData {
  id: "gpt" | "gemini";
  name: string;
  version: string;
  tagline: string;
  archetype: string;
  description: string;
  focusArea: string;
  color: string;
  badgeStyle: string;
}

export interface OriginalQuery {
  id: string;
  text: string;
  english: string;
  context: string;
}

export interface GPTSession {
  id: number;
  safeUrls: string[];
  queries: {
    queryText: string; // matches the original query text
    fanOuts: FanOutQuery[];
  }[];
}

export interface GeminiRun {
  id: number;
  queries: {
    queryText: string; // matches original query text
    fanOuts: FanOutQuery[];
    sources?: string[];
  }[];
}

export const MODELS: Record<string, ModelData> = {
  gpt: {
    id: "gpt",
    name: "GPT-5.5 (thinking medium)",
    version: "ChatGPT Authority Engine",
    tagline: "Authority-Seeking & Litigious Precedent Focus",
    archetype: "Regulatory Auditor",
    description: "Prioritizes official, legal evidence and regulatory guidelines (e.g., UOKiK, Rzecznik Finansowy, TSUE). Analyzes risk from a formal litigation standpoint.",
    focusArea: "Official case law, supreme court decisions, regulatory tables, and statutory violations.",
    color: "from-slate-700 to-indigo-950 border-slate-600 shadow-slate-900/10",
    badgeStyle: "bg-indigo-950 text-indigo-300 border-indigo-800"
  },
  gemini: {
    id: "gemini",
    name: "Gemini 2.5-flash",
    version: "Google Commercial Engine",
    tagline: "Commercial-Friendly & Advisory Search Intent",
    archetype: "Financial Advisor / Market Analyst",
    description: "Prioritizes consumer decision-making, commercial feasibility, costs, forum opinions, and the practical economics of legal representation.",
    focusArea: "Consumer sentiment, cost-benefit calculations, local forum reviews, and alternative law firms.",
    color: "from-violet-700 to-purple-950 border-purple-500 shadow-purple-900/10",
    badgeStyle: "bg-purple-950 text-purple-300 border-purple-800"
  }
};

export const ORIGINAL_QUERIES: OriginalQuery[] = [
  {
    id: "q1",
    text: "czy warto uniewaznic kredyt w euro",
    english: "Is it worth canceling a euro-denominated mortgage?",
    context: "Klient na wczesnym etapie decyzyjnym, ważący korzyści unieważnienia w stosunku do czasu trwania procesu."
  },
  {
    id: "q2",
    text: "plusy i minusy unieważnienia kredytu w euro",
    english: "Pros and cons of canceling a mortgage in Euros",
    context: "Bezpośrednia analiza SWOT, w której klient zestawia natychmiastową redukcję długu z ryzykiem kontrpozwu."
  },
  {
    id: "q3",
    text: "co upowaznia mnie do uniewaznienia kredytu w euro",
    english: "What authorizes me to invalidate a euro mortgage?",
    context: "Poszukiwanie konkretnych uchybień formalno-prawnych i klauzul abuzywnych w umowie."
  }
];

export const GPT_SESSIONS: GPTSession[] = [
  {
    id: 1,
    safeUrls: [
      "https://finanse.uokik.gov.pl/tag/klauzule-abuzywne/?utm_source=chatgpt.com",
      "https://rf.gov.pl/mapa-klauzul-w-umowach-kredytow-walutowych/",
      "https://rf.gov.pl/mapa-klauzul-w-umowach-kredytow-walutowych/?utm_source=chatgpt.com",
      "https://finanse.uokik.gov.pl/tag/klauzule-abuzywne/",
      "https://www.openai.com",
      "https://finanse.uokik.gov.pl/chf/kredyty-hipoteczne-wyrazone-w-walutach-obcych-dzialania-uokik-odpowiedzi-na-najczestsze-pytania-konsumentow/",
      "https://finanse.uokik.gov.pl/chf/kredyty-hipoteczne-wyrazone-w-walutach-obcych-dzialania-uokik-odpowiedzi-na-najczestsze-pytania-konsumentow/?utm_source=chatgpt.com"
    ],
    queries: [
      {
        queryText: "czy warto uniewaznic kredyt w euro",
        fanOuts: [
          {
            id: "q1-gpt-s1-1",
            query: "2026 kredyt w euro unieważnienie kredytu walutowego orzecznictwo TSUE euro kredyt hipoteczny Polska",
            englishTranslation: "2026 euro mortgage invalidation of foreign currency loan TSUE case law euro mortgage Poland",
            category: "Legal",
            badgeText: "TSUE Case Law",
            riskLevel: "High",
            explanation: "Queries the European Court of Justice (TSUE) precedents updated for current terms, establishing high litigation readiness."
          },
          {
            id: "q1-gpt-s1-2",
            query: "Rzecznik Finansowy kredyty walutowe euro unieważnienie klauzule abuzywne",
            englishTranslation: "Financial Ombudsman foreign currency loans euro invalidation abusive clauses",
            category: "Regulatory",
            badgeText: "Financial Ombudsman",
            riskLevel: "Medium",
            explanation: "Looks up custom mediation records and institutional positions from the Polish Ombudsman."
          },
          {
            id: "q1-gpt-s1-3",
            query: "UOKiK kredyty walutowe euro klauzule niedozwolone",
            englishTranslation: "UOKiK foreign currency loans euro prohibited clauses",
            category: "Regulatory",
            badgeText: "UOKiK Registry",
            riskLevel: "High",
            explanation: "Verifies registered prohibited clauses (abuzywne) to identify match parameters with the bank's templates."
          }
        ]
      },
      {
        queryText: "plusy i minusy unieważnienia kredytu w euro",
        fanOuts: [
          {
            id: "q2-gpt-s1-1",
            query: "kredyt w euro unieważnienie plusy minusy 2026 kredyt denominowany indeksowany EUR klauzule abuzywne",
            englishTranslation: "euro mortgage invalidation pros cons 2026 denominated indexed EUR abusive clauses",
            category: "Legal",
            badgeText: "Contract Structure",
            riskLevel: "High",
            explanation: "Examines specific technical differences between indexed and denominated contracts in case law."
          },
          {
            id: "q2-gpt-s1-2",
            query: "UOKiK kredyty walutowe klauzule abuzywne tabela kursowa banku waluta obca",
            englishTranslation: "UOKiK foreign currency loans abusive clauses bank exchange rate table foreign currency",
            category: "Regulatory",
            badgeText: "Rate Tables Audit",
            riskLevel: "High",
            explanation: "Targets the bank's custom spread algorithms and absolute discretion in determining currency values."
          },
          {
            id: "q2-gpt-s1-3",
            query: "Rzecznik Finansowy kredyty walutowe euro klauzule abuzywne mapa klauzul",
            englishTranslation: "Financial Ombudsman foreign currency loans euro abusive clauses clauses map",
            category: "Regulatory",
            badgeText: "Map of Abusive Clauses",
            riskLevel: "Medium",
            explanation: "Correlates the specific bank contract against the official map of unfair provisions."
          }
        ]
      },
      {
        queryText: "co upowaznia mnie do uniewaznienia kredytu w euro",
        fanOuts: [
          {
            id: "q3-gpt-s1-1",
            query: "Rzecznik Finansowy kredyty walutowe mapa klauzul umowy kredytów walutowych euro klauzule abuzywne",
            englishTranslation: "Financial Ombudsman foreign currency loans clauses map euro currency mortgage abusive clauses",
            category: "Regulatory",
            badgeText: "Ombudsman Map",
            riskLevel: "Medium",
            explanation: "Investigates past bank actions and administrative decisions to identify precedents of formal invalidation."
          },
          {
            id: "q3-gpt-s1-2",
            query: "UOKiK kredyty walutowe klauzule niedozwolone tabele kursowe banku",
            englishTranslation: "UOKiK foreign currency loans prohibited clauses bank rate tables",
            category: "Regulatory",
            badgeText: "Rate Table Abuzywność",
            riskLevel: "High",
            explanation: "Checks whether specific pricing policies violate Poland's Competition Act."
          },
          {
            id: "q3-gpt-s1-3",
            query: "TSUE kredyty walutowe klauzule abuzywne wynagrodzenie za korzystanie z kapitału bank",
            englishTranslation: "TSUE foreign currency loans abusive clauses compensation for capital use bank",
            category: "Legal",
            badgeText: "Capital Compensation",
            riskLevel: "High",
            explanation: "Examines whether banks can claim fees for capital usage post-invalidation (referencing critical TSUE case law)."
          }
        ]
      }
    ]
  },
  {
    id: 2,
    safeUrls: [
      "https://tvn24.pl/biznes/pieniadze/spory-o-kredyty-w-euro-w-sadach-czy-powtorzy-sie-scenariusz-frankowy-st8894599?utm_source=chatgpt.com",
      "https://rf.gov.pl/mapa-klauzul-w-umowach-kredytow-walutowych/?utm_source=chatgpt.com",
      "https://finanse.uokik.gov.pl/tag/klauzule-abuzywne/",
      "https://finanse.uokik.gov.pl/tag/klauzule-abuzywne/?utm_source=chatgpt.com",
      "https://tvn24.pl/biznes/pieniadze/spory-o-kredyty-w-euro-w-sadach-czy-powtorzy-sie-scenariusz-frankowy-st8894599",
      "https://rf.gov.pl/mapa-klauzul-w-umowach-kredytow-walutowych/",
      "https://rf.gov.pl/edukacja/baza-wiedzy/najczestsze-pytania-i-odpowiedzi-faq/spor-frankowy-droga-sadowa-i-mediacyjna/",
      "https://rf.gov.pl/tsue-o-trzech-waznych-dla-frankowiczow-sprawach/",
      "https://rf.gov.pl/tsue-o-trzech-waznych-dla-frankowiczow-sprawach/?utm_source=chatgpt.com",
      "https://rf.gov.pl/edukacja/baza-wiedzy/najczestsze-pytania-i-odpowiedzi-faq/spor-frankowy-droga-sadowa-i-mediacyjna/?utm_source=chatgpt.com",
      "https://www.openai.com"
    ],
    queries: [
      {
        queryText: "plusy i minusy unieważnienia kredytu w euro",
        fanOuts: [
          {
            id: "q2-gpt-s2-1",
            query: "Polska kredyt euro unieważnienie umowy kredytu w euro orzecznictwo TSUE sądy 2025 2026",
            englishTranslation: "Poland euro mortgage invalidation of euro loan agreement TSUE case law courts 2025 2026",
            category: "Legal",
            badgeText: "Court Realities",
            riskLevel: "High",
            explanation: "Evaluates standard trial times and successful judgment trends for Euro loans across Polish appeal courts."
          },
          {
            id: "q2-gpt-s2-2",
            query: "UOKiK kredyty walutowe euro klauzule abuzywne kredyt denominowany indeksowany euro",
            englishTranslation: "UOKiK foreign currency loans euro abusive clauses denominated indexed euro mortgage",
            category: "Regulatory",
            badgeText: "Contract Split",
            riskLevel: "High",
            explanation: "Drills into UOKiK interventions targeting specific clauses in euro agreements."
          },
          {
            id: "q2-gpt-s2-3",
            query: "Rzecznik Finansowy kredyty walutowe euro unieważnienie umowy frankowe euro",
            englishTranslation: "Financial Ombudsman foreign currency loans euro contract invalidation Swiss Franc euro",
            category: "Regulatory",
            badgeText: "CHF vs EUR Comparison",
            riskLevel: "Medium",
            explanation: "Analyzes whether the Financial Ombudsman treats EUR contracts with identical severity as CHF contracts."
          }
        ]
      }
    ]
  }
];

export const GEMINI_RUNS: GeminiRun[] = [
  {
    id: 1,
    queries: [
      {
        queryText: "czy warto uniewaznic kredyt w euro",
        sources: [
          "onet.pl",
          "votum-sa.pl",
          "bochenekiwspolnicy.pl",
          "kancelariamadejczyk.biz",
          "basiewiczkasprzyk.pl",
          "zyciebezkredytu.pl",
          "tvn24.pl",
          "ostaszewskikredytyfrankowe.pl",
          "cst-kancelaria.pl",
          "kancelaria-kuprewicz.pl",
          "fundacjafair.com",
          "instytutodszkodowan.pl",
          "kmb.legal",
          "chf24.pl",
          "finado.pl",
          "arbitersa.pl"
        ],
        fanOuts: [
          {
            id: "q1-gem-r1-1",
            query: "unieważnienie kredytu w euro forum.",
            englishTranslation: "invalidation of euro mortgage forum",
            category: "Forum",
            badgeText: "Forums Scape",
            riskLevel: "Low",
            explanation: "Scans public peer discussion boards to gauge sentiment and collective customer feedback."
          },
          {
            id: "q1-gem-r1-2",
            query: "czy warto unieważnić kredyt w euro opinie.",
            englishTranslation: "is it worth invalidating euro mortgage opinions",
            category: "Opinions",
            badgeText: "Consumer Opinions",
            riskLevel: "Medium",
            explanation: "Analyzes reviews of legal outcomes and user reports from finalized legal disputes."
          },
          {
            id: "q1-gem-r1-3",
            query: "skutki unieważnienia kredytu w euro.",
            englishTranslation: "effects of invalidating euro mortgage",
            category: "Risk",
            badgeText: "Economic Results",
            riskLevel: "Medium",
            explanation: "Checks immediate cash-flow improvements and potential tax implications of a voided mortgage."
          },
          {
            id: "q1-gem-r1-4",
            query: "koszty unieważnienia kredytu w euro.",
            englishTranslation: "costs of invalidating euro mortgage",
            category: "Costs",
            badgeText: "Financial Burden",
            riskLevel: "Low",
            explanation: "Searches for price estimations of retainer fees and success percentages for specialized attorneys."
          },
          {
            id: "q1-gem-r1-5",
            query: "ryzyko unieważnienia kredytu w euro.",
            englishTranslation: "risk of invalidating euro mortgage",
            category: "Risk",
            badgeText: "Counterclaims & Stress",
            riskLevel: "Medium",
            explanation: "Assesses risks like bank counter-appeals, interest rate fluctuations, and lawsuit delays."
          },
          {
            id: "q1-gem-r1-6",
            query: "korzystne wyroki unieważnienie kredytu weuro.",
            englishTranslation: "favorable judgements invalidating euro mortgage",
            category: "Legal",
            badgeText: "Success Stories",
            riskLevel: "Low",
            explanation: "Highlights successful law firm advertisements and public-relations articles of court wins."
          }
        ]
      },
      {
        queryText: "plusy i minusy unieważnienia kredytu w euro",
        sources: [
          "onet.pl",
          "prawo.pl",
          "kancelariamadejczyk.biz",
          "cst-kancelaria.pl",
          "kancelaria-ab.pl",
          "preda.info",
          "youtube.com",
          "zyciebezkredytu.pl",
          "kancelaria-olc.pl",
          "kancelaria-kuprewicz.pl",
          "szlegal.pl",
          "instytutodszkodowan.pl",
          "fundacjafair.com"
        ],
        fanOuts: [
          {
            id: "q2-gem-r1-1",
            query: "unieważnienie kredytu w euro wady i zalety.",
            englishTranslation: "euro mortgage invalidation pros and cons",
            category: "Opinions",
            badgeText: "Balanced Pros/Cons",
            riskLevel: "Medium",
            explanation: "Weighs immediate loan termination against litigation timeline and stress levels."
          },
          {
            id: "q2-gem-r1-2",
            query: "konsekwencje unieważnienia kredytu we frankach a euro.",
            englishTranslation: "consequences of Swiss Franc vs euro mortgage invalidation",
            category: "Comparative",
            badgeText: "CHF vs EUR",
            riskLevel: "Medium",
            explanation: "Compares established CHF legal precedents with the emerging wave of EUR-related court cases."
          },
          {
            id: "q2-gem-r1-3",
            query: "co się dzieje po unieważnieniu kredytu w euro.",
            englishTranslation: "what happens after voiding euro mortgage",
            category: "Risk",
            badgeText: "Post-Void Settlement",
            riskLevel: "Medium",
            explanation: "Understands mutual financial offset claims between bank and borrower."
          },
          {
            id: "q2-gem-r1-4",
            query: "korzyści i ryzyka unieważnienia kredytu w euro.",
            englishTranslation: "benefits and risks of invalidating euro mortgage",
            category: "Risk",
            badgeText: "Feasibility SWOT",
            riskLevel: "Medium",
            explanation: "A high-level business case assessment of litigious strategies for private homeowners."
          }
        ]
      },
      {
        queryText: "co upowaznia mnie do uniewaznienia kredytu w euro",
        sources: [
          "ledwon-kancelaria.pl",
          "votum-sa.pl",
          "medrecki-law.pl",
          "kancelariamadejczyk.biz",
          "onet.pl",
          "arbitersa.pl",
          "kancelariatmh.pl",
          "kancelaria-ab.pl",
          "pledziewicz.pl",
          "zyciebezkredytu.pl",
          "kancelariafrejowskichf.pl",
          "cst-kancelaria.pl",
          "tvn24.pl"
        ],
        fanOuts: [
          {
            id: "q3-gem-r1-1",
            query: "unieważnienie kredytu w euro podstawy prawne Polska.",
            englishTranslation: "euro mortgage invalidation legal grounds Poland",
            category: "Legal",
            badgeText: "Polish Grounds",
            riskLevel: "Medium",
            explanation: "Queries basic consumer law articles and contract invalidation codes."
          },
          {
            id: "q3-gem-r1-2",
            query: "anulowanie kredytu frankowego a kredyt w euro.",
            englishTranslation: "cancelling Swiss Franc mortgage vs euro mortgage",
            category: "Comparative",
            badgeText: "Grounds Comparison",
            riskLevel: "Medium",
            explanation: "Analyzes if identical pricing arguments used for Swiss Franc are valid for Euro indexes."
          },
          {
            id: "q3-gem-r1-3",
            query: "klauzule abuzywne kredyt euro.",
            englishTranslation: "abusive clauses euro mortgage",
            category: "Legal",
            badgeText: "Abusive Terms search",
            riskLevel: "Medium",
            explanation: "Searches for commercial examples of unfair contract terms in standard bank templates."
          },
          {
            id: "q3-gem-r1-4",
            query: "przesłanki nieważności umowy kredytu w euro.",
            englishTranslation: "prerequisites of invalidation of euro loan agreement",
            category: "Legal",
            badgeText: "Invalidity Prerequisites",
            riskLevel: "Medium",
            explanation: "Finds the exact structural requirements for voiding a commercial bank loan contract."
          },
          {
            id: "q3-gem-r1-5",
            query: "jak unieważnić kredyt walutowy w euro.",
            englishTranslation: "how to invalidate foreign currency mortgage in euro",
            category: "Forum",
            badgeText: "Practical Steps",
            riskLevel: "Medium",
            explanation: "Step-by-step consumer guidelines starting from formal bank requests up to lawsuit preparation."
          }
        ]
      }
    ]
  },
  {
    id: 2,
    queries: [
      {
        queryText: "czy warto uniewaznic kredyt w euro",
        fanOuts: [
          {
            id: "q1-gem-r2-1",
            query: "unieważnienie kredytu w euro w Polsce orzecznictwo.",
            englishTranslation: "euro mortgage invalidation in Poland case law",
            category: "Legal",
            badgeText: "Polish Precedents",
            riskLevel: "Medium",
            explanation: "Scans recent judgments of regional courts to find successful invalidations of Euro loans."
          },
          {
            id: "q1-gem-r2-2",
            query: "anulowanie kredytu frankowego a kredyt w euro.",
            englishTranslation: "cancelling Swiss Franc mortgage vs euro mortgage",
            category: "Comparative",
            badgeText: "Legal Context",
            riskLevel: "Medium",
            explanation: "Analyses if the judicial system handles both currencies with similar levels of consumer sympathy."
          },
          {
            id: "q1-gem-r2-3",
            query: "koszty unieważnienia kredytu w euro.",
            englishTranslation: "costs of invalidating euro mortgage",
            category: "Costs",
            badgeText: "Client Outlay",
            riskLevel: "Low",
            explanation: "Searches for low-cost alternatives, legal aid options, and flat fee structures."
          },
          {
            id: "q1-gem-r2-4",
            query: "korzyści z unieważnienia kredytu w euro.",
            englishTranslation: "benefits of invalidating euro mortgage",
            category: "Opinions",
            badgeText: "Financial Gains",
            riskLevel: "Low",
            explanation: "Maps the primary benefit of avoiding future exchange rate risks on active mortgage balance."
          },
          {
            id: "q1-gem-r2-5",
            query: "ryzyka unieważnienia kredytu w euro.",
            englishTranslation: "risks of invalidating euro mortgage",
            category: "Risk",
            badgeText: "Risk Metrics",
            riskLevel: "Medium",
            explanation: "Evaluates standard risk profiles including counter-claims on capital utilization."
          },
          {
            id: "q1-gem-r2-6",
            query: "alternatywy dla unieważnienia kredytu w euro.",
            englishTranslation: "alternatives to euro mortgage invalidation",
            category: "Forum",
            badgeText: "Settlement Options",
            riskLevel: "Medium",
            explanation: "Looks up court-ordered mediation, bank voluntary conversion rate offers, and regular prepayments."
          },
          {
            id: "q1-gem-r2-7",
            query: "sytuacja prawna kredytów walutowych w Polsce euro.",
            englishTranslation: "legal status of foreign currency loans in Poland euro",
            category: "Legal",
            badgeText: "Legislative Stance",
            riskLevel: "Medium",
            explanation: "Broad analysis of draft laws, state financial authorities, and supervisory commissions (KNF)."
          }
        ]
      },
      {
        queryText: "plusy i minusy unieważnienia kredytu w euro",
        fanOuts: [
          {
            id: "q2-gem-r2-1",
            query: "unieważnienie kredytu w euro plusy i minusy.",
            englishTranslation: "euro mortgage invalidation pros and cons",
            category: "Opinions",
            badgeText: "User Pro/Con Split",
            riskLevel: "Medium",
            explanation: "Collates a standard list of benefits vs drawbacks of beginning litigation."
          },
          {
            id: "q2-gem-r2-2",
            query: "zalety unieważnienia kredytu frankowego w euro.",
            englishTranslation: "advantages of Swiss Franc mortgage invalidation in Euro",
            category: "Comparative",
            badgeText: "Advantage Translation",
            riskLevel: "Low",
            explanation: "Investigates whether Euro borrowers can enjoy the same psychological relief as Swiss Franc borrowers."
          },
          {
            id: "q2-gem-r2-3",
            query: "wady unieważnienia kredytu frankowego w euro.",
            englishTranslation: "disadvantages of Swiss Franc mortgage invalidation in Euro",
            category: "Comparative",
            badgeText: "Disadvantage Translation",
            riskLevel: "Medium",
            explanation: "Evaluates why Euro contracts are often considered more stable and harder to crack in court."
          },
          {
            id: "q2-gem-r2-4",
            query: "konsekwencje unieważnienia kredytu w euro.",
            englishTranslation: "consequences of euro mortgage invalidation",
            category: "Risk",
            badgeText: "Financial Aftermath",
            riskLevel: "Medium",
            explanation: "Gathers direct information about the balance recalculation and final offset step."
          }
        ]
      },
      {
        queryText: "co upowaznia mnie do uniewaznienia kredytu w euro",
        fanOuts: [
          {
            id: "q3-gem-r2-1",
            query: "unieważnienie kredytu w euro w Polsce warunki.",
            englishTranslation: "euro mortgage invalidation in Poland conditions",
            category: "Legal",
            badgeText: "Filing Conditions",
            riskLevel: "Medium",
            explanation: "Assesses the essential filing conditions required by commercial courts to hear a Euro loan case."
          },
          {
            id: "q3-gem-r2-2",
            query: "podstawy unieważnienia kredytu frankowego a euro.",
            englishTranslation: "grounds for Swiss Franc mortgage invalidation vs euro mortgage",
            category: "Comparative",
            badgeText: "Grounds Cross-Map",
            riskLevel: "Medium",
            explanation: "Explains how European Union directives apply uniformly to different currencies containing the same spread structures."
          },
          {
            id: "q3-gem-r2-3",
            query: "prawo bankowe unieważnienie kredytu walutowego.",
            englishTranslation: "banking law invalidation of foreign currency loan",
            category: "Legal",
            badgeText: "Banking Act Rules",
            riskLevel: "Medium",
            explanation: "Searches for direct violations of the core definition of a mortgage under Polish Banking Act principles."
          }
        ]
      }
    ]
  }
];

export const INSIGHTS = {
  gpt: {
    title: "GPT-5.5 is Authority-Seeking",
    archetype: "Regulatory Compliance Auditor",
    focus: "Official, institutional, and legal evidence (UOKiK registers, Rzecznik Finansowy rulings, TSUE judgements).",
    implication: "When a customer asks GPT, they receive high-conviction legal arguments, citing specific clauses and official consumer protections. This accelerates litigation readiness and increases the likelihood that they will proceed with a lawsuit.",
    channel: "Legal Audit & Official Complaints"
  },
  gemini: {
    title: "Gemini 2.5-flash is Commercial-Friendly",
    archetype: "Commercial Feasibility Advisor",
    focus: "Informational, economic, and decision-making queries (forum peer reviews, cost calculations, consumer opinions, law firm services).",
    implication: "When a customer asks Gemini, they are fed local community discussions, lawyer blogs, fee calculators, and risk comparisons. This makes them highly sensitive to competitive pricing and guides them toward choosing specialized law firms.",
    channel: "Social Forums & Advisory Services"
  }
};
