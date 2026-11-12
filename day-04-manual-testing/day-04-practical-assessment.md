# Day 4 — Practical Assessment: Manual & Exploratory Testing

**Name:** MD Morshed Jaman  
**Programme:** RoBenDevs QA Engineer Internship — 14-Day Foundation Programme  
**Day / Level:** Day 04 — Practical Assessment  
**Topic:** Test Planning, Manual Execution, Exploratory Testing, Jira/Xray and Evidence Reporting  
**Prepared on:** 12 November 2026  
**Assessment status:** **DRAFT — required registration/checkout execution and both exploratory sessions are still pending**

> **Evidence integrity:** These notes distinguish completed **Jira/Xray setup**, a separate **broken-image practice investigation**, and **planned** registration/checkout testing. A written test case or an Xray Test Execution is not proof that its steps were executed. Do not change NOT RUN to PASS/FAIL before performing and recording the test.

## 1. Assessment Objectives and Official Deliverables

Day 4 converts the test cases I designed in Day 3 into practical testing with actual observations, status and evidence. According to the RoBenDevs Day 4 task, I must:

1. **Write a test plan** for a sample web application, describing scope, approach, environment, entry/exit criteria and risks.
2. **Execute the relevant Day 3 test cases** for registration and checkout, record the actual outcomes, and attach evidence for important results or defects.
3. Conduct **two separate 45-minute exploratory testing sessions**, each with a **charter, actual session notes and findings**.

**Submission folder:** `day-04-manual-testing/`. This is a single-file assessment and execution tracker; additional screenshot files belong in `day-04-manual-testing/evidence/`.

## 2. My Jira and Xray Work — Direct Links

| Jira key | Work type | What I created / learned | Current evidence interpretation |
| --- | --- | --- | --- |
| [**QP-1**](https://g-team-qfw281wn.atlassian.net/browse/QP-1) | Bug | **[Practice] Checkout marks order as Paid after declined payment** | Practice bug-reporting example, **not** a confirmed production defect |
| [**QP-2**](https://g-team-qfw281wn.atlassian.net/browse/QP-2) | Story | **User login with email and password**; acceptance criteria and DevTools login verification practice | Story/AC exercise; OrangeHRM used username-based login, so the app does not fully verify the email requirement |
| [**QP-3**](https://g-team-qfw281wn.atlassian.net/browse/QP-3) | Xray Test | **REG-01 — Verify registration rejects an empty name**; manual Action, Data, Expected Result steps | **Test designed; NOT RUN** against a confirmed registration AUT |
| [**QP-4**](https://g-team-qfw281wn.atlassian.net/browse/QP-4) | Xray Test Execution | **Day 4 — Registration Manual Test Execution (REG-01)** | Execution record created; opening/starting a run is **not** proof of a PASS/FAIL result |
| [**QP-5**](https://g-team-qfw281wn.atlassian.net/browse/QP-5) | Test | **TC-IMG-001 — Verify fallback for failed image requests** | **FAIL documented in a separate QA training lab**, not a registration/checkout run |
| [**QP-6**](https://g-team-qfw281wn.atlassian.net/browse/QP-6) | Bug | **[Practice] Broken image displays native placeholder instead of useful fallback** | Reproducible practice finding linked to QP-5; screenshots were provided in chat but not confirmed as Jira attachments |

**Practice repositories and sources:**

- [Day 3 — registration and checkout test cases](https://github.com/Morshed-jaman/robendevs-qa-foundation-morshed-jaman/blob/main/day-03-qa-lifecycle/day-03-test-design/01-registration-checkout-test-cases.md)
- [Day 3 — decision table and state transitions](https://github.com/Morshed-jaman/robendevs-qa-foundation-morshed-jaman/blob/main/day-03-qa-lifecycle/day-03-test-design/02-decision-table-state-transition.md)
- [Day 3 — advanced edge cases](https://github.com/Morshed-jaman/robendevs-qa-foundation-morshed-jaman/blob/main/day-03-qa-lifecycle/03-qa-advanced.md)
- [Day 4 learning folder](https://github.com/Morshed-jaman/robendevs-qa-foundation-morshed-jaman/tree/main/day-04-manual-testing)

## 3. Task 1 — Test Plan (QA-D04-TP-01)

| Item | Plan / preparation |
| --- | --- |
| **Objective** | Check registration/checkout behaviour using documented rules, safe test data and observed evidence |
| **Application under test (AUT)** | **[Confirm actual URL before execution]** — optional practice candidate: [Automation Exercise](https://automationexercise.com/); [public test-case guide](https://automationexercise.com/test_cases) |
| **Environment** | **[Browser, OS, device, build/version, date to be recorded]** |
| **Scope** | Registration validation, duplicate accounts, cart quantities/totals, applicable checkout actions, and exploratory registration/checkout |
| **Conditional scope** | Exact password/name boundaries, coupon, currency rules and payment states **only if supported by the AUT and its requirements** |
| **Approach** | Smoke → review requirements → manual positive/negative tests → exploratory sessions → defect logging → regression-risk review |
| **Entry criteria** | AUT reachable, agreed requirements, safe test accounts/data, suitable browser and DevTools available |
| **Exit criteria** | Applicable cases have actual outcomes, blocked/N/A reasons recorded, two 45-minute session notes completed, risks/defects documented |
| **Tools** | Browser DevTools (Network/Console), screenshots, Jira/Xray, GitHub Markdown |
| **Out of scope** | Real purchases, real payment cards, unauthorized testing and changes to production data |

### Test data and assumptions

The Day 3 exercise used **illustrative**, not confirmed application rules:

- Registration name length: **2–50** characters; password length: **8–20** characters.
- Checkout quantity: **1–10**; illustrative unit price **৳500**.
- Coupon: **10% discount** with subtotal **≥ ৳1,000**, valid coupon and eligible user; amounts exclude taxes/shipping in the exercise.

**I must confirm these rules for the chosen application before claiming any defect.** If a demo site has different rules or lacks coupons/payment sandbox, mark those cases **N/A** or **BLOCKED** with reasons instead of reporting false failures.

### Main risks and priorities

| Risk | Priority | Manual verification focus |
| --- | --- | --- |
| Invalid or duplicate account creation | High | Required fields, uniqueness and confirmation |
| Incorrect cart or coupon calculations | High | Quantity, threshold, rounding and payable total (when supported) |
| Duplicate orders / false payment success | Critical if an authorized sandbox flow exists | Repeated Pay, timeout/retry, refresh and order-state consistency |
| Ambiguous business rule | High (test validity) | Clarify expected behaviour before judging PASS/FAIL |
| Browser/session interruptions | Medium | Back, multiple tabs, expired session and offline recovery |

### Clarification questions for the PM / mentor

1. Which exact web application and environment should be tested for this assignment?
2. Are the Day 3 name and password length boundaries official requirements, or only design assumptions?
3. Does the application support quantity limits, the exact coupon rule, and a safe payment sandbox?
4. Should unsupported cases be marked N/A, or is an additional controlled application/test fixture available?

## 4. Task 2 — Manual Test Execution

**Execution status:** NOT STARTED for the **42 registration/checkout cases** below.  
**Tester / date / browser / build:** [fill when running]  
**AUT URL:** [fill when selected]  
**Evidence folder:** `evidence/`  
**Xray traceability:** [QP-3 Test](https://g-team-qfw281wn.atlassian.net/browse/QP-3) → [QP-4 Test Execution](https://g-team-qfw281wn.atlassian.net/browse/QP-4).

**Result definitions:** PASS = observed behaviour matches the confirmed requirement; FAIL = observed mismatch with confirmed requirement; BLOCKED = prerequisite prevents testing; N/A = feature/rule not supported; NOT RUN = not attempted. Always explain BLOCKED/N/A.

### 4.1 Registration cases — REG-01 to REG-18

**Common preconditions:** Registration page available; unique test email when accepting an account; all other fields contain valid data.  
**Steps:** Open Register → fill valid fields → replace the field under test → submit → compare validation and account result with expected outcome.

| ID | Day 3 input | Designed expected outcome (assumed) | Actual observation | Status | Evidence / notes |
| --- | --- | --- | --- | --- | --- |
| REG-01 | Name empty | Required validation; no account created | — | NOT RUN | — |
| REG-02 | Name length = 1 | Reject below assumed min 2 | — | NOT RUN | — |
| REG-03 | Name length = 2 | Accept if other fields valid (assumed minimum) | — | NOT RUN | — |
| REG-04 | Name length = 3 | Accept if other fields valid | — | NOT RUN | — |
| REG-05 | Name length = 49 | Accept if other fields valid | — | NOT RUN | — |
| REG-06 | Name length = 50 | Accept if other fields valid (assumed maximum) | — | NOT RUN | — |
| REG-07 | Name length = 51 | Reject above assumed max 50 | — | NOT RUN | — |
| REG-08 | Password length = 7; matching confirmation | Reject below assumed min 8 | — | NOT RUN | — |
| REG-09 | Password length = 8; matching confirmation | Accept if otherwise valid | — | NOT RUN | — |
| REG-10 | Password length = 9; matching confirmation | Accept if otherwise valid | — | NOT RUN | — |
| REG-11 | Password length = 19; matching confirmation | Accept if otherwise valid | — | NOT RUN | — |
| REG-12 | Password length = 20; matching confirmation | Accept if otherwise valid | — | NOT RUN | — |
| REG-13 | Password length = 21; matching confirmation | Reject above assumed max 20 | — | NOT RUN | — |
| REG-14 | Email empty | Required validation; no account created | — | NOT RUN | — |
| REG-15 | Email `not-an-email` | Syntax validation; no account created | — | NOT RUN | — |
| REG-16 | Email already registered | Reject duplicate email | — | NOT RUN | — |
| REG-17 | Confirm Password different | Mismatch validation; no account created | — | NOT RUN | — |
| REG-18 | All valid, fresh email and matching password | Exactly one account created | — | NOT RUN | — |

### 4.2 Checkout cases — CKO-01 to CKO-24

**Common preconditions:** Authorized test account, cart fixture and confirmed application rules. Payments, if tested, must use a sandbox.  
**Steps:** Open cart → set case data → apply coupon / proceed when applicable → inspect amount, messages and final order/payment status.

| ID | Day 3 input | Designed expected outcome (assumed) | Actual observation | Status | Evidence / notes |
| --- | --- | --- | --- | --- | --- |
| CKO-01 | Quantity = 0 | Reject below assumed min 1 | — | NOT RUN | — |
| CKO-02 | Quantity = 1; unit price ৳500 | Accept; subtotal ৳500 | — | NOT RUN | — |
| CKO-03 | Quantity = 2; unit price ৳500 | Accept; subtotal ৳1,000 | — | NOT RUN | — |
| CKO-04 | Quantity = 9; unit price ৳500 | Accept; subtotal ৳4,500 | — | NOT RUN | — |
| CKO-05 | Quantity = 10; unit price ৳500 | Accept; subtotal ৳5,000 | — | NOT RUN | — |
| CKO-06 | Quantity = 11 | Reject above assumed max 10 | — | NOT RUN | — |
| CKO-07 | Quantity = -1 | Reject negative input | — | NOT RUN | — |
| CKO-08 | Quantity = 1.5 | Reject non-integer input | — | NOT RUN | — |
| CKO-09 | Eligible + valid coupon + ৳999.99 subtotal | No discount below assumed threshold | — | NOT RUN | — |
| CKO-10 | Eligible + valid coupon + ৳1,000 subtotal | 10% discount ৳100; payable ৳900 | — | NOT RUN | — |
| CKO-11 | Eligible + valid coupon + ৳1,000.01 subtotal | Rounded discount ৳100.00; payable ৳900.01 | — | NOT RUN | — |
| CKO-12 | Eligible + valid coupon + ≥৳1,000 | Apply discount | — | NOT RUN | — |
| CKO-13 | Eligible + invalid coupon + ≥৳1,000 | No discount | — | NOT RUN | — |
| CKO-14 | Ineligible + valid coupon + ≥৳1,000 | No discount | — | NOT RUN | — |
| CKO-15 | Sandbox payment succeeds | Exactly one Paid order | — | NOT RUN | — |
| CKO-16 | Sandbox payment declined | Correct failure state, not Paid | — | NOT RUN | — |
| CKO-17 | Retry after payment timeout | One consistent final state; no duplicate charge | — | NOT RUN | — |
| CKO-18 | Double-click Pay | No duplicate charge/order | — | NOT RUN | — |
| CKO-19 | Refresh during payment | No false success/duplicate payment | — | NOT RUN | — |
| CKO-20 | Browser Back after success | No new order/payment | — | NOT RUN | — |
| CKO-21 | Session expires before Pay | Reauthentication needed | — | NOT RUN | — |
| CKO-22 | Slow network checkout | Appropriate feedback; consistent status | — | NOT RUN | — |
| CKO-23 | Update cart in two tabs | Charge validated current total | — | NOT RUN | — |
| CKO-24 | Two ৳500 items + valid eligible coupon | Subtotal ৳1,000; discount ৳100; total ৳900 | — | NOT RUN | — |

### 4.3 Registration example — REG-01 (Xray)

| Field | Value |
| --- | --- |
| Test ID | REG-01 / [QP-3](https://g-team-qfw281wn.atlassian.net/browse/QP-3) |
| Objective | Verify an empty Name does not create an account |
| Technique | Equivalence Partitioning / Negative |
| Test data | Name empty; other required fields valid; fresh email |
| Steps | Open registration → leave Name blank → fill other fields → click Register → verify result |
| Expected (exercise rule) | Required-field validation; no account created |
| Actual | **Not observed** |
| Status | **NOT RUN** |
| Execution tracking | [QP-4](https://g-team-qfw281wn.atlassian.net/browse/QP-4) |
| Evidence | [Capture after executing] |

**How I will record an actual run:**

1. Open the application, confirm the Name requirement, and execute REG-01.
2. Capture the actual message and account outcome; save `evidence/REG-01_YYYYMMDD.png` (redact personal data).
3. Update the REG-01 row and the Xray Test Run under QP-4, attaching evidence and recording environment/date.
4. Create and link a Bug **only if** observed behaviour violates a confirmed requirement.

### 4.4 Execution summary — to update after testing

| Metric | Current count |
| --- | ---: |
| Designed registration cases | 18 |
| Designed checkout cases | 24 |
| **Total designed** | **42** |
| PASS | 0 |
| FAIL | 0 |
| BLOCKED | 0 |
| N/A | 0 |
| **NOT RUN** | **42** |

Decision-table cases (DT-01…DT-08), state-transition cases (ST-01…ST-12) and advanced edge cases from Day 3 are additional design sources. They require a suitable application/fixture and must not be presented as executed simply because they exist.

## 5. Task 3 — Time-Boxed Exploratory Sessions

Exploratory testing is structured exploration based on a clear **charter + fixed duration + real observations + evidence**. Both sessions below are **planned**; neither has been completed.

### Session A — Registration (45 minutes)

**Charter:** Explore form validation, unusual input values, duplicate accounts, and unexpected user behaviour.  
**Application / browser:** [fill]  
**Start time:** [actual HH:MM]  
**End time:** [actual HH:MM]  
**Actual active duration:** [minutes — target 45]  
**Status:** **PLANNED**

| Minute range | Planned focus |
| --- | --- |
| 00–05 | Understand registration flow and available rules |
| 05–15 | Empty, invalid, short and long input |
| 15–25 | Unicode names, whitespace, malformed/duplicate emails |
| 25–35 | Double-click, Back/refresh, tab or session changes |
| 35–40 | Responsive/mobile form usability |
| 40–45 | Consolidate actual notes, evidence and questions |

**Actual session log — fill during testing:**

| Actual time | Action / test data | Observed behaviour | Finding / risk | Evidence |
| --- | --- | --- | --- | --- |
| [HH:MM] | [action] | [observation] | [finding] | [file] |
| [HH:MM] | [action] | [observation] | [finding] | [file] |
| [HH:MM] | [action] | [observation] | [finding] | [file] |

**Findings / confirmed defects:** [to be recorded]  
**Unresolved questions / blockers:** [to be recorded]  
**Session conclusion:** [not written until actual 45-minute session is completed]

### Session B — Cart and Checkout (45 minutes)

**Charter:** Explore cart totals, checkout navigation, coupon behaviour (if supported), interrupted actions and transaction-state consistency (sandbox only).  
**Application / browser:** [fill]  
**Start time:** [actual HH:MM]  
**End time:** [actual HH:MM]  
**Actual active duration:** [minutes — target 45]  
**Status:** **PLANNED**

| Minute range | Planned focus |
| --- | --- |
| 00–05 | Understand cart and checkout flow; prepare safe fixtures |
| 05–15 | Quantities, invalid input, totals and rounding |
| 15–25 | Coupon/discount combinations if supported |
| 25–35 | Back, refresh, two tabs and session expiry |
| 35–40 | Slow/offline conditions using safe DevTools throttling |
| 40–45 | Consolidate actual notes and reproduction attempts |

**Actual session log — fill during testing:**

| Actual time | Action / test data | Observed behaviour | Finding / risk | Evidence |
| --- | --- | --- | --- | --- |
| [HH:MM] | [action] | [observation] | [finding] | [file] |
| [HH:MM] | [action] | [observation] | [finding] | [file] |
| [HH:MM] | [action] | [observation] | [finding] | [file] |

**Findings / confirmed defects:** [to be recorded]  
**Unresolved questions / blockers:** [to be recorded]  
**Session conclusion:** [not written until actual 45-minute session is completed]

## 6. Separate DevTools Practice — Actual Test and Bug

During QA training, I practised investigation on the [QA Practice broken-images page](https://qapractice.hakdogan.com/ui-elements/broken-images/). This is **separate from the registration/checkout assignment**.

- **[QP-5 — TC-IMG-001](https://g-team-qfw281wn.atlassian.net/browse/QP-5):** Practice test recorded **FAIL** for a meaningful fallback after an image fails to load.
- **[QP-6 — Bug report](https://g-team-qfw281wn.atlassian.net/browse/QP-6):** The Broken image card showed a native broken-image icon and generic `Decorative dashboard image` alt text, unlike the informative messages on other failed-image cards.
- **DevTools Network observation:** `missing-product-photo.png` returned **`200 OK` with `Content-Type: text/html`**, and Preview showed the application's HTML page rather than PNG data. This is a response-type mismatch, distinct from the UI fallback failure.
- **Evidence status:** Screenshots were provided during the practice chat; their attachment to Jira is **not verified**. The finding does **not** count as one of the 42 Day 3 registration/checkout cases.

**What I learned:** A meaningful bug report includes a reproducible scenario, actual vs expected results, browser/network evidence and a link to the failed test case; a failed image is not identified reliably from the HTTP status alone.

## 7. Bug Report Format and Traceability

When a genuine mismatch is found, record:

**Bug Title → Environment → Preconditions → Steps to Reproduce → Expected Result → Actual Result → Frequency → Severity/Priority → Screenshot/Network Evidence → Linked Test Case**.

### Example traceability (practice vs planned)

| Requirement / rule | Test case | Execution | Bug | Evidence |
| --- | --- | --- | --- | --- |
| Registration Name required (assumed until AUT rules confirmed) | REG-01 / [QP-3](https://g-team-qfw281wn.atlassian.net/browse/QP-3) | [QP-4](https://g-team-qfw281wn.atlassian.net/browse/QP-4): actual app test **NOT RUN** | None established | Pending |
| Failed image should show useful fallback (QA training practice) | [QP-5](https://g-team-qfw281wn.atlassian.net/browse/QP-5) / TC-IMG-001 | **FAIL documented** | [QP-6](https://g-team-qfw281wn.atlassian.net/browse/QP-6) | Screenshots in training chat; Jira attachments pending verification |

**Defect log for registration/checkout:** No confirmed bugs recorded in this assessment until those sessions/cases are actually executed.

## 8. Evidence, Completion Checklist and Submission

### Evidence naming suggestion

```text
day-04-manual-testing/
├── 01-qa-basic.md
├── 02-qa-intermediate.md
├── 03-qa-advanced.md
├── day-04-practical-assessment.md
└── evidence/
    ├── REG-01_YYYYMMDD.png
    ├── CKO-xx_YYYYMMDD.png
    ├── exploratory-registration_YYYYMMDD.png
    └── exploratory-checkout_YYYYMMDD.png
```

Only add images you genuinely captured; remove this illustrative tree or entries that do not exist if preparing final submission.

### Completion checklist

- [ ] Confirm sample web application's URL, environment and actual requirements.
- [ ] Finalize the written test plan from the draft above.
- [ ] Execute each applicable REG/CKO case; record observed results and update the summary.
- [ ] Add evidence and actual results in Jira/Xray where applicable.
- [ ] Complete the **first 45-minute exploratory session** and real-time notes.
- [ ] Complete the **second 45-minute exploratory session** and real-time notes.
- [ ] Report only reproducible defects; add Jira links and evidence.
- [ ] Review limitations, risks and incomplete cases with the mentor.
- [ ] Commit the final assessment and evidence to GitHub.

### Git commands (run at repository root)

```powershell
cd "D:\Intern_work\robendevs-qa-foundation-morshed-jaman"
git status
git add "day-04-manual-testing/day-04-practical-assessment.md"
git commit -m "Add Day 4 practical assessment with test plan, execution tracker and Jira links"
git pull --rebase origin main
git push origin main
```

### Final Reflection — draft

My Day 4 learning connected test design to planning, manual execution, evidence capture and defect management. I created a registration test specification and Xray execution setup ([QP-3](https://g-team-qfw281wn.atlassian.net/browse/QP-3), [QP-4](https://g-team-qfw281wn.atlassian.net/browse/QP-4)). I also documented a separate failed-image test and practice bug ([QP-5](https://g-team-qfw281wn.atlassian.net/browse/QP-5), [QP-6](https://g-team-qfw281wn.atlassian.net/browse/QP-6)). **The assigned registration/checkout execution and two exploratory sessions remain pending until I perform them and record actual observations.**

**Current assessment status:** **IN PROGRESS — NOT YET COMPLETE**.