# Architektura informacji: interaktywne demo Dentons dla Deutsche Banku
### „Od pytania kredytobiorcy do odpowiedzi AI — i z powrotem do strategii banku"

Dokument roboczy dla zespołu projektującego demo. Wersja 1.0.

---

## 1. Executive concept

Demo to jednostronicowa, scrollowana narracja (scrollytelling one-pager) z kilkoma interaktywnymi modułami, która w mniej niż 90 sekund pokazuje decydentom Deutsche Banku trzy rzeczy: (1) jak naprawdę wygląda ścieżka ich klienta, który pyta AI o unieważnienie kredytu w euro, (2) że w źródłach, z których korzystają modele, stanowisko banku jest dziś praktycznie nieobecne, a przestrzeń informacyjną zagospodarowały kancelarie, oraz (3) że istnieje konkretny, mierzalny plan działania — z priorytetami, właścicielami i KPI — który tę lukę zamyka.

Kluczowa zasada: **value-first**. Pierwszy ekran nie tłumaczy technologii — pokazuje problem biznesowy i obiecuje rekomendacje. Interaktywne wizualizacje (symulator fan-out, mapa źródeł, chmura fraz) służą jako dowód i „wow", ale każda kończy się wnioskiem sformułowanym językiem zarządu: co z tego wynika i co należy zrobić.

Pozycjonowanie Dentons: nie wykonawca PR, lecz architekt strategii AI visibility — zespół, który rozumie mechanikę modeli (fan-out, retrieval, cytowania) i przekłada ją na decyzje contentowe, PR-owe i techniczne po stronie banku i jego agencji.

Język całości: *widoczność wyważonej narracji*, *wiarygodne źródła*, *ekosystem AI/search*, *konsensus informacyjny*. Nigdy: „manipulowanie AI", „sterowanie odpowiedziami", „kontrola nad modelami". Demo wprost zaznacza, że nikt nie kontroluje odpowiedzi modeli — można natomiast systematycznie zwiększać prawdopodobieństwo, że rzetelne stanowisko banku będzie obecne w źródłach, po które modele sięgają.

---

## 2. Główna narracja

Historia opowiedziana w pięciu aktach, w kolejności: **problem → mechanizm → dowód → zasady gry → plan i pomiar**. Użytkownik (członek zarządu, prawnik, PR) w każdej chwili może zeskrolować do rekomendacji — sticky nawigacja z pozycją „Rekomendacje" jest widoczna od początku.

**Akt 1 — „Państwa klient nie pyta już Google. Pyta AI."**
Hook emocjonalno-biznesowy. Kredytobiorca z kredytem w euro wpisuje do ChatGPT pytanie o unieważnienie umowy. Odpowiedź, którą dostaje, kształtuje jego decyzję o pozwie — zanim porozmawia z kimkolwiek z banku. Above the fold: jedno zdanie problemu + jedna liczba kotwicząca *(do uzupełnienia po researchu — np. udział zapytań konsumenckich kierowanych do chatbotów lub liczba spraw sądowych dot. kredytów EUR)* + przycisk „Zobacz, jak AI odpowiada".

**Akt 2 — „Jedno pytanie. Kilkanaście wyszukiwań. Zero głosu banku."**
Mechanizm fan-out pokazany interaktywnie: pytanie użytkownika rozpada się na zapytania pomocnicze generowane przez model. Insight: bank nie konkuruje o jedno hasło, lecz o całą przestrzeń zapytań, którą model tworzy sam — i która różni się między ChatGPT a Gemini.

**Akt 3 — „Kto dziś odpowiada w imieniu banku?"**
Dowód: mapa źródeł faktycznie pobieranych przez modele. Kategorie: kancelarie i serwisy odszkodowawcze, media, regulatorzy (UOKiK, KNF, Rzecznik Finansowy), fora — oraz (prawie niewidoczny) bank. Tu następuje moment „zesrania się z wrażenia": luka widoczności pokazana czarno na białym (a właściwie fioletowo na białym).

**Akt 4 — „Silniki AI nagradzają konkretne cechy treści. To dobra wiadomość."**
Zwrot narracyjny z problemu na szansę: modele preferują treści wyważone, faktograficzne, ustrukturyzowane, z widocznym autorstwem i potwierdzeniem w wielu źródłach. To naturalna przewaga instytucji, która ma dane, ekspertów i autorytet — jeśli tylko udostępni je w formacie czytelnym dla maszyn.

**Akt 5 — „Plan działania: 30 dni, 90 dni, 6 miesięcy — i jak zmierzymy efekt."**
Rekomendacje w macierzy wpływ × trudność, roadmapa w trzech horyzontach, mock dashboardu monitoringu (Share of Answer, Citation Rate, sentyment). Zamknięcie: rola Dentons jako autora strategii + konkretny następny krok (warsztat).

---

## 3. Mapa strony

Jednostronicowy scrollytelling ze sticky nawigacją (7 kotwic) i logo Dentons w lewym górnym rogu. Motyw strzałki z logo wykorzystany jako element kierunkowy prowadzący scroll.

```
[Sticky nav: Problem · Mechanizm · Źródła · Luka · Zasady gry · Rekomendacje · Monitoring]

S0  HERO — problem i obietnica wartości
S1  NOWA ŚCIEŻKA KLIENTA — od pytania do pozwu (journey strip)
S2  ANATOMIA ODPOWIEDZI AI — interaktywny symulator fan-out
S3  MAPA ŹRÓDEŁ — kto zasila odpowiedzi (pole bitwy)
S4  LUKA WIDOCZNOŚCI — chmura fraz + udział głosu banku
S5  ZASADY GRY — co nagradzają poszczególne silniki
S6  REKOMENDACJE — macierz działań + roadmapa 30/90/180 dni
S7  MONITORING — jak zmierzymy efekt (mock dashboardu KPI)
S8  DENTONS × DEUTSCHE BANK — rola, zastrzeżenia, następny krok
```

Wariant nawigacji: jeśli po przygotowaniu treści okaże się zbyt długa na płynny scroll, sekcje S5 i S7 mogą stać się rozwijanymi tabami wewnątrz S6 — decyzja po pierwszym prototypie treści w markdownie (zgodnie z ustaleniem z tech-leadem: najpierw treść i kolejność, potem forma).

---

## 4. Szczegółowa architektura sekcji

### S0 — Hero: „Zanim klient zadzwoni do banku, zapytał AI"

- **Cel:** w 5 sekund zakomunikować problem biznesowy i obiecać rekomendacje; zbudować napięcie.
- **Główny komunikat:** decyzje kredytobiorców o pozwie kształtują dziś odpowiedzi generowane przez AI — a stanowisko banku jest w nich niedoreprezentowane.
- **Typ treści:** 1 nagłówek, 1 zdanie kontekstu, 1 liczba kotwicząca *(do uzupełnienia po researchu)*, CTA.
- **Wizualizacja:** ciemnofioletowy gradient (#3c1053 → #702082), subtelna animacja „strumienia zapytań" w tle (frazy przepływające jak cząsteczki), duża typografia (Dentons Sans / Proxima Nova, fallback Arial).
- **Przykładowe mikrocopy:** *„»Czy mogę unieważnić kredyt w euro?« — to pytanie Państwa klienci zadają dziś ChatGPT, Gemini i Perplexity. Sprawdziliśmy, co słyszą w odpowiedzi — i kto te odpowiedzi kształtuje."*
- **CTA:** „Zobacz, jak AI odpowiada ↓" (scroll do S2) + drugorzędny link „Przejdź do rekomendacji" (skok do S6 dla niecierpliwego zarządu).

### S1 — Nowa ścieżka klienta

- **Cel:** pokazać zmianę zachowań: wyszukiwarka → chatbot → kancelaria → pozew; osadzić problem w realiach biznesowych banku.
- **Główny komunikat:** odpowiedź AI to dziś pierwszy „doradca" kredytobiorcy; jej ton wpływa na skłonność do pozwu.
- **Typ treści:** pozioma oś 4–5 kroków z krótkimi opisami; opcjonalnie cytat przykładowej odpowiedzi chatbota *(oznaczony jako ilustracyjny)*.
- **Wizualizacja:** journey strip z ikonami, animowane pojawianie się kroków przy scrollu; strzałka Dentons jako łącznik kroków.
- **Przykładowe mikrocopy:** *„Krok 1: klient pyta chatbota. Krok 2: otrzymuje syntezę zbudowaną ze źródeł internetowych. Krok 3: źródła te w większości należą do kancelarii wyspecjalizowanych w pozwach."*
- **CTA:** „Co dokładnie dzieje się po wpisaniu pytania? ↓"

### S2 — Anatomia odpowiedzi AI (symulator fan-out) — moduł centralny

- **Cel:** wyjaśnić nietechnicznemu odbiorcy mechanizm fan-out i pokazać kompetencję Dentons; „wow" z wartością.
- **Główny komunikat:** jedno pytanie użytkownika model przekształca w wiele zapytań pomocniczych — bank konkuruje o całą tę przestrzeń, różną w każdym modelu.
- **Typ treści:** interaktywny selektor 3–4 przykładowych pytań konsumenckich *(oznaczonych jako przykładowe)*, np. „plusy i minusy unieważnienia kredytu w euro"; po wyborze — animowane rozgałęzienie na realne zapytania pomocnicze zebrane w researchu; przełącznik ChatGPT / Gemini.
- **Wizualizacja:** diagram promienisty (pytanie w centrum, zapytania jako gałęzie), maks. 8–12 gałęzi na widok — czytelność ponad kompletność; przy każdej gałęzi etykieta typu źródła, do którego prowadzi.
- **Insight box pod wizualizacją:** ChatGPT szuka „urzędowo" (UOKiK, Rzecznik Finansowy, orzecznictwo TSUE), Gemini bardziej „poradnikowo/komercyjnie" (wady i zalety, konsekwencje, koszty) — to dwa różne pola optymalizacji.
- **Przykładowe mikrocopy:** *„To nie są zapytania użytkownika. To zapytania, które model wygenerował sam. Widoczność banku zależy od obecności w tej przestrzeni — nie tylko pod dosłownym pytaniem klienta."*
- **CTA:** „Zobacz, jakie źródła wygrywają te wyszukiwania ↓"

### S3 — Mapa źródeł: pole bitwy o odpowiedź

- **Cel:** dowód empiryczny — pokazanie, jakie kategorie domen zasilają odpowiedzi.
- **Główny komunikat:** przestrzeń źródeł zdominowały kancelarie i serwisy odszkodowawcze; regulatorzy i media są obecni; bank — śladowo.
- **Typ treści:** kategoryzacja realnie pobranych URL-i z researchu (kancelarie / media finansowe / regulatorzy / fora / bank / inne) *(udziały procentowe do uzupełnienia po researchu)*.
- **Wizualizacja:** treemapa lub packed bubbles w palecie Dentons (kancelarie — Dentons Red #da291c jako sygnał ostrzegawczy, regulatorzy — Dentons Blue, bank — Dentons Gold #f1b434, celowo malutki); hover pokazuje przykładowe domeny.
- **Ważny niuans do zakomunikowania (buduje wiarygodność Dentons):** pobranie źródła ≠ zacytowanie go. Modele czerpią kontekst szeroko (np. fora), ale cytują wąsko — głównie źródła autorytatywne. Dlatego strategia celuje w bycie *cytowanym*, nie tylko *pobieranym*. *(Dane liczbowe z badań zewnętrznych — do weryfikacji i opatrzenia źródłem przed prezentacją.)*
- **Przykładowe mikrocopy:** *„W wynikach pobieranych przez modele dominują domeny wyspecjalizowane w pozwach. Głos banku — dane, ryzyka, zniuansowane stanowisko — jest w tym ekosystemie praktycznie nieobecny."*
- **CTA:** „Jak duża jest ta luka? ↓"

### S4 — Luka widoczności

- **Cel:** skondensować problem do jednego zapamiętywalnego obrazu; moment kulminacyjny narracji problemowej.
- **Główny komunikat:** narracja jest jednostronna nie dlatego, że AI jest stronnicze, lecz dlatego, że jedna strona publikuje, a druga milczy.
- **Typ treści:** chmura najczęstszych fraz z wyników wyszukiwań AI *(z realnych danych researchu)* + prosty wskaźnik „udział głosu" (Share of Voice) stanowiska banku vs. narracji pro-pozwowej *(metodologia i wartości do uzupełnienia po researchu; jeśli brak twardych danych — pokazać jakościowo, bez zmyślonych liczb)*.
- **Wizualizacja:** word cloud z animowanym wejściem (stagger), frazy pro-pozwowe w czerwieni/szarości, frazy neutralne/faktograficzne w fiolecie — kontrast wielkości pokazuje asymetrię.
- **Przykładowe mikrocopy:** *„Modele AI nie wybierają stron w sporze. Syntetyzują to, co znajdą. Dziś znajdują głównie jedną perspektywę."*
- **CTA:** „Dobra wiadomość: zasady gry są znane ↓"

### S5 — Zasady gry: co nagradzają silniki

- **Cel:** przejście z diagnozy na szansę; edukacja bez żargonu; uzasadnienie rekomendacji z S6.
- **Główny komunikat:** silniki AI premiują treści wyważone, faktograficzne, ustrukturyzowane, z autorstwem i potwierdzeniem w wielu niezależnych źródłach — to gra, w której instytucja z danymi i ekspertami ma naturalną przewagę.
- **Typ treści:** 4–5 kart „silnik → czego szuka → co to oznacza dla banku" (Google/Gemini/AI Overviews, ChatGPT/Bing/Copilot, Perplexity, Claude); każda karta: 3 punkty, zero technikaliów na wierzchu, szczegóły w rozwijanym „dla zainteresowanych".
- **Wizualizacja:** karty w gridzie z ikonami silników; akordeon „szczegóły techniczne" (BLUF, chunking, llms.txt, ClaimReview, E-E-A-T — dla działu digital/IT).
- **Przykładowe mikrocopy:** *„Wspólny mianownik wszystkich silników: bezpośrednia odpowiedź na początku tekstu, weryfikowalny autor, dane zamiast przymiotników, spójność stanowiska w wielu źródłach."*
- **CTA:** „Przełóżmy to na plan działania ↓"

### S6 — Rekomendacje: plan działania — sekcja o najwyższym priorytecie

- **Cel:** dostarczyć to, po co przyszedł zarząd: konkretne działania z priorytetami, właścicielami i horyzontem czasowym.
- **Główny komunikat:** trzy horyzonty — quick wins techniczne (30 dni), fundament contentowy (90 dni), ekosystem i konsensus (180 dni) — realizowane przez bank i jego agencję, wg strategii zaprojektowanej z Dentons.
- **Typ treści:**
  - **Macierz wpływ × trudność** (interaktywna): punkty-działania na dwóch osiach; klik otwiera kartę działania (opis, uzasadnienie mechaniką AI, właściciel: IT / Content / PR / Legal, horyzont).
  - **Roadmapa 30/90/180 dni** jako pozioma oś z kamieniami milowymi.
  - Przykładowe działania (z raportu strategicznego): audyt dostępności technicznej dla crawlerów AI (robots.txt, WAF), pliki llms.txt, przepisanie FAQ wg zasady „odpowiedź na początku", explainer „kredyt EUR vs CHF — różnice" oparty na danych, sekcja „Mity vs Fakty" ze znacznikami weryfikacji faktów, risk checklist kosztów i niepewności procesu (uczciwie, „za i przeciw"), program publikacji eksperckich w mediach finansowych i prawniczych, white paper z partnerem branżowym.
- **Wizualizacja:** scatter/quadrant chart w fioletach z golden highlight (#f1b434) na quick wins; roadmapa z animowanym rysowaniem linii przy scrollu.
- **Przykładowe mikrocopy:** *„Pierwszy krok nie wymaga ani nowych treści, ani budżetu mediowego: to audyt, czy strona banku jest w ogóle technicznie dostępna dla wyszukiwarek AI. Bywa, że nie jest — i to unieważnia wszystkie pozostałe działania."*
- **Zastrzeżenie (widoczne, nie w stopce):** *„Żadne działanie nie gwarantuje określonej treści odpowiedzi AI. Celem jest systematyczne zwiększanie obecności rzetelnego, wyważonego stanowiska banku w źródłach, z których korzystają modele. Realizacja działań contentowych i PR pozostaje po stronie banku i jego agencji."*
- **CTA:** „Jak zmierzymy efekt? ↓"

### S7 — Monitoring: pomiar zamiast wiary

- **Cel:** pokazać, że strategia jest mierzalna i zarządzalna jak każdy projekt biznesowy; odróżnić Dentons od dostawców „miękkich" rekomendacji.
- **Główny komunikat:** trzy wskaźniki raportowane cyklicznie: Share of Answer (udział odpowiedzi AI uwzględniających stanowisko banku), Citation Rate (odsetek odpowiedzi cytujących domenę banku), sentyment narracyjny.
- **Typ treści:** mock dashboardu z trzema kafelkami KPI + wykres trendu; **wszystkie liczby wyraźnie oznaczone jako ilustracyjne / „przykład raportu"**; opis metodyki: stały zestaw ok. 50 promptów referencyjnych testowanych co miesiąc w głównych modelach.
- **Wizualizacja:** minimalistyczny dashboard w stylistyce Dentons; badge „Przykładowy widok raportu" w rogu.
- **Przykładowe mikrocopy:** *„Co miesiąc zadajemy modelom ten sam zestaw pytań konsumenckich i mierzymy, jak zmienia się obecność stanowiska banku. Strategia bez pomiaru to opinia."*
- **CTA:** „Porozmawiajmy o wdrożeniu ↓"

### S8 — Dentons × Deutsche Bank: rola i następny krok

- **Cel:** domknięcie: kim jesteśmy w tym projekcie, czego się podejmujemy, co dalej.
- **Główny komunikat:** Dentons = autor strategii, insightów i architektury działań; bank i agencja PR = wykonawcy; następny krok = warsztat roboczy (Legal + PR + Digital/IT) i budowa promptowego benchmarku.
- **Typ treści:** trzy krótkie bloki (Strategia / Insighty / Nadzór i pomiar) + CTA kontaktowe + zastrzeżenie, że materiał nie stanowi porady prawnej.
- **Wizualizacja:** spokojny, jasny ekran po ciemnych sekcjach; logo i strzałka Dentons „wskazująca dalej".
- **CTA:** „Umówmy warsztat strategiczny" (przycisk w Dentons Core Purple #702082).

---

## 5. Proponowane interakcje

1. **Selektor pytania konsumenta (S2)** — użytkownik wybiera jedno z 3–4 przykładowych pytań (lub, w wersji rozszerzonej, wpisuje własne — patrz ryzyka niżej). *Po co:* daje poczucie sprawczości i personalizacji; pokazuje, że mechanizm działa dla różnych intencji (faktograficznej, decyzyjnej, kosztowej). Rekomendacja: w wersji na prezentację **precomputed** — wyłącznie przygotowane przykłady z realnych danych, bez wywołań live (zero ryzyka nieprzewidywalnej odpowiedzi na spotkaniu z klientem).
2. **Przełącznik modelu ChatGPT ⇄ Gemini (S2)** — te same pytanie, inne zapytania pomocnicze. *Po co:* najsilniejszy pojedynczy insight researchu — fragmentacja modeli — pokazany jednym kliknięciem.
3. **Animowane rozgałęzienie fan-out (S2)** — pytanie „rozpada się" na gałęzie zapytań z etykietami typów źródeł. *Po co:* tłumaczy niewidoczny mechanizm w 3 sekundy, bez słowa żargonu.
4. **Hover/klik na mapie źródeł (S3)** — kategoria podświetla przykładowe domeny; klik na „bank" pokazuje pustkę/pojedyncze wyniki. *Po co:* dowód zamiast deklaracji; moment emocjonalny.
5. **Filtr chmury fraz (S4)** — przełącznik „wszystkie / pro-pozwowe / neutralne". *Po co:* unaocznia asymetrię narracji bez oceniania, kto ma rację.
6. **Interaktywna macierz rekomendacji (S6)** — klik na punkt otwiera kartę działania; filtr po właścicielu (IT / Content / PR / Legal). *Po co:* każdy uczestnik spotkania (prawnik, PR, digital) natychmiast widzi „swoje" zadania — ułatwia decyzję o wdrożeniu.
7. **Roadmapa scroll-driven (S6)** — linia czasu rysuje się w miarę scrollowania, kamienie milowe wskakują kolejno. *Po co:* rytm i porządek; komunikuje wykonalność.
8. **Dashboard KPI z animowanymi licznikami (S7)** — liczniki „nabijają się" przy wejściu w viewport (wartości ilustracyjne). *Po co:* mierzalność jako domknięcie argumentacji.
9. **Ścieżka „od pytania do działania banku" (spinacz narracji)** — pasek postępu w sticky nav odzwierciedla akty historii. *Po co:* utrzymuje poczucie prowadzenia za rękę; nawiązuje do strzałki-drogowskazu z logo.

Świadomie odrzucone: graf sieciowy „tysiąca węzłów" (efektowny, nieczytelny — wprost sprzeczny z zasadą value-first z ustaleń zespołu), live-odpytywanie modeli podczas prezentacji (nieprzewidywalne), chatbot-demo (odwraca uwagę od rekomendacji).

---

## 6. Widoki / ekrany demo

| Ekran | Co użytkownik widzi | Co klika | Jaki insight otrzymuje | Jakie pytanie biznesowe rozstrzyga |
|---|---|---|---|---|
| **Hero (S0)** | Problem w 1 zdaniu, liczbę kotwiczącą, CTA | „Zobacz, jak AI odpowiada" / skip do rekomendacji | AI jest nowym punktem pierwszego kontaktu klienta | Czy to w ogóle nasz problem? (Tak — i dotyczy przychodów) |
| **Journey (S1)** | 4–5 kroków ścieżki klienta | Kroki (rozwinięcia) | Decyzja o pozwie zapada przed kontaktem z bankiem | Gdzie tracimy wpływ na klienta? |
| **Symulator fan-out (S2)** | Pytanie → animowane gałęzie zapytań; przełącznik modeli | Wybór pytania; ChatGPT⇄Gemini; gałęzie | Konkurujemy o przestrzeń zapytań generowanych przez modele, różną per model | O co właściwie „konkurujemy" i z kim? |
| **Mapa źródeł (S3)** | Treemapa kategorii domen | Kategorie (przykładowe domeny); „bank" | Kancelarie dominują w źródłach; bank śladowy; pobranie ≠ cytowanie | Kto dziś kształtuje narrację o naszych produktach? |
| **Luka (S4)** | Chmura fraz + wskaźnik udziału głosu | Filtr fraz | Asymetria wynika z asymetrii publikowania, nie ze stronniczości AI | Czy AI jest „przeciwko nam"? (Nie — jest lustrem ekosystemu źródeł) |
| **Zasady gry (S5)** | Karty silników z 3 punktami każda | Akordeony „dla zainteresowanych" | Silniki premiują dokładnie to, co bank może dać: dane, ekspertów, wyważenie | Czy mamy realną szansę? Na czym polega przewaga instytucji? |
| **Rekomendacje (S6)** | Macierz wpływ×trudność + roadmapa 30/90/180 | Punkty macierzy; filtr właścicieli | Istnieją quick wins (techniczne) i program strategiczny (content+PR) | Co robimy w poniedziałek? Kto jest właścicielem? Ile to potrwa? |
| **Monitoring (S7)** | Mock dashboardu 3 KPI + trend (dane ilustracyjne) | Kafelki KPI (definicje) | Efekt jest mierzalny miesięcznie na stałym benchmarku promptów | Jak rozliczymy tę inwestycję? |
| **Zamknięcie (S8)** | Rola Dentons, zastrzeżenia, CTA warsztatu | „Umówmy warsztat" | Dentons = strategia i pomiar; bank/agencja = wykonanie | Jaki jest następny krok i z kim? |

---

## 7. Priorytet informacji

**Above the fold (S0):**
1. Nagłówek-problem (klient pyta AI, nie bank),
2. jedna liczba kotwicząca *(do uzupełnienia po researchu; jeśli brak — mocny cytat przykładowej odpowiedzi AI, oznaczony jako ilustracyjny)*,
3. CTA „Zobacz, jak AI odpowiada" + widoczna w sticky nav pozycja „Rekomendacje" (ścieżka dla niecierpliwych).

**Pierwsza konkretna rekomendacja (musi paść wcześnie i być zapamiętana):** audyt technicznej dostępności witryny banku dla wyszukiwarek AI (robots.txt, zapory sieciowe) + publikacja przewodnika dla crawlerów (llms.txt). Uzasadnienie doboru: zerowy koszt kreatywny, zero ryzyka komunikacyjnego, natychmiastowa wykonalność, a bez tego reszta strategii nie działa — idealny „pierwszy krok w poniedziałek".

**Warstwa „dla zainteresowanych" (schowana w akordeonach / drugim planie):** mechanika chunkingu i BLUF, szczegóły znaczników danych strukturalnych (ClaimReview, FAQPage), różnice Google vs Bing, metodologia researchu fan-out, pełna tabela per-silnik. Dostępne, ale nieblokujące narracji głównej.

---

## 8. Dane i research potrzebne do zasilenia strony

**Oparte na realnym researchu (już zebrane lub do dokończenia):**
- Zestawy zapytań pomocniczych (fan-out) dla 3–4 pytań przykładowych, osobno ChatGPT i Gemini — *rdzeń demo; użyć wyłącznie faktycznie zaobserwowanych zapytań*.
- Kategoryzacja pobranych URL-i na typy źródeł (kancelarie / media / regulatorzy / fora / bank) — podstawa mapy S3.
- Lista najczęstszych fraz z wyników — podstawa chmury S4.
- Charakterystyka behawioralna modeli (ChatGPT „urzędowy", Gemini „poradnikowy") — z własnych obserwacji researchu.

**Do weryfikacji przed prezentacją [DO WERYFIKACJI]:**
- Wszelkie liczby z badań zewnętrznych (np. odsetki cytowań z indeksu wyszukiwania, udział forów w źródłach poszczególnych silników) — użyć tylko z podanym źródłem i datą, albo usunąć.
- Liczba kotwicząca w hero (skala zapytań konsumenckich / spraw sądowych dot. kredytów EUR).
- Udział głosu banku (Share of Voice) — jeśli metodologia nie zostanie domknięta na czas, pokazać jakościowo (wizualna asymetria), bez wartości procentowych.
- Aktualność odniesień prawnych (wyroki TSUE) — do potwierdzenia przez zespół prawny; w demo raczej wspominane niż interpretowane.

**Świadomie mockowe / ilustracyjne (zawsze oznaczone na ekranie):**
- Przykładowa odpowiedź chatbota w S1 (etykieta „przykład ilustracyjny").
- Wszystkie wartości w dashboardzie KPI S7 (badge „Przykładowy widok raportu").
- Wygląd „przyszłej" treści banku, jeśli pokażemy before/after fragmentu FAQ.

**Zasada twarda:** żadnych zmyślonych liczb. Brak danych = wersja jakościowa lub etykieta „do uzupełnienia po researchu".

---

## 9. Komponenty MVP (wersja minimalna — możliwa do domknięcia najszybciej)

1. One-pager ze sticky nav i pełną treścią wszystkich sekcji (statyczne wersje wizualizacji).
2. Symulator fan-out z **precomputed** danymi: 3 pytania przykładowe × 2 modele, proste rozwinięcie gałęzi (bez zaawansowanej animacji).
3. Statyczna treemapa/wykres udziału kategorii źródeł (S3).
4. Chmura fraz statyczna (S4).
5. Rekomendacje jako karty pogrupowane w 3 horyzonty (bez interaktywnej macierzy) + widoczne zastrzeżenie o braku gwarancji treści odpowiedzi AI.
6. Statyczny mock dashboardu KPI z etykietą „przykład".
7. Sekcja zamykająca z CTA warsztatu.
8. Branding: paleta fioletów Dentons, typografia (Proxima Nova/Arial), logo, motyw strzałki.

## 10. Komponenty „wow" (wersja rozszerzona; animacje w GSAP)

1. **Hero z żywym tłem:** frazy-cząsteczki dryfujące w gradiencie fioletu (GSAP + delikatny parallax); tekst hero wjeżdżający staggerem.
2. **Fan-out jako animacja pinned scroll (ScrollTrigger):** sekcja S2 „przypięta", pytanie rozgałęzia się etapami w rytm scrolla — użytkownik „przewija" proces myślenia modelu.
3. **Morfująca mapa źródeł:** przełączenie ChatGPT⇄Gemini płynnie przeanimowuje rozmiary kafli (FLIP/GSAP) — fragmentacja modeli widoczna ruchem.
4. **Chmura fraz ze staggerowanym wejściem** i filtrem animującym kolor/skalę fraz.
5. **Rysująca się roadmapa** (DrawSVG-like path) z kamieniami milowymi wskakującymi sprężyście.
6. **Liczniki KPI** nabijające się przy wejściu w viewport (z zaokrągleniem i etykietą „przykład").
7. **Pasek postępu narracji** w sticky nav, zsynchronizowany ze ScrollTriggerem — strzałka Dentons przesuwająca się wzdłuż aktów historii.
8. **Mikrointerakcje kart rekomendacji:** hover lift + otwarcie karty działania z płynnym przejściem.

Zasada nadrzędna dla „wow": każda animacja ilustruje mechanizm lub wniosek — żadnej animacji „bo ładna". Test: czy po wyłączeniu animacji sekcja nadal komunikuje insight? Jeśli nie — insight jest źle napisany, nie animacja za słaba.


*Dokument wewnętrzny Dentons. Materiał demo nie stanowi porady prawnej i nie obiecuje wpływu na treść odpowiedzi generowanych przez modele AI; opisuje działania zwiększające widoczność rzetelnego stanowiska banku w ekosystemie źródeł wykorzystywanych przez wyszukiwarki i modele.*
