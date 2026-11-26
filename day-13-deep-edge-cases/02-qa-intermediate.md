# Day 13 — Intermediate: Technically Deep Edge Cases and Release Readiness

**Programme:** RoBenDevs QA Engineer Internship — 14-Day Foundation Programme  
**Level:** Intermediate  
**Official source:** Day 13, page 17 (assignment on page 18)  
**Previous notes:** [01 — Basic](01-qa-basic.md)  
**Status:** Theory and example test designs only. No Day 13 tests, defects, or UAT sessions are claimed as executed.

## Official Intermediate syllabus

The foundation programme specifies five topics:

1. **Concurrency and race conditions:** two users editing the same record; double submissions.
2. **State and caching:** stale data after updates; logout and Back-button behaviour.
3. **Integrations:** payment gateways, email and SMS, webhooks; third-party failures and timeouts.
4. **File handling:** large files, wrong formats, renamed extensions and interrupted uploads.
5. **UAT support:** preparing the client, reproducing client issues and confirming fixes.

The examples below expand these syllabus points for study. They use a **hypothetical booking/CRM application**, not actual defects or approved requirements from the company project. Always derive definitive expected behaviour from the product's BRD/PRD, API contracts and team decisions.

---

## 1. Concurrency and race conditions

### 1.1 Meaning

**Concurrency** means multiple operations happen in overlapping time windows.  
A **race condition** occurs when the result incorrectly depends on their timing or interleaving.

A feature may pass for one user but fail when two users act on the same data at nearly the same time.

### 1.2 Two users edit the same record

**Scenario:** Agent A and Agent B both open the same lead showing status `New`.

1. A changes the status to `Contacted`.
2. B, still viewing the old version, changes the status to `Qualified`.
3. Both click Save.

**Potential problems:** silent lost updates, overwritten notes, incorrect audit history or conflicting UI state.

**Possible designed behaviours (confirm with PM/engineering):**
- **Optimistic concurrency:** reject the second stale write with a version conflict and ask the user to refresh.
- **Defined last-write-wins:** explicitly accept the most recent write, with adequate audit information.
- **Field-level merge:** combine independent changes when supported.

QA must **not assume** one strategy is correct without a requirement.

**TC-CON-01 — Concurrent edit conflict**
- Preconditions: two authorized test users, one shared editable test record, starting version known.
- Steps: open the same record in two sessions; save a change in A; save a conflicting stale change in B.
- Expected: exactly the documented conflict/merge policy; no unnoticed corruption; UI reflects authoritative saved state.
- Evidence: timestamps, both sessions, API status/responses and final stored value.
- Execution: **Not run**.

### 1.3 Double submission

**Scenario:** Customer double-clicks `Confirm Booking` or a request is retried after a slow response.

**Risk:** two reservations, duplicate payment, duplicate confirmation email, or duplicate processing.

**Typical safeguards, where required:** disabled submission while pending, server-side idempotency keys, uniqueness constraints and transactional updates. UI disabling by itself is not sufficient protection.

**TC-CON-02 — Double booking submission**
- Submit the same request twice quickly using authorized test data.
- Verify the system produces the intended single business transaction or explicitly handles duplicates as defined.
- Check stored records, external transaction identifiers and notifications.
- Execution: **Not run**.

**TC-CON-03 — Two customers request one remaining slot**
- Prepare exactly one available test appointment slot.
- Have two sessions attempt to reserve it at nearly the same time.
- Expected for an exclusive slot: at most one confirmed booking; the other request receives a clear result.
- Execution: **Not run**.

**Test techniques:** two browser profiles, two test accounts, synchronized manual actions, or controlled test scripts in a staging environment. Do not use live payment/booking services without approval.

---

## 2. State and caching

### 2.1 State versus cache

- **Application state:** current values of the user session, UI form, selected record, booking status or workflow.
- **Cache:** a stored copy of data used to improve performance. Cached data can become out of date if it is not refreshed or invalidated.

### 2.2 Stale data after an update

**Scenario:** An admin edits a lead's phone number. The detail page updates, but the list page still displays the old value.

Checks:
1. Save the update.
2. Return to the list and search for the same record.
3. Refresh or reopen in another session.
4. Inspect network responses and the agreed consistency window.
5. Compare rendered values with authoritative data using approved access.

**TC-STATE-01 — Updated lead is reflected across views**
- Expected: list/detail views eventually or immediately agree **within the time defined by requirements**.
- Execution: **Not run**.

### 2.3 Logout and browser Back

**Scenario:** A user visits a protected lead page, logs out and presses Back.

**Expected security property:** A logged-out user must **not** regain authenticated access or perform protected operations. Sensitive information must be handled according to the app's session and cache policy.

Distinguish:
- A browser showing a **previously cached visual snapshot**, from
- The server/API actually accepting a **new unauthorized request**.

Do not call any historical browser rendering a confirmed vulnerability without evaluating the risk and required caching policy.

**TC-STATE-02 — Protected action after logout**
- Login and visit an authorized test page.
- Logout, then use Back and attempt a protected action.
- Verify the action is rejected and session tokens cannot be reused as specified.
- Execution: **Not run**.

### 2.4 More state edge cases

- Two open tabs after a role change.
- Form values persisting after cancel.
- Browser refresh halfway through a multi-step checkout.
- Stale inventory/availability after another user books.
- Session expiration while confirmation is pending.

---

## 3. Integration testing

An integration crosses the boundary between your application and another system. Test **happy paths, delayed responses, duplicate events, outages and recovery**, not only successful API responses.

### 3.1 Payment gateway (authorized sandbox only)

**Typical sequence:** Create order → initiate sandbox payment → receive gateway response/webhook → update order → show final status → send confirmation.

Potential failures:
- Gateway call times out, but the payment actually succeeds.
- The webhook arrives twice.
- Webhook arrives before the browser redirect.
- Gateway says declined while UI shows Paid.
- Callback signature fails validation.
- A retry creates a second charge instead of reconciling the existing transaction.

**TC-INT-01 — Duplicate payment webhook**
- In an approved test environment, replay an authorized fixture webhook according to the team's test procedure.
- Expected: exactly one business-level payment completion; no double credit or duplicated side effect.
- Execution: **Not run**.

**TC-INT-02 — Payment pending after gateway timeout**
- Simulate the gateway timeout using a sandbox/mock.
- Expected: no invented success state; the final status follows the product's reconciliation/timeout rules.
- Execution: **Not run**.

### 3.2 Email and SMS

Check:
- Valid vs. invalid contact destinations.
- Provider acceptance vs. actual delivery (these are different states).
- Rate limits, queueing, retry policies and duplicate sends.
- Template variable substitution and missing fallback values.
- Opt-out or consent enforcement, where applicable.

**TC-INT-03 — Notification provider unavailable**
- Simulate a provider outage in an approved test environment.
- Expected: transaction and message status follow defined retry/fallback rules; no silent loss or unintended duplicate send.
- Execution: **Not run**.

### 3.3 Webhooks, timeouts and third parties

For an inbound webhook, inspect:
- Authentication/signature validation.
- Required fields and schema validation.
- Duplicate-event/idempotency handling.
- Out-of-order delivery and retries.
- Logged failure reasons without secrets.

For an outbound webhook:
- Delivery status, retry/backoff, eventual recovery and deduplication.

**Remember:** HTTP `202 Accepted` may mean only **accepted for processing**, not business operation completed. Confirm actual asynchronous state.

---

## 4. File handling

Uploads are an important edge-case surface, especially when a product accepts CSV files, attachments or images.

### 4.1 File test matrix

| Input or event | Example QA question |
| --- | --- |
| Empty file | Does the app reject it with an understandable error? |
| Boundary size | What happens immediately below, at and above the documented limit? |
| Very large file | Is it rejected or safely streamed without UI freeze or server failure? |
| Unsupported extension | Is the file type validated according to the specification? |
| Renamed extension | Does the backend verify real content/type, not trust the name alone? |
| Wrong delimiter/encoding | Does import fail clearly or parse according to documented support? |
| Duplicate upload | Does the import create unintended duplicate records? |
| Interrupted network | Does the UI offer safe retry/recovery without corrupt or partial data? |
| Filename with spaces/Unicode | Does filename handling work correctly? |
| Same filename, different content | Is replacement/versioning behaviour consistent? |

**TC-FILE-01 — Unsupported actual file type**
- Use a harmless synthetic file whose extension does not match its content.
- Expected: validation/handling matches the documented allowed content types; no unsafe processing.
- Execution: **Not run**.

**TC-FILE-02 — Upload interrupted mid-transfer**
- Use a network-throttling/disconnect scenario on a test environment.
- Expected: explicit error/retry state; no silently corrupted or committed partial import.
- Execution: **Not run**.

Do not upload production contact exports, private customer data or malicious payloads to public services for practice.

---

## 5. User Acceptance Testing (UAT) support

### 5.1 Purpose

**UAT** checks whether the delivered application meets users' agreed business needs. QA helps the business users test realistically; QA does not simply decide business acceptance on their behalf.

### 5.2 Before UAT — Prepare

- Confirm UAT scope, environment and build/version.
- Prepare realistic **synthetic** test accounts and representative data.
- Ensure prerequisite integrations, roles and feature flags are configured.
- Map business scenarios to acceptance criteria.
- Explain how users should record actual outcomes and defects.
- Agree on entry/exit criteria, support channels and decision owners.

### 5.3 During UAT — Assist and reproduce

When a client reports a problem, collect:
- User role and environment.
- Reproduction steps, input data and timestamps.
- Expected business outcome and actual result.
- Sanitized screenshots, request IDs and logs if approved.
- Frequency and severity/business impact.

Reproduce in a controlled environment. Differentiate a genuine defect, a requirement gap and a misunderstanding of intended behaviour.

### 5.4 After UAT — Confirm fixes

1. Link the defect to the relevant acceptance criterion.
2. Confirm engineering's reported fix and deployed build.
3. Retest the original scenario.
4. Run relevant regression tests.
5. Obtain business confirmation where required.
6. Record final outcome and outstanding issues for sign-off.

**TC-UAT-01 — Retest a client-reported booking issue**
- Prepare the exact approved scenario and build.
- Reproduce the original steps and verify a fix.
- Attach sanitized proof and business confirmation when needed.
- Execution: **Not run**.

---

## 6. Day 13 assignment preparation — example edge-case inventory

**Official assignment (page 18):** For a **sample payment or booking flow**, identify **at least 10 technically deep edge cases** across concurrency, caching, integrations, failure and permissions. Test as many as possible and write a test summary report.

The following **12 suggested cases** are design ideas for a hypothetical booking app. Their expected outcomes must be checked against the actual chosen sample app and acceptance criteria.

| ID | Area | Edge case / risk | Desired property to verify | Status |
| --- | --- | --- | --- | --- |
| EC-01 | Concurrency | Two users reserve the last slot | No overbooking | Not run |
| EC-02 | Concurrency | User double-clicks Confirm | No unintended duplicate booking | Not run |
| EC-03 | Concurrency | Two editors change the same reservation | Defined conflict policy, no silent corruption | Not run |
| EC-04 | Caching | Availability cached after slot was booked | Accurate availability within defined consistency window | Not run |
| EC-05 | Caching/session | Logout then Back then confirm | No unauthorized new operation | Not run |
| EC-06 | Integration | Payment webhook delivered twice | No duplicate payment completion | Not run |
| EC-07 | Integration | Payment gateway times out after accepting payment | Reconciliation produces correct final state | Not run |
| EC-08 | Integration | Confirmation SMS/email service unavailable | Documented retry/failure state | Not run |
| EC-09 | Failure | Network disconnect during booking | Clear final/unknown state and safe retry | Not run |
| EC-10 | Failure | Server returns 500 during confirmation | No false successful state or silent duplicate | Not run |
| EC-11 | Permissions | User attempts to modify another user's booking | Unauthorized request rejected | Not run |
| EC-12 | Permissions | Read-only account attempts to cancel a booking | Cancellation denied and record preserved | Not run |

**Do not mark these PASS/FAIL until executed.** A complete assessment later needs evidence, actual result, deviations/defects and a test summary.

### Simple test execution sheet columns
`Test ID | Requirement | Preconditions | Steps | Expected | Actual | Status | Severity (if defect) | Evidence/Jira | Environment/Build`

### Test summary template

- Application and build:
- Environment and test data:
- Scope and requirements:
- Planned / executed / passed / failed / blocked / not run:
- Confirmed defects and links:
- Coverage gaps and risks:
- Release recommendation and rationale:
- Tester and date:

---

## 7. Quick revision questions

1. What makes a race condition different from normal sequential editing?
2. Why is disabling a Submit button insufficient protection against duplicates?
3. How would you distinguish a stale UI cache from an incorrect backend response?
4. What must remain impossible after logout?
5. Why can gateway timeout not always be treated as failed payment?
6. What if an incoming webhook arrives twice?
7. How do you test files renamed to an allowed extension?
8. What evidence should be collected when upload is interrupted?
9. How does QA prepare test data and scope for UAT?
10. Who verifies the technical fix, and when is business acceptance still needed?

## Source

- RoBenDevs QA Engineer Internship — **14-Day Foundation Programme**, page 17 (Intermediate topics), page 18 (Day 13 assignment).
