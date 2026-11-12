A structured learning path for mastering project documentation in Claude Code, compiled from official Claude Code tutorials and best practices.

---

## Overview

This lesson plan teaches you how to create a `CLAUDE.md` file—a markdown document that gives Claude Code persistent instructions about your project. A good `CLAUDE.md` ensures Claude understands your architecture, conventions, and project goals across all sessions.

**Total Duration:** ~4-5 hours (self-paced)

---

## Prerequisites

- Basic understanding of markdown syntax
- Familiarity with a coding project (even a simple one)
- Claude Code installed and working
- Access to your project repository

---

## Module 1: Foundations (45 minutes)

### 1.1 What is CLAUDE.md? (10 min)

**Learning Objectives:**
- Understand the purpose of CLAUDE.md files
- Know when to create one vs. when to rely on auto memory
- Recognize the difference between instructions and configuration

**Content:**
- CLAUDE.md is a markdown file at the project root that Claude Code reads at the **start of every session**
- It provides **persistent instructions** about coding standards, architecture, and project conventions
- It's complementary to auto memory (which Claude writes automatically)
- CLAUDE.md helps with consistency, especially across teams

**Key Distinction:**
```
CLAUDE.md (you write)          → Instructions, rules, standards, links
Auto memory (Claude writes)    → Learnings, patterns, corrections, feedback
```

**Action:** Check if your project has a `CLAUDE.md` in the root directory. If not, note this as a task.

---

### 1.2 Why CLAUDE.md Matters (15 min)

**Learning Objectives:**
- Understand the problems CLAUDE.md solves
- See examples of how it improves Claude's work quality

**Real-World Problems it Solves:**

1. **Consistency across sessions:**
   - Without CLAUDE.md: Claude might use different naming conventions or architectural patterns in each session
   - With CLAUDE.md: Standards are reinforced every time

2. **Onboarding new developers (including Claude):**
   - Communicates project conventions without relying on informal knowledge
   - Makes decisions explicit

3. **Preventing anti-patterns:**
   - "Don't use X library" or "Always use Y pattern for Z"
   - Communicates known gotchas and workarounds

4. **Documentation as code:**
   - Lives with the project, versioned in git
   - Evolves with the codebase

**Example Scenario:**
```
Without CLAUDE.md:
  Session 1: Claude creates a component with one pattern
  Session 2: Claude creates a component with a different pattern
  Result: Inconsistent codebase

With CLAUDE.md:
  Session 1 & 2: Both follow the documented component pattern
  Result: Consistent, maintainable code
```

**Action:** Write down one specific problem in your project that CLAUDE.md could solve.

---

### 1.3 CLAUDE.md vs. AGENTS.md (10 min)

**Learning Objectives:**
- Know when to use CLAUDE.md vs. AGENTS.md
- Understand they're interchangeable for project instructions

**Key Facts:**
- If your project already has `AGENTS.md` (for other coding agents), Claude Code will read that instead of CLAUDE.md
- They serve the same purpose for Claude Code
- CLAUDE.md is recommended for Claude Code-specific projects
- AGENTS.md is better if you're running multiple agent systems

**Action:** Check if your project has either file. Note which one exists (or if neither exists).

---

### 1.4 Anatomy of Your Current Project (10 min)

**Learning Objectives:**
- Understand what information you need to extract from your project to write CLAUDE.md
- Learn the discovery process

**Key Information to Gather:**

1. **Architecture overview** — data flow, module relationships
2. **Build/test commands** — how to compile, run, test
3. **Conventions** — naming, code style, patterns
4. **Known gotchas** — edge cases, common mistakes, workarounds
5. **Project structure** — where different types of code live
6. **Dependencies** — libraries, tools, versions
7. **Deployment/Usage** — how is this used in production or other projects?

**For Your Calculator Project, the Info Should Cover:**
```
- Parser: tokenization & AST building via recursive descent
- Calculator: recursive evaluation of AST
- CLI: REPL interface
- Build: cmake with ctest for tests
- Languages/Tools: C++, CMake, Google Test
```

**Action:** Create a bullet-list inventory of your project's core components and how they fit together. (This is the raw material for your CLAUDE.md.)

---

## Module 2: Structure & Organization (60 minutes)

### 2.1 The Four Sections of a Good CLAUDE.md (15 min)

**Learning Objectives:**
- Learn the canonical structure of CLAUDE.md files
- Understand why each section matters
- Know what goes in each section

**Canonical Sections:**

#### 1. **Overview**
- One paragraph describing what the project is
- Reference links to detailed docs (see ARCHITECTURE.md, BUILDING.md, etc.)
- Quick facts: language, framework, team size

#### 2. **Quick Start**
- Fastest path to getting the project running
- Build, run, and test commands
- Prerequisites checklist

#### 3. **Project Structure**
- Directory tree with annotations
- What each folder contains
- Where different types of code live (tests, config, docs, etc.)

#### 4. **Common Tasks** (or "Common Workflows")
- Key tasks developers/Claude will face
- Links to detailed docs for each task
- One-liners or short commands where applicable

**Optional Additional Sections:**
- **Key Design Decisions** — why the project is structured this way
- **Integration Notes** — how this project fits into a larger system
- **Gotchas & Known Issues** — edge cases and workarounds (or link to GOTCHAS.md)

**Example Structure from Your Calculator Project:**
```
# CLAUDE.md

## Overview
Multi-file calculator library...

## Quick Start
Build, Run, Test commands

## Project Structure
src/, tests/, main.cpp, CMakeLists.txt

## Common Tasks
- Add a new operator → see GOTCHAS.md
- Debug an AST → see GOTCHAS.md
```

**Action:** Outline the structure you'll use for your CLAUDE.md. Decide on sections and what goes in each.

---

### 2.2 Writing the Overview Section (15 min)

**Learning Objectives:**
- Craft a compelling project overview
- Know what details belong here vs. deeper docs

**Best Practices:**

1. **Start with the "why":**
   - What problem does this solve?
   - Who uses it?
   - What makes it different?

2. **Keep it brief:**
   - 1-3 sentences maximum
   - Leave the deep details for architecture docs

3. **Include reference links:**
   - Point to ARCHITECTURE.md, BUILDING.md, etc.
   - Readers who need detail know where to go

4. **Add quick facts:**
   - Language, framework, key dependencies
   - Target audience (backend, frontend, library users, etc.)

**Example (Good):**
```markdown
# CLAUDE.md

## Overview

A multi-file calculator library with CLI interface. Parses and evaluates
mathematical expressions with support for +, -, *, /, ^ (power), and parentheses.

**See also:**
- [`ARCHITECTURE.md`](ARCHITECTURE.md) — Data flow, module relationships, design decisions
- [`BUILDING.md`](BUILDING.md) — Build commands, CMake setup, running tests
- [`CONVENTIONS.md`](CONVENTIONS.md) — Code style, naming, error handling patterns
```

**Example (Not as Good):**
```markdown
## Overview

This is a calculator that does math. It has a parser and a calculator and a CLI.
It was made for learning. It uses C++. The parser builds an AST. The calculator
evaluates it. The CLI is a REPL.
```

The first example is concise but comprehensive. The second is repetitive and buries the important links.

**Action:** Write a 1-3 sentence overview of your project. Add reference links to any existing docs.

---

### 2.3 Writing the Quick Start Section (15 min)

**Learning Objectives:**
- Create a fast path for getting the project running
- Know the three essential pieces: build, run, test

**Essential Components:**

1. **Prerequisites:**
   ```
   - CMake 3.10+
   - C++17 compiler
   - Make or Ninja
   ```

2. **Build:**
   ```bash
   mkdir -p build && cd build && cmake .. && cmake --build .
   ```

3. **Run:**
   ```bash
   ./calc-cli
   ```

4. **Test:**
   ```bash
   ctest
   ```

**Best Practices:**

- Make commands **copy-paste ready** — no hidden steps
- Group related commands (don't split build and run into separate sections)
- Assume zero prior knowledge of your toolchain
- If there are gotchas (e.g., "Windows users need Git for Bash"), call them out

**Example:**
````markdown
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

For more details, see [`BUILDING.md`](BUILDING.md).
````

**Action:** Write the Quick Start section for your project. Test that the commands work as written.

---

### 2.4 Writing the Project Structure Section (15 min)

**Learning Objectives:**
- Map out the directory tree with meaningful annotations
- Help readers find code quickly
- Establish conventions by showing where things go

**Best Practice Structure:**

````markdown
## Project Structure

```
src/            — Core library (Parser, Calculator, CLI)
tests/          — Google Test unit tests
main.cpp        — Entry point
CMakeLists.txt  — Build configuration
ARCHITECTURE.md — Detailed design docs
```

**Directory conventions:**
- `src/`: All source code, organized by module
- `tests/`: Mirrors src/ structure; one test file per module
- Root: Build config and documentation only
````

**What to Include:**
- Top-level directories only (don't list every file)
- One-line description of what each folder is for
- Call out important files (entry points, config, key modules)
- Describe naming conventions (e.g., "test files are src.test.cpp")

**What to Omit:**
- Third-party libraries (unless they're critical)
- Build artifacts or compiled output
- Temporary directories (.gitignore'd files)

**Action:** Create a directory tree for your project. Add brief descriptions. Aim for clarity, not completeness.

---

## Module 3: Best Practices & Content Patterns (60 minutes)

### 3.1 Writing "Common Tasks" Section (15 min)

**Learning Objectives:**
- Document workflows developers will need to repeat
- Link to detailed docs instead of duplicating information
- Make CLAUDE.md a navigation hub, not a manual

**Pattern: Task + Link**

```markdown
## Common Tasks

- **Add a new operator** → See [`GOTCHAS.md#add-operator`](GOTCHAS.md#add-operator)
- **Debug an AST** → See [`GOTCHAS.md#debug-ast`](GOTCHAS.md#debug-ast)
- **Use the library in another project** → See [`ARCHITECTURE.md#deployment`](ARCHITECTURE.md#deployment)
```

**Why This Works:**
- CLAUDE.md stays concise (loaded at session start)
- Detailed docs stay in their proper files
- Links are discoverable and tracked in git
- Claude can jump directly to the right doc

**Anti-Pattern:**
```markdown
## How to Add an Operator

1. Open src/calculator.h
2. Find the evaluate() function
3. Add a case for the new operator in the switch statement
4. Also update src/parser.cpp to tokenize it
...
```

(This duplicates information that belongs in GOTCHAS.md or BUILDING.md.)

**Action:** List 3-5 common tasks in your project. Create links to docs (create placeholder docs if needed).

---

### 3.2 Key Design Decisions Section (Optional but Valuable) (15 min)

**Learning Objectives:**
- Capture the "why" behind architectural choices
- Help future developers (including Claude) make consistent decisions
- Prevent repeated questioning of settled decisions

**Why Include This:**

- Prevents Claude from "improving" an intentional design choice
- Helps new team members understand the philosophy
- Becomes invaluable when onboarding new developers

**Pattern: Decision + Rationale**

```markdown
## Key Design Decisions

**Why separate Parser and Calculator?**
- Parser builds the AST, which is a separate concern from evaluation
- Allows for future features like symbolic manipulation, optimization, or printing the AST
- Testable independently

**Why recursive descent parsing?**
- Easy to understand and implement
- Operator precedence is naturally encoded in the recursion depth
- No need for a separate precedence table

**Why AST instead of direct evaluation?**
- More flexible — can inspect, transform, or reuse the AST
- Clearer separation of concerns
```

**Good Characteristics:**
- Short (1-3 sentences per decision)
- Emphasize constraints, not just preference
- Include both benefits and tradeoffs when relevant

**Action:** Identify 2-3 key design decisions in your project. Write one sentence for each explaining the rationale.

---

### 3.3 Linking to Supplementary Docs (15 min)

**Learning Objectives:**
- Organize project documentation hierarchically
- Know what belongs in CLAUDE.md vs. deeper docs
- Create a sustainable documentation structure

**Documentation Hierarchy:**

| File | Purpose | Audience |
|------|---------|----------|
| **CLAUDE.md** | Navigation hub, quick start, overview | Everyone (Claude + humans) |
| **ARCHITECTURE.md** | Data flow, module relationships, design | Developers and code reviewers |
| **BUILDING.md** | Build system, test commands, CI setup | Contributors and CI maintainers |
| **CONVENTIONS.md** | Code style, naming, patterns | Code reviewers |
| **GOTCHAS.md** | Edge cases, common mistakes, workarounds | Developers debugging issues |

**Linking Strategy:**

1. **CLAUDE.md lists the files and their purpose** (see your Overview section with "See also" links)
2. **Each section links to the relevant deeper doc**

Example:
```markdown
## Quick Start

For detailed build configuration, see [`BUILDING.md`](BUILDING.md).

## Common Tasks

- **Add a new operator** → See [`GOTCHAS.md`](GOTCHAS.md)
```

**What If You Don't Have These Files Yet?**
- Start with CLAUDE.md (you're here)
- Add ARCHITECTURE.md next (document the current design)
- Add BUILDING.md for build-specific details
- Add CONVENTIONS.md as style questions come up
- Add GOTCHAS.md when you learn tricky edge cases

**Action:** Map out which supplementary docs your project needs. Create placeholder files (even just a header) so you can link to them.

---

### 3.4 What NOT to Put in CLAUDE.md (15 min)

**Learning Objectives:**
- Keep CLAUDE.md concise and focused
- Recognize what belongs elsewhere
- Avoid information decay and duplication

**Don't Include:**

1. **Code examples longer than 3-4 lines** → Belongs in ARCHITECTURE.md or code comments
2. **Implementation details** → Belongs in source code documentation or ARCHITECTURE.md
3. **Detailed API documentation** → Belongs in header comments or a generated API doc
4. **Team contact info or Slack channels** → Belongs in a team wiki or README
5. **Historical decisions** → Belongs in git commits or ADRs (Architecture Decision Records)
6. **Duplicate info from other docs** → Link instead of repeating

**Example of What to Avoid:**

````markdown
# Don't do this:

## Adding an Operator

The parser has a tokenize() function that looks like this:
```cpp
void Parser::tokenize(const std::string& input) {
    for (char c : input) {
        if (c == '+') tokens.push_back({TokenType::PLUS, "+"});
        else if (c == '-') tokens.push_back({TokenType::MINUS, "-"});
        // ... many more lines ...
    }
}
```

Then you need to update the evaluate() function in calculator.cpp:
```cpp
double Calculator::evaluate(ASTNode* node) {
    if (node->op == '+') return left + right;
    else if (node->op == '-') return left - right;
    // ... many more lines ...
}
```

# Do this instead:

- **Add a new operator** → See [`GOTCHAS.md#add-operator`](GOTCHAS.md#add-operator)
````

The link keeps CLAUDE.md lightweight; detailed implementation belongs in GOTCHAS.md.

**Action:** Review what you've written so far. Remove anything that could be moved to a more specialized doc and replaced with a link.

---

## Module 4: Advanced Topics (45 minutes)

### 4.1 CLAUDE.md for Team Projects (15 min)

**Learning Objectives:**
- Adapt CLAUDE.md for team contexts
- Make it a source of truth for code standards
- Reduce review friction

**Extra Sections for Teams:**

```markdown
## Code Review Checklist

Before submitting a PR, ensure:
- [ ] Follows naming conventions (see CONVENTIONS.md)
- [ ] All operators handled in both Parser and Calculator
- [ ] New functions have inline documentation
- [ ] Tests added for new functionality
- [ ] No division by zero without error handling

## Common Review Comments

If you see "precedence", read GOTCHAS.md#operator-precedence
If you see "memory leak", ensure deleteAST() is called
If you see "inconsistent naming", see CONVENTIONS.md
```

**Team Communication Patterns:**

- **New joiners:** CLAUDE.md is the first stop, not a deep dive
- **Distributed teams:** Documents reduce async communication overhead
- **CI/CD:** Reference CLAUDE.md in pre-commit hooks or linting rules
- **Onboarding:** Point interns or new developers to CLAUDE.md first

**Action:** If you're working in a team, draft a "Code Review Checklist" section for your CLAUDE.md.

---

### 4.2 Keeping CLAUDE.md Fresh (15 min)

**Learning Objectives:**
- Establish practices for maintaining CLAUDE.md
- Know when to update it
- Prevent documentation rot

**Update Triggers:**

| Event | Action |
|-------|--------|
| Architectural change | Update ARCHITECTURE.md, link from CLAUDE.md if needed |
| New convention adopted | Add to CONVENTIONS.md and reference from CLAUDE.md |
| Build system changes | Update BUILDING.md and Quick Start section |
| New gotcha discovered | Add to GOTCHAS.md |
| Project structure changes | Update Project Structure section |

**Best Practices:**

1. **Version-control CLAUDE.md** — review it like code
2. **Update alongside code changes** — if you change architecture, update the docs
3. **Use PR descriptions to suggest doc updates** — reviewers can catch stale docs
4. **Assign ownership** — someone on the team "owns" documentation
5. **Annual review** — once a year, skim all docs and remove outdated info

**Anti-Pattern:**
```
Year 1: CLAUDE.md is great, everyone uses it
Year 2: Architecture changes, CLAUDE.md not updated
Year 3: CLAUDE.md is outdated, nobody trusts it
Year 4: Documentation is completely ignored
```

**Action:** Set a reminder to review your CLAUDE.md every quarter. Note one thing that's likely to go out of date soon.

---

### 4.3 Linking Auto Memory in CLAUDE.md (15 min)

**Learning Objectives:**
- Understand how CLAUDE.md and auto memory work together
- Reference auto memory learnings in your static docs
- Create a cohesive knowledge system

**How They Work Together:**

```
CLAUDE.md (static, you write)        → Set expectations, rules, conventions
Auto memory (dynamic, Claude writes) → Record learnings, corrections, feedback
```

**Example Workflow:**

1. You write in CLAUDE.md: "Always use delete pattern X for memory cleanup"
2. Claude follows it, but finds a gotcha
3. Claude writes to auto memory: "Pattern X fails with circular references—use pattern Y instead"
4. Next session, both CLAUDE.md and auto memory context are loaded
5. You see the memory entry and update CLAUDE.md: "Use pattern Y for circular references"

**When to Reference Auto Memory in CLAUDE.md:**

Rarely! CLAUDE.md is static. But you can add:
```markdown
## Troubleshooting

See auto memory (stored in `/home/user/.claude/projects/...`) for recent debugging
sessions and edge cases discovered during development.
```

**Action:** No action needed yet. This will become relevant once you've worked with your project for a few sessions.

---

## Module 5: Practical Exercise (90 minutes)

### 5.1 Create Your Own CLAUDE.md (60 min)

**Task:** Write a complete CLAUDE.md for your calculator project (or your own project).

**Sections to Include:**

1. ✅ **Overview** (3 sentences max, with "See also" links)
2. ✅ **Quick Start** (build, run, test commands)
3. ✅ **Project Structure** (directory tree with descriptions)
4. ✅ **Common Tasks** (3-5 tasks with links to relevant docs)
5. ⭐ **Key Design Decisions** (optional, but valuable)

**Checklist Before Submitting:**

- [ ] All code blocks are tested and copy-paste ready
- [ ] All links are valid (or linked docs are created)
- [ ] No duplicate information (link instead of repeating)
- [ ] Tone is consistent throughout
- [ ] No more than 100 lines total
- [ ] A new developer could follow "Quick Start" blindfolded

**Time Breakdown:**
- Section 1 (Overview): 10 min
- Section 2 (Quick Start): 15 min
- Section 3 (Project Structure): 10 min
- Section 4 (Common Tasks): 15 min
- Section 5 (Design Decisions): 10 min

---

### 5.2 Create Supplementary Docs (20 min)

**Task:** Create placeholder files for docs referenced in your CLAUDE.md.

**Files to Create:**

```
ARCHITECTURE.md    — Data flow, module structure, deployment (can be expanded later)
BUILDING.md        — Build details, test commands, CI setup (can be expanded later)
CONVENTIONS.md     — Code style, naming, patterns (can be expanded later)
GOTCHAS.md        — Edge cases, common mistakes, workarounds (can be expanded later)
```

**Minimal Template for Each:**

```markdown
# ARCHITECTURE.md

## Data Flow

[Brief description]

## Module Structure

[Modules and their relationships]

## Key Design Decisions

[Why the project is structured this way]
```

(You can expand these later as needed.)

---

### 5.3 Peer Review (10 min)

**If Working in a Team:**

1. Share your CLAUDE.md with a colleague
2. Ask them: "Can you follow the Quick Start commands without help?"
3. Ask them: "Does the Project Structure make sense?"
4. Note their feedback

**If Solo:**

1. Wait a day
2. Read your CLAUDE.md with fresh eyes
3. Ask yourself: "Would I understand this if I hadn't written it?"
4. Make improvements

---

## Module 6: Deep Dives (Optional, Reference Only)

### 6.1 Using `.claude/rules/` for File-Specific Rules

**Advanced Feature:** Scope CLAUDE.md rules to specific file types.

```
.claude/rules/
├── cpp.md      — Rules for .cpp and .h files
├── test.md     — Rules for test files
└── cmake.md    — Rules for CMakeLists.txt
```

**Example `.claude/rules/cpp.md`:**
```markdown
## C++ Convention

- Use `const` by default, `mutable` only when necessary
- Prefer stack allocation over heap allocation
- All functions have a comment describing their contract
```

(This is advanced; focus on CLAUDE.md first.)

---

### 6.2 CLAUDE.md in Multi-Project Repos

**Monorepo Pattern:** Each project has its own CLAUDE.md.

```
repo/
├── CLAUDE.md                  — Root-level project info
├── services/
│   ├── auth-service/
│   │   └── CLAUDE.md         — Auth service specific
│   ├── api-service/
│   │   └── CLAUDE.md         — API service specific
```

Claude Code finds the nearest CLAUDE.md when you cd into a folder.

---

## Assessment

By the end of this lesson plan, you should be able to:

- [ ] Explain what CLAUDE.md is and why it matters
- [ ] Identify the five core sections of a good CLAUDE.md
- [ ] Write an effective overview and quick start
- [ ] Create a directory structure document
- [ ] Link to supplementary docs instead of duplicating info
- [ ] Maintain CLAUDE.md as the project evolves
- [ ] Recognize what doesn't belong in CLAUDE.md

---

## Resources

**Official Claude Code Documentation:**
- [Claude Code Memory System](https://code.claude.com/docs/en/memory)
- [Claude Code Best Practices](https://code.claude.com/docs/en/best-practices.md)
- [Claude Code Common Workflows](https://code.claude.com/docs/en/common-workflows.md)

**Related Topics (Further Learning):**
- [Auto Memory](https://code.claude.com/docs/en/memory.md#auto-memory) — How Claude learns from your corrections
- [Hooks](https://code.claude.com/docs/en/hooks.md) — Automate tasks before/after Claude actions
- [Skills](https://code.claude.com/docs/en/skills.md) — Package repeatable workflows
- [MCP (Model Context Protocol)](https://code.claude.com/docs/en/mcp.md) — Connect external tools and data sources

**Free Courses:**
- [Claude Academy - Claude Code 101](https://academy.claude.com/courses/claude-code-101)
- [Claude Academy - Claude Code in Action](https://academy.claude.com/courses/claude-code-in-action)

---

## Next Steps

1. **Immediate:** Complete Module 5.1 and write your CLAUDE.md
2. **This week:** Share with your team or a colleague for feedback
3. **This month:** Create the supplementary docs (ARCHITECTURE.md, etc.)
4. **Ongoing:** Update CLAUDE.md as your project evolves

---

**Good luck, and happy documenting!** 🚀
