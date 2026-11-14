# Day 6 — Intermediate: Browser Storage, Caching, Network Conditions, and Responsive Testing

**Name:** MD Morshed Jaman  
**Programme:** RoBenDevs QA Engineer Internship — 14-Day Foundation Programme  
**Day / Level:** Day 06 — Intermediate  
**Topic:** Cookies, localStorage, sessionStorage, Cache Behaviour, Network Throttling, Offline Mode, Device Emulation, and Layout Breakpoints  
**Learning date:** 14 November 2026  
**Document status:** Learning notes and proposed checks; new Day 6 hands-on assessment **NOT RUN**

> **Evidence note:** This document follows the **four Intermediate topics** in the official RoBenDevs Day 6 programme. Browser actions and expected behaviours below are **test designs**, not observed results. I previously inspected OrangeHRM login Network requests in [QP-2](https://g-team-qfw281wn.atlassian.net/browse/QP-2) and a broken-image practice case in [QP-5](https://g-team-qfw281wn.atlassian.net/browse/QP-5) / [QP-6](https://g-team-qfw281wn.atlassian.net/browse/QP-6). Those earlier exercises are **not evidence** that new Day 6 storage, cache, slow-network, offline, or responsive checks have been completed.

## 1. What I Am Learning on Day 6 Intermediate

After learning **web architecture, HTTP basics, Console and Network** in [Day 6 Basic](01-qa-basic.md), I need to understand why the *same website* can behave differently across browser tabs, repeated visits, network conditions, and screen sizes.

The official **Day 6 Intermediate syllabus** specifies:

1. **Client storage:** Cookies, localStorage and sessionStorage, and how they affect behaviour.
2. **Caching:** Why users see old data and how to test cache behaviour.
3. **Throttling:** Testing on slow networks and in offline mode.
4. **Responsive design:** Device emulation and layout breakpoints.

These four topics are the focus of this file. My [Day 6 Advanced](03-qa-advanced.md) file separately covers session expiry, cross-tab logout, CORS, mixed content, performance waterfalls, and Lighthouse.

**My main takeaway:** Successful testing on a fast desktop connection with a clean browser is not enough. A QA engineer should check whether the application remains usable when browser state, network quality, and viewport size change.

---

## 2. Client-Side Storage — Why It Matters to QA

A browser can store information for a website. Some information helps maintain a login session, some preserves preferences, and other data helps the page load faster.

The three storage mechanisms named in the syllabus are **cookies**, **localStorage**, and **sessionStorage**.

### 2.1 Practical comparison

| Feature | Cookies | localStorage | sessionStorage |
| --- | --- | --- | --- |
| **Primary role** | HTTP-related state such as session identifiers, preferences, or other small values | Origin-scoped client state that should persist across page reloads and browser sessions | Origin-scoped client state tied to one tab's page session |
| **Sent with HTTP requests automatically?** | **Yes**, when cookie attributes and browser rules permit | **No** | **No** |
| **Typical lifetime** | Session or persistent, depending on attributes | Usually persists until explicitly removed or site data is cleared | Usually lasts for that tab's page session |
| **Availability to JavaScript** | Depends on flags such as `HttpOnly` | Usually accessible to same-origin JavaScript | Usually accessible to same-origin JavaScript within the tab's session |
| **Typical QA question** | Does login/logout affect session access correctly? | Does a remembered theme or filter persist as expected? | Does a temporary form state remain only within the intended tab session? |
| **Important limitation** | Cookies can be restricted by domain, path, Secure, SameSite, expiry, privacy settings | Not a safe location for sensitive secrets merely because it is browser storage | A new tab's behaviour is browser/context-dependent; cloned or opener tabs may initially receive a copy in some circumstances |

**What I learned:** localStorage and sessionStorage are **not automatically included in HTTP requests**. Cookies follow separate HTTP/browser rules. I should not confuse a browser-stored preference with a valid server-side authenticated session.

### 2.2 Cookies — what I should inspect

A cookie has a **name and value** as well as attributes that affect when it is sent and how long it lasts.

| Attribute | QA meaning |
| --- | --- |
| `Domain` | Which hosts can receive the cookie |
| `Path` | Which request paths match the cookie |
| `Expires` / `Max-Age` | When a persistent cookie expires |
| `Secure` | Limits cookie transmission to secure contexts |
| `HttpOnly` | Prevents JavaScript access to the cookie value, though the browser may still send it |
| `SameSite` | Controls some cross-site cookie sending behaviour |

**Important:** A cookie's presence does not prove an active server-side session. For example, a server may have invalidated the session even though the browser still has an old cookie.

I should inspect **cookie names, relevant attributes and behaviour** without copying **session IDs, authentication cookies, passwords, or tokens** into my GitHub notes.

### 2.3 localStorage — what I should inspect

Possible application uses include:

- A chosen light/dark theme.
- Remembered table filters.
- Non-sensitive UI preferences.
- A draft or cart state, **if** the application's design actually uses localStorage.

**Example — hypothetical preference test:** If the product specification promises that a theme persists, I would choose dark mode, refresh, close/reopen the site and check whether the theme remains. That is an **illustrative test**, not a claim that OrangeHRM uses localStorage for its theme.

### 2.4 sessionStorage — what I should inspect

Possible application uses include temporary per-tab UI state such as:

- A multi-step form draft.
- A selected tab or section in one browser tab.
- Temporary wizard progress.

Because sessionStorage is associated with a specific tab's page session, I should compare:

1. Reload in the **same tab**.
2. Navigate within that tab.
3. Open a **new tab** under controlled conditions.
4. Close the original tab and open a new page session.

**Important nuance:** Depending on how a new tab is opened, a new document may receive an initial copy of another tab's sessionStorage, but subsequent changes are separated. Therefore, I should **observe** the actual tab behaviour instead of stating that sessionStorage is *always empty* in a new tab.

### 2.5 Storage testing does not equal authentication testing

If a page looks logged in after clearing one storage type, that does not necessarily establish a security defect.

I should inspect **a fresh protected request** and check what the application is designed to store. Some apps use `HttpOnly` session cookies, not localStorage. Related security-focused tests are documented in [Day 6 Advanced](03-qa-advanced.md).

---

## 3. Inspecting Browser Storage in Chrome and Microsoft Edge

### 3.1 Where the values are shown

1. Open an approved practice application.
2. Press **F12** or **Ctrl + Shift + I** to open DevTools.
3. Select **Application** (Chrome) or the corresponding **Application/Storage** tools in Edge.
4. Expand the site's **Cookies**, **Local Storage**, and **Session Storage** categories.
5. Select the application's origin and inspect **names, types/attributes, and changes**.
6. Record only the non-sensitive observations needed for QA.

Some DevTools labels move between versions. The important goal is to locate the storage section for the **correct origin**, not to assume the menu appears identically in every browser.

### 3.2 Manual storage-check scenario — STOR-01

**Title:** Inspect how site data changes after login and logout  
**Type:** Browser state observation  
**Status:** **NOT RUN**

**Preconditions:** Authorized test account; browser profile available for testing; no private production credentials in screenshots.

**Steps:**

1. Open the site in a test browser/profile.
2. Record which storage categories are populated **before login**, without copying secret values.
3. Log in using the site's supported flow.
4. Observe the **names/attributes** of any changed cookies and relevant non-sensitive storage entries.
5. Open another protected page to understand whether the session continues.
6. Use the product's Logout action.
7. Observe how the storage entries change.
8. Attempt a **new protected request** and record whether authentication is still accepted.

**Expected result:** Authentication and logout should match the application's **approved** session policy; do not assume all cookies or all localStorage keys must be deleted.

**Execution:** **NOT RUN**  
**Actual result:** **Not observed**  
**Evidence:** **Not captured**

### 3.3 Manual storage-check scenario — STOR-02

**Title:** Compare a temporary preference or form state across reload and tabs  
**Status:** **NOT RUN**

1. Find a feature that actually stores a preference or temporary form state.
2. Record the agreed persistence requirement.
3. Change the UI state, then reload the same tab.
4. Check whether the state remains or resets.
5. Open a separate tab and compare.
6. If authorized, close/reopen the browser to check persistence.
7. Note whether cookies, localStorage or sessionStorage correspond to the observed behaviour—without assuming the mechanism before inspection.

**Expected result:** Behaviour matches the product's stated persistence rules.

### 3.4 Clearing storage safely — STOR-03

The official practical assignment requires repeating user actions **with storage cleared**.

For an authorized practice environment:

1. Confirm the current test account and make a note of necessary setup.
2. Open DevTools → **Application** → **Storage / Clear site data** (or the appropriate browser option).
3. Select the intended site's data categories, including cookies/localStorage/sessionStorage **as required for the test**.
4. Avoid deleting unrelated site data or personal browser-profile information.
5. Record exactly **which categories** were cleared and when.
6. Reload the application; observe whether the user is logged out, preferences reset, or navigation changes.
7. Reauthenticate if the follow-up action requires a logged-in session.
8. Repeat the same user action and compare against the original run.

**Caution:** Clearing site data and clearing the HTTP/browser **cache** are related but **not identical** operations. Record which was used; do not describe them as the same test.

| Detail to record | Example entry (template only) |
| --- | --- |
| Origin | [Fill in during test] |
| Storage cleared | [Cookies / localStorage / sessionStorage / selected other storage] |
| Cache separately cleared? | [Yes / No / Not applicable] |
| Before state | [Actual observation] |
| After state | [Actual observation] |
| Reauthentication needed? | [Observed result] |
| Console/Network evidence | [Sanitized observations] |
| Status | **NOT RUN** |

---

## 4. Caching — Why a User May See Old Information

A **cache** stores or reuses responses/resources so that browsers and other layers do not always need to download the same data again.

Caching can improve performance, but a stale response or outdated asset may cause the user to see old content after a deployment.

### 4.1 Common caching concepts

| Concept | What I understand | Potential QA issue |
| --- | --- | --- |
| **Browser HTTP cache** | Browser may reuse previously downloaded responses according to caching rules | Old CSS, JS or images after a release |
| **CDN / proxy cache** | Shared infrastructure may reuse responses for multiple users | Outdated content in some locations |
| **Application memory cache** | A frontend may reuse previously fetched app data in memory | Table still shows older results after an update |
| **Service worker / offline cache** | If installed, a service worker may intercept requests and use cached resources | Old pages or assets despite a normal reload |
| **No cache or revalidation** | Some content should be freshly retrieved or checked with the server | Wrong persistence of sensitive or changing responses |

**Note:** Not every application uses a CDN, service worker or local data cache. I should only claim one is involved after inspection.

### 4.2 Cache-related HTTP headers

| Header | What it can tell me |
| --- | --- |
| `Cache-Control` | Rules for caching, freshness, revalidation or no-store behaviour |
| `ETag` | Validator identifying a response version for conditional requests |
| `Last-Modified` | Date validator used in some revalidation flows |
| `If-None-Match` | Client validator sent with a conditional request |
| `If-Modified-Since` | Client timestamp used for conditional revalidation |
| `Age` | Approximate age of a cached response in some intermediary caches |

A server can respond **`304 Not Modified`** to a conditional request, allowing a browser to reuse its cached body. That is generally **expected cache validation**, not an API failure.

`Cache-Control: no-cache` means a cache generally must revalidate before reuse; it does **not** simply mean “never store.” `no-store` is the directive intended to prohibit storing under the relevant caching rules.

### 4.3 Hard reload vs disabled cache vs clearing site data

| Action | What it helps test | Limitation |
| --- | --- | --- |
| **Normal reload** | Normal browser caching behaviour | Cached resources may be reused |
| **Hard reload** | Attempts to refresh resources more aggressively | Does not necessarily erase every application/service-worker cache |
| **Disable cache (DevTools)** | Re-fetches eligible network resources while DevTools is open | Only applies under the browser's DevTools conditions; does not simulate a normal user |
| **Clear cached images/files** | Removes selected browser resource cache | Does not necessarily clear cookies/localStorage |
| **Clear site data** | Resets selected site storage and possibly other categories | Can destroy test setup or log the user out; choose categories carefully |
| **Fresh browser profile / incognito** | Helps compare against a cleaner environment | May have different extension, privacy and login settings |

**What I learned:** I should explicitly record the cache state when comparing before/after results.

### 4.4 Cache investigation — CACHE-01 (planned)

**Title:** Verify a changed resource or page state is not incorrectly stale after update  
**Status:** **NOT RUN**

**Preconditions:** Authorized test environment with a known before/after change or version, and agreed expected refresh behaviour.

1. Load the page normally and note the relevant content/resource version.
2. Record relevant Network request URLs, status codes and cache-related headers.
3. Make or observe an **approved change** to the resource/data.
4. Refresh normally and check the visible content.
5. If stale, repeat with DevTools **Disable cache** or an appropriate hard reload.
6. If relevant, inspect service workers or other caching mechanisms.
7. Compare the observed behaviour with the approved freshness requirement.
8. Record browser/build, cache method, response headers and screenshots.

**Expected result:** The product shows fresh content according to its approved cache/freshness policy; not every resource must be fetched on every page load.

**Actual:** **Not observed**.

### 4.5 Cache investigation — CACHE-02 (planned)

**Title:** Compare a normal reload with a cold-load condition

| Measurement | Normal reload | Cache-disabled / controlled cold load |
| --- | --- | --- |
| Same application URL and build | To record | To record |
| Relevant request status | NOT MEASURED | NOT MEASURED |
| Request transfer/source | NOT MEASURED | NOT MEASURED |
| Main UI content version | NOT OBSERVED | NOT OBSERVED |
| Visible loading behaviour | NOT OBSERVED | NOT OBSERVED |
| Screenshots | Pending | Pending |

I should not treat `304` or a memory/disk cache indicator as a defect without establishing the actual mismatch.

---

## 5. Network Throttling — Testing Under Slow Connections

**Network throttling** simulates some limits of a slower connection so I can check whether the application remains usable.

It may add **latency**, limit **throughput**, or simulate **offline** access depending on the chosen preset. A browser preset is a **simulation**, not a perfect replacement for testing on a real weak cellular connection.

### 5.1 Why QA tests slower networks

Possible user-facing risks include:

- Blank or slow-loading screens with no helpful indicator.
- Double-clicks or repeated submissions because a button appears unresponsive.
- Incomplete form submissions or lost typed data.
- Misleading success messages when the operation has not completed.
- Unclear retry/error feedback after request failure.
- Partial rendering when images or scripts load much later.

### 5.2 How I would enable throttling

1. Open **DevTools → Network**.
2. Locate the **Throttling** dropdown; the default is often **No throttling**.
3. Select a built-in slower preset or an approved **custom profile**.
4. Record the preset name and values **as displayed in the installed browser**.
5. Enable **Preserve log** if the action navigates or redirects.
6. Repeat an action that was already tested under normal conditions.
7. Compare visible state, relevant requests, status/failed requests, and timing.
8. Reset to **No throttling** after finishing the experiment.

**Important:** A preset's exact bandwidth/latency values can vary by browser/version. I should not claim a specific speed unless I record it from my actual DevTools configuration.

### 5.3 Scenario — NET-01: Slow login (planned)

**Application candidate:** [OrangeHRM demo](https://opensource-demo.orangehrmlive.com/) — previously used for QP-2 login practice  
**Status:** **NOT RUN under throttling**

1. Open the login page and record the baseline state.
2. Open Network and select an approved slow preset.
3. Submit **valid practice credentials**.
4. Observe how the login form behaves while waiting.
5. Check whether the application displays reasonable loading/disabled-state feedback if required.
6. Inspect the login request and redirect chain.
7. Check whether a completed login leads to the authorized page.
8. Record the actual request path/status, timing, Console errors and screenshot.

**Expected:** Login succeeds or fails according to the actual credentials/server rules; the UI should not falsely claim success or silently double-submit. Exact loading-state requirements need product confirmation.

**Previous evidence vs new work:** QP-2 previously documented `POST /web/index.php/auth/validate → 302 Found` and dashboard `200 OK` during a successful practice login. Those numbers are **not** new measurements from a slow-network run.

### 5.4 Scenario — NET-02: Slow search (planned)

1. Log in to an authorized test account.
2. Open a searchable module if available.
3. Run one search under normal network.
4. Repeat the same search under the chosen slow preset, with controlled cache/data state.
5. Observe loading indicators, disabled controls, duplicate requests and final results.
6. Record if the UI permits additional input while a search is pending.
7. Compare actual results against the approved requirements.

**Status:** **NOT RUN**.

---

## 6. Offline Mode — What Happens When the Network Disappears?

**Offline testing** checks how the application behaves when the browser cannot reach the network. DevTools offline mode simulates loss of network connectivity for requests governed by the browser's emulation.

A web application does **not** necessarily have to work fully offline. The requirement may be to display a useful error, preserve the user's typed data, prevent false success, or allow retry when connectivity returns.

### 6.1 Three common conditions to distinguish

| Condition | Example | QA question |
| --- | --- | --- |
| **Already offline before action** | Open page, set Offline, then click Search | Is failure clearly reported without claiming success? |
| **Connection lost during action** | Start checkout then disconnect network | Is the final transaction/order state handled safely? |
| **Connection restored after failure** | Turn network back on and retry | Does the app recover without unintended duplicate operations? |

Payment and order tests must use **authorized sandbox data only**. Offline checkout behaviour is a proposed test scenario, not a reported defect.

### 6.2 Scenario — NET-03: Offline navigation (planned)

1. Load an allowed test page under normal conditions.
2. Open DevTools → Network and select **Offline**.
3. Attempt to open another page or perform an action that needs the server.
4. Record whether a network request fails, the page shows an error, or cached content remains visible.
5. Return to **No throttling**.
6. Retry and record recovery.
7. Verify the actual state rather than assuming a cached page means the server responded.

**Expected:** Error/recovery behaviour must match the application's approved offline support policy.

**Status:** **NOT RUN**. No offline defect or recovery measurement has been recorded.

### 6.3 What is a failed request vs a 4xx/5xx response?

A browser unable to reach a server may show a **network failure** rather than a normal HTTP response with a status code.

I must distinguish:

- **`404`** — the server responded that a resource was not found.
- **`500`** — the server responded with an error.
- **Request failed / no HTTP status** — the request may not have received a normal HTTP response (e.g., offline).

This distinction matters when I write **Actual Result** and attach Network evidence in a Jira bug report.

---

## 7. Responsive Design — Testing Different Layout Widths

**Responsive design** adapts the interface to available viewport space. It is not enough that a page technically loads on a phone—the user should still be able to read content, interact with forms, and complete important tasks.

### 7.1 Terms I need to understand

| Term | Meaning | QA focus |
| --- | --- | --- |
| **Viewport** | Browser's visible layout area | Controls available width/height for layout |
| **Breakpoint** | Condition/width at which the layout changes | Check behaviour immediately before/after layout changes |
| **Media query** | CSS rule that applies under specified conditions | Can switch nav, grid, spacing and visibility |
| **Device emulation** | DevTools simulation of viewport/device properties | Useful for layout testing; not a real-device guarantee |
| **Touch target** | Area users tap or click | Check whether controls remain usable |
| **Horizontal overflow** | Content extends sideways beyond intended viewport | May hide fields/buttons or cause awkward scrolling |
| **Responsive image/text** | Content adapts to changing widths | Avoid unreadable text, stretched imagery and clipped content |

A breakpoint should be derived from the application's **actual CSS or design specification**, not chosen arbitrarily and then treated as an official product boundary.

### 7.2 How I would use device emulation

1. Open the application in Chrome or Edge.
2. Press **F12**.
3. Turn on **Device Toolbar / device emulation** (often **Ctrl + Shift + M**).
4. Test relevant viewport presets or enter specific width/height values.
5. Observe menus, buttons, forms, tables, labels, modals, images and scrolling.
6. Rotate the simulated orientation if relevant.
7. Test just below and above a **confirmed** layout breakpoint.
8. Capture screenshots only after the layout has settled.
9. Repeat critical flows on a **real device** when available and required.

**Note:** A desktop emulator may not reproduce every real-device behaviour, virtual keyboard, OS interaction or browser quirk.

### 7.3 Scenario — RESP-01: Login page layout (planned)

**Purpose:** Check whether the login form is usable across relevant viewport widths.

| Check | What I should inspect |
| --- | --- |
| Logo and title | Do they remain readable and correctly placed? |
| Username/password | Are labels visible, inputs reachable and not clipped? |
| Login button | Is it fully visible and clickable? |
| Validation messages | Do they remain readable without overlapping fields? |
| Page scrolling | Is there unintended horizontal overflow? |
| Keyboard focus | Can the user navigate through controls correctly? |
| Orientation | Does landscape/portrait behave according to design? |

**Status:** **NOT RUN**. A viewport-specific PASS or FAIL must come from actual observation.

### 7.4 Scenario — RESP-02: Table / employee list layout (planned)

An employee search/list page may contain a table that does not fit a narrow viewport.

Questions I would test:

- Does the product intentionally allow horizontal table scrolling?
- Are column labels visible or otherwise understandable?
- Can the user still reach Search, Reset and row actions?
- Are controls obscured by sticky headers or floating elements?
- Does filtering still work when navigation is collapsed?
- Do loading and error states remain readable?

I should verify the **intended design**. Not every horizontal scroll bar is automatically a defect; some responsive tables deliberately scroll.

### 7.5 Responsive breakpoint boundary testing

If a product's actual design includes a breakpoint at **768 CSS pixels**, then a useful boundary-focused experiment would compare:

`767px → 768px → 769px`

This is a **hypothetical breakpoint example**. It is **not** a claim that OrangeHRM or the assigned site changes layout at 768px.

| Width | What to observe | Execution |
| --- | --- | --- |
| One pixel below confirmed breakpoint | Pre-breakpoint layout | NOT RUN |
| At confirmed breakpoint | New or unchanged layout per CSS/design | NOT RUN |
| One pixel above confirmed breakpoint | Post-breakpoint layout | NOT RUN |

**What I learned:** Responsive testing should investigate where layouts change, not only a random collection of mobile device presets.

---

## 8. Integrating Storage, Caching, Network, and Responsive Checks

The four syllabus topics connect during real use. For example, a user might log in on a mobile viewport over a slow network, navigate to a page with cached assets, then lose connectivity.

Each layer can affect the observed outcome.

| Symptom | Investigations I should prioritize | Don't assume |
| --- | --- | --- |
| User sees old content after deployment | Cache headers, content versions, normal vs cache-disabled reload | “Backend is definitely broken” |
| User appears logged in after clearing localStorage | Session cookies, server-side authorization, what storage was actually cleared | “Session security is defective” |
| Page becomes blank on slow network | Network failures, partial resources, Console, loading/error handling | “Slow Internet is the entire root cause” |
| Search button is hidden on mobile | Viewport width, breakpoint, overflow, intended responsive layout | “Every overflow is a bug” |
| Logout changes when tabs are involved | Cookie/session state and new protected requests | “Tab UI alone proves access is still valid” |

These are **investigation leads**, not real defects.

---

## 9. My Planned Day 6 Intermediate Test Matrix

The following test IDs are **new learning exercises** to perform in an authorized application. They are not results.

| Test ID | Main area | Scenario | Evidence to collect | Status |
| --- | --- | --- | --- | --- |
| **STOR-01** | Cookies/session state | Compare storage before login and after logout | Sanitized storage attributes, protected request outcome | **NOT RUN** |
| **STOR-02** | localStorage/sessionStorage | Compare a documented preference/draft across reload and tabs | Non-sensitive entries, screenshots | **NOT RUN** |
| **STOR-03** | Storage cleared | Repeat a user action after clearing selected site data | Cleared categories, Network and visible state | **NOT RUN** |
| **CACHE-01** | Stale resources | Compare displayed version with cache-disabled reload | Response headers, resource version, screenshots | **NOT RUN** |
| **CACHE-02** | Cache comparison | Record normal reload vs controlled cold load | Network transfer/timing notes | **NOT RUN** |
| **NET-01** | Slow network | Submit login on a selected slow preset | Status/redirect, timing, UI feedback | **NOT RUN** |
| **NET-02** | Slow network | Repeat search with controlled conditions | Request timing, loading state, final result | **NOT RUN** |
| **NET-03** | Offline | Navigate/action offline, then reconnect | Failed requests, error/recovery screenshots | **NOT RUN** |
| **RESP-01** | Responsive login | Evaluate narrow viewports and input usability | Width/height, screenshots, overflow notes | **NOT RUN** |
| **RESP-02** | Responsive data page | Inspect search/table controls near breakpoint | Width, navigation/action accessibility | **NOT RUN** |

### Standard test record

```markdown
**Case ID:**
**Application / URL:**
**Environment / build:**
**Date and time:**
**Browser + version / device or emulation:**
**Viewport dimensions (if relevant):**
**Cache state / storage-clearing method:**
**Network preset and recorded configuration:**
**Approved requirement / expected result:**
**Preconditions and test data:**
**Steps actually executed:**
**Actual observed behaviour:**
**Relevant requests and response codes:**
**Console findings:**
**Evidence (sanitized screenshot / log / HAR):**
**Result:** PASS / FAIL / BLOCKED / NOT RUN
**Linked Jira issue (only if a verified defect exists):**
```

**Critical distinction:** A completed *test definition* is not a completed *test execution*. Only record **PASS/FAIL** after executing the steps and comparing against a confirmed requirement.

---

## 10. Day 6 Official Practical Task — Five User Actions

The official Day 6 assignment (PDF page 12) asks me to:

1. Pick a **live web application**.
2. Investigate **five user actions**.
3. Record the **requests made**, their **status codes**, and any **Console errors**.
4. Repeat the same flows on a **throttled network**.
5. Repeat them **with storage cleared**.
6. Save findings/screenshots in `day-06-web-foundations/`.
7. Prepare **CP-2 slides covering Days 4–6** in the `presentations/` folder.

This is the assignment for **all of Day 6**, not an extra requirement invented for Intermediate.

### Proposed OrangeHRM action list — NOT RUN as Day 6 practical

| # | User action | Normal network | Throttled network | Storage cleared |
| --- | --- | --- | --- | --- |
| 1 | Valid login | NOT RUN | NOT RUN | NOT RUN |
| 2 | Open dashboard | NOT RUN | NOT RUN | NOT RUN |
| 3 | Open PIM section (if available) | NOT RUN | NOT RUN | NOT RUN |
| 4 | Perform employee search (if authorized/available) | NOT RUN | NOT RUN | NOT RUN |
| 5 | Log out | NOT RUN | NOT RUN | NOT RUN |

**Application candidate:** [OrangeHRM Demo](https://opensource-demo.orangehrmlive.com/). I used it previously for [QP-2 login Network learning](https://g-team-qfw281wn.atlassian.net/browse/QP-2), but I have **not** yet executed these five actions under all three Day 6 conditions.

**Important method:** One user action may generate **multiple requests**. Capture the relevant sequence, not just one randomly selected `200` request. When storage clearing logs the user out, document the new state and sign in again as needed; do not treat a predictable redirect as a bug.

### Simple evidence table — to complete during execution

| Action | Network request(s) | HTTP status / failure | Console error | Slow-network difference | After storage clear | Screenshot |
| --- | --- | --- | --- | --- | --- | --- |
| Login | — | — | Not checked | Not tested | Not tested | — |
| Dashboard | — | — | Not checked | Not tested | Not tested | — |
| PIM | — | — | Not checked | Not tested | Not tested | — |
| Search | — | — | Not checked | Not tested | Not tested | — |
| Logout | — | — | Not checked | Not tested | Not tested | — |

---

## 11. How I Will Report Real Issues to Jira

From Day 5, I learned that **a symptom needs evidence, reproducible steps, and a confirmed expected result** before becoming a professional bug ticket.

If I genuinely observe a mismatch while testing Day 6:

1. Confirm the relevant product requirement.
2. Repeat the exact action under controlled storage, cache, network and viewport settings.
3. Record the browser/OS/build and any network preset/breakpoint.
4. Compare expected vs **actual observed** results.
5. Attach readable UI screenshots and sanitized Network/Console evidence.
6. Create a Jira **Bug**, linking its source test when appropriate.
7. Provide an impact-based severity explanation and triage priority.
8. Keep **suggested root causes** separate from confirmed evidence.

**Existing Jira practice links:**

- [QP-2 — Login story and earlier successful DevTools redirect inspection](https://g-team-qfw281wn.atlassian.net/browse/QP-2).
- [QP-5 — Practice failed-image fallback test](https://g-team-qfw281wn.atlassian.net/browse/QP-5).
- [QP-6 — Practice broken-image bug](https://g-team-qfw281wn.atlassian.net/browse/QP-6).

Those Jira items **do not** demonstrate a newly verified Day 6 storage/caching/throttling/responsive bug.

---

## 12. Common Mistakes I Want to Avoid

| Mistake | What I should do instead |
| --- | --- |
| Treating cookies, localStorage and sessionStorage as identical | Distinguish sending, lifetime, origin/tab scope and accessibility |
| Assuming a cookie is readable by JavaScript | Check attributes such as `HttpOnly` |
| Claiming clearing localStorage must log out every app | Confirm session mechanism and actual protected request outcome |
| Clearing browser data without recording which categories | Document exact storage/cache scope and preserve test setup |
| Equating `304` or cached responses with defects | Compare freshness policy and actual content |
| Mixing normal cache and disabled-cache timings without context | Record test conditions |
| Calling simulated slow network “real 3G” without measuring | Record the exact preset and its configured values |
| Treating offline failures as HTTP 404 or 500 | Distinguish transport failure from server response |
| Assuming every app supports full offline operation | Follow approved offline/error-handling requirements |
| Declaring any mobile horizontal scrolling a defect | Check intended table/navigation layout |
| Assuming breakpoint at 768px for the real app | Inspect actual CSS/design; use 768px only as an illustrative boundary |
| Claiming Day 6 tests PASS from old QP-2/QP-6 screenshots | Keep new test results **NOT RUN** until measured |
| Posting raw cookies or auth tokens to GitHub | Redact and share only approved evidence |

---

## 13. My Key Takeaways

- **Cookies:** May participate in HTTP session handling; attributes and server-side session validity matter.
- **localStorage:** Usually persists across reloads and browser restarts; useful for testing retained UI state.
- **sessionStorage:** Intended for a tab's page session, with special behaviour possible when a tab is created from another.
- **Caching:** Can improve speed but also create stale-content concerns; headers and comparison conditions matter.
- **Throttling:** Reveals how loading, submissions, errors and retries behave under slower connectivity.
- **Offline mode:** Helps check failure and recovery handling without assuming full offline support.
- **Responsive design:** Requires checking usable layouts and actual breakpoint boundaries, not just selecting a device preset.
- **Evidence integrity:** Real Network values and screenshots must come from the executed Day 6 test, not from invented examples.

### Final Reflection

Day 6 Intermediate helped me connect browser storage, caching, connection quality, and screen layout to real software quality risks. I now understand how to use Chrome/Edge DevTools to **inspect state, control test conditions, and design specific checks**. My next step is to complete the official five-action investigation, repeat it under throttling and cleared storage, and document actual findings in my repository.

## References

1. **RoBenDevs QA Engineer Internship — 14-Day Foundation Programme**, Day 6 *Web Foundations for Testers*, **Intermediate topics on page 11**, practical task and CP-2 on **page 12**.
2. [Day 6 Basic — Web Architecture, HTTP, Console and Network](01-qa-basic.md).
3. [Day 6 Advanced — Sessions, CORS, Mixed Content and Lighthouse](03-qa-advanced.md).
4. [Day 5 Intermediate — HAR, Triage and Retesting](../day-05-bug-reporting/02-qa-intermediate.md).
5. [Day 4 Practical Assessment](../day-04-manual-testing/day-04-practical-assessment.md).
6. [QP-2 — Login Practice](https://g-team-qfw281wn.atlassian.net/browse/QP-2).
7. [QP-5 — Image-Fallback Test](https://g-team-qfw281wn.atlassian.net/browse/QP-5) and [QP-6 — Practice Defect](https://g-team-qfw281wn.atlassian.net/browse/QP-6).
