# What Are Fan-Out Queries?

> **Fan-Out Query** = a set of search queries a chatbot generates from one original user prompt before or during searching the web.

## Why Fan-Out Queries Matter

With the rise of AI chatbots, given how accessible they are, a lot of people switched from submitting their inquiries to search engines, to querying a chatbot.

Therefore, websites are not only competing for the original user query, but also for the chatbot's rewritten and expanded queries.

This makes search engine optimization harder, as what type of fan-out queries the model generates at a given point of time is not deterministic.


# Some Conclusions From the Gathered Data

## 1. GPT Is More Authority-Seeking

The retrieved URLs are mostly official or high-authority sources.

GPT seems to behave like:

> “This is a legal-financial question, so I should search for official/legal evidence first.”

For website owners, that means a normal SEO article titled:

> “Czy warto unieważnić kredyt w euro?”

may not be enough.

To appear in GPT-style browsing, the page likely needs to look legally authoritative.


## 2. Gemini Is More Commercial / SEO-Result-Friendly

Gemini, in contrary, retrieved many private/commercial law or finance domains.

It seems to behave more like:

> “This is an informational decision-making query, so I should search for opinions, costs, risks, benefits, legal-service explanations, and practical guides.”

For website owners, Gemini-style visibility may be easier to target with classic SEO content.


## 3. The Same Original Query Produces Different SEO Battlefields

Take the original query:

```text
plusy i minusy unieważnienia kredytu w euro
```

GPT turns it into searches like:

```text
UOKiK kredyty walutowe euro klauzule abuzywne...
Rzecznik Finansowy kredyty walutowe euro...
Polska kredyt euro unieważnienie... orzecznictwo TSUE...
```

Gemini turns it into:

```text
unieważnienie kredytu w euro wady i zalety
konsekwencje unieważnienia kredytu we frankach a euro
co się dzieje po unieważnieniu kredytu w euro
korzyści i ryzyka unieważnienia kredytu w euro
```

That means the website owner is not competing in one search market.

They are competing in multiple query spaces.

> AI visibility depends on the model’s rewritten search space, not only on the literal prompt entered by the user.


## 4. Most Importantly: Different Chatbots Rewrite the Same User Query Differently

Different chatbots rewrite the same user query differently, so website owners may face different SEO requirements depending on which chatbot their potential customers use.

The most apparent SEO problem created by chatbot query fan-out is **model fragmentation**.

A website owner is no longer optimizing only for Google search rankings or for one stable keyword set. Instead, they must consider that different AI assistants may:

- transform the same user prompt into different search queries,
- retrieve different sources,
- apply different implicit requirements for what counts as useful or authoritative content.

Since ChatGPT appears to remain the largest AI-chatbot channel in many public market-share estimates, a practical website owner may first optimize for ChatGPT-style retrieval behavior, then expand coverage toward Gemini, Perplexity, Claude, and other assistants.

## 5. Additional Findings on ChatGPT Retrieval

A large-scale analysis of ChatGPT retrieval found that the general search index dominates both retrieved volume and citation rate. Around 88% of URLs cited by ChatGPT came directly from standard search results.

The same study found that specialized sources are retrieved at scale but cited much less often. For example, Reddit accounted for **67.8%** of non-cited URLs, despite having a citation rate of only **1.93%**.

This means that retrieval and citation should not be treated as the same thing. ChatGPT may use sources like Reddit, YouTube, or academic repositories for context, while citing more authoritative sources in the final answer.

Because of this, citation studies should compare URLs within the same retrieval channel, such as search vs. search or Reddit vs. Reddit. Otherwise, aggregate comparisons between cited and non-cited URLs may reflect dataset composition rather than real ranking behavior.

[GPT citation studies of 1.4m prompts](https://ahrefs.com/blog/why-chatgpt-cites-pages/)