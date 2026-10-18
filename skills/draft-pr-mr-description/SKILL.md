---
name: draft-pr-mr-description
description: Draft or revise pull request (PR) and merge request (MR) descriptions when the user asks for that text, including natural phrasing or a description deliverable within a larger task. Do not activate merely for implementation completion, commits, pushes, reviews, or discussion or editing of this skill.
---

# Draft PR/MR descriptions

Prepare a complete, copyable description in chat for the user's manual posting. Drafting or invoking this skill does not by itself grant additional remote authority. Follow the standing permission rules in AGENTS.md; prefer available local evidence. Separately requested publication remains subject to those rules and exact-text approval and is not a default drafting step.

Draft strictly after all agreed work in the chat is complete. If the description is requested alongside implementation or verification, finish that work first. If agreed work is blocked or incomplete, report what is missing instead of presenting the change as ready.

Ground the description in the actual final local diff or commit range and available real check results. Determine the target, base, and range from the supplied context and local Git evidence; ask only if a material ambiguity remains. Do not choose or create the user's integration branch or silently include unrelated changes. Use remote evidence only when authorized under the standing rules.

Follow the repository's or user's template and requested language. Scale the structure to the change; a simple change does not need a large template. Explain the concrete problem and resulting behavior, then include only implementation details, validation evidence, and material limitations useful to a reviewer. Do not fabricate results or imply that tests ran, CI passed, deployment occurred, or fixes were implemented without evidence.

Present the full draft in chat. When revising, show the complete revised text. Do not automatically publish it or send approval reminders.
