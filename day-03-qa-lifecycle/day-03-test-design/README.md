# Day 3 Practical Assessment — Registration and Checkout

**Programme:** RoBenDevs QA Engineer Internship — 14-Day Foundation Programme  
**Assignment:** Test Design Techniques and Edge Cases  
**Scope:** Written practical assessment; **no slides**  
**Execution status:** **NOT RUN** — test design only

## Assignment requirements

For a registration and checkout flow, design test cases using **Boundary Value Analysis (BVA)**, **Equivalence Partitioning (EP)**, a **Decision Table**, and a **State Transition Diagram**, and include **at least 20 edge cases**.

## Assessment files

| Technique / deliverable | File | Details |
| --- | --- | --- |
| EP, BVA and test-case design | [01-registration-checkout-test-cases.md](01-registration-checkout-test-cases.md) | **18 registration + 24 checkout = 42** proposed cases |
| Decision table and state diagram | [02-decision-table-state-transition.md](02-decision-table-state-transition.md) | **8 coupon rules**, Mermaid state diagram, valid/invalid transitions |
| Edge cases | [../03-qa-advanced.md#5-advanced-edge-case-checklist--25-scenarios](../03-qa-advanced.md#5-advanced-edge-case-checklist--25-scenarios) | **25 cases already documented** in Advanced learning notes; not repeated |

## Illustrative requirements

**No specific application or product requirements were supplied for this assignment.** I used the following **exercise assumptions** to make the test cases measurable. These are **not verified requirements** and must be confirmed before actual testing.

### Registration assumptions

| ID | Rule |
| --- | --- |
| REG-R01 | Name is required and accepts **2–50 Unicode characters** (inclusive) |
| REG-R02 | Email is required, must be syntactically valid, and must not already be registered |
| REG-R03 | Password is required and must be **8–20 characters** (inclusive) |
| REG-R04 | Confirm Password must match Password exactly |
| REG-R05 | Successful registration creates **one** account; invalid submission creates none |

No additional complexity rules are assumed for the password in this example.

### Checkout assumptions

| ID | Rule |
| --- | --- |
| CHK-R01 | Item quantity is a **whole number from 1–10** (inclusive) |
| CHK-R02 | Example unit price is **৳500** for quantity tests |
| CHK-R03 | Valid coupon gives **10% discount** only if subtotal is **at least ৳1,000**, coupon is valid, and user is eligible |
| CHK-R04 | Sample calculations exclude shipping, taxes, and fees; BDT calculations use two-decimal **half-up** rounding at the final monetary rounding step |
| CHK-R05 | Only sandbox payment credentials are used |
| CHK-R06 | Successful payment produces a Paid order; failed payment must not produce a Paid order |
| CHK-R07 | Double clicks and retries must not cause unintended duplicate orders or charges |
| CHK-R08 | Order/payment state changes follow [the state diagram](02-decision-table-state-transition.md) |
| CHK-R09 | Protected checkout actions require an active session |

Subtotal boundary tests may use purpose-built cart fixtures independent of the ৳500 sample unit-price fixture.

## Expected data and environment

- Registration: generate a **fresh unique email** for each test expected to succeed.
- Checkout: dedicated test account, controlled cart fixtures, and **sandbox/test payments only**.
- Before execution, record application URL, browser, build/version, environment, and business-rule confirmation.
- For each executed test, add actual result, PASS/FAIL/BLOCKED, timestamp, and supporting evidence. Do not expose credentials or payment details.

## Completion checklist

- [x] EP and BVA test design for registration and checkout
- [x] Decision table with all 8 two-valued-condition combinations
- [x] Order/payment state transition diagram and transition checks
- [x] More than 20 edge cases (**25 in Advanced notes**)
- [ ] Execute on an assigned application
- [ ] Document actual outcomes and supporting evidence
- [ ] Review with a senior QA

**Conclusion:** The written assessment **design** is prepared. None of these registration/checkout test cases is claimed to have been executed.
