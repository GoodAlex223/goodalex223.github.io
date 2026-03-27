# Workflow Plugin Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a Claude Code plugin that automates the full dev→review→merge workflow in a single chat session using two commands (`/dev`, `/end-session`), two agents, and one stop hook.

**Architecture:** Global plugin at `~/.claude/plugins/workflow/` with auto-discovered components in `commands/`, `agents/`, and `hooks/` directories. Commands inject multi-phase checklists as prompts. Agents are launched via the Agent/Skill tools and produce conversational output that the orchestrating model interprets.

**Tech Stack:** Claude Code plugin system (Markdown + YAML frontmatter), Bash hooks, git CLI, GitHub CLI (`gh`)

**Spec:** `docs/superpowers/specs/2026-03-18-workflow-plugin-design.md`

---

## File Structure

```
~/.claude/plugins/workflow/
├── .claude-plugin/
│   └── plugin.json              # Minimal manifest (name, description, author)
├── commands/
│   ├── dev.md                   # /dev command — multi-phase workflow prompt
│   └── end-session.md           # /end-session command — session close + learning backlog
├── agents/
│   ├── dev-agent.md             # Feature development agent system prompt
│   └── review-agent.md          # Code review agent system prompt
└── hooks/
    ├── hooks.json               # Hook event definitions
    └── stop-reminder.sh         # Stop hook script — reminds about /end-session
```

**Also modified:**
- `.claude/auto-memory/config.json` (this project) — switch `triggerMode` to `gitmode`

---

## Task 1: Create Plugin Scaffold

**Files:**
- Create: `~/.claude/plugins/workflow/.claude-plugin/plugin.json`

- [ ] **Step 1: Create plugin directory structure**

```bash
mkdir -p ~/.claude/plugins/workflow/.claude-plugin
mkdir -p ~/.claude/plugins/workflow/commands
mkdir -p ~/.claude/plugins/workflow/agents
mkdir -p ~/.claude/plugins/workflow/hooks
```

- [ ] **Step 2: Write plugin.json manifest**

Create `~/.claude/plugins/workflow/.claude-plugin/plugin.json`:

```json
{
  "name": "workflow",
  "version": "1.0.0",
  "description": "Automated dev→review→merge workflow with session management",
  "author": {
    "name": "Alexey Minakov"
  }
}
```

- [ ] **Step 3: Verify plugin is recognized**

Run Claude Code and check that the plugin appears in the plugin list. If Claude Code needs to be restarted for plugin discovery, note this.

---

## Task 2: Create Dev Agent

**Files:**
- Create: `~/.claude/plugins/workflow/agents/dev-agent.md`

The dev agent is the workhorse — it receives task context and runs the full development cycle from feature-dev through PR creation.

- [ ] **Step 1: Write dev-agent.md with frontmatter**

Create `~/.claude/plugins/workflow/agents/dev-agent.md`:

```yaml
---
name: dev-agent
description: Feature development agent — implements features using feature-dev command, runs tests, creates PRs. Use when the /dev command needs to delegate implementation work.
tools: *
model: opus
maxTurns: 200
---
```

Note: `tools: *` grants access to all available tools including MCP servers. This matches the spec requirement of "All tools" and ensures the agent can use git, gh, memory tools, and any project-specific tools.

- [ ] **Step 2: Write dev-agent system prompt body**

Append the system prompt after the frontmatter. The body must instruct the agent to:

1. Invoke the `feature-dev:feature-dev` command via the Skill tool with the provided task context
2. Interact with the user for decisions (foreground agent — prompts pass through)
3. After feature-dev completes, run the project's test command (read from `package.json` scripts or use `npm test`)
4. Verify pre-commit hooks pass by running a dry-run commit or the lint commands
5. On test failure: analyze the error, fix, and retry (max 3 attempts). After 3 failures, stop and explain what's wrong
6. Commit code changes with a descriptive commit message
7. Execute task completion documentation:
   - Read the plan file from `docs/planning/plans/` or `docs/superpowers/plans/`
   - Extract improvements → append to `docs/planning/BACKLOG.md`
   - Archive plan → move to `docs/archive/plans/`
   - Transition task: remove from `docs/planning/TODO.md`, add to `docs/planning/DONE.md`
8. Commit documentation changes separately with message format: `docs: Archive completed plan and update planning docs`
9. Push branch to remote: `git push -u origin <branch-name>`
10. Create PR via `gh pr create` with summary and test plan
11. Output the PR number, branch name, and summary of work done as the final message

The system prompt should reference the user's CLAUDE.md conventions (commit message format, task completion documentation rules) but not duplicate them — the agent inherits the user's CLAUDE.md context.

- [ ] **Step 3: Verify agent file is valid**

Read back the file and confirm:
- YAML frontmatter is properly delimited with `---`
- `name`, `description`, `tools`, `model` fields are present
- Body contains clear, numbered instructions
- No references to tools the agent doesn't have access to

---

## Task 3: Create Review Agent

**Files:**
- Create: `~/.claude/plugins/workflow/agents/review-agent.md`

The review agent receives a PR number and performs code review using the code-review skill.

- [ ] **Step 1: Write review-agent.md with frontmatter**

Create `~/.claude/plugins/workflow/agents/review-agent.md`:

```yaml
---
name: review-agent
description: Code review agent — reviews PRs using code-review command and posts feedback on GitHub. Use when the /dev command needs to review a PR after development.
tools: *
model: opus
maxTurns: 50
---
```

Note: `tools: *` grants access to all tools. Review agent needs Read, Bash, Grep, Glob, Skill at minimum, but `*` avoids missing any edge case tool needs.

- [ ] **Step 2: Write review-agent system prompt body**

The body must instruct the agent to:

1. Receive the PR number and branch name from the prompt
2. Invoke the `code-review:code-review` command via the Skill tool, passing the PR number
3. The code-review command will analyze the PR and produce findings
4. Based on the findings:
   - If no issues found: post an approval comment on the PR via `gh pr review <number> --approve --body "..."` and output clearly that the review is clean
   - If issues found: post review comments on the PR via `gh pr review <number> --request-changes --body "..."` listing each issue, and output clearly that issues were found with a numbered list
5. The output must be unambiguous — the orchestrating model needs to determine whether to proceed with merge or start a fix cycle

- [ ] **Step 3: Verify agent file is valid**

Same checks as Task 2 Step 3.

---

## Task 4: Create `/dev` Command

**Files:**
- Create: `~/.claude/plugins/workflow/commands/dev.md`

This is the main entry point. It's a prompt that instructs Claude to follow a multi-phase workflow. This is the most complex component.

- [ ] **Step 1: Write dev.md frontmatter**

```yaml
---
allowed-tools: Bash(git checkout:*), Bash(git branch:*), Bash(git ls-remote:*), Bash(git push:*), Bash(git pull:*), Bash(gh pr merge:*), Bash(gh run list:*), Bash(gh run view:*), Read, Glob, Grep, Agent, Skill
description: Start full development workflow — branch, feature-dev, tests, PR, review, merge
---
```

- [ ] **Step 2: Write Phase 1 — Setup**

The command body starts with context injection (using `!` prefix for commands executed at load time) and Phase 1 instructions:

```markdown
## Context

Current branch: !`git branch --show-current`
Recent TODO items: !`head -50 docs/planning/TODO.md 2>/dev/null || echo "No TODO.md found"`

## Your Task

You are running the automated development workflow. The user wants to develop: $ARGUMENTS

Follow these phases in order. Each phase must complete before moving to the next.

### Phase 1 — Setup

1. Read `docs/planning/TODO.md` and find the task matching "$ARGUMENTS". If not found, stop and tell the user.
2. Generate a branch name from the task title: lowercase, hyphens, prefixed with `feature/` (e.g., "Add dark mode" → `feature/add-dark-mode`).
3. Check the branch doesn't exist locally: `git branch --list <branch>`
4. Check the branch doesn't exist on remote: `git ls-remote --heads origin <branch>`
5. If branch exists (local or remote), stop and tell the user.
6. Create and checkout the branch: `git checkout -b <branch>`
```

- [ ] **Step 3: Write Phase 2 — Development**

```markdown
### Phase 2 — Development

Launch the `workflow:dev-agent` agent via the Agent tool with this prompt:

"You are developing the following task:
- Task title: [title from TODO.md]
- Task details: [full task description from TODO.md]
- Branch: [branch name]

Follow your system prompt instructions to implement this task."

Wait for the dev agent to complete. Read its output to extract:
- PR number
- Branch name
- Summary of work done

If the dev agent reports failure (test failures after 3 retries, blockers), stop and present the issue to the user.
```

- [ ] **Step 4: Write Phase 3 — Review**

```markdown
### Phase 3 — Review

Launch the `workflow:review-agent` agent via the Agent tool with this prompt:

"Review PR #[number] on branch [branch name]. Follow your system prompt to perform code review and post your findings on GitHub."

Wait for the review agent to complete. Read its output to determine:
- If clean: proceed to Phase 5
- If issues found: proceed to Phase 4
```

- [ ] **Step 5: Write Phase 4 — Fix Loop**

```markdown
### Phase 4 — Fix Loop

If the review agent found issues, fix them:

1. Re-launch the `workflow:dev-agent` agent via the Agent tool with this prompt:

   "The code reviewer found issues on PR #[number], branch [branch name]:
   [paste the review agent's issue list]

   Fix these issues, commit, and push. Do NOT create a new PR — push to the existing branch."

2. After the dev agent completes, re-launch the `workflow:review-agent` to re-review.

3. If still issues after 3 fix-review cycles, stop and ask the user to intervene.

Track the cycle count. Each cycle = one fix + one review.
```

- [ ] **Step 6: Write Phase 5 — Merge & Cleanup**

```markdown
### Phase 5 — Merge & Cleanup

1. Merge the PR: `gh pr merge [number] --merge`
2. Delete the remote branch: `git push origin --delete [branch]`
3. Determine the base branch (check if `develop` exists, otherwise use `main`): `git branch --list develop`
4. Checkout base branch: `git checkout [base-branch]`
5. Pull latest: `git pull`
6. Check if GitHub Actions CI is configured. If so, check the latest run: `gh run list --limit 1`
   - If the run is in progress, tell the user and suggest they can check back with `gh run view [id]`
   - If the run failed, warn the user
   - If the run passed, confirm deployment is good

Tell the user: "Development complete. Run /end-session when you're ready to close this session."
```

- [ ] **Step 7: Verify command file is valid**

Read back the complete file. Confirm:
- YAML frontmatter has `allowed-tools` and `description`
- All 5 phases are present and logically connected
- Agent references use `workflow:dev-agent` and `workflow:review-agent` format
- No hardcoded project-specific values (branch names, test commands)
- `$ARGUMENTS` placeholder is used for the task title
- Error handling is specified for each phase

---

## Task 5: Create `/end-session` Command

**Files:**
- Create: `~/.claude/plugins/workflow/commands/end-session.md`

- [ ] **Step 1: Write end-session.md frontmatter**

```yaml
---
allowed-tools: Bash(git log:*), Bash(git add:*), Bash(git commit:*), Bash(git branch:*), Bash(git rev-parse:*), Bash(basename:*), Read, Write, Edit, Glob, Grep, mcp__memory__create_entities, mcp__memory__add_observations, mcp__memory__search_nodes, mcp__memory__open_nodes
description: Save session to memory and write learning backlog
---
```

Note: MCP memory tools are required for Step 1 (session summary). `git rev-parse` and `basename` are needed for project name detection.

- [ ] **Step 2: Write command body**

```markdown
## Context

Current branch: !`git branch --show-current`
Recent commits this session: !`git log --oneline -20`
Project name: !`basename $(git rev-parse --show-toplevel)`

## Your Task

End this development session by saving context and creating a learning backlog entry.

### Step 1 — Session Summary (Memory)

Use the MCP memory tools to create a session entity:

1. Determine today's date (YYYY-MM-DD format)
2. Create a session entity named `project:[project-name]:session:[date]` with these observations:
   - "Task: [main task worked on]"
   - "Outcome: [what was achieved]"
   - "Decisions: [key decisions made, or 'None']"
   - "Unfinished: [what remains, or 'Complete']"
   - "Next step: [concrete next action]"
3. If any decisions were made during the session that aren't already saved as entities, save them now

If the MCP memory server is unavailable, inform the user that the session was not saved to memory. Still proceed with Step 2.

### Step 2 — Learning Backlog

Analyze the conversation for topics the user might want to study:
- New patterns, technologies, or concepts that came up
- Things the user asked about or seemed unfamiliar with
- Corrections or clarifications that happened
- Tools, libraries, or approaches that were new to the user

Append an entry to `docs/learning-backlog.md` (create the file if it doesn't exist):

```
### [YYYY-MM-DD] Session: "[task title]"

**What was done**: [One sentence summary]

**Topics to explore**:
- [keyword/pattern/technology] — [brief context of where it came up]
- [keyword/pattern/technology] — [brief context]
```

Then commit it:
```bash
git add docs/learning-backlog.md
git commit -m "docs: Update learning backlog"
```

Note: This commits to the current branch (expected to be main/develop after /dev completes). This is intentional — learning backlog is a docs-only change.

### Step 3 — Confirm

Print a summary:
- What was saved to memory (or that memory was unavailable)
- What was added to learning backlog
- "Session saved. Next time we'll continue from: [next step]"
```

- [ ] **Step 3: Verify command file is valid**

Read back the file. Confirm:
- YAML frontmatter has `allowed-tools` and `description`
- All 3 steps are present
- Memory entity naming matches the convention: `project:[name]:session:[date]`
- Learning backlog format matches the spec
- Git commit message matches expected format for stop hook detection

---

## Task 6: Create Stop Hook

**Files:**
- Create: `~/.claude/plugins/workflow/hooks/hooks.json`
- Create: `~/.claude/plugins/workflow/hooks/stop-reminder.sh`

- [ ] **Step 1: Write hooks.json**

Create `~/.claude/plugins/workflow/hooks/hooks.json`:

```json
{
  "hooks": {
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "bash ${CLAUDE_PLUGIN_ROOT}/hooks/stop-reminder.sh",
            "timeout": 5
          }
        ]
      }
    ]
  }
}
```

- [ ] **Step 2: Write stop-reminder.sh**

Create `~/.claude/plugins/workflow/hooks/stop-reminder.sh`:

```bash
#!/bin/bash

# Check if development work happened (commits on non-main branches)
CURRENT_BRANCH=$(git branch --show-current 2>/dev/null)
if [ -z "$CURRENT_BRANCH" ]; then
  exit 0
fi

# Check if there are any commits today on non-main branches
# or if we're on main with recent feature branch merges
HAS_DEV_WORK=$(git log --oneline --since="6 hours ago" --all --grep="feat\|fix\|refactor" 2>/dev/null | head -1)

if [ -z "$HAS_DEV_WORK" ]; then
  # No development work detected, no reminder needed
  exit 0
fi

# Check if /end-session was already used (look for learning backlog commit)
HAS_END_SESSION=$(git log --oneline --since="6 hours ago" --grep="docs: Update learning backlog" 2>/dev/null | head -1)

if [ -n "$HAS_END_SESSION" ]; then
  # /end-session was already run, no reminder needed
  exit 0
fi

# Development work exists but no /end-session — remind user
echo '{"systemMessage": "Reminder: Run /end-session before closing this chat to save your session and learning backlog."}'
exit 0
```

- [ ] **Step 3: Make hook script executable**

```bash
chmod +x ~/.claude/plugins/workflow/hooks/stop-reminder.sh
```

- [ ] **Step 4: Test hook script manually**

Run the script directly from a project directory to verify it:
- Produces no output when there's no dev work
- Produces the reminder JSON when there is dev work but no end-session commit

```bash
cd /path/to/project && bash ~/.claude/plugins/workflow/hooks/stop-reminder.sh
```

---

## Task 7: Switch Auto-Memory to gitmode

**Files:**
- Modify: `.claude/auto-memory/config.json` (project-level)

- [ ] **Step 1: Update config.json**

Change the `triggerMode` from `"default"` to `"gitmode"` in `.claude/auto-memory/config.json`:

```json
{
  "triggerMode": "gitmode"
}
```

- [ ] **Step 2: Verify the change**

Read back the file to confirm the change was applied correctly.

---

## Task 8: Enable Plugin in Settings

**Files:**
- Modify: `~/.claude/settings.json` (global settings)

- [ ] **Step 1: Research local plugin registration**

Check how Claude Code discovers local plugins vs marketplace plugins. Look at `~/.claude/settings.json` to see the current `enabledPlugins` format. Marketplace plugins use `name@marketplace` format. A local plugin at `~/.claude/plugins/workflow/` may:
- Be auto-discovered from the `plugins/` directory
- Need manual registration with a path-based format
- Need a different key format

Check Claude Code documentation or test by restarting after Task 1 to see if the plugin appears automatically.

- [ ] **Step 2: Register the plugin if needed**

If auto-discovery doesn't work, add the plugin to `enabledPlugins` in `~/.claude/settings.json` with the appropriate format for local plugins.

- [ ] **Step 3: Restart Claude Code and verify**

After registration, restart Claude Code and verify:
- `/dev` command appears in available commands (try typing `/dev` to see if it autocompletes)
- `/end-session` command appears in available commands
- `workflow:dev-agent` and `workflow:review-agent` appear as available agent types
- Stop hook fires (can test by ending a conversation after making a commit)

**Windows note**: The `chmod +x` in Task 6 Step 3 is a no-op on Windows NTFS. The hook command in hooks.json uses `bash` prefix explicitly, so the script will execute correctly regardless of file permissions on Windows.

---

## Task 9: Integration Test

- [ ] **Step 1: Create a test task in TODO.md**

Add a small test task to `docs/planning/TODO.md` that can be implemented quickly (e.g., a documentation update or a trivial code change).

- [ ] **Step 2: Run `/dev "test task title"`**

Execute the full workflow and observe:
- Phase 1: Branch creation works
- Phase 2: Dev agent launches and runs feature-dev
- Phase 3: Review agent reviews the PR
- Phase 4: Fix loop works if review finds issues
- Phase 5: Merge and cleanup completes

- [ ] **Step 3: Run `/end-session`**

Verify:
- Session entity created in memory
- Learning backlog entry appended to `docs/learning-backlog.md`
- Learning backlog committed

- [ ] **Step 4: Verify stop hook**

Start a new session, make a commit, then try to end without `/end-session`. Verify the reminder appears.

- [ ] **Step 5: Fix any issues discovered**

Address any issues found during integration testing. Common issues to watch for:
- Agent tool references (correct plugin:agent format)
- Skill tool references (correct plugin:skill format)
- Allowed-tools not covering needed operations
- Hook script not finding git commands on PATH
- Memory server connectivity

---

## Summary

| Task | Component | Complexity |
|------|-----------|------------|
| 1 | Plugin scaffold | Trivial |
| 2 | Dev agent | Medium (complex system prompt) |
| 3 | Review agent | Low (focused scope) |
| 4 | `/dev` command | High (5-phase orchestration prompt) |
| 5 | `/end-session` command | Medium (memory + file writing) |
| 6 | Stop hook | Low (simple shell script) |
| 7 | Auto-memory config | Trivial |
| 8 | Plugin registration | Low |
| 9 | Integration test | Medium (end-to-end validation) |

**Total: 9 tasks, ~30 steps**

**Critical path**: Task 1 (scaffold) first. Then Tasks 2+3 can be parallel (independent agents). Task 4 depends on 2+3 (references both agents). Task 5 is independent of 4. Task 6 is independent. Tasks 7-8 are independent of all others. Task 9 (integration test) requires all others complete.
