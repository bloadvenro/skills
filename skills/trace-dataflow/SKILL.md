---
name: trace-dataflow
description: Trace one concrete user interaction, API request, command, or event across implemented system boundaries to its terminal effects and render a compact ASCII flowchart. Use when following that route end to end is a user-requested meaningful deliverable, standalone or within a larger task. Do not activate solely for internal implementation tracing, another skill's research, narrow endpoint questions, status summaries, meta-discussion, quoted mentions, or agent-chosen cosmetic diagrams. For one value's transformations, use trace-data.
---

# Trace Dataflow

Trace the main system-wide route of an interaction without turning the result into a call graph.

## Applicability Gate

Use this skill when the interaction or request trace described above, grounded in an existing
codebase, is one of the user's requested meaningful deliverables. It may stand alone or accompany
implementation, review, or another task. A natural-language request to explain an interaction's
route end to end is sufficient; the user need not name the skill.

Do not activate it solely for internal code tracing during ordinary implementation or local edits,
another skill's research step, or a cosmetic diagram chosen by the agent. Status reporting and
narrow questions answerable without crossing meaningful system boundaries do not qualify.
Neither a quoted, annotated, or prior assistant mention nor a meta-discussion or request to edit
this skill's rules is a request to perform the trace.

## Resolve the Trace

1. Identify the interaction or request, entry point, relevant scenario, and terminal boundary from the prompt, conversation, current file, and repository.
2. Proceed without confirmation when the interpretation is well supported.
3. If a missing detail would materially change the route and cannot be inferred confidently, ask one focused clarification and wait before the dependent trace work. Do not produce a speculative trace first.
4. If necessary source is unavailable, state the limitation and ask one focused question for the missing repository, file, or artifact when needed to continue. Do not invent the trace; independent parts of a mixed task may continue.

## Inspect the System

1. Inspect the actual code before drawing the flow.
2. Follow the route through meaningful boundaries: UI or transport adapter, validation, orchestration, domain logic, persistence, queues or events, background jobs, external calls, response construction, and final consumers.
3. Include only stages that change ownership, representation, state, or destination. Collapse helpers and pass-through calls into their owning conceptual stage.
4. Separate the primary synchronous route from grouped asynchronous or terminal side effects.
5. Treat “at scale” as a system-wide overview, not capacity or performance analysis, unless the user explicitly asks about load or scaling behavior.

## Render the Result

- These defaults govern the final trace deliverable, not progress messages. In standalone chat,
  return only the interpretation line and the ASCII flowchart. In a mixed task, apply this contract
  within the trace section and preserve other requested results, implementation, checks, commits,
  and handoff information outside it.
- Begin the final trace with: `Interpreted trace: <interaction> from <entry> through <scope> to <terminal effects>.`
- The user's explicit format supersedes these defaults. An explicitly requested HTML document may
  add its necessary container while preserving the fenced ASCII flowchart inside it.
- Do not add a prose walkthrough, evidence list, or citations solely for presentation. Keep
  material caveats, missing coverage, and uncertainty visible in the interpretation or relevant
  chart nodes rather than omitting them to fit the format.
- Output one compact ASCII flowchart in a fenced code block. Do not use Mermaid.
- The interpretation prefix and human-readable labels may follow the user's language. Preserve
  technical names, values, and the markers `(inferred)`, `example`, and `redacted` unchanged.
- Prefer one vertical spine with clear arrows. Group sibling effects instead of expanding every branch.
- Aim for 5–9 nodes; exceed this only when collapsing another system boundary would be misleading.
- Give each node a short stage or component name plus one concise purpose line. Add a small representative event or value only when it improves understanding.
- Use readable component or module names, but omit file paths, line numbers, and symbol inventories by default. Include a code location only when necessary to disambiguate similarly named components.
- Mark any unverified step inline as `(inferred)`. Do not present inference as code-confirmed behavior.
- Omit routine error paths and minor conditionals. Keep exceptional behavior when it materially
  changes persisted state, the final destination, or other terminal effects; group it compactly.
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
