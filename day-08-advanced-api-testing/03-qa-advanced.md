# Day 08 — Advanced: API Reliability, Concurrency, Rate Limits and Security

**Programme:** RoBenDevs QA Engineer Internship — 14-Day Foundation Programme  
**Day:** 08  
**Level:** Advanced  
**Date:** 17 November 2026  
**Source:** RoBenDevs QA Engineer Internship — 14-Day Foundation Programme, **page 13**  
**Practice tools:** Postman, Newman, GitHub Actions, Node.js, PowerShell  
**Test APIs:** Swagger Petstore v2 (public demo), local race-condition lab (`127.0.0.1:3000`), local authorization lab (`127.0.0.1:3001`)

## 1. What I focused on

The official **Day 08 Advanced** syllabus includes:

1. **Idempotency** — sending the same payment/order request twice and checking that it does not create unintended duplicates.
2. **Concurrency / race conditions** — sending requests in parallel to see whether simultaneous operations violate business rules.
3. **Rate limits and retries** — understanding how an API behaves under repeated requests and how clients should retry safely.
4. **Security / authorization** — changing a resource ID to check whether one user can access another user's data.

During today's practice, I tested **idempotency** and **authorization** using Newman, reproduced and investigated a **race condition** with a local Node.js API, and studied **rate limits and retries** as a concept. I have **not** claimed an executed rate-limit test.

The extended Day 08 assessment also includes **JSON Schema** and **CSV data-driven** runs; those are primarily **Intermediate** topics and are documented separately in [`02-qa-intermediate.md`](02-qa-intermediate.md) and [`assessment.md`](assessment.md).

---

## 2. Idempotency — repeating the same request safely

### 2.1 My understanding

An operation is **idempotent** when repeating the same request has the same **intended final effect** as performing it once. The responses do not have to be identical.

- **GET** should not change the resource.
- **PUT** is intended to be idempotent: updating a pet to `status=sold` twice should leave the pet in the same state.
- **DELETE** is intended to be idempotent at the resource-state level: once deleted, the resource remains absent; a second DELETE may return a different HTTP status.
- **POST** is **not automatically idempotent**. For payments/orders, an application often needs an **idempotency key** so that retrying a request does not charge a customer or create an order twice.

**Business example:** If a user clicks **Pay** twice because the first response was slow, the system should not charge twice. A QA test should check the actual number of payments/orders, not only whether both HTTP responses are successful.

### 2.2 My Petstore idempotency practical

**Environment:** Swagger Petstore demo, `https://petstore.swagger.io/v2`  
**Collection:** [Day 08 Assessment Postman Collection](api-tests/day08-assessment.postman_collection.json)  
**Folder:** `07 - Idempotency Testing`

I used a disposable pet and ran this five-request sequence with Newman:

| Step | Request | Expected behavior |
| --- | --- | --- |
| IDEM-00 | `POST /pet` | Create one test pet with a saved ID |
| IDEM-01A | `PUT /pet` | Update that pet to `sold` |
| IDEM-01B | **Identical** `PUT /pet` | Same pet ID and `sold` status |
| IDEM-02 | `GET /pet/{id}` | Verify the final ID, name and `sold` status |
| IDEM-03 | `DELETE /pet/{id}` | Clean up the disposable test pet |

The two PUT requests used the same method, endpoint and JSON body:

```http
PUT {{baseUrl}}/pet
Content-Type: application/json
```

```json
{
  "id": 123456789,
  "name": "Day 08 Idempotency Pet",
  "photoUrls": [],
  "status": "sold"
}
```

Here, `123456789` is an **illustrative** pet ID. The actual Newman collection generates a temporary ID and reuses it; it does not hardcode this example ID.

### 2.3 Verified result

The Newman terminal screenshot showed:

| Metric | Result |
| --- | ---: |
| Requests executed | **5** |
| Assertions executed | **9** |
| Passed | **9** |
| Failed | **0** |

Both identical PUT requests returned `200 OK`. The following GET verified the same pet ID and `sold` status, and the DELETE cleanup returned `200 OK`.

**What this proves:** For this observed Petstore run, repeating the same PUT preserved the final pet state. It does **not** prove that Petstore has no internal duplicate events, database writes or side effects.

**Evidence:** [`reports/assessment/idempotency-results.json`](reports/assessment/idempotency-results.json).

### 2.4 What I learned

It is not enough to send a request twice and observe two `200` responses. A useful idempotency test must verify the **final resource state** and, for financial/order APIs, the **number of actual transactions or records**. Test data must be safely cleaned up.

---

## 3. Concurrency and race conditions

### 3.1 My understanding

**Concurrency** happens when two or more requests are being processed during overlapping periods. A **race condition** happens when the final outcome depends on the timing/order of operations and a business rule can be broken.

**Example:** A store has **one item** in stock. Two customers attempt to purchase it at the same time.

- Correct behavior: **one successful order**, **one rejected order**, final stock `0`.
- Incorrect behavior: **two successful orders**, final stock `-1`.

This kind of bug may be missed by ordinary sequential testing because sequential requests do not always overlap at the vulnerable point.

### 3.2 My local race-condition lab

Instead of stress-testing the public Swagger Petstore API, I used a local Node.js practice service:

**Source:** [`api-tests/race-condition-lab.js`](api-tests/race-condition-lab.js)  
**Base URL:** `http://127.0.0.1:3000`

| Endpoint | Method | Purpose |
| --- | --- | --- |
| `/reset` | POST | Restore `stock=1`, `orders=0` |
| `/state` | GET | Inspect inventory and order count |
| `/buy-unsafe` | POST | Demonstrate an intentional race condition |
| `/buy-safe` | POST | Demonstrate the corrected behavior in this lab |

**Unsafe implementation:**

```javascript
if (stock <= 0) {
    return reply(409, { message: "Out of stock" });
}

// The update happens later; another request can pass the check.
setTimeout(() => {
    stock--;
    orders++;
    reply(200, { stock, orders });
}, 200);
```

Two requests can both see `stock=1` before either executes the delayed decrement.

**Lab fix:**

```javascript
if (stock <= 0) {
    return reply(409, { message: "Out of stock" });
}

// In this single-process Node.js lab, check and update happen
// synchronously before a second request can pass the check.
stock--;
orders++;

setTimeout(() => {
    reply(200, { stock, orders });
}, 200);
```

### 3.3 What I observed

I sent two purchase requests close together using Postman's asynchronous `pm.sendRequest()` and inspected the final inventory using `GET /state`.

| Observation | Before fix (`/buy-unsafe`) | After fix (`/buy-safe`) |
| --- | --- | --- |
| Starting stock | 1 | 1 after reset |
| Successful purchases | 2 | 1 |
| Final stock | **-1** | **0** |
| Final orders | **2** | **1** |
| Meaning | Overselling reproduced | Correct final inventory observed |

- **Before fix:** Postman showed **two failing protective assertions**, and the local state endpoint returned `{"stock":-1,"orders":2}`.
- **After fix:** The browser showed `{"stock":0,"orders":1}`. This confirms the observed final state; the screenshot provided did **not separately confirm** the count of post-fix Postman assertions.

**Root cause:** The vulnerable service checked availability, waited, then updated inventory. Two overlapping requests passed the same check.

**Important limitation:** The fix is valid for the demonstrated **single-process, in-memory Node.js lab**. A production app with multiple processes, machines or databases generally needs an atomic database update, transaction, locking or another appropriate concurrency-control mechanism.

### 3.4 QA lesson

For concurrency testing, I need to define a **business invariant** first. Here, the invariants were:

```text
stock >= 0
orders <= initial stock
```

A test that produces a red assertion is useful when it exposes a real violation of the expected rule. The goal is to **find and explain the defect**, not just make a test green.

---

## 4. Rate limits and retries — advanced concepts studied

### 4.1 Rate limiting

**Rate limiting** controls how many requests a client can make within a period. An API may return:

```http
HTTP/1.1 429 Too Many Requests
Retry-After: 30
```

The example above means the client should not immediately repeat the request; `Retry-After` can indicate a waiting period (or an HTTP date). The exact thresholds, headers and behavior depend on the API's contract.

**QA checks I would plan in an approved test environment:**

1. Verify requests within the documented limit succeed.
2. Verify the next request beyond the limit returns the documented error, often `429`.
3. Check whether a `Retry-After` header appears **if the contract requires it**.
4. Verify the user receives a useful error rather than silent failure.
5. Verify requests succeed again after the allowed waiting/reset period.
6. Check whether rate limits are applied per user, token or IP **according to requirements**.

### 4.2 Retry logic

Retries may help with **temporary** errors such as connection interruptions, `429` and some `5xx` responses. They can also make problems worse if the client retries too aggressively.

**Good retry practices:**

- Honor `Retry-After` where provided.
- Apply a bounded retry count and backoff (possibly with jitter).
- Do not blindly retry permanent `4xx` errors such as invalid input or missing authorization.
- Be particularly careful retrying **POST payment/order operations** without an idempotency key or an equivalent duplicate-prevention mechanism.
- Distinguish a request that failed to reach the server from one that was processed but whose response was lost.

**Illustrative client behavior (not executed):**

```text
Send request
   |
   +-- Success --> Stop
   |
   +-- 429 with Retry-After --> Wait as instructed; retry if within policy
   |
   +-- Temporary 5xx --> Retry with limited backoff if operation is safe
   |
   +-- Permanent client error --> Stop and report
```

**Progress:** I studied rate-limit and retry behavior, but I did **not** execute a `429` test or load test today. I did not send high-volume traffic to the shared Petstore demo.

---

## 5. Security — object-level authorization / changing a user ID

### 5.1 Authentication is not authorization

- **Authentication:** Who is making the request?
- **Authorization:** Is that authenticated user permitted to access the **specific** resource?

A request can include a valid token and still be forbidden from accessing someone else's data.

**Object-level authorization example:** User A successfully accesses `/users/user-a`, then changes the URL to `/users/user-b`. The server must check ownership/permission, not just the presence of a token.

This is the type of issue commonly described as **Broken Object Level Authorization (BOLA)** or **Insecure Direct Object Reference (IDOR)** when a vulnerability actually exists.

### 5.2 My local authorization practical

I used a local demo server with only two fictional accounts. This does not probe a real person's data or test a third-party service without authorization.

**Source:** [`api-tests/authorization-lab.js`](api-tests/authorization-lab.js)  
**Base URL:** `http://127.0.0.1:3001`  
**Postman folder:** `09 - Authorization Testing (Local Lab)`

The lab has two mock identities and demo-only tokens. Requests use:

```http
GET /users/{userId}
Authorization: Bearer <demo-token>
```

| Test | Caller | Requested object | Expected | Actual |
| --- | --- | --- | --- | --- |
| AUTHZ-01 | User A | User A profile | 200 OK | **200 OK — PASS** |
| AUTHZ-02 | User A | User B profile | 403 Forbidden | **403 — PASS** |
| AUTHZ-03 | No token | User A profile | 401 Unauthorized | **401 — PASS** |

### 5.3 Verified Newman execution

| Metric | Result |
| --- | ---: |
| Requests executed | **3** |
| Assertions executed | **3** |
| Passed | **3** |
| Failed | **0** |

**Evidence:** [`reports/assessment/authorization-results.json`](reports/assessment/authorization-results.json).

**What I learned:** Testing with an invalid API key alone is **not** enough to prove object-level authorization. I need at least two identities, a resource owned by one of them, and a test that deliberately changes the resource identifier while keeping the other user's valid token.

**Scope:** These tests verified the local mock server's access-control rules. They do **not** establish that Swagger Petstore or any production app is secure.

---

## 6. Advanced learning connected to the complete Day 08 assessment

The four independently executed Newman assessment runs produced the following verified results:

| Area | Requests | Assertions passed | Failed |
| --- | ---: | ---: | ---: |
| Authorization | 3 | 3 | 0 |
| JSON Schema | 1 | 3 | 0 |
| Idempotency | 5 | 9 | 0 |
| CSV data-driven testing | 3 | 9 | 0 |
| **Total across four separate runs** | **12** | **24** | **0** |

The CSV Newman run had **3 iterations**, and the full idempotency sequence used **two identical PUT requests** before the final GET and DELETE.

I also built a read-only GitHub Actions + Newman smoke test. The GitHub Actions job was shown as **succeeded in 19 seconds**, but the detailed individual assertion log was not reviewed in that screenshot. The CI smoke test is separate from the **24 assertions** above.

These totals represent **four selected test-folder runs**, **not** one complete, uninterrupted run of every Day 7 and Day 8 request.

### Evidence locations

- [Final Day 08 assessment and findings](assessment.md)
- [Advanced API assessment Postman collection](api-tests/day08-assessment.postman_collection.json)
- [Postman environment](api-tests/day08-demo.postman_environment.json)
- [Newman assessment reports](reports/assessment/)
- [CSV test data](api-tests/data/pet-status.csv)
- [Race-condition lab](api-tests/race-condition-lab.js)
- [Authorization lab](api-tests/authorization-lab.js)
- [GitHub Actions Newman workflow](https://github.com/Morshed-jaman/robendevs-qa-foundation-morshed-jaman/blob/main/.github/workflows/day08-newman.yml)

---

## 7. My final takeaways

1. **Idempotency:** Repeating an update should not change the intended final state or create unintended duplicate operations.
2. **Concurrency:** Parallel requests can expose bugs that sequential tests miss; I should verify business invariants after overlapping operations.
3. **Rate limits and retries:** Error responses and retry timing must be tested against the API contract, with safe request volume and no unnecessary retry storms.
4. **Authorization:** A valid login/token must not allow access to another user's protected resource simply by changing an ID.
5. **QA evidence:** A failing test can be valuable evidence of a defect, and a passing test needs a known expectation and reproducible report.
6. **Automation:** Newman executes the saved Postman tests; GitHub Actions can run Newman automatically, but neither tool writes correct test cases for me.

## 8. Progress summary

| Advanced topic | Status |
| --- | --- |
| Idempotency | **Completed:** 5 Newman requests, 9/9 assertions PASS |
| Concurrency and race condition | **Practiced:** vulnerable local behavior reproduced; corrected final inventory observed |
| Rate limits and retries | **Theory completed; practical pending** |
| Object-level authorization | **Completed:** 3 Newman requests, 3/3 assertions PASS |

**Notes:** The practice Petstore data is shared and may be reset or changed by other users; local mock servers were used for controlled concurrency and authorization examples. No production credentials or personal data were needed.

## References

- RoBenDevs QA Engineer Internship — 14-Day Foundation Programme, **Day 8**, page 13
- [Day 08 assessment and verified results](assessment.md)
- [Postman Learning Center](https://learning.postman.com/)
- [Newman CLI](https://github.com/postmanlabs/newman)
- [OWASP API Security — API1:2023 Broken Object Level Authorization](https://owasp.org/API-Security/editions/2023/en/0xa1-broken-object-level-authorization/)
