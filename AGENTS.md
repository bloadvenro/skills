## Git workflow

### Remote access and publication

- A request to inspect, review, diagnose, or change a local repository, branch, commit, or diff does not by itself authorize access to a remote code-hosting system. Reading local remote configuration is allowed. Remote reads, checks, and downloads, including `git fetch` and the network part of `git pull`, require authorization under the rules below.
- A request to inspect a specific remote pull/merge request, review, pipeline, or repository authorizes the reads necessary for that task. Authorization is limited to the named system and task; permission for one code-hosting provider does not automatically extend to another.
- An explicit request to perform a remote operation authorizes the remote reads and checks necessary to perform that operation within the specified task. It does not authorize additional remote mutations.
- Pushing, publishing branches or tags, creating or editing pull/merge requests, posting comments or reviews, approving or requesting changes, remote merging, and triggering pipelines require an explicit request for the respective action in the current conversation.
- A local commit never implies permission to push, publish, open a pull/merge request, or perform another remote action. Permission to prepare or open a pull/merge request does not imply permission to push.
- An explicit authorization already given remains valid within the agreed task scope. Do not ask for redundant confirmation of the same operation unless a higher-priority instruction or the tool's approval mechanism requires it.
- Prepare pull request and merge request descriptions strictly after all agreed work in the chat is complete. First provide the full description to the user in the chat for review; do not publish it or create/update a pull/merge request containing it unless the user explicitly confirms that description. If the user does not confirm, take no further action on the description: they may have ignored the draft or edited and published it themselves. Silence is not approval; do not send repeated approval reminders or overwrite a description the user has published without an explicit request. This requirement applies only to preparing and publishing descriptions. It must not delay or block explicitly requested branch publication, commit pushes, or updates to branches associated with an existing pull/merge request; perform those authorized operations without additional confirmation solely because description approval is pending or absent.

### Working, shared, and target branches

- During an assigned implementation task, you may create working branches and local commits related to that task. A request for analysis, discussion, or a proposed change does not by itself authorize file changes or commits.
- Do not use `main`, `master`, `develop`, or other shared or protected branches for implementation or ordinary commits. Work on a separate working branch. Identify other shared branches from the user's directions and repository instructions.
- Do not move, rewrite, or delete shared branches without an explicit user request. Reading their history or using them as the base of a working branch is allowed.
- The user personally creates and explicitly names the target branch for integrating your work. Do not create that target branch on their behalf or choose one by default.
- Merge your work into the target branch only on an explicit user request. That authorization includes a necessary merge commit, but not further implementation directly on the target branch.
- If the target branch has not been specified or does not exist, continue independent work on your working branch and defer the merge.
- Preserve existing user changes, keep unrelated changes out of your commits, and do not rewrite other people's history without an explicit request.

### Git worktrees

- For parallel code-changing tasks in the same repository, use a separate branch and worktree for each task.
- Create the worktree before the first change when isolation from parallel work or existing uncommitted changes is needed. Analysis and other read-only work do not require a worktree.
- Before making changes, verify the actual branch and root of the current working copy; do not infer them solely from the task or project name.

## Skill-specific preferences

### Narrow tracing skills

- Use narrow tracing skills when tracing the existing implementation across meaningful system boundaries is itself a primary requested deliverable. Ordinary implementation, local edits, status reports, and short factual questions do not by themselves require those skills.

