---
description: Prepares and executes git commits for the completed implementation. Proposes commit strategy following conventional commits format, splits commits when appropriate, and delegates to @commiter agent. Requires user approval before any git operations.
---
# /commit

## Step 1: Assess Commit Readiness

Check if the implementation is ready to commit:
- All tasks completed successfully
- Validation passed
- No outstanding issues or technical debt
- Tests passing (if applicable)
- Skills updated

If not ready:
- Report what's blocking the commit
- Suggest which stage to re-enter (execute, validate, or skill-review)
- Do NOT proceed

## Step 2: Analyze Changes

Gather information about what changed:
- Files created
- Files modified
- Files deleted
- Skills created/updated (if any)

## Step 3: Propose Commit Strategy

Based on the changes, propose a commit strategy to the user:

**Single Commit Scenarios:**
- Small feature with related files
- Bug fix
- Documentation update
- Skill update

**Multiple Commits Scenarios:**
- Feature + tests + documentation (separate commits)
- Multiple independent features
- Refactoring + feature (separate commits)
- Code changes + skill updates (separate commits)

**Commit Message Format (Conventional Commits):**
```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

Types: feat, fix, docs, style, refactor, test, chore, skill

**Example Proposals:**

Single commit:
```
feat(facturas): add expiration validation for invoice requests

- Implement validation logic based on request type
- Add ConfiguracionVencimiento singleton pattern
- Update invoice service with new validation

Closes #123
```

Multiple commits:
```
1. feat(facturas): add expiration validation logic
2. test(facturas): add tests for expiration validation
3. docs(facturas): update invoice module documentation
4. skill(facturas): document expiration logic patterns
```

## Step 4: User Approval

Present the complete commit plan to the user:
- Number of commits
- Commit messages
- Files included in each commit
- Branch strategy
- Order of commits

**Wait for explicit user approval** before proceeding.

## Step 5: Delegate Commit

If user approves:
- Delegate to `@commiter` with:
  - Commit messages (in order)
  - Files to stage for each commit
  - Branch strategy
  - Any special instructions
- Receive confirmation of successful commits
- Report commit hashes to user

## Step 6: Post-Commit Actions

After successful commit:
- Report commit hashes and messages
- If on a feature branch, remind user about:
  - Pushing to remote
  - Creating a pull request
  - Merging strategy

## Exit Criteria
- Commits completed successfully (or user decided not to commit)
- Commit hashes reported to user
- Next steps communicated (push, PR, etc.)

## Output Format

```markdown
# Commit Summary

## Commit Plan
**Number of commits**: [N]
**Branch**: [branch-name]

### Commit 1
**Message**: [commit message]
**Files**: [list of files]
**Hash**: [commit hash after execution]

### Commit 2
[Continue for all commits...]

## Next Steps
- [ ] Push to remote: `git push origin [branch]`
- [ ] Create pull request
- [ ] [Other relevant actions]
```

## Anti-Patterns to Avoid
❌ Committing without successful /validate
❌ Auto-committing without user approval
❌ Combining unrelated changes in one commit
❌ Writing vague commit messages ("updates", "fixes")
❌ Not splitting commits when appropriate
❌ Forgetting to include skill updates in commits
❌ Not reporting commit hashes to user
