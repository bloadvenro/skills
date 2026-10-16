---
name: trace-feature
description: Explain an existing named feature across multiple codebase or system boundaries and render a compact ASCII map of its primary workflow, components, state changes, background processing, persistence, and integrations. Use only when the user's primary request is to understand how the feature works end to end or how its major implemented parts relate. Do not use for ordinary implementation or local edits, short factual questions, status summaries, proposed designs not requiring inspection of current implementation, meta-discussion about this skill, or a mere quoted or annotated mention of its name. When the focus is one request route or one value transformation, use trace-dataflow or trace-data respectively.
---

# Trace Feature

Explain a feature at system scale while keeping its primary behavior and relationships easy to scan.

## Applicability Gate

Use this skill only when the user's primary requested deliverable is the feature trace described above, grounded in an existing codebase. Do not use it merely because the skill name appears in quoted text, an annotation, prior assistant output, or a meta-discussion about skills. A request to review or change this skill's rules is not a request to perform the trace. Do not use this skill for ordinary implementation, local edits, status reporting, proposed designs, or a narrow question that can be answered without following the feature across meaningful system boundaries.

## Resolve the Feature

1. Identify the feature, user-visible scenario, and system boundary from the prompt, conversation, current file, and repository.
2. Start with one line in this form: `Interpreted feature: <feature> for <scenario>, covering <scope>.`
3. Proceed without confirmation when the interpretation is well supported.
4. If ambiguity would materially change which feature or workflow is traced, ask exactly one focused clarification and wait.
5. If the source needed to ground the explanation is unavailable, say so and ask one focused question requesting the missing repository, file, or artifact.

## Inspect the Feature

1. Inspect the actual code and configuration before drawing the feature flow.
2. Find the user or system trigger, owning components, primary workflow, important state transitions, persistence, background processing, integrations, and observable result.
3. Prefer architectural ownership and behavior over function-by-function detail.
4. Collapse low-level helpers into the component that owns the behavior.
5. Group optional modes, secondary consumers, and exceptional paths unless they define the feature.
6. Treat “at scale” as a system-wide overview, not capacity or performance analysis, unless the user explicitly asks about load or scaling behavior.

## Render the Result

- Return only the interpretation line and the ASCII flowchart by default. Do not append a prose walkthrough, evidence list, source citations, caveats, or implementation notes unless the user explicitly requests them.
- Output one compact ASCII flowchart in a fenced code block. Do not use Mermaid.
- Give the chart one dominant workflow. Add only the relationships needed to explain how the feature fits together.
- Aim for 5–10 nodes; exceed this only when another major component or state boundary must remain visible.
- Give each node a short component or stage name plus one concise purpose line. Include a small representative example only when useful.
- Show important state changes in the node that owns them, for example `draft -> active`.
- Group shared dependencies or side effects in a single node instead of fanning out repeatedly.
- Use readable component or module names, but omit file paths, line numbers, and symbol inventories by default. Include a code location only when required to disambiguate.
- Mark an unverified relationship inline as `(inferred)`.
- Do not turn the explanation into an exhaustive call graph, class diagram, or list of every error branch.

Use this shape as a guide, adapting it to the feature:

```text
[User or system trigger]
  starts the feature
          |
          v
[Feature entry component]
  establishes context and permissions
          |
          v
[Core workflow]
  applies the feature's main rules
          |
          +--> [Grouped dependencies: state | jobs | integrations]
          |
          v
[Resulting state / user outcome]
  visible effect of the feature
```
