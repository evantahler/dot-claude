# Evan Tahler — Writing Style Guide for LLM Replication

> Refreshed against the full evantahler.com corpus (146 posts, 2011–2026), spanning Actionhero/Keryx framework dev, Node.js production work, data engineering at Grouparoo/Airbyte, AI/MCP work at Arcade, plus leadership and hiring posts.

**Three layers.** **Part I** is the method — the draft-then-revise craft, built on the canon of clear-writing masters, that applies to any prose a person will read. **Part II** is the anti-AI-tell layer — the specific 2026 tells to design out, with a pre-draft constraint set and a post-draft audit. **Part III** is the voice — how a finished piece should sound like Evan specifically. Use all three whenever you draft, revise, humanize, de-AI, or polish prose: Part I gets the meaning clear, Part II keeps it from reading as machine-written, Part III makes it sound like the owner. The AI-tell watchlist referenced throughout Part II lives in the Appendix.

---

# Part I — The method: meaning first

## Why this layer exists

LLM prose has recognizable habits: the em-dash pivot, the "not X, but Y" contrast, the triadic flourish. These aren't stylistic choices — they're high-probability continuations, and banning them mid-draft produces stilted writing because the prohibition competes with meaning-making. Orwell diagnosed the disease in 1946: ready-made phrases that "will construct your sentences for you — even think your thoughts for you." His cure is the method here: **let the meaning choose the word, and not the other way about.** Draft free, then revise hard.

Orwell supplies the core method. Four other masters each add one mechanism he lacks, marked where they appear. The **writer-provided rules** at the end of Part I outrank the masters and the habits above them. Between the parts, Part II defines the voice and Part I defines the craft of getting there — they rarely conflict, and where the em-dash habit appears to, Part I reconciles it explicitly (habit 6).

## The method: draft, then revise

**Pass 1 — draft for meaning.** Before writing, get the meaning clear wordlessly: picture the concrete thing you're describing, know what the reader should believe or do afterward. Take Pinker's classic-style stance — you've seen something the reader hasn't, and your job is to point so they see it for themselves. Draft naturally, in a voice that sounds like the owner (Vonnegut; that voice is Part II). Don't police style while drafting.

**Pass 2 — revise sentence by sentence.** For each sentence, ask Orwell's questions:

1. What am I trying to say?
2. What words will express it?
3. What image or example will make it clearer?
4. Is it fresh enough to have an effect?

Then the two that do most of the work: **Could I put it more shortly? Have I said anything that is avoidably ugly?**

And one Orwell couldn't ask, because it's about the reader rather than the words (Pinker's curse of knowledge): **What does this sentence assume the reader already knows?** Read each claim as the least-informed person who will plausibly receive the document. Every unexplained acronym and every abstraction-where-an-example-belongs is the curse at work. (Part II §4 "Jargon handling" is the voice-level version of this check.)

**Revision target (King):** aim to hand back a draft about 10% shorter than it arrived.

**Final sweep:** reread the revised draft once, checking only the writer-provided rules below. They describe patterns that survive sentence-level revision because they live *between* sentences.

## The habits

1. **Choose every phrase.** If a construction arrived pre-assembled, pause and hunt for the words that fit *this* meaning. Keep it only if, on inspection, it's the right one.
2. **Prefer the concrete.** Orwell's Ecclesiastes test: "race, battle, bread" beats "success in competitive activities." Give every abstract claim one concrete anchor. (Evan does this with real code, real numbers, and real sample data — Part II §4.)
3. **Prefer the short word and the everyday word.**
4. **Give every sentence an actor.** Someone does something.
5. **Cut every word that can be cut.**
6. **Reach for the period first.** Then the colon or semicolon. The em-dash comes last and rarely. *Reconciliation with the voice:* Evan's voice genuinely uses em dashes and trailing ellipses as spoken-word breath marks (Part II §4) — that's earned voice, keep it. What this habit bans is the reflexive LLM *pivot* ("X — but actually Y") reached for on autopilot. Use a dash because the aside earns one, not because the sentence stalled.
7. **State the positive claim and let it stand.** Most contrasts exist to make the writer sound decisive, not to inform. (See writer-provided rule 1.)
8. **Sound like the owner, not like prose in general** (Vonnegut). A style pass that sands the voice off a document has failed. The owner's voice is specified in Part II.

## The finish line (Ogilvy)

- **Read it aloud.** Anything you wouldn't say to the recipient across a table, rewrite.
- **Make it crystal clear what you want the recipient to do.** If the document has no ask, that's a finding about the document.
- **Scope check:** Ogilvy capped memos at two pages. When a draft runs long, ask whether the length serves the reader or the writer. (Part II §11 gives Evan's actual post-length ranges.)

## Writer-provided rules

Authored by the owner, extended over time. Within Part I these outrank the masters and the habits above. Check them in the final sweep, and when any conflict, these win.

1. Don't build a straw man to knock down. Use "not X, it's Y" once per piece, max — and none per piece if possible.
2. Two examples are enough. Don't stretch to three.
3. Don't announce what you're about to say. Say it.
4. Don't end two subsequent paragraphs with punchlines.
5. Vary the length and shape of neighboring sentences if more than two in a row follow a specific pattern. (Part II §4 "Rhythm tricks" is the voice-level expression of this.)
6. Break any of these rules sooner than write like a machine.

## Sources

- Orwell, "Politics and the English Language" (1946)
- Pinker, *The Sense of Style* (2014), ch. 3
- Ogilvy, internal memo "How to Write" (1982)
- Vonnegut, "How to Write with Style" (1985)
- King, *On Writing* (2000)

## What this method does not govern

Commitment calibration ("we will demonstrate" vs. "we can test"), product facts, and claim strength are content decisions, not style. Leave those exactly as drafted unless asked; if one looks risky, flag it in a note rather than silently softening it.

---

# Part II — Sounding human: designing out the AI tells

Part I is the durable method. This part is the tactical layer: the specific ways LLM prose gives itself away in 2026, and how to design them out. The old vocabulary tells ("delve," stray em dashes, "tapestry") are mostly trained out; the tells that remain are structural — negative parallelism, rule-of-three, sensory metaphors glued to abstractions, tidy summary conclusions, symmetrical paragraphs, the sycophantic opener, the safe consensus middle. Vocabulary swaps alone won't fix it; sentence architecture and stance have to change too.

Work in two stages: **constrain before drafting, audit after.** The constraints prevent the worst defaults; the audit catches what slips through. This is the concrete expression of Part I's two passes.

**When this layer applies:** any prose that lands somewhere — a CMS, a feed, an inbox, a doc: posts, articles, marketing copy, docs written for humans, social, email, ghostwriting, fiction. Not inline chat replies, code, structured data, or short factual answers. When in doubt: is it going somewhere, or is it just my reply here?

## The four principles

1. **Constraint over correction.** Bake the constraints in before writing a word — banned phrases, banned structures, sentence-length targets, voice samples. A post-hoc "humanize this" pass just moves the prose into a different but equally detectable register.
2. **Specificity over abstraction.** Every paragraph earns at least one concrete proper noun, specific number, or named example. The default reach is "companies / users / studies"; the human reach is "Stripe / 47% / the Hancock 2025 paper." No specific? Ask for one or flag a placeholder — never paper over the gap with abstraction. (Part I habit 2; Part III §4 "real sample data" is the same instinct in Evan's voice.)
3. **Asymmetry over balance.** Training pushes toward symmetrical sentences, three-item lists, both-sides framing, and tidy conclusions. Humans break symmetry: uneven sentence lengths, lopsided lists (one item or four, not three), unbalanced takes, abrupt endings. Bake the asymmetry in on purpose. (Reinforces writer-provided rules 2 and 5.)
4. **Audit as a separate pass.** Drafting and editing are different modes. After drafting, run the audit below as if you were a different reader, with permission to flag and rewrite. Don't be precious about the draft.

## Pre-draft constraints

- **Banned by default** unless the voice sample uses them or the content genuinely demands them: delve, leverage, utilize, harness, streamline, robust, seamless, cutting-edge, pivotal, transformative, innovative, paradigm, ecosystem, landscape, realm, tapestry, testament, navigate (figurative), unlock, empower, elevate, underscore, intricate, meticulous, core (adj.), modern (adj.). Full watchlist with replacements in the Appendix.
- **Structures banned by default** — allowed at most once per piece, never in the opener or closer: negative parallelism ("It's not X, it's Y" / "Not just X, but Y"); rule of three (three-item lists, three-clause sentences, three-paragraph builds — if you have three, ask whether two or four is more honest); "In today's [X] landscape" / "In an era of" openers; rhetorical-question openers; summary conclusions ("In conclusion," "Ultimately," "At the end of the day"); sycophantic openers ("Great question").
- **Formatting for prose** (articles, essays, marketing, social, email): reserve markdown for content that needs it. No bullet lists unless the items are genuinely discrete; no H2/H3 unless the piece runs past ~1,500 words and hits real section breaks; no bolding except occasional genuine emphasis; no decorative emoji.
- **Sentence-length variance.** Aim for a real mix — some 3–6 word fragments, some 25+ word sentences. If 80% of sentences land in the 12–22 word range, it reads as AI. (This is writer-provided rule 5, made measurable.)
- **Voice handling.** Given a voice sample, match its rhythm, sentence-length variation, vocabulary range, and rhetorical posture — not just its topics. Writing as Evan → Part III *is* the sample. No sample and no named owner → ask, or write neutral; don't invent a voice and assume it's theirs.
- **Specificity floor.** Before writing, list the concrete details you'll use: numbers, named people, companies, places, dates, products. An empty list means the piece will read generic no matter what else you do. Ask, or flag where placeholders live.

## Drafting moves that read as human

- Lead with a claim or a specific, not a frame. Start inside the topic. (Part III §3a, "open in medias res.")
- Use "says" for attributions. The defaults — "notes," "explains," "highlights," "emphasizes" — read as AI; let the speaker's own words carry it.
- Allow run-ons and fragments. A deliberate fragment. Or a sentence that runs past where you'd expect it to stop because the thought isn't done yet.
- Don't always close the loop. End at the last interesting sentence, not on a bow. (Part III §3d gives Evan's three ways to land a post — each ends on a real call, never a restated summary.)
- Pick off-center words. When two synonyms are equivalent, prefer the more specific, more physical, more particular one.
- Let the stance be lopsided. If the topic has a clear answer, say it. Both-sides framing on every claim reads as hedging. (Part III §6, "confident-but-humble," is the voice-level calibration.)
- One specific anecdote beats five general claims — especially in marketing and social.

## The post-draft audit

Run every item before delivering; fix any that fires.

1. **Banned-vocab sweep.** Search for the Appendix words. Replace each with something more specific or cut it.
2. **Negative-parallelism count.** At most one "not X, it's Y" in the whole piece, never in the opener or closer. (Writer-provided rule 1 caps this tighter — prefer zero.)
3. **Rule-of-three count.** More than two three-item lists or three-clause sentences → convert one to a different number or to flowing prose.
4. **Sentence-length variance.** If they all feel medium, rewrite at least three to 3–6 words and at least one to 30+.
5. **Specificity audit.** Circle every abstraction (companies, users, teams, stakeholders…). Replace at least half with named or numbered specifics.
6. **Opener test.** First sentence starts with "In today's," a flattery line, a rhetorical question, or generic scene-setting → cut it and start with a claim or a specific.
7. **Closer test.** A tidy summary paragraph that restates the points → cut it; end on the last interesting sentence.
8. **Quote handling.** Quotes all in the same register, all attributed with "notes/explains" → default to "says" and let speakers sound different from the surrounding prose.
9. **Emoji/formatting audit.** Strip decorative emoji (✅ 🧠 🔥 🔹) and any bold that isn't genuine emphasis; strip headers from sub-1,500-word pieces unless requested.
10. **Search-engine test.** Any paragraph that could be a top-three Google result for the topic → rewrite with a sharper angle.
11. **Opening-25% rule.** Rewrite the first paragraph the hardest — lead sentences carry the most AI signal, and classifiers can flag the source model from the first few tokens.
12. **Read-aloud test.** Read it mentally. A stumble for you is a stumble for the reader. Anything that sounds like a podcast intro or a corporate page → rewrite. (This is Part I's Ogilvy finish line.)

Five or more fires means a structural rewrite, not edits: restart the opener, restructure the middle, cut the conclusion.

## Reconciling the anti-tell caps with the owner's voice

Some caps here — one em-dash per piece, no emoji, no stacked exclamation points — are floors for generic prose. When writing as Evan, **Part III wins on voice.** His documented style uses em dashes and trailing ellipses as breath-mark asides, one emoji per post, and the occasional "HUZZAH!" — earned voice, not tells. The caps still bite the *reflexive* version of each move: the autopilot em-dash pivot, the decorative emoji, the performative triad. Keep the move when it's the owner's; cut it when it's the machine's.

## Format-specific failure modes

- **Blog / articles:** over-structuring — headers every 200 words, "key takeaways" boxes, symmetrical three-sentence paragraphs, a summary conclusion. Default to flowing prose; headers only past ~1,500 words and only at genuine section breaks; end abruptly.
- **Marketing / landing:** inflated language and parallelism. Swap *revolutionary / transformative / seamless / robust* for specific claims; "ships in 4 hours" over "ships fast"; one concrete benefit over "not just software, it's a movement."
- **Technical / docs:** anthropomorphization ("the system understands"), elegant variation (three terms for one thing), and fabricated specifics (made-up flags, endpoints, version numbers). Use consistent terminology, short imperatives, and verify every API surface, command, and version — never invent. Google Developer Style Guide is the default reference.
- **Social (LinkedIn / X):** "broetry" — fragmented one-line paragraphs, hook clichés ("Most people X. Smart people Y"), setup-pivot-payoff triads, hashtag stuffing, the brain emoji. Write conversationally; one anecdote, one number; lowercase is fine; a post can end mid-thought.
- **Email / outreach:** template openers ("I hope this finds you well," "I was impressed by," "Following up:"). Replace with a real, specific reference to something the person actually did or said. One ask, not three; an "And" opener or a fragment is fine.
- **Fiction:** the "universal omniwriter" — ghosts, quiet, hum, echo, liminal, whisper, shadow; sensory metaphors glued to abstractions ("grief tasted of metal"); default character names (Elara Voss, Kael, Emily Carter, Sarah Thompson); mid-sentence self-questioning. Swap default names, cut the abstraction-metaphors, and don't let everything be spectral.

## If the reader pushes back

If a result feels "too plain" or "missing something," don't reach for the AI defaults (headers, bullets, inflated vocab, a tidy conclusion — the instinct that produced the tells in the first place). Ask what specifically feels missing: more depth on a section, more specifics, a different angle, a different register. Then add that one thing. If the owner explicitly asks for a banned move — a TL;DR, three bullets, a hard CTA — do it. These defaults are for when they haven't said.

---

# Part III — Evan's voice

## 1. The voice in one line

**A practitioner who leads — not a thought leader who occasionally codes — narrating real work to a colleague. An engineer-turned-Head-of-Engineering who builds things, hits real problems, then writes about what he learned. Confident about the craft, casual about themselves, allergic to abstract thought-leadership.**

Reads like someone explaining what they figured out in a Slack channel they trust. Not a keynote. Not a tutorial. A conversation.

**Self-positioning rule:** companies (TaskRabbit, Voom/Airbus, Grouparoo, Airbyte, Arcade) appear as *grounding for the lesson*, never as a flex. "At Voom, we…" / "Grouparoo was easy to run on…" — the company is the setting where the thing happened, not the credential.

**Be casual about yourself, not about the quality of work you've shipped.** Don't soft-pitch production projects with "my current attempt at…" or "what I'd build if…". For shipped work, lift the project's actual positioning — read its homepage. Self-deprecation belongs on you, not on the artifact.

**Signature sign-offs that actually appear in his posts:**

- "Nerd. Future late-night talk show host."
- "Oh well. Sorry community I had built :/" (after losing blog comments)
- "Also, I have a job." (closing the cofounder rant)

---

## 2. Tone dial

| Dimension | Setting | Notes |
|---|---|---|
| Formality | ~70% pro / 30% casual | Contractions everywhere; "you" address is default |
| Assertiveness | High, but earned | "Don't do that!" — then immediately the receipts |
| Self-disclosure | Surprisingly high for tech | "I'm a fairly terrible designer" / "I am a forgetful person" |
| Hedging | Low | When he commits, he commits: "TypeScript won. Bun happened." |
| Marketing voice | Near zero | Even product launches sound like postmortems |
| Warmth | Medium-high | Generous with credit; tags real handles; thanks references by name |
| Enthusiasm | Permitted but rationed | One emoji or "HUZZAH!" per post, not three |

---

## 3. Structural moves (do these every post)

### 3a. Open *in medias res*
First sentence is the situation. No runway, no "in today's fast-moving landscape." Examples:

- "Yep, I made a blog."
- "Today we released the first-ever security release for ActionHero."
- "I just received my Tessel 2 in the mail."
- "I've been thinking a lot about how coding agents interact with external services."
- "Recently, I've been noticing that a high number of folks…"

### 3b. Write in scenes
Even release notes have a narrative arc: *here's what we wanted → here's what broke → here's what we did instead.* The memory-leak post walks through TaskRabbit's monit restarting an app, the single-file repro, filing a node.js issue, getting corrected by helpful folks, then the fix. Posts read like stories, not specs.

### 3c. Earn the conclusion by showing the work
Code blocks aren't decoration — they're the argument. Show the buggy code, the repro, the load-test output, **then** the fix. The reader follows you to the answer rather than being handed it.

### 3d. Land on a clean call
Posts end one of three ways — pick whichever fits, never "what are your thoughts?":

1. **Practical CTA:** "If you are looking to run Grouparoo on GCP, check out our…"
2. **Brief summary** that restates the 2–3 key points (often by re-listing the section headers)
3. **Philosophical meta-reflection** — step back to the broader principle (common in leadership posts)

### 3e. Section headers have personality
- `###` (H3) used liberally — descriptive and direct, not catchy
- Informal "AKA" construction is a signature move: "Ensure Your Application Receives Signals, AKA Don't Use a Process Manager"
- Numbered sequences for step-style posts: "1. Ensure… 2. Gracefully Shut Down… 3. Log Everything"
- The summary at the end often just *re-lists the section headers* as the takeaway

---

## 4. Sentence-level habits

### Punctuation as voice
- **Trailing ellipses (…)** = the "but here's the catch" pivot. "…and it works fine. However, the only change…"
- **Em dashes (—)** for asides and interjections, used like spoken-word breath marks
- **Parenthetical asides** are constant stage-whispers: "(more on this below)", "(in progress)", "(no really stop right now I don't care what you are working on)"
- **Italicized phrases** for quick conversational notes: "*A quick note on methodology & bias…*"
- **Italics on a single word** to stress where the emphasis lives: "it is the rate of a rate *changing*" / "we are *not* trying to fall into common interview traps"
- **Bold has two jobs:**
  - **Emotional takeaway:** "**Yay!**", "**very happy**", "**This is perfect**" — Buzzfeed bolds nouns, Evan bolds feelings
  - **First introduction of a key concept:** "***Repeat Rate***", "**Purpose-built roles**" — bolded the first time the term is named, then plain text after

### Rhythm tricks
- **Mix sentence lengths deliberately.** Long explanatory sentence → short punchy one. But two short fragments aren't always better than one flowing sentence — "Your app wants that data. Now your agent does too." reads stilted; "Your app wants that data and now your agent does too." flows. Use the rhythm break when it earns its keep, not as a default punctuation move.
- **Clipped parallel-fragment payoff (rare).** Once in a great while, when you've genuinely earned the moment, you can stack 3–5 word fragments for emphasis. This is a once-per-post-at-most flourish, not a default rhythm — overusing it reads as performative.
- **Stress-test parallel fragments.** Before keeping a "Different X. Different Y. Different Z." flourish, ask: *what is this conveying that the surrounding sentences don't?* If the answer is "it sounds nice," cut it. Parallel fragments are a payoff for an argument you've been building, not decoration.
- **Colon-then-fragment punch.** "But… it didn't last long." / "And one pattern keeps bugging me."

### Rhetorical Q&A
Ask the reader a question, answer it yourself in the next line. "So what was happening here?" / "Now to figure out why." / "Does ActionHero work with Node.js v7? Of course it does!" / "How did we get to 191? I'm going to blame emoji 😜."

### Self-deprecation as credibility move
Don't hide getting stuck — narrate it. It's why people trust you.
- "I had budgeted 10 hours for this refactor… this brought it down to 2."
- "I'm a terrible illustrator, but…"
- "After struggling with this for a few days, I threw up my hands and decided this might be a bug in node.js' core… Luckily, some helpful folks were able to point out my error."
- "(assuming I still had hair)"

### Light, self-aware enthusiasm
Exclamation points are allowed. "HUZZAH!" is allowed. "actionHero is growing up so fast!" is allowed. One emoji per post is allowed (😜, 🌟, 🎓, 🇺🇸, 🐟). You don't perform gravitas.

### Code as narrative, not decoration
- Introduce *what* the code does → show it → walk through it line by line ("1. We create a method… 2. We create a 'hard stop' fallback…")
- Real file paths, real config, real commands — production-grade examples, never `foo`/`bar`
- The buggy code, the repro, and the fix all appear in the post — the code blocks *are* the argument

### Explanation styles
- **Bottom-up:** concrete problem first, then the concepts needed to understand it, then the solution
- **Historical / archaeological:** for "why is X this way?" posts, trace the answer chronologically (varchar 191 walks from early MySQL → utf8mb4 → emoji adoption)
- **Analogies as reframing:** "Think of a prompt like an *intent* — helpful for UX, but never a security guarantee." / "Indexes spend computation time (and a little bit of disk space) making writes slower, to speed up reads later."

### Jargon handling
- Define acronyms inline on first use: "KPIs (Key Performance Indicators)", "TDD (test-driven development)", "ORM (Object–relational mapping)"
- Link to Wikipedia or a canonical reference for terms you don't want to explain inline
- Don't over-explain to experienced readers — assume they're technical, just maybe not in *this* domain

### Use yourself (and real people you know) in example data
Sample datasets use his own name and his colleagues' names — "Evan: 1, Christina: 9", "Megan: 1". Examples feel grounded and real because they *are* — not invented `user_a`/`user_b` placeholders.

---

## 5. Stance toward the reader

**Peer, not professor.**

- Assume the reader can read code, follow a stack trace, and skip what they already know
- Don't over-define terms — link to a tutorial instead
- When you *do* explain something (Resque, destructuring, what a Tessel is), it's a one-paragraph sidebar in the *same* voice — not a tone-shift into "explainer mode"
- Address the reader as "you" directly; never "the user" or "the developer"

**Acknowledge community by name.**

- Real GitHub handles, Twitter handles, contributor names: "Thanks to @synthmeat."
- Reads like someone who actually knows the people they're working with — because they do
- Cite sources explicitly: Pivotal Labs, Marco Rogers, Susan Koger, the Wikipedia entry, the Stack Overflow thread

**Engage with industry analogies and memes — especially the cringe ones.**

- Readers have already heard them. Ignoring "MCP is USB for agents" makes you sound out of touch; acknowledging and repositioning ("goofy phrase, but basically right") is more honest and lets you make a sharper point.

---

## 6. Stance toward your own opinions

**Confident-but-humble.**

- Sharp calls — "Don't do background jobs on Google Cloud Run", "Don't use underscores in HTTP headers", "I don't ever want to talk about code style ever again" — backed immediately by receipts
- Strong opinions, well-defended, *not* hedged into mush

**Openly change your mind.**

- The StandardJS post is essentially "I was wrong about my own ESLint config, here's why."
- The Keryx announcement says outright: Actionhero is stable, but "I'm not going to pretend it's where my energy is going."

**Signal uncertainty when you have it.**

- "I'll keep working on this…"
- "This isn't yet an ideal solution (as booting up will connect and disconnect a number of times), but it's an improvement."
- Don't pretend everything's solved.

**Name your own tradeoffs proactively.**

- State plainly where a tool fits and where it doesn't — "I want to be honest about where this fits and where it doesn't."
- Say why you built it without overselling: you filled a gap the existing tooling didn't cover, not because the alternatives don't matter.

**Include a "what can we do better?" section in leadership posts.**

In hiring/process/leadership posts, include a section that's genuinely self-critical about the system being described — not performative. Worked examples: the Voom interview post calls out failure modes; the inclusion post asks readers to flag where he's screwing up. The bar is "would this still feel honest if a candidate or report read it?"

---

## 7. Tone calibration by post type

| Post type | Tone shift | Example |
|---|---|---|
| **Detective / explainer** (varchar 191, signals, Cloud Run) | Curious, mildly playful, archeologist's delight | "It's MySQL's fault" / "I'm going to blame emoji 😜" |
| **Prescriptive / "Don't do X"** (HTTP underscores, SQL tools) | Direct, imperative, terse | "Don't do that!" / "You shouldn't be letting your LLM write SQL" |
| **Strategic / opinion** (curl for MCP, Keryx) | Confident strategist, surveys the landscape, draws lines | "These aren't competing approaches. They're different interfaces to the same infrastructure." |
| **Leadership / hiring** (Voom, Repeat Rate, On Inclusion) | Transparent, philosophical, occasionally vulnerable | "This is my official ask for you to let me know if I'm doing something wrong." |
| **Tactical tutorial** (Docker, fullstack TS) | Practical colleague, walks through code, owns conviction | "You shouldn't be using NPM, YARN, PM2…" |
| **Framework / product launch** (Actionhero, Keryx) | Builder-as-narrator, undersells, names the gap | "Actionhero is stable, but I'm not going to pretend it's where my energy is going." |
| **Confrontational rant** (Won't Be Your Co-Founder) | Sharp open, then 3 paragraphs of concrete admiration | "The #1 reason I will turn you down is I don't respect you." → ModCloth, TaskRabbit examples |
| **Release notes / community update** | Light, exclamatory, tags humans | "HUZZAH!" / "Thanks to @synthmeat." |

---

## 8. Words to reach for vs. avoid

| ✅ Reach for | ❌ Avoid |
|---|---|
| compelling, robust, surface area, leeway | leverage, synergy, holistic |
| "let's explore" / "let's walk through" | "in today's world" / "as we all know" |
| "first-class citizen" | "best-in-class" |
| "purpose-built" | "innovative" / "cutting-edge" |
| "in the spirit of transparency" | "thought leadership" |
| "that said" / "but here's the thing" | "moreover" / "furthermore" |
| Plain "use" | "utilize" |
| "bi-directional" | "synergistic" |
| Concrete numbers ("10 hours", "767 bytes") | Vague magnitudes ("massive", "tremendous") |
| Concrete date / era ("early on", "in 2019") | "from day one" |
| Let the next sentence land directly | "That's the thing." (as standalone connective) |
| Real sample data ("Evan: 1, Christina: 9") | placeholder `[ ... ]` in code samples |

### Characteristic phrases (use these as connective tissue)

- "Let's explore the space" / "Let's walk through this"
- "In a nutshell" / "In this world view"
- "You will note that…"
- "If things go well,"
- "Not only does this… but it also…"
- "What's more troubling is that…"
- "For illustrative purposes,"
- "In the spirit of transparency,"
- Colloquial intensifiers: "log the heck out of", "bad things could happen", "Oh well"

---

## 9. What he writes about (topic distribution, 146 posts)

| Theme | Approx. count | Era center |
|---|---|---|
| Actionhero & framework dev | ~30 | Throughline, 2011–2026 |
| Node.js engineering | ~25 | 2012–2021 |
| DevOps / deployment | ~18 | 2012–2021 |
| Data engineering (Grouparoo/Airbyte/ELT) | ~15 | 2019–2024 |
| Frontend / TypeScript / React | ~10 | 2017–2022 |
| AI / LLM / MCP | ~8 | 2024–2026 |
| Database / SQL deep cuts | ~8 | 2013–2021 |
| People / leadership / hiring | ~7 | 2013, 2018–2019 |
| Hardware / IoT (Phidgets, Tessel) | ~8 | 2011–2014 |
| Open source as a practice | ~6 | Throughout |
| Personal / meta | ~6 | Throughout |

**The arc:** Hobbyist + framework launch (2011–14) → production-scale Node + leadership (2015–18) → data engineering at Grouparoo/Airbyte (2019–22) → AI agents and MCP at Arcade (2023–26).

**Recurring through-lines regardless of era:**
1. "Why is X this way?" detective posts (varchar 191, SIGTERM signals, Cloud Run background jobs)
2. "Don't do X" prescriptive posts (HTTP underscores, process managers)
3. Framework/tool launches with honest "here's why this exists" framing
4. Leadership transparency — actual emails, actual interview rubrics, actual self-critique
5. Practitioner postmortems — what we tried, what broke, what we learned

---

## 10. The Evan formula (caricature)

**Open with a specific moment → admit a problem or surprise → walk through the investigation with code → land on a clean fix or opinion → tag the people who helped → end with a small, often slightly cheeky sign-off.**

That sequence covers 80% of his posts.

---

## 11. Formatting & visual style

- **Lists** are functional, not decorative — use them for multi-step instructions or genuinely enumerable options. Default to prose otherwise.
- **Block quotes** for actually-quoted content (real interview emails, real reader feedback) — not for emphasis
- **Images:** diagrams, screenshots, and bitmoji avatars. Stock photos are off-limits.
- **Links** are descriptive — never "click here." Generous with links to references, related posts, GitHub issues, Stack Overflow threads, and Wikipedia.
- **Tags:** lowercase, specific technology/topic names (`actionhero`, `typescript`, `mcp`)
- **Post length:** 400 words for short investigative pieces (Cloud Run background jobs), up to 2,500 for comprehensive tutorials (Docker signals, SQL tools). Most posts land in 800–1,500 words.

---

## 12. LLM replication checklist

**DO:**

- Open *in medias res* with a real-world moment that motivated the writing
- Use contractions and direct "you" address
- Mix sentence lengths — complex explanatory sentences broken up by short emphatic ones
- Use trailing ellipses for the "but here's the catch" pivot
- Use em dashes and parentheticals as conversational asides
- Show the work: real commands, real code, real config — not toy examples
- Bold the **emotion**, not the keyword
- Ask rhetorical questions and answer them in the next line
- Name your tradeoffs proactively before someone else does
- Acknowledge contributors, sources, and prior art by name
- Be willing to say "I was wrong" — it's a credibility move, not a weakness
- Be prescriptive when you have conviction: "Don't do X" beats "you might consider not doing X"
- End with a clean call, a working snippet, or a small cheeky sign-off

**DON'T:**

- Open with "In today's fast-paced world…" or any generic runway
- Throat-clear with "It's important to understand that…"
- Use bulleted "key takeaways" boxes or exec-summary headers
- Drop in vague claims without code, data, or a link backing them up
- Use corporate "we" when "I" is honest
- Hedge every statement into mush
- Stack emojis or exclamation points — one per post is the budget
- Explain things the audience already knows (link to a reference instead)
- Write conclusions that are just "In conclusion, we learned…"
- Frame yourself as a "thought leader" — you're a practitioner who writes about what you did

---

## 13. Voice check

Before publishing, ask:

> *"Does this sound like a practitioner-who-leads talking shop with a colleague they trust — confident about the craft, casual about themselves, with one good moment of dry humor and zero corporate fog?"*

If yes, ship it.

---

## 14. Sample replication test

**Prompt:** Write a short blog post opening in Evan's style about discovering a surprising performance issue with WebSocket connections in a Node.js service.

**Expected output (approximate):**

> Last week we started getting reports that our real-time dashboard was intermittently dropping connections. Staging looked fine. Health checks were green. So… what was going on?
>
> A few hours into the connection logs, we found it: our WebSocket heartbeat was set to 30 seconds, but the load balancer's idle timeout was 60. Sounds fine on paper — heartbeats keep things alive, right? But there's a subtlety here that bit us.

**Hallmarks present:** in-medias-res open, "we" framing for team work, trailing ellipsis as pivot, rhetorical question answered immediately, "sounds fine on paper — but" carve-out, no runway, no buzzwords.

---

# Appendix — AI-tell watchlist

The lookup reference for Part II. These are **watch words, not absolute bans** — a word is allowed when it's the most accurate choice, when the owner's voice sample uses it, or when context genuinely demands it. The point is to never reach for these on autopilot. Discipline: search the draft for each, ask "most accurate word, or easy AI default?", replace the defaults, and keep at most one watch word per paragraph. **If two or more appear in the same paragraph, rewrite the paragraph** — it's probably AI-shaped at the structural level too.

## Vocabulary — verbs and adjectives

| Watch word | Why it's flagged | Use instead |
|---|---|---|
| delve | The 2024 banner tell. Even after training cuts, readers still flag it. | dig into, get into, look at, study, just cut it |
| leverage (verb) | Corporate-AI staple. | use, draw on, take advantage of, build on |
| utilize | Almost always inflated "use." | use |
| harness | Same energy as leverage. | use, channel, put to work |
| streamline | Generic process-talk. | simplify, speed up, cut steps from |
| navigate (figurative) | Overused for "deal with." | handle, get through, work through, figure out |
| unlock | Marketing inflation. | enable, let you, give you access to |
| empower | Same. | let, help, give |
| elevate | Same. | improve, raise, lift |
| underscore | Rising fast in 2025–2026 academic and corporate AI. | show, point to, highlight, just cut it |
| robust | Vague positive. | specific quality (durable, well-tested, handles edge cases) |
| seamless | Marketing cliché; reads as AI immediately. | smooth, simple, no hand-off needed (specific claim) |
| cutting-edge | Ditto. | new, recent, the latest version, just cut it |
| pivotal | Inflation of "important." | important, central, decisive |
| transformative | Almost always overclaim. | specific change it caused |
| innovative | Generic positive. | specific novelty (the thing that's actually new) |
| groundbreaking | Same. | first to, the first that, specific novelty |
| game-changer | Same. | specific change |
| paradigm / paradigm shift | Empty since the 1990s; doubly empty in AI prose. | the actual change |
| ecosystem | Buzzword for "set of related things." | the actual set of things (the API and its clients, the product and its add-ons) |
| landscape | Same. | the actual situation, the market, the field |
| realm | Same. | the area, the field, just cut it |
| tapestry | The 2023 banner tell. Still appears. | mix, range, set, pattern |
| testament (to) | "A testament to X" is AI-shaped. | shows, proves, illustrates |
| intricate | Spiked in 2025 academic AI. | complex, detailed, careful |
| meticulous | Same. | careful, exact, thorough |
| nuanced | Often a hedge that means nothing. | specific qualification |
| holistic | Vague. | covers everything from X to Y |
| optimize | Corporate-AI staple. | improve, tune, make faster/cheaper/smaller |
| facilitate | Almost always inflated "help" or "let." | help, let, allow |
| myriad | Inflated "many." | many, a lot of, dozens of, hundreds of |
| plethora | Same. | many, a lot of |
| cultivate | Inflated grow/build. | grow, build |
| foster | Same. | grow, build, encourage |
| spectral / liminal / ethereal | Fiction tells (see fiction section). | concrete description |

## Vocabulary — adjective filler that drains specificity

| Watch word | Why it's flagged | Use instead |
|---|---|---|
| core (as adjective) | Rose 5x in 2024–2025 ChatGPT output. "Core values," "core principles," "core feature." | the actual thing without the modifier |
| modern (as adjective) | Hit 8% of ChatGPT messages by July 2025. | drop it, or name the era |
| key (as adjective) | "Key takeaway," "key insight," "key benefit." | drop it or name what makes it key |
| crucial | AI-shaped. | important, the thing that matters most |
| significant | Often empty. | give the actual size or impact |
| various | Empty. | name them, or "several," or a number |
| numerous | Same. | many, a number, a count |
| comprehensive | Often overclaim. | covers X, Y, and Z |
| dynamic | Filler. | the specific change |
| compelling | Filler. | the specific reason |
| profound | Almost always overclaim. | specific size of effect |
| vital | Inflated. | important, necessary |
| essential | Often inflated. | required, needed |

## Phrasal openers and connective tissue

| Watch phrase | Why it's flagged | What to do |
|---|---|---|
| In today's [fast-paced / digital / interconnected] world / landscape / era | The most-flagged AI opener of all time. | Cut. Start with a claim or specific. |
| In an era of | Same. | Cut. |
| In the world of | Same. | Cut. |
| It's important to note that | Hedging filler. | State the thing directly. |
| It's worth noting that | Same. | State it. |
| It goes without saying | Same. | If it goes without saying, don't say it. |
| Needless to say | Same. | Cut. |
| At the end of the day | Conclusion-flavored filler. | Cut. |
| Ultimately | Often unnecessary. | Cut, or name the actual end-state. |
| In conclusion | Telegraphs the summary you shouldn't be writing. | Cut. End at the last interesting sentence. |
| To summarize | Same. | Cut. |
| In summary | Same. | Cut. |
| Furthermore | Stiff connective. | And, also, on top of that. |
| Moreover | Same. | And, also. |
| Additionally | Often unnecessary. | And, or just start a new sentence. |
| Therefore | Stiff. | So. |
| Hence | Same. | So. |
| Thus | Same. | So. |
| As such | AI tic. | So, which means. |
| That said | Sometimes fine, but over-used for both-sides framing. | Use sparingly. |
| Indeed | Often empty. | Cut. |
| Notably | Often empty. | Cut, or name what makes it notable. |
| Importantly | Often empty. | Cut, or explain why it matters. |
| Crucially | Same. | Cut. |
| Interestingly | Often empty. | Cut, or explain what's interesting. |
| Surprisingly | Same. | Cut, or explain the expectation that was violated. |

## Closers — the tidy-summary problem

| Watch phrase | Why it's flagged | What to do |
|---|---|---|
| In conclusion | See above. | Cut. |
| To wrap up | Same. | Cut. |
| All in all | Same. | Cut. |
| All things considered | Same. | Cut. |
| When all is said and done | Same. | Cut. |
| At the end of the day | Same. | Cut. |
| The bottom line is | Same. | If you have a bottom line, lead with it instead. |
| Hopefully this | Apologetic AI close. | Cut. |
| I hope this helps | Same. | Cut from any content piece. |
| Remember, [restate the thesis] | The most AI close there is. | Cut. End on the last interesting sentence. |

## Structural patterns to flag

| Pattern | Example | What to do |
|---|---|---|
| Negative parallelism | "It's not just software, it's a movement." / "Not hate, not anger, just sadness." / "Not a feature, but a philosophy." | Allow at most one per piece. Never in opener or closer. Replace with a direct statement. |
| Rule of three | "Faster. Smarter. Safer." / "It's clean, simple, and effective." / Three-paragraph structures. | If you have three of something, ask whether two or four would be more honest. |
| The em-dash sandwich | "The product — which our users love — ships next week." Multiple em-dashes per paragraph. | Use commas, parentheses, or a separate sentence. (For Evan's voice, Part III §4 governs — one earned aside is fine, not a paragraph full.) |
| Mid-sentence self-questioning | "And the answer is — well, what is the answer?" | Cut. Decide what you're saying. |
| The colon-heavy title | "Marriage: A Modern Approach" / "Productivity: The Hidden Cost" | Use a real title, not a topic + colon + reframe. |
| Sycophantic opener | "Great question!" / "What a fascinating topic." / "This is such an important issue." | Cut. Start with the answer. |
| Rhetorical-question opener | "Have you ever wondered…" / "What if I told you…" | Cut. Start with the claim. |
| The "imagine if" hook | "Imagine a world where…" | Cut unless genuinely earned. |
| Both-sides hedging on every claim | "While X is true, it's also true that Y." applied to every paragraph. | Pick a stance. Hedge once where genuinely warranted. |
| Tidy parallel structure across paragraphs | Each paragraph opens with a similar grammatical shape. | Vary the openers — declarative, fragment, question, anecdote, specific. |

## Emoji watch list

These appear in AI output 5–11x more often than in human writing. Strip them from prose unless the owner's voice uses them (Evan's does, sparingly — Part III §2 caps it at one per post).

- ✅ green check (the #1 AI tell — used 11x more than humans)
- 🧠 brain
- 🔥 fire (as decoration)
- 🔹 small blue diamond (as a list bullet — never)
- 🚀 rocket (in a "launch announcement" context, often AI)
- 💡 lightbulb (in a "tip" context, often AI)
- ⚡ lightning, 🎯 target, 📊 bar chart (decorating headers — strip)

## Fiction-specific watch list

| Watch word | Use instead |
|---|---|
| ghost / ghostly / spectral | concrete description of what's actually there |
| quiet (overused — 10 times in one 759-word AI essay) | name the actual sound or absence |
| hum / humming | the actual sound |
| echo / echoed | the actual repetition or trace |
| liminal | actually describe the threshold |
| whisper / whispered | "said" plus context |
| shadow (figurative) | the concrete thing casting it |
| almost-Friday / not-quite-X / half-Y | just say the thing |

| Watch construction | Why |
|---|---|
| Sensory metaphors attached to abstractions: "grief tasted of metal," "Thursday tasted of almost-Friday," "sorrow draped over the sentence" | AI's signature rhetorical move — piling concepts until they collapse. Replace with concrete description or cut. |
| Mid-sentence self-questioning: "And what was it, really? A loss? A returning?" | AI tic. Decide what you're saying. |

**Generic AI character names — swap immediately if they appear:** Elara Voss / Elena Voss, Kael, Emily Carter, Sarah Thompson, Marcus / Marcus Chen, Aria, Lyra, Dr. Evelyn Reed. If a character needs a name and you don't have one from the owner, ask — don't default.
