---
name: smart-pr
description: Take the current branch from "has some work on it" to "has an open, up-to-date pull request" — commit any pending changes into coherent commits first (via the smart-commit skill), push, then create a new PR or refresh the title/description of the existing one. Use when the user asks to open a PR, ship a branch, or update a PR's description, or explicitly runs /smart-pr. Never trigger automatically — only on explicit /smart-pr invocation.
disable-model-invocation: true
allowed-tools: Bash(git status:*), Bash(git push:*), Bash(git log:*), Bash(git diff:*), Bash(git branch:*), Bash(gh pr view:*), Bash(gh pr list:*), Bash(gh pr create:*), Bash(gh pr edit:*)
---

# Smart PR

Get the current branch into an open PR with an accurate description, doing whatever prep work that requires.

## 1. Commit anything pending

Run `git status`. If there are uncommitted changes, invoke the `smart-commit` skill to turn them into coherent commits before continuing — don't improvise commit grouping here, that skill already owns this repo's grouping and message conventions.

## 2. Push the branch

Check how far ahead/behind of its upstream the branch is (or whether it has no upstream yet) and push accordingly, adding `-u origin <branch>` the first time. Never force-push without explicit user confirmation.

## 3. Check for an existing PR

Run `gh pr view --json number,url,title,body` for the current branch (or `gh pr list --head <branch>`) to see whether a PR already exists. Don't create a duplicate if one does.

## 4. Build the description from the full branch diff

Base the description on the *entire* diff/commit range against the base branch — `git log <base>..HEAD` and `git diff <base>...HEAD` — not just the latest commit. A PR description should describe everything the branch does.

Match this repo's existing PR conventions; check a couple of recent ones if unsure (`gh pr list --state merged --limit 5`, then `gh pr view <n> --json body`). As of writing, that convention is:

```markdown
## Summary

- Bullet point per key change, written in French
- ...

## Test plan

- [ ] Manual verification step, in French
- [ ] ...

🤖 Generated with [Claude Code](https://claude.com/claude-code)
```

Conventions drift — re-check recent merged PRs rather than assuming this holds forever.

## 5. Create or update

- No existing PR: `gh pr create --title "..." --body "..."`.
- Existing PR: `gh pr edit <number> --title "..." --body "..."` to refresh it in place.

## 6. Report back

Give the user the PR URL, and say whether it was newly created or updated.
