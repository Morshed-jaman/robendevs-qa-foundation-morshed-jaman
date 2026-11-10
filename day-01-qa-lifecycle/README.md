# Day 02 — Understanding Requirements & Testability

**Programme:** RoBenDevs QA Engineer Internship — 14-Day Foundation Programme  
**Level:** Basic → Intermediate → Advanced  
**Focus:** Reviewing requirements critically and turning them into testable behaviour.

## What I Learned

I learned that **reading a PRD is not enough**. As a QA engineer, I need to identify unclear, incomplete, contradictory, or untestable requirements and raise precise questions before development and testing proceed.

### Basic
- Read a **PRD** by examining goals, users, scope, features, and non-functional requirements.
- Understand **user stories** and **acceptance criteria**, including **Given / When / Then**.
- Rewrite vague requirements as clear, measurable, testable statements.
- Review **Figma designs** against approved requirements and identify missing UI states or interactions.

### Intermediate
- Identify **gaps, contradictions, missing states, and undefined business rules**.
- Ask specific **clarification questions** to the PM and track the approved answers.
- Use a **Requirements Traceability Matrix (RTM)** to link requirements, test cases, execution status, and defects.
- Recognize **implicit requirements** without treating assumptions as approved requirements.

### Advanced
- Analyze **business rules** for validation, permissions, calculations, and workflow states.
- Convert vague **non-functional requirements** such as “fast” and “secure” into measurable or objectively verifiable criteria.
- Perform **impact analysis** to understand which related features may need regression testing after a change.

## Practical Assessment — Sample E-commerce Application

I prepared a **hypothetical PRD review exercise** covering registration, login, search, cart, payments, discounts, cancellation, and refunds. It illustrates how to document requirement questions, rewrite acceptance criteria, and begin an RTM.

**Important:** This is practice material, **not** a verified review of a RoBenDevs client's PRD or Figma designs. The design issues and test IDs are examples; actual project findings must be validated against supplied artifacts.

## Files

| File | Contents |
| --- | --- |
| [01-qa-basic.md](./01-qa-basic.md) | PRD, user stories, acceptance criteria, testability, and Figma review |
| [02-qa-intermediate.md](./02-qa-intermediate.md) | Requirement review, PM questions, RTM, and implicit requirements |
| [03-qa-advanced.md](./03-qa-advanced.md) | Business rules, non-functional requirements, and impact analysis |
| [day-02-prd-review-assessment.md](./day-02-prd-review-assessment.md) | Sample PRD review, gaps, acceptance criteria, and RTM |
| [missing_states_diagram.png](./missing_states_diagram.png) | Example of identifying missing workflow states |
| [RTM_relation.png](./RTM_relation.png) | Requirement → test case → result → defect traceability |

## Key Takeaway

**My main learning:** Good requirement analysis helps prevent defects before code is written. I should ask the right questions, confirm business expectations, and maintain traceability instead of making assumptions.

## References

- [Atlassian — User Stories](https://www.atlassian.com/agile/project-management/user-stories)
- [Atlassian — Product Requirements](https://www.atlassian.com/agile/product-management/requirements)
- RoBenDevs QA Engineer Internship — 14-Day Foundation Programme, Day 2
