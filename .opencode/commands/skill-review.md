---
description: Post-validation reflection phase focused on skill hygiene. Evaluates opportunities for new skills, identifies outdated skills, and updates the knowledge base. Ensures project-specific knowledge is captured for future sessions to save time and tokens.
---
# /skill-review

## Purpose
Skills are **project-specific knowledge capture**, NOT reusable libraries across different projects. A skill is valuable if it saves time and tokens when working on THIS project again, even if the knowledge is 100% specific to this project.

This ensures project-specific knowledge, decisions, and context learned during the task are stored for future sessions before moving on to skill hygiene review.

## Step 1: Identify New Skill Opportunities

Reflect on the completed work and ask:

**High-Value Skill Candidates:**
- Did we work on a complex module/feature that we might touch again in the future?
- Did we discover non-obvious architecture patterns, file locations, or conventions specific to this project?
- Did we spend significant tokens investigating how something works that we'll need to know again?
- Is there domain-specific business logic that's not obvious from code alone?
- Did we encounter edge cases, workarounds, or project-specific quirks that aren't documented?

**Examples of GOOD skills to create (even if project-specific):**
- `facturas-estructura`: How the invoice module is organized, key files, relationships
- `vencimientos-logic`: How expiration logic works for different request types
- `configuracion-vencimiento-pattern`: The singleton pattern used for configuration in this project
- `reportes-pdf-generation`: How PDF reports are generated in this specific codebase
- `authentication-flow`: The custom authentication flow with its specific quirks

**Examples of skills NOT worth creating:**
- Generic Laravel patterns (already covered by framework documentation)
- Simple CRUD operations with no project-specific complexity
- One-off scripts that won't be maintained

**Decision Framework:**
Ask yourself: "If I need to work on this module again in 2 weeks, would having a skill save me 10+ minutes of investigation?"
- YES → Create the skill
- NO → Skip it

If creating a new skill:
- Propose to user with:
  - Name and scope (e.g., "facturas-estructura: Documents the invoice module architecture")
  - What specific knowledge it captures (file locations, patterns, business logic, quirks)
  - When it should be loaded (e.g., "When working on invoice-related features")
  - Estimated token savings (e.g., "Saves ~5000 tokens per session by avoiding re-investigation")
- **Ask user for approval** before creating

## Step 2: Check Skill Currency

Review skills that were loaded during this session:

**Outdated Information Indicators:**
- Did we encounter file paths or structures that differ from what the skill documented?
- Did we find new patterns/conventions that should be added to existing skills?
- Did the implementation reveal gaps in skill documentation?
- Did we discover edge cases or workarounds not mentioned in skills?

**Update Decision Framework:**
- Minor updates (add a file path, clarify a pattern) → Propose and update
- Major restructuring (skill is fundamentally wrong) → Propose rewrite to user
- Skill is obsolete (feature was removed) → Propose deletion to user

If updates needed:
- Propose specific changes to existing skills
- **Ask user for approval** before updating

## Step 3: Skill Maintenance Actions

Based on user approval:
- Delegate to appropriate agent to create/update skills
- Ensure skills follow standard format:
  - Clear scope and trigger conditions
  - Architecture patterns and file locations
  - Business logic and conventions
  - Common pitfalls and edge cases
  - Examples when helpful

**Skill Quality Checklist:**
- [ ] Scope is specific enough to be useful, broad enough to be reusable within the project
- [ ] File paths and structures are accurate and current
- [ ] Business logic is explained in plain language, not just code
- [ ] Edge cases and quirks are documented
- [ ] Trigger conditions are clear (when should this skill be loaded?)

## Step 4: Summary Report

Provide a summary to the user:
- Skills created (with rationale and estimated token savings)
- Skills updated (with specific changes)
- Skills recommended for deletion (if any)
- Overall skill hygiene assessment

## Exit Criteria
- All skill updates completed (with approval)
- Summary report delivered
- Knowledge base is current and complete

## Anti-Patterns to Avoid
❌ Rejecting skills because they're "project-specific" (that's the whole point!)
❌ Creating skills without user approval
❌ Skipping skill review (this is where knowledge capture happens)
❌ Over-documenting generic patterns (focus on project-specific knowledge)
❌ Creating skills for trivial/simple code (only for complex/non-obvious parts)
❌ Not estimating token savings (helps user understand the value)
