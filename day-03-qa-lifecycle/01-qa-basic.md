# Day 3 — Basic: My Understanding of Test Design Techniques and Test Cases

**Name:** MD Morshed Jaman  
**Programme:** RoBenDevs QA Engineer Internship — 14-Day Foundation Programme  
**Topic:** Test Design Techniques and Edge Cases  
**Level:** Basic  
**Learning date:** 10 November 2026

> **Scope of this note:** This is my personal Day 3 learning summary. I also included my earlier hands-on Jira activity ([QP-2](https://g-team-qfw281wn.atlassian.net/browse/QP-2)) and four OrangeHRM demo test executions as practical examples. These demo results **do not establish acceptance of QP-2** because its approved story is about **email login**, while OrangeHRM uses a **username**.

## 1. What I Learned About Test Design

From Day 1, I learned how QA participates throughout the software lifecycle. From Day 2, I learned how to read a PRD, review user stories, clarify requirements, and write acceptance criteria. In Day 3, I learned **how to turn requirements into organized, meaningful test cases**, instead of testing random input values.

The four Basic topics in the RoBenDevs programme are:

1. **Equivalence Partitioning (EP)** — divide inputs into groups expected to behave similarly.
2. **Boundary Value Analysis (BVA)** — test values at and around limits.
3. **Positive and Negative Testing** — check valid and invalid conditions.
4. **Writing Test Cases** — clearly record the preconditions, steps, data, and expected results.

## 2. Equivalence Partitioning (EP)

I learned that **Equivalence Partitioning** is a black-box test design technique. It divides input values into groups (partitions) expected to produce the same type of result. I can initially select a representative value from each group instead of testing every possible input.

### Example — Password length (illustrative rule)

Assume the approved requirement is: **A password must contain 8–20 characters, inclusive.**

| Partition | Input lengths | Sample value | Expected result |
| --- | --- | --- | --- |
| Invalid — below minimum | 0–7 | 5 | Reject |
| Valid | 8–20 | 12 | Accept if other rules pass |
| Invalid — above maximum | 21+ | 25 | Reject |

**What I understood:** EP saves time while representing different groups of behaviour. However, a representative value may miss a defect exactly at the minimum or maximum. This is why I also need BVA.

## 3. Boundary Value Analysis (BVA)

I learned that **Boundary Value Analysis** checks values at, just below, and just above a limit. This helps reveal off-by-one errors, such as using `>` instead of `>=`.

Using the same hypothetical password rule (8–20 characters):

| Test case | Password length | Expected result | Reason |
| --- | ---: | --- | --- |
| BVA-01 | 7 | Reject | Minimum − 1 |
| BVA-02 | 8 | Accept if otherwise valid | Minimum |
| BVA-03 | 9 | Accept if otherwise valid | Minimum + 1 |
| BVA-04 | 19 | Accept if otherwise valid | Maximum − 1 |
| BVA-05 | 20 | Accept if otherwise valid | Maximum |
| BVA-06 | 21 | Reject | Maximum + 1 |

For this example, the important comparison is `8 <= length <= 20`. I should also keep other input conditions valid so that I am testing **password length**, not accidentally failing another password rule.

**My takeaway:** EP checks representative groups; BVA focuses on the edges of those groups. I can use both techniques together to create stronger tests.

## 4. Positive Testing vs Negative Testing

I learned that **positive testing** checks the application's behaviour with valid data and expected user actions, while **negative testing** checks invalid, unexpected, or prohibited conditions.

| Test type | Example — Registration | Expected result |
| --- | --- | --- |
| Positive | Register with valid, unused email and valid password | Account created according to requirements |
| Negative | Register with an already used email | Duplicate registration rejected |
| Negative | Submit an empty required field | Required-field validation shown |
| Negative | Enter a password below the minimum length | Input rejected according to policy |

A **negative test passes** when the application correctly rejects the invalid action. “Negative” describes the **test scenario**, not the result.

### Connection to my payment-testing example

I previously understood that smoke testing checks whether essential functionality is ready for deeper testing. For a newly delivered payment feature, I might first check one successful **sandbox** payment, then design more detailed tests involving declined payments, invalid amounts, insufficient-funds simulations, duplicate clicks, and network interruptions. These are different test ideas; their expected results must come from the actual payment requirements.

## 5. Acceptance Criteria vs Test Case vs Test Execution

During my practical Jira work, I understood the difference between these three artifacts:

| Item | My understanding | Example |
| --- | --- | --- |
| **Acceptance Criterion (AC)** | Defines the condition a feature must satisfy | Valid login redirects to the dashboard |
| **Test Case (TC)** | Defines precisely how I will verify that condition | Open login page, enter valid data, submit, inspect redirect |
| **Test Execution Result** | Records what actually happened during testing | Authentication POST returned `302`; dashboard GET returned `200` |

A test case should be **repeatable, clear, and traceable** to a requirement. I should not invent an actual result before I execute the test.

### Common professional test case fields

I learned to document these fields when applicable. My team's actual test-management template may use different fields or names.

| Field | Purpose |
| --- | --- |
| Test Case ID | Unique test identifier |
| Test Case Title | Short description of what is being verified |
| Requirement / AC Reference | Link to the story or acceptance criterion |
| Module | Area of the application being tested |
| Test Type | Positive, negative, functional, UI, etc. |
| Priority | How important it is to run this test |
| Preconditions | Conditions needed before execution |
| Test Environment | Application, browser, and testing context |
| Test Data | Input values or accounts needed |
| Test Steps | Reproducible actions in sequence |
| Expected Result | Behaviour defined by the requirement |
| Actual Result | Behaviour observed during execution |
| Status | Pass, Fail, Blocked, or Not Run |
| Evidence | Screenshots, Network entries, logs |
| Defect ID | Related defect ticket, if any |
| Executed By / Date | Test executor and execution date |

---

## 6. My Jira Work — QP-2: User Login with Email and Password

**Jira Story:** [QP-2 — User login with email and password](https://g-team-qfw281wn.atlassian.net/browse/QP-2)  
**Issue type:** Story  
**My activity:** I prepared/reviewed the user story and its four acceptance criteria, then practised the verification approach using **Microsoft Edge DevTools (Network and Elements)** and the **OrangeHRM Demo Application**. I documented the observations in a Jira comment.

### User story (QP-2)

> As a registered user, I want to log in securely using my registered email address and password so that I can access my account and dashboard.

### The four acceptance criteria

**AC1 — Successful Login**  
**Given** I have an active registered account and am on the login page,  
**When** I enter my registered email and correct password and click Login,  
**Then** I should be authenticated and redirected to my dashboard.

**AC2 — Incorrect Credentials**  
**Given** I am on the login page,  
**When** I submit an incorrect email address or password,  
**Then** authentication should be rejected, **“Invalid email or password”** should appear, and I should remain logged out.

**AC3 — Empty Required Fields**  
**Given** I am on the login page,  
**When** I click Login with either or both required fields empty,  
**Then** each empty field should show **“Required”**, submission should be prevented, and no authentication request should be sent.

**AC4 — Password Masking**  
**Given** I am on the login page,  
**When** I enter a password,  
**Then** characters should be masked by default and not shown as readable text.

**Important scope difference:** OrangeHRM uses a **username** rather than the registered-email login required by QP-2. Its incorrect-credential message is **“Invalid credentials”**, not QP-2's **“Invalid email or password”**. I therefore recorded the demo checks as **demonstration passes**, not final QP-2 acceptance results. I did not identify confirmed defects against the original QP-2 application.

---

## 7. Four Complete Test Cases — My OrangeHRM Practice

The following cases document **actual demonstrations performed on 10 November 2026**. Their expected results describe the **OrangeHRM demo behaviour being exercised**. The original QP-2 requirements remain the traceability reference, but differ in the two areas described above.

### TC-LOGIN-001 — Successful Login With Valid Credentials

| Field | Details |
| --- | --- |
| **Test Case ID** | TC-LOGIN-001 |
| **Test Case Title** | Verify successful login and dashboard redirection |
| **Requirement / AC Reference** | QP-2 / AC1 — similar workflow, **not email-login coverage** |
| **Module** | Authentication / Login |
| **Test Type** | Positive, Functional, Network Verification |
| **Priority** | High (proposed for this practice) |
| **Preconditions** | OrangeHRM demo login page available; tester logged out; working demo account |
| **Test Environment** | OrangeHRM Demo, Microsoft Edge, DevTools → Network |
| **Test Data** | Valid **demo username** and password (not stored in notes) |
| **Expected Result** | Demo user is authenticated and dashboard loads; relevant requests reflect redirection |
| **Actual Result** | `POST /web/index.php/auth/validate` → **302 Found**; redirect to `/web/index.php/dashboard/index`; `GET /web/index.php/dashboard/index` → **200 OK**; dashboard displayed |
| **Status** | **PASS — OrangeHRM demo only** |
| **Evidence** | Two DevTools screenshots: authentication `validate` request and dashboard `index` request |
| **Defect ID** | None identified for this demo scenario |
| **Executed By / Date** | MD Morshed Jaman / 10 November 2026 |

**Test steps:**

1. Open the OrangeHRM Demo login page while logged out.
2. Open DevTools → **Network** and enable **Keep log**.
3. Enter the valid demo username and password.
4. Click **Login**.
5. Select `validate` and inspect **Headers**.
6. Select the redirected `index` request and verify its status.
7. Confirm that the dashboard appears.

**What I learned:** `302 Found` can be a normal redirect; a successful login must be assessed using the redirect destination and the final dashboard response, not by interpreting the status code in isolation.

### TC-LOGIN-002 — Incorrect Credentials

| Field | Details |
| --- | --- |
| **Test Case ID** | TC-LOGIN-002 |
| **Test Case Title** | Verify invalid login is rejected |
| **Requirement / AC Reference** | QP-2 / AC2 — workflow practice; **exact expected text differs** |
| **Module** | Authentication / Login |
| **Test Type** | Negative, Functional, Network Verification |
| **Priority** | High (proposed) |
| **Preconditions** | OrangeHRM login page available; tester logged out |
| **Test Environment** | OrangeHRM Demo, Microsoft Edge, DevTools → Network |
| **Test Data** | Valid demo username plus intentionally incorrect password (not stored) |
| **Expected Result** | Authentication rejected; login page displayed with appropriate demo error |
| **Actual Result** | `POST /web/index.php/auth/validate` → **302 Found**; redirect to `/web/index.php/auth/login`; **“Invalid credentials”** displayed; login page remained open |
| **Status** | **PASS — OrangeHRM demo only** |
| **Evidence** | Screenshot showing error message, selected `validate` request, response status and redirect |
| **Defect ID** | None identified for this demo scenario |
| **Executed By / Date** | MD Morshed Jaman / 10 November 2026 |

**Test steps:**

1. Log out of the demo application.
2. Open DevTools → **Network**, enable **Keep log**, and clear old requests.
3. Enter the valid demo username with an incorrect password.
4. Click **Login**.
5. Inspect the `validate` request and its redirect destination.
6. Verify the displayed error message and that the dashboard was not opened.

**What I learned:** A `302` response alone does not mean a login succeeded; for invalid credentials, OrangeHRM redirects back to the login page.

### TC-LOGIN-003 — Empty Required Fields

| Field | Details |
| --- | --- |
| **Test Case ID** | TC-LOGIN-003 |
| **Test Case Title** | Verify both empty login fields trigger required validation |
| **Requirement / AC Reference** | QP-2 / AC3 — **both-empty case only**; single-empty variants not yet tested |
| **Module** | Authentication / Form Validation |
| **Test Type** | Negative, Functional, UI and Network Verification |
| **Priority** | High (proposed) |
| **Preconditions** | OrangeHRM login page available; Network panel cleared |
| **Test Environment** | OrangeHRM Demo, Microsoft Edge, DevTools → Network |
| **Test Data** | Username = empty; Password = empty |
| **Expected Result** | **“Required”** appears under each empty field; authentication submission prevented |
| **Actual Result** | **“Required”** appeared under both fields; no new requests were recorded in the Network panel; login page remained displayed |
| **Status** | **PASS — tested both-empty demo scenario** |
| **Evidence** | Screenshot showing both validation messages and empty Network log |
| **Defect ID** | None identified for this demo scenario |
| **Executed By / Date** | MD Morshed Jaman / 10 November 2026 |

**Test steps:**

1. Open the demo login page while logged out.
2. Clear the Network log without reloading the page.
3. Leave **Username** and **Password** empty.
4. Click **Login**.
5. Check both validation messages.
6. Check whether a new authentication request appears in Network.

**What I learned:** The observed behaviour is consistent with client-side validation blocking an empty form. To fully cover **QP-2 AC3**, I should additionally test **username/email-only empty** and **password-only empty** conditions on the intended application.

### TC-LOGIN-004 — Password Masking

| Field | Details |
| --- | --- |
| **Test Case ID** | TC-LOGIN-004 |
| **Test Case Title** | Verify the password is masked by default |
| **Requirement / AC Reference** | QP-2 / AC4 — visual masking behaviour |
| **Module** | Authentication / Login UI |
| **Test Type** | UI, Functional |
| **Priority** | Medium (proposed) |
| **Preconditions** | OrangeHRM login page available |
| **Test Environment** | OrangeHRM Demo, Microsoft Edge, DevTools → Network / Elements |
| **Test Data** | Non-sensitive dummy password typed in the password field |
| **Expected Result** | Password characters shown as masking symbols, not readable text |
| **Actual Result** | Password appeared as dots (`••••••••`); screenshot confirmed visual masking |
| **Status** | **PASS — OrangeHRM visual demo only** |
| **Evidence** | Screenshot of masked input; Elements tab opened, **but password input element was not selected**, so `type="password"` was not separately confirmed |
| **Defect ID** | None identified for this demo scenario |
| **Executed By / Date** | MD Morshed Jaman / 10 November 2026 |

**Test steps:**

1. Open the demo login page.
2. Enter a dummy password into the Password field.
3. Do **not** submit the form.
4. Observe whether the characters are masked.
5. Optionally inspect the password input using DevTools → **Elements** for extra evidence.

**What I learned:** Password masking is primarily a UI verification; sending a Network request is not necessary. The browser should still submit credentials only through the intended secure flow, but the masked display itself does **not** prove secure transmission or storage.

---

## 8. My Practice Execution Summary and Remaining Gaps

| Test Case | Demo observation | Demo status | QP-2 coverage limitation |
| --- | --- | --- | --- |
| TC-LOGIN-001 | Login redirected to dashboard | Pass | Uses username, not email |
| TC-LOGIN-002 | Invalid credentials rejected | Pass | Message differs from exact QP-2 wording |
| TC-LOGIN-003 | Both empty fields show Required; no new request | Pass | Only both-empty variant observed |
| TC-LOGIN-004 | Password visibly masked | Pass | HTML `type="password"` not separately checked |

**Overall:** I practised **four login-related test cases** and collected Browser DevTools evidence. The results apply to **OrangeHRM Demo**, not to the actual software described in QP-2. I should not mark QP-2 fully accepted until its email-based login and exact acceptance criteria are verified in the correct application.

### Evidence organization (suggested names; not yet added to this file)

```text
screenshots/
  ac1-valid-login-validate.png
  ac1-dashboard-index.png
  ac2-invalid-credentials.png
  ac3-empty-fields.png
  ac4-password-masking.png
```

I should crop or redact sensitive content such as passwords, tokens, cookies, and session IDs before committing evidence to any repository, especially a public one.

## 9. My Day 3 Basic Assignment Preparation

In the official programme, the Day 3 practical assignment concerns **registration and checkout** test design. My OrangeHRM work above is additional hands-on practice and does **not** replace that assignment.

For the registration and checkout assignment, I still need to prepare:

- Test cases using **Equivalence Partitioning** and **Boundary Value Analysis**.
- A **Decision Table** for combinations of business rules (Intermediate).
- A **State Transition Diagram** for a workflow (Intermediate).
- At least **20 edge cases**, including data, time, and user-behaviour scenarios.
- CP-1 presentation material for Days 1–3.

## 10. My Overall Learning

From the Day 3 Basic topics, I learned that **good QA testing is based on structured test design, not random actions**. EP helps me divide inputs into meaningful groups, BVA helps me catch errors near limits, and positive/negative testing helps me verify both expected and invalid behaviour.

My Jira task **QP-2** helped me distinguish **user stories and acceptance criteria** from **full test cases and actual execution results**. Using Browser DevTools, I observed authentication requests, redirects, UI validation, and password masking. I also learned to be careful with evidence: **a demo test passing does not automatically mean a different application's acceptance criterion has passed**.

**My main takeaway:** Each test should connect to an approved requirement, use clear steps and test data, state an expected result, and honestly record what I actually observed.

## References

1. RoBenDevs QA Engineer Internship — 14-Day Foundation Programme, **Day 3: Test Design Techniques and Edge Cases**, page 9.
2. [ISTQB — Certified Tester Foundation Level](https://istqb.org/certifications/certified-tester-foundation-level-ctfl-v4-0/) — Black-box test-design techniques.
3. [Jira QP-2 — User login with email and password](https://g-team-qfw281wn.atlassian.net/browse/QP-2) — My user story, acceptance criteria, and verification notes (access may require workspace permission).
4. [Microsoft Edge DevTools: Inspect network activity](https://learn.microsoft.com/en-us/microsoft-edge/devtools/network/) — Request and response inspection.

*All registration/password-range examples are illustrative; the OrangeHRM observations were obtained during my demo practice. This document does not contain real client credentials, confirmed product defects, or a final acceptance decision for QP-2.*
