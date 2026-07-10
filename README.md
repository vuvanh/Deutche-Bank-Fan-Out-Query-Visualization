# AI Visibility — demo Dentons × Deutsche Bank

Interaktywny scrollytelling one-pager pokazujący, jak pytania kredytobiorców
o unieważnienie kredytu w euro przechodzą przez modele AI (fan-out → retrieval →
cytowanie), gdzie bank traci widoczność i jaki plan działania (30/90/180 dni)
tę lukę zamyka. Struktura sekcji S0–S8 wg `context/architecture.md`.

## Uruchomienie

```bash
npm install
npm run dev       # dev server (Vite)
npm run build     # statyczny build do dist/
npm run preview   # podgląd builda
```

Stack: Vite + vanilla JS, GSAP + ScrollTrigger (animacje), `d3-hierarchy`
(wyłącznie layout treemapy). Zero backendu — wszystkie dane precomputed.

## Mapa plików danych (do podmiany po researchu)

Cała treść danych żyje w `src/data/` — podmiana nie wymaga dotykania logiki:

| Plik | Zasila | Co podmienić po researchu |
|---|---|---|
| `fanout.json` | S2 symulator fan-out | zapytania dla pytania `jak-wyglada-proces` (status `DO_UZUPELNIENIA`); ew. nowe pytania — struktura: `questions[].models.{gpt,gemini}.queries[]` |
| `sources.json` | S3 treemapa źródeł | `share` (udziały %), domeny kategorii `fora`; wielkość kafla = `domains.length` |
| `phrases.json` | S4 chmura fraz | wagi/frazy po pełnym benchmarku; wartości Share of Voice |
| `engines.json` | S5 karty silników | dane zewnętrzne w `details` (oznaczone „do weryfikacji") |
| `recommendations.json` | S6 macierz + roadmapa | oceny `impact`/`difficulty` (obecnie translacja ocen słownych z raportu strategicznego, skala 1–5) |
| `kpi.json` | S7 dashboard | wartości KPI i trend — **całość ilustracyjna z założenia** (mock raportu) |
| `copy.json` | mikrocopy przy wizualizacjach | insighty modeli, etykiety |

Statyczna treść sekcji (nagłówki, leady, disclaimery) jest w `index.html` —
markup bez logiki, edytowalny bez JS.

## Lista placeholderów (DO_UZUPELNIENIA / ilustracyjne)

Wszystkie są **widocznie oznaczone na stronie**:

1. **S0 hero — liczba kotwicząca** `[ DO UZUPEŁNIENIA ]` (skala zapytań do
   chatbotów lub liczba spraw sądowych EUR; podać ze źródłem i datą).
2. **S1 — cytat odpowiedzi chatbota** — badge „przykład ilustracyjny — nie jest
   cytatem z modelu".
3. **S2 — pytanie „Jak wygląda proces unieważnienia kredytu w euro?"** — status
   `DO_UZUPELNIENIA`, etykieta na chipie i komunikat na kanwie. Pozostałe trzy
   pytania mają wyłącznie faktycznie zaobserwowane zapytania (research/report.json),
   verbatim — łącznie z literówką Gemini „weuro".
4. **S3 — udziały procentowe kategorii źródeł** — brak (celowo); wielkość kafla =
   liczba unikalnych domen z próbki researchu (adnotacja pod treemapą). Kategoria
   „Fora" — domeny do uzupełnienia.
5. **S3 — dane Ahrefs (88% / 67,8% / 1,93%)** — podane ze źródłem i linkiem;
   oznaczone „do weryfikacji przed prezentacją".
6. **S4 — Share of Voice** — badge „do uzupełnienia po researchu"; asymetria
   pokazana jakościowo (wagi = realne liczby wystąpień fraz w zapytaniach fan-out).
7. **S5 — liczby z badań zewnętrznych w akordeonach** (75% TOP12, chunki 134–167
   słów) — oznaczone „do weryfikacji".
8. **S6 — pozycje na macierzy** — numeryczna translacja ocen słownych z raportu
   strategicznego (adnotacja pod macierzą).
9. **S7 — cały dashboard KPI** — badge „Przykładowy widok raportu — wartości
   ilustracyjne"; każdy kafel dodatkowo z dopiskiem „wartość ilustracyjna".

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
