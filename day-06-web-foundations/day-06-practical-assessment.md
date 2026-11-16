# Day 6 — Practical Assessment: DevTools Investigation of Five Web Actions

**Programme:** RoBenDevs QA Engineer Internship — 14-Day Foundation Programme  
**Topic:** Web Foundations for Testers — Network, Console, Throttling and Storage  
**Prepared:** 16 November 2026  
**Application candidate:** [OrangeHRM Open-Source Demo](https://opensource-demo.orangehrmlive.com/)  
**Status:** **IN PROGRESS — all five normal-network actions PASS; 5/15 action runs verified**

> **Evidence integrity:** The official Day 6 assignment requires inspecting **five user actions**, recording requests/status codes and Console errors, and repeating those flows under **network throttling** and **cleared browser storage**. The baseline ACT-01 through ACT-05 rows have observed Network/UI evidence from 16 November 2026. **Ten action runs are NOT RUN** (five throttled-network and five cleared-storage reruns). My earlier [QP-2 login investigation](https://g-team-qfw281wn.atlassian.net/browse/QP-2) is historical practice, **not a fresh Day 6 baseline measurement**. Five ACT-01 screenshots were supplied in the assessment conversation across two messages; they have **not yet been added as repository evidence files**. The Payload screenshot exposes credential/form-token values and **must not** be committed publicly. No new performance results are claimed.

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
| Test date/time | **ACT-01:** 16 November 2026; response Date header `05:02:28 GMT` (11:02:28 Asia/Dhaka). Other runs: to record |
| Account | Public demo/test account; **never paste its password into the report** |
| Environment/build | Live public demo; build/version **if displayed** |
| Baseline network | **No throttling** observed in ACT-01 screenshots (Keep log enabled, Disable cache unchecked) |
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
| ACT-01 — Login | `/web/index.php/auth/validate` → `/web/index.php/dashboard/index` | `POST` **302 Found** → `GET` **200 OK** | Dashboard rendered after login | **No errors or warnings visible** in captured Console view | Headers + Console screenshots supplied in conversation; no repository image files yet; exclude sensitive Payload screenshot | **PASS — baseline login flow** |
| ACT-02 — Dashboard | `/web/index.php/dashboard/index` | **GET 200 OK** | Dashboard displayed after returning from PIM | **No errors visible** in captured Console view | Headers + Console screenshots supplied in conversation; repository image files pending | **PASS — baseline dashboard navigation** |
| ACT-03 — PIM | `/web/index.php/pim/viewPimModule` → `/web/index.php/pim/viewEmployeeList`; employee list XHR also visible | **GET 302 Found → GET 200 OK** | PIM Employee List displayed; **178 Records Found** | **No errors visible** in captured Console view | Three PIM screenshots supplied in conversation; repository image files pending | **PASS — baseline PIM navigation** |
| ACT-04 — Employee search | `/web/index.php/api/v2/pim/employees?...` (query included `empNumber=114`) | **GET 200 OK**; `Content-Type: application/json` | PIM filtered to **1 Record Found: Joy Smith (employee ID 0321)** | No errors or warnings visible in captured Console | Network list, selected Headers, Response JSON and Console screenshots shared in conversation; repository images pending | **PASS — baseline employee search** |
| ACT-05 — Logout | `/web/index.php/auth/logout` → `/web/index.php/auth/login` | **GET 302 Found**; destination login page displayed (login-document status not separately captured) | OrangeHRM login page shown after logout | **No errors visible** in Console screenshot; **1 hidden** message indicated by filter | Logout Headers and Console screenshots supplied in conversation, not yet committed as files | **PASS — baseline logout navigation** |

**Baseline findings — ACT-01 (observed 16 November 2026):**

- **Application:** OrangeHRM public demo; browser was Microsoft Edge on Windows (exact versions not captured).
- **Network setup:** recording enabled, **Keep log** checked, **No throttling** selected, and **Disable cache** unchecked.
- **Relevant request:** `POST https://opensource-demo.orangehrmlive.com/web/index.php/auth/validate`.
- **Observed status:** **302 Found**. Response header `Location` redirected to `https://opensource-demo.orangehrmlive.com/web/index.php/dashboard/index`.
- **Follow-up dashboard document:** `GET /web/index.php/dashboard/index` returned **200 OK** (verified in a new Headers screenshot).
- **Additional response observations:** `Cache-Control: no-cache, private` and `Content-Type: text/html; charset=utf-8` were visible.
- **Observed UI:** the Dashboard was rendered after login.
- **Response panel:** DevTools displayed “Failed to load response data — No content available because this request was redirected.” This is **normal for the selected redirect** and is **not evidence of a bug**.
- **Console evidence:** The captured DevTools Console is empty under the shown filter/settings. **No errors or warnings were visible at capture time**; this is not proof none occurred earlier or under different settings.
- **Assessment verdict:** **PASS** for the observed baseline login-to-dashboard flow (`POST 302` → `GET 200` and visible Dashboard).
- **Still to record:** exact browser version and screenshots added as repository evidence if submitting the final assessment. **ACT-02 is still pending as a distinct user-initiated dashboard action**; the redirect navigation above belongs to ACT-01.
- **Evidence protection:** The Payload screenshot visibly includes the login password and a form token. **Do not publish that screenshot as-is.** Redact these values or use only the safe Headers screenshot.

**ACT-01 through ACT-05:** PASS for the five observed baseline navigation/search actions. Session invalidation across tabs and further security checks are outside these observations.

### ACT-02 — Dashboard navigation: verified evidence (16 November 2026)

- **Action:** The user navigated to the PIM employee list, then returned to Dashboard in OrangeHRM.
- **Visible request list:** `viewPimModule` **302**, `viewEmployeeList` **200**, `index` **200** (the Status column was visible).
- **Other Network observation:** The `messages` request showed **304 Not Modified**, which can be normal cache revalidation and is not a defect by itself.
- **UI result:** Dashboard appeared after navigation, with widgets visible.
- **Test setup:** **No throttling**, **Keep log** enabled; **Disable cache** unchecked.
- **Additional screenshots received:** Selected dashboard `index` **Headers** showed **GET 200 OK**; a separate Console screenshot showed no error/warning messages visible at capture time.
- **Assessment status:** **PASS** for returning to the Dashboard; browser-version detail and repository evidence files still need to be added.

### ACT-03 — PIM navigation: verified evidence (16 November 2026)

- **Action:** Selected **PIM** from the OrangeHRM navigation.
- **Initial request:** `GET /web/index.php/pim/viewPimModule` returned **302 Found**, with a redirect Location leading to `/web/index.php/pim/viewEmployeeList`.
- **Follow-up document request:** `GET /web/index.php/pim/viewEmployeeList` returned **200 OK**, confirmed in selected **Headers**.
- **Additional requests:** Employee-data and related XHR requests appeared in the Network list; their individual details were not separately assessed in this action.
- **UI result:** The **Employee List** appeared, with **178 Records Found** in the screenshot.
- **Console:** Separate screenshot showed **no errors or warnings visible** in the Console at capture time. This does not prove no earlier errors occurred.
- **Network setup:** **No throttling**, **Keep log** checked, **Disable cache** unchecked.
- **Assessment status:** **PASS** for opening the PIM Employee List.
- **Evidence handling:** Three screenshots were supplied in conversation; they are **not yet uploaded to GitHub**. Do not invent screenshot paths or claim files were attached to Jira.
- **Next:** ACT-04 — Perform a non-destructive employee search and inspect its request/response and Console.

### ACT-04 — Employee search: verified Network, UI, and JSON evidence (16 November 2026)

- **Action:** Used PIM Employee Search to filter the employee records.
- **Network request:** `GET /web/index.php/api/v2/pim/employees?...empNumber=114...` with the employee-list query parameters visible in Headers.
- **HTTP result:** **200 OK**, with `Content-Type: application/json`.
- **UI:** Employee list displayed **(1) Record Found**, **Joy Smith**, employee ID **0321**.
- **Response JSON:** `data[0].empNumber = 114`, `data[0].firstName = "Joy"`, `data[0].lastName = "Smith"`, `data[0].employeeId = "0321"`, and `meta.total = 1`. These values **match the visible UI**, demonstrating API-to-UI consistency for this one tested record.
- **Network request timing:** Approximately **619 ms** in the captured request list. This is a single request observation, not a benchmark or average.
- **Console:** No errors or warnings were visible at capture time.
- **Network configuration:** **No throttling**, Keep log enabled, Disable cache unchecked.
- **Assessment verdict:** **PASS** for the observed employee search. No confirmed defect.
- **Evidence status:** Four screenshots (Network request list, selected Headers, Console, and JSON Response) were shared during the conversation. **No screenshot file has yet been committed to GitHub.**
- **Next action:** ACT-05 — Logout and inspect its response and Console.

### ACT-05 — Logout: observed Network and Console evidence (16 November 2026)

- **Action:** Used the OrangeHRM user menu to log out of the public demo.
- **Network:** Selected `GET https://opensource-demo.orangehrmlive.com/web/index.php/auth/logout`; status **302 Found**.
- **Redirect:** Response header `Location` pointed to `https://opensource-demo.orangehrmlive.com/web/index.php/auth/login`.
- **Visible UI:** OrangeHRM login form was displayed after navigation.
- **Console:** No errors were **visible** in the captured Console pane, although the UI indicated **1 hidden message**; therefore this screenshot cannot establish a completely error-free Console.
- **Network setup:** **No throttling**, Keep log checked, Disable cache unchecked.
- **Assessment verdict:** **PASS** for the observed logout-to-login navigation. **This does not independently verify server-side session invalidation or cross-tab logout**.
- **Evidence:** Two screenshots supplied in the conversation; screenshot files not yet added to GitHub. The login page itself displays publicly provided demo credentials, but do not upload other screenshots exposing private tokens or credentials.
- **Still optional to inspect:** The redirected `login` document's individual status/Headers and the hidden Console entry if relevant.

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
| Fully verified actions | **5/5 (ACT-01–ACT-05)** | 0/5 | 0/5 |
| Observed login behaviour | **POST 302 → dashboard GET 200; visible success** | Pending | Pending |
| Main UI differences | Dashboard/PIM loaded, search matched API JSON, logout returned to login page | Pending | Pending |
| Console errors | **ACT-01–05: none visible in captured views; ACT-05 Console indicated 1 hidden message** | Not checked | Not checked |
| Recorded request statuses | ACT-01 `POST 302` / `GET 200`; ACT-02 `GET 200`; ACT-03 `GET 302` / `GET 200`; ACT-04 `GET 200` JSON; ACT-05 `GET 302` | Pending | Pending |
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

**Current outcome:** **All five baseline actions PASS for the behaviours observed**: login `POST 302 → GET 200`, dashboard `GET 200`, PIM `GET 302 → GET 200`, employee search `GET 200` JSON with one matching employee, and logout `GET 302` returning to the login screen. Console screenshots showed no visible errors; the logout Console indicated **1 hidden message**. **Ten action runs remain NOT RUN** (five throttled, five cleared-storage). Evidence screenshots still need selected, sanitized uploads to GitHub.

## References

1. **RoBenDevs QA Engineer Internship — 14-Day Foundation Programme**, Day 6, PDF pp. 11–12.
2. [Day 6 Basic](01-qa-basic.md), [Day 6 Intermediate](02-qa-intermediate.md), [Day 6 Advanced](03-qa-advanced.md).
3. [QP-2 — Earlier OrangeHRM DevTools learning](https://g-team-qfw281wn.atlassian.net/browse/QP-2).
4. [Chrome DevTools Network reference](https://developer.chrome.com/docs/devtools/network/reference/).
5. [OrangeHRM open-source project](https://github.com/orangehrm/orangehrm) and [official public demo](https://opensource-demo.orangehrmlive.com/).
