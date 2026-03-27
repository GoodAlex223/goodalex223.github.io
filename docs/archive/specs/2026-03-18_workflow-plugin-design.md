# Workflow Plugin Design Spec

**Date**: 2026-03-18
**Status**: Approved
**Scope**: Custom Claude Code plugin to automate the full dev→review→merge cycle in a single chat

---

## Problem

The current development workflow requires:
- Two separate chats (dev + review) with manual context switching
- 19+ manual prompt steps with boilerplate text
- Manual triggers for auto-memory sync at 3+ points
- Manual verification prompts ("Are tests passed?", "Are pre-commit hooks passed?")
- Risk of forgetting session-end documentation

## Solution

A global Claude Code plugin (`~/.claude/plugins/workflow/`) with 2 commands, 2 agents, and 1 hook that automates the entire dev→review→merge→session-end cycle in a single chat.

---

## Plugin Structure

```
~/.claude/plugins/workflow/
├── plugin.json              # Manifest: commands, agents, hooks
├── commands/
│   ├── dev.md               # /dev "task title" — main workflow entry point
│   └── end-session.md       # /end-session — session close + learning backlog
├── agents/
│   ├── dev-agent.md          # Feature development agent
│   └── review-agent.md       # Code review agent
└── hooks/
    └── stop-reminder.sh      # Safety net: remind about /end-session
```

**Location**: `~/.claude/plugins/workflow/` (global — works across all projects)

---

## Execution Model

**Important**: Claude Code commands are prompt injections, not imperative programs. The `/dev` command injects a detailed multi-phase checklist into the conversation. Claude (the model) reads this checklist and follows it step by step, using tools to accomplish each phase. Agents do not "return structured data" — they produce conversational output that the orchestrating model reads and interprets.

- `/dev` is a **long prompt** that instructs Claude to follow phases sequentially
- Agents are launched via the **Agent tool** (or Skill tool for plugin commands) — their output is text that Claude interprets
- Conditional logic (fix loop, error handling) is encoded as **instructions**, not code
- The model's tool permission prompts serve as natural user checkpoints

---

## Component Specifications

### 1. `/dev` Command (`commands/dev.md`)

**Trigger**: User types `/dev "task title"`

**Input**: Task title string (must match an entry in `docs/planning/TODO.md`)

**Nature**: A prompt that instructs Claude to follow a multi-phase workflow checklist. Each phase uses tools (Read, Bash, Agent, Skill) to accomplish its goals. Phase transitions are based on Claude interpreting the output of previous phases.

**Flow**:

#### Phase 1 — Setup (main chat follows these steps using tools)
1. Parse task title from command argument
2. Read `docs/planning/TODO.md` to find the task and get full context
3. Generate branch name from title (e.g., `feature/add-dark-mode-support`)
4. Check branch doesn't exist locally or remotely (`git branch --list` + `git ls-remote --heads origin`)
5. Create and checkout the branch (`git checkout -b <branch>`)
6. Launch dev agent via Agent tool with task context

#### Phase 2 — Development (dev agent)
- Receives: task title, TODO.md task context, branch name
- Invokes the `feature-dev:feature-dev` skill via the Skill tool for implementation
- Interacts with the user for decisions/clarifications (foreground agent — permission prompts and questions pass through to user)
- After feature-dev completes:
  - Runs tests (`npm test` or project-appropriate test command)
  - Verifies pre-commit hooks pass
  - Retries up to 3 times on test failures, then escalates to user
  - Commits code changes
  - Executes task completion documentation:
    - Extracts improvements → `docs/planning/BACKLOG.md`
    - Archives plan → `docs/archive/plans/`
    - Transitions task: `docs/planning/TODO.md` → `docs/planning/DONE.md`
  - Commits documentation changes separately
  - Pushes branch to remote
  - Creates PR via `gh pr create`
- Produces output containing: PR number, branch name, summary of work done

#### Phase 3 — Review (main chat launches review agent via Agent tool)
- Receives: PR number, branch name
- Invokes the `code-review:code-review` skill via the Skill tool on the PR
- Posts review comments on GitHub
- Produces output indicating: no issues found (clean) or list of specific issues

#### Phase 4 — Fix Loop (if review agent's output indicates issues)
- Main chat re-launches dev agent via Agent tool with:
  - PR number
  - Review comments as context
  - Instruction to fix issues and push
- After fix: re-launches review agent
- Repeats until review output indicates clean (max 3 fix-review cycles, then stop and ask user)
- User is watching throughout and can intervene at any permission prompt

#### Phase 5 — Merge & Cleanup (main chat follows these steps using tools)
- Merge PR with `--merge` strategy: `gh pr merge <number> --merge`
- Delete remote branch: `git push origin --delete <branch>`
- Checkout main/develop branch
- Pull latest: `git pull`
- Check GitHub Actions status if CI is configured: `gh run list --limit 1`

**Error handling**:
- Task not found in TODO.md → stop, report to user
- Branch already exists (local or remote) → stop, report to user
- Test failures after 3 retries → stop, ask user
- PR creation fails → stop, report to user
- Fix loop exceeds 3 cycles → stop, ask user to intervene

### 2. `/end-session` Command (`commands/end-session.md`)

**Trigger**: User types `/end-session`

**Flow**:

#### Step 1 — Session Summary (memory)
- Collect session context from git log (commits on current/merged branch)
- Create session entity in knowledge graph via MCP memory server:
  ```
  project:<project-name>:session:YYYY-MM-DD
  ```
- Observations: Task, Outcome, Decisions, Unfinished, Next step
- Save any decisions made but not yet recorded

#### Step 2 — Learning Backlog
- Analyze the session for:
  - New patterns or technologies encountered
  - Concepts the user asked about or seemed unfamiliar with
  - Corrections or clarifications that happened
  - Tools, libraries, or approaches that were new
- Append entry to `docs/learning-backlog.md`:

```markdown
### [YYYY-MM-DD] Session: "Task title"

**What was done**: One sentence summary

**Topics to explore**:
- [keyword/pattern/technology] — brief context of where it came up
- [keyword/pattern/technology] — brief context
```

- Create file if it doesn't exist
- Commit the learning backlog: `git add docs/learning-backlog.md && git commit -m "docs: Update learning backlog"`

**Branch note**: `/end-session` commits to the current branch. After a successful `/dev` run, this will be `main` (or `develop`), which is intentional — learning backlog is a docs-only change that goes directly to main per project convention.

#### Step 3 — Confirm
- Print summary to terminal (what was saved to memory, what was added to learning backlog)
- Confirm: "Session saved. Next time we'll continue from: [next step]"

**Memory failure fallback**: If the MCP memory server is unavailable, follow the Memory Failure Protocol from CLAUDE.md: inform user that session was not saved to memory, still write learning backlog to file, remind user to ensure memory server is running for next session.

### 3. Dev Agent (`agents/dev-agent.md`)

**Model**: Opus (inherited from parent)
**Tools**: All tools
**maxTurns**: 200 (high limit — feature dev can be lengthy, but prevents runaway execution)

**System prompt responsibilities**:
- Invoke the `feature-dev:feature-dev` skill via the Skill tool with provided task context
- Interact with user for decisions (foreground agent — prompts pass through to user)
- After feature-dev completes: run tests, verify pre-commit hooks
- On test failure: fix and retry (max 3), then escalate to user
- Execute task completion documentation (BACKLOG, archive, TODO→DONE)
- Commit code and docs separately
- Push branch, create PR
- Produce output containing: PR number, branch name, work summary

**Does NOT duplicate**:
- CLAUDE.md thinking protocol (feature-dev handles exploration/architecture via its own agents)
- Auto-memory sync (gitmode handles it on commits)

### 4. Review Agent (`agents/review-agent.md`)

**Model**: Opus
**Tools**: All tools
**maxTurns**: 50 (review is bounded work)

**System prompt responsibilities**:
- Receive PR number
- Invoke the `code-review:code-review` skill via the Skill tool on the PR
- Post review on GitHub via `gh` CLI
- Produce output clearly indicating either:
  - No issues found — post approval comment on PR
  - Issues found — list specific issues that need fixing

### 5. Stop Hook (`hooks/stop-reminder.sh`)

**Event**: `Stop`
**Behavior**:
- Check if development work happened this session (look for commits on non-main branches)
- Check if `/end-session` was likely used (look for a "docs: Update learning backlog" commit in recent git log)
- If dev work exists but no learning backlog commit found: print reminder
- Output: `"Reminder: Run /end-session before closing this chat."` or empty (no reminder needed)

**Does NOT**:
- Block the session from ending
- Run `/end-session` automatically
- Trigger on trivial conversations (no commits = no reminder)

---

## Auto-Memory Integration

**Change**: Switch project config from `default` to `gitmode`

**File**: `.claude/auto-memory/config.json`
```json
{
  "triggerMode": "gitmode"
}
```

**Rationale**: In `default` mode, auto-memory stops Claude after every file edit to sync. With the new workflow, the dev agent makes many edits before committing. `gitmode` syncs only on commits — no interruptions during development, no merge conflicts from mid-flow memory updates.

**Scope**: Per-project setting. Other projects remain on `default` unless explicitly changed.

---

## What This Replaces

| Old Workflow Step | New Equivalent |
|---|---|
| Create new chat for dev | `/dev "task title"` |
| Type branch/feature-dev prompt | Automated by `/dev` Phase 1 |
| Manual decisions during dev | AskUserQuestion from dev agent |
| "Commit, correctly finish task" | Automated by dev agent |
| "Are tests passed?" | Automated test verification |
| "Commit, push, create PR" | Automated by dev agent |
| Create new chat for review | Review agent in same chat |
| "Review PR, post comments" | Automated by review agent |
| Fix reviewer issues (chat switch) | Fix loop in same chat |
| "Merge, cleanup" | Automated by `/dev` Phase 5 |
| Manual `/auto-memory:sync` (3x) | `gitmode` handles it on commits |
| "End session + learning backlog" | `/end-session` |
| Copy to Obsidian | `docs/learning-backlog.md` (committed) |

---

## Design Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Plugin location | Global (`~/.claude/plugins/`) | Workflow is project-agnostic |
| Automation level | Fully automatic | User verifies before session, permission prompts provide checkpoints |
| Chat model | Single chat | Sequential agent orchestration eliminates need for two chats |
| Dev agent model | Opus | Complex development needs strong reasoning |
| Review agent model | Opus | Changes vary, need strong analysis across different approaches |
| Thinking protocol | Delegated to feature-dev | feature-dev handles exploration via its own agents |
| Auto-memory mode | gitmode | Prevents interruptions and merge conflicts during dev |
| Learning backlog | Committed automatically | User doesn't want to edit during dev sessions |
| Stop hook | Reminder only | Non-blocking, just a nudge |
| Fix loop | Max 3 cycles, then ask user | Prevents infinite loops while allowing automatic fixes |

---

## Plugin Manifest (`plugin.json`)

```json
{
  "name": "workflow",
  "description": "Automated dev→review→merge workflow with session management",
  "version": "1.0.0",
  "commands": [
    {
      "name": "dev",
      "description": "Start full development workflow: branch → feature-dev → tests → PR → review → merge",
      "path": "commands/dev.md",
      "arguments": [
        {
          "name": "task",
          "description": "Task title from TODO.md",
          "required": true
        }
      ]
    },
    {
      "name": "end-session",
      "description": "Save session to memory and write learning backlog",
      "path": "commands/end-session.md"
    }
  ],
  "agents": [
    {
      "name": "dev-agent",
      "description": "Feature development agent — implements features, runs tests, creates PRs",
      "path": "agents/dev-agent.md"
    },
    {
      "name": "review-agent",
      "description": "Code review agent — reviews PRs and posts feedback",
      "path": "agents/review-agent.md"
    }
  ],
  "hooks": [
    {
      "event": "Stop",
      "path": "hooks/stop-reminder.sh"
    }
  ]
}
```

---

## Future Considerations

- **Agent nesting**: When stable, dev agent could spawn sub-agents for testing, docs, and implementation in parallel
- **Agent teams**: When stable, dev and review agents could coordinate via mailbox instead of sequential orchestration
- **Per-project overrides**: Plugin could read project-level config for test commands, branch naming conventions, etc.
- **Multiple task batching**: `/dev` could accept multiple tasks and process them sequentially
