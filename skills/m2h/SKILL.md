---
name: m2h
description: Automatically apply the user's personal voice and formatting preferences to the final human-facing response of a turn, after work and verification. Default to chat at any length; create an offline HTML explanation only when the user explicitly requests an HTML document. Exclude intermediate updates and agent-to-agent communication.
---

# Machine to human

This skill is a presentation boundary. It changes how a completed result is communicated to the
user; it does not change how the work is performed, verified, or authorized.

## Activate at the final response

Select this skill automatically when preparing the final response to the human user that ends
the current turn; an explicit `$m2h` invocation is optional. Apply it to that response only,
including a direct answer that requires no tools. If the skill is loaded earlier, defer its
presentation rules until the result is ready. Respect an explicit request to skip the skill or
return content unchanged.

Do not apply or propagate this skill to:

- analysis, planning, technical decisions, tool selection, or tool calls;
- intermediate commentary or progress updates;
- implementer, reviewer, investigator, validator, or other delegate prompts;
- agent-to-agent messages, reports, context packets, or handoffs;
- artifacts that are not the requested final human explanation.

Complete the work, verification, and technical synthesis first. Freeze the semantic content of the
answer: outcomes, evidence, uncertainty, risks, citations, paths, commit metadata, and required user
actions. Immediately before presenting that result, read [the style profile](references/style.md).

The profile may change wording, organization, emphasis, and tone. It must not add, omit, soften,
or reinterpret technical facts or required handoff content. Higher-priority output contracts and
the user's task-specific format always take precedence. Preserve required information even when it
needs a concise statement with supporting detail; in HTML, a disclosure may hold that detail.

## Choose the final form

- Default to a response in chat, regardless of length or complexity. Apply the personal voice,
  overview-first structure, and ordinary formatting preferences from the style profile. Adapt
  depth to the question: keep a direct answer short and give a complex answer useful detail.
- Create one standalone HTML explanation using the supplied skeleton only when the user explicitly
  requests that deliverable, for example, "HTML-документ", "оформи ответ в HTML", or "create an HTML
  report". Read the HTML references only in this mode. Deliver a clickable absolute file link and
  a short result in chat. Open the completed file in the available preview when useful.
- A mere mention of HTML, a question about it, quoted source text, a request to build an HTML
  website, or `$m2h` alone does not request an HTML explanation. Answer length, complexity, and
  automatic activation do not select HTML mode. A generic request for a report or document does
  not select HTML either; honor the requested artifact and its format.
- An explicit user format wins: if they ask for Markdown, plain text, a document, or chat only,
  present the result in that format and apply the same overview-first voice where it fits. For
  conflicting format requests, follow the latest applicable explicit instruction.

In chat, use normal Markdown supported by the conversation. Do not impose the HTML skeleton,
collapsible sections, or HTML-only restrictions on technical terms. Readable technical names,
paths, code, citations, and required metadata may appear directly when they help the answer.

## Produce an HTML explanation

Enter this workflow only after selecting HTML mode above. Use ordinary language on the first
screen and in visible headings and disclosure summaries, as a specialist presenting a decision
to a manager. Introduce specialized terms and their meaning inside the corresponding depth.
Repeat the useful overview before detail inside complex sections. Keep significant uncertainty
and decisions visible without opening anything.

Read [HTML authoring and CLI usage](references/html-authoring.md). Choose the story and sections
for this task; the skeleton fixes presentation, not the narrative. Write Markdown, then run
`scripts/render.mjs` with Node. It supplies layout, escaped content, local images, native disclosures,
and an inline Mermaid runtime without installing packages or fetching resources during generation.
Do not read `assets/skeleton.html` or minified vendor files into model context when filling content.

For an issue explanation, also read [issue evidence and scenario guidance](references/issues.md).
The issue author's reported actions and expectation are not interchangeable with a diagnosis.
This skill authorizes no application changes, live probes, publication, or remote operations.

Inspect the generated document when a browser or preview is available: overview language,
disclosures, diagrams, mobile layout, readable tables and code, and absence of external loads.
Correct a rendering failure before delivery; distinguish any unavailable visual check from a pass.
