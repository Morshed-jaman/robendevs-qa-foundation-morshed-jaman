# Day 12 — Advanced: Stress/Spike Testing, Authorization, and WCAG Validation

**Programme:** RoBenDevs QA Engineer Internship — 14-Day Foundation Programme  
**Study date:** 24 November 2026  
**Level:** Advanced  
**Source:** Official Foundation Programme, Day 12, page 17  
**Previous lessons:** [01 — Basic](01-qa-basic.md) · [02 — Intermediate](02-qa-intermediate.md)

> **Learning notes, not executed assessment evidence.** These examples are general training material. No load/stress run, authorization penetration test, accessibility audit, Jira bug, or verified defect is claimed.

## 1. Advanced objectives

The official Day 12 Advanced syllabus covers:

1. **Stress and spike testing:** Identify the system's breaking point and how it recovers.
2. **Authorization testing:** Verify role-based access and privilege escalation controls.
3. **WCAG criteria:** Map accessibility issues to specific accessibility requirements.

These build on Day 12 Basic performance/security/accessibility terminology and Intermediate k6, input validation, session handling, Lighthouse/axe and compatibility testing.

## 2. Stress and spike testing

### 2.1 Load vs. stress vs. spike

| Type | Purpose | Example (illustrative) |
| --- | --- | --- |
| **Load test** | Observe behaviour at an expected workload. | Increase gradually to the agreed 20 virtual-user baseline. |
| **Stress test** | Increase beyond expected capacity to see when service levels degrade or fail. | Gradually exceed the approved workload while watching errors and latency. |
| **Spike test** | Observe the impact of a sudden increase or decrease in traffic. | Jump rapidly from normal traffic to an approved peak, then return to normal. |

Stress testing is not just looking for an error. Also record **the onset of degradation, error types, resource pressure, and recovery once demand returns to normal**.

A spike can uncover queue backlogs, connection-pool exhaustion, rate-limit issues, or delayed recovery that a gradual test may miss.

### 2.2 What QA should measure

- **Response-time percentiles** such as p95 and p99, not only the average.
- **Throughput** (completed requests per second) and whether it stops scaling.
- **Request failure rate** and the types of failures.
- **System signals** such as CPU, memory, queue depth and database connections *when available*.
- **Recovery:** How long it takes for errors and latency to return to normal after load decreases.
- **Data safety:** No duplicate or missing operations after retries or failures.

### 2.3 Example k6 configurations (teaching examples only)

Gradual stress pattern:

```javascript
export const options = {
  stages: [
    { duration: '20s', target: 2 },
    { duration: '30s', target: 5 },
    { duration: '30s', target: 10 },
    { duration: '20s', target: 0 },
  ],
};
```

Sudden spike pattern:

```javascript
export const options = {
  stages: [
    { duration: '20s', target: 2 },
    { duration: '1s', target: 10 },
    { duration: '20s', target: 10 },
    { duration: '1s', target: 2 },
    { duration: '20s', target: 2 },
    { duration: '10s', target: 0 },
  ],
};
```

These are **options snippets**, not standalone scripts. A runnable script also needs an `export default function` with real authorized test actions. The numbers are intentionally small but **even low loads require permission**. Do not run these against a public API or live company service without documented approval, a safe environment, monitoring and agreed stopping criteria.

### 2.4 Recovery example

```text
Normal traffic
    |
    v
Higher load -> increasing latency
    |
    v
Overload -> errors / queue buildup
    |
    v
Load reduced
    |
    v
Observe recovery: latency, errors, queues and data consistency
```

**QA report template:** Test objective; environment/build; approved load profile; duration; sample data; throughput; p95/p99; error rate; peak symptoms; recovery time; logs/screenshots; requirements comparison; risks and follow-ups.

## 3. Authorization testing

**Authentication:** Who are you?  
**Authorization:** What are you allowed to do?

Role-based access control (RBAC) assigns permissions by role. A UI button being hidden is **not** sufficient security; the backend must enforce authorization even when an API endpoint is called directly.

### 3.1 Beginner role-based test matrix (hypothetical)

| Operation | Admin | Manager | Agent |
| --- | --- | --- | --- |
| Manage all user roles | Allowed | Denied | Denied |
| View team performance | Allowed | Allowed | Denied unless authorized |
| View only assigned leads | Allowed | As permitted | Allowed |
| Read restricted leads from another tenant | Denied | Denied | Denied |

Actual permissions must come from the project's approved BRD/role matrix; **this table is an illustration, not a specification for any particular product**.

### 3.2 Privilege-escalation risks to think about

- **Vertical escalation:** A normal user tries to perform an administrator-only operation.
- **Horizontal escalation:** A user tries to access another user’s private resources at the same permission level.
- **Cross-tenant access:** A user from Company A attempts to access Company B's records.
- **Stale permissions:** A user's revoked role or deactivated account still allows protected operations.
- **UI/API mismatch:** The UI restricts an action, but a backend request incorrectly permits it.

Use only accounts, fixtures and endpoints provided for an authorized testing exercise. Verify access via expected status codes, data isolation and audit logs. Never reuse real user tokens or attempt escalation against an unapproved service.

### 3.3 Example test-case format

| ID | Scenario | Expected result |
| --- | --- | --- |
| AUTHZ-01 | Agent opens an approved own-record detail page | Access allowed |
| AUTHZ-02 | Agent requests a different tenant's record with test credentials | Access denied; no foreign data returned |
| AUTHZ-03 | Agent attempts an admin-only operation in an approved environment | Server rejects it; UI does not suggest permission was granted |
| AUTHZ-04 | Deactivated test account sends an authenticated API request | Rejected according to the defined session/revocation policy |
| AUTHZ-05 | Allowed role changes a setting | Action succeeds and is audited where required |

These are **test design ideas**; specific expected HTTP codes, messages and audit requirements must be taken from the actual project requirements.

## 4. Mapping accessibility findings to WCAG

WCAG = **Web Content Accessibility Guidelines**. For every accessibility concern, QA should identify the relevant **success criterion**, its conformance level (A/AA/AAA), and the observed user impact. Avoid treating a Lighthouse or axe score as complete WCAG compliance.

Examples from **WCAG 2.2**:

| Observed issue | Relevant criterion | Level | Example expected behaviour |
| --- | --- | --- | --- |
| Input has no accessible label | **1.3.1 Info and Relationships** / **3.3.2 Labels or Instructions**, depending on the exact issue | A | Field's purpose is programmatically available; instructions present when required |
| Insufficient regular text contrast | **1.4.3 Contrast (Minimum)** | AA | Normal text generally meets 4.5:1 contrast; exceptions apply |
| Feature cannot be operated with keyboard | **2.1.1 Keyboard** | A | Functionality is available through a keyboard interface |
| Keyboard focus is not visually apparent | **2.4.7 Focus Visible** | AA | A visible indicator shows the focused control |
| Missing meaningful name for interactive control | **4.1.2 Name, Role, Value** | A | Assistive technology can determine the control's name and role |
| Input error is shown only by red colour | **1.4.1 Use of Color** and possibly **3.3.1 Error Identification** | A | Error is communicated beyond colour and identified in text where applicable |

**Mapping caution:** A single issue can implicate more than one criterion; select only those actually supported by the observed failure. A visual label issue is not always automatically a violation of every listed criterion.

### 4.1 Suggested QA investigation workflow

1. Run Lighthouse/axe on an **authorized** page to identify candidates.
2. Verify manually using keyboard navigation and relevant assistive technology.
3. Note affected component, page, browser, viewport and reproduction steps.
4. Record **expected vs. actual** behaviour and identify the justified WCAG criterion.
5. Attach a sanitized screenshot and minimal supporting evidence in the team's bug tracker.
6. Retest the fix on relevant browsers and input methods.

## 5. How this applies to the official Day 12 assignment

The programme asks for a real k6 sample-API load test with measured results, an accessibility audit, a security checklist on a sample application, validated findings in Jira, and CP-5 slides for Days 11–12.

A useful assessment evidence package would have:

- k6 script and run command, environment, summary output and observations.
- Security checklist with test accounts/scenarios and actual findings, if any.
- Accessibility report with tool output and manually confirmed WCAG mappings.
- Jira bug links only for **verified** issues, not hypothetical examples.

**Current status:** Day 12 Advanced **theory documented**. Actual testing, Jira findings and the official Day 12 assessment are still pending.

## 6. Revision questions

1. What is the difference between load, stress and spike testing?
2. Why do p95 latency and error rate matter when load increases?
3. What should be observed after stress or spike load is removed?
4. Why is hiding an admin button insufficient authorization?
5. How do horizontal escalation and vertical escalation differ?
6. What evidence is needed to connect an accessibility issue to a WCAG success criterion?

## References

- RoBenDevs QA Engineer Internship — 14-Day Foundation Programme, Day 12 Advanced, page 17.
- [Grafana k6 — Test Types](https://grafana.com/docs/k6/latest/testing-guides/test-types/)
- [Grafana k6 — Ramping VUs](https://grafana.com/docs/k6/latest/using-k6/scenarios/executors/ramping-vus/)
- [OWASP Web Security Testing Guide](https://owasp.org/www-project-web-security-testing-guide/)
- [W3C WCAG 2.2](https://www.w3.org/TR/WCAG22/)
