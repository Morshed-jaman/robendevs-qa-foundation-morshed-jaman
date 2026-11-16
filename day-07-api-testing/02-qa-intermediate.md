# Day 7 — Intermediate: API Response Validation, Authentication, Negative Tests & CRUD

**Programme:** RoBenDevs QA Engineer Internship — 14-Day Foundation Programme  
**Topic:** API Testing Fundamentals  
**Level:** Intermediate  
**Date:** 16 November 2026  
**Source:** Official foundation programme, Day 7, page 12  
**Practice API:** Swagger Petstore v2 (`https://petstore.swagger.io/v2`)

> **Evidence rule:** Examples below are clearly labeled. A test is only marked PASS when the actual Postman Test Results have been verified. The Swagger Petstore demo is shared; data can change between requests.

## 1. Validation: Status Codes, Body Fields, Data Types and Headers

A successful HTTP response code does not prove the returned data is correct. For each request I should verify:

- **Status:** Does the HTTP code match the documented success or error outcome?
- **Body structure:** Object versus array; expected required fields present?
- **Body values:** Do the returned ID, name, quantity or status match the request?
- **Types:** Is an ID numeric and a name a string?
- **Headers:** Does `Content-Type` indicate the expected format?

### Example: retrieve a store order

```http
GET https://petstore.swagger.io/v2/store/order/2026111609
```

```javascript
pm.test("Order GET returns 200", function () {
  pm.response.to.have.status(200);
});
pm.test("Order response is JSON", function () {
  pm.expect(pm.response.headers.get("Content-Type")).to.include("application/json");
});
pm.test("Order fields have correct values and types", function () {
  const order = pm.response.json();
  pm.expect(order.id).to.be.a("number");
  pm.expect(order.id).to.eql(2026111609);
  pm.expect(order.quantity).to.eql(1);
  pm.expect(order.status).to.eql("placed");
  pm.expect(order.complete).to.eql(false);
});
```

**Verified practice:** POS-09 `POST /store/order` returned 200 with 3 passing assertions. POS-10 `GET /store/order/2026111609` returned 200 with 3 passing assertions. These were executed manually in Postman on 16 November 2026.

## 2. Authentication: API Keys, Bearer Tokens, Missing and Expired Tokens

Authentication proves who/what is making a request. Authorization determines what that identity can do.

| Method | Typical location | Example format |
| --- | --- | --- |
| API key | Request header | `api_key: special-key` (Petstore sample) |
| Bearer token | Authorization header | `Authorization: Bearer <token>` |
| Session cookie | Cookie header | Session established through login |

**Security warning:** Never commit real tokens, cookies or private keys to GitHub.

### Suggested test matrix (not yet executed)

| Scenario | Action | What to check |
| --- | --- | --- |
| Valid key | Send documented demo key to an API-key-protected endpoint | Compare result with Swagger security contract |
| Missing key | Omit `api_key` | Verify actual status and whether protected data is exposed |
| Invalid key | Set `api_key: invalid-test-key` | Check actual authorization behavior |
| Missing bearer token | Omit Authorization on a bearer-protected test endpoint | Check against that endpoint's contract |
| Expired bearer token | Use a purposely expired token in a safe test environment | Check response and error-message safety |

**Important:** The Petstore sample may behave inconsistently with its security definition. A returned 200 without an API key is a finding to investigate, **not proof of an exploitable authorization issue**. Bearer/expiry tests need an API that actually supports bearer token authentication; do not assume all Petstore endpoints do.

## 3. Negative Testing: Missing Fields, Wrong Types, Invalid Values and Oversized Payloads

Negative tests exercise inputs outside expected conditions.

| Category | Suggested case | Reason |
| --- | --- | --- |
| Missing required field | Omit `name` or `photoUrls` from `POST /pet` | Validate required fields from API schema |
| Wrong data type | Send text where an integer is expected | Validate input types |
| Invalid value | Use nonnumeric `petId` or nonexistent resource | Validate path handling |
| Oversized payload | Submit an abnormally long test name in a safe environment | Observe size constraints and errors |

### Example — invalid pet ID

```http
GET https://petstore.swagger.io/v2/pet/not-a-number
```

**Expected:** A client error according to the API contract; for invalid supplied IDs, Swagger documents `400`. Actual implementation may differ and must be recorded.

```javascript
pm.test("Invalid pet ID is rejected", function () {
  pm.expect(pm.response.code).to.eql(400);
});
```

If actual code differs, mark the assertion failed and log an **observation**, then reproduce before reporting a defect.

### Boundary / safety notes

- Distinguish a nonexistent *numeric* ID from a malformed *nonnumeric* ID.
- Avoid huge payloads that could stress the shared demo server. Use a modest sample string and record its length; test true server limits only in a permitted environment.
- A malformed request should not return stack traces, credentials or internal implementation secrets.

## 4. CRUD Testing: Confirm Every Change

CRUD means **Create → Read → Update → Delete**.

For the Petstore pet example, the safest workflow is:

1. `POST /pet` — create a test record with a chosen unique ID.
2. `GET /pet/{petId}` — confirm it was stored.
3. `PUT /pet` — update name/status.
4. `GET /pet/{petId}` — verify the update persisted.
5. `DELETE /pet/{petId}` — delete that same record.
6. `GET /pet/{petId}` — confirm it now returns 404.

### Verified manual execution

| ID | Method | Endpoint | Status | Assertions | Outcome |
| --- | --- | --- | --- | --- | --- |
| POS-01 | GET | `/pet/findByStatus?status=available` | 200 | 3/3 | PASS |
| POS-02 | GET | `/pet/findByStatus?status=pending` | 200 | 3/3 | PASS |
| POS-03 | POST | `/pet` (create ID `202611160803`) | 200 | 3/3 | PASS |
| POS-04 | GET | `/pet/202611160803` | 200 | 3/3 | PASS |
| POS-05 | PUT | `/pet` (update pet) | 200 | 3/3 | PASS |
| POS-06 | GET | `/pet/202611160803` | 200 | 3/3 | PASS |
| POS-07 | DELETE | `/pet/202611160803` | 200 | 2/2 | PASS |
| NEG-01 | GET | `/pet/202611160803` after deletion | 404 | 2/2 | PASS |
| POS-08 | GET | `/store/inventory` | 200 | 3/3 | PASS |
| POS-09 | POST | `/store/order` (ID `2026111609`) | 200 | 3/3 | PASS |
| POS-10 | GET | `/store/order/2026111609` | 200 | 3/3 | PASS |

These results reflect screenshots shared during the Day 7 practice. **11 distinct Postman requests** have been executed so far, with **32 passing assertions across individual test runs** (3+3+3+3+3+3+2+2+3+3+3). This total is not a claim that all 11 requests ran in a single Collection Runner session.

### Collection Runner evidence

A separate **five-request** Postman Collection Runner batch (POS-01 through POS-05) was verified:
- Iterations: `1`
- Passed assertions: `15`
- Failed: `0`
- Errors: `0`
- Duration: `3.19 s`
- Average response time: `552 ms`

This batch must not be confused with the full 25-request assignment.

## 5. Practical Design and Reporting

For each planned test case, record:

- Case ID, request name and category
- Method, endpoint, headers, parameters and body
- Expected status and specific body assertions
- Actual status, response time, Postman Test Results
- PASS/FAIL/BLOCKED with sanitized evidence path
- An issue description only when a repeatable discrepancy exists

**Runner ordering matters:** Place dependent requests in order. For example, create order before retrieving it, delete it before attempting a 404 verification. Repeated iterations can overwrite public demo data.

## 6. Intermediate Checklist

- [x] Understand and use status, body and value assertions
- [x] Verify POST → GET → PUT → GET → DELETE → GET for a test pet
- [x] Observe a 404 negative verification after deletion
- [x] Use a documented sample `api_key` with Store Inventory GET
- [ ] Execute and document dedicated missing/invalid-key tests
- [ ] Execute and document wrong-type/missing-field scenarios
- [ ] Complete remaining Postman requests toward at least 25
- [ ] Export collection, cURL commands and findings for submission

## References

- Official **RoBenDevs QA Engineer Internship — 14-Day Foundation Programme**, Day 7, page 12
- [Swagger Petstore API docs](https://petstore.swagger.io/#/)
- [Swagger Petstore OpenAPI definition](https://petstore.swagger.io/v2/swagger.json)
- [Postman learning center](https://learning.postman.com/)
