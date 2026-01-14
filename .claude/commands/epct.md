# EPCT: Explore → Plan → Code → Test

Execute a structured development workflow for: $ARGUMENTS

<workflow_context>
This workflow ensures high-quality implementation by preventing assumptions, validating approaches before coding, and verifying correctness through testing. Each phase builds on the previous one.
</workflow_context>

---

## Phase 1: EXPLORE

<phase_instructions>
Thoroughly understand the problem context and existing codebase BEFORE proposing any solution. Never speculate about code you have not read.

**Actions:**
1. Read and analyze all files relevant to the task
2. Identify existing patterns, conventions, and abstractions
3. Map dependencies and understand data flow
4. Note potential edge cases and constraints

**Exploration prompts to answer:**
- What existing code relates to this task?
- What patterns and conventions does the codebase use?
- What dependencies or constraints exist?
- What could go wrong or cause regressions?
</phase_instructions>

<explore_output>
Provide a concise summary of findings:
- Relevant files and their purpose
- Existing patterns to follow
- Identified constraints or risks
- Key decisions that affect implementation
</explore_output>

---

## Phase 2: PLAN

<phase_instructions>
Create a detailed implementation plan before writing any code. The plan should be specific enough that implementation becomes straightforward.

**Plan requirements:**
1. Numbered sequential steps with clear actions
2. Specific files to create or modify
3. Required dependencies or changes
4. Security and performance considerations
5. How to verify each step works
</phase_instructions>

<plan_format>
### Implementation Plan

**Summary:** [One sentence describing the approach]

**Steps:**
1. [Specific action] in `path/to/file`
2. [Specific action] in `path/to/file`
...

**Files to modify:** [List with brief reason]
**New files needed:** [List or "None"]
**Dependencies:** [Any new packages or changes]
**Risks:** [What could go wrong and mitigation]
**Verification:** [How to confirm success]
</plan_format>

<await_approval>
Present the plan and wait for user approval before proceeding to the Code phase. Ask: "Does this plan look good, or would you like me to adjust anything?"
</await_approval>

---

## Phase 3: CODE

<phase_instructions>
Implement the approved plan step by step. Make incremental progress with validation at each step.

**Implementation principles:**
- Follow existing codebase patterns and conventions
- Keep solutions simple and focused on the task
- Do not add features, refactoring, or improvements beyond what was planned
- Do not over-engineer or add unnecessary abstractions
- Validate each step works before proceeding to the next
</phase_instructions>

<avoid_overengineering>
- Do not add error handling for scenarios that cannot happen
- Do not create helpers or utilities for one-time operations
- Do not add comments, docstrings, or type annotations to unchanged code
- Do not add backwards-compatibility shims; change the code directly
- Reuse existing abstractions; do not create new ones unless necessary
</avoid_overengineering>

---

## Phase 4: TEST

<phase_instructions>
Verify the implementation is correct and does not introduce regressions.

**Testing actions:**
1. Run existing tests to check for regressions
2. Add or update tests for new functionality
3. Manually verify the feature works as expected
4. Check edge cases identified during exploration
</phase_instructions>

<test_principles>
- Write tests that verify correct behavior, not just that code runs
- Do not hard-code values that only work for specific test inputs
- Ensure tests are maintainable and follow existing test patterns
- If tests fail, fix the implementation (not the tests) unless tests are incorrect
</test_principles>

---

## Workflow Execution

<execution_rules>
1. Complete each phase fully before moving to the next
2. Track progress explicitly - mark when each phase starts and ends
3. If blocked or uncertain, ask clarifying questions rather than making assumptions
4. Use parallel tool calls when actions are independent
5. Provide brief status updates as you progress through phases
</execution_rules>

Begin with Phase 1: EXPLORE for the task described above.
