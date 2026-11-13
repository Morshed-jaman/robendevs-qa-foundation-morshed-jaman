# Day 5 — Practical Assessment: Bug Reporting and the Defect Lifecycle

**Name:** MD Morshed Jaman  
**Programme:** RoBenDevs QA Engineer Internship — 14-Day Foundation Programme  
**Day:** 05 — Practical Assessment  
**Topic:** Jira Defect Reporting, Evidence, Reproduction, and Professional Bug-Report Rewriting  
**Prepared:** 13 November 2026  
**Current status:** **IN PROGRESS — report rewrites drafted; eight Day 4 defects have NOT been evidenced**

> **Evidence integrity:** The official assignment requires **eight real bugs from Day 4 in Jira with full evidence** and **three rewrites of poorly written sample bug reports**. I have completed the document's **three illustrative report rewrites**, but I have **not** executed the pending Day 4 registration/checkout test suite or invented defect keys. This is a truthful, prepared assessment and **not yet a complete practical submission**.

---

## 1. Official Assignment Requirements

The official programme's *Day 5 — Bug Reporting and the Defect Lifecycle* states:

| Requirement | Expected deliverable | Current evidence-based status |
| --- | --- | --- |
| **Log at least 8 bugs from Day 4** | Eight distinct, observed defects entered into Jira | **NOT COMPLETE** — no eight confirmed Day 4 defects |
| **Attach full evidence** | Repro steps, environment, expected/actual, screenshots/recordings, Console or Network evidence where relevant | **NOT COMPLETE** — evidence must be collected during execution |
| **Rewrite 3 poorly written sample bug reports** | Three clearly improved, structured reports | **DRAFTED BELOW** — examples are self-created because no original poor samples were supplied |
| **Submit in Day 5 folder** | Jira keys and rewritten reports in \`day-05-bug-reporting/\` | **THIS MARKDOWN FILE PREPARED** |

**Source:** RoBenDevs QA Engineer Internship — 14-Day Foundation Programme, *Day 5*, PDF pages **10–11**.

**Related learning notes:** [Basic](01-qa-basic.md) · [Intermediate](02-qa-intermediate.md) · [Advanced](03-qa-advanced.md).

### Why this cannot yet be called "completed"

My [Day 4 practical assessment](../day-04-manual-testing/day-04-practical-assessment.md) records **42 designed registration/checkout cases (18 REG + 24 CKO), all NOT RUN**, and two planned 45-minute exploratory sessions without actual session findings. Without executing against an application whose requirements are confirmed, I cannot turn planned negative test scenarios into real defects.

---

## 2. Jira Evidence Inventory — What Actually Exists

I checked the existing **QP** Jira project before preparing this document.

| Jira key | Work type | Description | What it proves | Counts as a confirmed Day 4 registration/checkout bug? |
| --- | --- | --- | --- | --- |
| [QP-1](https://g-team-qfw281wn.atlassian.net/browse/QP-1) | **Bug** | **[Practice]** Checkout marks an order Paid after a declined payment | Bug-reporting training scenario; real checkout reproduction not established | **No** |
| [QP-2](https://g-team-qfw281wn.atlassian.net/browse/QP-2) | **Story** | Login with email and password, acceptance-criteria exercise | Requirement/test-design practice | **No — Story** |
| [QP-3](https://g-team-qfw281wn.atlassian.net/browse/QP-3) | **Test** | REG-01: empty registration Name should be rejected | A designed Xray manual test, not an observed failure | **No — Test** |
| [QP-4](https://g-team-qfw281wn.atlassian.net/browse/QP-4) | **Test Execution** | Day 4 REG-01 Xray Test Execution | Execution container exists; does not prove the application test passed or failed | **No — Test Execution** |
| [QP-5](https://g-team-qfw281wn.atlassian.net/browse/QP-5) | **Test** | TC-IMG-001: verify fallback for failed image requests | **FAIL recorded** in a separate QA practice lab | **No — Test, not Bug** |
| [QP-6](https://g-team-qfw281wn.atlassian.net/browse/QP-6) | **Bug** | **[Practice]** Broken image shows browser placeholder instead of useful fallback | Observed lab defect associated with QP-5 | **Not automatically** — separate lab; confirm whether supervisor accepts it as a Day 4 defect |

**Current defect-accounting result:** The Jira project has **2 Bug-type issues**, of which **QP-1** is an illustrative practice report and **QP-6** is an observed practice-lab issue. That is **not** eight verified defects from Day 4.

**Important:** Jira issue workflow status (for example, \`To Do\` or \`In Progress\`) is different from the outcome of executing an Xray Test. A created Test Execution is not a PASS/FAIL.

---

## 3. The Report Standard I Will Use for Each Verified Bug

**Bug title → Linked requirement/test → Environment → Preconditions → Steps to reproduce → Test data → Expected result → Actual result → Reproduction frequency → Evidence → Impact/severity → Priority → Jira key → Retest/closure status**

| Field | Minimum detail I need |
| --- | --- |
| **Summary** | Specific feature and observable malfunction |
| **Test / requirement** | Story/acceptance criterion or test case ID confirming expected behaviour |
| **Environment** | URL, dev/staging/lab, build if known, browser/version, OS/device, date/time |
| **Preconditions** | Initial application/account/order state and exact test data |
| **Steps** | Repeatable, numbered steps with no missing actions |
| **Expected** | Confirmed business rule or acceptance criterion |
| **Actual** | Precisely what the application did on the executed attempt |
| **Reproducibility** | Observed frequency, such as 2/5 attempts, if measured |
| **Evidence** | Readable UI screenshot/video; sanitized Console/Network/HAR if useful |
| **Impact** | Why a user or the business is affected |
| **Severity / priority** | Impact vs urgency, with project-approved fields and levels |
| **Traceability** | Linked Jira test/bug, execution result and related evidence |
| **Status** | Actual issue lifecycle position, not an assumed fix/retest |

I should never write a concrete failure count, browser version, payment transaction ID, screenshot filename or HTTP result unless it is grounded in a real execution record.

---

## 4. Requirement A — Eight Bug Reports from Day 4

### 4.1 Eight targeted investigations (NOT eight discovered bugs)

The table below provides **eight candidate test scenarios** from my existing [Day 3 registration/checkout test cases](../day-03-qa-lifecycle/day-03-test-design/01-registration-checkout-test-cases.md).

**They are test ideas to execute—not observed defects.** A Jira Bug should be created **only** if the observed behaviour contradicts a confirmed requirement.

| Investigation ID | Related Day 3 case | Target / investigation question | Risk if behaviour is wrong | Execution status | Jira Bug key |
| --- | --- | --- | --- | --- | --- |
| INV-01 | [REG-01 / QP-3](https://g-team-qfw281wn.atlassian.net/browse/QP-3) | Does submission with empty Name correctly show required validation and prevent account creation? | Invalid account data | **NOT RUN** | — |
| INV-02 | REG-15 | Does malformed email such as \`not-an-email\` get rejected? | Invalid identity/contact data | **NOT RUN** | — |
| INV-03 | REG-16 | Does registering an already-used email reject the duplicate without changing the existing account? | Duplicate identity / account integrity | **NOT RUN** | — |
| INV-04 | REG-17 | Does mismatched Confirm Password prevent registration? | Incorrect credential setup | **NOT RUN** | — |
| INV-05 | CKO-06 | Is quantity 11 rejected **if the confirmed maximum is 10**? | Incorrect quantity/order value | **NOT RUN** | — |
| INV-06 | CKO-13 | Does an invalid coupon fail to apply a discount, under the app's approved coupon rules? | Revenue / discount integrity | **NOT RUN** | — |
| INV-07 | CKO-16 | Does a **declined sandbox payment** avoid marking the order as Paid? | Incorrect payment state | **NOT RUN** | — |
| INV-08 | CKO-18 | Do rapid repeated Pay actions avoid unintended duplicate orders/charges in the sandbox? | Duplicate charges and order integrity | **NOT RUN** | — |

**Assumption warning:** The quantity maximum of 10, password limits and the Day 3 coupon rules were **exercise assumptions**. I must confirm these with the assigned application's actual requirements before using them to assign FAIL.

### 4.2 How to execute an investigation properly

For **each** of the eight investigations:

1. Confirm the assigned test application and its accepted requirement.
2. Check that the relevant feature/test data exists; if not, record **NOT RUN** or a documented blocker, rather than a fabricated FAIL.
3. Record environment details and the initial state.
4. Execute the Day 3 steps using controlled data; use a **sandbox** for payment cases.
5. Capture the **actual** user-visible response and relevant Network evidence.
6. Compare actual behaviour against the **confirmed** expected result.
7. If a defect is present, reproduce it (if safe) and create a **Bug** in Jira.
8. Attach sanitized evidence and link the source test/execution.
9. Enter its real issue key and details in the table below.

### 4.3 The eight-defect submission register — awaiting evidence

**This is the official deliverable tracker. It must be filled using eight distinct observed defects, not merely the eight investigation ideas above.**

| Bug # | Jira Bug link | Linked test | Actual observed mismatch | Evidence attachment / link | Status |
| --- | --- | --- | --- | --- | --- |
| 1 | — | — | — | — | **Pending** |
| 2 | — | — | — | — | **Pending** |
| 3 | — | — | — | — | **Pending** |
| 4 | — | — | — | — | **Pending** |
| 5 | — | — | — | — | **Pending** |
| 6 | — | — | — | — | **Pending** |
| 7 | — | — | — | — | **Pending** |
| 8 | — | — | — | — | **Pending** |

**Verified Day 4 defects entered into this register:** **0 / 8**.

The existing [QP-6 practice bug](https://g-team-qfw281wn.atlassian.net/browse/QP-6) can be evaluated for inclusion **only after** confirming that the training-lab scenario qualifies under the supervisor's “bugs from Day 4” instruction. Do not silently count it as a registration/checkout defect.

### 4.4 Evidence and reproduction log template

\`\`\`text
Investigation / test ID:
Assigned application URL:
Approved requirement or acceptance criterion:
Environment / build / browser / OS:
Test data (use sanitized identifiers):
Preconditions:
Steps executed:
Expected result:
Actual observation:
Attempts and failures (if measured):
Date/time and time zone:
Screenshot / recording / sanitized Network proof:
Bug confirmed? YES / NO / NEEDS REQUIREMENT CLARIFICATION
Jira Bug key (only if confirmed):
Severity rationale:
Priority proposed / agreed:
\`\`\`

**Evidence directory to add after real testing:** \`day-05-bug-reporting/evidence/\`.

Suggested naming convention: \`QP-XX_<scenario>_<date>.png\` or \`QP-XX_<scenario>_<date>.md\`; never claim a file exists until it has been captured and committed/attached.

---

## 5. Requirement B — Rewrite Three Poorly Written Sample Bug Reports

> **Sample-source clarification:** The programme says to rewrite **three poorly written sample reports**, but the supplied PDF does **not include the original three samples**. The following are **three self-created bad-to-good rewriting exercises** based on my own learning examples. **Sample 1** uses real QP-6 training-lab observations. **Samples 2 and 3** are hypothetical reporting exercises and must not be misrepresented as executed bugs. Replace them with assigned poor-quality reports if the mentor provides specific source samples.

### Rewrite 1 — Broken image (real QA practice evidence)

**Poorly written sample:**

> "Image broken. It's not showing. Fix this ASAP."

**Why it is poor:** No location, environment, reproducible steps, expected/actual comparison, concrete impact or evidence.

**Improved professional report:**

| Field | Rewritten content |
| --- | --- |
| **Jira reference** | [QP-6 — Practice broken-image fallback](https://g-team-qfw281wn.atlassian.net/browse/QP-6) |
| **Title** | Broken-image scenario displays a browser placeholder instead of an informative fallback |
| **Application** | [QA Practice Image Handling Lab](https://qapractice.hakdogan.com/ui-elements/broken-images/) |
| **Environment** | Microsoft Edge desktop; browser version/build not captured |
| **Preconditions** | Image Handling Lab is open; broken-image scenarios are visible |
| **Steps to reproduce** | 1. Open the lab. 2. Scroll to Broken image QA scenarios. 3. Select Reset images if needed. 4. Observe the Broken image card after it settles. 5. Compare with Unauthorized image and Corrupted image cards. |
| **Expected result** | A failed image has a useful, readable fallback consistent with the exercise criterion |
| **Actual result** | The card showed \`ERROR\`, a browser broken-image icon, and generic alt text \`Decorative dashboard image\` instead of the informative fallback |
| **Technical evidence** | The \`missing-product-photo.png\` request returned \`200 OK\` with \`Content-Type: text/html; charset=utf-8\`; the Preview showed HTML, not PNG content |
| **Impact** | Inconsistent error feedback leaves the user without a meaningful explanation of the missing image |
| **Priority** | Medium in the existing practice Jira issue |
| **Test link** | [QP-5 / TC-IMG-001](https://g-team-qfw281wn.atlassian.net/browse/QP-5) — practice test recorded FAIL |
| **Evidence attachment status** | Screenshots were supplied during the training chat; **Jira file attachments were not confirmed** |
| **Current fix status** | No developer fix/retest verified; do **not** mark Closed |

**What improved:** The rewritten report names the exact scenario, gives repeatable steps, separates expected and actual results, provides traceable Network evidence, and does not guess root cause.

### Rewrite 2 — Declined payment marked Paid (hypothetical checkout sample)

**Poorly written sample:**

> "Payment is wrong. The developer made checkout buggy."

**Why it is poor:** It blames a person, omits the payment outcome and steps, and has no real evidence or environment.

**Improved professional *sample* — NOT an executed finding:**

| Field | Rewritten sample |
| --- | --- |
| **Related practice item** | [QP-1 — Practice checkout-status report](https://g-team-qfw281wn.atlassian.net/browse/QP-1) |
| **Title** | Order status is marked Paid after a declined sandbox payment |
| **Environment** | **Required at execution:** test application URL, build, browser/version, sandbox payment provider |
| **Preconditions** | A valid test account, cart and sandbox payment method configured to return a decline |
| **Steps** | 1. Log in to a test account. 2. Add an eligible product to cart. 3. Open checkout. 4. Submit a sandbox payment that is explicitly declined. 5. Inspect the confirmation page and authorized order/payment status. |
| **Expected result** | If payment is rejected, the order must not be recorded as Paid under the confirmed payment rules |
| **Actual result** | **NOT OBSERVED.** The poor-report scenario assumes Paid appears despite a declined transaction; execution must verify this. |
| **Impact if confirmed** | Customer-facing payment misinformation, order-integrity and potential fulfillment risk |
| **Severity / priority** | Potentially high, **only if actually reproduced and evaluated by triage** |
| **Evidence required** | Sanitized request/response, sandbox decline confirmation, order-state screenshot, timestamp and transaction reference |
| **Execution status** | **ILLUSTRATIVE — NOT RUN** |
| **Linked design case** | CKO-16 from my Day 3 test-design file |

**What improved:** The report uses neutral wording, specifies a controlled sandbox reproduction, and explains what evidence must confirm the alleged mismatch. It does not invent a real transaction.

### Rewrite 3 — Empty Name validation (hypothetical registration sample)

**Poorly written sample:**

> "Registration doesn't validate properly. Please solve."

**Why it is poor:** No specific input, form location, required rule or observed result.

**Improved professional *sample* — NOT an executed finding:**

| Field | Rewritten sample |
| --- | --- |
| **Related existing test** | [QP-3 — REG-01, verify registration rejects an empty Name](https://g-team-qfw281wn.atlassian.net/browse/QP-3) |
| **Title** | Registration allows submission with an empty required Name field |
| **Environment** | **Required at execution:** actual application URL, build and browser |
| **Preconditions** | Registration is available; fresh unused test email; other required fields valid |
| **Steps** | 1. Open Register. 2. Leave Name empty. 3. Enter valid unused email and matching valid passwords. 4. Click Register. 5. Inspect validation and account-creation outcome. |
| **Expected result** | **If the approved rule requires Name**, show required-field validation and prevent account creation |
| **Actual result** | **NOT OBSERVED.** The reported success-with-empty-Name behaviour is only a hypothetical bad-report example. |
| **Impact if confirmed** | Incorrect input validation and potentially incomplete user identity data |
| **Severity / priority** | To be evaluated after actual testing and requirement confirmation |
| **Evidence required** | Form screenshot, validation response, authorized account-creation check and environment details |
| **Execution status** | **ILLUSTRATIVE — NOT RUN** |
| **Test execution container** | [QP-4 — Day 4 Xray Test Execution](https://g-team-qfw281wn.atlassian.net/browse/QP-4); container status does not establish an actual PASS/FAIL |

**What improved:** It identifies the exact field, conditions and acceptance criterion, and clearly distinguishes a proposed issue from a confirmed defect.

### 5.4 Summary of the three rewrites

| # | Weak sample | Professional improvement | Evidence status |
| --- | --- | --- | --- |
| 1 | "Image broken" | Reproducible fallback defect report with QP-5/QP-6 and Network details | **Observed in training lab** |
| 2 | "Payment is wrong" | Precise sandbox decline/order-status scenario | **Illustrative; NOT RUN** |
| 3 | "Registration doesn't validate" | Precise Name-required validation scenario | **Illustrative; NOT RUN** |

**Rewriting exercises drafted: 3 / 3.** These are original practice samples rather than the mentor's unspecified original poor reports.

---

## 6. How Day 4 Test Evidence Connects to Day 5 Bug Reporting

\`\`\`text
Confirmed requirement / acceptance criterion
                 |
                 v
             Test case
       (REG / CKO / Xray Test)
                 |
                 v
        Real test execution
       (Actual + expected result)
                 |
             mismatch?
             /       \
           No         Yes
           |           |
      Record PASS   Reproduce,
      with proof    record evidence
                       |
                       v
                 Create Jira Bug
                       |
                       v
                Triage / Dev fix
                       |
                       v
               QA retest + nearby
                 regression checks
                       |
                  Closed / Reopened
\`\`\`

### Examples

| Requirement/test link | Execution evidence | Bug relation | Current interpretation |
| --- | --- | --- | --- |
| REG-01 / [QP-3](https://g-team-qfw281wn.atlassian.net/browse/QP-3) | [QP-4](https://g-team-qfw281wn.atlassian.net/browse/QP-4) created; actual app execution **NOT RUN** | **No confirmed bug** | Test and Test Execution exist, but an observed outcome is missing |
| TC-IMG-001 / [QP-5](https://g-team-qfw281wn.atlassian.net/browse/QP-5) | Training-lab FAIL recorded | [QP-6](https://g-team-qfw281wn.atlassian.net/browse/QP-6) | Real practice test-to-bug example; outside the uncompleted Day 4 REG/CKO execution |

---

## 7. Severity, Priority, and Communication Checklist

Before sharing a newly evidenced issue:

- [ ] The **severity** describes the user/business/technical impact.
- [ ] The **priority** reflects triage urgency, not simply the same number as severity.
- [ ] The developer can reproduce the issue from the steps and data.
- [ ] I use language such as "Observed..." rather than "You broke...".
- [ ] I separate a possible frontend/backend/data/configuration clue from an established root cause.
- [ ] I attach relevant, **sanitized** evidence to the correct issue.
- [ ] I state reproducibility/frequency **only if measured**.
- [ ] I link the originating test and requirement.
- [ ] I do not mark Fixed as Closed until QA verifies a corrected build.

### Example professional handoff

> Hi team, I noticed a mismatch between the expected and observed behaviour in the linked test. The issue includes reproduction steps, environment details and relevant evidence. Could you review the affected flow and share the fix build when available? I can then retest the original steps and check nearby functionality.

This is a reusable template; **it was not posted to Jira** as part of this assessment.

---

## 8. Evidence Collection Checklist for Actual Day 5 Submission

For each of the eight **verified** defects:

- [ ] Correct Jira work type = **Bug**.
- [ ] Unique issue key added to the submission register.
- [ ] Requirements/test criteria confirmed.
- [ ] Environment, browser and build documented.
- [ ] Preconditions, test data and numbered reproduction steps complete.
- [ ] Expected and actual results clearly separated.
- [ ] Screenshot/recording genuinely captured from the same issue.
- [ ] Console/Network/HAR details captured only if relevant and sanitized.
- [ ] Impact and severity stated; priority agreed/recorded.
- [ ] Correct linked test/execution/requirement identified.
- [ ] Jira attachment actually uploaded and verified.
- [ ] Any tested fix has an actual retest record, not an assumed result.

**HAR security note:** HAR exports may contain cookies, tokens, personal information or full request/response bodies. Review and redact before sharing, especially in a public GitHub repository.

---

## 9. Final Assessment Progress

| Deliverable | Done | Remaining |
| --- | --- | --- |
| Day 5 Basic study notes | ✅ | — |
| Day 5 Intermediate study notes | ✅ | — |
| Day 5 Advanced study notes | ✅ | — |
| Structured Day 5 practical-assessment Markdown | ✅ | Update with execution evidence |
| Three **self-created sample** bug-report rewrites | ✅ 3/3 drafted | Replace if mentor provides specific original samples |
| Eight distinct real Day 4 defects in Jira | **0/8 evidenced** | Execute tests, verify actual mismatches, create justified Bug issues |
| Eight Jira defect links + full attached evidence | **Pending** | Capture and attach after genuine execution |
| Final practical submission | **IN PROGRESS** | Complete required evidence before submission |

### Next actions

1. Confirm the web application and its actual registration/checkout business rules with the mentor/PM.
2. Complete the Day 4 test execution and two real 45-minute exploratory sessions.
3. Log only real failures in Jira with proper evidence, updating the eight-defect register.
4. Ask whether **QP-6** qualifies as one of the eight Day 4 defects; do not assume it qualifies.
5. If eight independent defects are not found, submit the verified findings and explain the shortfall rather than creating fake Bug tickets.
6. Replace the three rewriting exercises if the mentor has specified particular poorly written sample reports.
7. Change assessment status to **COMPLETE** only after the official requirements are genuinely satisfied.

---

## 10. My Reflection

I learned that a Day 5 assessment is not simply about increasing the number of Jira issues. A professional bug report must be based on an **observed mismatch**, clear requirements, reproducible steps, and trustworthy evidence. I now have a consistent template for logging and triaging real defects, along with three examples of how to rewrite weak bug descriptions. The next step is to finish the Day 4 execution evidence and use those real outcomes to complete the eight-bug assignment without overstating what has been done.

## References

1. **RoBenDevs QA Engineer Internship — 14-Day Foundation Programme**, Day 5, PDF pages 10–11.
2. [Day 5 Basic](01-qa-basic.md), [Intermediate](02-qa-intermediate.md), [Advanced](03-qa-advanced.md).
3. [Day 4 Practical Assessment](../day-04-manual-testing/day-04-practical-assessment.md).
4. [Day 3 Registration and Checkout Test Cases](../day-03-qa-lifecycle/day-03-test-design/01-registration-checkout-test-cases.md).
5. [Jira QP-1](https://g-team-qfw281wn.atlassian.net/browse/QP-1), [QP-3](https://g-team-qfw281wn.atlassian.net/browse/QP-3), [QP-4](https://g-team-qfw281wn.atlassian.net/browse/QP-4), [QP-5](https://g-team-qfw281wn.atlassian.net/browse/QP-5), [QP-6](https://g-team-qfw281wn.atlassian.net/browse/QP-6).
