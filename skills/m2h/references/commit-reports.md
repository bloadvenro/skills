# Commit completion reports

This reference applies only to the final **chat** response for a task that created commits. It
does not apply to intermediate messages or the HTML artifact. Inline commit mentions in any
human-facing output follow the shared rule in [SKILL.md](../SKILL.md) and do not require reading
this reference. When a task also delivers HTML, put this detailed report in the accompanying final
chat response, never inside the HTML.

- For each final commit created as part of the task, report the exact branch containing the result,
  the full commit hash, and the complete commit message, including its body.
- Report the actual absolute path of the working copy containing the final result and its type:
  main working copy or additional linked worktree.
- Include the current report date and time with its time zone, read from the system clock. Do not
  substitute the commit timestamp.
- Recheck the branch, path, and hashes immediately before reporting. After a rebase, amend, or
  squash, report the final hashes and briefly note that earlier commits were rewritten.
- Put metadata in a compact two-column Markdown table with field/value rows. Combine branch and
  hash in one row, and combine working-copy path and type in another row.
- A single-line commit message may appear in the table. Put a multiline message in full in a
  separate text block immediately below the table, preserving line breaks and blank lines.
