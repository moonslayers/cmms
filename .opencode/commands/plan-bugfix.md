---
description: Planning stage for BUG FIXES. Takes context from /context-gather, performs root cause analysis, and creates a minimal safe fix plan. Use when the requirement is to fix broken behavior. No brainstorming - focus on diagnosis and surgical fix.
---
# /plan-bugfix

## Step 1: Root Cause Analysis
- Delegate to `@analyst` or perform directly:
  - Reproduce the bug (exact steps, inputs, expected vs actual)
  - Trace the execution path from entry point to failure
  - Identify the EXACT line(s) causing the issue
  - Determine WHY it fails (wrong logic, missing null check, race condition, wrong assumption, etc.)
  - Check if the bug exists in multiple places (same pattern elsewhere)
- Output: Clear root cause statement with file/line evidence

### Root Cause Statement Format
```
**Bug**: [One sentence describing the symptom]
**Root Cause**: [Why it happens - technical explanation]
**Location**: [File:line and surrounding context]
**Evidence**: [How we know this is the cause - trace, logs, code path]
**Scope**: [Is this isolated or does the same pattern exist elsewhere?]
```

## Step 2: Fix Strategy Selection
- Evaluate fix approaches (usually 1-2 options):
  - **Minimal fix**: Change only what's broken (preferred for hotfixes)
  - **Defensive fix**: Add guards/validation to prevent similar bugs
  - **Architectural fix**: Redesign if the bug reveals a deeper flaw
- Select based on:
  - Risk of regression (minimal changes = lower risk)
  - Whether the bug indicates a systemic issue
  - Time pressure vs. long-term maintainability
- If the fix touches critical paths, plan for extra testing

### CRITICAL - No Creativity Here
❌ WRONG: "Let's also refactor the whole auth module while we're here"
✅ RIGHT: "Fix the null check in auth.service.ts:42. Note: auth module has tech debt but that's out of scope for this bugfix."

Scope creep in bugfixes is dangerous. Fix the bug, verify the fix, move on.

## Step 3: Task Decomposition

**Task Granularity Rules:**
- Each task has a single clear responsibility
- Bugfix tasks are typically SMALLER than feature tasks
- Always include a verification task

**Task Description Format:**
For each task, specify:
- **WHAT**: The objective and deliverable
- **WHERE**: Specific files/folders to modify
- **DEPENDENCIES**: Which tasks must complete first
- **SUCCESS CRITERIA**: How to verify the task is complete (MUST include "bug no longer reproduces")
- **ASSIGNED AGENT**: Which subagent is best suited
- **RELEVANT SKILLS**: Which skills apply to this task

### Mandatory Tasks for Every Bugfix
1. **Fix implementation**: Apply the root cause fix
2. **Regression test**: Add a test that FAILS before the fix and PASSES after (proves the fix works)
3. **Verification**: Manual or automated verification that the bug is resolved and nothing else broke

### CRITICAL RULE - NO CODE IN TASKS
❌ WRONG: "Change line 42 to `if (user?.id) { ... }`"
✅ RIGHT: "Fix the null reference in auth.service.ts by adding proper null check before accessing user.id"

## Step 4: Dependency Graph
- Build an explicit dependency graph
- Bugfixes are usually SEQUENTIAL (not parallel) because they touch related code
- Example:

```
Group 1: Task A (fix root cause)
Group 2: Task B (add regression test)
Group 3: Task C (verify fix + run full test suite)
```

## Step 5: Plan Presentation
Present the plan to the user with:
- Root cause analysis (from Step 1)
- Fix strategy and rationale (from Step 2)
- Task list with all details from Step 3
- Dependency graph and execution order
- Risk assessment (what could go wrong with this fix)
- Request explicit approval before proceeding

## Exit Criteria
User approves the plan. If rejected, re-analyze root cause or consider alternative fix strategy.

## Anti-Patterns to Avoid
❌ Brainstorming creative solutions (this is not a feature)
❌ Scope creep ("while we're here, let's also...")
❌ Fixing without understanding root cause (shotgun debugging)
❌ Skipping regression tests
❌ Including code in task descriptions
❌ Overly large tasks (bugfixes should be surgical)
