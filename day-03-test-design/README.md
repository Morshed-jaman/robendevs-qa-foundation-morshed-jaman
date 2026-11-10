# Day 3 — Practical Assessment: Test Design Techniques and Edge Cases

**Programme:** RoBenDevs QA Engineer Internship — 14-Day Foundation Programme  
**Day:** 3 — Test Design Techniques and Edge Cases  
**Assessment:** Registration and Checkout Flow  
**Prepared by:** MD Morshed Jaman  
**Document status:** Test design completed; test execution **Not Run**

## 1. Objective

The Day 3 practical assignment requires test design for **registration and checkout** using:

1. Equivalence Partitioning (EP)
2. Boundary Value Analysis (BVA)
3. A **decision table** covering combinations of business conditions
4. A **state transition diagram** covering allowed and disallowed transitions
5. A list of **at least 20 edge cases**

This folder contains the written practical assessment. CP-1 slides are **excluded from this submission**.

## 2. Deliverables

| File | Contents |
| --- | --- |
| [01-registration-checkout-test-cases.md](01-registration-checkout-test-cases.md) | 42 designed test cases, equivalence classes, boundary values, steps, test data and expected results |
| [02-decision-table-state-transition.md](02-decision-table-state-transition.md) | Eight-rule coupon decision table, executable test examples, Mermaid state diagram and transition coverage |
| [03-edge-case-checklist.md](03-edge-case-checklist.md) | 30 edge-case scenarios covering data, time and unexpected user behaviour |

## 3. Source and scope

The RoBenDevs Day 3 syllabus names the required **testing techniques and deliverables**, but does **not** give a particular registration/checkout application, PRD, URL or actual field limits. Therefore, I explicitly define illustrative requirements below so that the test cases have measurable outcomes.

**These assumptions are for design practice, not confirmed requirements of a real application.** Before execution, clarify them with the assigned Product Owner or senior QA.

### Assumed registration requirements

| ID | Requirement used for this exercise |
| --- | --- |
| REG-R01 | Name is required; **2–50 Unicode characters**, inclusive |
| REG-R02 | Email is required; must be syntactically valid and unique |
| REG-R03 | Password is required; **8–20 characters**, inclusive |
| REG-R04 | Confirm Password is required and must exactly match Password |
| REG-R05 | A valid registration creates **one** account; invalid submission creates none |
| REG-R06 | Duplicate submissions must not create duplicate accounts |

The example assumes no additional complexity rules (such as special-character or uppercase requirements). Real rules must be obtained from the product documentation.

### Assumed checkout requirements

| ID | Requirement used for this exercise |
| --- | --- |
| CHK-R01 | Product quantity must be a **whole number from 1 to 10**, inclusive |
| CHK-R02 | Example product price: **৳500/unit**; subtotal = price × quantity |
| CHK-R03 | A **10% coupon** applies only when subtotal is **at least ৳1,000**, coupon is valid, and user is eligible |
| CHK-R04 | Discount calculated from subtotal; example totals exclude shipping, taxes and fees |
| CHK-R05 | BDT calculations display **two decimals**, with half-up rounding at the final monetary rounding step in this exercise |
| CHK-R06 | Successful sandbox payment creates one Paid order; unsuccessful payment does not create a Paid order |
| CHK-R07 | Rapid clicks, refresh, and retries must not create unintended duplicate charges |
| CHK-R08 | Payment processing and order statuses follow the transition diagram in document 02 |
| CHK-R09 | Protected checkout actions require an active authenticated session |

Subtotal coupon boundary cases may use purpose-built cart fixtures independent of the ৳500 single-item example.

## 4. Testing environment and prerequisites

**Application URL:** Not provided / To be assigned  
**Browser/build:** To be recorded on execution  
**Test accounts:** Disposable accounts with unique addresses  
**Payment method:** Test/sandbox environment only  
**Evidence:** Screenshots, relevant sanitized Network responses, transaction/order status, Jira defect links

**Do not use real payments or production credentials in this exercise.**

## 5. Test design versus test execution

All cases in this folder are **proposed tests**. Their expected results are based on the illustrative requirements above. **No registration or checkout application was executed** for this assessment. The earlier OrangeHRM/Jira QP-2 login exercise is separate and must not be presented as execution of these scenarios.

When an application is assigned, add for each case: execution date, environment/build, Actual Result, PASS/FAIL/BLOCKED, and evidence.

## 6. Submission checklist

- [x] Registration equivalence partitions and boundary cases
- [x] Checkout equivalence partitions and boundary cases
- [x] Decision table for business-rule combinations
- [x] State transition diagram and valid/invalid transitions
- [x] At least 20 edge cases (**30 provided**)
- [x] Expected results and test data documented
- [ ] Execute cases on an assigned application
- [ ] Attach real execution evidence and Jira defects, if required
- [ ] Obtain senior QA review

**Scope of this submission:** Written Day 3 assessment only, **without slides**.
