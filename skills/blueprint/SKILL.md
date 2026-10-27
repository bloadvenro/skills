---
name: blueprint
description: Create and maintain milestone-based development plans. Use when drafting implementation plans, including Plan Mode, implementing from an existing plan, or updating that plan and its progress during implementation. Not for ordinary status replies or generic writing.
---

# Blueprint

Create and maintain a development plan as a standalone report-style document.
The plan must help the reader understand the task, resume work after a break, and verify exactly
what is complete. Apply these rules during initial planning, implementation from such a plan,
and its revision. The structure is extensible; the content is required, not a fixed set of titles.

## Scope and compatibility

This skill defines the plan's presentation and maintenance. It does not enable Plan Mode,
authorize implementation, or change permissions, mode restrictions, or project rules.
The plan may appear in chat; a separate Markdown file is not required. Create or modify
a persistent file only in an authorized location and within the current request. If the mode
prohibits writes, present the plan through an allowed method and clearly identify its current revision.

Other applicable workflows govern execution, roles, review, verification, and required approvals.
Reflect their applicable completion gates in the plan without copying their protocols.
`earned-done` and `m2h` are not dependencies of this skill and are not launched by it automatically.

When used together, `m2h` may improve the language, clarity, and expression of uncertainty
in human-facing text. Preserve the numbered headings, table of contents, IDs, anchors,
progress table, and substantive content specified here. A preference for brevity or lists must not
turn the document into a short reply or remove criteria, evidence, limitations, or decision history.
Freezing content before editing applies to that presentation pass; it does not prohibit
later substantive updates to the plan. HTML anchors are not a request for an HTML report.

## Minimum content contract

The plan must contain:

- The task title and expected outcomes, with the overall completion boundary.
- Material context: verified facts with their basis, user reports,
  assumptions, constraints, and scope boundaries. Distinguish these categories; an assumption
  does not become a fact by being included in the plan.
- Current progress, the next available step, and material blockers.
- Milestones with permanent IDs, outcomes, dependencies, acceptance criteria, and verification.
- Final acceptance of the complete scenario, including interactions between individual stages' results.
- Material findings, decisions, revisions, unfinished work, and outcomes when they arise.

Place each piece of information where it fits best and reference it from other sections.
Do not repeat the shared context in every milestone. Do not create empty logs or formal
sections "just in case." Retain any open question that affects the approach or acceptance,
together with its impact and how it will be resolved.

## Document format and navigation

Start with one level-one heading containing the task's name or formulation. Below it,
briefly state the document's status and revision, for example `Draft plan · revision 1`.
Distinguish plan status from execution: a prepared plan does not mean its stages are complete.

Add an unnumbered "Table of contents" section without page numbers. Use a list of links
reflecting the hierarchy of **all** substantive sections and subsections. Number their headings:
`1. …`, `2. …`, `2.1. …`. Do not number the document title or the table of contents, and do not
include them in the table of contents. If adding another heading level, continue the hierarchy and add links.

Heading numbers and language are presentational. They may change when the document is reorganized.
The language of these instructions and examples does not impose English on plans; follow the user's requested language.
IDs and anchors belong to entities and remain stable regardless of order or wording.
Use unique explicit ASCII anchors before headings, for example:

```markdown
- [4.2. Create a task](#milestone-m2)

<a id="milestone-m2"></a>
### 4.2. Create a task

**ID:** M2
```

For ordinary sections, choose semantic anchors such as `context`, `progress`, or `decisions`.
Do not regenerate them from a translated or renumbered heading. When extending the document,
update the table of contents and links. Do not use one anchor in multiple places in the document.

Support for explicit HTML anchors depends on the Markdown renderer. If the current environment
strips or does not support them, state that limitation; use a verified mechanism of that environment
or available heading-based links as an explicitly identified, less stable fallback. Preserve IDs
in the text. If navigation verification is required by the task or is claimed to have been performed,
observations of navigation in the relevant viewer are needed. Do not promise working navigation without
that verification; if the viewer is unavailable, explicitly mark navigation in it as unverified.
Structural link validation does not prove navigation by clicking. For actual navigation evidence,
retain the document revision or hash, the viewer, and the result. After changing the table of contents
or anchors, recheck the affected navigation before relying on that evidence again.
Do not convert the whole document to HTML for anchors without the user's request.

## Permanent identifiers and dependencies

Assign milestones `M1`, `M2`, … once for the lifetime of the plan.
When decomposition is useful, use permanent substep IDs such as `M2.1` and `M2.2`.
These identify substeps, not their positions in the table of contents. Reordering or moving
a substep does not rename it; if its parent relationship changes, explicitly record the new relationship.
Issue new IDs without reusing old ones. For separately tracked issues or decisions,
other prefixes such as `I1` and `D1` may be used when needed.

Do not renumber or reuse IDs when reordering, splitting, deferring, or removing items.
Keep old anchors with their corresponding records. For a cancelled or replaced item, retain
a brief record with its former ID and anchor, the reason, and a link to the replacement; do not duplicate the anchor on the replacement.
When splitting, retain the original milestone as a group or a replacement record pointing to new IDs.
If an equivalent replacement fully transfers the obligations to active items,
the old record serves only to preserve the ID, anchor, history, and navigation to the replacement. It receives
no separate active count or weight. The transfer itself neither completes work nor changes its scope.

Specify a dependency through an existing ID and the required state or result:
for example, `M1 — input format agreed`. Clarify whether completion of the entire
stage or a specific intermediate result is required. Do not impose unnecessary sequential dependencies.
References must resolve; the graph of required dependencies must be acyclic.

IDs are unique within the plan. Add a dependency on another plan only when the relationship is real:
a link to an existing document and its anchor, plus the required result. Do not create a global
registry or access external systems to verify a link without the appropriate authorization.
Explicitly mark an unavailable or unverified external dependency.

## Milestone contract

For each milestone, describe:

- **ID and outcome:** a concrete achieved state that can be verified.
- **Boundaries:** what is included and which material adjacent work is excluded.
- **Readiness to start:** dependencies and necessary conditions; explicitly state when there are none.
- **Approach and actions:** the intended implementation approach and main changes. Name
  affected existing components and paths when they are established and useful; do not invent
  paths or require a line-by-line recipe.
- **Substeps:** only when they identify meaningful parts that can be carried out and verified.
  Give each an ID, an expected result, and its own acceptance criteria.
- **Acceptance criteria:** observable success conditions, including material negative
  scenarios and limitations. "Write the code" or "80% done" does not replace criteria.
- **Verification:** the action or method, scenario to check, and expected result. Specify
  exact commands, paths, and environment only when established; mark unknowns
  as requiring clarification rather than inventing commands to appear concrete.
- **Completion gate and evidence:** which criteria and applicable workflow checks
  must be closed; after execution, what was actually verified and where the result is recorded.

Distinguish planned verification from observations of verification actually performed. Bind actual
evidence sufficiently: the scenario checked, the result version or relevant environment,
and a link to a specific test/run, log entry, output, or artifact,
or a brief observation.
If only source inspection is available, do not call it a reproduction of behavior.

The `done` status requires this order: satisfy criteria and execute required checks and closing actions;
record actual results; only then publish `done` and credit accepted progress. Pending checks, evidence
recording, and cleanup remain incomplete. For plan self-validation, validate the prepared final revision
before publishing its completion state; later invalidation reopens affected work. Do not add
mandatory manual user acceptance unless the request itself or an applicable workflow requires it.
Completed substeps do not waive the parent milestone's integration criteria.

## Progress and source of state

By default, the plan itself is the canonical source of state. If it is a file, identify its location;
if the plan remains in chat, identify the current revision and retain the necessary
context in it. Do not create a second independently edited tracker. An additional table,
diagram, or status message is a view of the same records, not another source of truth.

Keep a compact summary: ID, outcome, status, dependencies, evidence, or blocker.
For a large task, details and links may live in the milestone, with the summary linking to them.
Show the completed count out of the total required units at the selected
level, and separately explain groups with partially completed substeps. Do not present the number
of written steps as the number of accepted outcomes. Do not count both a historical
equivalent-replacement record and its active successors. Unfulfilled obligations without
an equivalent replacement remain in the total until an agreed scope change.

Use a clear lifecycle; recommended statuses:

| Status | Meaning |
|---|---|
| `pending` | Work has not started; readiness depends on the stated conditions. |
| `in_progress` | Work is underway; completion gates are not yet satisfied. |
| `blocked` | A stated condition prevents progress; the blocker and next action are recorded. |
| `done` | Criteria and applicable checks are satisfied; evidence is recorded. |
| `deferred` | Work is postponed with a reason and condition for resuming; it is not complete. |
| `cancelled` | Work is removed or replaced with a recorded basis; it is not complete. |

The parent's aggregate state must not hide deferred, blocked, or cancelled
child obligations. Substep checkboxes and the summary must agree; a checkmark means
the criteria are satisfied, not merely that an action occurred in the past. If evidence is invalidated
or a regression is discovered, reopen the affected work and record the reason.

Update state at meaningful transitions, new material findings, blockers,
revisions, and resumption. Do not rewrite the plan after every tool call.
Brief status replies refer to the changed IDs, evidence, and next step.

### Percentages — only with a useful and explicit calculation basis

For small plans, statuses and an accepted-outcome count are enough. A percentage is optional.
If needed, set relative weights for verifiable units and the calculation basis in advance,
covering the entire required scope, including final acceptance. It may be a separate
milestone. Weights describe the scope of outcomes, not time spent.

```text
Progress = sum of weights of accepted units / sum of weights of required scope × 100%.
```

Credit weight only for accepted leaf units. Do not count both a group and its substeps.
Represent the group's integration criteria as a separate leaf unit or withhold the appropriate
share until they are met. When splitting, preserve the original unit's total weight. Do not assign
subjective intermediate percentages or retroactively change weights to increase the metric.
For an equivalent replacement, transfer the weight together with all obligations to its successors;
the historical record adds no independent weight. For example, replacing M1 with weight 40 by
M2 with weight 20 and M3 with weight 20 preserves the basis of 40 rather than increasing it to 80.
The transfer itself earns no credit. Untransferred obligations retain their weight until satisfied
or covered by an agreed scope change.

Deferring or cancelling work does not by itself reduce the denominator or increase
progress. An agreed scope change may alter the active basis: retain the original
basis and the reason/basis for revision, show the original and revised scope, and identify
which revision the percentage describes. Reducing scope is not completing the excluded work.
Reopening work removes its corresponding credit. The percentage may decrease; explain why.
Even 100% of calculated weight does not replace checking the plan's overall completion gate.

## Extension and replanning during implementation

Add or reorganize sections when needed to resume, verify, or
explain the work. Keep local detail in its milestone; move cross-cutting, lengthy, or separately
tracked information into a linked section. For example, sections may include
"Findings and discoveries," "Discovered issues," "Decision log," "Risks," "Verification gaps,"
"Migration and rollback," or "Outcomes." These are examples, not a required list.

For a material finding, retain the observation, basis, impact, and next action.
Mark hypotheses. Distinguish a defect in the current change, a pre-existing issue, and
an issue outside the task's scope; a "verified" status requires a basis. Finding an unrelated bug
does not authorize fixing it: record it separately and link it to the affected milestones.

For a decision, retain the selected option, material reasons, and consequences. For a material
revision, retain the revision, affected IDs, what changed, why, and its effect on remaining
work, acceptance, and progress calculations. Preserve previous obligations in the history and link to replacements.
Distinguish proposed scope changes from those already agreed.

Refine steps, methods, and dependencies independently within the authorized scope.
Do not silently weaken acceptance criteria or reduce the expected result. Changes
requiring authorization under the task's conditions remain proposals until it is received.
Extending the document does not grant authority to expand implementation, access
remote systems, or publish the result.

When changing the verification method, record the reason, the new method's coverage, and the remaining gap.
A change of tool does not by itself mean failure; a required unverified result
still prevents `done`.

When transferring or substantially revising a plan, compare against the agreed revision:

- Have material inputs, expected results, constraints, and completion gates been preserved;
  is it clear what remains outside scope?
- Are facts, hypotheses, decisions, and proposals awaiting agreement distinguished?
- Does each obligation have an ID, criteria, verification, and current state;
  are statuses consistent with actual readiness and dependencies?
- Do dependencies and references resolve, without cycles, duplicate IDs, or duplicate anchors?
- Are the summary, details, table of contents, and progress calculation consistent; are old link targets preserved?
- Are material findings, blockers, verification gaps, and reasons for revision reflected?

When resuming, read the current revision, check changed conditions, and continue
according to available dependencies. Retain essential context and evidence links in the plan
so resumption does not depend solely on chat memory. This requirement does not authorize creating
a persistent file where writing has not been authorized.

## Completion and visualization

Complete execution of the plan after all required outcomes in the current authorized scope
and final acceptance. A completed milestone count does not complete the entire request if
required outcomes remain outside that count, including explicitly requested checks of the plan itself
and the deliverable. Retain their state in a suitable place within the same plan; no new milestone
or second tracker is required. A required unverified result prevents completion. Preserve the original
scope's history; list remaining limitations, exclusions, and unfulfilled proposals. A deferred
obligation without an agreed scope change also prevents completion.

For convenience, a dependency or work-sequence diagram may be added,
derived from the same IDs and statuses. Do not invent calendar dates, durations, or ETAs. The diagram
must be updated together with its underlying records and must not replace acceptance criteria. This skill
does not create an automatically updating widget in the application's interface.

## Example outline

The following outline illustrates the format. Adapt the titles, grouping, number of milestones,
and additional sections to the task while preserving the minimum contract.

```markdown
# Plan: <task>

Draft plan · revision 1

## Table of contents

- [1. Task and expected outcome](#goal)
- [2. Context and boundaries](#context)
- [3. Progress](#progress)
- [4. Milestones](#milestones)
  - [4.1. <Verifiable outcome>](#milestone-m1)
- [5. Final acceptance](#acceptance)

<a id="goal"></a>
## 1. Task and expected outcome

<a id="context"></a>
## 2. Context and boundaries

<a id="progress"></a>
## 3. Progress

<a id="milestones"></a>
## 4. Milestones

<a id="milestone-m1"></a>
### 4.1. <Verifiable outcome>

**ID:** M1 · **Status:** pending

<a id="acceptance"></a>
## 5. Final acceptance
```
