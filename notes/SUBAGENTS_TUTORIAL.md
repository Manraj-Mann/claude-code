# Claude Code Subagents: Beginner to Expert (Hands-On)

This tutorial uses **one running example** — a subagent for the calculator
project you're sitting in right now (`src/`, `tests/`, built with CMake,
documented in `CONVENTIONS.md`, `GOTCHAS.md`, `ARCHITECTURE.md`). You'll
create that subagent in Part 1, then keep editing the *same file* as you move
through Parts 2–4, picking up one new capability at a time. By the end you'll
have built, run, restricted, and isolated a real subagent against real code
— not just read about the feature.

**Primary sources** (fetched and cross-verified directly against the live
docs, not from memory):
- https://code.claude.com/docs/en/sub-agents.md — the canonical subagent reference
- https://code.claude.com/docs/en/agents.md — how subagents compare to other
  multi-agent approaches

Everything marked **✅ Verified live** below was actually executed against
this repo while writing the tutorial (agent runs, builds, `ctest`, and one
genuine error) — not assumed from the docs.

---

## Table of Contents

**Part 1 — Beginner**
1. [The running example](#1-the-running-example)
2. [What a subagent actually is](#2-what-a-subagent-actually-is)
3. [Hands-on: build your first subagent](#3-hands-on-build-your-first-subagent)
4. [Reference: built-in subagents](#4-reference-built-in-subagents)
5. [Reference: ways to invoke a subagent](#5-reference-ways-to-invoke-a-subagent)

**Part 2 — Intermediate**

6. [Hands-on: tune the model and lock down tools](#6-hands-on-tune-the-model-and-lock-down-tools)
7. [Reference: the full frontmatter field table](#7-reference-the-full-frontmatter-field-table)
8. [Reference: tool access control patterns](#8-reference-tool-access-control-patterns)

**Part 3 — Advanced**

9. [Reference: scopes, precedence, file locations](#9-reference-scopes-precedence-file-locations)
10. [Reference: permission modes](#10-reference-permission-modes)
11. [Hands-on: give the subagent persistent memory](#11-hands-on-give-the-subagent-persistent-memory)
12. [Reference: hooks scoped to a subagent](#12-reference-hooks-scoped-to-a-subagent)
13. [Reference: MCP servers and skill preloading](#13-reference-mcp-servers-and-skill-preloading)
14. [Hands-on capstone: isolated subagent implements a real feature](#14-hands-on-capstone-isolated-subagent-implements-a-real-feature)

**Part 4 — Expert**

15. [Hands-on: promote the subagent to run the whole session](#15-hands-on-promote-the-subagent-to-run-the-whole-session)
16. [Reference: concurrency, nesting, forking](#16-reference-concurrency-nesting-forking)
17. [Reference: environment variables](#17-reference-environment-variables)
18. [Reference: subagents vs. other multi-agent approaches](#18-reference-subagents-vs-other-multi-agent-approaches)
19. [Reference: real gotchas and troubleshooting](#19-reference-real-gotchas-and-troubleshooting)

---

## 1. The Running Example

You're in a small C++ calculator: `src/parser.cpp` tokenizes and parses
expressions into an AST, `src/calculator.cpp` evaluates it, `src/cli.cpp` runs
a REPL. It's built with CMake and tested with Google Test via `ctest`.

Three docs already in this repo describe its rules:
- `CONVENTIONS.md` — naming, error handling, memory management conventions
- `GOTCHAS.md` — precedence quirks, and a **documented step-by-step recipe**
  for adding a new operator
- `ARCHITECTURE.md` — data flow and module responsibilities

This matters because a subagent is only as good as what it's told to check
against — and here, that's real project documentation, not something made up
for the tutorial.

---

## 2. What a Subagent Actually Is

A subagent is a delegated worker that runs inside your current session, in
its **own context window**, with its **own system prompt**, a **restrictable
tool set**, and an optional **model override**. It doesn't see your prior
conversation; it does its job and reports a summary back.

Use one when a task would otherwise flood your main conversation with
content you won't reference again — file contents from a review, search
results, log output. ([source](https://code.claude.com/docs/en/agents.md))

---

## 3. Hands-on: Build Your First Subagent

This repo already has a subagent defined at `.claude/agents/calc-reviewer.md`:

```markdown
---
name: calc-reviewer
description: Reviews calculator source files for correctness and convention issues. Use after editing src/*.cpp or src/*.h.
tools: Read, Glob, Grep
---

You are a reviewer for this calculator project. Read CONVENTIONS.md and
GOTCHAS.md first, then check the requested file against them. Report
specific line numbers and concrete fixes, not general advice.
```

Notice what it *doesn't* have: no `model` field (it'll use the default
subagent model order) and a tight `tools` allowlist — `Read, Glob, Grep`
only, so it's physically incapable of editing anything.

**✅ Verified live — restart required.** Claude Code was already running
when this file was created. Calling `Agent(calc-reviewer)` immediately
afterward failed with:

```
Agent type 'calc-reviewer' not found. Available agents: claude,
claude-code-guide, debesys-orders-expert, Explore, general-purpose, Plan,
statusline-setup
```

This matches a specific, documented exception to Claude Code's otherwise
live file-watching: *the first agent file created in a brand-new
`agents/` directory requires a restart* before it's picked up. Every other
edit to this file for the rest of this tutorial will hot-reload with no
restart needed — this is the one time you need to restart.

**Do this now:** restart your Claude Code session (exit and run `claude`
again, or start a fresh session in this directory). Then run:

```text
Use the calc-reviewer subagent to review src/parser.cpp
```

or, to force it explicitly instead of letting Claude decide whether to
delegate:

```text
@"calc-reviewer (agent)" review src/parser.cpp
```

You should see a subagent spin up, read `CONVENTIONS.md`, `GOTCHAS.md`, and
`src/parser.cpp`, and report back findings tied to specific lines — for
example, whether naming matches `CONVENTIONS.md`'s `camelCase`/`PascalCase`
rules, or whether error handling matches the `std::invalid_argument`
pattern it documents. Because it only has `Read, Glob, Grep`, it is
*structurally unable* to edit anything — try asking it to fix what it finds
and watch it have to tell you it can't.

---

## 4. Reference: Built-in Subagents

Alongside anything you define, Claude Code ships with these out of the box:

| Name | Model | Tools | Purpose |
|---|---|---|---|
| **Explore** | Main session's model | Read-only (no Write/Edit) | Fast, read-only codebase search and analysis |
| **Plan** | Main session's model | Read-only (no Write/Edit) | Research during plan mode, before presenting a plan |
| **general-purpose** | Follows subagent model order | Every tool available to subagents | Complex multi-step tasks needing both exploration and action |
| **claude** | Follows model order | Every tool available to subagents | Catch-all; also default for dispatched background sessions |
| **statusline-setup** | Sonnet | — | Runs when you invoke `/statusline` |
| **claude-code-guide** | Haiku | — | Answers questions about Claude Code itself |

(Source: https://code.claude.com/docs/en/sub-agents.md)

You can try the built-in read-only agent on the same file right now, no
setup required: `Use Explore to find every place src/parser.cpp is
included from`.

---

## 5. Reference: Ways to Invoke a Subagent

Three escalating options, from a one-off suggestion to a session-wide default:

**a) Natural language** — Claude decides whether to delegate:
```text
Use the calc-reviewer subagent to look at src/calculator.cpp
```

**b) @-mention** — guarantees that subagent runs:
```text
@"calc-reviewer (agent)" look at src/calculator.cpp
```
You can type this manually without the picker too: `@agent-calc-reviewer`.

**c) Session-wide** — the whole session runs as that subagent (covered
hands-on in [§15](#15-hands-on-promote-the-subagent-to-run-the-whole-session)):
```bash
claude --agent calc-reviewer
```

`/agents` no longer opens a picker — it prints a notice pointing at
`.claude/agents/` and `~/.claude/agents/`. To create or edit subagents, ask
Claude conversationally or edit the files directly, as you just did.

---

## 6. Hands-on: Tune the Model and Lock Down Tools

Now edit the same file — no restart needed this time, since the
`agents/` directory and the `calc-reviewer` name already exist.

Add a `model` field to pin it to a specific model instead of the default
resolution order:

```yaml
---
name: calc-reviewer
description: Reviews calculator source files for correctness and convention issues. Use after editing src/*.cpp or src/*.h.
tools: Read, Glob, Grep
model: haiku
---
```

Run it again on a file (`@"calc-reviewer (agent)" review src/cli.cpp`) and
you'll notice it's faster — this is the resolution order at work:
1. Per-invocation model parameter, if one was passed
2. `model` in frontmatter ← **you just set this**
3. `CLAUDE_CODE_SUBAGENT_MODEL` environment variable
4. Main conversation's model

Now try the **denylist** form instead of the allowlist, just to see the
equivalent effect:

```yaml
disallowedTools: Write, Edit
```

This inherits *everything else* the subagent would normally get, minus
`Write`/`Edit` — broader than the current `tools: Read, Glob, Grep`
allowlist, but with the same end result (no file modification). For a
reviewer like this, the explicit allowlist is the better choice precisely
*because* it's narrower — prefer it when you know exactly what the agent
needs.

---

## 7. Reference: The Full Frontmatter Field Table

Every documented field, verified against https://code.claude.com/docs/en/sub-agents.md.
`name` and `description` are required; everything else is optional.

| Field | Accepted values | Notes |
|---|---|---|
| `name` | string, ≤256 chars, no `:` | Filename doesn't need to match. Hooks receive this as `agent_type` |
| `description` | string | Tells Claude when to delegate to this subagent |
| `tools` | comma-separated string or YAML list | Allowlist. Inherits every tool available to subagents if omitted |
| `disallowedTools` | comma-separated string or YAML list | Denylist, removed from the inherited/specified pool |
| `model` | `sonnet`, `opus`, `haiku`, `fable`, full model ID, or `inherit` | Omit to use the subagent model order |
| `permissionMode` | `default`, `acceptEdits`, `auto`, `dontAsk`, `bypassPermissions`, `plan`, `manual` | Ignored for plugin subagents |
| `maxTurns` | integer | Max agentic turns before stopping; partial output is resumable |
| `autoCompactWindow` | integer, 100,000–1,000,000 | Lowers the auto-compact token window. Requires v2.1.296+ |
| `skills` | YAML list of skill names | Preloads full skill content into context at startup |
| `mcpServers` | YAML list of server names or inline configs | Scoped to this subagent. Ignored for plugin subagents |
| `hooks` | map of lifecycle hook events | Scoped to this subagent. Ignored for plugin subagents |
| `memory` | `user`, `project`, or `local` | Enables persistent, cross-session memory |
| `background` | `true` / `false` | Forces background execution |
| `omitClaudeMd` | `true` / `false` | Skips CLAUDE.md hierarchy at startup. Requires v2.1.271+ |
| `effort` | `low`, `medium`, `high`, `xhigh`, `max` | Overrides session effort level |
| `isolation` | `worktree` | Runs in a temporary git worktree, auto-cleaned if unchanged |
| `color` | `red`, `blue`, `green`, `yellow`, `purple`, `orange`, `pink`, `cyan` | Display color in task list/transcript |
| `initialPrompt` | string | Auto-submitted as first turn when this agent is the main session agent |
| `experimental` | map, e.g. `{cacheTtl: 1h}` | `cacheTtl` accepts `5m` or `1h`. Requires v2.1.248+ |

If `tools` resolves to zero valid entries, the subagent fails to launch with
an explicit error naming the bad entries.

---

## 8. Reference: Tool Access Control Patterns

MCP-scoped patterns work in both `tools` and `disallowedTools`:

| Goal | Field | Example |
|---|---|---|
| Grant every tool from one MCP server | `tools` | `mcp__github__*` |
| Withhold one server's tools | `disallowedTools` | `mcp__github` or `mcp__github__*` |
| Withhold every MCP tool from any server | `disallowedTools` | `mcp__*` |

Restrict which subagents a subagent can itself spawn:

```yaml
tools: Agent(worker, researcher), Read, Bash   # can only spawn these two
tools: Agent, Read, Bash                        # unrestricted spawning
```

---

## 9. Reference: Scopes, Precedence, File Locations

Your `calc-reviewer.md` lives at **project** scope: `.claude/agents/`. There
are five possible scopes in total, highest priority first:

| Priority | Scope | Location |
|---|---|---|
| 1 (highest) | Organization-wide | Managed settings |
| 2 | Current session only | `--agents` CLI flag (JSON) |
| 3 | Current project | `.claude/agents/` ← **where `calc-reviewer` lives** |
| 4 | All your projects | `~/.claude/agents/` |
| 5 (lowest) | Wherever the plugin is enabled | Plugin's `agents/` directory |

Key details:
- Project subagents are found by **walking up** from the working directory —
  every `.claude/agents/` between there and the repo root is scanned. On a
  name collision, the definition **closest to the working directory** wins.
- If you wanted `calc-reviewer` available in every project, not just this
  one, you'd move the file to `~/.claude/agents/calc-reviewer.md` instead.
- Live reload applies to both `.claude/agents/` and `~/.claude/agents/` —
  the only exception is the one you already hit in [§3](#3-hands-on-build-your-first-subagent).

---

## 10. Reference: Permission Modes

Set `permissionMode` in frontmatter to control tool-permission prompting
(ignored for plugin subagents):

| Mode | Behavior |
|---|---|
| `default` (alias `manual`) | Prompts for permission as usual |
| `acceptEdits` | Auto-accepts file edits/common filesystem commands in the working directory |
| `auto` | A background classifier reviews commands and protected-directory writes |
| `dontAsk` | Auto-denies anything that would prompt, with some exceptions |
| `bypassPermissions` | Skips all prompts — only active if the main conversation is too |
| `plan` | Plan mode: read-only exploration |

`calc-reviewer` doesn't need one of these — its `tools` allowlist already
makes destructive actions impossible, which is the stronger guarantee.

---

## 11. Hands-on: Give the Subagent Persistent Memory

Edit `calc-reviewer.md` once more, adding `memory: project`:

```yaml
---
name: calc-reviewer
description: Reviews calculator source files for correctness and convention issues. Use after editing src/*.cpp or src/*.h.
tools: Read, Glob, Grep
model: haiku
memory: project
---

You are a reviewer for this calculator project. Read CONVENTIONS.md and
GOTCHAS.md first, then check the requested file against them. Report
specific line numbers and concrete fixes, not general advice.

Update your agent memory with recurring issues or conventions you notice,
so future reviews can check for them automatically.
```

Memory only activates when you (or the subagent's own prompt, as above)
explicitly ask it to write to memory — just setting the field doesn't make
it happen automatically. Run `calc-reviewer` on two or three files and ask
it to note down anything it keeps seeing; it'll write to
`.claude/agent-memory/calc-reviewer/` (project scope — shareable via version
control if this were a git repo). The other two scopes:

| Scope | Storage location | Use when |
|---|---|---|
| `user` | `~/.claude/agent-memory/<agent-name>/` | Learnings should carry across *all* your projects |
| `project` | `.claude/agent-memory/<agent-name>/` | Project-specific, shareable via version control |
| `local` | `.claude/agent-memory-local/<agent-name>/` | Project-specific but should **not** be checked in |

---

## 12. Reference: Hooks Scoped to a Subagent

You could gate `calc-reviewer`'s `Bash` access (if you ever gave it any)
with a `PreToolUse` hook scoped to just this subagent:

```yaml
---
name: db-reader
description: Execute read-only database queries
tools: Bash
hooks:
  PreToolUse:
    - matcher: "Bash"
      hooks:
        - type: command
          command: "./scripts/validate-readonly-query.sh"
---
```

```bash
#!/bin/bash
# ./scripts/validate-readonly-query.sh
INPUT=$(cat)
COMMAND=$(echo "$INPUT" | jq -r '.tool_input.command // empty')
if echo "$COMMAND" | grep -iE '\b(INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|TRUNCATE)\b' > /dev/null; then
  echo "Blocked: Only SELECT queries are allowed" >&2
  exit 2
fi
exit 0
```

This repo's `calc-reviewer` doesn't need this — its tool allowlist already
rules out any destructive action — but it's the mechanism to reach for when
a tool you *must* grant (like `Bash`) needs narrower rules than an
allowlist alone can express. `Stop` is also available, and becomes
`SubagentStop` at runtime.

---

## 13. Reference: MCP Servers and Skill Preloading

Scope an MCP server to a specific subagent, inline or by reference:

```yaml
mcpServers:
  - playwright:
      type: stdio
      command: npx
      args: ["-y", "@playwright/mcp@latest"]
  - github
```

Preload a skill's full content (not just its description) at startup:

```yaml
skills:
  - api-conventions
  - error-handling-patterns
```

Neither applies to `calc-reviewer` as-is — it's deliberately simple — but
if you wanted it to also consult, say, a team style-guide skill on every
run, this is where you'd wire that in.

---

## 14. Hands-on Capstone: Isolated Subagent Implements a Real Feature

`GOTCHAS.md` in this repo documents a precise, 5-step recipe for adding a
new operator (modulo `%`) across `src/parser.h`, `src/parser.cpp`,
`src/calculator.cpp`, and both test files. This section has you delegate
that recipe to a subagent with `isolation: worktree`, so its edits happen on
an isolated copy of the repo rather than your working copy.

Create a second agent, `.claude/agents/calc-feature-builder.md`:

```yaml
---
name: calc-feature-builder
description: Implements new calculator features from GOTCHAS.md recipes
tools: Read, Edit, Write, Bash
isolation: worktree
---

You implement calculator features by following the documented recipes in
GOTCHAS.md exactly. After implementing, build the project and run ctest to
confirm your change works and nothing else broke.
```

Then invoke it:

```text
@"calc-feature-builder (agent)" follow the GOTCHAS.md recipe "Add a New
Operator" to add modulo (%) support, then build and run ctest
```

**⚠️ Verified live — this will fail in this exact repo, and that's a
deliberate teaching moment.** `isolation: worktree` requires a git
repository, and this learning project isn't one. Attempting it here
produces:

```
Cannot create agent worktree: not in a git repository and no WorktreeCreate
hooks are configured. Configure WorktreeCreate/WorktreeRemove hooks in
settings.json to use worktree isolation with other VCS systems.
```

To actually run this hands-on, first run `git init && git add -A && git
commit -m "init"` in the repo root, then retry the invocation above. Once
you do, expect the subagent to:
1. Add a `MOD` token type to `src/parser.h`
2. Tokenize `%` in `Parser::tokenize()`
3. Parse it at the same precedence level as `*`/`/` in `parseTerm()`
4. Evaluate it in `Calculator::applyOp()`, throwing on modulo-by-zero
5. Add matching tests to both `tests/parser_test.cpp` and
   `tests/calculator_test.cpp`

This recipe was independently validated while writing this tutorial: a
fully isolated agent run implemented it exactly as described, and `ctest`
passed on every new modulo-related test. One thing to expect that *isn't*
part of your change: **`ParserTest.Power` will still fail** even after a
clean modulo implementation —

```
[ RUN      ] ParserTest.Power
Expected equality of these values:
  result
    Which is: 2
  8
[  FAILED  ] ParserTest.Power
```

This is a real, pre-existing bug in `src/parser.cpp`'s `parseFactor()`: the
`POW` branch is checked *before* the number branch, but `parseTerm()` only
ever calls `parseFactor()` after already consuming a number, so the `^`
branch is unreachable from normal input and `2^3` silently evaluates to
just `2`. (`GOTCHAS.md`'s own right-associativity code sample shows the
intended logic — it's just never reached.) Good follow-up exercise: ask
`Explore` to trace why `parseFactor()`'s `POW` branch never fires, then use
a subagent with `Edit` access to fix it and confirm `ctest` goes fully
green.

---

## 15. Hands-on: Promote the Subagent to Run the Whole Session

Everything so far delegated *from* a session. You can also make
`calc-reviewer` run an **entire session**:

```bash
claude --agent calc-reviewer
```

Every response in that session now comes from `calc-reviewer`'s system
prompt and tool set — useful for a dedicated "review-only" terminal tab
you keep open alongside your main session.

You can also define the same agent **inline as JSON**, scoped to just one
session, without touching the filesystem at all:

```bash
claude --agents '{
  "calc-reviewer": {
    "description": "Reviews calculator source files for correctness and convention issues.",
    "prompt": "You are a reviewer for this calculator project. Read CONVENTIONS.md and GOTCHAS.md first, then check the requested file against them.",
    "tools": ["Read", "Grep", "Glob"],
    "model": "haiku"
  }
}'
```

This is the same definition, just with `prompt` standing in for the
Markdown body. Accepted fields here: `prompt`, `description`, `tools`,
`disallowedTools`, `model`, `permissionMode`, `mcpServers`, `hooks`,
`maxTurns`, `autoCompactWindow`, `skills`, `initialPrompt`, `memory`,
`effort`, `background`, `omitClaudeMd`, `isolation`. `color` and
`experimental` are accepted in file-based agents but silently ignored here.

To set a project-wide default agent instead of passing a flag every time,
add to `.claude/settings.json`:

```json
{
  "agent": "calc-reviewer"
}
```

(A `--agent` flag, if also passed, overrides this setting.)

---

## 16. Reference: Concurrency, Nesting, Forking

**Concurrency limit:** 20 subagents can run at once in a session by
default. A 21st `Agent` call fails with `Concurrent subagent limit reached`
and Claude is told not to retry; it succeeds again once the count drops.
Sessions with `ultracode` effort are exempt.

**Nesting depth:** a subagent can spawn its own subagents up to **three
layers below the main conversation** by default. At the depth limit,
Claude Code withholds the `Agent` tool from every subagent except a forked
one, so it must finish the delegated work itself and return one summary.

**Forking:** a forked subagent inherits your **full conversation context**
instead of starting fresh. Start one with `/subtask`, or let Claude spawn
one automatically when fork mode is on (`CLAUDE_CODE_FORK_SUBAGENT`).

---

## 17. Reference: Environment Variables

| Variable | Effect |
|---|---|
| `CLAUDE_CODE_SUBAGENT_MODEL` | Default model for subagents when frontmatter omits `model` |
| `CLAUDE_CODE_SUBAGENT_MODEL_FORCE` | `1` forces that model onto *every* subagent/teammate/workflow agent, overriding frontmatter |
| `CLAUDE_CODE_EFFORT_LEVEL` | Overrides both the `effort` frontmatter field and any per-invocation effort parameter |
| `CLAUDE_CODE_DISABLE_EXPLORE_PLAN_AGENTS` | `1` removes the built-in `Explore`/`Plan` subagents |
| `CLAUDE_AGENT_SDK_DISABLE_BUILTIN_AGENTS` | `1` (Agent SDK / non-interactive mode) removes *all* built-in subagent types |
| `CLAUDE_CODE_FORK_SUBAGENT` | `0` disables fork mode so Claude waits for subagents instead |
| `CLAUDE_CODE_DISABLE_BACKGROUND_TASKS` | `1` forces synchronous waiting; also disables background bash and Ctrl+B |
| `CLAUDE_CODE_MAX_SUBAGENT_SPAWN_DEPTH` | Sets nesting depth (default 3). `1` disables nesting entirely |
| `CLAUDE_CODE_MAX_CONCURRENT_SUBAGENTS` | Sets the concurrency cap (default 20) |
| `CLAUDE_CODE_DISABLE_AUTO_MEMORY` | Disables auto memory, including the `memory` frontmatter field's effect |

Example: run every subagent in a session on Haiku regardless of frontmatter:

```json
{
  "env": {
    "CLAUDE_CODE_SUBAGENT_MODEL": "haiku",
    "CLAUDE_CODE_SUBAGENT_MODEL_FORCE": "1"
  }
}
```

---

## 18. Reference: Subagents vs. Other Multi-Agent Approaches

Subagents are one of **five** ways Claude Code handles multiple tasks at once:

| Approach | What it gives you | Use it when |
|---|---|---|
| **Subagents** | Delegated workers inside one session, own context, return a summary | A side task would flood your main conversation with stuff you won't reference again — exactly what `calc-reviewer` does |
| **Agent view** (`claude agents`) | One screen to dispatch/monitor background sessions. *Research preview* | You have several independent tasks to hand off and check on later |
| **Agent teams** | Coordinated sessions with a shared task list and messaging, managed by a lead. *Experimental, off by default* | Claude should split a project into pieces, assign them, and keep workers in sync |
| **Projects** (claude.ai/code) | One ongoing cloud conversation spawning parallel "threads." *Public beta* | Work spans days/weeks and should keep running when your machine is off |
| **Dynamic workflows** | A deterministic script running many subagents, cross-checking results | The job outgrows a handful of subagents, or findings need verification against each other (codebase audit, large migration) |

(Source: https://code.claude.com/docs/en/agents.md)

If you wanted to scale this tutorial's capstone up — e.g. "implement every
recipe in GOTCHAS.md, verify each one, then cross-check for regressions" —
that's the point where you'd reach for a dynamic workflow instead of
hand-dispatching individual subagents.

---

## 19. Reference: Real Gotchas and Troubleshooting

These aren't hypothetical — all three were hit directly while building this
tutorial against this exact repo:

**1. Brand-new `agents/` directory needs a restart.** Creating
`.claude/agents/calc-reviewer.md` for the first time in a repo with no prior
`.claude/agents/` directory did **not** make it invocable in the
already-running session — `Agent type 'calc-reviewer' not found` — until the
session restarted. Every edit *after* that first restart hot-reloads fine.

**2. Worktree isolation needs a git repo.** `isolation: worktree` on
`calc-feature-builder` failed outright in this repo with `Cannot create
agent worktree: not in a git repository...` — because this learning project
was never git-initialized. If you see this error anywhere, check
`git status` before suspecting the agent config.

**3. Zero resolvable tools = launch failure.** If every entry in `tools`
fails to match a real tool name (a typo, or an MCP tool prefix written
wrong — it must be `mcp__<server>__<tool>`), the subagent won't start at
all; the error names the specific bad entries.

**Disable a subagent globally**, if you want to retire it without deleting
the file:

```json
{
  "permissions": {
    "deny": ["Agent(calc-feature-builder)"]
  }
}
```

or for a single session:

```bash
claude --disallowedTools "Agent(calc-feature-builder)"
```

---

*Compiled and hands-on-verified against this repo's actual files, using
https://code.claude.com/docs/en/sub-agents.md and
https://code.claude.com/docs/en/agents.md as the reference source.*
