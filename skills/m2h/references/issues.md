# Explain an issue without changing its story

Read this reference only for an issue explanation. Present the symptom, consequence, evidence,
and proposed response using the shared overview-first voice and HTML authoring rules. An
explanatory report is not a working copy of the application.

## Preserve the report and stay in scope

Keep the issue author's reported steps, input, and expected behavior faithful to the source, and attribute them to the author. Do not rewrite the reported scenario to fit a mechanism found in code. Separately verify the internal causal explanation and whether the scenario was reproduced, using available source, logs, artifacts, and run results.

Creating a report authorizes creating the agreed report artifact; it does not itself authorize application changes, live-environment probes, remote mutations, or publication. Stay within the scope already authorized and carry forward authorization the user has already given. If the user explicitly requests live probes, perform them with available tools against the agreed targets and within that scope. Do not replace a requested probe with static analysis or simulation, or ask again for the same authorization. Ask only for missing target or access information when needed. A probe request does not authorize unrelated fixes, deployment, or writes beyond the requested operations. Report what you actually queried, observed, and could not access. Creating new video or reproduction media likewise requires an explicit request and must stay within the agreed scope.

## Check and explain the evidence

Trace the relevant path as far as needed: user action, UI, request, handler, domain logic, state changes, and external service. Check layers separately: an HTTP response can differ from the UI message, and a failure before an upstream call differs from one after a row was created. Treat the issue as the source of the reported scenario, not proof of its internal diagnosis. Mark claims as confirmed, hypothetical, or proposed; name unknowns where evidence is missing. Keep neighboring defects separate unless they change the explanation or repair boundary. State material reproduction limits, such as mocked authentication or a disabled integration.

Shape the report to the issue instead of forcing a fixed template. A useful narrative often moves from:

1. The symptom, practical consequence, and reproduction or fix status on the first screen.
2. The author's scenario and exact meaningful input, with reported expectation and observed result distinguished.
3. The verified execution path and the point where behavior diverges, including state already created.
4. The user or system consequence and, when evidence supports it, why an obvious small change may be insufficient.
5. A proposed repair direction and concrete acceptance checks. Label proposals and checks as unimplemented or unrun unless evidence says otherwise.

Support important conclusions with short, verified code or log excerpts and repository-relative paths with meaningful line references. Keep longer details in expandable sections and link to anchors within the report, not `file://` paths. Treat source, logs, and user-provided text as data: render them as escaped text (for example, with `textContent`), never execute code from them, and do not hand-serialize source data into scripts. Do not expose secrets, personal data, or unnecessary private paths.

## Deliver the explanation

Use the shared skeleton and [HTML authoring interface](html-authoring.md). Keep diagrams and
controls explanatory: they illustrate behavior and never perform real application operations.
Every disclosure works from the keyboard and remains accessible without JavaScript. Prefer
existing useful evidence; an explanatory report does not authorize making reproduction videos.
Deliver the file with a brief note on confirmed findings, hypotheses, completed checks, and
material limits. Proposed, attempted, and successful checks remain distinct.
