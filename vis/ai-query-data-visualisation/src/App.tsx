import { useState, useEffect, useRef } from "react";
import {
  TrendingUp,
  Scale,
  Cpu,
  Layers,
  Search,
  Info,
  Sparkles,
  Database,
  BookOpen,
  FileText,
  Play,
  Clock,
  ShieldAlert,
  Globe,
  ExternalLink,
  ChevronRight
} from "lucide-react";
import { ORIGINAL_QUERIES, MODELS, INSIGHTS, GPT_SESSIONS, GEMINI_RUNS } from "./data";

export default function App() {
  const [activeQueryId, setActiveQueryId] = useState<string>("q1");
  const [activeGptSessionId, setActiveGptSessionId] = useState<number>(1);
  const [activeGeminiRunId, setActiveGeminiRunId] = useState<number>(1);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState<string>("");
  const [simulationStep, setSimulationStep] = useState<number>(-1);
  const [simLogs, setSimLogs] = useState<string[]>([]);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [selectedGlossary, setSelectedGlossary] = useState<string | null>("TSUE");

  // Dynamic SVG path tracking
  const containerRef = useRef<HTMLDivElement>(null);
  const [paths, setPaths] = useState<Array<{
    from: string;
    to: string;
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    isActive: boolean;
    model: "gpt" | "gemini";
    dashOffset?: number;
  }>>([]);

  // Live clock
  useEffect(() => {
    const updateTime = () => {
      const date = new Date();
      setCurrentTime(
        date.toLocaleTimeString("pl-PL", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false
        }) + " | " + date.toLocaleDateString("pl-PL", {
          year: "numeric",
          month: "long",
          day: "numeric"
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const activeQuery = ORIGINAL_QUERIES.find((q) => q.id === activeQueryId) || ORIGINAL_QUERIES[0];

  // Auto-adjust GPT Session when switching prompts to handle unavailability of Session 2
  useEffect(() => {
    if (activeQueryId !== "q2" && activeGptSessionId === 2) {
      setActiveGptSessionId(1);
    }
  }, [activeQueryId, activeGptSessionId]);

  // Resolve GPT data for active query
  const gptSession = GPT_SESSIONS.find((s) => s.id === activeGptSessionId) || GPT_SESSIONS[0];
  const gptQueryData = gptSession.queries.find((q) => q.queryText === activeQuery.text);
  const gptFanOuts = gptQueryData ? gptQueryData.fanOuts : (GPT_SESSIONS[0].queries.find((q) => q.queryText === activeQuery.text)?.fanOuts || []);
  const gptSafeUrls = gptSession.safeUrls || [];

  // Resolve Gemini data for active query
  const geminiRun = GEMINI_RUNS.find((r) => r.id === activeGeminiRunId) || GEMINI_RUNS[0];
  const geminiQueryData = geminiRun.queries.find((q) => q.queryText === activeQuery.text);
  const geminiFanOuts = geminiQueryData ? geminiQueryData.fanOuts : [];
  const geminiSources = geminiQueryData?.sources || [];

  // Calculate coordinates for SVG paths dynamically on render, resize, or hover change
  const updateCoords = () => {
    if (!containerRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const calculatedPaths: typeof paths = [];

    // Base Nodes
    const queryNode = document.getElementById(`node-query-${activeQueryId}`);
    const gptNode = document.getElementById("node-model-gpt");
    const geminiNode = document.getElementById("node-model-gemini");

    if (!queryNode || !gptNode || !geminiNode) return;

    const qRect = queryNode.getBoundingClientRect();
    const gptRect = gptNode.getBoundingClientRect();
    const gemRect = geminiNode.getBoundingClientRect();

    // Query -> GPT-5.5
    const qToGptActive =
      hoveredNodeId === null ||
      hoveredNodeId === activeQueryId ||
      hoveredNodeId === "gpt" ||
      gptFanOuts.some((fo) => fo.id === hoveredNodeId);

    calculatedPaths.push({
      from: `node-query-${activeQueryId}`,
      to: "node-model-gpt",
      x1: qRect.right - containerRect.left,
      y1: qRect.top - containerRect.top + qRect.height / 2,
      x2: gptRect.left - containerRect.left,
      y2: gptRect.top - containerRect.top + gptRect.height / 2,
      isActive: qToGptActive,
      model: "gpt"
    });

    // Query -> Gemini 2.5-flash
    const qToGeminiActive =
      hoveredNodeId === null ||
      hoveredNodeId === activeQueryId ||
      hoveredNodeId === "gemini" ||
      geminiFanOuts.some((fo) => fo.id === hoveredNodeId);

    calculatedPaths.push({
      from: `node-query-${activeQueryId}`,
      to: "node-model-gemini",
      x1: qRect.right - containerRect.left,
      y1: qRect.top - containerRect.top + qRect.height / 2,
      x2: gemRect.left - containerRect.left,
      y2: gemRect.top - containerRect.top + gemRect.height / 2,
      isActive: qToGeminiActive,
      model: "gemini"
    });

    // GPT-5.5 -> GPT Fan-outs
    gptFanOuts.forEach((fo) => {
      const foNode = document.getElementById(`node-fo-${fo.id}`);
      if (foNode) {
        const foRect = foNode.getBoundingClientRect();
        const pathActive =
          hoveredNodeId === null ||
          hoveredNodeId === "gpt" ||
          hoveredNodeId === activeQueryId ||
          hoveredNodeId === fo.id;

        calculatedPaths.push({
          from: "node-model-gpt",
          to: `node-fo-${fo.id}`,
          x1: gptRect.right - containerRect.left,
          y1: gptRect.top - containerRect.top + gptRect.height / 2,
          x2: foRect.left - containerRect.left,
          y2: foRect.top - containerRect.top + foRect.height / 2,
          isActive: pathActive,
          model: "gpt"
        });
      }
    });

    // Gemini 2.5-flash -> Gemini Fan-outs
    geminiFanOuts.forEach((fo) => {
      const foNode = document.getElementById(`node-fo-${fo.id}`);
      if (foNode) {
        const foRect = foNode.getBoundingClientRect();
        const pathActive =
          hoveredNodeId === null ||
          hoveredNodeId === "gemini" ||
          hoveredNodeId === activeQueryId ||
          hoveredNodeId === fo.id;

        calculatedPaths.push({
          from: "node-model-gemini",
          to: `node-fo-${fo.id}`,
          x1: gemRect.right - containerRect.left,
          y1: gemRect.top - containerRect.top + gemRect.height / 2,
          x2: foRect.left - containerRect.left,
          y2: foRect.top - containerRect.top + foRect.height / 2,
          isActive: pathActive,
          model: "gemini"
        });
      }
    });

    setPaths(calculatedPaths);
  };

  // Re-run calculations when active elements change or user resizes window
  useEffect(() => {
    updateCoords();
    const timer = setTimeout(updateCoords, 100);
    window.addEventListener("resize", updateCoords);
    return () => {
      window.removeEventListener("resize", updateCoords);
      clearTimeout(timer);
    };
  }, [activeQueryId, hoveredNodeId, activeGptSessionId, activeGeminiRunId]);

  // Handle Query Simulation Pipeline
  const startSimulation = () => {
    if (isSimulating) return;
    setIsSimulating(true);
    setSimulationStep(0);
    setSimLogs(["[SYSTEM] Inicjowanie wielościeżkowej analizy zapytania..."]);

    const logSteps = [
      () => {
        setSimulationStep(1);
        setSimLogs((prev) => [
          ...prev,
          `[USER] Wykryte zapytanie wejściowe: "${activeQuery.text}"`,
          `[NLP] Język: polski (PL). Wykryty produkt finansowy: Kredyt indeksowany/denominowany w EUR.`
        ]);
      },
      () => {
        setSimulationStep(2);
        setSimLogs((prev) => [
          ...prev,
          `[ENGINE: GPT-5.5 (thinking medium)] Przetwarzanie wektorowe (Sesja ${activeGptSessionId})...`,
          `[GPT-5.5] Strategia: Authority-Seeking. Budowanie pytań o orzecznictwo i bazy regulacyjne.`,
          ...gptFanOuts.map((fo) => `[GPT-5.5 Fan-Out] Wygenerowano: "${fo.query}"`)
        ]);
      },
      () => {
        setSimulationStep(3);
        setSimLogs((prev) => [
          ...prev,
          `[ENGINE: Gemini 2.5-flash] Przetwarzanie wektorowe (Przebieg ${activeGeminiRunId})...`,
          `[Gemini 2.5-flash] Strategia: Commercial & Peer Sentiment. Budowanie pytań o opinie i rentowność.`,
          ...geminiFanOuts.map((fo) => `[Gemini Fan-Out] Wygenerowano: "${fo.query}"`)
        ]);
      },
      () => {
        setSimulationStep(4);
        setSimLogs((prev) => [
          ...prev,
          `[SYSTEM] Proces replikacji i rozproszenia (Fan-Out) zakończony pomyślnie.`,
          `[WYNIK] Wykryto znaczącą FRAGMENTACJĘ MODELI. GPT (${activeGptSessionId === 1 ? "Sesja 1" : "Sesja 2"}) indukuje kroki procesowe, Gemini (Run ${activeGeminiRunId}) generuje poszukiwania operacyjno-handlowe i sentiment.`
        ]);
        setIsSimulating(false);
      }
    ];

    let currentLog = 0;
    const interval = setInterval(() => {
      if (currentLog < logSteps.length) {
        logSteps[currentLog]();
        currentLog++;
        updateCoords();
      } else {
        clearInterval(interval);
      }
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col selection:bg-purple-100 selection:text-purple-900 relative">
      {/* Glow Ambient Orbs */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-purple-100/40 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-blue-100/30 rounded-full blur-[100px] pointer-events-none" />

      {/* TOP BANK EXECUTIVE HEADER */}
      <header className="bg-white border-b border-slate-200/80 text-slate-800 shadow-sm relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 py-5 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-center md:justify-between relative z-10">
          <div>
            <div className="flex items-center space-x-3">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800 border border-purple-200/50 shadow-sm animate-pulse">
                LIVE ANALYTICS
              </span>
              <span className="text-xs text-slate-500 font-mono tracking-wider">
                BOARD LEVEL BRIEFING (RAPORT ZARZĄDCZY)
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight font-display mt-1 bg-gradient-to-r from-slate-950 via-slate-800 to-purple-700 bg-clip-text text-transparent">
              AI Model Fragmentation Analysis
            </h1>
            <p className="text-slate-600 text-xs mt-0.5 max-w-xl">
              Analityka behawioralna i dekonstrukcja zapytań klientów kredytów w EUR w silnikach AI (GPT-5.5 vs Gemini 2.5-flash) z uwzględnieniem sesji wieloturowych.
            </p>
          </div>
          
          <div className="mt-4 md:mt-0 flex flex-col md:items-end space-y-1.5 font-mono text-xs">
            <div className="flex items-center space-x-2 text-slate-700 bg-slate-100 px-3 py-1 rounded-lg border border-slate-200">
              <Clock size={13} className="text-purple-600" />
              <span>{currentTime || "00:00:00 | 2026"}</span>
            </div>
            <div className="flex items-center space-x-2 text-emerald-600">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" />
              <span>Połączenie Szyfrowane (MFI SSL)</span>
            </div>
            <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-800 border border-purple-200 text-[9px] tracking-widest font-bold self-start md:self-auto uppercase">
              Klasyfikacja: Ściśle Poufne
            </span>
          </div>
        </div>
      </header>

      {/* EXECUTIVE SUMMARY PANEL */}
      <section className="px-4 py-6 bg-slate-100/50 border-b border-purple-100/40 relative z-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center space-x-2 mb-4">
            <Layers className="text-purple-600" size={18} />
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest font-display">
              Executive Summary & Business Insights (Podsumowanie Menedżerskie)
            </h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* GPT-5.5 Card */}
            <div className="p-5 rounded-2xl bg-white border-l-4 border-purple-600 border border-slate-200 relative overflow-hidden transition-all duration-300 hover:shadow-md hover:border-purple-200">
              <div className="absolute top-0 right-0 translate-x-4 -translate-y-4 w-24 h-24 bg-purple-500/5 rounded-full" />
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-purple-50 text-purple-600 rounded-xl border border-purple-200/50">
                  <Scale size={20} />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-purple-600 font-bold tracking-wider uppercase">ARCHETYP: AUDYTOR REGULACYJNY</span>
                  <h3 className="text-base font-bold text-slate-900 font-display mt-0.5">
                    GPT-5.5 (thinking medium) jest Authority-Seeking
                  </h3>
                  <p className="text-slate-600 text-xs mt-2 leading-relaxed">
                    Użytkownik otrzymuje głębokie audyty prawne oparte o wyroki TSUE, mapę klauzul abuzywnych Rzecznika Finansowego oraz rejestry niedozwolonych postanowień UOKiK.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="text-[10px] bg-purple-50 text-purple-700 font-semibold px-2 py-1 rounded border border-purple-200/50">
                      Legal Evidence Cluster
                    </span>
                    <span className="text-[10px] bg-red-50 text-red-700 font-semibold px-2 py-1 rounded border border-red-200/30">
                      Wysokie Ryzyko Litigacji Direct-to-Court
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Gemini Card */}
            <div className="p-5 rounded-2xl bg-white border-l-4 border-amber-500 border border-slate-200 relative overflow-hidden transition-all duration-300 hover:shadow-md hover:border-amber-200">
              <div className="absolute top-0 right-0 translate-x-4 -translate-y-4 w-24 h-24 bg-amber-500/5 rounded-full" />
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-amber-50 text-amber-700 rounded-xl border border-amber-200/50">
                  <TrendingUp size={20} />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-amber-600 font-bold tracking-wider uppercase">ARCHETYP: DORADCA KOMERCYJNY</span>
                  <h3 className="text-base font-bold text-slate-900 font-display mt-0.5">
                    Gemini 2.5-flash jest Commercial-Friendly
                  </h3>
                  <p className="text-slate-600 text-xs mt-2 leading-relaxed">
                    Priorytetyzuje aspekty ekonomiczne: koszty procesu, prowizje kancelarii frankowo-euro, opinie na forach społecznościowych, a także ewentualne ryzyka finansowe i alternatywne ścieżki (ugody).
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="text-[10px] bg-amber-50 text-amber-700 font-semibold px-2 py-1 rounded border border-amber-200/50">
                      Consumer Intent Cluster
                    </span>
                    <span className="text-[10px] bg-blue-50 text-blue-700 font-semibold px-2 py-1 rounded border border-blue-200/30">
                      Poszukiwanie Ugody i Alternatyw
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* MAIN INTERACTIVE AREA */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* COLUMN 1 & 2: DYNAMIC FLOW CANVAS & CONTROLS */}
        <div className="lg:col-span-2 flex flex-col space-y-6">
          
          {/* FLOW INTERACTIVE HEADER */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-800 font-display flex items-center space-x-2 uppercase tracking-wide">
                  <Database size={16} className="text-purple-600" />
                  <span>Krok 1: Wybierz wejściowe zapytanie klienta</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Kliknij jedno z poniższych zapytań, aby sprawdzić ścieżkę rozszczepienia zapytania w tle w różnych silnikach.
                </p>
              </div>
              <div className="flex space-x-2">
                <button 
                  onClick={startSimulation}
                  disabled={isSimulating}
                  className={`inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                    isSimulating 
                    ? "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed" 
                    : "bg-purple-600 text-white hover:bg-purple-700 shadow-sm border border-purple-500"
                  }`}
                >
                  <Play size={12} className={isSimulating ? "animate-spin" : ""} />
                  <span>{isSimulating ? "Symulacja..." : "Symuluj Replikację"}</span>
                </button>
              </div>
            </div>

            {/* QUERY TABS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              {ORIGINAL_QUERIES.map((q) => {
                const isActive = activeQueryId === q.id;
                return (
                  <button
                    key={q.id}
                    id={`tab-btn-${q.id}`}
                    onClick={() => {
                      if (!isSimulating) {
                        setActiveQueryId(q.id);
                        setSimulationStep(-1);
                      }
                    }}
                    className={`text-left p-4 rounded-xl border transition-all relative overflow-hidden flex flex-col justify-between ${
                      isActive
                        ? "bg-purple-50/80 border-purple-500 shadow-sm ring-1 ring-purple-500/20"
                        : "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700"
                    }`}
                  >
                    {isActive && (
                      <span className="absolute top-0 right-0 bg-purple-600 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-bl-lg tracking-wider">
                        AKTYWNE
                      </span>
                    )}
                    <div>
                      <span className="text-[9px] font-mono text-purple-600 font-bold block uppercase tracking-wide">
                        ZAPYTANIE KLIENTA {q.id === "q1" ? "ALPHA" : q.id === "q2" ? "BETA" : "GAMMA"}
                      </span>
                      <span className="text-xs font-semibold text-slate-800 mt-1 block font-mono leading-tight">
                        &quot;{q.text}&quot;
                      </span>
                    </div>
                    <div className="mt-3">
                      <span className="text-[10px] text-slate-500 italic block leading-snug">
                        ENG: &quot;{q.english}&quot;
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* DYNAMIC FLOW DIAGRAM CANVAS */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex-1 flex flex-col relative min-h-[550px]">
            
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-display">
                  Wizualizacja Przepływu Zapytań (Sankey Tree z Sesjami)
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Najedź kursorem na dowolny węzeł, aby podświetlić powiązane ścieżki i logiczne powiązania.
                </p>
              </div>
              <div className="flex items-center space-x-3 text-[10px] font-mono">
                <span className="flex items-center space-x-1.5">
                  <span className="w-2.5 h-1 bg-purple-500 rounded" />
                  <span className="text-purple-700 font-medium font-bold">GPT {activeGptSessionId === 1 ? "S1" : "S2"}</span>
                </span>
                <span className="flex items-center space-x-1.5">
                  <span className="w-2.5 h-1 bg-amber-500 rounded" />
                  <span className="text-amber-700 font-medium font-bold">Gemini R{activeGeminiRunId}</span>
                </span>
              </div>
            </div>

            {/* FLOW CHART WORKSPACE */}
            <div ref={containerRef} className="relative flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 items-start py-5 px-3 rounded-xl bg-slate-50 border border-slate-200 overflow-visible">
              
              {/* ABSOLUTE BACKGROUND DYNAMIC SVG FOR PATHS */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-10 overflow-visible">
                <defs>
                  {/* GPT glowing active path gradient */}
                  <linearGradient id="gpt-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#c084fc" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#581c87" stopOpacity="0.8" />
                  </linearGradient>
                  {/* Gemini glowing active path gradient */}
                  <linearGradient id="gemini-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#d97706" stopOpacity="0.8" />
                  </linearGradient>
                  {/* Shadow filter for glowing active connections */}
                  <filter id="glow-purple" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor="#8b5cf6" floodOpacity="0.4" />
                  </filter>
                  <filter id="glow-amber" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor="#f59e0b" floodOpacity="0.4" />
                  </filter>
                </defs>

                {/* Render background paths */}
                {paths.map((p, index) => {
                  const controlX = p.x1 + (p.x2 - p.x1) * 0.55;
                  const pathString = `M ${p.x1} ${p.y1} C ${controlX} ${p.y1}, ${controlX} ${p.y2}, ${p.x2} ${p.y2}`;
                  
                  return (
                    <g key={index}>
                      {/* Underlying Shadow/Glow curve for active paths */}
                      {p.isActive && (
                        <path
                          d={pathString}
                          fill="none"
                          stroke={p.model === "gpt" ? "#c084fc" : "#fcd34d"}
                          strokeWidth="8"
                          strokeLinecap="round"
                          opacity="0.15"
                        />
                      )}
                      
                      {/* Main connection curve */}
                      <path
                        d={pathString}
                        fill="none"
                        stroke={
                          p.isActive 
                            ? (p.model === "gpt" ? "url(#gpt-grad)" : "url(#gemini-grad)") 
                            : "#cbd5e1"
                        }
                        strokeWidth={p.isActive ? "3.5" : "1.5"}
                        strokeLinecap="round"
                        filter={p.isActive ? (p.model === "gpt" ? "url(#glow-purple)" : "url(#glow-amber)") : undefined}
                        className="transition-all duration-300"
                        strokeDasharray={p.isActive && (simulationStep >= 0 || hoveredNodeId !== null) ? "6 5" : undefined}
                        style={{
                          animation: p.isActive && (simulationStep >= 0 || hoveredNodeId !== null) 
                            ? "dash 25s linear infinite" 
                            : undefined
                        }}
                      />
                    </g>
                  );
                })}
              </svg>

              {/* COLUMN 1: ORIGINAL USER QUERY (Left) */}
              <div className="flex flex-col space-y-4 z-20">
                <span className="text-[10px] font-mono text-slate-500 font-bold block uppercase tracking-wider text-center md:text-left">
                  1. WEJŚCIOWE ZAPYTANIE
                </span>
                
                <div
                  id={`node-query-${activeQuery.id}`}
                  onMouseEnter={() => setHoveredNodeId(activeQuery.id)}
                  onMouseLeave={() => setHoveredNodeId(null)}
                  className={`p-4 rounded-xl bg-white border shadow-sm transition-all duration-300 cursor-pointer ${
                    hoveredNodeId === activeQuery.id 
                      ? "ring-2 ring-purple-500 border-purple-400 shadow-purple-100" 
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center space-x-2 text-purple-600 mb-2">
                    <Search size={14} />
                    <span className="text-[10px] font-bold font-mono tracking-wide uppercase bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                      Original Query
                    </span>
                  </div>
                  <p className="text-xs font-mono font-medium text-slate-800 leading-relaxed">
                    &quot;{activeQuery.text}&quot;
                  </p>
                  <div className="mt-2.5 pt-2 border-t border-slate-100 flex justify-between items-center text-[10px] text-slate-500">
                    <span className="italic">ENG: &quot;{activeQuery.english}&quot;</span>
                  </div>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200 text-[10px] text-slate-500 space-y-1 shadow-sm">
                  <p className="font-semibold text-slate-700">Kontekst klienta:</p>
                  <p className="leading-normal">{activeQuery.context}</p>
                </div>

                {/* QUICK TIPS ON DATA SELECTION */}
                <div className="p-3 bg-purple-50/60 rounded-xl border border-purple-100 text-[10px] text-slate-600">
                  <div className="flex items-center space-x-1 mb-1 text-purple-700 font-semibold">
                    <Info size={11} />
                    <span>Wieloturowość:</span>
                  </div>
                  <p className="leading-snug">
                    Użyj przełączników sesji w środkowej kolumnie, aby zaobserwować ewolucję zachowań AI przy kolejnych pytaniach tła.
                  </p>
                </div>
              </div>

              {/* COLUMN 2: THE AI INTERPRETERS (Middle) */}
              <div className="flex flex-col space-y-6 z-20 py-2">
                <span className="text-[10px] font-mono text-slate-500 font-bold block uppercase tracking-wider text-center">
                  2. SILNIK ROZPRZĘGAJĄCY AI
                </span>

                {/* GPT NODE */}
                <div
                  id="node-model-gpt"
                  onMouseEnter={() => setHoveredNodeId("gpt")}
                  onMouseLeave={() => setHoveredNodeId(null)}
                  className={`p-4 rounded-xl bg-white border transition-all duration-300 cursor-pointer ${
                    hoveredNodeId === "gpt"
                      ? "ring-2 ring-purple-500 border-purple-400 shadow-md shadow-purple-100"
                      : "border-slate-200 shadow-sm hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[8px] font-bold bg-purple-100 text-purple-800 border border-purple-200/60 tracking-wider uppercase">
                      Authority Specialist
                    </span>
                    <Cpu size={14} className="text-purple-600" />
                  </div>
                  <h4 className="text-sm font-bold tracking-tight font-display text-slate-800">
                    GPT-5.5 (thinking medium)
                  </h4>
                  <p className="text-[9px] text-slate-500 font-mono mt-0.5">
                    Regulatory compliance audit
                  </p>
                  
                  {/* Session Selection */}
                  <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between gap-1">
                    <span className="text-[8px] font-mono text-slate-500">KONTEKST SESJI:</span>
                    <div className="flex bg-slate-100 rounded border border-slate-200 p-0.5">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveGptSessionId(1);
                        }}
                        className={`text-[8px] font-bold px-1.5 py-0.5 rounded transition-all ${
                          activeGptSessionId === 1
                            ? "bg-white text-purple-700 shadow-sm border border-purple-100/60"
                            : "text-slate-500 hover:text-slate-800"
                        }`}
                      >
                        Sesja 1
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (activeQueryId === "q2") {
                            setActiveGptSessionId(2);
                          }
                        }}
                        disabled={activeQueryId !== "q2"}
                        className={`text-[8px] font-bold px-1.5 py-0.5 rounded transition-all ${
                          activeQueryId !== "q2"
                            ? "text-slate-400 cursor-not-allowed opacity-40"
                            : activeGptSessionId === 2
                            ? "bg-white text-purple-700 shadow-sm border border-purple-100/60"
                            : "text-slate-500 hover:text-slate-800"
                        }`}
                        title={activeQueryId !== "q2" ? "Sesja 2 dostępna tylko dla pytania BETA (q2)" : "Przełącz na sesję 2"}
                      >
                        Sesja 2
                      </button>
                    </div>
                  </div>

                  {/* Grounding Source Count & List */}
                  <div className="mt-3 pt-2.5 border-t border-slate-100">
                    <div className="flex items-center justify-between text-[9px] font-mono text-purple-700">
                      <span>GROUNDING (BEZPIECZNE URL):</span>
                      <span className="bg-purple-50 text-purple-700 px-1 py-0.2 rounded border border-purple-200/60 text-[8px] font-bold">
                        {gptSafeUrls.length} źródeł
                      </span>
                    </div>
                    
                    {/* Collapsible/Scrollable lists */}
                    <div className="mt-1.5 max-h-[90px] overflow-y-auto scrollbar-thin space-y-1 pr-1">
                      {gptSafeUrls.map((url, index) => {
                        let label = "Safe Web";
                        if (url.includes("uokik.gov.pl")) label = "UOKiK Portal";
                        else if (url.includes("rf.gov.pl")) label = "Ombudsman";
                        else if (url.includes("tvn24.pl")) label = "Wiadomości";
                        else if (url.includes("openai.com")) label = "API Grounding";
                        
                        return (
                          <div key={index} className="text-[8px] font-mono bg-slate-50 hover:bg-purple-50/40 p-1 rounded border border-slate-200/80 flex justify-between gap-1 items-center transition-colors">
                            <span className="text-slate-600 truncate max-w-[100px]" title={url}>{url}</span>
                            <span className="text-[7px] text-purple-700 px-1 py-0.2 bg-purple-100 border border-purple-200/60 rounded flex-shrink-0 font-bold uppercase">{label}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* GEMINI NODE */}
                <div
                  id="node-model-gemini"
                  onMouseEnter={() => setHoveredNodeId("gemini")}
                  onMouseLeave={() => setHoveredNodeId(null)}
                  className={`p-4 rounded-xl bg-white border transition-all duration-300 pointer-events-auto cursor-pointer ${
                    hoveredNodeId === "gemini"
                      ? "ring-2 ring-amber-500 border-amber-400 shadow-md shadow-amber-100"
                      : "border-slate-200 shadow-sm hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[8px] font-bold bg-amber-100 text-amber-800 border border-amber-200/60 tracking-wider uppercase">
                      Market Analyst
                    </span>
                    <Sparkles size={14} className="text-amber-600" />
                  </div>
                  <h4 className="text-sm font-bold tracking-tight font-display text-slate-800">
                    Gemini 2.5-flash
                  </h4>
                  <p className="text-[9px] text-slate-500 font-mono mt-0.5">
                    Commercial intent mapping
                  </p>

                  {/* Run Selection */}
                  <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between gap-1">
                    <span className="text-[8px] font-mono text-slate-500">KONTEKST PRZEBIEGU:</span>
                    <div className="flex bg-slate-100 rounded border border-slate-200 p-0.5">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveGeminiRunId(1);
                        }}
                        className={`text-[8px] font-bold px-1.5 py-0.5 rounded transition-all ${
                          activeGeminiRunId === 1
                            ? "bg-white text-amber-700 shadow-sm border border-amber-100/60"
                            : "text-slate-500 hover:text-slate-800"
                        }`}
                      >
                        Run 1
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveGeminiRunId(2);
                        }}
                        className={`text-[8px] font-bold px-1.5 py-0.5 rounded transition-all ${
                          activeGeminiRunId === 2
                            ? "bg-white text-amber-700 shadow-sm border border-amber-100/60"
                            : "text-slate-500 hover:text-slate-800"
                        }`}
                      >
                        Run 2
                      </button>
                    </div>
                  </div>

                  {/* Grounding Sources / Websites */}
                  <div className="mt-3 pt-2.5 border-t border-slate-100">
                    <div className="flex items-center justify-between text-[9px] font-mono text-amber-700">
                      <span>ŹRÓDŁA KOMERCYJNE (SENTIMENT):</span>
                      <span className="bg-amber-50 text-amber-700 px-1 py-0.2 rounded border border-amber-200/60 text-[8px] font-bold">
                        {geminiSources.length > 0 ? `${geminiSources.length} domen` : "Grounding podstawowy"}
                      </span>
                    </div>

                    {geminiSources.length > 0 ? (
                      <div className="mt-1.5 max-h-[90px] overflow-y-auto scrollbar-thin space-y-1 pr-1">
                        {geminiSources.map((source, index) => {
                          let cat = "Portal";
                          if (source.includes("kancelaria") || source.includes("legal") || source.includes("wspolnicy") || source.includes("law")) {
                            cat = "Kancelaria";
                          } else if (source.includes("zyciebezkredytu") || source.includes("votum") || source.includes("chf24")) {
                            cat = "Agencja sporu";
                          } else if (source.includes("youtube") || source.includes("forum")) {
                            cat = "Społeczność";
                          }

                          return (
                            <div key={index} className="text-[8px] font-mono bg-slate-50 hover:bg-amber-50/40 p-1 rounded border border-slate-200/80 flex justify-between gap-1 items-center transition-colors">
                              <span className="text-slate-600 truncate max-w-[100px]" title={source}>{source}</span>
                              <span className="text-[7px] text-amber-700 px-1 py-0.2 bg-amber-100 border border-amber-200/60 rounded flex-shrink-0 font-bold uppercase">{cat}</span>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-[8px] text-slate-500 italic mt-1 leading-normal">
                        Brak wyodrębnionych domen komercyjnych w tym przebiegu. Grounding odbywa się przez ogólną bazę wiedzy Google.
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* COLUMN 3: FAN-OUT QUERIES (Right) */}
              <div className="flex flex-col space-y-3 z-20">
                <span className="text-[10px] font-mono text-slate-500 font-bold block uppercase tracking-wider text-center md:text-left">
                  3. WYGENEROWANE ZAPYTANIA TŁA
                </span>

                {/* GPT Fan outs */}
                <div className="space-y-2 pb-4 border-b border-dashed border-slate-200">
                  <span className="text-[9px] font-mono text-purple-700 block uppercase tracking-wider font-bold">
                    Fan-Out GPT (Sesja {activeGptSessionId} - Legal Focus):
                  </span>
                  {gptFanOuts.map((fo) => {
                    const isHighlighted = hoveredNodeId === null || hoveredNodeId === "gpt" || hoveredNodeId === fo.id || hoveredNodeId === activeQuery.id;
                    return (
                      <div
                        key={fo.id}
                        id={`node-fo-${fo.id}`}
                        onMouseEnter={() => setHoveredNodeId(fo.id)}
                        onMouseLeave={() => setHoveredNodeId(null)}
                        className={`p-2.5 rounded-lg border bg-white transition-all duration-300 cursor-pointer text-left ${
                          isHighlighted 
                            ? (hoveredNodeId === fo.id ? "ring-2 ring-purple-500 border-purple-400 shadow-md" : "border-slate-200")
                            : "opacity-30"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[8px] font-bold bg-purple-50 text-purple-700 border border-purple-200/60 uppercase">
                            {fo.badgeText}
                          </span>
                          <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[8px] font-bold ${
                            fo.riskLevel === "High" ? "bg-red-50 text-red-700 border border-red-200/30" : "bg-amber-50 text-amber-700 border border-amber-200/30"
                          }`}>
                            RYZYKO {fo.riskLevel === "High" ? "Wysokie" : "Średnie"}
                          </span>
                        </div>
                        <p className="text-[10px] font-mono text-slate-800 leading-snug">
                          &quot;{fo.query}&quot;
                        </p>
                        <p className="text-[9px] text-slate-500 italic mt-1 leading-normal">
                          ENG: &quot;{fo.englishTranslation}&quot;
                        </p>
                      </div>
                    );
                  })}
                </div>

                {/* Gemini Fan outs */}
                <div className="space-y-2">
                  <span className="text-[9px] font-mono text-amber-700 block uppercase tracking-wider font-bold">
                    Fan-Out Gemini (Run {activeGeminiRunId} - Commercial Focus):
                  </span>
                  {geminiFanOuts.map((fo) => {
                    const isHighlighted = hoveredNodeId === null || hoveredNodeId === "gemini" || hoveredNodeId === fo.id || hoveredNodeId === activeQuery.id;
                    return (
                      <div
                        key={fo.id}
                        id={`node-fo-${fo.id}`}
                        onMouseEnter={() => setHoveredNodeId(fo.id)}
                        onMouseLeave={() => setHoveredNodeId(null)}
                        className={`p-2.5 rounded-lg border bg-white transition-all duration-300 cursor-pointer text-left ${
                          isHighlighted 
                            ? (hoveredNodeId === fo.id ? "ring-2 ring-amber-500 border-amber-400 shadow-md" : "border-slate-200")
                            : "opacity-30"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[8px] font-bold bg-amber-50 text-amber-700 border border-amber-200/60 uppercase">
                            {fo.badgeText}
                          </span>
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[8px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                            RYZYKO {fo.riskLevel === "Medium" ? "Średnie" : "Niskie"}
                          </span>
                        </div>
                        <p className="text-[10px] font-mono text-slate-800 leading-snug">
                          &quot;{fo.query}&quot;
                        </p>
                        <p className="text-[9px] text-slate-500 italic mt-1 leading-normal">
                          ENG: &quot;{fo.englishTranslation}&quot;
                        </p>
                      </div>
                    );
                  })}
                </div>

              </div>

            </div>

            {/* QUICK PLAYBACK ANIMATION INSTRUCTIONS */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500">
              <div className="flex items-center space-x-1.5">
                <Info size={14} className="text-purple-600" />
                <span>Zapytania typu <strong>Fan-Out</strong> reprezentują faktycznie wykonywane zapytania wyszukiwarki w tle w celach uziemienia (grounding).</span>
              </div>
              <div 
                className="text-purple-600 font-semibold cursor-pointer hover:underline flex items-center space-x-1" 
                onClick={() => { 
                  const nextId = activeQueryId === "q1" ? "q2" : activeQueryId === "q2" ? "q3" : "q1";
                  setActiveQueryId(nextId); 
                  setSimulationStep(-1); 
                }}
              >
                <span>Następne zapytanie testowe</span>
                <ChevronRight size={13} />
              </div>
            </div>

          </div>

          {/* SIMULATION TERMINAL PANEL */}
          {simulationStep >= 0 && (
            <div className="bg-slate-900 text-slate-100 p-5 rounded-2xl font-mono text-xs shadow-md border border-purple-200/20">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  </div>
                  <span className="font-bold text-slate-300">SYMULATOR EKSPANSJI ZAPYTAŃ RE-WRITE v1.3</span>
                </div>
                <button 
                  onClick={() => setSimulationStep(-1)}
                  className="text-[10px] hover:text-white px-2 py-0.5 bg-slate-800 rounded border border-slate-700 transition-colors"
                >
                  Zamknij podgląd logów
                </button>
              </div>
              
              <div className="space-y-2 max-h-[220px] overflow-y-auto scrollbar-thin">
                {simLogs.map((log, i) => (
                  <div 
                    key={i} 
                    className={`${
                      log.startsWith("[SYSTEM]") ? "text-slate-500" :
                      log.startsWith("[USER]") ? "text-purple-400 font-bold" :
                      log.includes("GPT") ? "text-purple-300" :
                      log.includes("Gemini") ? "text-amber-300" : "text-slate-300"
                    }`}
                  >
                    {log}
                  </div>
                ))}
              </div>
              
              <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-500">
                <span>POSTĘP SYMULACJI: {simulationStep + 1}/5 KROKÓW</span>
                <span className="animate-pulse text-purple-400 font-bold">SILNIK RE-WRITE SYNCED (ACTIVE SESSIONS)</span>
              </div>
            </div>
          )}

        </div>

        {/* COLUMN 3: CORPORATE STRATEGIC BRIEFING PANELS (Right Column of Page) */}
        <div className="space-y-6">
          
          {/* BANK COMPLIANCE & LITIGATION RISK METRICS */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider font-display mb-3 flex items-center space-x-2 border-b border-slate-100 pb-2">
              <ShieldAlert className="text-red-500" size={18} />
              <span>Matryca Ryzyk Zarządczych</span>
            </h3>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              Oceny ryzyka operacyjnego i prawnego wynikające z asymetrii modelowej odpowiedzi AI dla polskiego sektora bankowego.
            </p>

            <div className="space-y-4">
              
              {/* Risk 1 */}
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-slate-950">Litigacja Direct-to-Court</span>
                  <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-red-100 text-red-800 uppercase border border-red-200/50">Krytyczne (High)</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-normal">
                  Wywołane przez silnik GPT-5.5 skierowany na TSUE i UOKiK. Klient jest natychmiast uzbrajany w argumentację prawną, co drastycznie skraca czas do wytoczenia powództwa bankowi.
                </p>
                <div className="mt-2 text-[10px] font-mono text-red-800 bg-red-50/50 p-1.5 rounded border border-red-100">
                  Wektor: Oficjalna sprawa sądowa
                </div>
              </div>

              {/* Risk 2 */}
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-slate-950">Odpływ do Kancelarii Prawnych</span>
                  <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-amber-100 text-amber-800 uppercase border border-amber-200/50">Średnie (Medium)</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-normal">
                  Wywołane przez silnik Gemini, który kieruje użytkownika bezpośrednio na fora i opinie, gdzie dominują sponsorowane wpisy wyspecjalizowanych kancelarii prawnych (&quot;kancelarie frankowe/euro&quot;).
                </p>
                <div className="mt-2 text-[10px] font-mono text-amber-300 bg-amber-950/60 p-1.5 rounded border border-amber-900/40">
                  Wektor: Pośrednicy komercyjni
                </div>
              </div>

              {/* Risk 3 */}
              <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-slate-950">Wrażliwość na Koszty Procesu</span>
                  <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-blue-100 text-blue-800 uppercase border border-blue-200/50">Monitorowane</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-normal">
                  Klienci intensywnie poszukują analiz opłacalności finansowej unieważnienia kredytu. Może to stanowić okazję do zaoferowania alternatywnych ugód pozasądowych bezpośrednio od banku.
                </p>
                <div className="mt-2 text-[10px] font-mono text-blue-800 bg-blue-50/50 p-1.5 rounded border border-blue-100">
                  Wektor: Finanse & Kalkulatory
                </div>
              </div>

            </div>
          </div>

          {/* GLOSSARY & REGULATORY REFERENCE CABINET */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider font-display mb-3 flex items-center space-x-2 border-b border-slate-100 pb-2">
              <BookOpen className="text-purple-600" size={18} />
              <span>Słownik Regulacyjny</span>
            </h3>
            
            {/* Tab Switches inside side-cabinet */}
            <div className="grid grid-cols-3 gap-1 p-1 bg-slate-50 rounded-lg mb-3 border border-slate-200">
              {["TSUE", "UOKiK", "RF"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setSelectedGlossary(tab)}
                  className={`text-[10px] font-bold py-1.5 rounded transition-all ${
                    selectedGlossary === tab
                      ? "bg-white text-purple-700 shadow-sm border border-purple-100/60"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Selected description */}
            <div className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200">
              {selectedGlossary === "TSUE" && (
                <div>
                  <p className="font-bold text-purple-700 mb-1">TSUE (Trybunał Sprawiedliwości UE)</p>
                  <p>Europejski organ orzeczniczy. Wyroki TSUE (np. sprawa Dziubak, C-520/21) stanowią fundament prawny, na którym polscy konsumenci opierają roszczenia o unieważnienie umów hipotecznych zawierających niedozwolone klauzule denominacyjne.</p>
                </div>
              )}
              {selectedGlossary === "UOKiK" && (
                <div>
                  <p className="font-bold text-purple-700 mb-1">UOKiK (Urząd Ochrony Konkurencji)</p>
                  <p>Polski organ antymonopolowy prowadzący rejestr klauzul niedozwolonych (abuzywnych). Jeśli dany zapis umowy banku znajduje się w rejestrze UOKiK, sąd powszechny automatycznie uznaje go za nieobowiązujący od momentu podpisania umowy.</p>
                </div>
              )}
              {selectedGlossary === "RF" && (
                <div>
                  <p className="font-bold text-purple-700 mb-1">RF (Rzecznik Finansowy / Financial Ombudsman)</p>
                  <p>Państwowa instytucja powołana do ochrony klientów podmiotów rynku finansowego. Wydaje oficjalne, pisemne opinie prawne wspierające kredytobiorców na etapie sporów przedsądowych i w trakcie postępowań sądowych.</p>
                </div>
              )}
            </div>
          </div>

          {/* RECOMMENDATIONS & NEXT STEPS */}
          <div className="bg-gradient-to-br from-purple-50 to-slate-50 text-slate-800 p-5 rounded-2xl shadow-sm border border-purple-100/60">
            <h3 className="text-sm font-bold uppercase tracking-wider font-display mb-3 text-purple-800 flex items-center space-x-2 border-b border-purple-200/50 pb-2">
              <FileText className="text-purple-600" size={18} />
              <span>Rekomendacje Strategiczne</span>
            </h3>
            
            <ul className="space-y-3.5 text-xs text-slate-600">
              <li className="flex items-start space-x-2.5">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-purple-100 text-purple-800 flex items-center justify-center font-bold text-[10px] mt-0.5 border border-purple-200/50">
                  1
                </span>
                <div>
                  <strong className="text-slate-900 block font-sans">Szybka Intercepcja SEO (Gemini)</strong>
                  Zoptymalizuj firmowe podstrony banku pod zapytania komercyjne (np. &quot;koszty procesu&quot;), aby ubiec fora internetowe i zaoferować klientowi ugodę zanim trafi do zewnętrznego prawnika.
                </div>
              </li>
              <li className="flex items-start space-x-2.5">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-purple-100 text-purple-800 flex items-center justify-center font-bold text-[10px] mt-0.5 border border-purple-200/50">
                  2
                </span>
                <div>
                  <strong className="text-slate-900 block font-sans">Automatyzacja Kampanii Ugodowych</strong>
                  Wykorzystaj asymetrię zapytań wejściowych: klienci pytający o &quot;plusy i minusy&quot; są na etapie ważenia opcji. To optymalny moment na targetowane oferty ugodowe z redukcją kapitału.
                </div>
              </li>
              <li className="flex items-start space-x-2.5">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-purple-100 text-purple-800 flex items-center justify-center font-bold text-[10px] mt-0.5 border border-purple-200/50">
                  3
                </span>
                <div>
                  <strong className="text-slate-900 block font-sans">Przygotowanie na Skok Litigacyjny (GPT)</strong>
                  Wzmocnij działy prawne banku w okresach, w których obserwuje się wysokie natężenie wyszukiwań GPT o TSUE/UOKiK – zapytania te silnie korelują z napływem nowych pozwów w okresie kolejnych 60 dni.
                </div>
              </li>
            </ul>
          </div>

        </div>

      </main>

      {/* FOOTER */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-xs text-slate-500">
          <div>
            <p className="font-bold text-slate-800 font-display">MFI Bank Analiza Technologiczna</p>
            <p className="mt-0.5">Automatyczny system audytu platform AI i rozproszenia zapytania wejściowego.</p>
          </div>
          <div>
            <p className="font-mono text-[10px] text-purple-700">Wersja Systemu: 4.10.1-prod | KOD: MFI-FRAG-EUR</p>
            <p className="mt-0.5 text-right md:text-left text-[10px] text-slate-400">&copy; 2026 MFI Bank S.A. Wszystkie prawa zastrzeżone.</p>
          </div>
        </div>
      </footer>

      {/* Extra Global Styles for CSS-only Keyframe Animations */}
      <style>{`
        @keyframes dash {
          to {
            stroke-dashoffset: -1000;
          }
        }
        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: #f1f5f9;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 4px;
        }
      `}</style>

    </div>
  );
}
