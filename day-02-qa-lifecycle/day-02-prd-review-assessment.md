# Day 2 — Practical Assessment: Requirements and Testability

**Name:** MD Morshed Jaman  
**Programme:** RoBenDevs QA Engineer Internship — 14-Day Foundation Programme  
**Topic:** Understanding Requirements and Testability  
**Assessment type:** Practice assessment using a hypothetical e-commerce application  
**Submission status:** Draft for learning and review; no real client PRD, Figma design, Jira ticket, or executed test results were provided

> **Evidence boundary:** The RoBenDevs programme specifies this Day 2 exercise but does not contain the sample PRD or Figma designs. I created the sample requirements and screen descriptions below for practice. All observations, suggested rules, and test scenarios are illustrative. Proposed acceptance criteria must be approved by the PM/client before they become official requirements.

## 1. Assessment objective and scope

My goal is to practise reviewing a PRD and design, identifying ambiguous or missing requirements, asking useful clarification questions, rewriting untestable statements, and tracing requirements to planned test cases.

**Practice scope:** Registration, login and password reset, product search, cart, discounts, online payment, cancellation/refunds, roles, performance, and responsive design.

## 2. Sample PRD under review (constructed for this exercise)

| ID | Sample requirement text |
|---|---|
| PRD-01 | Customers should be able to register easily with email and password. |
| PRD-02 | Customers can log in and reset forgotten passwords. |
| PRD-03 | Customers can search products quickly. |
| PRD-04 | Customers can add any quantity of available products to the cart. |
| PRD-05 | Cart totals and discounts must be calculated correctly. |
| PRD-06 | New customers receive a good discount on their first order. |
| PRD-07 | Online payments should be quick and secure, and an order is paid immediately after payment submission. |
| PRD-08 | Customers may cancel any order and receive a refund. |
| PRD-09 | Customers can view their own orders; administrators can manage all orders. |
| PRD-10 | The website should be user-friendly on desktop and mobile. |
| PRD-11 | Shipped orders cannot be cancelled. |
| PRD-12 | Payments may remain pending until the provider confirms the result. |

**Deliberate review challenges:** PRD-08 conflicts with PRD-11; PRD-07's immediate *Paid* wording conflicts with the possible *Pending* state in PRD-12. These are constructed inconsistencies for assessment practice.

### Sample design baseline (not an actual Figma file)

- **DES-01 — Login screen:** Email field, password field, Login button; no visible Forgot Password entry point or error-state design.
- **DES-02 — Product listing:** Search field, product cards, Add to Cart button; no empty-results design or out-of-stock presentation.
- **DES-03 — Checkout:** Order summary, coupon field, Pay button, payment-success screen; no pending/failed payment states, retry flow, or cancellation path.

## 3. Requirement review: gaps, ambiguities, and clarification questions

**Status of all findings:** Open — awaiting hypothetical PM/client clarification. These are review questions, not confirmed software defects.

| ID | PRD / design reference | Problem type | Finding or precise clarification question | Why it matters |
|---|---|---|---|---|
| G-01 | PRD-01 | Untestable wording | What does “register easily” mean? Is there an agreed usability success measure? | No objective pass/fail criterion. |
| G-02 | PRD-01 | Missing rule | Can the same email address be used to create more than one account? | Duplicate registration behaviour is undefined. |
| G-03 | PRD-01 | Missing validation | What are the minimum/maximum password lengths and other password-policy requirements? | Cannot test password boundaries. |
| G-04 | PRD-02 | Missing state/rule | How long does a password-reset link remain valid, and can it be reused? | Expiry and one-time use cannot be tested. |
| G-05 | PRD-02 / DES-01 | Design gap | Where should users start password reset when the login screen has no entry point? | The requirement is not represented in the sample design. |
| G-06 | PRD-03 | Untestable NFR | What measured search response time is required, under what workload and environment? | “Quickly” is subjective. |
| G-07 | PRD-03 / DES-02 | Missing state/design | What should users see when no products match a query? | The empty state is undefined. |
| G-08 | PRD-04 / DES-02 | Missing inventory rule | What happens if a user adds more units than current stock or stock changes before checkout? | Overselling and inconsistent cart states are possible. |
| G-09 | PRD-04 | Missing boundary | Is “any quantity” literally unlimited? What are minimum and maximum allowed values? | Quantity boundaries and error handling are unclear. |
| G-10 | PRD-05 | Missing calculation rules | In which order are product discounts, coupons, tax, and delivery charges applied, and how are amounts rounded? | Totals may differ between cart, checkout, and payment. |
| G-11 | PRD-06 | Untestable wording | What exact discount percentage/amount and cap does “good discount” mean? | Expected savings cannot be calculated. |
| G-12 | PRD-06 | Missing eligibility rule | Is the first order the first created, paid, or completed order? Does a failed/cancelled order affect eligibility? | Discount eligibility is ambiguous. |
| G-13 | PRD-07 | Untestable NFR | Which security controls must payment and order-data access satisfy? | “Secure” cannot be treated as one test. |
| G-14 | PRD-07 / PRD-12 / DES-03 | Contradiction + missing design | Should submission immediately mark an order Paid, or can it stay Pending until gateway confirmation? What UI appears while Pending? | Incorrect paid statuses could cause fulfilment errors. |
| G-15 | PRD-07 / DES-03 | Missing failure handling | How must declined, timed-out, retried, or double-submitted payments behave? | Duplicate charges or false order completion could occur. |
| G-16 | PRD-08 / PRD-11 | Contradiction | Can *any* order be cancelled, or are Shipped orders explicitly excluded? What about Delivered orders? | Conflicting cancellation rules. |
| G-17 | PRD-08 | Missing refund rule | When is a refund initiated, through which method, and how are partial refunds/fees handled? | Refund results cannot be verified. |
| G-18 | PRD-09 | Missing authorization details | Can admins view all orders while customers can only view their own? How should unauthorized API requests be rejected? | Data-access boundaries need explicit acceptance criteria. |
| G-19 | PRD-10 | Untestable/design coverage | Which devices, viewport widths, and browsers must be supported? Are mobile screens provided? | “Mobile-friendly” lacks an agreed scope. |
| G-20 | PRD-10 / DES-01–03 | Missing accessibility criteria | Which accessibility requirements apply to forms, errors, focus, keyboard interaction, and contrast? | Accessibility cannot be verified consistently. |

**Summary:** 20 documented questions/gaps, including two explicit contradictions, missing system states, untestable quality statements, and design gaps. No findings have been validated against a real client document.

## 4. Design review against the sample PRD

| Review ID | Requirement | What the sample screen shows | Observed mismatch / question | Next action |
|---|---|---|---|---|
| DR-01 | PRD-02: password reset | DES-01 lacks reset entry point | How does a user navigate to recovery? | Ask PM/designer; update design. |
| DR-02 | PRD-02: login | DES-01 lacks validation/error states | How are invalid credentials and field errors displayed? | Define and design error states. |
| DR-03 | PRD-03: product search | DES-02 shows only product results | What happens for zero results? | Add an agreed empty state. |
| DR-04 | PRD-04: available products | DES-02 does not show out-of-stock state | Can users attempt to add unavailable stock? | Agree inventory behaviour and UI. |
| DR-05 | PRD-07/12: payment outcomes | DES-03 shows only success | How are Pending, Failed, and Retry represented? | Confirm payment state model; update designs. |

**Important:** A design difference is a clarification/review finding, not automatically a confirmed implementation bug.

## 5. Proposed rewrites: testable acceptance criteria

The criteria below are **example proposals**, not approved product requirements. Numeric limits and policies are deliberately explicit so they are testable; a PM/client must confirm or replace them.

### AC-01 — Duplicate registration prevention (PRD-01)

```gherkin
Given an active account already exists with email "customer@example.test"
When another registration is submitted using the same normalized email
Then the second registration must be rejected
And no duplicate account must be created
```

### AC-02 — Password length boundaries (PRD-01)

**Proposed policy:** Password length 8–64 characters; other approved password rules must also pass.

```gherkin
Given I am completing the registration form
When I enter a password shorter than 8 or longer than 64 characters
Then the form must reject the password
And display an appropriate validation message
```

### AC-03 — Password-reset token expiry (PRD-02)

**Proposed policy:** Reset links expire after 30 minutes and cannot be reused.

```gherkin
Given a password-reset link was issued more than 30 minutes ago
When I attempt to use the link
Then the reset request must be rejected
And the password must remain unchanged
```

### AC-04 — No-result search behaviour (PRD-03)

```gherkin
Given the product catalogue contains no match for my search query
When I submit the query
Then the search page must display an empty-results message
And must not show unrelated products as matching results
```

### AC-05 — Stock restriction (PRD-04)

```gherkin
Given a product has 2 units available
When I attempt to add a quantity of 3 to my cart
Then the system must reject the excess quantity
And indicate that only 2 units are available
```

### AC-06 — Cart quantity limit (PRD-04)

**Proposed policy:** Per-item quantity is an integer from 1 to 10, subject to available stock.

```gherkin
Given an available product is in my cart
When I set its quantity to 0, -1, 11, or a non-integer value
Then the cart must reject the invalid quantity
And preserve a valid cart state
```

### AC-07 — First-order discount calculation (PRD-05/06)

**Proposed policy:** 10% discount for an eligible customer's first successfully paid order, capped at BDT 500, not stackable with another coupon.

```gherkin
Given I am eligible for the first-order discount
And my eligible product subtotal is BDT 1,000
When I apply the first-order discount at checkout
Then the discount must equal BDT 100
And the final amount must include any separately defined taxes and delivery fees
```

### AC-08 — Payment confirmation before Paid status (PRD-07/12)

```gherkin
Given an order is unpaid
When the payment provider has not yet confirmed a successful payment
Then the order must not be marked Paid
When the payment provider confirms payment success
Then the order must transition to Paid exactly once
```

### AC-09 — Failed payment handling (PRD-07)

```gherkin
Given an unpaid order is ready for checkout
When a sandbox payment method returns a declined-payment result
Then the order must remain unpaid
And a clear payment-failure message must be displayed
```

### AC-10 — Duplicate payment submission (PRD-07)

```gherkin
Given a customer has an unpaid order
When the same payment submission is retried or submitted twice
Then the system must not create duplicate successful charges for that order
And the final order/payment state must remain consistent
```

### AC-11 — Cancellation state restriction (PRD-08/11)

**Proposed policy:** Pending and Paid orders may be cancelled; Shipped and Delivered orders cannot be cancelled through customer self-service.

```gherkin
Given my order status is Shipped
When I attempt to cancel it
Then the cancellation request must be rejected
And the order status must remain Shipped
```

### AC-12 — Search performance (PRD-03)

**Proposed measurement:** In a defined test environment and dataset, with a workload of 100 concurrent virtual users, at least 95% of search API requests complete within 2 seconds.

**Verification:** Run an agreed performance test; calculate the 95th-percentile response time and compare it against 2 seconds. The test duration, load pattern, environment and data must be agreed before execution.

### AC-13 — Order authorization (PRD-09)

```gherkin
Given I am authenticated as Customer A
And an order belongs to Customer B
When I request Customer B's order through the API
Then access must be denied
And Customer B's order details must not be returned
```

### AC-14 — Mobile layout (PRD-10)

**Proposed coverage:** At an agreed 360 CSS-pixel-wide viewport, the login, listing and checkout screens keep primary actions available without unintended horizontal page scrolling; important text and controls remain usable. Other viewport and accessibility criteria require approval.

## 6. Initial Requirements Traceability Matrix (RTM)

**Status legend:** `Draft` = proposed AC not yet PM-approved; `Not Run` = no application testing was performed. Bug IDs remain empty because no real defects were observed or logged.

| Requirement ID | Planned acceptance criteria | Planned test cases | Clarification links | Approval | Execution | Jira defect |
|---|---|---|---|---|---|---|
| PRD-01 Registration | AC-01, AC-02 | TC-001, TC-002 | G-01–G-03 | Draft | Not Run | — |
| PRD-02 Login/reset | AC-03 | TC-003 | G-04, G-05, DR-01, DR-02 | Draft | Not Run | — |
| PRD-03 Search | AC-04, AC-12 | TC-004, TC-013 | G-06, G-07, DR-03 | Draft | Not Run | — |
| PRD-04 Cart | AC-05, AC-06 | TC-005, TC-006 | G-08, G-09, DR-04 | Draft | Not Run | — |
| PRD-05 Calculations | AC-07 (partial) | TC-007 | G-10 | Draft | Not Run | — |
| PRD-06 First-order discount | AC-07 | TC-007 | G-11, G-12 | Draft | Not Run | — |
| PRD-07 Payments | AC-08, AC-09, AC-10 | TC-008, TC-009, TC-010 | G-13–G-15, DR-05 | Draft | Not Run | — |
| PRD-08 Cancellation/refunds | AC-11 (cancellation only) | TC-011 | G-16, G-17 | Draft | Not Run | — |
| PRD-09 Order permissions | AC-13 | TC-012 | G-18 | Draft | Not Run | — |
| PRD-10 Responsive/usability | AC-14 (partial) | TC-014 | G-19, G-20 | Draft | Not Run | — |
| PRD-11 Shipped cancellation | AC-11 | TC-011 | G-16 | Draft | Not Run | — |
| PRD-12 Pending payments | AC-08 | TC-008 | G-14, DR-05 | Draft | Not Run | — |

**Known coverage gaps:** Refund timing and handling, complete tax/rounding logic, security controls beyond order authorization, full accessibility acceptance criteria, and supported browser/device coverage still need PM decisions and additional ACs/test cases. A mapped test does not necessarily mean full requirement coverage.

## 7. Two sample test cases (design only)

### TC-009 — Declined sandbox payment does not mark an order as Paid

- **Linked requirement:** PRD-07
- **Linked acceptance criterion:** AC-09
- **Preconditions:** An unpaid order exists in an approved test environment; a payment sandbox is available.
- **Test data:** Provider-approved simulated declined-payment method.
- **Steps:** Open checkout → select the sandbox decline method → submit payment → inspect order status.
- **Expected:** An appropriate decline message is shown; the order remains unpaid; no successful charge is recorded.
- **Execution:** Not Run.

### TC-012 — Customer cannot access another customer's order

- **Linked requirement:** PRD-09
- **Linked acceptance criterion:** AC-13
- **Preconditions:** Test users A and B exist; B owns a test order; A has a valid customer session.
- **Steps:** Authenticate as A → request B's order ID through the application/API → inspect response and access.
- **Expected:** Access is denied and B's order details are not exposed.
- **Execution:** Not Run.

## 8. Questions to resolve before approval

I would prioritize PM clarification of: (1) payment state and duplicate-charge protections; (2) order cancellation/refund policy; (3) discount eligibility and total calculation; (4) account and data authorization; and (5) measurable performance and accessibility expectations. After answers are approved, I would revise the PRD and Figma designs, finalize acceptance criteria, expand test cases, update the RTM, and obtain QA review.

## 9. My assessment reflection

In this practice exercise, I learned how a requirement that sounds understandable can still contain important gaps. I identified 20 questions across business rules, missing states, contradictions, non-functional requirements, and design coverage. I practised turning ambiguous statements into observable acceptance criteria and linking requirements to planned tests using an RTM. I also understood that identifying a question is different from confirming a product bug: unclear rules must first be resolved with the PM or an authorized stakeholder.

I have **not** reviewed a real RoBenDevs client PRD or Figma design, executed the example tests, or raised Jira defects as part of this document.

## References

1. *RoBenDevs QA Engineer Internship — 14-Day Foundation Programme*, Day 2 (official assignment and topic list).
2. [Atlassian — User Stories](https://www.atlassian.com/agile/project-management/user-stories)
3. [Atlassian — Product Requirements](https://www.atlassian.com/agile/product-management/requirements)

---

**Assessment coverage checklist:** Sample PRD ✓ · Sample screen descriptions ✓ · 20 gaps/questions ✓ · 5 design findings ✓ · 14 proposed acceptance criteria ✓ · Initial RTM ✓ · 2 sample test cases ✓ · Remaining clarification list ✓
