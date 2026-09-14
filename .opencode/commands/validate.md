---
description: Fourth stage of the orchestration workflow. Validates that the combined results from /execute satisfy the original requirement. Identifies bugs, technical debt, and logic errors. Produces a validation report with correction plan if needed.
---
# /validate

## Step 1: Consolidate Results
- Gather all summarized results from changes made
- Build a complete picture of what was implemented
- Ensure you have the original requirement for comparison

## Step 2: Requirement Validation
- Delegate to `@reviewer` subagent with:
  - Original requirement
  - Implementation summary (what was built)
  - List of files created/modified
- Request validation of:
  - Does implementation satisfy the requirement?
  - Are there missing pieces?
  - Does it follow existing patterns (from loaded skills)?

## Step 3: Quality Checks
- Check for:
  - Logic errors in implementation
  - Lint issues (if project has a linter)
  - Compilation errors (if applicable)
  - Test coverage gaps
- Delegate specific checks to appropriate subagents if needed

## Step 4: Technical Debt Analysis
- Identify potential technical debt introduced:
  - Code duplication
  - Poor separation of concerns
  - Missing documentation
  - Violation of existing patterns
- Document findings with specific file/line references

## Step 5: Validation Report
Present to user:
- **Requirement Coverage**: ✓ Complete / ✗ Incomplete (details)
- **Quality Issues**: List of bugs/errors found
- **Technical Debt**: List of concerns with severity ratings
- **Recommendations**: Priority-ordered list of fixes

If issues found:
- Create a correction plan
- Request user approval before proceeding to corrections

## Exit Criteria
- If no issues: Ready to proceed to conclusion stage
- If issues found: User approves correction plan, then re-enter execute stage with fixes

## Anti-Patterns to Avoid
❌ Accepting implementation without verification
❌ Ignoring technical debt in favor of "it works"
❌ Fixing issues without user approval
❌ Not comparing implementation against original requirement
