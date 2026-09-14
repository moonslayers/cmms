---
description: Third stage of the orchestration workflow. Takes the approved plan from /plan and delegates tasks to subagents in dependency order, respecting parallel groups. Collects summarized results and reports progress to the user.
---
# /execute

## Step 1: Load Execution Plan
- Load the approved plan from context
- Identify parallel groups and sequential dependencies
- Prepare delegation templates

## Step 2: Execute Tasks

For each parallel group, in sequence:

### 2.1 Prepare Delegation
For each task in the group, create a clear delegation message containing:
- **Subagent**: The assigned agent (e.g., `@implement`, `@explore`)
- **Task**: The exact task description from the plan
- **Instructions**: Specific guidance and constraints (no code, only WHAT and WHERE)
- **Skills**: Which skills the subagent should load
- **Tools**: Recommended tools for the task
- **Success Criteria**: What constitutes completion

### 2.2 Delegate in Parallel
- Send delegation messages to all subagents in the current group simultaneously
- Wait for all subagents in the group to complete before proceeding
- Do NOT delegate tasks from a dependent group until their dependencies are complete

### 2.3 Collect Results
- Receive summarized results from each subagent
- Store only:
  - Task completion status (success/partial/failed)
  - Files created/modified (paths only)
  - Key decisions made by subagent
  - Any blockers or issues encountered
- Do NOT store raw code or verbose outputs

## Step 3: Progress Reporting
- After each group completes, report to user:
  - Which tasks completed
  - Any issues or blockers encountered
  - Next group to execute (if any)
- Request continuation if issues arise

## Step 4: Handle Failures
If a task fails:
- Delegate investigation to `@explore` to understand the failure
- Propose a recovery plan to the user
- Wait for user approval before re-executing
- Do NOT auto-retry without understanding the root cause

## Exit Criteria
All tasks in the plan are complete and successful. Results are summarized and ready for /skill-review.

## Anti-Patterns to Avoid
❌ Executing dependent tasks before their dependencies complete
❌ Storing raw code in orchestrator context (only store summaries)
❌ Auto-retrying failures without investigation
❌ Not reporting progress to user between groups
