# Day 6 — Advanced: Sessions, Browser Security Errors, and Web Performance

**Name:** MD Morshed Jaman  
**Programme:** RoBenDevs QA Engineer Internship — 14-Day Foundation Programme  
**Day / Level:** 06 — Advanced  
**Topic:** Session Expiry, Cross-Tab Logout, Token Refresh, CORS, Mixed Content, Network Waterfalls, and Lighthouse  
**Learning date:** 14 November 2026  
**Document status:** Advanced learning notes; practical checks are **planned, NOT RUN**

> **Evidence boundary:** These notes follow the Day 6 **Advanced** topics from the official programme. I use earlier [QP-2 login practice](https://g-team-qfw281wn.atlassian.net/browse/QP-2) and [QP-5/QP-6 image practice](https://g-team-qfw281wn.atlassian.net/browse/QP-6) only as previously documented examples. I have **not** measured a new session expiry, token refresh, CORS failure, mixed-content problem, Lighthouse score, or five-action Day 6 execution. Status tables below are test **plans**, not recorded PASS/FAIL results.

## 1. Day 6 Advanced — What the Programme Requires

My Day 6 foundation learning begins with HTTP and browser DevTools, then progresses to the conditions that can break real user sessions and page loading.

The **official Day 6 Advanced syllabus** specifies these three groups:

1. **Sessions and authentication:** Login expiry, logout across tabs, and token refresh.
2. **CORS and mixed content errors:** Recognising them in the browser Console.
3. **Front-end performance:** Reading the page-load Network waterfall and Lighthouse reports.

These are the only official **Advanced** topics for Day 6. Additional test examples and terminology below are my learning explanations, **not extra programme requirements**.

**Connection to previous notes:**
- [Day 6 Basic — Web architecture, HTTP, Console and Network](01-qa-basic.md).
- [Day 5 Advanced — Root-cause hints, defect metrics and developer communication](../day-05-bug-reporting/03-qa-advanced.md).
- [Day 4 — Manual testing and Xray practice](../day-04-manual-testing/01-qa-basic.md).

**My QA goal:** Check whether a web application handles authentication state, browser security restrictions, and slow page loading correctly—and support any findings with the **same precise evidence standard** I learned on Day 5.

---

## 2. Sessions and Authentication — My Understanding

A successful login needs more than a page saying “Welcome.” The application also needs to recognize which later requests belong to an authenticated user and which resources that user is allowed to access.

### 2.1 Important terms

| Term | Meaning in my QA work | Important distinction |
| --- | --- | --- |
| **Authentication** | Verifying who the user is, usually during login | Authentication is not the same as permission to every resource |
| **Authorization** | Checking what the authenticated user is allowed to access | A logged-in user can still receive a forbidden response |
| **Session** | Server/client state used to maintain logged-in identity across requests | Session mechanisms vary by product |
| **Session cookie** | Cookie that can carry a session identifier | A cookie can identify a server-side session without storing the user's password |
| **Access token** | Credential that may authorize API calls | Not every web app uses bearer tokens |
| **Refresh token / refresh flow** | A mechanism to obtain renewed credentials when supported by the app | Not every system supports refresh tokens |
| **Session timeout** | Authentication/session ends after a specified condition such as inactivity or absolute lifetime | Idle timeout and absolute expiry are different rules |
| **Logout** | User initiates the end of authenticated access | UI logout and actual server-side invalidation must be considered separately |

The application might use a **server session + cookie**, a **token-based API flow**, or another design. I should confirm the architecture and expected requirements instead of presuming that OrangeHRM or any other site uses a particular token scheme.

### 2.2 Two simplified authentication flows

**A. Server session and cookie — illustrative**

```text
User submits login form
    → Server validates credentials
    → Server creates/updates authenticated session
    → Browser receives a session cookie
    → Browser sends the matching cookie on future requests
    → Server checks that session for protected operations
```

**B. Token-based API flow — illustrative**

```text
User logs in
    → Server issues the appropriate credential
    → Browser sends an access token with permitted API requests
    → Access token eventually expires
    → App may refresh it if the implementation supports refresh
    → Failed renewal should lead to an appropriate unauthenticated state
```

I should not expect or attempt to reveal live tokens/cookies in public screenshots, GitHub files, or bug reports.

---

## 3. Login Expiry — Specific QA Checks

Session expiry matters because a browser can stay open longer than the backend considers the user authenticated.

### 3.1 Three relevant expiry cases

| Scenario | Starting state | Action | Expected behaviour to confirm with requirements |
| --- | --- | --- | --- |
| **Idle timeout** | User signed in, inactive long enough to exceed configured idle limit | Revisit protected page or perform protected action | User is required to reauthenticate or the app follows its documented session-expiry behaviour |
| **Absolute expiry** | User signed in beyond the session's maximum lifetime | Perform a new protected request | The expired session is not accepted for protected data |
| **Expired token** | App uses a time-limited access token | Trigger an authorized API call after token expires | App either refreshes correctly or denies/handles the call without revealing protected data |

**Expected result is product-dependent.** Some sites redirect a normal page request to login; an API may return `401 Unauthorized`. I cannot demand one exact status code without knowing the application contract.

### 3.2 My manual test plan — AUTH-01

**Title:** Verify authenticated access after the configured idle-session timeout  
**Preconditions:** Test account; known idle-timeout requirement; test environment with a safe/short timeout where possible.

1. Log in with a test account.
2. Open one protected page and verify the initial authenticated state.
3. Record the current time and configured timeout.
4. Leave the account idle for the approved duration **without unintentionally generating activity**.
5. Try to open a protected page or make a protected action.
6. In **Network**, inspect the relevant request/response and redirect if any.
7. Check whether protected information is still accessible.
8. Record actual behaviour, timestamp, build, browser and screenshots.

| Field | Current value |
| --- | --- |
| **Requirement** | Session timeout value **to be confirmed** |
| **Expected** | Expired authentication must not grant access to protected data |
| **Actual** | Not observed |
| **Execution** | **NOT RUN** |
| **Evidence** | Not captured |
| **Jira bug** | None established |

**What I learned:** A stale dashboard remaining visually on screen does **not** by itself prove the server still accepts an expired session. I need to test a **new protected request**.

### 3.3 Useful DevTools locations

- **Application → Cookies**: inspect cookie name, domain, path, expiry and flags without copying secret values.
- **Network → Headers**: check request method/status, `Set-Cookie` presence where visible, redirect chain, and protected request outcome.
- **Console**: examine errors during session expiry if the UI becomes inconsistent.
- **Application → Local Storage / Session Storage**: inspect whether the app stores relevant client state; do not assume this is where authentication is implemented.

**Cookie flags to recognize:**

| Flag | Why it matters |
| --- | --- |
| `HttpOnly` | Prevents JavaScript from reading that cookie; it may still be sent in HTTP requests |
| `Secure` | Limits transmission to secure contexts as defined by cookie rules |
| `SameSite` | Controls some cross-site sending of cookies; can affect login/cross-site flows |
| `Expires` / `Max-Age` | Controls cookie persistence/lifetime, but **does not alone prove** the server-side session's validity |

---

## 4. Logout Across Tabs — Specific QA Checks

A user may have the same application open in two tabs. I need to know what should happen after logout from either tab.

### 4.1 My manual test plan — AUTH-02

**Title:** Verify previously authenticated tabs cannot continue using the logged-out session

1. Sign in with a test account in **Tab A**.
2. Open a protected page in **Tab B** under the same browser profile.
3. Confirm Tab B can initially load the authorized page.
4. Return to Tab A and click **Logout**.
5. Return to Tab B **without assuming the existing screen will update instantly**.
6. Refresh Tab B or trigger a fresh protected data request.
7. Inspect Network and record whether the request remains authorized.
8. Check the documented expected redirect/message/session-clearing behaviour.

**Core security expectation to verify:** Once server-side authentication has been invalidated, new protected operations should not succeed solely because another tab had an old page open.

| Step | What I need to observe | Current status |
| --- | --- | --- |
| Two tabs share the initial authenticated session | Both pages can access permitted content | NOT RUN |
| Logout from Tab A | App processes logout | NOT RUN |
| Protected request from Tab B | Server response and browser UI after logout | NOT RUN |
| Refresh or navigation in Tab B | Correct handling of logged-out state | NOT RUN |

### 4.2 Important interpretation

- **Stale UI in Tab B** may remain visible temporarily even after server logout.
- The important check is whether **new protected requests** are denied appropriately.
- Some applications update other tabs immediately via storage events or other signaling; that behaviour must be checked against requirements.
- A change in localStorage alone does not prove a server-side session was invalidated.

**Day 5 connection:** If Tab B continues to access protected user data contrary to the accepted rule, I should document the **exact request, actual response and privacy impact**—not simply log “Logout broken.”

---

## 5. Token Refresh — Specific QA Checks

### 5.1 Why refresh exists

A token-based application may use a **short-lived access token**. To maintain a session without repeatedly asking for the user's password, it may also support a **refresh mechanism**.

Possible outcomes when an access token expires:

1. The application obtains fresh credentials and retries the protected operation.
2. Refresh is expired/invalid; the user must authenticate again.
3. A network error interrupts refresh; the app displays appropriate failure/retry handling.

The exact protocol, token storage and endpoint names are **implementation-specific**.

### 5.2 My test plan — AUTH-03

**Preconditions:** Mentor/test environment confirms that token refresh exists; approved way to expire or shorten access-token lifetime.

| Case | Controlled condition | Expected test question | Status |
| --- | --- | --- | --- |
| AUTH-03A | Access token expired; valid refresh credential | Does the session renew without exposing data or looping? | NOT RUN |
| AUTH-03B | Refresh credential expired/invalid | Does the app deny the protected operation and require login? | NOT RUN |
| AUTH-03C | Network unavailable during refresh | Does the app handle the failure safely and explain/recover as documented? | NOT RUN |
| AUTH-03D | Several requests occur as renewal is needed | Are duplicate refresh attempts handled according to design? | NOT RUN |
| AUTH-03E | Logout has invalidated session/refresh | Can the former credentials still obtain protected data? | NOT RUN |

### 5.3 Evidence collection

In DevTools → **Network**, I would record the authorization-related request/response **without disclosing the credential**, inspect the sequence and any redirect, and note visible user impact.

**Do not:** Copy authorization headers, decoded tokens, refresh tokens, session cookie values or private account data into a public GitHub repository.

**What I learned:** A seamless login experience is valuable, but **expired or revoked credentials must not silently continue to authorize protected actions**.

---

## 6. CORS — Recognizing Cross-Origin Errors in Console

**CORS = Cross-Origin Resource Sharing.** It is a browser-enforced mechanism that controls when JavaScript running on one origin can read responses from another origin.

An **origin** is the combination of **scheme + host + port**. For example, `https://shop.example.test` and `https://api.example.test` are different origins because their hosts differ.

### 6.1 The browser situation

```text
Frontend: https://shop.example.test
         |
         | Browser JavaScript calls:
         v
API:      https://api.example.test/orders
         |
         v
Browser checks the applicable CORS response policy
         |
         +--> Allowed: frontend can access the response
         |
         +--> Blocked: Console reports a CORS policy problem
```

An API can still return a response while browser JavaScript is prevented from reading it. Therefore, **an HTTP 200 in Network does not mean a CORS test passed**.

### 6.2 What I would look for

Possible Console wording (illustrative, not copied from a real failure):

> Access to fetch at '[API URL]' from origin '[frontend origin]' has been blocked by CORS policy.

The precise browser text may vary.

| Check | Where | Why |
| --- | --- | --- |
| Frontend origin | Address bar or Console message | Establish the calling origin |
| Target URL | Network → Headers | Identify the API/resource |
| `Origin` request header | Network → Headers when present | Identify the origin supplied with the request |
| `Access-Control-Allow-Origin` | Response headers, when present | Check what origin the server permits |
| `Access-Control-Allow-Credentials` | Response headers when credentialed requests apply | Relevant to cookie/credentialed cross-origin requests |
| `OPTIONS` preflight request | Network, if a preflight occurs | See whether the server allows the requested method/headers |
| Browser Console error | Console | Capture the browser's policy decision |

**Preflight note:** Browsers may send an `OPTIONS` request before some cross-origin requests. Not every cross-origin request needs a preflight.

### 6.3 CORS is not the same as authentication

- **CORS** controls whether browser JavaScript can access cross-origin responses.
- **Authentication** verifies the caller's identity.
- **Authorization** decides whether that caller may perform the operation.
- A working API in Postman or cURL does **not** prove browser CORS is configured correctly, because these tools do not apply the browser's cross-origin restrictions in the same way.

**Do not “fix” a suspected CORS defect by disabling browser web security** and then claim the application is correct. Such a workaround can conceal the actual problem.

### 6.4 My planned investigation — WEB-01

1. Use an authorized app with a known cross-origin API integration.
2. Open Console and Network; clear irrelevant earlier logs.
3. Perform the affected UI action.
4. Observe whether Console reports a CORS policy error.
5. Find the related request and any `OPTIONS` preflight.
6. Record request origin, endpoint path, response headers and status.
7. Compare behaviour with approved API/CORS requirements.
8. Save sanitized evidence if a real mismatch exists.

**Current result:** **NOT RUN**. No new CORS defect has been observed or logged.

---

## 7. Mixed Content — Recognizing HTTPS/HTTP Problems

**Mixed content** occurs when a secure **HTTPS page** attempts to load a resource using insecure **HTTP**.

### 7.1 Example

```text
Page:    https://store.example.test/dashboard
Image:   http://assets.example.test/banner.png
Script:  http://assets.example.test/app.js
```

Browsers may **block** insecure content or **automatically upgrade** certain resource types to HTTPS, depending on the resource, browser and context. I should inspect what **actually happens** instead of presuming every HTTP subresource results in the same outcome.

### 7.2 What I would inspect

| Location | Evidence to seek |
| --- | --- |
| **Console** | Mixed-content warning/error and blocked resource URL |
| **Network** | Requested resource, request outcome and whether an HTTPS upgrade occurred |
| **Security panel** | Page connection/security information |
| **Elements / source reference** | The actual resource URL, if accessible and relevant |

### 7.3 My planned investigation — WEB-02

1. Open an authorized HTTPS page in the test environment.
2. Inspect Console for mixed-content warnings.
3. Identify the relevant resource URL.
4. Compare the URL scheme of the page and resource.
5. Check Network for whether the request was blocked, upgraded, or otherwise failed.
6. Verify the expected resource or functionality.
7. Log the actual mismatch only if reproduced and relevant.

**Expected goal:** Secure pages should use approved secure resource loading; required features should not fail due to insecure dependencies.

**Current result:** **NOT RUN**. No mixed-content defect has been established in my Day 6 work.

### 7.4 Difference from QP-6

My QP-6 example concerns a **wrong response type/fallback**: a `.png` request responded with HTML. That is **not evidence of mixed content** and **not automatically a CORS issue**.

---

## 8. Reading a Front-End Network Waterfall

The **Network waterfall** visualizes **when each request starts** and **how long it takes**, making it useful for investigating slow page loading.

### 8.1 What the timeline helps me see

| Observation | Possible meaning | How I would check |
| --- | --- | --- |
| Long wait before response begins | Server processing or network latency may be contributing | Request → Timing; compare repeated runs |
| Large/slow image download | Heavy media may delay visible content | Response size, type, timings, image dimensions |
| Many requests start late | They may depend on earlier scripts/resources | Initiator and waterfall ordering |
| Long script loading | Large/slow JS may delay functionality | Request timings and Performance panel |
| Repeated API requests | Duplicate actions/polling/retries may affect load | Initiator, methods, request count |
| Blocked or queued request | Browser scheduling, prioritization or connection constraints | Timing details |

A waterfall shows **where to investigate**, but it does not by itself prove the code-level cause.

### 8.2 Timing words I need to understand

- **Queueing / Stalled:** Time spent before a request can proceed for browser/network reasons.
- **DNS lookup:** Resolving a host to an address, where applicable.
- **Initial connection / TLS:** Establishing a network connection and secure channel, where applicable.
- **Waiting (TTFB):** Time until the first response byte arrives after the request is sent; influenced by network and server behaviour.
- **Content download:** Time taken to receive the response body.

Some requests reuse connections or cached resources, so not every request shows every timing stage.

### 8.3 My planned performance check — PERF-01

1. Use a stable test URL and record browser/version, viewport and network conditions.
2. Open DevTools → **Network**.
3. Enable **Disable cache** only if a cold-load comparison is intended; note that it applies while DevTools is open.
4. Reload the page with Network recording active.
5. Review the request count, resource types, slow requests and waterfall.
6. Inspect the slowest relevant requests in **Timing**.
7. Repeat using the approved **throttling** profile (for example, a browser-defined slow network preset).
8. Compare observable page behaviour: loading indicators, broken assets, delayed actions, errors.
9. Record the actual measured durations only after running the test.

| Metric / observation | Normal network | Throttled network |
| --- | --- | --- |
| Page URL / build | To record | To record |
| Browser / profile | To record | To record |
| Request count | NOT MEASURED | NOT MEASURED |
| Slowest relevant request | NOT MEASURED | NOT MEASURED |
| Waterfall observation | NOT OBSERVED | NOT OBSERVED |
| Console errors | NOT CHECKED | NOT CHECKED |
| Screenshot | Not captured | Not captured |

**Do not compare** runs with different logins, cache state or page content as though all other conditions are equal.

---

## 9. Lighthouse — What the Report Can Tell Me

**Lighthouse** is a tool for auditing web pages and suggesting improvements. Its categories and exact checks may change by version.

### 9.1 How I would run a Lighthouse audit

1. Open the target page in Chrome (or an environment with Lighthouse supported).
2. Open DevTools and find the **Lighthouse** panel (or launch a supported Lighthouse workflow).
3. Choose the audit options relevant to the assignment and the page.
4. Record device mode, browser/tool version, network conditions and whether I was logged in.
5. Run the audit.
6. Review flagged opportunities, diagnostics and measured performance data.
7. Export the report if needed and keep sensitive URLs/data out of public artifacts.
8. Repeat consistently if I need a before/after comparison.

**Status:** No Lighthouse audit has been run or saved for this document.

### 9.2 Performance terms I want to recognize

| Metric / term | Meaning | QA interpretation |
| --- | --- | --- |
| **LCP — Largest Contentful Paint** | Time when the largest relevant visible content element renders | Helps evaluate perceived page loading |
| **CLS — Cumulative Layout Shift** | Unexpected movement of visible page elements | Helps identify unstable layouts |
| **TBT — Total Blocking Time** | Lab estimate of time when long main-thread tasks block responsiveness | Helps identify JavaScript-related responsiveness risk in lab tests |
| **INP — Interaction to Next Paint** | Field responsiveness metric based on user interaction latency | Often needs real-user/field interaction data; **do not claim Lighthouse lab measured INP directly** |
| **TTFB — Time to First Byte** | Time until the first byte of a response arrives | Gives clues about initial response latency |

**Important:** A single Lighthouse score is a **diagnostic snapshot**, not a guarantee that all users will experience the same speed. Results can vary with device, content, caching, authentication, network, tooling and repeated runs.

### 9.3 Hypothetical audit findings and QA questions

| Hypothetical finding | My QA question |
| --- | --- |
| Large hero image delays loading | Can the image be resized/compressed without damaging quality? |
| Significant layout shifting | Does a banner/image load without reserved space and move important controls? |
| Excessive JavaScript work | Are user actions unresponsive during the critical loading phase? |
| Slow initial response | Is the delay repeatable, and does it depend on backend/environment? |

These are **study examples**, not actual Lighthouse warnings from the OrangeHRM demo or QA practice lab.

---

## 10. How the Three Advanced Topics Connect in Real QA

Consider an **illustrative** authenticated dashboard that loads slowly:

1. The user logs in and receives the application's valid session credentials.
2. The dashboard requests protected data from an API.
3. An expired token or session may trigger a redirect, denial or refresh flow.
4. A CORS misconfiguration could prevent browser JavaScript from reading a valid API response.
5. An HTTP resource on the HTTPS page might be blocked/upgraded as mixed content.
6. Large scripts or images may extend the Network waterfall and harm page performance.

**One symptom can have different causes.** I should inspect the actual request chain, Console, current auth state and performance observations—not report every slow or broken dashboard as an authentication defect.

### 10.1 Quick comparison table

| User symptom | First places I would inspect | What not to conclude prematurely |
| --- | --- | --- |
| Logs out unexpectedly | Cookies, protected request status, login/refresh sequence | “The token is broken” |
| Tab B still displays dashboard after Tab A logs out | New protected request from Tab B, session state, UI update | “Server logout failed” from stale UI alone |
| API appears successful but UI cannot read data | Console CORS message, preflight, CORS headers | “Backend returned 500” |
| HTTPS page has missing asset | Console mixed-content warning, Network and resource URL | “It's definitely mixed content” |
| Page is slow | Waterfall, request timing, large resources, Lighthouse/Performance | “The database is slow” without evidence |

---

## 11. My Specific Advanced Test Case Matrix

The following are **designed checks** for an authorized QA environment. They are **not executed**.

| ID | Focus | Action | Observable criterion to verify | Status |
| --- | --- | --- | --- | --- |
| AUTH-01 | Login expiry | Wait for documented idle/absolute timeout; request protected data | Expired access is handled per accepted requirements | NOT RUN |
| AUTH-02 | Cross-tab logout | Log out Tab A; request protected data in Tab B | Invalidated session cannot authorize new protected actions | NOT RUN |
| AUTH-03 | Token refresh | Use approved short-lived token setup if implemented | Refresh succeeds or fails safely as specified | NOT RUN |
| WEB-01 | CORS | Trigger known cross-origin API action | Browser response access matches CORS policy | NOT RUN |
| WEB-02 | Mixed content | Inspect HTTPS page and HTTP resource requests | Secure resource loading and useful failure handling | NOT RUN |
| PERF-01 | Network waterfall | Compare normal and throttled page load | Timings and visible delays are recorded accurately | NOT RUN |
| PERF-02 | Lighthouse | Audit a permitted page | Report saved with its context and actual metrics | NOT RUN |

### 11.1 Reusable execution format

```markdown
**Case ID:**
**Application / environment / build:**
**Requirement or approved expected behaviour:**
**Browser / device / network condition:**
**Preconditions:**
**Steps actually executed:**
**Actual observation:**
**Relevant requests (sanitized):**
**Console findings:**
**Expected vs actual verdict:** PASS / FAIL / BLOCKED / NOT RUN
**Evidence file / URL:**
**Jira issue link (only if justified):**
**Retest notes / follow-up:**
```

A status of **PASS** or **FAIL** requires an actual observation against a confirmed requirement. A screenshot or an invented example cannot replace execution.

---

## 12. Connecting My Existing Jira Examples

### QP-2 — OrangeHRM login practice

[QP-2 — User login with email and password](https://g-team-qfw281wn.atlassian.net/browse/QP-2)

My previously documented OrangeHRM Network practice showed a login form `POST /web/index.php/auth/validate` with `302 Found`, followed by a dashboard request returning `200 OK` on the successful-login route.

**Relevance to Day 6:** HTTP redirects, browser request sequence and authenticated navigation.

**Limitation:** The screenshot/earlier notes do **not** confirm a timed-out session, cross-tab logout, access-token refresh or any new Advanced execution. Also, the demo uses username-based login, so it does not fully establish the story's email-specific acceptance criterion.

### QP-5 and QP-6 — Broken-image response mismatch

- [QP-5 — Practice test TC-IMG-001](https://g-team-qfw281wn.atlassian.net/browse/QP-5)
- [QP-6 — Practice bug: missing informative fallback](https://g-team-qfw281wn.atlassian.net/browse/QP-6)

My previous practice recorded a `.png` request that returned `200 OK` with `text/html` content and a generic broken-image placeholder.

**Relevance to Day 6:** A successful HTTP status does not guarantee the right content. Console and Network observations can point to a resource problem.

**Limitation:** The evidence does **not** establish a CORS error, mixed-content error, performance metric or Lighthouse finding.

**Day 5 connection:** If a new Day 6 defect is genuinely observed, I should report it with clear reproduction steps, impact, sanitized evidence and appropriate triage—not convert a study example into a new Jira Bug.

---

## 13. Day 6 Official Practical Assessment and CP-2 — Current Status

The official Day 6 practical task asks me to:

1. **Pick a live web application.**
2. Perform **five user actions**, recording relevant requests, their **HTTP status codes** and any **Console errors**.
3. Repeat the same flows on a **throttled network**.
4. Repeat them with **browser storage cleared**.
5. Put findings/screenshots in `day-06-web-foundations/`.
6. Prepare **Checkpoint CP-2** slides for Days **4–6** in `presentations/`.

These requirements apply to the whole Day 6 assignment, **not solely Advanced**.

### Suggested action plan — OrangeHRM (not yet executed)

| Action | What I would observe | Original condition | Throttled | Cleared storage |
| --- | --- | --- | --- | --- |
| 01 — Log in | Login request and redirect / response | NOT RUN | NOT RUN | NOT RUN |
| 02 — Open dashboard | Main document and relevant API/resource requests | NOT RUN | NOT RUN | NOT RUN |
| 03 — Open PIM | Navigation and related data requests | NOT RUN | NOT RUN | NOT RUN |
| 04 — Search employee | Search requests and displayed result | NOT RUN | NOT RUN | NOT RUN |
| 05 — Log out | Logout/navigation requests and next protected access | NOT RUN | NOT RUN | NOT RUN |

**Execution note:** Clearing storage can log the user out. I will reauthenticate as needed and record the new state rather than treating an authentication redirect as an automatic bug.

**CP-2 checkpoint:** Present the learning and evidence from **Day 4 manual testing**, **Day 5 bug reporting**, and **Day 6 web foundations**. Do not claim unexecuted Day 4/5/6 assessments are complete.

---

## 14. Common Mistakes I Want to Avoid

| Common mistake | Better QA practice |
| --- | --- |
| Assuming every app uses JWT | Confirm whether it uses sessions, cookies, tokens or another model |
| Claiming stale UI proves logout failed | Attempt a fresh protected request after logout |
| Testing expiry without knowing the timeout rule | Obtain the requirement or an approved test configuration |
| Publishing cookie/token values | Redact secrets and use approved evidence sharing |
| Treating CORS as an API authentication status | Distinguish browser cross-origin policy from server auth |
| Assuming any missing resource is mixed content | Check page scheme, resource scheme and Console evidence |
| Treating HTTP 200 as successful image loading | Inspect Content-Type, body and rendered result |
| Looking at the waterfall without checking cache | Record cache/network/device conditions |
| Reporting a Lighthouse score without context | Record tool/version, device, page state and actual run |
| Treating a planned test as passed | Leave status **NOT RUN** until observed |

---

## 15. My Key Takeaways

- **Session expiry:** A protected request after timeout is a stronger test than merely looking at an old page.
- **Cross-tab logout:** Logout should prevent unauthorized new requests; the second tab's UI refresh behaviour depends on the product.
- **Token refresh:** Where implemented, renewal should work as designed and invalid renewal should fail safely.
- **CORS:** A browser may block JavaScript access to a cross-origin response even when the network request returns data.
- **Mixed content:** HTTPS pages may block or upgrade HTTP resources; Console and Network show the observed behaviour.
- **Waterfall:** I can narrow slow-loading issues by inspecting request order and timing.
- **Lighthouse:** Reports provide diagnostic evidence, not universal performance guarantees.
- **Honest reporting:** I must distinguish earlier QP-2/QP-6 practice from new Day 6 tests that are still pending.

### Final Reflection

Day 6 Advanced helped me understand how user sessions, browser security policies and page-loading performance affect quality. I now know **which DevTools evidence to seek**, how to define meaningful test cases, and how to connect a verified failure to the bug-reporting process I studied on Day 5. The next step is to execute the official five-action Day 6 investigation and attach actual findings rather than claiming results from written notes.

## References

1. **RoBenDevs QA Engineer Internship — 14-Day Foundation Programme**, *Day 6: Web Foundations for Testers*, Advanced curriculum on **page 11** and assignment/checkpoint on **page 12**.
2. [Day 6 Basic Notes](01-qa-basic.md).
3. [Day 5 Advanced Notes](../day-05-bug-reporting/03-qa-advanced.md).
4. [Day 4 Practical Assessment](../day-04-manual-testing/day-04-practical-assessment.md).
5. [QP-2 — Login acceptance criteria and DevTools practice](https://g-team-qfw281wn.atlassian.net/browse/QP-2).
6. [QP-5 — Broken-image test](https://g-team-qfw281wn.atlassian.net/browse/QP-5) and [QP-6 — Broken-image practice defect](https://g-team-qfw281wn.atlassian.net/browse/QP-6).
7. [Chrome DevTools — Inspect Network activity](https://developer.chrome.com/docs/devtools/network/).
8. [Chrome DevTools — Lighthouse](https://developer.chrome.com/docs/devtools/lighthouse/).
9. [MDN — Cross-Origin Resource Sharing](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS).
10. [MDN — Mixed content](https://developer.mozilla.org/en-US/docs/Web/Security/Mixed_content).
