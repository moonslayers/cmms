---
description: First stage of the orchestration workflow. Loads relevant skills based on requirement domain, investigates gaps through @explore subagent, and clarifies ambiguities with the user. Produces a complete context summary ready for planning.
---
# /context-gather <requerimiento>

Gathers all necessary context before planning. Do NOT proceed to planning until this stage is complete.

## Step 1: Skill Discovery
- Analyze the requirement to identify relevant domains (e.g., "facturas", "authentication", "reports")
- Load matching skills from the skills directory
- Extract from skills: architecture patterns, file locations, conventions, dependencies
- Document what skills already cover

## Step 2: Gap Analysis
- Compare what skills + user provided vs. what you need to know
- Identify ONLY gaps that cannot be deduced from skills or user input
- Do NOT investigate what you already know

## Step 3: Targeted Investigation
- Delegate to `@explore` with a precise scope:
  - What to investigate (specific files/folders/concepts)
  - What to ignore (already covered by skills)
  - Output format: structured summary, NOT raw file contents
- Receive summarized findings only

## Step 4: Clarification
- Review gathered context for ambiguities or missing decisions
- Ask the user ONLY for:
  - Architectural choices with significant tradeoffs
  - Business logic that cannot be inferred
  - Scope boundaries (what's in/out)
- Do NOT ask for:
  - Trivial details you can decide yourself
  - Implementation specifics
  - Things already covered by skills

## Step 5: Context Summary
Produce a structured summary containing:
- Requirement understanding
- Skills loaded and what they cover
- Key findings from exploration
- Decisions made / clarifications received
- Any remaining assumptions

## Exit Criteria
You have a complete understanding of requirements, constraints, and context. No critical ambiguities remain. Context summary is ready to feed into plan stage.

## Anti-Patterns to Avoid
❌ Investigating what skills already document
❌ Asking user trivial questions
❌ Storing raw file contents (summarize only)
❌ Making architectural decisions without user input when tradeoffs exist
