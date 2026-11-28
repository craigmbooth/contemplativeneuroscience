# Style Guide for Paper Summaries

How the summaries on Contemplative Neuroscience are written, and how Training Evidence's should be. It is drawn from the rules in CLAUDE.md and the post template, from the posts themselves (especially those checked against the full text in late 2026, which set the current standard), and from corrections made in the commit history. Where older posts differ, follow this guide; they are being brought in line as they are audited.

For the mechanics (front-matter schema, glossary directives, build checks), see CLAUDE.md.

## What a Summary Is For

Each post explains one peer-reviewed paper to a curious reader without a science background: why the researchers asked their question, what they did, what they found, and **how much weight the result can bear**. It aims to make the research accessible without dumbing it down, keeping the nuance and dropping the jargon.

Three principles come before everything else:

1. **Accuracy against the full text.** Every number, method detail and claim comes from the paper itself, not the abstract, a press release or memory. If the full text can't be obtained, the paper goes in `PAPERS_WANTED.md` instead of being written up.
2. **Proportion.** Say how big an effect was, how certain it is and what the design can and can't show. Don't make a result sound bigger, more causal or more general than it is, and don't make it sound smaller either.
3. **Report the paper, attributed.** Say what the authors did and claim, and mark it as theirs ("the authors suggest", "they argue"). When the paper describes other studies, say that it does ("the authors cite X as finding…") rather than restating its account as fact. Don't use a post to correct or argue with figures the paper cites from elsewhere.

## Voice and Tone

- **Third person, and no personal opinions.** No "I", "my opinion" or "I find this exciting". Older posts have such asides; audited posts remove them. Judgements about a study belong in Final Reflection and are about the study ("This is a careful study…", "This small, early study made a neat point with a simple test").
- **Calm, not hyped.** Avoid "remarkable", "amazing", "groundbreaking" and exclamation marks. Let the numbers carry the interest.
- **Plain and direct.** Short declarative sentences. Contractions are fine ("didn't", "can't"). The occasional question works as a hook, especially to open a post or a snippet.
- **Explain, don't define in bulk.** Introduce a concept in the sentence where it's needed, with a short gloss in commas or parentheses ("orienting, directing attention to a cued location"). Avoid textbook-style bulleted lists of definitions; the audits replaced those with running prose.
- **Name the people.** Introduce the researchers by name in Background ("Simon Goldberg and colleagues"), then "the authors", "the team" or "the researchers". Use "Surname et al." in links and captions, not in running prose.
- **American spelling** (behavior, color, randomized, favor). Proper names and quotations keep their own spelling.

## Front Matter

**`title`**: a plain-language headline that states the finding, not the paper's title (that goes in `paper_title`). Typically 10–20 words. Match the strength of the claim to the design:
- correlational results use "went with", "was linked to", "people who… also…", never causal verbs;
- qualify where the paper does ("Didn't Change Stress Responses Overall, but More Practice Went With a Smaller IL-6 Rise");
- say "slightly" or "modestly" when effects were small, and "did at least as well as" rather than "beat" when that's what the data show;
- shorter is better if nothing is lost (a headline was cut to "A Three-Month Meditation Retreat Sharpened Visual Perception").

**`seo_title`**: at most 60 characters, for long headlines. A neutral description of the topic often works better than the finding ("How Common Are Meditation's Adverse Effects?").

**`meta_description`**: at most 155 characters (over 160 fails the build). One sentence with the design, the sample and the main finding.

**`snippet`** (shown as "In brief"): 60–75 words, self-contained, in this order: the question (often as a question), what the researchers did (design and sample size), the finding with its numbers, and the main caveat when the design is weak. It's the most-read part of the post, so it gets the most care.

**`study`** ("Study at a glance"): only facts stated in the post.
- `type`: one label from `STUDY_TYPES`.
- `design`: the actual design, specifically ("Registered systematic review and meta-analysis of randomized controlled trials…", "Cross-sectional online survey").
- `participants`: who and how many, with the denominators that matter ("434 US adults who had tried meditation at least once (from 953 screened)").
- `method` and `measures`: the procedure and what was measured.
- `limitations` (shown as "Keep in mind"): what this design can't show, concretely, as a semicolon-separated list. Not "more research is needed".

**`citation`**: APA 7th edition, with the journal in italics and the DOI as a link: `Surname, A. B., & Surname, C. (2023). Title in sentence case. *Journal*, 18(2), 369–395. [10.xxxx/yyyy](https://doi.org/10.xxxx/yyyy)`. The `paper` fields must agree with it (the build checks).

## Structure

Every post uses these headings, in this order (the template has them):

### `## Background Information`
Why the question matters and what was known before, as the paper's introduction frames it, ending with what this study set out to do and who did it. Link related posts on the site where they set the scene. Usually three paragraphs (two to four).

### `## What They Did`
The design, in enough detail to judge it: who took part and how they were recruited, what each group did and for how long, what was measured and how, and how the data were analyzed, in plain terms. Include sample sizes, dropouts and anything unusual (assumptions, exclusions, preregistration). Bullets suit inclusion criteria and lists of measures; the rest is prose.

### `## One Big Result: <the finding>`
The heading states the result in a few words ("Mindfulness Improved Accuracy, Not Speed", "Half Reported an Adverse Effect, but Few Were Impaired"). The section gives the headline numbers, usually a figure and often the authors' own sentence quoted, then puts the result in proportion: effect size, comparison group, what it does and doesn't mean.

### `## Miscellaneous Interesting Takeaways`
Three to six `###` subsections (usually five), one point each: secondary outcomes, moderators, surprises, how the measure shaped the answer, and the study's limits and trustworthiness (risk of bias, missing data, heterogeneity, who funded it). Subheadings are short statements of the point ("Longer Programs Didn't Do Better", "How You Ask Changes the Answer"), sometimes a question ("Did the Benefits Last?").

### `## Final Reflection`
Two or three paragraphs that step back: what the study adds, how far its conclusions reach, and its main limitation in plain words. Often ends by pointing to related posts on the site or to what the authors say should happen next. No new findings here.

Length follows the paper: about 500 to 2,800 words, typically around 2,000.

## Numbers and Statistics

- **Always give the numbers** behind a claim: sample sizes, percentages, means, effect sizes, and the comparison they're against.
- **Translate effect sizes.** Say whether an effect is small, moderate or large, and what that means in practice. Explain a statistic the first time it appears ("a correlation of r = .19, a small effect size, where 0 means no relationship and 1 a perfect one").
- **Prefer natural frequencies and plain proportions** where they help ("about 1 in 10", "nearly 9 in 10", "about half"), alongside the exact figure.
- **Significance:** say "statistically significant" and give p-values where the paper's claim rests on them. Don't treat "not significant" as "no effect". Say the difference wasn't clear, and note wide confidence intervals or few studies.
- **Formatting:** report values as the paper prints them (`p < .001`, `d = 0.42`, `r = −0.26`), with spaces around `=` and `<` and a true minus sign (−). Use an en dash for ranges (`5–12 months`, `0.19–0.39`). Percentages use `%`. Numbers start sentences only when spelled out.
- **Dashes:** em dashes are very rare in the posts. Use commas, parentheses or a new sentence instead.

## Caveats, Causation and Interests

- **Match causal language to the design.** Only randomized comparisons support "caused", "improved" or "reduced". For cross-sectional, observational and survey studies, write "was linked to", "went with" or "people who… also…", and say once, plainly, that the design can't show which came first.
- **Name the comparison.** "Better than a wait-list" and "better than an active control" are different claims; say which. The active-control comparison is the stronger test, so give it its due when both exist.
- **Self-report vs measurement.** Note when outcomes were self-rated and whether objective measures agreed.
- **Who was studied.** Note samples that limit generality (students, long-term practitioners, light practitioners, one country, mostly one sex).
- **Interests and funding.** Report conflicts of interest and funding when they bear on the result: developers testing their own program or app, company-employed authors, industry funding. Put it in the snippet or "Keep in mind" when it matters to the headline ("the lead author was Calm's Director of Science"). Also report any notable mismatch between the abstract and the results.

## Quotations

- Quote the authors where their own words carry the finding or a key caveat, as a markdown blockquote (`> …`) introduced by a sentence. Most posts have three.
- Quote exactly, with `…` for omissions, and gloss any abbreviation afterwards in parentheses.
- Don't reuse the same quote in two posts.
- Quote participants' descriptions of their experience when they show what a measure meant.

## Figures

- Most posts have at least one figure, saved under `public/assets/article_images/<slug>/`. Prefer a chart redrawn from the paper's reported values over a screenshot.
- The alt text becomes the caption, so it carries the figure's message in full sentences: what is plotted, the key values, how to read it (error bars, axes), and what the reader should notice.
- End each caption with its source, in one of these forms:
  - `Drawn from the values in Table 2 of Zainal and Newman, 2023.` (redrawn from reported numbers)
  - `Adapted from Chételat et al., 2017 (CC BY 4.0).` (the paper's figure, changed; openly licensed)
  - `Reproduced from Goldberg et al. (2022), Figure 1.` (the paper's figure, unchanged)

## Glossary Terms and Links

- Mark a technical term with `:term{…}` on its **first use** in the post only, never in headings. Use `case="lower"` mid-sentence and `plural` or custom text as needed (see CLAUDE.md).
- If the post needs a term the glossary lacks, add it to `definitions.yaml` with a plain-language definition and, where one exists, its Wikipedia article.
- Link related posts on the site by URL with descriptive text (`[Lindahl and colleagues](/meditation-adverse-effects-survey/)`, `[two weeks of mindfulness training and working memory](/mindfulness-gre-working-memory/)`). Mention how the studies relate, not just that they exist.

## Theme Summaries

A theme's `research_summary` ("What the Research Says") synthesizes its papers:

- It opens with **one bold sentence that answers the theme's question**, including the main caveat. It is shown on Research Themes as the short answer, so it must stand alone.
- Then the evidence, strongest designs first, each claim linked to its post as `([Surname et al., 2019](/slug/))`, with the key numbers and each study's main limitation.
- Cross-link other themes where a paper's other results belong.
- It ends with a short paragraph on what the evidence, taken together, can't yet show.
- Update it whenever a paper is added to the theme, and keep it consistent with the posts.

## Checking a Post

Before publishing, and when auditing an older post:

1. Check every number, sample size, method detail and quote against the full text, including tables and supplements.
2. Check that the headline, snippet and "Keep in mind" claim no more than the results section does.
3. Check that claims about other papers are attributed to this paper's authors, and that linked posts say the same thing.
4. Set `last_modified_at` when an existing post changes substantively.
5. Run `npm run check` and `npm run build`.

## On Training Evidence

The same guide applies to the sister site. Points that tend to matter more in exercise and supplement research:

- **Funding and conflicts:** supplement and equipment studies are often industry-funded or run by people who sell the product. Report it as above.
- **Who was studied:** samples are often small groups of young, trained men. Say so, and don't generalize to women, older adults or beginners unless the study included them.
- **What was measured:** distinguish the outcome people care about (strength, muscle size, race time, health) from the stand-in that was measured (a one-rep max on one exercise, muscle thickness by ultrasound, a lab time trial, a blood marker). Say how long the study ran; short trials can't show long-term effects.
- **Acute vs training effects:** a single dose or session is not the same as weeks of use. Say which the study tested.
