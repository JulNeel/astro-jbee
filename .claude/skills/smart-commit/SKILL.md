---
name: smart-commit
description: Analyze every uncommitted change in the repo (staged, unstaged, and untracked files) and split them into multiple well-scoped git commits instead of one big lump. Use when the user asks to commit their work, wants messy changes organized into clean commits, or explicitly runs /smart-commit. Never trigger automatically — only on explicit /smart-commit invocation.
disable-model-invocation: true
allowed-tools: Bash(git status:*), Bash(git diff:*), Bash(git log:*), Bash(git add:*), Bash(git commit:*), Bash(git restore:*)
---

# Smart commit

Turn whatever is currently uncommitted in the working tree into a small number of coherent, reviewable commits — never one commit mixing unrelated changes, and never inventing or dropping anything that's actually there.

## 1. See everything that changed

- `git status` for the full picture: staged, unstaged, untracked, deleted.
- `git diff` and `git diff --staged` for the actual content of tracked changes.
- For untracked files, read them directly — `git diff` won't show their content.

## 2. Learn this repo's commit style

Before writing any message, run `git log --oneline -20` and match its convention rather than assuming one. As of writing, this repo uses `type: short imperative subject` (`fix:`, `feat:`, `perf:`, `refactor:`, `chore:`), lowercase type, English subject, no scope. Conventions drift — always check the live log, don't rely on this note alone.

## 3. Group into coherent commits

Group by *intent*, not by file type or edit timestamp. A good commit is the smallest unit that still makes sense reviewed on its own: a component and the schema field it depends on can belong together; two unrelated fixes that happen to touch the same file do not, and should be split with `git add -p` if needed.

## 4. Confirm before committing

Show the user the proposed grouping — files, one-line rationale, draft message per commit — before running `git commit`. If the user's request already made clear they want it done outright (e.g. they explicitly asked to just commit everything now), skip the round-trip and proceed.

## 5. Commit each group

- Stage exactly the files in that group (`git add <path> <path>...`). Never `git add -A` or `git add .` — an unrelated file lying around in the tree must not sneak into a commit it doesn't belong to.
- Run `git diff --staged` and sanity-check it matches the intended group before committing.
- Write the message following the repo's convention (step 2), and always include:
  ```
  Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
  ```
- Never use `--no-verify` or otherwise bypass hooks.

## 6. Wrap up

After the last commit, run `git status` to confirm the tree is clean (or note what was deliberately left out, if anything), and summarize what got committed and why it was split that way.
