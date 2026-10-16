---
name: trace-feature
description: Explain an existing named feature across codebase or system boundaries and render a compact ASCII map of its workflow, components, state, background processing, persistence, and integrations. Use when understanding how the feature works end to end is a user-requested meaningful deliverable, standalone or within a larger task. Do not activate solely for internal implementation tracing, another skill's research, short factual questions, status summaries, proposed designs, meta-discussion, quoted mentions, or agent-chosen cosmetic diagrams. For one request route or value transformation, use trace-dataflow or trace-data.
---

# Trace Feature

Explain a feature at system scale while keeping its primary behavior and relationships easy to scan.

## Applicability Gate

Use this skill when the feature trace described above, grounded in an existing codebase, is one
of the user's requested meaningful deliverables. It may stand alone or accompany implementation,
review, or another task. A natural-language request to explain how an existing feature works
across its major implemented parts is sufficient; the user need not name the skill.

Do not activate it solely for internal code tracing during ordinary implementation or local edits,
another skill's research step, or a cosmetic diagram chosen by the agent. Status reporting,
proposed designs, and narrow questions answerable without crossing meaningful system boundaries
do not qualify. Neither a quoted, annotated, or prior assistant mention nor a meta-discussion or
request to edit this skill's rules is a request to perform the trace.

## Resolve the Feature

1. Identify the feature, user-visible scenario, and system boundary from the prompt, conversation, current file, and repository.
2. Proceed without confirmation when the interpretation is well supported.
3. If ambiguity would materially change which feature or workflow is traced, ask one focused clarification and wait before the dependent trace work.
4. If necessary source is unavailable, state the limitation and ask one focused question for the missing repository, file, or artifact when needed to continue. Do not invent the trace; independent parts of a mixed task may continue.

## Inspect the Feature

1. Inspect the actual code and configuration before drawing the feature flow.
2. Find the user or system trigger, owning components, primary workflow, important state transitions, persistence, background processing, integrations, and observable result.
3. Prefer architectural ownership and behavior over function-by-function detail.
4. Collapse low-level helpers into the component that owns the behavior.
5. Group optional modes, secondary consumers, and exceptional paths while keeping material branches and terminal effects visible. Distinguish the synchronous workflow from background or asynchronous effects.
6. Treat “at scale” as a system-wide overview, not capacity or performance analysis, unless the user explicitly asks about load or scaling behavior.

## Render the Result

- These defaults govern the final trace deliverable, not progress messages. In standalone chat,
  return only the interpretation line and the ASCII flowchart. In a mixed task, apply this contract
  within the trace section and preserve other requested results, implementation, checks, commits,
  and handoff information outside it.
- Begin the final trace with: `Interpreted feature: <feature> for <scenario>, covering <scope>.`
- The user's explicit format supersedes these defaults. An explicitly requested HTML document may
  add its necessary container while preserving the fenced ASCII flowchart inside it.
- Do not add a prose walkthrough, evidence list, or citations solely for presentation. Keep
  material caveats, missing coverage, and uncertainty visible in the interpretation or relevant
  chart nodes rather than omitting them to fit the format.
- Output one compact ASCII flowchart in a fenced code block. Do not use Mermaid.
- The interpretation prefix and human-readable labels may follow the user's language. Preserve
  technical names, values, and the markers `(inferred)`, `example`, and `redacted` unchanged.
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
