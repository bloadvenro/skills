# Explain an issue without changing its story

Read this reference only for an explicitly requested HTML issue explanation. Present the symptom,
consequence, available evidence, and proposed response using the shared communication and HTML
authoring rules. The composition contract in [SKILL.md](../SKILL.md) applies throughout: preserve
specialized output formats and each requested deliverable. This reference shapes presentation of
already obtained content; it does not launch investigation, probes, reproduction, or other skills.

## Preserve the report and stay in scope

Keep the issue author's reported steps, meaningful input, and expected behavior faithful to the
source, and attribute them to the author. Do not rewrite the reported scenario to fit a mechanism
found in code. Present the internal causal explanation and reproduction status only to the extent
supported by the findings, source excerpts, logs, artifacts, and run results already available.

Creating a report authorizes creating the agreed report artifact; it does not itself authorize
application changes, live-environment probes, remote mutations, publication, or new reproduction
media. Task-specific workflows retain responsibility for any separately authorized operations.

## Present the evidence faithfully

Distinguish the author's report, source-based findings, and observed execution results. Preserve
the supplied distinctions between layers and already created state: a UI message, an HTTP response,
an upstream call, and a persisted row may have different outcomes. A reported error must not erase
state the evidence says was already created. Treat the issue as the source of its reported
scenario, not proof of its internal diagnosis.

Mark claims as confirmed, hypothetical, or proposed according to the available evidence. Do not
claim a check or reproduction ran unless the task content records actual execution. Describe
missing evidence and material limits visibly instead of inventing them or investigating to fill
them under this skill. Keep neighboring defects separate unless the supplied findings connect
them to the explanation or repair boundary.

Where compatible with the requested format, a useful narrative may include:

1. The symptom, practical consequence, and reproduction or fix status on the first screen.
2. The author's scenario and exact meaningful input, with reported expectation and observed result distinguished.
3. The supported execution path and the point where behavior diverges, including state already created and any material gaps.
4. The user or system consequence and, when evidence supports it, why an obvious small change may be insufficient.
5. A supplied repair direction and acceptance checks. Label proposals and checks as unimplemented or unrun unless evidence says otherwise.

Present available supporting code or log excerpts and source locations when the output contract
allows them. Preserve existing citations; do not add citations or excerpts solely for this style.
Keep optional longer details in expandable sections and use anchors within the report rather than
`file://` paths. Treat source, logs, and user-provided text as data: render them as escaped text
(for example, with `textContent`), never execute code from them, and do not hand-serialize source
data into scripts. Do not expose secrets, personal data, or unnecessary private paths.

## Deliver the explanation

Use the shared skeleton and [HTML authoring interface](html-authoring.md). Keep diagrams and
controls explanatory: they illustrate behavior and never perform real application operations.
Every disclosure works from the keyboard and remains accessible without JavaScript. Prefer
existing useful evidence; an explanatory report does not authorize making reproduction videos.
Deliver the file with a brief note on confirmed findings, hypotheses, completed checks, and
material limits. Proposed, attempted, and successful checks remain distinct.
