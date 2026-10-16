---
name: trace-data
description: Trace one concrete input value or data object through meaningful transformations to its final destination and render a Markdown table. Use when explaining how that value changes is a user-requested meaningful deliverable, standalone or within a larger task. Do not activate solely for internal implementation tracing, another skill's research, simple field lookups, broad feature architecture, request routing, meta-discussion, quoted mentions, or agent-chosen cosmetic diagrams.
---

# Trace Data

Follow one value through the system and make each meaningful representation change visible.

## Applicability Gate

Use this skill when the value trace described above, grounded in an existing codebase, is one of
the user's requested meaningful deliverables. It may stand alone or accompany implementation,
review, or another task. A natural-language request to explain how a value changes is sufficient;
the user need not name the skill.

Do not activate it solely for internal code tracing during ordinary implementation or local edits,
another skill's research step, or a cosmetic diagram chosen by the agent. Status reporting and
narrow questions that need no meaningful transformation trace do not qualify. Neither a quoted,
annotated, or prior assistant mention nor a meta-discussion or request to edit this skill's rules
is a request to perform the trace.

## Resolve the Value

1. Identify the value or object, its origin, relevant scenario, and intended trace boundary from the prompt, conversation, current file, and repository.
2. Proceed without confirmation when the interpretation is well supported.
3. If the value, source, or scenario remains materially ambiguous, ask one focused clarification and wait before the dependent trace work.
4. If necessary source is unavailable, state the limitation and ask one focused question for the missing repository, file, or artifact when needed to continue. Do not invent the trace; independent parts of a mixed task may continue.

## Inspect the Transformations

1. Inspect the actual code before building the table.
2. Follow aliases, field mappings, type changes, validation, normalization, defaults, filtering, enrichment, serialization, masking, encryption, storage representation, transmission, and dropping.
3. Include a pass-through step only when the value crosses an important ownership, trust, storage, or transport boundary.
4. Record the value after each meaningful transformation. Use the same representative example consistently so changes are easy to compare.
5. Never expose a real secret or sensitive value. Use a clearly labeled redacted or representative example instead.
6. Trace until the value is stored, transmitted, returned, consumed, or discarded.

## Render the Result

- These defaults govern the final trace deliverable, not progress messages. In standalone chat,
  return only the interpretation line and the Markdown table. In a mixed task, apply this contract
  within the trace section and preserve other requested results, implementation, checks, commits,
  and handoff information outside it.
- Begin the final trace with: `Interpreted value trace: <value> from <origin> to <destination or terminal boundary>.`
- The user's explicit format supersedes these defaults. An explicitly requested HTML document may
  add its necessary container while preserving the table inside it; do not convert it to a diagram.
- Do not add a prose walkthrough, evidence list, or citations solely for presentation. Keep
  material caveats, missing coverage, and uncertainty visible in the interpretation or relevant
  table cells rather than omitting them to fit the format.
- Output a Markdown table with exactly these five column meanings in this order:

  `Step | Current value / shape | Module / stage | Transformation / reason | Next destination`

- The interpretation prefix and human-readable column labels may follow the user's language.
  Preserve technical names, values, and the markers `(inferred)`, `example`, and `redacted` unchanged.
- Use one row per meaningful transformation or important boundary.
- Put representative values and shapes in backticks. Label invented values as `example` and redactions as `redacted`.
- Describe both what changed and why. If the value remains unchanged at an important boundary, say `unchanged` and explain the boundary.
- Group immaterial helper calls and repeated pass-throughs into one conceptual stage.
- Use readable component or module names, but omit file paths, line numbers, and symbol inventories by default. Include a code location only when required to disambiguate.
- Mark an unverified row as `(inferred)` in the transformation cell.
- Avoid branch explosion. Add separate conditional rows only when variants materially change the value or its final destination.
- Make the final row the terminal stored, transmitted, returned, consumed, or discarded form. If
  unavailable evidence prevents reaching it, show the coverage limit there instead of inventing it.
- Do not add an ASCII flowchart unless the user explicitly asks for one in addition to the table.
