# Day 12 — Intermediate: k6 Load Testing, Security Checks, Accessibility Tools and Compatibility

**Programme:** RoBenDevs QA Engineer Internship — 14-Day Foundation Programme  
**Study date:** 23 November 2026  
**Level:** Intermediate  
**Syllabus reference:** Official Foundation Programme, Day 12, pages 16–17  
**Previous lesson:** [01 — Basic](01-qa-basic.md)

> **Study notes and examples only.** No k6 load test, security test, accessibility audit, compatibility run, Jira finding, or Day 12 assessment result is claimed here.

## 1. Learning objectives

The official Day 12 Intermediate syllabus includes:

1. **Load testing with k6:** Write a simple script, ramp up virtual users and read the results.
2. **Security checks:** Input validation, XSS and SQL injection testing in *authorized test environments*, plus session handling.
3. **Accessibility tools:** Use Lighthouse and the axe browser extension.
4. **Compatibility:** Evaluate different browsers, operating systems and screen sizes.

## 2. Load testing with k6

**Load testing** examines how a system behaves under an expected or planned workload. **k6** is a load-testing tool that runs scripts simulating **virtual users (VUs)**.

- **VU:** An independently executing simulated user; not necessarily one HTTP request per second.
- **Ramping:** Gradually increase/decrease concurrent VUs to see how behaviour changes.
- **Iteration:** One complete execution of the script's default function by one VU.
- **Checks:** Assertions on returned responses; a failed check does not by itself necessarily fail the overall run.
- **Thresholds:** Explicit performance/correctness acceptance conditions. Failed thresholds can make the k6 run fail.

### 2.1 Demonstration k6 script (not executed)

Create `load-test.js` for a **local test service** you own, or an environment where load generation has been explicitly authorized:

```javascript
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '10s', target: 1 },
    { duration: '20s', target: 3 },
    { duration: '10s', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<1000'],
    http_req_failed: ['rate<0.01'],
  },
};

export default function () {
  const baseUrl = __ENV.BASE_URL;
  if (!baseUrl) throw new Error('BASE_URL is required');

  const response = http.get(`${baseUrl}/health`);
  check(response, {
    'Status is 200': (r) => r.status === 200,
  });
  sleep(1);
}
```

**Assumptions:** `BASE_URL` points to an authorized local/test environment that actually exposes a GET `/health` endpoint. The durations, VU counts and thresholds are small illustrative teaching choices, **not** project acceptance requirements. Even a small test should only be run with permission.

### 2.2 Example run command (only when a suitable service exists)

In PowerShell, using an **authorized local service**:

```powershell
k6 version
k6 run --env BASE_URL=http://127.0.0.1:3000 load-test.js
```

The command above is an example; `k6` must be installed, and the application and endpoint must exist before running it. Do **not** use a real company CRM or a third-party production API without explicit permission.

### 2.3 Reading the summary

| k6 field | What QA learns |
| --- | --- |
| `http_req_duration` | Duration of HTTP requests, including percentiles such as `p(95)` |
| `http_req_failed` | Rate of HTTP requests considered failed |
| `http_reqs` | Total HTTP requests and request rate |
| `checks` | Percentage of checks that passed |
| `vus` / `vus_max` | Active / configured virtual users |
| `iterations` | Number of completed script iterations |

**Example interpretation (hypothetical, not observed):** If `p(95) = 750 ms`, then roughly 95% of measured request durations were at or below 750 ms. Compare this and error rate against the *agreed* acceptance criteria, and identify whether failures came from the app, network, or test setup.

## 3. Security checks in approved test environments

### 3.1 Input validation

Check whether forms and APIs accept valid input and reject invalid input with appropriate feedback.

Examples for a synthetic CRM customer form:

| Condition | Expected behaviour |
| --- | --- |
| Required name is empty | Clear field-level validation error |
| Email address is malformed | Input is rejected appropriately |
| Input exceeds defined maximum length | Input is handled per requirements without corruption |
| API receives an unsupported data type | Safe, documented error response |
| Special characters appear in a legitimate name | Input is handled safely and accurately |

Client-side validation is helpful for usability, but server-side validation must also enforce the rules.

### 3.2 Cross-site scripting (XSS)

**Risk:** Untrusted user-provided content is interpreted as executable browser content instead of inert data.

At a tester's level, verify that fields displaying user-entered values handle special characters safely and don't turn plain text into executable content. Use only deliberately authorized test pages and benign inputs; do not probe a live customer system.

### 3.3 SQL injection

**Risk:** Untrusted input changes the meaning of a database query when the application constructs SQL unsafely.

At a tester's level, verify that the application's input handling and server error responses are robust. The development team's use of parameterized queries is a primary defense. Security-specific injection attempts belong only in an explicitly approved testing environment under an agreed procedure.

### 3.4 Sessions and authentication

Session-management test ideas for an approved staging account:

- Log out, then confirm the previous authenticated session is no longer valid.
- Confirm protected pages and APIs reject unauthenticated requests.
- Check that one user cannot view another user's restricted data.
- Check that sessions expire according to policy and the UI responds appropriately.
- Test browser Back after logout without assuming cached content represents a server-side authorization failure.

**Reporting:** Record the affected environment, role, expected vs. actual result, steps and supporting evidence; avoid storing real credentials or session tokens in reports.

## 4. Accessibility audit tools

### 4.1 Chrome DevTools Lighthouse

**Lighthouse** provides automated audits including accessibility.

Suggested learning workflow:

1. Open a public demo page or an authorized local test page in Chrome.
2. Press `F12` → open **Lighthouse** (look in additional DevTools panels if hidden).
3. Choose **Accessibility** and generate an audit report.
4. Review findings; verify whether each potential issue is real.
5. Record the affected element, what users might experience and supporting evidence.

An accessibility score is **not** proof that a page fully meets WCAG or works for all users.

### 4.2 axe DevTools browser extension

**axe DevTools** can analyze a page against automated accessibility rules.

Suggested learning workflow:

1. Install the legitimate axe DevTools browser extension from its official publisher.
2. Open an authorized test page and browser DevTools.
3. Open **axe DevTools**, run an analysis and review the issues.
4. For each finding, inspect the affected element and confirm the actual problem.
5. Report only validated issues.

Axe and Lighthouse are useful, but manual keyboard testing and real screen-reader checks remain important.

### 4.3 Beginner manual accessibility checks to combine with tools

| Area | QA check |
| --- | --- |
| Keyboard | Can the user navigate via Tab and Shift+Tab? Is focus visible? |
| Input labels | Do fields have meaningful accessible names? |
| Colour contrast | Does the measured contrast meet the agreed WCAG criteria? |
| Screen reader | Are control purpose and state announced intelligibly? |
| Error messages | Are errors understandable and discoverable without colour alone? |

## 5. Compatibility testing

**Compatibility testing** checks whether the same functionality behaves as expected across supported:

- **Browsers:** Chrome, Edge, Firefox and/or Safari, as required.
- **Operating systems:** Windows, macOS, Android, iOS, etc., as required.
- **Screen sizes:** Desktop, tablet and mobile viewports.

A suggested small **planning matrix**, not executed test evidence:

| Scenario | Browser | Platform | Viewport | Expected check |
| --- | --- | --- | --- | --- |
| CRM login | Chrome | Windows | Desktop | Form usable and correct |
| CRM login | Firefox | Windows | Desktop | Equivalent functional behaviour |
| CRM login | Edge | Windows | Desktop | Equivalent functional behaviour |
| CRM login | Mobile browser | Approved test device | Mobile | Layout and controls usable |

**Important:** Browser viewport emulation does not fully prove compatibility with a real operating system or physical phone. Record exactly what was tested.

## 6. How this leads into the official Day 12 assessment

The programme's practical assignment requires:
- Running k6 on a sample API and summarizing the **actual** results.
- Performing an accessibility audit and basic security checklist on a sample application.
- Recording confirmed findings in Jira.
- Submitting the k6 script, results, and findings in `day-12-non-functional`, plus CP-5 slides for Days 11–12.

**Current status:** Only Day 12 Basic and Intermediate **study notes** have been written. No test results, pass claims or Jira bugs are recorded in this lesson.

## References

- Official RoBenDevs QA Engineer Internship — 14-Day Foundation Programme, Day 12, pages 16–17.
- [Grafana k6: Running k6](https://grafana.com/docs/k6/latest/get-started/running-k6/)
- [Grafana k6: Thresholds](https://grafana.com/docs/k6/latest/using-k6/thresholds/)
- [Grafana k6: Metrics](https://grafana.com/docs/k6/latest/using-k6/metrics/reference/)
- [Chrome DevTools: Accessibility](https://developer.chrome.com/docs/devtools/accessibility/reference)
- [Deque axe DevTools](https://www.deque.com/axe/devtools/extension/)
