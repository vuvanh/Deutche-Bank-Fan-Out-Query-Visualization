# AI Visibility — demo Dentons × Deutsche Bank

Interaktywny scrollytelling one-pager pokazujący, jak pytania kredytobiorców
o unieważnienie kredytu w euro przechodzą przez modele AI (fan-out → retrieval →
cytowanie), gdzie bank traci widoczność i jaki plan działania (30/90/180 dni)
tę lukę zamyka. Struktura sekcji S0–S6 + sekcja zamykająca, wg
`context/architecture.md` (sekcja S7 Monitoring została usunięta z demo).

## Uruchomienie

```bash
npm install
npm run dev       # dev server (Vite)
npm run build     # statyczny build do dist/
npm run preview   # podgląd builda
```

Stack: Vite + vanilla JS, GSAP + ScrollTrigger (animacje). Zero backendu —
wszystkie dane precomputed.

## Mapa plików danych

Cała treść danych żyje w `src/data/` i pochodzi z researchu własnego Dentons
(research uznany za kompletny) — edycja nie wymaga dotykania logiki:

| Plik | Zasila | Zawartość |
|---|---|---|
| `fanout.json` | S2 symulator fan-out | wyłącznie faktycznie zaobserwowane zapytania, verbatim (łącznie z literówką Gemini „weuro"); struktura: `questions[].models.{gpt,gemini}.queries[]` |
| `sources.json` | S3 wykres źródeł | domeny per kategoria; wielkość wycinka = `domains.length` (kategorie zerowe: symboliczny wycinek, realna liczba na etykiecie) |
| `phrases.json` | S4 chmura fraz | wagi = liczba wystąpień frazy w zaobserwowanych zapytaniach fan-out |
| `engines.json` | S5 karty silników | dane zewnętrzne w `details` (oznaczone „do weryfikacji") |
| `recommendations.json` | S6 plan działania (master-detail) | oceny `impact`/`difficulty` — translacja ocen słownych z raportu strategicznego, skala 1–5 |
| `copy.json` | mikrocopy przy wizualizacjach | insighty modeli, etykiety |

Statyczna treść sekcji (nagłówki, leady, disclaimery) jest w `index.html` —
markup bez logiki, edytowalny bez JS.

## Elementy ilustracyjne (widocznie oznaczone na stronie)

1. **S1 — cytat odpowiedzi chatbota** — badge „przykład ilustracyjny — nie jest
   cytatem z modelu".
2. **S3 — dane Ahrefs (88% / 67,8% / 1,93%)** — podane ze źródłem i linkiem;
   oznaczone „do weryfikacji przed prezentacją".
3. **S5 — liczby z badań zewnętrznych w akordeonach** (75% TOP12, chunki 134–167
   słów) — oznaczone „do weryfikacji".
4. **S6 — oceny wpływu i trudności** — numeryczna translacja ocen słownych
   z raportu strategicznego.

## Zasady treści (krytyczne)

- Zero zmyślonych liczb: brak danych → placeholder z etykietą albo wersja jakościowa.
- Słownik: „widoczność wyważonej narracji", „wiarygodne źródła", „ekosystem
  AI/search", „konsensus informacyjny". Zakazane: „manipulowanie AI", „sterowanie
  odpowiedziami", „kontrola nad modelami", obietnice wpływu na treść odpowiedzi.
- Zastrzeżenie o braku gwarancji treści odpowiedzi AI jest w sekcji S6 (widoczne)
  oraz w stopce („nie stanowi porady prawnej").

## Dostępność / prezentacja

- `prefers-reduced-motion`: pełna treść bez animacji i bez pinowania sekcji.
- Desktop-first (prezentacja na dużym ekranie); kompaktowy wariant przypiętej
  sekcji S2 dla ekranów ≤ 940px wysokości (laptop 13"); układ przeżywa 1280×800.
- Fan-out jest w 100% precomputed — zero wywołań modeli na żywo podczas spotkania.

## Branding

Paleta i typografia wg `context/brand_guide.md`: fiolety Dentons (#3c1053 →
#5f2167 → #702082, akcent #a05eb5), Dentons Gold #f1b434 (oszczędnie: CTA,
quick wins, bank na treemapie), Dentons Red #da291c wyłącznie jako sygnał
ostrzegawczy (kancelarie). Typografia: Proxima Nova → Arial → sans-serif
(bez embedowania fontów). Motyw strzałki z logo: pasek postępu narracji w nav,
łączniki journey, bullety roadmapy, kształt przycisków.
