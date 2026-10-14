# HTML authoring

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

Start with exactly one top-level H1 title, then the overview. Top-level H2 headings define the
major sections and automatic sidebar contents. Other headings are allowed deeper in the story.
Repeated headings receive distinct anchors. For an internal Markdown link, use the ordinary
lowercase heading slug, for example `## Evidence` with `[evidence](#evidence)`; spaces and
punctuation become hyphens, and repetitions add `-2`, `-3`. The renderer maps these to isolated
content IDs so headings cannot overwrite document controls or diagrams. Cite sources with ordinary links or internal anchors;
hyperlinks are not loaded until the reader chooses them. Raw HTML is shown as text, never executed.

Use Markdown tables, fenced code, and ordinary blockquotes for useful callouts. Keep long code and
technical names inside disclosures. The language of the document's content is the agent's choice
under the user's request; `--lang` also selects Russian or English interface labels.

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

Use fenced `mermaid` blocks where a diagram clarifies a relationship. Always explain its meaning
in adjacent prose. The full pinned Mermaid runtime is embedded in every output. With JavaScript, each
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

See [the compact example](../assets/example.md) for the supported syntax. It is a presentation
example, not a claim about a real application. To check the renderer's focused tests:

```sh
node --test /absolute/path/to/m2h/tests/render.test.mjs
```
