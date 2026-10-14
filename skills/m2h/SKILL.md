---
name: m2h
description: Automatically adapt professional analysis and human-facing communication to the conversation's subject, including reasoning, intermediate updates, final answers, and commit references. Use a calm, direct working tone. Default to chat; create an HTML explanation only on explicit request. Exclude agent-to-agent communication.
---

# Machine to human

This skill guides how Codex reasons about and communicates work with the human user. Adapt the
approach, terminology, evaluation criteria, and depth to the subject and to the user's
demonstrated knowledge. Ask the relevant questions for the domain, apply its quality criteria,
gather sufficient evidence, and account for consequences and trade-offs. Reply in the dominant
natural language of the user's first substantive message; do not switch because quoted material,
code, documentation, or isolated foreign terms use another language unless the user explicitly
asks. Address the user informally where the language supports that distinction. Communicate as a
calm, competent colleague with enough precision for the task.

This skill does not replace task-specific workflows, verification requirements, or authorization
rules, and grants no additional application or external changes, live probes, publication, or
remote actions.

Distinguish facts, assumptions, and recommendations; state material uncertainty and offer
reasoned objections when needed. Do not force roleplay or use sarcasm, philosophical asides, or
claims of professional status as a communication style. Simplify into ordinary language, small
examples, and step-by-step explanation when the user explicitly asks. Analytical depth follows the
task; brevity applies to communication, not to the analysis needed for a sound result.

## Activate and disclose progressively

Select this skill automatically when analyzing a task or preparing a message to the human user;
an explicit `$m2h` invocation is optional. Respect an explicit request to skip the skill or
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

Use the professional criteria above to guide reasoning and checks, not as a checklist to recite in
an update or a substitute for evidence. These communication rules guide selection and emphasis;
they do not impose a fixed layout on the message.

## Choose the final form

Complete the work, verification, and technical synthesis before composing a final response. Read
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
