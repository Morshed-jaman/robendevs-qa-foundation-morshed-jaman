# Day 5 — Advanced: Root-Cause Hints, Defect Metrics, and Developer Communication

**Programme:** RoBenDevs QA Engineer Internship — 14-Day Foundation Programme  
**Day:** 05  
**Level:** Advanced  
**Topic:** Frontend / Backend / Data / Configuration Clues, Defect Escape & Reopen Rates, and Constructive Communication  
**Prepared by:** MD Morshed Jaman  
**Learning status:** Advanced learning notes with documented Jira practice and proposed activities

> **Evidence integrity:** This document explains the official Day 5 Advanced topics and uses my QP-5 / QP-6 **training-lab** investigation as an example. Investigation clues are **not confirmed root causes**. Example metric counts are explicitly hypothetical—not measured RoBenDevs project metrics. My Day 4 registration/checkout test executions and two exploratory sessions are still pending; I have not invented their bugs, fixes, or retest outcomes.

## 1. What I Learned in Day 5 Advanced

Day 5 builds on what I studied earlier:

- **Basic:** Write a complete Jira bug report with reproduction steps, expected vs actual results, evidence, severity and priority.
- **Intermediate:** Reproduce intermittent bugs, use Network / HAR / logs, participate in triage and verify fixes with nearby regression checks.
- **Advanced:** Recognize **where** a defect might originate, understand what **defect metrics** can tell us, and communicate findings to developers clearly and respectfully.

The **official RoBenDevs Day 5 Advanced syllabus** has three topics:

1. **Root-cause hints:** Identify signs that a defect might relate to the frontend, backend, data or configuration.
2. **Defect metrics:** Calculate and interpret defect **escape rate** and **reopen rate**.
3. **Communicating with developers:** Be **precise, neutral and constructive**.

**My goal:** Support faster investigation and more reliable fixes without confusing evidence with assumptions or blaming other team members.

---

## 2. Root Cause vs Root-Cause Hint

A **root cause** is the underlying reason a defect occurs. A **root-cause hint** is an observation that helps narrow down where to investigate.

As a QA intern, I can inspect visible behaviour, Console messages, Network requests and test data. I may not have access to the application source code, backend logs or production configuration. Therefore, I should **suggest investigation areas instead of claiming a cause I cannot prove**.

### 2.1 Four areas mentioned in the syllabus

| Possible area | What I might observe | What I should check or share | What I must not assume |
| --- | --- | --- | --- |
| **Frontend** | Button behaves incorrectly; error message does not render; UI state is stale; Console exception | Browser, screenshot/recording, DOM/Console details, sequence of actions | Every UI error is caused by frontend code |
| **Backend** | API rejects a valid operation; response data is inconsistent; server reports an error | Endpoint, status, sanitized request/response, request ID if available | Every `500` response proves a particular backend function is wrong |
| **Data** | Incorrect stored state, missing item, duplicate record, wrong totals | Data setup, record reference, before/after observations, authorized verification | A visual mismatch automatically means the database is corrupted |
| **Configuration** | Works in one environment but not another; feature flag / route / permission differs | Dev vs staging build, environment, URL, response headers, configured test role | An environment-specific problem is always a configuration bug |

In practice, several layers may contribute to one symptom. I should compare the **visible UI state**, **actual HTTP behaviour**, **expected business rule** and **environment** before suggesting an area to inspect.

### 2.2 A simple investigation flow

`Observed problem → Reproduce → Check expected behaviour → Inspect UI and Console → Inspect Network response → Compare test data and environment → Suggest investigation area → Developer confirms cause`

For each step I should record **what I saw**, **what I expected**, and **which question remains open**.

### 2.3 Examples I can explain in a QA meeting

**Example A — Frontend hint (hypothetical)**  
An API returns an approved error message for an empty required field, but the page never displays it. The UI/Console behaviour suggests the **frontend error-handling path** deserves investigation. I cannot conclude the exact code defect without further evidence.

**Example B — Backend hint (hypothetical)**  
A checkout request returns a successful HTTP response but the resulting order state conflicts with the approved business rule. The backend response and persisted order state should be examined. A success HTTP code does **not** prove the business outcome is correct.

**Example C — Data hint (hypothetical)**  
A cart displays two copies of a product after it is added once. I should compare the request payload, UI state and authorized order/cart records; the duplicate might be caused by the UI, API or data layer.

**Example D — Configuration hint (hypothetical)**  
An image loads on development but fails only on staging. I should compare the resource URL, returned content type, deployment asset path and relevant configuration, while recording the two environments.

**What I learned:** A useful hint reduces investigation time; an unsupported root-cause claim creates confusion.

---

## 3. Applying Root-Cause Thinking to My Real Practice — QP-5 and QP-6

I already investigated a **practice broken-image scenario** and documented it through:

- [QP-5 — TC-IMG-001: Verify fallback for failed image requests](https://g-team-qfw281wn.atlassian.net/browse/QP-5)
- [QP-6 — Broken image displays a native placeholder instead of a useful fallback](https://g-team-qfw281wn.atlassian.net/browse/QP-6)
- [QA Practice Image Handling Lab](https://qapractice.hakdogan.com/ui-elements/broken-images/)

### 3.1 What I actually observed

- The **Broken image** card entered an `ERROR` state but displayed the browser's broken-image icon and generic text `Decorative dashboard image` instead of a useful custom fallback.
- Other failed-image scenarios displayed informative messages.
- The request for `missing-product-photo.png` returned **HTTP `200 OK`** with `Content-Type: text/html; charset=utf-8`, and the Preview showed an HTML page rather than PNG data.
- QP-5 recorded a **FAIL** against the practice test's meaningful-fallback criterion; QP-6 documents the visible defect and supporting response mismatch.
- At an earlier capture, one delayed image was still loading. That case was **not verified as a separate defect**.
- The issue description indicates that screenshots were supplied during the chat-based exercise but **not attached as Jira files** at the time of reporting.

### 3.2 What each observation suggests

| Evidence | What it confirms | Possible area to investigate |
| --- | --- | --- |
| Native broken-image icon remains visible | The expected informative fallback was not shown | Frontend/component fallback behaviour |
| An image URL returns HTML | Response format does not match the requested PNG resource | Static-resource routing, server or deployment configuration |
| Other failed-image cards show messages | Error handling differs between scenarios | Conditional UI handling / design consistency |
| HTTP 200 on that request | Server returned a successful HTTP response | Check response body and routing; **200 is not proof of correct image content** |

**Possible hypothesis:** An application fallback route may return HTML for the missing image while the UI fails to present a meaningful fallback. That is only an **investigation lead**, not a confirmed root cause or proof of which team must fix it.

### 3.3 How I would write a root-cause hint in Jira

> **Observed:** The broken-image card displays a generic browser placeholder. In DevTools, `missing-product-photo.png` returned `200` with a `text/html` response containing the application page.
>
> **Possible investigation areas:** Missing-resource routing/content-type handling and the image component's fallback UI. I have not confirmed the code-level cause.
>
> **User impact:** The failure is not explained as clearly as the other error states in the practice lab.

This wording gives developers evidence and a direction while leaving technical diagnosis to the person who can investigate the code and configuration.

---

## 4. Defect Metrics — Why QA Teams Measure Them

A **metric** summarizes a quality-related pattern over a defined reporting period. Metrics are useful for spotting trends and focusing improvement efforts, but no single metric can prove that a product is high- or low-quality.

The official Day 5 Advanced topic requires:

- **Defect escape rate**
- **Defect reopen rate**
- **What these metrics say about quality**

Before calculating a metric, I should confirm the reporting **period**, which defects qualify, how duplicates are counted, and what the organization means by “escaped” or “reopened.”

## 5. Defect Escape Rate

A **defect escape** is a defect discovered after the relevant release or test gate, which earlier validation did not detect or prevent.

One common definition is:

`Defect Escape Rate = (Defects found after release ÷ Total defects found before and after release) × 100%`

Here, **total defects** means qualifying unique defects detected in the same agreed scope and period. Some teams instead use a different phase-based or severity-weighted definition, so the formula must be stated in each report.

### 5.1 Worked example — hypothetical numbers

Suppose a team found:

- **36 defects before release**.
- **4 defects after release**.
- **40 defects altogether**.

Then:

`Escape Rate = (4 ÷ 40) × 100% = 10%`

**Interpretation:** In this illustrative dataset, 10% of the counted defects were discovered after release. It does **not** mean that 10% of users experienced a defect or that the application is “90% bug-free.”

### 5.2 Why defects might escape

- Missing acceptance criteria or test coverage.
- Insufficient negative, boundary or state-transition testing.
- Different staging and production configurations.
- Time-limited regression checks.
- Missing real-user/environment scenarios.
- A defect that only appears under production traffic or timing.

These are **possible explanations**, not facts about any particular release.

### 5.3 What I would check if escape rate rises

1. Which modules or user journeys produced escaped defects?
2. Were those requirements and risks understood before release?
3. Did test cases cover the failed conditions?
4. Were the tests executed on the right build and environment?
5. Were there known blockers or skipped tests?
6. Are the escaped defects concentrated in one severity level or feature?
7. Has reporting or discovery improved, increasing the number found after release?

**My takeaway:** The goal is to identify improvement opportunities—not to blame whoever tested the previous build.

---

## 6. Defect Reopen Rate

A **reopened defect** is an issue that had been considered resolved/ready for verification but is returned for further work because the original problem persists or the fix is incomplete under the agreed rule.

A common issue-based formula is:

`Defect Reopen Rate = (Number of unique defects reopened ÷ Number of defects resolved) × 100%`

To avoid double counting, the numerator should use **unique defect issues** reopened at least once within the reporting definition, rather than the number of status-change events. Teams may instead track reopening events or use a different denominator; the rule must be documented.

### 6.1 Worked example — hypothetical numbers

Suppose a team resolved **30 unique defects** during a defined period, and **3 of those issues** were subsequently reopened.

`Reopen Rate = (3 ÷ 30) × 100% = 10%`

**Interpretation:** Under these illustrative counting rules, 10% of the counted resolved defects needed further work. It does **not** prove the fixes were careless or that the developers were at fault.

### 6.2 Common reasons a bug is reopened

- Fix does not fully address the original reproduction conditions.
- Fix is present in another branch/build but not the one QA tested.
- Another relevant scenario still violates the same acceptance criterion.
- The defect was considered resolved before the expected behaviour was clarified.
- An intermittent issue appeared fixed in too few attempts.

Not every new problem after a fix should reopen the **same** issue. If it is a genuinely separate regression, the team may create a new linked defect.

### 6.3 How I would reduce unnecessary reopen cycles

- Make original reproduction steps precise.
- Link the applicable acceptance criterion and test case.
- Capture relevant environment/build details.
- Ask for the specific fix build before retesting.
- Reuse the failing test data.
- Check the original defect and nearby high-risk areas.
- Reopen with objective evidence if the failure remains.

---

## 7. Escape Rate vs Reopen Rate

| Metric | What it measures | Main QA learning | Important limitation |
| --- | --- | --- | --- |
| **Escape rate** | Share of qualifying defects discovered after the release/test gate | Improve pre-release coverage, risk assessment and environment parity | Influenced by post-release discovery and reporting |
| **Reopen rate** | Share of qualifying resolved issues needing another repair cycle | Improve defect clarity, fix completeness and retesting | Influenced by issue workflow and counting definitions |

### 7.1 Example dashboard — illustrative only

| Reporting item | Example value |
| --- | ---: |
| Pre-release defects | 36 |
| Post-release defects | 4 |
| **Escape rate** | **10%** |
| Resolved defects | 30 |
| Reopened unique defects | 3 |
| **Reopen rate** | **10%** |

**No numerical metrics have been calculated for my RoBenDevs QA training project.** My Jira practice items are not a valid release-level measurement dataset.

### 7.2 Why metrics should not become targets without context

If a team tries to minimize defects reported or reopened purely to make the numbers look better, the metrics lose their meaning.

I should interpret metrics alongside:

- Defect severity and user impact.
- Release size and change complexity.
- Test coverage and actual execution evidence.
- Number of users and level of product usage.
- Quality of bug triage and reporting.
- Consistency of historical counting methods.

**What I learned:** A metric is a conversation starter for improving the process, not a score for blaming individual team members.

---

## 8. Communicating with Developers: Precise, Neutral, and Constructive

A QA engineer and developer share the same objective: deliver software that meets the agreed requirements.

The **official Day 5 Advanced** topic specifically emphasizes being **precise, neutral and constructive**. I interpret these as:

- **Precise:** Name the exact action, environment, expected/actual result and evidence.
- **Neutral:** Describe behaviour without accusing a person or assuming a cause.
- **Constructive:** Offer relevant diagnostic clues, ask clear questions and suggest the next verification step.

### 8.1 Replace vague or blaming statements

| Avoid | Better communication |
| --- | --- |
| “You broke the image!” | “The Broken image scenario displays a native placeholder instead of the expected informative fallback.” |
| “Your backend is wrong.” | “The image request returned `200` with `text/html`. Could we check how this missing-resource route is handled?” |
| “This payment definitely failed because of your code.” | “The observed order/payment state differs from the documented rule; I have attached the reproduction evidence for investigation.” |
| “The fix doesn't work.” | “I retested the original steps on the specified build and still observed the same mismatch. I've added the actual result and evidence.” |
| “Fix this ASAP!” | “This affects a critical flow; could we review its user impact and release priority during triage?” |

These are **communication examples**, not messages I claim to have sent.

### 8.2 A simple developer handoff structure

1. **Context:** Which feature, issue key and environment?
2. **Observation:** What behaviour occurred?
3. **Expectation:** What approved requirement or test criterion was violated?
4. **Reproduction:** What exact steps and data are needed?
5. **Evidence:** Which screenshot, request, recording or log reference supports it?
6. **Question:** What specific clarification or investigation is needed?
7. **Next step:** Triage, test-data setup, retest on a fixed build or additional joint investigation.

### 8.3 Example Jira comment — QP-6 investigation

> Hi team, in the QA practice image-handling scenario, the **Broken image** card displays only the native browser placeholder. The request for `missing-product-photo.png` returns HTTP `200` with `text/html` rather than PNG content. Could we review the missing-resource response and the fallback UI handling? The observations are documented in QP-6; I have not yet verified a fix.

This is a **proposed comment**, not a new comment posted to Jira.

### 8.4 Example after a developer provides a fix

> Thanks for the update. Please share the build/environment where the change is available. I'll repeat the original reproduction steps and check the related working, unauthorized and corrupted-image scenarios before recording the retest outcome.

Again, this is an example—not evidence that QP-6 was fixed.

### 8.5 When I disagree about severity or priority

I should explain the impact rather than argue about labels:

> My concern is that this behaviour affects the user-facing recovery path. I have documented the circumstances and the current workaround. Could we review the severity and release priority against the team's agreed criteria?

Severity and priority are distinct. The PM/Lead normally helps settle business priority; QA contributes evidence of impact and reproducibility.

---

## 9. Professional Team Communication During the Defect Lifecycle

| Stage | What I should communicate | Main goal |
| --- | --- | --- |
| **Open / To Do** | Repro steps, expected/actual, environment, test link and evidence | Make the issue actionable |
| **Triage** | Business/user impact, frequency and known constraints | Support prioritization |
| **In Progress** | Additional reproduction details if requested | Help isolate the problem |
| **Fixed / Ready for QA** | Ask which build has the fix and whether there are known limitations | Avoid retesting the wrong version |
| **Retest** | New actual result and evidence from the correct build | Verify the original mismatch |
| **Closed** | Confirmation of successful verification | Finish with a traceable outcome |
| **Reopened** | Exact persistent failure and new evidence, without blame | Return issue for targeted investigation |

**Important:** The Jira status labels differ between projects. My practice project can show `To Do` even though the syllabus describes a generic `Open` state.

---

## 10. Root-Cause-Hint Checklist Before Sending a Bug to Development

- [ ] I confirmed the relevant expected behaviour/acceptance criterion.
- [ ] I know the steps and test data used.
- [ ] I recorded the application URL, environment and build/version if available.
- [ ] I separated visible facts from hypotheses.
- [ ] I inspected the relevant UI/Console/Network evidence where useful.
- [ ] I did not treat `200 OK` as proof of correct business or media content.
- [ ] I did not share raw credentials, tokens or private customer data.
- [ ] I linked the appropriate Jira test case/story.
- [ ] I included impact and reproducibility information.
- [ ] I suggested a possible area to investigate without declaring an unverified cause.
- [ ] I used neutral, professional language.

## 11. Practical Activities I Can Do Next

The Advanced syllabus is learning-focused, so I can practise its concepts while the broader Day 5 assignment is still in progress.

### Activity A — Classify clues in QP-6 (analysis; not a new execution)

**Inputs:** [QP-5](https://g-team-qfw281wn.atlassian.net/browse/QP-5) and [QP-6](https://g-team-qfw281wn.atlassian.net/browse/QP-6).

**My tasks:**
1. Identify the UI fallback symptom.
2. Identify the Network response mismatch.
3. List the frontend and resource-routing/configuration areas to check.
4. Explain why neither observation proves the exact root cause.
5. Propose one precise, neutral developer comment.

### Activity B — Explain the two metrics (worked examples, not project KPIs)

- Compute escape rate from **4 escaped / 40 total = 10%**.
- Compute reopen rate from **3 reopened / 30 resolved = 10%**.
- Explain what each result means and what it **does not** mean.
- Record reporting period and counting definitions before applying them to real data.

### Activity C — Design a future retest plan

If a fix is delivered for QP-6:

1. Confirm environment/build.
2. Run the original broken-image test.
3. Check working, unauthorized, corrupted and delayed-image scenarios.
4. Record actual outcomes and evidence.
5. Close or reopen only after verification.

**Current status of these activities:** Planning and learning; no new fix or production test is claimed.

---

## 12. Connection to the Official Day 5 Assignment

The official **Day 5 practical assessment** requires:

1. **At least eight bugs discovered from Day 4**, logged in Jira with complete evidence.
2. **Three rewritten poorly written sample bug reports**.
3. Submission in `day-05-bug-reporting/` with Jira keys and rewritten reports.

These Advanced learning notes are **not** evidence that the required eight defects have been found. My existing QP-6 training-lab defect is a useful learning example, but I should not count it as one of the Day 4 bugs without confirmation that it qualifies for the assessment.

I will not create fake Jira issues, manufacture pass/fail results, or label unexecuted retest checks as complete.

---

## 13. My Key Takeaways

- **Root-cause hints:** I should recognize frontend, backend, data and configuration clues while keeping the final diagnosis open.
- **Escape rate:** Helps us understand the share of qualifying defects found after release.
- **Reopen rate:** Helps us understand how often resolved defects need further work.
- **Metric limitations:** Definitions, reporting periods, sample sizes, severity and discovery patterns matter.
- **Developer communication:** Facts, reproduction steps and neutral questions are more valuable than blame.
- **Jira evidence:** QP-5 and QP-6 demonstrate test-to-bug traceability, but not a verified developer fix.
- **Integrity:** A hypothesis, illustrative metric or planned check should never be presented as an observed result.

### Final Reflection

Day 5 Advanced helped me see that the role of QA extends beyond reporting failures. By recognizing useful root-cause clues, interpreting quality metrics carefully and communicating with developers constructively, I can make defect investigation more efficient. The aim is to give the team **reliable evidence and clear next steps**, while honestly separating what has been observed from what remains to be investigated.

## References

1. **RoBenDevs QA Engineer Internship — 14-Day Foundation Programme**, Day 5 *Bug Reporting and the Defect Lifecycle*, Advanced syllabus and practical assignment (page 11).
2. [Day 5 Basic — Bug Report Anatomy and Jira Lifecycle](01-qa-basic.md).
3. [Day 5 Intermediate — Intermittent Bugs, HAR, Triage and Retest](02-qa-intermediate.md).
4. [Day 4 Practical Assessment](../day-04-manual-testing/day-04-practical-assessment.md).
5. [QP-5 — Failed-Image Fallback Test](https://g-team-qfw281wn.atlassian.net/browse/QP-5).
6. [QP-6 — Broken-Image Practice Defect](https://g-team-qfw281wn.atlassian.net/browse/QP-6).
