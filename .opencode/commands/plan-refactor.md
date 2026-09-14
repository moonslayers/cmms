---
description: Planning stage for REFACTORING. Takes context from /context-gather, analyzes technical debt and code smells, and creates an incremental safe refactor plan. Use when the requirement is to improve code structure without changing behavior.
---
# /plan-refactor

## Step 1: Technical Debt & Code Smell Analysis
- Delegate to `@analyst` or perform directly:
  - Identify the specific code smells / debt to address
  - Quantify the problem (how many files affected, complexity metrics, duplication %)
  - Document WHY this needs refactoring (maintainability, performance, testability, etc.)
  - Identify constraints (what MUST NOT change - public APIs, behavior, etc.)
- Output: Clear problem statement with evidence

### Problem Statement Format
```
**Code Smell/Debt**: [What's wrong - e.g., "God class with 800 lines", "Duplicated validation logic in 12 files"]
**Impact**: [Why it matters - e.g., "Hard to test, changes require touching 5 files"]
**Scope**: [Files/modules affected]
**Constraints**: [What must be preserved - e.g., "Public API must remain unchanged"]
**Goal**: [What success looks like after refactor]
```

## Step 2: Refactor Strategy Selection
- Choose the appropriate refactor strategy:
  - **Extract Method/Class**: Break down large units
  - **Strangler Fig**: Gradually replace old with new
  - **Branch by Abstraction**: Introduce abstraction layer, migrate incrementally
  - **Parallel Change**: Build new alongside old, switch over, delete old
  - **Inline/Remove Abstraction**: Simplify over-engineered code
- Evaluate based on:
  - Risk (how likely to break existing behavior)
  - Incrementality (can we ship intermediate states?)
  - Reversibility (can we roll back if it goes wrong?)
  - Test coverage (do we have tests to catch regressions?)

### CRITICAL - Refactor ≠ Rewrite
❌ WRONG: "Let's rewrite the entire auth module from scratch"
✅ RIGHT: "Extract validation logic from auth.service into a separate validator module, keeping the same public API"

Refactoring preserves behavior. If behavior changes, it's a feature, not a refactor.

## Step 3: Task Decomposition

**Task Granularity Rules:**
- Refactor tasks must be INCREMENTAL and SAFE
- Each task should leave the codebase in a WORKING state
- Prefer many small safe steps over one big risky change
- Each task should be independently testable

**Task Description Format:**
For each task, specify:
- **WHAT**: The objective and deliverable
- **WHERE**: Specific files/folders to modify
- **DEPENDENCIES**: Which tasks must complete first
- **SUCCESS CRITERIA**: How to verify (MUST include "all existing tests still pass")
- **ROLLBACK PLAN**: How to undo if something breaks
- **ASSIGNED AGENT**: Which subagent is best suited
- **RELEVANT SKILLS**: Which skills apply to this task

### Mandatory Tasks for Every Refactor
1. **Test coverage check**: Ensure existing tests cover the code being refactored (add tests if needed BEFORE refactoring)
2. **Refactor implementation**: Apply the refactor in small safe steps
3. **Regression verification**: Run full test suite, verify behavior unchanged
4. **Cleanup**: Remove dead code, old abstractions, temporary shims

### CRITICAL RULE - NO CODE IN TASKS
❌ WRONG: "Extract lines 50-150 into a new class UserService with these methods: ..."
✅ RIGHT: "Extract user-related logic from auth.service into a dedicated user.service module, maintaining the same public API"

## Step 4: Dependency Graph
- Build an explicit dependency graph
- Refactors are usually SEQUENTIAL with careful ordering
- Identify "safe points" where you can stop and ship
- Example:

```
Group 1: Task A (add tests for existing behavior)
Group 2: Task B (extract validator module)
Group 3: Task C (migrate auth.service to use new validator)
Group 4: Task D (remove old validation code from auth.service)
Group 5: Task E (verify all tests pass, cleanup)
```

### Safe Points
Mark tasks where the codebase is in a fully working state:
- After Task A: ✅ Safe to stop (just added tests)
- After Task B: ✅ Safe to stop (new module exists but not used yet)
- After Task C: ⚠️ Migration in progress (don't stop here)
- After Task D: ✅ Safe to stop (migration complete)

## Step 5: Plan Presentation
Present the plan to the user with:
- Technical debt analysis (from Step 1)
- Refactor strategy and rationale (from Step 2)
- Task list with all details from Step 3
- Dependency graph and execution order
- Safe points where you can stop and ship
- Risk assessment (what could break, rollback plan)
- Request explicit approval before proceeding

## Exit Criteria
User approves the plan. If rejected, reconsider strategy or scope.

## Anti-Patterns to Avoid
❌ Big bang rewrites (always incremental)
❌ Changing behavior during refactor (that's a feature)
❌ Refactoring without tests (flying blind)
❌ Skipping safe points (always leave code working)
❌ Including code in task descriptions
❌ Overly large tasks (refactors should be surgical and reversible)
❌ No rollback plan
