# Day 5 — Intermediate: Reproducing, Investigating, Triaging, and Retesting Bugs

**Programme:** RoBenDevs QA Engineer Internship — 14-Day Foundation Programme  
**Day:** 05  
**Level:** Intermediate  
**Topic:** Intermittent Bugs, HAR / Network / Log Evidence, Bug Triage, Fix Verification, and Nearby-Area Testing  
**Prepared by:** MD Morshed Jaman  
**Learning status:** Intermediate study notes with documented Jira practice and planned exercises

> **Evidence boundary:** These notes explain the Intermediate syllabus and show how I would apply it. My [QP-5 test](https://g-team-qfw281wn.atlassian.net/browse/QP-5) and [QP-6 defect](https://g-team-qfw281wn.atlassian.net/browse/QP-6) are from a QA **practice environment**. I have not confirmed a developer fix or performed a post-fix retest on QP-6. The registration/checkout tests from Day 4 still need actual execution, so hypothetical payment examples below are **not** reported defects.

## 1. What I Learned About Day 5 Intermediate

After learning to write complete bug reports in [Day 5 Basic](01-qa-basic.md), I need to become more effective at investigating defects and collaborating with the development team.

The **official RoBenDevs Day 5 Intermediate syllabus** has four parts:

1. **Reproducing intermittent bugs:** Narrowing the conditions and recording how frequently the bug occurs.
2. **Technical evidence:** Collecting HAR files, Network responses, and relevant log references.
3. **Bug triage:** Working with the PM and developers to decide which defects should be addressed first.
4. **Retesting and verifying fixes:** Confirming the original defect is resolved and checking nearby behaviour for regressions.

**My main understanding:** A useful QA engineer does not simply say “sometimes it breaks” or “the developer fixed it.” I should describe the conditions, attach reliable evidence, help the team make decisions, and independently check the corrected build.

---

## 2. Intermittent Bugs — What Makes Them Difficult?

An **intermittent bug** is a defect that appears under some conditions but not every time the same general feature is used. It may depend on timing, concurrency, network conditions, environment configuration, cached data, session state, or the exact sequence of user actions.

**Hypothetical checkout example:** The user double-clicks **Pay**. Normally only one payment request is processed, but under certain timing conditions the interface might submit the request twice.

I should **not** record a duplicate charge as fact unless I observe it using an authorized sandbox payment environment and can verify the payment/order state.

### 2.1 Why a problem may seem random

| Variable | What I would change or record | Why it might matter |
| --- | --- | --- |
| **Timing** | Time between clicks, page load and submission | A race condition may only occur with particular timing |
| **Network** | Normal, slow, offline/online transition | Delayed or retried requests may change the final state |
| **Browser** | Edge / Chrome / Firefox and exact version | Browser-specific handling may differ |
| **Device / viewport** | Desktop vs mobile, screen dimensions | UI controls may behave differently |
| **User account** | New account, existing account, role/permission | Different server-side rules may apply |
| **Session** | Fresh login, expired session, reopened tab | Authentication state may change during an action |
| **Cache / stored data** | Normal cache vs fresh profile, with changes recorded | Stale resources or local state may influence behaviour |
| **Test data** | Quantity, email, coupon, image path | Particular values can trigger edge conditions |
| **Environment** | Dev / staging, app build, feature flags if known | Deployments and configurations can differ |
| **Concurrency** | Two tabs, two requests, repeated submission | Shared state can be updated in unexpected order |

**What I learned:** The word *intermittent* is not a substitute for details. I should isolate variables systematically.

### 2.2 My step-by-step reproduction approach

1. **Capture the first observed failure.** Write down the exact time, action, account type, browser, application URL/build, and visible result.
2. **Write the shortest known steps.** Remove unrelated navigation so the reproduction is easier.
3. **Try the same conditions again.** Avoid changing several variables simultaneously.
4. **Record every attempt.** Include attempts that passed as well as attempts that failed.
5. **Change one condition at a time.** For example, compare normal network vs slow network while keeping test data and browser unchanged.
6. **Look for a pattern.** Does the issue require refresh, an old session, multiple tabs, or rapid clicks?
7. **Collect evidence for the failed attempt.** Use screenshots/recordings plus sanitized Network details.
8. **Summarize uncertainty.** If I cannot reliably reproduce it, report exactly what was observed and what has not been confirmed.

### 2.3 Frequency vs reproducibility

The observed frequency can be calculated as:

`Observed failure frequency = (Failed attempts / Total comparable attempts) × 100%`

For example, **if** an issue fails twice during ten comparable attempts, the **illustrative** observed frequency is **2/10 = 20%**. This is **not** a measurement from my work.

A small sample does not establish a permanent failure rate. My Jira report should include both the actual attempt counts and the conditions.

**Attempt log template (no executions claimed):**

| Attempt | Environment / browser | Controlled condition | Actual observation | Result | Evidence |
| --- | --- | --- | --- | --- | --- |
| 01 | To record | Normal network | Not executed | NOT RUN | — |
| 02 | To record | Same data + slow network | Not executed | NOT RUN | — |
| 03 | To record | Same data + double click | Not executed | NOT RUN | — |
| 04 | To record | Same data + page refresh | Not executed | NOT RUN | — |

I should create as many rows as were *actually* executed, rather than filling counts from memory.

### 2.4 If the developer says “Cannot reproduce”

I should respond with better evidence instead of repeating “It is definitely broken.”

A constructive update could be:

> I reproduced the behaviour under the recorded browser and test state. I have added the exact steps, timestamp, affected request, and a recording. Could we check the same build and conditions together?

If I cannot reproduce the issue again, I can say:

> I observed this once during the recorded scenario, but the subsequent attempts did not reproduce it. I have kept the original evidence and documented the conditions; the trigger is not yet confirmed.

---

## 3. Technical Evidence — What Each Source Tells Me

Day 5 Basic covered screenshots, videos, and Console errors. Intermediate adds more detailed **HTTP/Network records and log references**.

| Evidence | Information I can obtain | When it helps |
| --- | --- | --- |
| **Screenshot** | Visible error, UI state, timestamp if shown | Visual differences and validation problems |
| **Screen recording** | Sequence, timing, repeated actions, navigation | Intermittent behaviour and timing-sensitive steps |
| **Network request / response** | URL, method, status, content type, response body, duration | API errors, malformed responses, redirects, loading failures |
| **HAR (HTTP Archive)** | Captured sequence of network requests and timing | Comparing successful and failed attempts |
| **Browser Console** | JavaScript exceptions, failed-resource and security warnings | Frontend investigations |
| **Application/server logs** | Server-side errors, request IDs, event timestamps (when authorized) | Escalating issues the browser alone cannot explain |

**Important distinction:** A Network status code indicates an HTTP response; it does not guarantee correct business behaviour or the correct response body.

---

## 4. Collecting Network Evidence with Browser DevTools

For a repeatable investigation in Chrome or Microsoft Edge:

1. Open the affected application in a test account.
2. Press **F12** (or **Ctrl + Shift + I**) to open DevTools.
3. Open **Network**.
4. Enable **Preserve log** when the flow involves redirects or navigation.
5. Reproduce the bug once while Network recording is active.
6. Find the request associated with the action (using the **Fetch/XHR**, **Img**, or other appropriate filter).
7. Inspect **Headers**, **Payload** when applicable, **Response**, **Preview**, and **Timing**.
8. Record the useful observations: request path, method, status, relevant response headers/body, and timestamp.
9. Redact secrets before saving or sharing captured evidence.

### 4.1 What to check in Headers

| Field | What I learn |
| --- | --- |
| **Request URL** | Which resource or endpoint was requested |
| **Request Method** | GET, POST, PUT, PATCH, DELETE, etc. |
| **Status Code** | HTTP-level result, such as 200, 302, 400, 404 or 500 |
| **Content-Type** | Format the server says it returned, such as `image/png` or `text/html` |
| **Request / response headers** | Relevant cache, authentication or content behaviour |
| **Timing** | Whether a slow response might explain a delay |
| **Response / Preview** | Whether the returned data matches the expected format and content |

I should not copy private cookies, bearer tokens, passwords, customer data, or complete URLs with sensitive query values into public GitHub notes.

### 4.2 My actual practice investigation — QP-5 and QP-6

I can use the broken-image practice issue as a **real example of collecting Network evidence**:

- **[QP-5 — TC-IMG-001: Verify failed-image fallback](https://g-team-qfw281wn.atlassian.net/browse/QP-5)**
- **[QP-6 — Broken image displays a native placeholder](https://g-team-qfw281wn.atlassian.net/browse/QP-6)**
- **[QA Practice Image Handling Lab](https://qapractice.hakdogan.com/ui-elements/broken-images/)**

**Observed in the exercise:** The request `missing-product-photo.png` returned **`200 OK`** but with **`Content-Type: text/html; charset=utf-8`**; the Preview showed the application's HTML rather than PNG image content.

The affected image card showed an `ERROR` indicator, a native broken-image icon, and generic alt text, rather than the meaningful custom fallback expected in this test.

| Item | What was recorded |
| --- | --- |
| **Test result** | QP-5: FAIL in the training scenario |
| **Bug report** | QP-6: Missing meaningful fallback |
| **Supporting technical observation** | Image URL responded with HTML under HTTP 200 |
| **Potential investigation direction** | Routing or missing-resource fallback handling |
| **Not confirmed** | A specific code-level cause or a corrected build |
| **Evidence limitation** | Conversation screenshots were recorded, but not attached to QP-6 as Jira files when documented |

This example demonstrates two related, but distinct, problems: **the user-visible fallback mismatch** and **the resource response mismatch**. I should explain both without claiming one automatically proves the other.

**Why 200 can still be wrong:** The browser requested an image, but the response declared HTML and contained an HTML page. A successful HTTP status does not mean the response matched the requested resource.

---

## 5. HAR Files — What They Are and How I Would Use Them

**HAR = HTTP Archive.** It stores a browser's recorded HTTP requests and responses in a structured format, including timing information. It can help a developer compare what happened when a flow passed versus when it failed.

### 5.1 Exporting a HAR in Chrome or Edge

1. Open **DevTools → Network**.
2. Enable **Preserve log** if the reproduction includes navigation.
3. Clear previous requests if I need a smaller, easier-to-review capture.
4. Reproduce the exact issue.
5. Use **Export HAR (sanitized)** in the Network toolbar (or the equivalent context-menu option).
6. Open or review the exported file to ensure it captures the necessary requests and no secrets.
7. Share through a team-approved secure channel; do not upload sensitive HARs to a public repository.

**Important:** Chrome/Edge support sanitized HAR export, which normally omits sensitive headers such as `Cookie`, `Set-Cookie` and `Authorization`. Even a sanitized export can contain personal information in URLs, payloads, responses, or query parameters, so I must review the file before sharing.

**Reference:** [Chrome DevTools — Network features and HAR export](https://developer.chrome.com/docs/devtools/network/reference/)

### 5.2 What I would include in an evidence handoff

- A clear report title and related Jira issue key.
- The exact steps and time range represented by the HAR.
- The expected request or API behaviour.
- Which request or response appears suspicious.
- The observable user-facing failure.
- Whether the file was exported **sanitized** and reviewed for confidential data.

**Example — hypothetical:** A checkout step times out. I would compare the request duration, response status, and whether a retry created a second request. I would **not** claim that a duplicate payment occurred without verifying the sandbox provider and order records.

### 5.3 HAR versus screenshot

A screenshot shows **what the user saw**. A HAR helps show **which browser requests occurred and when**. Neither automatically reveals the server's real root cause.

---

## 6. Log References and Connecting Frontend to Backend

In some projects, the development team can access backend or infrastructure logs that QA cannot. My job is to provide enough information to locate the relevant event.

### Useful log references

- Exact timestamp and time zone.
- Environment (dev, staging) and build/version.
- Endpoint or request path.
- Request ID or correlation ID **if the application exposes one**.
- Relevant error code or non-sensitive response detail.
- Account role or anonymized test-user reference.
- Steps that triggered the issue.

A request ID is useful because developers may use it to connect the browser request with application logs. However, not every application exposes one, and I must not fabricate it.

**Example handoff format:**

```text
Jira issue: [QP-XX]
Environment/build: [record after execution]
Observed time/time zone: [record after execution]
Affected route: [path only, if possible]
HTTP status / response: [recorded observation]
Request or correlation ID: [if available]
User-visible symptom: [actual observation]
Attached evidence: [sanitized screenshot / HAR / recording]
```

**What I learned:** A relevant log reference is more useful than a large amount of unrelated diagnostic output.

---

## 7. Bug Triage — How the Team Decides What to Fix First

**Bug triage** is a collaborative review of newly reported defects to decide whether they are valid, how serious they are, how urgent they are, who will investigate them, and what should happen next.

It does not mean QA independently makes every product or release decision.

### 7.1 Typical triage roles

| Role | Contribution |
| --- | --- |
| **QA** | Explains the reproduction steps, evidence, observed impact and affected tests |
| **PM / Lead** | Weighs business value, user impact, release timing and priority |
| **Developer** | Assesses likely affected area, reproducibility, dependencies and implementation effort |
| **Others when necessary** | Design, security or operations provide specialist context |

### 7.2 Questions a triage meeting should answer

1. **Is it a real defect?** Which approved rule or expected behaviour is violated?
2. **Can it be reproduced?** Is it consistent or intermittent, and what conditions were tested?
3. **How serious is it?** Could it lose money, expose information, block a core flow or confuse users?
4. **How many users or workflows are affected?** Is there a safe workaround?
5. **How urgent is it?** Is the release approaching, and does the defect create unacceptable risk?
6. **Who should own it?** Frontend, backend, data, configuration or another team?
7. **What is the decision?** Fix now, investigate further, defer, request more information or close under an agreed reason?
8. **How will the fix be verified?** Which test, environment and nearby checks are required?

### 7.3 Prioritizing two illustrative cases

| Report | Expected concern | Possible triage outcome |
| --- | --- | --- |
| **[QP-6](https://g-team-qfw281wn.atlassian.net/browse/QP-6)** — Practice broken-image fallback | Usability/informative error feedback | Medium-priority training-lab issue, as recorded in Jira |
| **[QP-1](https://g-team-qfw281wn.atlassian.net/browse/QP-1)** — Illustrative declined-payment status | Potential payment integrity risk *if genuinely reproduced* | Would deserve high urgency in a real checkout system, but the QP-1 scenario is not a verified production defect |

**What I learned:** Severity is the impact; priority is the urgency after considering impact and business context. Triage should document the decision and owner rather than simply changing labels.

### 7.4 A constructive Jira triage comment template

```markdown
**Reproduction:** [Observed in X of Y attempts under the documented conditions]
**Impact:** [What the user cannot do / risk created]
**Evidence:** [Screenshots, sanitized Network/HAR, log reference]
**Requirement:** [Story or acceptance criterion link]
**Open question:** [What we still need to confirm]
**Suggested next action:** [Investigate / fix / clarify / defer]
```

This is a template only; no such comment is claimed to have been posted to Jira.

---

## 8. Retesting — How I Verify a Developer's Fix

**Retesting** means repeating the original defect scenario against a build where a fix is available, comparing the new actual result with the expected result.

This should occur **after** the developer has delivered an appropriate fix and QA has access to the relevant build.

### 8.1 My retest workflow

1. Confirm the Jira issue is ready for QA verification.
2. Read the developer's fix description and identify the environment/build.
3. Review the original report, steps, expected result, and evidence.
4. Prepare the original test data and preconditions.
5. Repeat the exact reproduction steps.
6. Record what actually happens in the corrected build.
7. Collect new evidence where needed.
8. If the original mismatch no longer occurs and the acceptance criterion is met, record the successful retest.
9. If the defect persists, **reopen** the issue with updated evidence and exact failure details.
10. Test relevant nearby areas based on the impact of the change.

**Important:** A developer's “Fixed” label is **not** a verified PASS. I must observe the corrected behaviour myself.

### 8.2 Retest vs regression testing

| Question | Retesting | Regression testing |
| --- | --- | --- |
| **Goal** | Did the specific defect get corrected? | Did the change unintentionally break other behaviour? |
| **Starting point** | Original failed steps and expected result | Related features, dependencies and risk areas |
| **Scope** | Focused on the originally observed mismatch | Selected impacted functionality |
| **Example** | The broken image now shows the required fallback | Working, unauthorized and corrupted image scenarios still behave correctly |

The two activities work together: verify the **reported problem** first, then investigate what might have been affected by the fix.

---

## 9. Nearby-Area Testing — My QP-6 Follow-Up Plan

The official Intermediate syllabus specifically says to verify fixes **including nearby areas**.

If a developer later provides a fix for QP-6, my **planned** checks would be:

| Check ID | Nearby scenario | What I would verify | Status |
| --- | --- | --- | --- |
| RT-IMG-01 | Original broken-image case | A meaningful fallback appears; no generic broken icon replaces the required message | NOT RUN |
| RT-IMG-02 | Working image | Valid image still loads as expected | NOT RUN |
| RT-IMG-03 | Unauthorized image | Permission-related error remains informative | NOT RUN |
| RT-IMG-04 | Corrupted image | Corrupt file has the expected error/fallback state | NOT RUN |
| RT-IMG-05 | Delayed/loading image | Loading and final states remain consistent after the request settles | NOT RUN |
| RT-IMG-06 | Network response for missing image | Resource response and content type match the approved missing-image handling | NOT RUN |

**Why these checks?** The same image-handling component or error-handling logic might be shared across scenarios. A change to one fallback could affect another.

**Crucial evidence note:** The delayed-image scenario was still loading during an earlier screenshot. It was **not** independently confirmed as defective, so I must not label it FAIL based on that screenshot.

### 9.1 Example of a valid retest record

```markdown
**Issue:** QP-6
**Fixed build:** [Not provided]
**Retest date/environment:** [Not executed]
**Original steps repeated:** [No]
**Expected:** Informative fallback shown after image failure
**Actual:** [Pending observation]
**Retest status:** NOT RUN
**Nearby checks:** RT-IMG-01 to RT-IMG-06 — NOT RUN
**Evidence:** [Pending]
**Next action:** Await an available fix/build; then execute and update Jira
```

This is my **future verification plan**, not a claim that QP-6 has already been fixed.

---

## 10. A Complete Intermediate Investigation Workflow

I can summarize the Intermediate topics as one continuous process:

`Observed mismatch → Reproduce → Narrow conditions → Record attempts → Collect Network/HAR/log clues → Triage → Developer fix → Retest → Nearby regression checks → Close or Reopen`

| Phase | My input | My output |
| --- | --- | --- |
| **Investigate** | Unexpected application behaviour | Repro steps and controlled conditions |
| **Measure** | Several comparable attempts | Actual attempts/failures and frequency |
| **Collect evidence** | Browser Network, Console and authorized logs | Sanitized, relevant evidence |
| **Triage** | Jira report + impact + evidence | Agreed priority, owner and next action |
| **Retest** | Fix deployed in testable build | Observed PASS / FAIL with evidence |
| **Nearby checks** | Potential impact area | Targeted regression outcomes |
| **Finish** | Verified outcome | Closed defect or reopened issue with reason |

---

## 11. Practice Exercises I Can Do Next

These exercises help me practise the Intermediate concepts without pretending that they are completed already.

### Exercise A — Intermittent reproduction

**Scenario (hypothetical):** A payment button appears to submit twice on a slow network.

**My task:** Use an authorized test environment with **sandbox** payment data, vary network conditions one at a time, log actual attempts, and inspect the requests.

**Expected submission:** A controlled attempt matrix, actual frequency, steps and sanitized evidence.  
**Current status:** NOT STARTED.

### Exercise B — Network / HAR evidence

**Scenario:** Revisit the known QP-6 training-lab image issue.

**My task:** Capture the relevant resource request with Network open, inspect response headers/content, and export a **sanitized** HAR if permitted.

**Expected submission:** Current request observations, screenshot and a safely reviewed HAR if useful.  
**Current status:** New HAR export **NOT DONE**; earlier QP-6 Network findings are documented.

### Exercise C — Retest plan

**Scenario:** Imagine a fix for QP-6 has been released.

**My task:** Prepare the original retest plus the six nearby checks listed above, without assigning PASS/FAIL until a real fix is available.

**Expected submission:** Retest checklist, environment/build details and actual evidence after execution.  
**Current status:** PLAN ONLY.

---

## 12. Common Mistakes I Want to Avoid

| Incorrect approach | Better Intermediate QA practice |
| --- | --- |
| “It fails sometimes” | Provide exact attempts, failures and controlled conditions |
| Repeat many random actions | Change one variable at a time |
| Upload a raw HAR to public GitHub | Export sanitized HAR, review contents and share securely |
| Treat HTTP 200 as proof of a correct response | Inspect Content-Type, body and business behaviour |
| Send full logs with secrets | Include only necessary sanitized excerpts or references |
| Demand immediate fixes for everything | Present impact and evidence so triage can prioritize |
| Report a suspected root cause as fact | Separate confirmed observation from possible explanation |
| Mark a bug Closed when the developer says Fixed | Retest on the correct build first |
| Retest only the original path | Also check risk-relevant nearby scenarios |
| Claim a planned check passed | Keep the status NOT RUN until actual execution |

---

## 13. My Key Takeaways

- **Intermittent reproduction:** I should collect exact conditions, actual attempt counts and evidence rather than relying on vague descriptions.
- **Technical evidence:** Network details, HAR files and log references help me explain a problem that a screenshot cannot fully describe.
- **Bug triage:** QA supplies facts and risk context; the PM/Lead and developers work together to choose priority, ownership and next steps.
- **Retesting:** A developer's fix is not verified until QA checks the corrected build and records the outcome.
- **Nearby regression:** I should consider connected features that may be affected by the same change.
- **Evidence integrity:** My real QP-5/QP-6 training observations remain separate from invented payment scenarios, new HAR exports and unexecuted retest plans.

### Final Reflection

Day 5 Intermediate taught me how to take a bug beyond its initial Jira report. I should narrow down inconsistent failures, collect relevant technical evidence, communicate effectively during triage, and verify both the original fix and nearby behaviour. My broken-image practice provides a concrete case for understanding request/response evidence; the next step is to apply these techniques during actual, documented test execution rather than claiming work that has not happened.

## References

1. **RoBenDevs QA Engineer Internship — 14-Day Foundation Programme**, Day 5: *Bug Reporting and the Defect Lifecycle*, Intermediate topics, PDF pages 10–11.
2. [Day 5 Basic — Bug Reporting and Jira Lifecycle](01-qa-basic.md).
3. [Day 4 Basic — Manual Testing and Xray](../day-04-manual-testing/01-qa-basic.md).
4. [Day 4 Practical Assessment](../day-04-manual-testing/day-04-practical-assessment.md).
5. [QP-5 — TC-IMG-001 test](https://g-team-qfw281wn.atlassian.net/browse/QP-5).
6. [QP-6 — Broken-image practice defect](https://g-team-qfw281wn.atlassian.net/browse/QP-6).
7. [Chrome DevTools Network reference — HAR export](https://developer.chrome.com/docs/devtools/network/reference/).
8. [Microsoft Edge DevTools Network reference](https://learn.microsoft.com/en-us/microsoft-edge/devtools-guide-chromium/network/reference).
