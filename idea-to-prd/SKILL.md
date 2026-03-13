---
name: idea-to-prd
description: Facilitate a two-phase workflow that turns rough product ideas into a converged requirement and then a solid PRD. Use this skill whenever the user mentions a new feature idea, product idea, workflow improvement, feature request, product requirements document, requirement grooming, requirement discovery, or says they want to design, define, or think through a feature. This skill should trigger even when the user does not explicitly ask for a PRD yet, as long as they are describing a feature they want to build and would benefit from structured product discovery. The default behavior is to start with a short product interview, converge the requirement, and only then generate the PRD.
---

# Idea to PRD

Help the user produce a strong PRD through a two-phase collaboration loop:

1. Phase 1: interview and converge on the requirement
2. Phase 2: generate the PRD once the user confirms the requirement is ready

The core job is not just "write a document." The core job is to reduce ambiguity first, then write a PRD that reflects the decisions made during the conversation.

## Default operating rule

When this skill is invoked, assume the user wants a product manager style collaboration flow:

- If the user is describing an idea, a feature, a workflow change, or a product problem, begin with Phase 1 automatically.
- Do not wait for the user to explicitly say "ask me questions first."
- Only skip or compress Phase 1 when the user already provided a fairly complete requirement, or clearly asks for immediate document generation.
- After the requirement is sufficiently converged, transition into PRD generation naturally by asking for a quick confirmation.

## When to use

Use this skill when the user:

- says things like "I want to build a feature", "I have a product idea", "we want to add a feature", "help me define this workflow", or "let's think through a new capability"
- asks for a PRD, feature brief, product spec, or requirements doc
- wants you to ask follow-up questions before writing
- says their idea is still rough and they want help refining it
- wants to turn a chat, idea dump, or problem statement into a structured PRD
- mentions requirement discovery, requirement convergence, or product scoping in any language

Do not use this skill for purely technical architecture specs unless the user clearly wants a product-facing PRD first.

## High-level behavior

Run the workflow in two explicit phases.

### Phase 1: Interview and convergence

Your goal in this phase is to help the user move from a fuzzy idea to a stable problem statement, target scope, and decision-ready outline.

How to run Phase 1:

- Start by restating the idea in your own words so the user can quickly correct it.
- Treat a casual idea statement as enough reason to begin the interview. Do not ask whether the user wants to start Phase 1 unless there is real ambiguity about intent.
- Ask focused follow-up questions in small batches. Prefer 1-3 questions at a time rather than a giant questionnaire.
- After each user reply, summarize what is now confirmed, what is still assumed, and what remains open.
- Keep the conversation moving toward decisions. Do not ask endless discovery questions once the product shape is already clear.
- If the user does not know an answer, offer 2-3 concrete options with tradeoffs and let them choose.
- Separate confirmed facts from your inferences. Never blur them together.
- If the user already provided enough detail, compress this phase and move toward a readiness check quickly.

Areas to cover during Phase 1:

1. Problem and motivation
2. Target user or persona
3. Core scenario or job-to-be-done
4. Proposed solution shape
5. Scope boundaries and non-goals
6. Constraints, dependencies, and risks
7. Success metrics and rollout intent

Use judgment about ordering. Follow the user's natural flow rather than forcing a rigid script.

### Phase 1 output

Before moving to Phase 2, provide a short convergence summary in this shape:

```md
## Current understanding
- Problem:
- Target users:
- Primary scenario:
- Proposed solution:
- Success signal:

## Assumptions
- ...

## Open questions
1. ...

## Recommended next step
- ...
```

Then ask for explicit confirmation to proceed, for example:

"This feels ready to turn into a PRD. Do you want me to generate the draft now, or do you want one more round of refinement first?"

Do not generate the final PRD until:

- the user explicitly asks for it, or
- the user clearly signals that the requirement is settled

### Phase 2: Generate the PRD

Once the user confirms, generate a complete PRD in Markdown.

The PRD should be decision-friendly and implementation-ready for a product and engineering handoff. Write clearly, avoid buzzwords, and make tradeoffs visible.

## File output behavior

After generating the PRD, save it to the current project's root `docs/` directory by default.

- Default filename: `docs/<feature-slug>-prd.md`
- Build `<feature-slug>` from the PRD title or feature name in kebab-case
- Create the `docs/` directory if it does not exist
- If the user provides a different path, follow the user's instruction instead
- After saving, tell the user the exact file path you wrote
- If there is no clear project root or the environment does not allow writing, explain the issue and provide the Markdown inline as a fallback

When creating a brand new PRD, initialize document tracking metadata near the top of the file:

```md
## Document Metadata
- Original PRD date: YYYY-MM-DD
- Latest update date: YYYY-MM-DD
- Update rule: Unmarked content belongs to the original draft. Incremental changes are explicitly labeled with dates.
```

## Handling follow-up requirements after the PRD exists

Treat later requirement discussions as updates to a living PRD, not as a brand new task by default.

When the user comes back with new information, changed scope, or a new requirement after a PRD already exists:

- First, find and read the existing PRD if its path is known or can be inferred from the project's `docs/` directory
- Summarize what the current PRD says and identify which sections are likely affected
- Run a focused mini-discovery for the delta only: what changed, why it changed, whether this is additive, modifying, or out of scope
- Clarify the impact on users, flows, requirements, acceptance criteria, metrics, risks, and rollout only where the change matters
- Avoid repeating the full Phase 1 interview unless the new information fundamentally changes the product direction

After the change is sufficiently clear:

- Update the existing PRD in place rather than creating a second disconnected PRD unless the user explicitly wants a separate document
- Revise the impacted sections so the document remains internally consistent
- Preserve the original structure and content wherever possible instead of rewriting the whole document from scratch
- Add a short `## Change Log` section near the end if one does not exist yet
- Append a dated bullet summarizing the change, for example: `- 2026-03-13: Added support for scheduled role changes and updated permissions requirements.`
- Update the `Latest update date` field in `## Document Metadata`
- Keep `Original PRD date` unchanged so the baseline version remains visible
- Mark every incremental addition or modification inline with a date so the reader can distinguish original content from later updates
- Prefer these inline annotations:
  - New subsection or paragraph: start with `> Incremental update (YYYY-MM-DD): <what changed>`
  - New bullet or requirement: append `[Added YYYY-MM-DD]`
  - Changed bullet or requirement: append `[Updated YYYY-MM-DD]`
- Do not retroactively tag untouched baseline content line by line; rely on the document metadata rule that unmarked content belongs to the original draft
- Tell the user which sections were updated

If the new request is actually a separate feature rather than a modification:

- Say that it looks like a new PRD candidate
- Briefly explain why
- Offer to either create a separate PRD or fold it into the existing one if the user wants a combined scope

## Writing principles

- Mirror the user's language. If the conversation is in Chinese, write the PRD in Chinese unless they ask otherwise.
- Use the conversation as the source of truth.
- Label assumptions clearly when something is still not fully known.
- Prefer concrete requirements over vague aspirational wording.
- Include edge cases and operational considerations when they materially affect scope.
- Avoid pretending that unresolved questions are settled.

## Required PRD structure

Use this structure unless the user asks for a different template:

```md
# <Feature name>

## Document Metadata
- Original PRD date: YYYY-MM-DD
- Latest update date: YYYY-MM-DD
- Update rule: Unmarked content belongs to the original draft. Incremental changes are explicitly labeled with dates.

## 1. Summary
- One-paragraph overview of the feature and why it matters.

## 2. Problem Statement
- What problem exists today
- Who experiences it
- Why it matters now

## 3. Goals
- Business goals
- User goals

## 4. Non-Goals
- What this PRD intentionally does not cover

## 5. Target Users
- Primary personas or user types
- Relevant context or workflow

## 6. Core User Scenarios
- Primary use cases
- Key edge cases

## 7. Solution Overview
- Proposed product behavior
- UX or flow summary

## 8. Scope
### In scope
- ...

### Out of scope
- ...

## 9. Requirements
### Functional requirements
1. ...

### Non-functional requirements
1. ...

## 10. Acceptance Criteria
- Use checklist bullets or Given/When/Then when helpful

## 11. Metrics and Validation
- Success metrics
- Guardrail metrics
- How we will know this worked

## 12. Dependencies and Constraints
- Teams, systems, policies, timing, or external blockers

## 13. Risks and Open Questions
- Known risks
- Remaining unknowns

## 14. Rollout Plan
- Suggested launch approach, if known

## 15. Change Log
- YYYY-MM-DD: Initial draft created.
```

## Interaction guidelines

- Be collaborative, not interrogative.
- If the user gives scattered notes, synthesize them before asking the next question.
- If multiple product directions are plausible, compare them briefly and recommend one.
- If the user asks for a PRD immediately, do a lightweight readiness pass first. Ask only the minimum high-value clarifications needed.
- If the user's initial prompt is just a rough idea, do not jump into document mode. Start discovery mode automatically.
- If the user returns with a new requirement after a PRD already exists, start with change analysis mode rather than full greenfield discovery.
- If the user wants revisions after Phase 2, update the PRD directly and only reopen discovery if the requested change reveals a real ambiguity.

## Good defaults when the user is unsure

When the user does not know something important, propose a reasonable placeholder and mark it as an assumption. Common examples:

- Target user segments
- Launch scope
- Success metrics
- Non-goals
- Acceptance criteria wording

Prefer progress with explicit assumptions over stalling.

## Example prompts this skill should handle

**Example 1**

Input: "I want to build a bulk repricing tool for operations managers."

Behavior: Automatically enter Phase 1, restate the idea, ask clarifying questions about users, flow, permissions, safeguards, and success criteria, then move toward a PRD when the requirement is stable and save the result under `docs/`.

**Example 2**

Input: "Turn this rough feature idea into a PRD, but ask me follow-up questions until you think the scope is stable."

Behavior: Run the two-phase workflow, only write the PRD after an explicit readiness check, and save the final document under `docs/`.

**Example 3**

Input: "We want to give support agents the ability to view a customer's full conversation history. Help me think through the requirement first."

Behavior: Start Phase 1 automatically, converge the problem, stakeholders, permissions, edge cases, and constraints, then ask whether to generate the PRD and save it under `docs/`.

**Example 4**

Input: "Based on what we discussed above, turn this into a PRD and label any unresolved areas as assumptions."

Behavior: Skip most of Phase 1, do a quick readiness summary, then generate the PRD with labeled assumptions and save it under `docs/`.
