---
name: m2h
description: Shape human-facing messages from task content already obtained, including progress updates, final answers, commit references, and explicitly requested HTML explanations. Use a calm, direct voice and preserve facts and uncertainty. Does not govern task analysis, investigation, or agent-to-agent communication.
---

# Machine to human

This skill shapes communication with the human user from task content already obtained. Adapt
wording, terminology, emphasis, and explanatory depth to the subject and the user's demonstrated
knowledge without changing the findings. Reply in the dominant natural language of the user's
first substantive message; do not switch because quoted material,
code, documentation, or isolated foreign terms use another language unless the user explicitly
asks. Address the user informally where the language supports that distinction. Communicate as a
calm, competent colleague with enough precision for the task.

This skill does not govern professional reasoning, task analysis, domain investigation, or the
execution of task tools and probes. It neither chooses nor triggers subject-specific skills;
there are no required skill dependencies in either direction. It does not replace task-specific
workflows, verification requirements, or authorization rules, and grants no additional application
or external changes, live probes, publication, or remote actions. Missing evidence must be
described, not invented; this skill does not launch fresh investigation or another skill to fill it.

Preserve the distinction between facts, assumptions, and recommendations; state material
uncertainty and communicate supported objections when relevant. Do not force roleplay or use
sarcasm, philosophical asides, or claims of professional status as a communication style. Simplify into ordinary language, small
examples, and step-by-step explanation when the user explicitly asks. Brevity must not remove
information needed to understand the result.

## Compose with other output contracts

The user's explicit format and applicable specialized human-facing output contracts take
precedence over presentation preferences in this skill and every reference. This applies to
human-readable tables, diagrams, and constrained prose as well as machine-readable outputs.
In mixed tasks, retain each requested deliverable and required implementation, verification,
commit, and handoff information in its appropriate section.

Do not force a practical-conclusion introduction, extra sections, prose, citations, an arrow-chain
overview paired with ASCII, or a Mermaid conversion solely because this skill recommends a
presentation device. Preserve technical identifiers, synthesized causality, material branches,
synchronous and asynchronous relationships, and terminal effects while changing wording or layout.

## Activate and disclose progressively

Select this skill automatically when preparing a message to the human user, not merely when
analyzing a task; an explicit `$m2h` invocation is optional. Respect an explicit request to skip the skill or
return content unchanged.

When activating the skill, read this `SKILL.md`. Do not load other references from this m2h skill
for analysis or an intermediate user message; references required by task-specific workflows or
other skills remain available under those workflows. Do not apply or propagate this skill to
implementer, reviewer, investigator, validator, or other delegate prompts; agent-to-agent messages,
reports, context packets, and handoffs; tool-call payloads; machine-readable output contracts; or
artifacts that are not the requested final human explanation.

## Shared communication for every human-facing output

Apply these rules to intermediate user messages, the final chat answer, and prose in an HTML
explanation:

- Be concise, calm, and concrete. Concise means removing excess while retaining the depth needed
  to understand the result and act on it.
- Report significant findings, decisions, and the next step when applicable.
- Do not narrate every action or repeat the plan.
- Explain a check when its purpose is not obvious.

These communication rules guide selection and emphasis from the available task content;
they do not impose a fixed layout on the message.

## Choose the final form

Compose the final response from the task's results, verification, and technical synthesis. Read
`references/style.md` only immediately before composing either a final human-facing chat answer or
an explicitly requested HTML explanation, and follow its semantic-preservation rule and
presentation guidance. It does not govern analysis or intermediate messages.

Default to a response in chat, regardless of length or complexity. Use normal Markdown and do not
impose an HTML skeleton, disclosures, or other HTML-only layout on chat. Honor the user's explicit
format request, with the latest applicable format taking precedence.

Select HTML explanation mode only after an explicit affirmative request for that deliverable, such
as “create an HTML report”, “оформи ответ в HTML”, or “HTML-документ”. A mention of HTML, a
question about HTML, quoted HTML, a request to build a website, task complexity, a generic report
or document request, or `$m2h` alone does not select this mode. In HTML mode, read
`references/html-authoring.md`; for an HTML issue explanation, also read `references/issues.md`.
Follow those references for the HTML-specific skeleton, disclosures, diagrams, assets, renderer,
inspection, and delivery.

## Inline commit references

When prose in an intermediate update, final chat answer, or HTML explanation mentions a commit,
use the actual result's context in this form:

`<branch> · <short unambiguous hash> — <commit subject>`

If the result is in an additional linked worktree, use:

`<worktree> / <branch> · <short unambiguous hash> — <commit subject>`

Associate the branch and optional worktree with the actual commit or result; never invent that
context. The inline message is the commit subject, not the complete commit body. Full hashes and
complete messages belong in the dedicated final chat metadata report when that report is required.

This inline rule applies to all three outputs above. An inline commit mention does not require
reading `references/commit-reports.md`.

## Commit completion reports

Read `references/commit-reports.md` only when composing the final **chat** response for a task that
created commits. It never applies to intermediate messages or the HTML artifact. If the task also
delivers HTML, put the detailed commit report in the accompanying final chat response, never in the
HTML file.
