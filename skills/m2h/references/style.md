# Final presentation profile

Read this reference only immediately before composing either a final human-facing chat answer or
an explicitly requested HTML explanation. It supplies presentation structure and formatting
preferences; shared reasoning and communication rules are in [SKILL.md](../SKILL.md).

## Preserve semantic content

Before applying presentation rules, freeze the semantic content of the answer: outcomes, evidence,
material uncertainty, risks, citations, paths, commit metadata, and required user actions. The
presentation may change wording, organization, emphasis, and tone, but must not add, omit, soften,
or reinterpret technical facts or required handoff content. Higher-priority output contracts and
the user's explicit format take precedence. Preserve required information even when it needs a
concise statement with supporting detail; in HTML, a disclosure may hold that detail.

## Final answer structure

- Start with the practical result, consequence, decision, and important unknowns.
- For complex topics, disclose information progressively:
  `conclusion → rationale → options and trade-offs → details → actions`.
- Apply the same overview-first principle inside substantial sections.
- Keep simple answers short. Give complex answers enough detail to support a decision without
  unnecessary length.
- For action plans, prefer a two- or three-level Markdown list when it improves scanning.
- Use a natural first-person colleague voice for recommendations, such as “I would check this
  first.”
- Avoid closing encouragement or repeated summaries when they add no new information.

In chat, use normal Markdown. Keep technical terms, paths, code, citations, and mandatory metadata
directly visible when they help the answer. Do not require disclosures or generate HTML because an
answer is substantial. The HTML-specific authoring structure is defined in
[html-authoring.md](html-authoring.md), and applies only in the explicit HTML mode selected by
`SKILL.md`.

## Tables and diagrams

- Use compact tables for comparisons, exact mappings, and multi-option summaries when they improve
  scanning.
- When rating alternatives, order them from least to most suitable:
  `🔴 unsuitable → 🟡 conditional → 🟢 recommended`.
- Use functional emoji in table headers when they create useful visual contrast. Duplicate the
  same suitability marker in both the option and verdict cells to create anchors across wide
  tables.
- Use arrow chains for linear sequences, for example:
  `initialization → cleanup → reinitialization`.
- For branching or multi-component flows in chat, pair the arrow-chain overview with a compact
  ASCII diagram: the chain supplies the immediate model, and the diagram reveals the branches.
- Do not add a visualization when a short paragraph would be clearer.
- Avoid decorative emoji. Use them primarily as functional icons or status markers.

## Examples and code

- Provide examples when the explanation would otherwise remain abstract or easy to misinterpret.
- Use the smallest example that demonstrates the point.
- Avoid long code snippets unless the user explicitly requests them. Prefer short excerpts, diffs,
  pseudocode, or a concise description of the transformation.
