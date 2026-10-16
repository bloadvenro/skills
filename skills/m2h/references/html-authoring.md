# HTML authoring

Read this reference only after `SKILL.md` selects HTML explanation mode following an explicit
affirmative user request. It contains HTML-only presentation and renderer instructions. Do not
apply its skeleton, disclosure, Mermaid, asset, or rendering requirements to chat or intermediate
messages.

The shared composition contract in [SKILL.md](../SKILL.md) also applies here. HTML supplies the
necessary document container; it does not replace a specialized human-facing output format.
Preserve required tables, fenced ASCII diagrams, and each deliverable in a mixed task without
adding overview prose, sections, citations, or new diagrams solely for this profile.

Create content as Markdown, not by editing the skeleton. Resolve paths relative to this skill's
directory, including when the skill is installed elsewhere. Run with Node 18 or newer:

```sh
node /absolute/path/to/m2h/scripts/render.mjs --input /absolute/path/answer.md --output /absolute/path/answer.html --lang ru
```

`--input` and `--output` are required; `--lang` defaults to `ru` and accepts a language tag such as
`en` or `pt-BR`. `--help` prints usage. Generation needs no package installation or network.
Missing input, inaccessible images, unsupported image types, remote images, and invalid CLI
arguments fail with a message and a nonzero exit code. Output replaces an existing file at the
requested path, so choose a path intended for this answer. Input/output symlink and hardlink aliases
of the same file are rejected. The renderer also works when the installed skill directory is a symlink.

Start with exactly one top-level H1 title as the document container. Add an overview and top-level
H2 sections only where the output contract permits and they help the reader. H2 headings define
major sections and automatic sidebar contents. Other headings are allowed deeper in the story.
Repeated headings receive distinct anchors. For an internal Markdown link, use the ordinary
lowercase heading slug, for example `## Evidence` with `[evidence](#evidence)`; spaces and
punctuation become hyphens, and repetitions add `-2`, `-3`. The renderer maps these to isolated
content IDs so headings cannot overwrite document controls or diagrams. Cite sources with ordinary links or internal anchors;
hyperlinks are not loaded until the reader chooses them. Raw HTML is shown as text, never executed.

Use Markdown tables, fenced code, and ordinary blockquotes for useful callouts. Keep long code and
optional technical detail inside disclosures; keep required identifiers and material caveats
visible. Write the document in the user's selected language;
`--lang` also selects Russian or English interface labels.

## Presentation and authoring guards

Keep material limitations, uncertainty, and required decisions visible outside closed disclosures.
Do not present an open question as a settled verdict or proposed or unimplemented work as completed.
Preserve verified facts, evidence, and mandatory handoff details at the appropriate visibility.

When authoring an explanation, do not read `assets/skeleton.html` or bundled minified or vendor
library files into model context. Use the Markdown interface and renderer instead.

## Disclosures

Use `::: details Plain-language title` and a matching closing colon fence. Nested containers
need shorter fences than their parent. Every fence must close. Summaries are plain text.

```md
# What we learned

The practical result, recommendation, and meaningful uncertainty are visible here.

## Why this matters

A useful conclusion comes before the explanation.

::::: details How the result arises
Start with the main idea for this level.

:::: details What happens at each step
Explain the narrower mechanism before showing evidence.

::: details Evidence behind one step
Put exact source excerpts, logs, or technical terms and their meanings here.
:::
::::
:::::
```

The renderer supports standard Markdown indentation and nesting, including disclosures in
blockquotes or lists. Colon fence lines inside fenced or indented code remain literal source text.
It rejects an empty summary,
unclosed details, and multiple top-level H1 titles so a malformed document is not silently delivered.
Choose section names and nesting for the subject rather than copying a rigid report outline.

## Diagrams and images

Use fenced `mermaid` blocks only when an additional diagram clarifies a relationship and is
compatible with the output contract. Preserve required tables and ASCII diagrams; HTML mode alone
does not call for a Mermaid conversion. Explain a new diagram in adjacent prose where the format
permits. The full pinned Mermaid runtime is embedded in every output. With JavaScript, each
diagram has a compact control in its upper-right corner that switches the figure between the rendered
diagram and its escaped source; only one view is shown at a time. Diagrams inside disclosures render
when the containing disclosures open. An invalid diagram shows a local error, and its source remains
available through the same control. Without JavaScript, the control stays hidden and each diagram's
source is shown as plain text.

The header's `PDF / печать` or `PDF / print` button opens disclosures and renders diagrams before
opening the browser's print dialog. Choose the browser's save-as-PDF option there to create a PDF.

Images must be local PNG, JPEG, GIF, or WebP files. Use a relative path from the Markdown file or
an absolute local path; paths containing spaces use Markdown's `<path with spaces>` destination.
The renderer embeds bytes into the HTML and retains the alternative text. Remote images, SVG,
and arbitrary data URLs are rejected. Use local evidence already authorized for the task, remove
secrets and unnecessary personal details, and create new reproduction media only when requested.

The skeleton uses system fonts and includes CSS and JavaScript inline. Its content policy blocks
network resource loads; no external fonts, scripts, or diagram services are required. External
source hyperlinks may remain as citations. Do not replace the bundled library with CDN imports.

## Inspect and deliver

After generating the document, inspect it in a browser or preview when one is available. Check the
overview language, disclosures, diagrams, mobile layout, readable tables and code, and absence of
external loads. Correct a rendering failure before delivery; explicitly distinguish an unavailable
visual check from a pass.

Deliver a clickable absolute local-file link and a short result in the accompanying final chat
response. Open the completed file in the available preview when useful.

See [the compact example](../assets/example.md) for the supported syntax. It is a presentation
example, not a claim about a real application. To check the renderer's focused tests:

```sh
node --test /absolute/path/to/m2h/tests/render.test.mjs
```
