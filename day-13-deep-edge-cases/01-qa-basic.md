# Day 13 — Basic: Technically Deep Edge Cases and Release Readiness

**Programme:** RoBenDevs QA Engineer Internship — 14-Day Foundation Programme  
**Day:** 13  
**Level:** Basic  
**Source:** Official programme PDF, page 17  
**Status:** Study notes and illustrative test designs; no Day 13 test executions are claimed.

## Official Basic topics

1. **Thinking like a system:** asking what happens **before, during and after** every action.
2. **Roles and permissions:** testing every feature with every user role.
3. **Release readiness:** test summary reports, open defect review and sign-off.

> The sections below explain these exact syllabus topics with **hypothetical CRM examples** for learning. They are not confirmed requirements or defects in any company project.

---

## 1. Thinking like a system

### 1.1 What does it mean?

A shallow test asks: **"Did the button work?"**

System-level testing asks:
- **Before:** Was the user allowed to perform this action? Was the data valid? Was the system in the correct state?
- **During:** Did the UI send the expected request? Did the server validate it? Did the database update correctly? What if an error occurred?
- **After:** Did the system show the new data? Were related screens updated? Did notifications, logs and downstream actions behave correctly?

A feature may look successful in the UI while leaving incorrect data or causing an unexpected downstream effect.

### 1.2 Example: Update a CRM lead's status

**Scenario (illustrative):** An authorized sales agent changes a lead from **New** to **Contacted**.

| Time | Questions a QA engineer should ask | Possible verification |
| --- | --- | --- |
| **Before** | Does the lead exist? Is the agent assigned to it? Does this role have edit permission? What if the current status is already Contacted? | Open lead details, check role and current values, review relevant requirements. |
| **During** | Does the Save action send the correct lead ID and new status? Does the API validate the transition? What happens if the network fails? | Inspect DevTools Network, server response and validation messages. |
| **After** | Is the new status shown after refreshing? Does the activity history show the change? Do list filters and summary counts update? | Reload, inspect timeline, filtered list and any approved audit records. |

**Important:** A successful toast alone does not prove persistence or consistency.

### 1.3 Related edge-case thinking

For every meaningful user action consider:
- Missing or invalid required data.
- Repeating the same action.
- Clicking Save twice.
- Canceling midway.
- The record being changed by someone else.
- Session expiring before submission.
- A server error after the UI displays a loading indicator.
- Returning using the browser Back button.
- A dependent integration being unavailable.

These are **test ideas**, not confirmed product behaviours. Check them against the application specification before selecting expected results.

### 1.4 Example test case

**TC-SYS-001 — Lead status remains updated after page refresh**

- **Precondition:** Authorized test agent and editable test lead exist.
- **Steps:**
  1. Open the assigned lead.
  2. Change status from New to Contacted.
  3. Save the change.
  4. Refresh the page.
  5. Open the lead again and inspect its history.
- **Expected:** Saved status persists; corresponding history is recorded **if the application's requirements specify history**.
- **Evidence:** Screenshot before/after; sanitized Network response; test environment/build.
- **Status:** Not executed.

---

## 2. Roles and permissions

### 2.1 Authentication vs. authorization

- **Authentication:** Confirms **who** signed in.
- **Authorization:** Confirms **what actions and data** that signed-in user may access.

**Role-Based Access Control (RBAC)** assigns permissions to roles such as Admin, Manager and Agent. Permissions must be checked **on the server as well as in the UI**.

A hidden Edit button is not sufficient if a restricted account can still change the record by calling an API endpoint.

### 2.2 Permission matrix — illustrative CRM example

| Action | Admin | Manager | Agent | Read-only |
| --- | --- | --- | --- | --- |
| View leads | Allowed | Allowed | Assigned leads only | Allowed (as authorized) |
| Create a lead | Allowed | Allowed | Depends on requirements | Denied |
| Edit any lead | Allowed | Depends on requirements | Denied | Denied |
| Edit own assigned lead | Allowed | Allowed | Allowed (if granted) | Denied |
| Delete a lead | Allowed (if granted) | Denied | Denied | Denied |
| Manage user roles | Allowed | Denied | Denied | Denied |

**Do not use this illustrative matrix as an application's final expected behaviour.** The actual BRD, acceptance criteria and role matrix are the source of truth.

### 2.3 What to test for each role

1. **Allowed path:** A permitted user can complete the action.
2. **Denied UI path:** A restricted user does not see an unauthorized control, or the control is disabled as designed.
3. **Denied API path:** The backend rejects an unauthorized request; no data is exposed or changed.
4. **Data scope:** A user does not see another person's/tenant's records unless explicitly permitted.
5. **Permission changes:** Changes to a role, deactivation or logout take effect according to the documented session policy.
6. **Auditability:** Sensitive permitted actions appear in the audit log when required.

**Expected HTTP status:** Often 403 for forbidden requests, sometimes 404 to conceal resource existence, and 401 for unauthenticated access. Use the actual API contract.

### 2.4 Two types of unauthorized access

- **Vertical privilege escalation:** Agent attempts an Admin-only action.
- **Horizontal privilege escalation:** Agent A attempts to view or edit Agent B's restricted record (or another company's restricted record).

Only conduct authorization tests on systems and accounts **explicitly approved for testing**, using synthetic records.

### 2.5 Example test cases

**TC-RBAC-001 — Read-only user cannot update a lead**
- Log in with an authorized read-only test account.
- Attempt the documented read-only workflow.
- Verify the UI enforces restrictions.
- If an approved test environment/API is available, verify the server also rejects writes.
- **Expected:** No unauthorized update is possible.
- **Status:** Not executed.

**TC-RBAC-002 — Agent cannot access another tenant's lead**
- In a test environment, create separate synthetic tenant A and tenant B records.
- Authenticate as a tenant A Agent.
- Attempt to access tenant B's record via supported test route/API.
- **Expected:** No tenant B data is returned, and no write is allowed.
- **Status:** Not executed.

---

## 3. Release readiness

### 3.1 Meaning

Release readiness asks: **"Is there enough trustworthy evidence to recommend deploying this version?"**

It is not the same as having zero bugs. QA must understand what was tested, what was not tested, which defects remain open, and the risk of deploying.

### 3.2 Test summary report (TSR)

A concise test summary typically includes:

| Field | What to record |
| --- | --- |
| Product/build | Name, version/commit and environment |
| Scope | Features, user journeys and requirements covered |
| Execution | Planned/executed/passed/failed/blocked/not run |
| Defects | Open issues by severity, impact and links |
| Key risk | Uncovered critical paths, third-party failures, data/security concerns |
| Evidence | Test runs, automation reports and screenshots |
| Recommendation | Go / Conditional Go / No-Go, with justification |
| Sign-off | Authorized decision maker(s) and approval status |

### 3.3 Example summary (fictional — not a real test result)

| Metric | Illustration |
| --- | --- |
| Planned cases | 20 |
| Executed | 18 |
| Passed | 15 |
| Failed | 2 |
| Blocked | 1 |
| Not run | 2 |
| Open defects | 1 High, 2 Low |
| QA recommendation | **No-Go until the High defect is assessed and critical-path coverage is complete** |

**Calculation:** 15 passed / 18 executed = **83.3% executed-case pass rate**. Report blocked and not-run tests separately; don't silently treat them as passed.

### 3.4 Open defect review / bug triage

Before release, QA, developers, the PM/Product Owner and relevant stakeholders review open bugs.

Ask:
- Is the issue reproducible, and what evidence supports it?
- What is its severity (technical/business impact) and priority (fix urgency)?
- Which users, workflows, data or legal obligations are affected?
- Is a workaround available and verified?
- Is the risk of deferral understood and accepted by the responsible owner?
- Is a retest required before release?

**Severity** = how serious the effect is. **Priority** = how soon the team should fix it. These can differ.

### 3.5 Sign-off: who decides?

- **QA:** Shares facts, test evidence, remaining risks and release recommendation.
- **Engineering/DevOps:** Confirms technical readiness, deployment and rollback procedures.
- **PM/Product Owner / authorized release owner:** Makes or approves the release decision according to the team's process.

QA should not claim sole authority to approve a release unless the organization's process explicitly grants it.

### 3.6 Go / Conditional Go / No-Go

- **Go:** Required exit criteria are met, and remaining risks are acceptable.
- **Conditional Go:** A specifically approved exception exists, with owner, mitigation and monitoring.
- **No-Go:** Required criteria fail or an unacceptable risk remains.

**Example:** If a CRM release risks exposing another tenant's data, advise **No-Go** pending a verified fix and retest.

---

## 4. Quick reusable checklist

### Before an action
- [ ] Correct actor, permissions and data scope?
- [ ] Valid starting state?
- [ ] Boundary/invalid inputs considered?

### During the action
- [ ] Server validates input and permission?
- [ ] Progress, retries and errors handled?
- [ ] No accidental duplicate operation?

### After the action
- [ ] Data persists after refresh?
- [ ] Related views and audit history agree with the action?
- [ ] Side effects and integrations behave as required?

### Before a release
- [ ] Critical journeys executed?
- [ ] Test summary matches real run data?
- [ ] Open bugs reviewed and risk owners identified?
- [ ] Rollback, monitoring and sign-off recorded?

## 5. Self-check questions

1. Why is a successful UI message not enough to prove an update succeeded?
2. Explain "before–during–after" using a **Delete Lead** action.
3. What is the difference between authentication and authorization?
4. Why must permissions be enforced by the API, not only the UI?
5. Give one example each of vertical and horizontal privilege escalation.
6. What belongs in a release test summary report?
7. What is the difference between defect severity and priority?
8. Can a release proceed with low-severity defects? What would need to be reviewed?
9. Who provides the release recommendation, and who signs off?
10. What would make you recommend No-Go?

## 6. Day 13 assessment — upcoming, not completed

The programme's Day 13 assignment (page 18) asks for **at least ten technically deep edge cases** for a sample **payment or booking flow**, covering **concurrency, caching, integrations, failure and permissions**; test as many as possible and write a test summary report.

Expected later submission folder: `day-13-deep-edge-cases` with **edge case analysis, actual test results and a test summary report**. This Basic document is preparation only.

## Reference

- RoBenDevs QA Engineer Internship: **14-Day Foundation Programme**, page 17 (Day 13 Basic); page 18 (Day 13 assignment).

