# Day 5 — Basic: My Understanding of Bug Reporting and the Defect Lifecycle

**Programme:** RoBenDevs QA Engineer Internship — 14-Day Foundation Programme  
**Day:** 05  
**Level:** Basic  
**Topic:** Bug Report Anatomy, Evidence, Severity vs Priority, and Jira Defect Lifecycle  
**Prepared by:** MD Morshed Jaman  
**Learning status:** Basic study notes and Jira-practice reflection

> **Scope and evidence integrity:** This document explains what I learned from the official Day 5 Basic syllabus. It also uses my existing Jira/Xray training work as concrete examples. The broken-image issue was observed in a **QA practice lab**, not in a production application. My Day 4 registration/checkout exercise is still pending execution, so I do not treat the illustrative checkout defect or any unexecuted test as a newly verified Day 5 bug.

## 1. What I Am Learning on Day 5

On Day 3, I learned to **design test cases**. On Day 4, I learned to **plan tests, execute manual steps and record expected versus actual results**. Day 5 connects those activities to a professional defect-reporting workflow.

My understanding is that finding unexpected behaviour is only the first part of testing. A QA engineer must describe the problem so another person can reproduce it, understand its impact, investigate it and verify a fix.

The **official Day 5 Basic** topics are:

1. **Anatomy of a bug report:** title, environment, steps to reproduce, expected and actual result.
2. **Evidence:** screenshots, screen recordings and console errors.
3. **Severity versus priority:** impact on users versus urgency to fix.
4. **Defect lifecycle in Jira:** open, in progress, fixed, retest, closed and reopened.

**My learning goal:** Write useful Jira defect tickets without guessing results, confusing severity with priority or closing an issue before verification.

## 2. Bug, Test Failure, and Requirement Gap — What Is the Difference?

| Term | My understanding | Example |
| --- | --- | --- |
| **Bug / defect** | Observed software behaviour violates an approved rule, expected behaviour or clearly established product criterion | An image-error scenario displays only a generic broken-image icon when an informative fallback is expected |
| **Test failure** | The observed result does not meet the expected result of a test case | A failed-image fallback assertion fails during the practice test |
| **Requirement gap** | The expected behaviour is missing, unclear or contradictory, so a reliable pass/fail decision is not yet possible | A PRD says “show a good error message” without defining the needed content |
| **Improvement request** | A suggested enhancement that is not necessarily a violation of an agreed requirement | Suggesting a more attractive fallback illustration where the existing response is already acceptable |

**What I learned:** Before logging a bug, I should confirm what behaviour is expected and what I actually observed. A failing test can point to a defect, but an incorrect assumption in the test can also produce a failure.

For example, my Day 3 checkout exercise assumes a **10% coupon discount for eligible users when subtotal is at least ৳1,000**. I should not report a real application's different coupon threshold as a bug unless its actual requirements confirm that rule.

## 3. Anatomy of a Good Bug Report

A high-quality defect report should help a developer reproduce the behaviour without repeatedly asking for missing information.

| Field | What I should write | Why it matters |
| --- | --- | --- |
| **Issue key** | The Jira-generated ID, such as QP-6 | Unique reference for communication |
| **Title / Summary** | Short, specific description of what goes wrong and where | Helps people find and understand the issue quickly |
| **Environment** | Application and URL, environment (dev/staging), build/version, browser/device/OS, if known | Helps reproduce environment-dependent issues |
| **Preconditions** | Required account, data, login state, permissions and setup | Makes the starting state clear |
| **Steps to reproduce** | Numbered, repeatable actions in the order performed | Enables another tester or developer to recreate the issue |
| **Expected result** | What the approved behaviour or test criterion requires | Defines what success should look like |
| **Actual result** | Exactly what happened, based on observation | Separates facts from assumptions |
| **Evidence** | Screenshots, recordings, console messages, Network details, relevant log references | Supports investigation and later retesting |
| **Severity** | Business or user impact | Communicates how serious the defect is |
| **Priority** | Urgency relative to other work | Supports scheduling and triage |
| **Reproducibility** | Always / intermittent / specific conditions, with measured counts if available | Shows how reliably the defect occurs |
| **Related test / requirement** | Link to the applicable test case, story or acceptance criterion | Maintains traceability |
| **Status** | Current Jira workflow position | Shows whether it is awaiting triage, repair or verification |

### 3.1 Writing a meaningful bug title

Weak title:

> Image not working

Better title:

> Broken-image scenario shows a browser placeholder instead of the expected informative fallback

A useful title usually identifies the **feature/context + unexpected behaviour**. I should describe the observable problem, not guess its root cause.

### 3.2 Writing reproducible steps

Weak steps:

> Open site and check the image.

Better steps:

1. Open the specific QA practice image-handling URL.
2. Scroll to the **Broken image QA scenarios** section.
3. Click **Reset images** if needed and allow the relevant cards to settle.
4. Inspect the **Broken image** card.
5. Compare it with **Unauthorized image** and **Corrupted image**.
6. Optionally inspect the related request in DevTools → Network.

Good steps avoid undefined phrases such as “do the normal thing.” They name the page, action, test data and relevant state.

### 3.3 Expected result vs actual result

- **Expected result** should describe a verified specification or clearly stated exercise criterion.
- **Actual result** must describe an observation, not what I think might happen.
- **Impact** explains why the difference matters.
- **Suspected cause** is a separate hypothesis, never a replacement for evidence.

**My takeaway:** Developers need an accurate comparison, not just a screenshot with “Bug!” written on it.

## 4. My Jira Practice Example — Broken-Image Fallback

I already documented a practice test and defect:

- **[QP-5 — TC-IMG-001: Failed-image fallback test](https://g-team-qfw281wn.atlassian.net/browse/QP-5)**
- **[QP-6 — Broken image displays native placeholder instead of useful fallback](https://g-team-qfw281wn.atlassian.net/browse/QP-6)**

**Practice application:** [QA Practice — Image Handling Lab](https://qapractice.hakdogan.com/ui-elements/broken-images/)  
**Observed during:** QA training exercise on 11 November 2026  
**Browser:** Microsoft Edge desktop (exact version not recorded)  
**Classification:** Practice defect, not a production incident

### 4.1 Preconditions

- Open the Image Handling Lab.
- Navigate to the failed-image scenarios.
- Let the image cards reach their observed states.
- Open DevTools → **Network** when inspecting the request.

### 4.2 Steps to reproduce

1. Open the practice lab.
2. Scroll to **Broken image QA scenarios**.
3. If needed, select **Reset images** and observe the resulting image states.
4. Locate the **Broken image** card after it reports an error.
5. Compare the card's fallback with the **Unauthorized image** and **Corrupted image** cards.
6. In DevTools → Network, inspect the request named `missing-product-photo.png` and its **Headers** and **Preview**.

### 4.3 Expected result

The broken-image card should show a useful fallback message or representation after its image fails, consistent with the test's meaningful-fallback criterion. The lab describes the missing image as a case expecting a `404 Not Found` response rather than an HTML application page delivered as a PNG.

### 4.4 Actual observations

- The **Broken image** card reported `ERROR`, but displayed a browser broken-image icon and the generic alt text `Decorative dashboard image`.
- Other failed-image examples supplied informative error messages.
- The request for `missing-product-photo.png` returned **HTTP 200 OK** but its `Content-Type` was **`text/html; charset=utf-8`**.
- The response preview showed an HTML page rather than image data.
- During one screenshot, the counters showed **3 failed images** and **1 image still loading**. That still-loading case was **not** classified as a bug.

**Result documented in QP-5:** The intended fallback assertion **FAILED** in the practice exercise.  
**Defect logged in QP-6:** Missing meaningful fallback, with a separately described Network response mismatch.

A `200 OK` response means the HTTP request completed successfully at the HTTP level; it does **not** prove that a PNG was returned. The content type and body matter.

**Evidence limitation:** The exercise screenshots were supplied in the chat, but QP-6's Jira description states they were **not yet attached to Jira as files**. I must not claim that screenshots were attached.

### 4.5 Separating observation and diagnosis

| Type | Example |
| --- | --- |
| **Observed fact** | The requested `.png` path responded with HTML content |
| **Observed fact** | The card showed a broken icon rather than a meaningful fallback |
| **Possible investigation lead** | The site's route/fallback configuration may be returning the HTML application page for a missing image |
| **Not established** | The exact source-code line or definite root cause |

**What I learned:** A QA report can give developers a useful investigation clue while remaining honest about what is confirmed.

## 5. Evidence Collection — Screenshots, Video, and Console Errors

The official Basic topic includes **screenshots, screen recordings and console errors**. Evidence should make the report easier to reproduce and review.

### 5.1 Screenshot evidence

I should capture:

- The relevant page and visible failure.
- The form values or state required to understand the result (without exposing secrets).
- The validation message, incorrect status or other important UI detail.
- The application/build and browser details separately in the ticket.

**Example:** For a registration Name-field bug, the screenshot should show the empty Name input and its actual validation behaviour. It must come from a real execution, not from my unexecuted REG-01 example.

**Suggested filename:** `QP-6_broken-image-fallback_edge_2026-11-11.png`. This is a naming example, not a claim that the file already exists.

### 5.2 Screen-recording evidence

A short recording is useful when the failure involves a sequence of actions, timing, browser navigation or multiple clicks.

For example, to investigate a hypothetical duplicate-payment defect, a recording might show entering checkout, clicking Pay, a loading state and the final UI. I should use **only sandbox payment data**, not real transactions.

A clear recording should start near the preconditions, show the steps, and stop after the unexpected result.

### 5.3 Console evidence

In Chromium-based browsers I can open Developer Tools with **F12** or **Ctrl + Shift + I**, then select **Console**.

The Console may show:

- JavaScript runtime exceptions.
- Failed-resource or security warnings.
- Messages emitted by the application.
- Stack traces that help developers locate a problem.

A Console error is an investigation clue; I should connect it to the user-visible issue and reproduce the behaviour before deciding it is a product defect.

**Example of a hypothetical error:** `TypeError: Cannot read properties of undefined`. This is **illustrative**, not a message collected from QP-6.

### 5.4 Network evidence as additional context

Although Day 5 Intermediate goes deeper into technical evidence, I can use basic DevTools Network observations to support a bug report:

1. Open DevTools → **Network**.
2. Reproduce the action.
3. Select the relevant request.
4. Review the request name/URL, method, status, response headers and body.
5. Record only the useful facts and redact authentication or personal data.

My **[QP-2 login story](https://g-team-qfw281wn.atlassian.net/browse/QP-2)** includes a separate OrangeHRM login practice with a POST request and an HTTP 302 redirect. That evidence demonstrates Network inspection; it **does not** show the broken-image defect.

### 5.5 Evidence quality checklist

- [ ] Evidence belongs to the same application and issue.
- [ ] The visible result matches the written Actual Result.
- [ ] The captured state was observed, not fabricated.
- [ ] Timestamps, build and browser details are recorded where available.
- [ ] Screenshots are readable; the relevant region is easy to identify.
- [ ] Passwords, cookies, tokens, personal data and other secrets are hidden.
- [ ] I distinguish **attached to Jira** from **available only in my notes/chat**.
- [ ] No unrelated screenshot is presented as proof of another defect.

## 6. Severity vs Priority

I understand these as two different decisions:

- **Severity:** How badly does the defect affect users, business operations, data, security or the system?
- **Priority:** How quickly should the team address this defect compared with other work?

Severity expresses **impact**. Priority expresses **urgency**.

### 6.1 Illustrative severity levels

| Severity | Meaning | Example |
| --- | --- | --- |
| **Blocker / Critical** | Prevents essential use or risks serious loss | Payment succeeds but the user is charged repeatedly, or a major security boundary is bypassed |
| **High / Major** | Important feature is seriously impaired | Registered users cannot complete checkout |
| **Medium** | Noticeable functional or usability impact, but some workflow remains usable | A failed-image scenario provides unhelpful error feedback |
| **Low / Minor** | Limited cosmetic or low-impact issue | Small spacing mismatch that does not obscure content |

Actual classification and labels should follow the project's agreed severity scale.

### 6.2 Illustrative priority levels

| Priority | Meaning | Example |
| --- | --- | --- |
| **Highest / Urgent** | Address immediately or before the release proceeds | Critical checkout payment-integrity failure |
| **High** | Fix soon because of business need or release risk | Primary registration flow is broken |
| **Medium** | Plan a fix within the normal work queue | Broken-image fallback inconsistency |
| **Low** | Can reasonably wait for a later iteration | Cosmetic issue in a low-traffic page |

A PM/Lead commonly helps prioritize work based on **severity, frequency, reach, workarounds, release timing and business risk**.

### 6.3 Severity and priority can differ

| Scenario | Possible severity | Possible priority | Why |
| --- | --- | --- | --- |
| A rare admin action exposes sensitive data | Critical | High/Urgent | High impact even if rare |
| Typo on the homepage immediately before an important launch | Low | High | Low functional impact, high business urgency |
| Broken-image fallback on a practice page | Low/Medium | Medium | Usability impact with other functionality available |
| Checkout sometimes creates duplicate sandbox charges | High/Critical | Highest | Payment integrity risk |

**What I learned:** I should explain the impact and recommend a classification when appropriate, but the final priority is a team decision. Severity and priority are not synonyms.

## 7. Defect Lifecycle in Jira

The official programme names **Open, In Progress, Fixed, Retest, Closed and Reopened**. I learned to understand them as an end-to-end verification cycle:

`Open → In Progress → Fixed → Retest → Closed`

If the bug persists:

`Retest → Reopened → In Progress → Fixed → Retest`

Some teams insert a **Triage** step between Open and In Progress. Jira workflows are configurable, and a team's real status names may differ; for example, my QP-6 issue currently uses **To Do** rather than a literal Open status.

| Stage | What it means | Common owner/action |
| --- | --- | --- |
| **Open / To Do** | New issue has been recorded for review | QA provides a complete report |
| **Triage (if configured)** | Team checks validity, impact and priority | PM/Lead, QA and developers |
| **In Progress** | Developer is investigating or implementing a correction | Developer |
| **Fixed / Ready for Retest** | Developer indicates a fix is available in a specified build | Developer provides fix/build details |
| **Retest** | QA repeats the original steps in the corrected build | QA verifies actual behaviour and evidence |
| **Closed / Done** | Fix has been successfully verified according to team policy | QA or authorized workflow owner |
| **Reopened** | The original issue still occurs, or the fix did not meet the criterion | QA reopens with new evidence and environment |

### Example: from detection to closure

1. **Open:** I observe a defect, confirm expected vs actual behaviour and log a Jira bug.
2. **Triage:** The team reviews severity, priority, ownership and reproducibility.
3. **In Progress:** A developer investigates and implements a fix.
4. **Fixed:** The developer identifies the fix and build/environment where it can be tested.
5. **Retest:** I execute the original reproduction steps again.
6. **Close:** If the expected result is confirmed, I record evidence and close the issue according to the workflow.
7. **Reopen if necessary:** If the problem remains, I record the new Actual Result and return it for investigation.

### Responsibility boundaries

| Role | Core responsibility |
| --- | --- |
| **QA engineer** | Detect, reproduce and document the defect; retest the fix; report remaining risk |
| **PM / Team Lead** | Decide business urgency and help prioritize/assign work |
| **Developer** | Investigate the implementation and fix the defect |
| **Release/DevOps (when applicable)** | Help provide the correct build/environment and coordinate release activities |

A **Jira issue status** and an **Xray test execution status** are not identical. For example, the Jira issue QP-4 can exist while the underlying REG-01 run remains **NOT RUN**.

**Important:** “Developer marked Fixed” is not the same as “QA verified Closed.”

## 8. How I Would Create a Jira Bug Ticket

Using my existing Jira practice project, I would:

1. Open the **QA Practice** Jira project.
2. Select **Create** and choose **Bug** as the issue type where it is available.
3. Write a specific Summary describing the observed behaviour.
4. In Description, add **Environment**, **Preconditions**, **Steps**, **Expected** and **Actual**.
5. Set the available Priority field and provide impact context; use a severity field only if the project has one.
6. Attach relevant screenshots, recordings or logs after redacting secrets.
7. Link the defect to the related story or test case if the project supports issue links.
8. Check the saved issue and send its key to the team for triage.

I would then monitor the issue through the project's configured workflow and retest once a fix is genuinely available.

### Traceability from my existing practice

| Item | Link | Purpose |
| --- | --- | --- |
| **QP-1** | [Practice checkout defect](https://g-team-qfw281wn.atlassian.net/browse/QP-1) | Illustrative declined-payment status bug; not independently verified on a real checkout |
| **QP-2** | [Login story/acceptance criteria](https://g-team-qfw281wn.atlassian.net/browse/QP-2) | Requirement and DevTools learning practice |
| **QP-3** | [REG-01 manual test](https://g-team-qfw281wn.atlassian.net/browse/QP-3) | Test specification; registration outcome not executed |
| **QP-4** | [REG-01 Xray Test Execution](https://g-team-qfw281wn.atlassian.net/browse/QP-4) | Test execution container; not proof of an executed case |
| **QP-5** | [Broken-image fallback test](https://g-team-qfw281wn.atlassian.net/browse/QP-5) | Practice test with a recorded FAIL |
| **QP-6** | [Broken-image fallback bug](https://g-team-qfw281wn.atlassian.net/browse/QP-6) | Practice defect linked conceptually to QP-5 |

The most direct Day 5 learning example is **QP-5 → QP-6**: a test produced an observed failure and a separate Jira bug documented the defect.

## 9. Reusable Bug Report Template

This is the structure I will use during actual testing. The bracketed fields are placeholders, **not completed execution results**.

```markdown
### Summary
[Feature] — [Specific unexpected behaviour]

### Environment
- Application / URL:
- Dev / Staging / Build:
- Browser / Version:
- Device / OS:
- Test date and time:

### Preconditions
1. ...

### Steps to Reproduce
1. ...
2. ...
3. ...

### Expected Result
...

### Actual Result
...

### Reproducibility
[Attempts / failures, if measured]

### Impact and Severity
...

### Priority
[Proposed or agreed priority]

### Evidence
- Screenshot:
- Recording:
- Console / Network:
- Log reference (if authorized):

### Traceability
- Requirement / Story:
- Related Test Case:
- Related Bugs (if any):

### Status
[Open / project's configured initial state]
```

## 10. Common Reporting Mistakes I Want to Avoid

| Mistake | Better practice |
| --- | --- |
| “The page is broken” | State the specific feature, action and mismatch |
| No reproduction steps | Supply numbered steps and preconditions |
| Only an expected result | Include the observed Actual Result |
| Assuming a rule is approved | Confirm the acceptance criterion first |
| Calling every issue “critical” | Explain severity based on impact |
| Treating priority as severity | Keep urgency separate from seriousness |
| Copying an unrelated screenshot | Attach evidence from the same scenario |
| Claiming a suspected cause is proven | Label it as a possible investigation lead |
| Marking Fixed immediately Closed | Retest on the corrected build |
| Claiming an Xray Test Execution is a PASS | Record a real executed Test Run and its evidence |

## 11. Quick Self-Check

Before I create a bug report, I should be able to answer:

1. **What requirement or expected behaviour is violated?**
2. **Can someone reproduce it using my exact steps and test data?**
3. **What happened versus what should have happened?**
4. **Which environment, browser and build did I use?**
5. **What evidence confirms the actual result?**
6. **What is the impact on the user or business?**
7. **Is my proposed severity supported by that impact?**
8. **Is the priority an urgency decision rather than an impact label?**
9. **Which test case, story or acceptance criterion should be linked?**
10. **Am I reporting an observed issue rather than an unexecuted scenario?**

## 12. Day 5 Practical Assignment — Not Yet Claimed Complete

According to the official RoBenDevs programme, the Day 5 practical submission must contain:

- **At least eight bugs from Day 4**, logged in Jira **with full evidence**.
- **Three rewritten poorly written sample bug reports**.
- Jira keys and rewritten reports inside the `day-05-bug-reporting/` folder.

**Current status:** These Basic learning notes are **not** the completed practical assessment.

My Day 4 registration/checkout executions and both 45-minute exploratory sessions still need real outcomes. I must not manufacture eight defects. The verified-in-practice broken-image ticket QP-6 is useful study evidence, but it is separate from the requirement to log defects **from Day 4** unless the programme supervisor accepts it as qualifying evidence.

I will create the later practical assessment only from genuine observed failures, with traceable test cases and screenshots.

## 13. My Key Takeaways

- **Bug reports:** A clear title, exact environment, reproducible steps and expected-versus-actual comparison make a defect actionable.
- **Evidence:** Screenshots, recordings, Console output and selected Network details help explain what happened.
- **Severity:** Describes the seriousness of the problem.
- **Priority:** Describes how urgently the team should address it.
- **Jira lifecycle:** Reporting a bug is the beginning; a complete workflow includes triage, fixing, retesting, and closure or reopening.
- **Integrity:** A realistic example is not automatically an executed defect. I should make no PASS/FAIL or attachment claims without supporting observations.

### Final Reflection

Day 5 Basic helped me understand that **good bug reporting is a form of precise technical communication**. My responsibility is not simply to say that a feature failed. I need to describe the defect objectively, provide the steps and evidence needed to reproduce it, explain the impact, and follow up after the developer's fix. My existing QP-5/QP-6 practice gives me a concrete example of how a failed test and a defect ticket connect, while reminding me to keep training evidence separate from unexecuted assessment work.

## References

1. **RoBenDevs QA Engineer Internship — 14-Day Foundation Programme**, Day 5: *Bug Reporting and the Defect Lifecycle*, Basic syllabus, PDF page 10 (practical task continues on page 11).
2. [Day 4 — Basic: Manual Testing and Test Execution](../day-04-manual-testing/01-qa-basic.md).
3. [Day 4 Practical Assessment](../day-04-manual-testing/day-04-practical-assessment.md).
4. [Jira QP-5 — TC-IMG-001](https://g-team-qfw281wn.atlassian.net/browse/QP-5).
5. [Jira QP-6 — Broken-image fallback bug](https://g-team-qfw281wn.atlassian.net/browse/QP-6).
