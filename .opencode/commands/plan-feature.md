---
description: Planning stage for NEW FEATURES. Takes context from /context-gather, brainstorms solution approaches, and creates a granular execution plan. Use when the requirement is to build something new.
---
# /plan-feature

## Step 1: Brainstorming
- Delegate to `@brainstorm` with:
  - Requirement summary
  - Context from /context-gather stage (skills + exploration summary)
  - Constraints and preferences
- Request: 2-3 viable solution approaches with pros/cons/tradeoffs

## Step 2: Solution Selection
- Evaluate options against:
  - Alignment with existing architecture (from skills)
  - Complexity vs. benefit
  - Technical debt implications
  - Maintainability
- Select the best option OR present options to user if tradeoffs are significant

## Step 3: Task Decomposition

**Task Granularity Rules:**
- Each task has a single clear responsibility
- Tasks can span multiple files if they form a cohesive unit (e.g., "Create user form with its service and types")
- Tasks should be completable in one focused session
- Avoid atomic tasks (1 file = 1 task) unless truly independent

**Task Description Format:**
For each task, specify:
- **WHAT**: The objective and deliverable
- **WHERE**: Specific files/folders to create or modify
- **DEPENDENCIES**: Which tasks must complete first
- **PARALLELISM**: Can this run in parallel? With which tasks?
- **SUCCESS CRITERIA**: How to verify the task is complete
- **ASSIGNED AGENT**: Which subagent is best suited
- **RELEVANT SKILLS**: Which skills apply to this task

### CRITICAL RULE - NO CODE IN TASKS
❌ WRONG: "In line 30 of user-form.tsx, add this code: `const handleSubmit = async () => { ... }`"
✅ RIGHT: "Create user-form.tsx with a form component that handles user registration, including validation and submission to user.service"

The subagent's job is to write the code. Your job is to specify WHAT to build and WHERE. Never write the HOW.

## Step 4: Dependency Graph
- Build an explicit dependency graph
- Identify tasks with no mutual dependencies → parallel groups
- Define sequential order of parallel groups
- Example:

```
Group 1 (parallel): Task A (types), Task B (API client)
Group 2 (after Group 1): Task C (service using A+B)
Group 3 (parallel): Task D (UI component), Task E (tests for C)
```

## Step 5: Plan Presentation
Present the plan to the user with:
- Solution summary (from Step 2)
- Task list with all details from Step 3
- Dependency graph and execution order
- Estimated parallelism benefits
- Request explicit approval before proceeding to execute stage

## Exit Criteria
User approves the plan. If rejected, suggest user to return to /context-gather stage or re-brainstorm.

## Anti-Patterns to Avoid
❌ Including code in task descriptions
❌ Overly atomic tasks
❌ Vague tasks without scope or location
❌ Skipping user approval
❌ Skipping brainstorm when multiple valid approaches exist
