# Day 6 — Practical Assessment: DevTools Investigation of Five Web Actions

**Programme:** RoBenDevs QA Engineer Internship — 14-Day Foundation Programme  
**Topic:** Web Foundations for Testers — Network, Console, Throttling and Storage  
**Prepared:** 16 November 2026  
**Application candidate:** [OrangeHRM Open-Source Demo](https://opensource-demo.orangehrmlive.com/)  
**Status:** **IN PROGRESS — STARTER TEMPLATE, 0/15 ACTION RUNS VERIFIED**

> **Evidence integrity:** The official Day 6 assignment requires inspecting **five user actions**, recording requests/status codes and Console errors, and repeating those flows under **network throttling** and **cleared browser storage**. The rows below are **NOT RUN** until I actually use DevTools and record results. My earlier [QP-2 login investigation](https://g-team-qfw281wn.atlassian.net/browse/QP-2) is historical practice, **not a fresh Day 6 baseline measurement**. No screenshots or performance numbers are claimed as captured yet.

## 1. Official Task and Submission Requirements

According to the RoBenDevs Foundation Programme (Day 6, PDF pages 11–12), I must:

1. Pick a live web application.
2. For **five user actions**, record relevant browser **Network requests, HTTP status codes and Console errors**.
3. Repeat the **same flows** under **throttled network** conditions.
4. Repeat the flows with **browser storage cleared**.
5. Save actual findings and screenshots in `day-06-web-foundations/`.
6. Prepare **CP-2 slides covering Days 4–6** in the `presentations/` folder.

The site is a **public practice demo**. I will use its supported demo account, avoid destructive actions, and redact passwords, cookies, authorization headers, customer identifiers, and other sensitive data.

**Related learning notes:** [Basic](01-qa-basic.md) · [Intermediate](02-qa-intermediate.md) · [Advanced](03-qa-advanced.md).

## 2. Selected Application and Environment

| Field | Value |
| --- | --- |
| Application | OrangeHRM Open-Source Demo |
| URL | https://opensource-demo.orangehrmlive.com/ |
| Browser | Microsoft Edge / Chrome — **exact version to record** |
| OS | Windows — **version to record** |
| Test date/time | **To record for actual run (including timezone)** |
| Account | Public demo/test account; **never paste its password into the report** |
| Environment/build | Live public demo; build/version **if displayed** |
| Baseline network | DevTools `No throttling` — to verify in the actual run |
| Throttled network | Named DevTools profile and its settings — to record |
| Storage reset | Target origin and specific cleared categories — to record |
| Data policy | Use non-destructive navigation/search actions |

**Site note:** The app's current UI and endpoints can change. I must select the actions actually available during my execution.

## 3. Five Selected User Actions

| Action ID | User action | Expected observation / investigation scope |
| --- | --- | --- |
| **ACT-01** | Submit a valid demo login | Login POST or other authentication-related requests; redirect/navigation; actual user-visible result |
| **ACT-02** | Open the dashboard | Document and relevant requests; dashboard rendering; Console errors if any |
| **ACT-03** | Open the PIM/employee section **if available** | Navigation/API requests; employee list visibility |
| **ACT-04** | Search for an employee in the authorized demo UI | Relevant search requests and results; no data modification |
| **ACT-05** | Log out | Logout request/navigation; whether fresh protected access is handled according to the demo's behaviour |

**Important:** One user action may produce several requests. I will record the **relevant request(s)**, not assume a single request or that every action uses a POST/GET endpoint with a predetermined URL.

## 4. DevTools Setup (Repeat for Each Condition)

1. Open the selected application in a browser.
2. Press **F12** → **Network**.
3. Ensure recording is enabled; turn on **Preserve log** to retain navigation/redirect requests.
4. Keep **Disable cache** off for the baseline unless specifically comparing cache behaviour; record any exceptions.
5. Open **Console** before the action and note errors produced during that action (or **None observed** after actually checking).
6. Perform exactly one planned user action.
7. Select its relevant request(s): **Headers → General** for URL, method and status; inspect **Response/Timing** only if needed.
8. Record the visible result and capture a **readable sanitized screenshot** showing the Network row and request headers/status.
9. Record Console error/warning text **only if actually observed**, without secrets.
10. Repeat for the next action, preserving the intended login state.

**Reminder:** A `302` redirect can be a valid part of login. A `200 OK` response does not guarantee correct data or UI behaviour.

## 5. Run A — Normal Network (Baseline)

**Setup:** `No throttling`, normal existing site storage unless otherwise documented. Log in first; logout last.

| Action | Relevant request(s) | Method & HTTP status | Actual UI observation | Console errors | Evidence | Status |
| --- | --- | --- | --- | --- | --- | --- |
| ACT-01 — Login | — | — | — | Not checked | — | **NOT RUN** |
| ACT-02 — Dashboard | — | — | — | Not checked | — | **NOT RUN** |
| ACT-03 — PIM | — | — | — | Not checked | — | **NOT RUN** |
| ACT-04 — Employee search | — | — | — | Not checked | — | **NOT RUN** |
| ACT-05 — Logout | — | — | — | Not checked | — | **NOT RUN** |

**Baseline findings:** Not yet observed.

## 6. Run B — Throttled Network

**Setup:** DevTools **Network → Throttling**, choose one explicit preset (such as a supported slower-network profile), and **record the exact selected profile**. Repeat the five actions in the same order. If the profile changes between actions, document that clearly.

| Action | Relevant request(s) | Method & HTTP status / transport failure | Loading & UI difference vs baseline | Console errors | Evidence | Status |
| --- | --- | --- | --- | --- | --- | --- |
| ACT-01 — Login | — | — | — | Not checked | — | **NOT RUN** |
| ACT-02 — Dashboard | — | — | — | Not checked | — | **NOT RUN** |
| ACT-03 — PIM | — | — | — | Not checked | — | **NOT RUN** |
| ACT-04 — Employee search | — | — | — | Not checked | — | **NOT RUN** |
| ACT-05 — Logout | — | — | — | Not checked | — | **NOT RUN** |

**Profile name:** Not selected  
**Profile configuration (if visible):** Not recorded  
**Slow-network findings:** Not yet observed.

**QA interpretation:** Slowness alone is not necessarily a defect. Check whether loading/error states are acceptable and whether final actions succeed or fail appropriately.

## 7. Run C — Cleared Browser Storage

**Setup:** Return throttling to `No throttling`; before the run, use **Application → Storage / Clear site data** (or equivalent) for the test origin. Record **exactly which categories** were cleared. Clearing cookies may log the user out; this is expected to change the starting state and may be necessary for ACT-01. Do not clear unrelated websites' data.

| Action | Relevant request(s) | Method & HTTP status | Storage/login state & actual UI observation | Console errors | Evidence | Status |
| --- | --- | --- | --- | --- | --- | --- |
| ACT-01 — Login | — | — | — | Not checked | — | **NOT RUN** |
| ACT-02 — Dashboard | — | — | — | Not checked | — | **NOT RUN** |
| ACT-03 — PIM | — | — | — | Not checked | — | **NOT RUN** |
| ACT-04 — Employee search | — | — | — | Not checked | — | **NOT RUN** |
| ACT-05 — Logout | — | — | — | Not checked | — | **NOT RUN** |

**Storage categories cleared:** Not recorded  
**Cache also cleared?:** Not recorded  
**Cleared-storage findings:** Not yet observed.

**QA interpretation:** A redirect back to login after clearing auth cookies can be expected. Only report a bug if actual behaviour violates an established requirement.

## 8. Individual Evidence Record Template

Use this for each of the **15 planned runs**.

```markdown
### RUN-[A/B/C]-ACT-[01–05] — [Action name]
- Test date/time/timezone:
- App URL / environment:
- Browser and version:
- Network profile:
- Storage/cache condition:
- Preconditions:
- Steps actually performed:
- Visible UI result:
- Important Network request path(s):
- Method / status code(s), or transport failure:
- Relevant response observations:
- Console errors/warnings (exact, sanitized; or none observed):
- Expected behaviour / requirement:
- Result (PASS / FAIL / BLOCKED / NOT RUN):
- Screenshot filename(s):
- Jira bug key (only if independently confirmed):
- Notes / uncertainties:
```

**Screenshots:** Suggested directory `day-06-web-foundations/evidence/`, with filenames such as `RUN-A_ACT-01_login-network.png`. Names are proposed only; files **do not exist** until captured.

### Screenshot quality

- Include enough of the webpage to identify the action.
- In Network show the selected request **Headers → General** when documenting method/status.
- In Console show the relevant error and context, **if present**.
- Crop/redact tokens, cookies, passwords, private URLs and personal information.
- Do not label an unverified screenshot as proof of an unrelated action.

## 9. Final Findings and Comparison (Fill After Testing)

| Check | Baseline | Throttled | Storage cleared |
| --- | --- | --- | --- |
| Completed actions | 0/5 | 0/5 | 0/5 |
| Observed login behaviour | Pending | Pending | Pending |
| Main UI differences | Pending | Pending | Pending |
| Console errors | Not checked | Not checked | Not checked |
| Recorded request statuses | Pending | Pending | Pending |
| Real defects confirmed | **None established yet** | **None established yet** | **None established yet** |

**Analysis questions:** Did the same request sequence appear under each condition? Were redirects legitimate? Did slow loading change messages or cause timeouts? Did cleared storage change login state? Were observed errors reproducible? Which differences are explained by normal browser behaviour?

## 10. Completion Checklist

- [ ] Confirm app and exact browser version.
- [ ] Complete ACT-01 through ACT-05 under normal conditions.
- [ ] Record requests/status codes and check Console for all five actions.
- [ ] Capture and redact baseline screenshots.
- [ ] Repeat all five actions with a named throttling preset and record differences.
- [ ] Clear selected site storage, record precisely what was cleared, and repeat five actions.
- [ ] Capture and redact evidence for all conditions.
- [ ] Compare outcomes and explain observed differences.
- [ ] Create Jira bugs **only if a genuine requirement mismatch is observed**.
- [ ] Add actual evidence files to `day-06-web-foundations/evidence/`.
- [ ] Prepare **CP-2 Days 4–6** presentation in `presentations/`.
- [ ] Update this document's run statuses and summary; mark COMPLETE only when the actual task has been performed.

## 11. Initial Reflection — To Complete After Execution

This assessment will demonstrate how I connect web fundamentals to real QA observation. I will compare browser requests, responses and visible UI behaviour under a normal network, a throttled connection, and cleared site storage. I will record actual findings rather than assume each HTTP 200 is valid or each redirect is a defect.

**Final outcome:** **PENDING — no new Day 6 actions recorded yet**.

## References

1. **RoBenDevs QA Engineer Internship — 14-Day Foundation Programme**, Day 6, PDF pp. 11–12.
2. [Day 6 Basic](01-qa-basic.md), [Day 6 Intermediate](02-qa-intermediate.md), [Day 6 Advanced](03-qa-advanced.md).
3. [QP-2 — Earlier OrangeHRM DevTools learning](https://g-team-qfw281wn.atlassian.net/browse/QP-2).
4. [Chrome DevTools Network reference](https://developer.chrome.com/docs/devtools/network/reference/).
5. [OrangeHRM open-source project](https://github.com/orangehrm/orangehrm) and [official public demo](https://opensource-demo.orangehrmlive.com/).
