# CLAUDE.md: A Complete Tutorial

**Master the art of persistent project context for Claude Code**

---

## Table of Contents

1. [What is CLAUDE.md?](#what-is-claudemd)
2. [Why You Need It](#why-you-need-it)
3. [Official Best Practices](#official-best-practices)
4. [File Structure & Organization](#file-structure--organization)
5. [What to Include](#what-to-include)
6. [What NOT to Include](#what-not-to-include)
7. [Writing Effective CLAUDE.md](#writing-effective-claudemd)
8. [Advanced Patterns](#advanced-patterns)
9. [Common Mistakes](#common-mistakes)
10. [Real-World Examples](#real-world-examples)
11. [Tools & Commands](#tools--commands)
12. [Checklist](#checklist)

---

## What is CLAUDE.md?

**CLAUDE.md is a plain-text file that provides persistent instructions to Claude Code across all sessions.**

Unlike conversation context, which expires when you close Claude Code, CLAUDE.md stays in your repository and is loaded automatically whenever you open a project. It acts as your project's "instruction manual" for Claude.

### Core Principle

> "Only write down what Claude can't find by reading the repo."

This single principle guides everything you put in CLAUDE.md. If Claude can discover it by reading the code, skip it.

---

## Why You Need It

Claude Code starts with no memory of your project between sessions. Without CLAUDE.md, you'd need to re-explain:

- How to build and test your project
- Your code style conventions
- Which directories are deprecated
- Integration details hidden from the code
- Gotchas you've already corrected twice

**With CLAUDE.md**: Claude knows these things immediately, reducing friction and avoiding repeated mistakes.

---

## Official Best Practices

### Size Matters

- **Target**: Under 200 lines per file
- **There is no hard 1000-line limit**, but longer files consume context and can reduce adherence.
- **Strategy**: Keep the main guide concise; use imports or path-scoped rules in `.claude/rules/` for details.

### Conciseness is Key

```markdown
# ❌ TOO LONG (wastes context)
The calculator library uses a recursive descent parser that processes
tokens in left-to-right order. The Parser class contains methods for
parsing expressions, terms, factors, and powers. Each method calls the
next level in the operator precedence hierarchy...

# ✅ CONCISE (actionable)
**Parser precedence**: ^ > * / > + -
```

### Actionable Over Descriptive

```markdown
# ❌ DESCRIPTIVE (you need to read the code anyway)
We have a middleware system that handles request routing and validation.

# ✅ ACTIONABLE (Claude can act on this)
Middleware runs in order: auth → validation → route. Add new middleware
to middlewares/ and register in config/middleware.ts
```

---

## File Structure & Organization

### Single Repository

```
your-project/
├── CLAUDE.md                 # Main project instructions
├── .claude/
│   ├── settings.json         # Claude Code settings
│   └── rules/
│       ├── naming.md         # Naming conventions
│       ├── testing.md        # Testing practices
│       └── deployment.md     # Deployment procedures
└── src/
```

### Monorepo Structure

```
monorepo/
├── CLAUDE.md                 # Root instructions
├── .claude/
│   └── rules/
│       ├── root.md           # Org-wide standards
│       └── frontend.md       # Frontend-specific rules (scoped with paths frontmatter)
├── src/
│   ├── frontend/
│   │   └── CLAUDE.md         # Frontend-specific overrides
│   ├── backend/
│   │   └── CLAUDE.md         # Backend-specific overrides
│   └── shared/
```

### Personal Settings

```
~/.claude/
├── CLAUDE.md                 # Your global defaults (all projects)
└── settings.json

your-project/
└── CLAUDE.local.md           # Personal project-specific instructions
```

**Note**: Add `CLAUDE.local.md` to `.gitignore` for personal project-specific rules.

---

## What to Include

### 1. Build & Test Commands (Essential)

**Why**: Claude needs exact commands to verify work.

````markdown
## Building

```bash
mkdir -p build && cd build && cmake .. && cmake --build .
```

## Testing

```bash
cd build && ctest
```

## Running

```bash
./build/calc-cli
```
````

### 2. Code Conventions (Essential)

**Why**: Claude would otherwise re-discover these from reading code.

```markdown
## Naming Conventions

- Functions: `camelCase` (e.g., `parseExpression()`)
- Classes: `PascalCase` (e.g., `Parser`, `Calculator`)
- Constants: `UPPER_SNAKE_CASE` (e.g., `MAX_TOKENS`)
- Private members: Prefix with `_` (e.g., `_parseStatement()`)

## File Organization

- Headers: `include/projectname/*.h`
- Implementation: `src/*.cpp`
- Tests: `tests/*_test.cpp`
```

### 3. Gotchas & Non-Obvious Behavior (Essential)

**Why**: These prevent Claude from making the same mistake twice.

```markdown
## Gotchas

**Operator Precedence**: Power (^) binds right-to-left:
- `2^3^2` = `2^(3^2)` = 512 ✓
- NOT `(2^3)^2` = 64 ✗

**Parser Depth**: Limited to 1000 tokens. Deeply nested expressions fail silently.

**Deprecated**: `old_parser.cpp` was replaced by `new_parser.cpp` in v2.0.
Do not reference the old file.
```

### 4. Integration & Deployment (When Hidden)

**Why**: If it's not obvious from reading code, Claude needs to know it.

```markdown
## Deployment

Production builds require:
1. Set `CMAKE_BUILD_TYPE=Release`
2. Run security scan: `./scripts/scan.sh`
3. Generate SBOM: `./scripts/sbom.sh`
4. Tag release in git before deploy

Do not deploy from feature branches.
```

### 5. Related Documentation (Navigation)

**Why**: Guides Claude to detailed information for complex topics.

```markdown
## See Also

- [`ARCHITECTURE.md`](ARCHITECTURE.md) — System design, data flow
- [`BUILDING.md`](BUILDING.md) — Build system details, CMake
- [`CONVENTIONS.md`](CONVENTIONS.md) — Code style, error handling
- [`GOTCHAS.md`](GOTCHAS.md) — Non-obvious behavior, edge cases
```

---

## What NOT to Include

### 1. ❌ Architecture Descriptions

**Why**: Claude reads the code. Descriptions get stale.

```markdown
# WRONG
The system uses the Model-View-Controller pattern. Models handle
business logic, views render output, and controllers...

# RIGHT
Leave this for ARCHITECTURE.md or inline code comments.
```

### 2. ❌ Duplicate Code Information

**Why**: Wastes context space and creates contradictions.

```markdown
# WRONG
The Parser class has methods parseExpression(), parseTerm(), and parseFactor()
which follow the operator precedence rules for addition, multiplication, and power...

# RIGHT
Just note: "Operator precedence: ^ > * / > + -"
Claude can read the actual code.
```

### 3. ❌ Personal Workflow Details

**Why**: Belongs in `CLAUDE.local.md` or your home `~/.claude/CLAUDE.md`.

```markdown
# WRONG (in shared repo)
I prefer to run tests before committing. Always check linting first.

# RIGHT (in personal settings)
Save this in ~/.claude/CLAUDE.md or project/CLAUDE.local.md
```

### 4. ❌ Aspirational Rules

**Why**: Claude will try to follow them anyway. Enforce with hooks instead.

```markdown
# WRONG (non-deterministic, will be ignored inconsistently)
Always add unit tests for new functions.

# RIGHT (deterministic enforcement)
Use hooks or settings.json to run tests automatically before commits.
```

### 5. ❌ Large, Verbose Files

**Why**: Context expensive, Claude's adherence drops above 200 lines.

```markdown
# WRONG
[500 lines of detailed explanations]

# RIGHT
Keep main CLAUDE.md under 200 lines. Move detailed info to:
- Supporting .md files (ARCHITECTURE.md, GOTCHAS.md)
- Path-scoped rules in .claude/rules/
```

---

## Writing Effective CLAUDE.md

### Principle 1: Plain Language Over Jargon

```markdown
# ❌ JARGON
Implement idempotent operations using transactional semantics with ACID compliance.

# ✅ PLAIN LANGUAGE
All database operations must complete fully or roll back completely. Never leave partial updates.
```

### Principle 2: Specific Over General

```markdown
# ❌ TOO GENERAL
Write good code.

# ✅ SPECIFIC
Use 2-space indentation. Use `const` by default; `let` only for loop counters.
```

### Principle 3: Imperative Over Passive

```markdown
# ❌ PASSIVE
Tests should be written for new code.

# ✅ IMPERATIVE
Write tests for all new functions. Place tests in tests/*_test.cpp alongside implementations.
```

### Principle 4: Link Instead of Explain

```markdown
# ❌ EXPLAIN EVERYTHING
[200 lines about the build system, flags, configurations...]

# ✅ LINK TO DETAIL
Build: `cmake .. && cmake --build .`
(See [`BUILDING.md`](BUILDING.md) for advanced options)
```

### Principle 5: Show Examples

```markdown
# ❌ NO EXAMPLES
Naming follows conventions.

# ✅ WITH EXAMPLES
Naming: functions are `camelCase` (e.g., `calculateSum()`), classes are `PascalCase`
(e.g., `Calculator`), constants are `UPPER_SNAKE_CASE` (e.g., `MAX_DEPTH`).
```

---

## Advanced Patterns

### Pattern 1: Path-Scoped Rules (Monorepos)

Store rules in `.claude/rules/` with frontmatter for specific paths:

**`.claude/rules/frontend.md`**
```markdown
---
description: Frontend-specific conventions
paths: ["src/frontend/**", "*.tsx", "*.css"]
---

# Frontend Conventions

- Use Tailwind for styling
- Components: PascalCase, one per file
- Hooks: prefix with `use` (e.g., `useAuth`)
```

**`.claude/rules/backend.md`**
```markdown
---
description: Backend-specific conventions
paths: ["src/backend/**", "*.go", "*.proto"]
---

# Backend Conventions

- Use dependency injection
- Errors: wrap with context
- Logging: structured JSON only
```

### Pattern 2: Modular Organization

**Main CLAUDE.md** — Concise overview linking to modules:

```markdown
# Project Overview

A calculator library with CLI interface.

## Quick Reference

- Build: `cmake .. && cmake --build .`
- Test: `ctest`
- Conventions: See [`CONVENTIONS.md`](CONVENTIONS.md)
- Architecture: See [`ARCHITECTURE.md`](ARCHITECTURE.md)
- Gotchas: See [`GOTCHAS.md`](GOTCHAS.md)
```

Then create focused documents:
- `ARCHITECTURE.md` — Data flow, design decisions
- `BUILDING.md` — Build system, compilation
- `CONVENTIONS.md` — Code style, error handling
- `GOTCHAS.md` — Non-obvious behavior, edge cases

### Pattern 3: Team-Local Split

**Committed** (`CLAUDE.md`):
```markdown
# Build & Test Commands
# Code Conventions
# Gotchas & Non-Obvious Behavior
# Integration Details
```

**Personal** (`CLAUDE.local.md` in `.gitignore`):
```markdown
# My Preferred Tools
# My Local Build Setup
# My Development Workflow
```

### Pattern 4: Enforcement vs. Guidance

**Use CLAUDE.md for**: Context, conventions, gotchas (guidance)

```markdown
Prefer const over let.
```

**Use hooks for**: Deterministic enforcement (guaranteed execution)

```json
// settings.json
{
  "hooks": {
    "pre-commit": ["npm run lint", "npm test"]
  }
}
```

---

## Common Mistakes

### Mistake 1: Everything in One File

**❌ Bad**
```markdown
# CLAUDE.md (hundreds of lines of everything)
[Architecture, conventions, build, deployment, gotchas, team policies...]
```

**✅ Good**
```
CLAUDE.md (150 lines, overview + links)
ARCHITECTURE.md (technical design)
BUILDING.md (build system)
CONVENTIONS.md (code style)
GOTCHAS.md (non-obvious behavior)
.claude/rules/ (path-specific rules)
```

### Mistake 2: Duplicating Code Documentation

**❌ Bad**
```markdown
The Parser class implements recursive descent parsing. It has methods
for parsing expressions, terms, and factors that follow the precedence...
```

**✅ Good**
```markdown
**Operator precedence**: ^ > * / > + - (implemented in Parser)
```

### Mistake 3: Using ALL CAPS for Emphasis

**❌ Bad**
```markdown
NEVER commit directly to main. ALWAYS create a feature branch.
ALWAYS run tests before pushing.
```

**✅ Good**
```markdown
Do not commit directly to main—create a feature branch.
Run tests before pushing: `npm test && npm run lint`.
```

### Mistake 4: Setting Contradictory Rules

**❌ Bad**
```markdown
Prefer functional style with immutability.
...later in file...
Use imperative loops for performance.
```

**✅ Good**
```markdown
Prefer functional style with immutability, except in performance-critical
sections (marked with PERF_CRITICAL comment).
```

### Mistake 5: Stale Documentation

**❌ Bad**
```markdown
Uses the old Parser from v1.0 [Written in 2020, never updated]
```

**✅ Good**
Audit documentation with `/doctor prompt-audit` to catch stale references.

---

## Real-World Examples

### Example 1: Small Python Library

**CLAUDE.md** (~80 lines)

````markdown
# Python ML Library

Command-line tool for training and evaluating machine learning models.

## Quick Start

Install:
```bash
pip install -e .
```

Train:
```bash
python -m ml_lib train --config config.yaml
```

Test:
```bash
pytest tests/ -v
```

## Conventions

- Functions: `snake_case` (e.g., `train_model()`)
- Classes: `PascalCase` (e.g., `ModelTrainer`)
- Files: `snake_case.py`

## Gotchas

**GPU Memory**: Models default to GPU 0. Set `CUDA_VISIBLE_DEVICES=1` for GPU 1.

**Config Format**: Must use YAML (not JSON). Invalid YAML silently uses defaults—see error log.

**Deprecated**: `old_trainer.py` was replaced in v2.0. Do not use.

## See Also

- [`ARCHITECTURE.md`](ARCHITECTURE.md) — Model pipeline, data flow
- [`TRAINING.md`](TRAINING.md) — Training parameters, hypertuning
````

### Example 2: Full-Stack Web App

**CLAUDE.md** (~150 lines)

````markdown
# E-Commerce Platform

SPA frontend (React) + Node.js backend + PostgreSQL database.

## Development Setup

Install:
```bash
npm install
npm run setup:db
```

Dev server (port 3000):
```bash
npm run dev
```

Tests:
```bash
npm run test
npm run test:e2e
```

Build (production):
```bash
npm run build
```

## Quick Reference

| Task | Command |
|------|---------|
| Database migration | `npm run migrate` |
| Seed test data | `npm run seed:test` |
| Database console | `npm run db:shell` |
| API docs | `http://localhost:3000/api/docs` |

## Project Structure

```
frontend/          — React SPA
backend/           — Express API
database/          — SQL migrations
shared/            — TypeScript types
```

## Conventions

- **Frontend**: Functional components, React Hooks, named exports
- **Backend**: MVC pattern, async/await, error middleware
- **Database**: Migrations only (never edit schema.sql directly)

## Gotchas

**CORS**: Preflight requests fail if `origin` header doesn't match config.
See `backend/middleware/cors.js`.

**Transactions**: Database routes don't auto-rollback on error. Use `await db.transaction()`.

**API Versioning**: `/api/v1/` is stable. `/api/v2/` is experimental—breaking changes OK.

## See Also

- [`ARCHITECTURE.md`](ARCHITECTURE.md) — System design, authentication flow
- [`DEPLOYMENT.md`](DEPLOYMENT.md) — Production checklist
- [`DATABASE.md`](DATABASE.md) — Schema, migrations
````

### Example 3: C++ Project (from your learning directory)

**CLAUDE.md** (~50 lines) ✅ Excellent example

````markdown
# CLAUDE.md

Multi-file calculator library with CLI interface.

## Quick Start

Build:
```bash
mkdir -p build && cd build && cmake .. && cmake --build .
```

Run:
```bash
./calc-cli
```

Test:
```bash
ctest
```

## Project Structure

```
src/            — Core library (Parser, Calculator, CLI)
tests/          — Google Test unit tests
CMakeLists.txt  — Build configuration
```

## Conventions

- Headers: `include/calc/*.h`
- Implementation: `src/*.cpp`
- Tests: `tests/*_test.cpp`
- Classes: `PascalCase` (Parser, Calculator)
- Functions: `camelCase` (parseExpression)

## Common Tasks

- **Add a new operator** → See `GOTCHAS.md#add-operator`
- **Debug an AST** → See `GOTCHAS.md#debug-ast`
- **Use as library** → See `ARCHITECTURE.md#deployment`
````

This example is excellent because it:
- Is concise (~50 lines)
- Provides exact build commands
- Links to detailed docs instead of explaining
- Focuses on gotchas, not architecture

---

## Tools & Commands

### Creating CLAUDE.md

**Auto-generate** from your codebase:

```bash
/init
```

Claude Code analyzes your project and generates a starting CLAUDE.md.

### Auditing CLAUDE.md

**Check for contradictions and stale information**:

```bash
/doctor prompt-audit
```

Identifies:
- Stale references to deleted files
- Contradictory rules
- Commands that no longer work

### Viewing Memory

**See all remembered context**:

```bash
/memory
```

Shows CLAUDE.md and any path-scoped rules loaded from `.claude/rules/`.

### Confirming Load

**Verify CLAUDE.md was loaded**:

```bash
/context all
```

Shows exactly what instructions Claude has loaded.

---

## Checklist

When writing or updating CLAUDE.md, verify:

### Content

- [ ] Under 200 lines (or split into modules)
- [ ] Includes exact build commands
- [ ] Includes exact test commands
- [ ] Documents code conventions (naming, structure)
- [ ] Includes gotchas that prevent common mistakes
- [ ] Links to detailed docs instead of explaining everything
- [ ] No duplicate code documentation
- [ ] No stale file references

### Structure

- [ ] Has Overview or Quick Start section
- [ ] Has Project Structure section
- [ ] Links to supporting docs (ARCHITECTURE.md, GOTCHAS.md, etc.)
- [ ] Organized with clear headers
- [ ] Uses code blocks for commands and examples

### Quality

- [ ] Plain language (no jargon)
- [ ] Specific (not generic)
- [ ] Actionable (Claude can act on it)
- [ ] Consistent with project reality
- [ ] No contradictions with other docs

### Team

- [ ] Shared conventions are documented
- [ ] Personal settings in `~/.claude/CLAUDE.md` or `CLAUDE.local.md`
- [ ] `CLAUDE.local.md` is in `.gitignore`
- [ ] Monorepos use path-scoped rules

---

## Summary

**CLAUDE.md is your project's instruction manual for Claude Code.**

The key principle: *Only write down what Claude can't find by reading the repo.*

### Three Essential Sections

1. **Build & Test**: Exact commands to verify work
2. **Conventions**: Naming, structure, patterns
3. **Gotchas**: Non-obvious behavior that prevents mistakes

### Three Golden Rules

1. **Keep it concise** — Target under 200 lines
2. **Link to detail** — Use ARCHITECTURE.md, GOTCHAS.md, etc. for complex info
3. **Make it actionable** — Focus on what Claude should do, not what the system does

### Advanced Organization

- Use `.claude/rules/` for path-scoped rules in monorepos
- Split large guides into focused documents
- Use personal `CLAUDE.local.md` for workflow preferences
- Audit regularly with `/doctor prompt-audit`

### Start Now

```bash
# Generate starter CLAUDE.md
/init

# Audit for issues
/doctor prompt-audit

# Verify it's loaded
/context all
```

You now have the knowledge to create effective CLAUDE.md files that maximize Claude Code's productivity in your projects.

---

## Appendix: External Resources

- **Official Claude Code Docs**: https://code.claude.com/docs
- **Claude API Reference**: https://claude.ai/docs
- **GitHub Issue Tracker**: https://github.com/anthropics/claude-code/issues
- **Community Examples**: Search GitHub for `CLAUDE.md` in top repositories

---

**Happy coding with Claude! 🚀**
