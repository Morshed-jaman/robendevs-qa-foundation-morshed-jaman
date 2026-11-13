# Day 6 — Basic: My Understanding of Web Foundations and Browser DevTools

**Name:** MD Morshed Jaman  
**Programme:** RoBenDevs QA Engineer Internship — 14-Day Foundation Programme  
**Day:** 06  
**Level:** Basic  
**Topic:** Web Architecture, HTTP Basics, DevTools Console and Network Inspection  
**Learning date:** 14 November 2026  
**Document status:** Basic learning notes; Day 6 live-application practical assessment **NOT YET EXECUTED**

> **Evidence integrity:** This Markdown explains the **Basic** topics in the official Day 6 syllabus. It includes two previously documented practice examples: [QP-2](https://g-team-qfw281wn.atlassian.net/browse/QP-2) (OrangeHRM login Network investigation) and [QP-5](https://g-team-qfw281wn.atlassian.net/browse/QP-5)/[QP-6](https://g-team-qfw281wn.atlassian.net/browse/QP-6) (a broken-image lab test and bug). Any other HTTP values, Console messages or flows below are **illustrative**, not newly measured results. Screenshots and fresh Day 6 execution evidence will be added only after the tests are actually performed.

## 1. What I Am Learning on Day 6

In the previous days, I learned how to:

- **Day 3:** Design test cases using EP, BVA, decision tables, state transitions and edge cases.
- **Day 4:** Plan manual testing, record expected/actual outcomes and use Jira/Xray for test execution.
- **Day 5:** Write reproducible bug reports, collect technical evidence, triage defects and plan retests.

Now I want to understand what happens **behind the browser interface** whenever a user clicks a button, submits a form, navigates to another page or loads an image.

The official **Day 6 — Web Foundations for Testers: Basic** syllabus specifies exactly four topics:

1. **How web apps work:** browser, frontend, backend, database and CDN.
2. **HTTP basics:** methods, status codes, headers and cookies.
3. **DevTools Console:** reading JavaScript errors and warnings.
4. **DevTools Network:** inspecting requests and responses for any action.

The Intermediate and Advanced topics, and the five-action practical assessment, are listed at the end as **upcoming work**, not falsely represented as completed Basic exercises.

**My main lesson:** The page I see is only one part of a web application. QA should compare what the **browser displays** with what it **requests**, what the **server returns**, and what the **accepted requirement expects**.

---

## 2. How a Web Application Works

A simplified web application contains these components:

| Component | My understanding | Simple example |
| --- | --- | --- |
| **Browser** | The application the user operates; loads pages, executes frontend JavaScript and makes network requests | Microsoft Edge displaying OrangeHRM |
| **Frontend** | The user-facing HTML, CSS and JavaScript that render screens and handle interactions | Login form, validation messages, employee list, dashboard |
| **Backend / server** | Processes requests, enforces business rules and authentication, and prepares responses | Validates login credentials and determines access permissions |
| **Database** | Stores information that the application reads or updates | Accounts, employee records or orders |
| **CDN (Content Delivery Network)** | Distributed servers that can deliver static assets and other cacheable content closer to users | Images, stylesheets, JavaScript or fonts served through a CDN |

A real application may also have reverse proxies, API gateways, queues, caches, multiple services and third-party providers. The table is the **simplified learning model from the syllabus**, not a claim that OrangeHRM uses every layer in precisely this way.

### 2.1 Simplified request and response flow

```text
                         USER
                          |
                    Clicks / submits
                          |
                          v
                  BROWSER + FRONTEND
                          |
                     HTTP request
                          v
                      BACKEND
                          |
                   Reads / updates
                          v
                      DATABASE
                          |
                     Data / result
                          v
                      BACKEND
                          |
                    HTTP response
                          v
                  BROWSER + FRONTEND
                          |
             Renders result for the user

         CDN (if used) may deliver static resources
         such as CSS, JavaScript, fonts and images.
```

### 2.2 Example — Login flow

Consider a user signing in:

1. The **browser** displays a form.
2. The user enters their account identifier and password.
3. The **frontend** submits the appropriate request to the server.
4. The **backend** validates credentials and checks the authentication rules, potentially consulting stored account data.
5. The server responds with a result, perhaps including a redirect or session information.
6. The browser receives the response and shows the correct page or error message.

The details depend on the application. A traditional server-rendered site might redirect after a form POST, while a single-page application might receive JSON and navigate in JavaScript.

**What I learned:** A login error can have several causes. I should not immediately blame the frontend or backend because the same visible symptom can come from different layers.

### 2.3 How QA observes each layer

| Observation | Tool / source | Example question |
| --- | --- | --- |
| User-visible behaviour | Browser UI and screenshots | Did the dashboard load? |
| Frontend runtime behaviour | DevTools **Console** | Did JavaScript throw an exception? |
| HTTP traffic | DevTools **Network** | Which request was sent? What response came back? |
| HTML / UI state | DevTools **Elements** | Is the validation message present but hidden? |
| Backend behaviour | Authorized logs / API response | Did the server reject or accept the operation? |
| Stored data | Authorized app/admin access | Did the record actually change? |

**Important boundary:** Browser DevTools does **not** automatically give me access to the backend code or database. I should use only authorized environments and records.

---

## 3. HTTP Basics — Request and Response

**HTTP (Hypertext Transfer Protocol)** describes how a client (often a browser) requests resources and how a server responds. Most modern websites use **HTTPS**, meaning HTTP communication is protected in transit by TLS.

A request typically contains:

- **Method:** what kind of operation is requested.
- **URL:** the resource/endpoint being requested.
- **Headers:** metadata such as accepted formats and authentication/session information.
- **Optional body/payload:** submitted data, for example form fields or JSON.

A response typically contains:

- **Status code:** the HTTP-level outcome.
- **Response headers:** content type, caching instructions, cookies, redirects and other metadata.
- **Optional body:** HTML, JSON, an image, an error message, etc.

### 3.1 Example request and response — illustrative only

```http
POST /api/login HTTP/1.1
Host: example.test
Content-Type: application/json
Accept: application/json

{"username":"test-user","password":"[redacted]"}
```

```http
HTTP/1.1 200 OK
Content-Type: application/json

{"message":"Login successful"}
```

These are **illustrations**. They are **not** actual request/response captures from my practice. Real authentication also requires securely managed sessions or tokens; a message alone is not proof of a complete authenticated session.

---

## 4. HTTP Methods — What the Server Is Being Asked to Do

| Method | General purpose | Example user action | QA question |
| --- | --- | --- | --- |
| **GET** | Retrieve a resource | Open dashboard / fetch employee list | Is the correct data returned? |
| **POST** | Submit information or request a change | Submit a login form / create order | Is the operation validated and processed once? |
| **PUT** | Replace a resource's representation | Replace a profile record | Does the intended resource reflect the full update? |
| **PATCH** | Apply a partial modification | Change an employee's phone number | Does only the intended data change? |
| **DELETE** | Request deletion of a resource | Delete a saved draft | Is the correct record removed, and is access authorized? |

These describe common HTTP semantics; the application's actual API design can differ.

### Important QA distinctions

- **GET** should not be relied upon to perform an unsafe data-changing action.
- **POST** is **not automatically idempotent**: submitting a checkout/payment request twice may create unintended changes unless the application prevents duplicates.
- **PUT** is generally defined to be idempotent by HTTP semantics; **PATCH** may or may not be idempotent, depending on the operation.
- A successful HTTP status does **not guarantee** the returned business result is correct.

**Example:** Clicking **Pay** twice is a useful Day 3/Day 4 checkout edge case, but I must use sandbox payment data and record actual observations before claiming a defect.

---

## 5. HTTP Status Codes — Read Them in Context

The first digit groups the status codes:

| Group | General meaning | Examples |
| --- | --- | --- |
| **1xx** | Informational | 100 Continue |
| **2xx** | Success at HTTP level | 200 OK, 201 Created, 204 No Content |
| **3xx** | Redirection / further action | 301 Moved Permanently, 302 Found, 304 Not Modified |
| **4xx** | Client-side request or authorization problem, broadly speaking | 400, 401, 403, 404, 422, 429 |
| **5xx** | Server-side error | 500, 502, 503, 504 |

### 5.1 Status codes I should recognize as a QA intern

| Code | Meaning | What I would verify |
| --- | --- | --- |
| **200 OK** | Request succeeded at HTTP level | Is the response body/type/business data actually correct? |
| **201 Created** | Resource was created | Was the correct record created exactly as intended? |
| **204 No Content** | Successful request with no response body | Is the UI handling the absence of a body correctly? |
| **301 Moved Permanently** | Permanent redirect | Did navigation reach the intended location? |
| **302 Found** | Temporary redirect | Is the redirect expected after this operation? |
| **304 Not Modified** | Cached representation can be reused | Could stale cached content affect the user? |
| **400 Bad Request** | Invalid request | Is the validation feedback useful and safe? |
| **401 Unauthorized** | Request lacks valid authentication | Does the UI request login/reauthentication appropriately? |
| **403 Forbidden** | Server refuses access | Are access-control boundaries enforced? |
| **404 Not Found** | Resource could not be found | Does the app provide an appropriate fallback/error? |
| **422 Unprocessable Content** | Request content is understood but cannot be processed under its rules | Does field-level feedback match the issue? |
| **429 Too Many Requests** | Rate limit reached | Is retry guidance or handling sensible? |
| **500 Internal Server Error** | Server encountered an error | Is the user response safe and is the issue diagnosable? |
| **502 Bad Gateway** | Gateway/proxy received an invalid upstream response | Is the problem temporary or environment-specific? |
| **503 Service Unavailable** | Service currently unavailable | Is recovery/maintenance feedback appropriate? |
| **504 Gateway Timeout** | Gateway/proxy timed out waiting for upstream | Is timeout feedback appropriate? |

**What I learned:** I must interpret the status together with the **method, requested URL, response content, redirect chain and expected business behaviour**.

### 5.2 My previous QP-2 login Network practice

**Jira:** [QP-2 — User login with email and password](https://g-team-qfw281wn.atlassian.net/browse/QP-2)  
**Practice application:** [OrangeHRM demo](https://opensource-demo.orangehrmlive.com/)

My earlier DevTools practice recorded:

1. **`POST /web/index.php/auth/validate` → `302 Found`**
2. **Redirect** to `/web/index.php/dashboard/index`
3. **`GET` dashboard → `200 OK`**

This sequence provided **Network evidence consistent with successful login navigation** in the OrangeHRM demo. A `302` here was **not automatically a failure**.

**Important distinction:** The QP-2 Jira story refers to email and password. OrangeHRM's demo form uses **username** and password, so that practice does **not fully verify the email-specific acceptance criterion**.

The above was observed in previous learning work, **not re-executed as a new Day 6 test yet**.

### 5.3 My previous QP-6 broken-image investigation

**Jira:** [QP-5 — TC-IMG-001](https://g-team-qfw281wn.atlassian.net/browse/QP-5) / [QP-6 — Broken-image fallback bug](https://g-team-qfw281wn.atlassian.net/browse/QP-6)  
**Practice application:** [QA Practice Image Handling Lab](https://qapractice.hakdogan.com/ui-elements/broken-images/)

Previously documented observations:

- Request for `missing-product-photo.png` returned **`200 OK`**.
- **Content-Type** was **`text/html; charset=utf-8`**, not a PNG image type.
- The **Preview** showed the application's HTML page rather than PNG data.
- The image element showed a native broken-image placeholder and generic alternative text instead of the required meaningful fallback.

**Lesson:** A `200` status proves only the HTTP-level response was successful; it does **not** prove the requested image was delivered correctly. Inspect the response's **Content-Type** and **body**.

This was a **training-lab** finding, not an incident in a production system. The recorded screenshot evidence was in the learning chat; it was not verified as an attached file in Jira.

---

## 6. HTTP Headers — Metadata That Helps Explain Requests

HTTP headers are name/value fields that describe the request or response. They are especially helpful when debugging content types, redirects, caching and sessions.

| Header | Usually seen in | What it tells me |
| --- | --- | --- |
| **Content-Type** | Request and response | Media type of the submitted or returned content, such as `application/json` or `text/html` |
| **Accept** | Request | Response content formats the client prefers |
| **Authorization** | Request | Authentication credentials or tokens, when used; **sensitive** |
| **Cookie** | Request | Applicable cookies sent to the server; often includes session identifiers |
| **Set-Cookie** | Response | Instructions to store or update a cookie |
| **Location** | Redirect response | Target URL for navigation/redirect |
| **Cache-Control** | Either | How responses should be cached or revalidated |
| **ETag** | Response | Identifier used for cache validation |
| **Origin** | Request | Origin initiating a cross-origin request, when applicable |
| **Access-Control-Allow-Origin** | Response | Cross-origin access permission signal; covered in Advanced |

### Example — expected redirect headers (illustrative)

```http
HTTP/1.1 302 Found
Location: /dashboard
Set-Cookie: session=[redacted]; HttpOnly; Secure; SameSite=Lax
```

This example shows how a redirect target and session cookie **might** appear; it is not a copy of my OrangeHRM headers.

**How I would inspect headers:** DevTools → **Network** → select request → **Headers** → inspect **General**, **Request Headers** and **Response Headers**.

---

## 7. Cookies — A Basic Session Concept

A **cookie** is a small piece of browser-stored information that can be included automatically in HTTP requests when the cookie's domain/path and other rules match.

Common uses include:

- Session management after login.
- User preferences (depending on implementation).
- Application state or other authorized features.

### 7.1 Cookie attributes I should recognize

| Attribute | What it means for QA |
| --- | --- |
| **Expires / Max-Age** | Helps define how long the cookie remains stored |
| **Secure** | Cookie is sent only over secure connections, with defined exceptions such as localhost behaviour |
| **HttpOnly** | Prevents browser JavaScript from reading the cookie via `document.cookie` |
| **SameSite** | Controls inclusion in cross-site request situations |
| **Domain / Path** | Controls which requests receive the cookie |

**Important:** Cookies can hold session identifiers. They are **sensitive**, and I must never paste real authentication cookies or tokens into a public GitHub repository, slide, screenshot or support ticket without suitable redaction.

### 7.2 Difference between cookies and later storage topics

Day 6 **Basic** introduces cookies in the context of HTTP. Detailed comparison of **cookies, localStorage and sessionStorage** belongs to **Intermediate**.

My current question for QA is:

> After a successful login, what browser/server mechanism keeps the user authenticated, and what should happen after logout or session expiry?

I should answer from the actual app's behaviour and approved requirements—not make assumptions based on a login screenshot.

---

## 8. Chrome / Edge DevTools — Getting Started

**DevTools** are browser tools that help inspect the frontend and its interactions with web servers.

### Open DevTools

- Press **F12**, or
- Press **Ctrl + Shift + I**, or
- Right-click the page → **Inspect**.

Main tools relevant today:

| Tab | My Basic learning goal |
| --- | --- |
| **Console** | Read JavaScript errors and warnings |
| **Network** | See every request/response triggered by a user action |
| **Elements** | Optional supporting view for DOM/CSS inspection |
| **Application / Storage** | Relevant later for Intermediate session/storage testing |
| **Lighthouse** | Relevant later for Advanced performance work |

**What I learned:** Console and Network answer different questions. A page can show an error without a Console exception, and a Network failure can be visible even when the Console is quiet.

---

## 9. DevTools Console — Errors, Warnings and What They Mean

The **Console** displays browser runtime messages, including JavaScript errors, application logs and various warnings.

### 9.1 Common Console messages

| Example | Possible interpretation | Good QA action |
| --- | --- | --- |
| `Uncaught TypeError: Cannot read properties of undefined` | JavaScript tried to use a value that was not available | Note the action, file/line if visible, screenshot and UI impact |
| `Failed to load resource: the server responded with a status of 404` | Resource request did not return the requested file | Inspect the affected resource in Network |
| `Uncaught ReferenceError: x is not defined` | JavaScript referenced an undefined variable | Document the scenario and stack trace |
| `Access to fetch ... has been blocked by CORS policy` | Browser blocked cross-origin access | Record origins and relevant response headers; Advanced topic |
| `Mixed Content: The page at https://... requested an insecure resource` | HTTPS page attempted insecure resource loading | Record the blocked resource and page context; Advanced topic |

**All of the messages in this table are generic illustrations**, not newly captured Console errors from OrangeHRM.

### 9.2 How I would investigate a Console error

1. Open the target test page.
2. Open **DevTools → Console**.
3. Clear old messages if necessary and note the state before reproduction.
4. Perform **one defined user action**.
5. Check whether a new **error** or **warning** appears.
6. Record the message, timestamp where available, source/stack if useful, and what the UI actually did.
7. Cross-check the relevant Network request when the message mentions a failed resource or API call.
8. Attach a readable, sanitized screenshot to a bug **only if** the behaviour violates an approved requirement.

### 9.3 Error, warning, and log are not the same

- **Error:** May indicate an exception, failed resource, security restriction or other failure.
- **Warning:** Highlights a potential issue or deprecation; it may not indicate a user-facing defect.
- **Log / info:** Used to record general information or diagnostics.

**Important lesson:** One Console warning does **not automatically mean** there is a product bug. I need an expected-versus-actual mismatch and meaningful impact.

### 9.4 What if the Console has no errors?

Record **“No relevant Console error observed during this action”** if that is what the test actually showed.

Do **not** write “No bugs found.” The absence of Console errors cannot establish that a feature is functionally correct.

---

## 10. DevTools Network — Inspecting a Real User Action

The **Network** panel records requests for documents, CSS, JavaScript, images, Fetch/XHR calls, fonts and other resources.

For a QA engineer, the most important columns commonly include:

| Column / detail | What I learn |
| --- | --- |
| **Name / URL** | Which resource or endpoint was requested |
| **Method** | GET, POST, PATCH, etc. (may need to enable Method column or open Headers) |
| **Status** | HTTP status code or other request outcome |
| **Type** | Document, Fetch/XHR, image, stylesheet and similar resource types |
| **Initiator** | Which page/script/action initiated the request |
| **Size** | Amount transferred / cached information |
| **Time** | Total request duration |
| **Waterfall** | When requests began and how they overlapped |

### 10.1 Step-by-step Network inspection

1. Open the assigned practice application in Chrome or Edge.
2. Press **F12** and open the **Network** tab.
3. Confirm recording is enabled.
4. Enable **Preserve log** if the action includes a redirect or navigation.
5. Optionally select **Disable cache** for a controlled fresh-loading observation (while DevTools is open); record that setting because it changes behaviour.
6. Perform **one user action**, such as submitting a login form.
7. Find the relevant request using the request list or **Fetch/XHR** filter where appropriate.
8. Click the request and inspect:
   - **Headers** — method, URL, status, redirect headers and content type.
   - **Payload** — submitted form/JSON data when the request has a body.
   - **Preview** — a convenient rendering of the response.
   - **Response** — raw or displayed response data.
   - **Timing** — when and how long stages of the request took.
9. Compare the result with the **actual UI behaviour** and approved expectations.
10. Document the request and evidence without exposing passwords, authentication tokens or cookies.

**Note:** One button click can trigger many requests. I should record the **relevant request(s)** rather than assume every action maps to one API call.

### 10.2 Questions I ask while investigating

- Did the action trigger any request?
- Which HTTP method and URL did it use?
- Did the server respond, redirect or time out?
- Was the returned **Content-Type** appropriate?
- Did the response body contain the expected result or error?
- Is the UI consistent with the response?
- Were authentication or permission rules respected?
- Is the observed problem reproducible with the same test state?

### 10.3 Common traps I want to avoid

| Wrong assumption | Better interpretation |
| --- | --- |
| “302 means login failed” | A redirect may be the expected successful flow |
| “200 means everything works” | It only indicates HTTP-level success; content or business state may still be wrong |
| “The request is red, so the backend is broken” | Read its status, security restrictions, response and context first |
| “One action equals one API call” | Navigation and SPA actions can trigger multiple requests |
| “A Console warning is a confirmed bug” | Check reproducible user impact and agreed requirements |
| “A screenshot proves the root cause” | Screenshot proves a visible state; investigation may require Network/logs |
| “DevTools shows all database writes” | Server-side/database verification needs authorized application/log access |

---

## 11. Connecting Day 6 to My Earlier Jira Practice

| Previous work | What I can reuse for Day 6 learning | Link |
| --- | --- | --- |
| **QP-2: Login acceptance criteria** | Observe POST login validation, redirect, dashboard GET and their statuses | [QP-2](https://g-team-qfw281wn.atlassian.net/browse/QP-2) |
| **QP-3: REG-01 manual test** | Future form validation and request/response investigation if an aligned test app is available | [QP-3](https://g-team-qfw281wn.atlassian.net/browse/QP-3) |
| **QP-4: Xray Test Execution** | Track a future executed test outcome; the existing execution container does not prove a result | [QP-4](https://g-team-qfw281wn.atlassian.net/browse/QP-4) |
| **QP-5: Failed-image test** | Compare expected fallback to UI behaviour and related resource request | [QP-5](https://g-team-qfw281wn.atlassian.net/browse/QP-5) |
| **QP-6: Broken-image bug** | Differentiate HTTP 200, HTML response content, image decode failure and UI fallback | [QP-6](https://g-team-qfw281wn.atlassian.net/browse/QP-6) |

My previous OrangeHRM and broken-image results are **learning references**, not freshly rerun Day 6 practical evidence.

---

## 12. Basic-Level Practice Checklist (Pending Execution)

Before the official Day 6 assessment, I can practise the four Basic topics with the same tools.

### Practice A — Explain the architecture

- [ ] Identify browser, frontend, backend, database and optional CDN in the simplified diagram.
- [ ] Explain what each part does during a login.
- [ ] Explain why a browser screenshot cannot show the backend or database's full internal behaviour.

### Practice B — Interpret HTTP

- [ ] Explain GET, POST, PUT, PATCH and DELETE with examples.
- [ ] Recognize 200, 201, 302, 400, 401, 403, 404 and 500.
- [ ] Explain the difference between **Content-Type**, **Cookie**, **Set-Cookie** and **Location**.
- [ ] Explain why the QP-6 image request can return `200` yet still be unsuitable image content.

### Practice C — Console

- [ ] Open DevTools and inspect new Console messages while performing a selected action.
- [ ] Distinguish an error from a warning.
- [ ] Capture only meaningful, non-sensitive evidence.
- [ ] Avoid declaring a bug based solely on a warning.

### Practice D — Network

- [ ] Open DevTools → Network and enable **Preserve log**.
- [ ] Perform a known user action.
- [ ] Identify the relevant request and inspect Headers, Payload, Response and Timing when applicable.
- [ ] Record the actual method, status, response type and visible UI outcome.
- [ ] Redact passwords, cookies, bearer tokens and sensitive account information.

**Practice status:** These are tasks to perform; I have not recorded new Day 6 executions or screenshots.

---

## 13. Upcoming Intermediate, Advanced and Official Practical Requirements

The next files should cover **only the actual topics assigned to those levels**:

### Intermediate (future \`02-qa-intermediate.md\`)

- Cookies vs **localStorage** vs **sessionStorage** and their effects on behaviour.
- Cache behaviour and why users might see old data.
- Network throttling and offline testing.
- Responsive design, device emulation and layout breakpoints.

### Advanced (future \`03-qa-advanced.md\`)

- Login/session expiry, logout across tabs and token refresh.
- CORS and mixed-content errors.
- Frontend performance waterfalls and Lighthouse reports.

### Official Day 6 practical assessment — NOT YET COMPLETED

The official assignment asks me to:

1. **Pick one live web application.**
2. Investigate **five user actions**.
3. Record the **requests made**, their **status codes** and **any Console errors**.
4. Test the **same flows on a throttled network**.
5. Repeat with **storage cleared**.
6. Submit **findings and screenshots** to \`day-06-web-foundations/\`.

The programme also schedules **Checkpoint CP-2** covering **Days 4–6**. Its slides belong in the \`presentations/\` folder.

### Suggested five actions (planned; OrangeHRM)

| Action | Expected investigation target | Actual request/status/Console observation |
| --- | --- | --- |
| 01 — Login | Authentication request and redirect/navigation | **NOT RUN for Day 6** |
| 02 — Open dashboard | Page/navigation and data requests | **NOT RUN** |
| 03 — Open employee/PIM view | Relevant page/API requests | **NOT RUN** |
| 04 — Search for an employee | Search/form action, if available | **NOT RUN** |
| 05 — Logout | Session/logout request and navigation | **NOT RUN** |

**Test safety:** Use an authorized demo or staging application. Do not disclose login passwords, cookies or session values; avoid changing or deleting real employee data.

---

## 14. My Key Takeaways

- **Architecture:** A web page involves multiple layers; I should distinguish UI symptoms from backend/data issues.
- **HTTP:** Methods describe requested operations, headers describe metadata, and status codes describe HTTP-level outcomes.
- **Cookies:** The browser can store and send session-related information; authentication data must be handled carefully.
- **Console:** Runtime errors and warnings are investigation clues, not automatic confirmation of a product defect.
- **Network:** Method, URL, status, payload, headers, response and timing explain what happens during a user action.
- **Real practice:** The OrangeHRM `302 → 200` login sequence and the broken-image `200 + text/html` mismatch illustrate why response context matters.
- **Evidence integrity:** My earlier Jira practice does not substitute for new Day 6 five-action execution results.

### Final Reflection

Before Day 6, I mainly focused on the screens and test cases I could see. Now I understand that each user action can involve **browser rendering, frontend logic, HTTP traffic and backend behaviour**. A QA engineer should connect these observations with the application's expected behaviour and record clear, reproducible evidence. Learning Console and Network inspection gives me a stronger foundation for the next days of API and data testing.

## References

1. **RoBenDevs QA Engineer Internship — 14-Day Foundation Programme**, *Day 6: Web Foundations for Testers*, Basic section (PDF page **11**); practical task and CP-2 submission (PDF page **12**).
2. [Day 4 — Basic: Manual Testing](../day-04-manual-testing/01-qa-basic.md).
3. [Day 5 — Basic: Bug Reporting](../day-05-bug-reporting/01-qa-basic.md).
4. [Day 5 — Intermediate: Bug Investigation](../day-05-bug-reporting/02-qa-intermediate.md).
5. [Jira QP-2 — Login Story](https://g-team-qfw281wn.atlassian.net/browse/QP-2).
6. [Jira QP-5 — Failed-Image Test](https://g-team-qfw281wn.atlassian.net/browse/QP-5).
7. [Jira QP-6 — Broken-Image Practice Bug](https://g-team-qfw281wn.atlassian.net/browse/QP-6).
8. [Chrome DevTools — Network panel reference](https://developer.chrome.com/docs/devtools/network/reference/).
9. [MDN — HTTP Overview](https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview).
