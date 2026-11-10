# Day 3 — Test Design Techniques and Edge Cases

**Programme:** RoBenDevs QA Engineer Internship — 14-Day Foundation Programme  
**Day:** 03  
**Focus:** Black-box test design, structured test cases, and edge-case analysis  
**Progress:** Basic, Intermediate, and Advanced learning notes completed; practical **test design** prepared

## Overview

On Day 3, I learned how to turn user stories, acceptance criteria, and business rules into meaningful test cases. I studied input partitions, boundary conditions, decisions based on multiple rules, changes between workflow states, and unusual data, dates, and user actions.

The goal was to understand **what to test, why it matters, and what evidence to collect**, rather than relying on random testing.

## Learning levels

| Level | Topics covered | Learning note |
| --- | --- | --- |
| **Basic** | Equivalence Partitioning (EP), Boundary Value Analysis (BVA), positive/negative testing, writing test cases | [01-qa-basic.md](01-qa-basic.md) |
| **Intermediate** | Decision tables, state transitions, pairwise testing, error guessing, edge-case checklists | [02-qa-intermediate.md](02-qa-intermediate.md) |
| **Advanced** | Large numbers, decimal precision, currencies, Unicode names/addresses, DST, time zones, leap years, expired sessions, double clicks, refresh, multiple tabs, slow networks | [03-qa-advanced.md](03-qa-advanced.md) |

### Basic — What I learned

- **EP** groups inputs that should produce similar outcomes (valid and invalid partitions).
- **BVA** checks values immediately below, at, and above a minimum or maximum.
- **Positive and negative testing** verify intended operation and rejection of invalid situations.
- **Test cases** include preconditions, steps, test data, and expected results.

**Example:** If a password length must be 8–20 characters, I should test 7, 8, 9, 19, 20, and 21 characters.

### Intermediate — What I learned

- **Decision table:** cover combinations of conditions that change business outcomes.
- **State transition:** test allowed and prohibited moves between states.
- **Pairwise:** reduce configuration combinations while covering each pair of values.
- **Error guessing:** investigate likely failures based on common defect patterns.
- **Edge cases:** test empty, null, zero, negative, maximum length, symbols, emoji, spaces, and copy/paste.

**Example:** A coupon may require a valid code, an eligible user, and a minimum subtotal. Testing each condition individually is not sufficient; the full combination determines the outcome.

### Advanced — What I learned

- **Data risks:** large numbers, decimal and rounding mistakes, currency mismatches, and international text.
- **Time risks:** time zone display, daylight saving changes, leap years, month-end dates, session expiry.
- **User-behaviour risks:** repeated clicks, browser Back, refresh during an operation, concurrent tabs, and network throttling.

**Example:** Repeated Pay clicks must not create unintended duplicate charges. An unexpected action is a test condition—not automatically a confirmed defect.

## Practical assessment — Registration and Checkout

The Day 3 assignment asks me to design tests for registration and checkout using **boundary values, equivalence partitions, a decision table, and a state transition diagram**, plus at least 20 edge cases.

The written assessment is now **inside this Day 3 folder**:

| Assessment deliverable | File |
| --- | --- |
| Scope, sample business rules, traceability and status | [day-03-test-design/README.md](day-03-test-design/README.md) |
| **42 proposed registration/checkout test cases** using EP, BVA and functional checks | [day-03-test-design/01-registration-checkout-test-cases.md](day-03-test-design/01-registration-checkout-test-cases.md) |
| **Eight-rule decision table** and **state transition diagram** with tests | [day-03-test-design/02-decision-table-state-transition.md](day-03-test-design/02-decision-table-state-transition.md) |
| **25 existing advanced edge-case scenarios** (not duplicated) | [03-qa-advanced.md#5-advanced-edge-case-checklist--25-scenarios](03-qa-advanced.md#5-advanced-edge-case-checklist--25-scenarios) |

**Important distinction:** The application and requirements for registration/checkout were not supplied, so the assessment defines **illustrative rules** for test-design practice. All 42 registration/checkout cases are **NOT RUN**. A PASS/FAIL judgment requires execution against an actual application.

## Separate hands-on practice — Jira and Browser DevTools

As a separate learning exercise, I documented login acceptance-criteria checks using the OrangeHRM Demo application and Browser DevTools.

- [Jira QP-2 — User login with email and password](https://g-team-qfw281wn.atlassian.net/browse/QP-2)
- [QP-2 screenshots archive](QP-2_Acceptance_Criteria_Screenshots.zip)

Observed demo checks included successful-login redirection (HTTP 302 followed by dashboard HTTP 200), invalid-credential rejection, required-field messages, and visually masked passwords.

**Scope limitation:** OrangeHRM uses **username** rather than email login and displays **"Invalid credentials"** rather than QP-2's exact expected error text. These demo observations do not prove that QP-2's original email-login acceptance criteria are fully met. They also are not evidence of registration/checkout test execution.

## Additional learning

I also summarized the broader QA learning roadmap, including manual testing, automation tools, browser testing, and CI/CD:

[QA Engineer Roadmap Learning Summary](qa-engineer-roadmap-learning-summary.md)

## Folder structure

```text
day-03-qa-lifecycle/
├── README.md
├── 01-qa-basic.md
├── 02-qa-intermediate.md
├── 03-qa-advanced.md
├── qa-engineer-roadmap-learning-summary.md
├── QP-2_Acceptance_Criteria_Screenshots.zip
└── day-03-test-design/
    ├── README.md
    ├── 01-registration-checkout-test-cases.md
    └── 02-decision-table-state-transition.md
```

## Assessment completion

| Requirement | Status |
| --- | --- |
| EP and BVA for registration and checkout | **Designed** |
| Decision table | **Designed** |
| State transition diagram and checks | **Designed** |
| At least 20 edge cases | **25 documented** in Advanced notes |
| Execute registration/checkout cases | **Not run** |
| Record actual evidence for registration/checkout | **Pending execution** |

## Reflection

Day 3 helped me understand how to write structured tests from requirements, check exact input limits, combine business conditions, model state changes, and anticipate uncommon situations. Good QA means choosing the right scenarios, documenting **expected and actual behaviour separately**, and reporting defects only when evidence supports them.
