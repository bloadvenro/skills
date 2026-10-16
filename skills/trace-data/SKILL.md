---
name: trace-data
description: Trace one concrete input value or data object through multiple meaningful transformations to its final destination and render the result as a Markdown table. Use only when the user's primary request is to follow how that value changes across validation, normalization, defaulting, filtering, enrichment, serialization, persistence, transmission, masking, encryption, or dropping. Do not use for ordinary implementation or local edits, simple field lookups, broad feature architecture, request routing, meta-discussion about this skill, or a mere quoted or annotated mention of its name.
---

# Trace Data

Follow one value through the system and make each meaningful representation change visible.

## Applicability Gate

Use this skill only when the user's primary requested deliverable is the value trace described above, grounded in an existing codebase. Do not use it merely because the skill name appears in quoted text, an annotation, prior assistant output, or a meta-discussion about skills. A request to review or change this skill's rules is not a request to perform the trace. Do not use this skill for ordinary implementation, local edits, status reporting, or a narrow question that can be answered without following one concrete value through meaningful transformations.

## Resolve the Value

1. Identify the value or object, its origin, relevant scenario, and intended trace boundary from the prompt, conversation, current file, and repository.
2. Start with one line in this form: `Interpreted value trace: <value> from <origin> to <destination or terminal boundary>.`
3. Proceed without confirmation when the interpretation is well supported.
4. If the value, source, or scenario remains materially ambiguous, ask exactly one focused clarification and wait.
5. If the source needed to ground the trace is unavailable, say so and ask one focused question requesting the missing repository, file, or artifact.

## Inspect the Transformations

1. Inspect the actual code before building the table.
2. Follow aliases, field mappings, type changes, validation, normalization, defaults, filtering, enrichment, serialization, masking, encryption, storage representation, transmission, and dropping.
3. Include a pass-through step only when the value crosses an important ownership, trust, storage, or transport boundary.
4. Record the value after each meaningful transformation. Use the same representative example consistently so changes are easy to compare.
5. Never expose a real secret or sensitive value. Use a clearly labeled redacted or representative example instead.
6. Trace until the value is stored, transmitted, returned, consumed, or discarded.

## Render the Result

- Return only the interpretation line and the Markdown table by default. Do not append a prose walkthrough, evidence list, or source citations unless the user explicitly requests them.
- Output a Markdown table with exactly these columns:

  `Step | Current value / shape | Module / stage | Transformation / reason | Next destination`

- Use one row per meaningful transformation or important boundary.
- Put representative values and shapes in backticks. Label invented values as `example` and redactions as `redacted`.
- Describe both what changed and why. If the value remains unchanged at an important boundary, say `unchanged` and explain the boundary.
- Group immaterial helper calls and repeated pass-throughs into one conceptual stage.
- Use readable component or module names, but omit file paths, line numbers, and symbol inventories by default. Include a code location only when required to disambiguate.
- Mark an unverified row as `(inferred)` in the transformation cell.
- Avoid branch explosion. Add separate conditional rows only when variants materially change the value or its final destination.
- Make the final row the terminal stored, transmitted, returned, consumed, or discarded form.
- Do not add an ASCII flowchart unless the user explicitly asks for one in addition to the table.
