---
name: trace-dataflow
description: Trace one concrete user interaction, API request, command, or event through multiple implemented system boundaries to its terminal effects and render a compact ASCII data/event flowchart. Use only when the user's primary request is to follow that route end to end across UI, API, services, persistence, queues, jobs, or external systems. Do not use for ordinary implementation or local edits, narrow endpoint questions answerable without an end-to-end trace, status summaries, meta-discussion about this skill, or a mere quoted or annotated mention of its name. When the main question is how one value changes, use trace-data instead.
---

# Trace Dataflow

Trace the main system-wide route of an interaction without turning the result into a call graph.

## Applicability Gate

Use this skill only when the user's primary requested deliverable is the interaction or request trace described above, grounded in an existing codebase. Do not use it merely because the skill name appears in quoted text, an annotation, prior assistant output, or a meta-discussion about skills. A request to review or change this skill's rules is not a request to perform the trace. Do not use this skill for ordinary implementation, local edits, status reporting, or a narrow question that can be answered without following the subject across meaningful system boundaries.

## Resolve the Trace

1. Identify the interaction or request, entry point, relevant scenario, and terminal boundary from the prompt, conversation, current file, and repository.
2. Start with one line in this form: `Interpreted trace: <interaction> from <entry> through <scope> to <terminal effects>.`
3. Proceed without confirmation when the interpretation is well supported.
4. If a missing detail would materially change the route and cannot be inferred confidently, ask exactly one focused clarification and wait. Do not produce a speculative trace first.
5. If the source needed to ground the trace is unavailable, say so and ask one focused question requesting the missing repository, file, or artifact.

## Inspect the System

1. Inspect the actual code before drawing the flow.
2. Follow the route through meaningful boundaries: UI or transport adapter, validation, orchestration, domain logic, persistence, queues or events, background jobs, external calls, response construction, and final consumers.
3. Include only stages that change ownership, representation, state, or destination. Collapse helpers and pass-through calls into their owning conceptual stage.
4. Separate the primary synchronous route from grouped asynchronous or terminal side effects.
5. Treat “at scale” as a system-wide overview, not capacity or performance analysis, unless the user explicitly asks about load or scaling behavior.

## Render the Result

- Return only the interpretation line and the ASCII flowchart by default. Do not append a prose walkthrough, evidence list, or source citations unless the user explicitly requests them.
- Output one compact ASCII flowchart in a fenced code block. Do not use Mermaid.
- Prefer one vertical spine with clear arrows. Group sibling effects instead of expanding every branch.
- Aim for 5–9 nodes; exceed this only when collapsing another system boundary would be misleading.
- Give each node a short stage or component name plus one concise purpose line. Add a small representative event or value only when it improves understanding.
- Use readable component or module names, but omit file paths, line numbers, and symbol inventories by default. Include a code location only when necessary to disambiguate similarly named components.
- Mark any unverified step inline as `(inferred)`. Do not present inference as code-confirmed behavior.
- Omit routine error paths and minor conditionals. Group exceptional behavior only when it materially changes the final destination.
- End at every meaningful terminal effect: response or consumer, persisted state, queued work, emitted event, dropped data, or external system.

Use this shape as a guide, adapting it to the system rather than forcing every node:

```text
[User action / API request]
  intent; example input
          |
          v
[Entry adapter]
  accepts and normalizes the interaction
          |
          v
[Application workflow]
  coordinates the main operation
          |
          +--> [Grouped side effects: storage | event | external API]
          |
          v
[Response / final consumer]
  observable outcome
```
