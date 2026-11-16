# Day 7 — Advanced: Official Topics and Practical API Test Analysis

**Programme:** RoBenDevs QA Engineer Internship — 14-Day Foundation Programme  
**Topic:** API Testing using Postman, Swagger Petstore v2 and Newman  
**Level:** Day 7 Advanced + practical execution evidence  
**Date:** 16 November 2026  
**API under test:** `https://petstore.swagger.io/v2`  
**Repository location:** `day-07-api-testing/`  
**Official Day 7 Advanced source:** Foundation Programme, page 12

> **Evidence integrity:** The figures below are the reported Day 7 execution summary, not a fresh execution performed while writing this document. Inspect the saved Newman JSON/HTML before claiming an individual assertion failed or passed. Swagger Petstore is a shared demonstration service, not a production security target.


## Part A — Official Day 7 Advanced Curriculum (Page 12)

The official RoBenDevs Day 7 advanced syllabus contains **three topics**: (1) error contracts, (2) pagination/filtering/sorting, and (3) API vs UI consistency. This is the primary Day 7 advanced learning scope. The additional hands-on execution and Newman material in Part B documents work actually completed during Day 7; more sophisticated automation concepts formally belong to **Day 8**.

### A1. Error Contracts — Consistent and Safe Error Responses

An **error contract** specifies how an API communicates failures: the expected HTTP status, response structure, message and absence of internal system details. An API returning an error is not enough: the error must be predictable, meaningful and safe.

**My verification checklist:**
- **HTTP status:** Compare actual statuses (e.g., 400 malformed input, 401 unauthenticated, 403 forbidden, 404 absent resource) with the particular endpoint's documented contract. Never assume every API follows identical conventions.
- **Response shape:** Verify expected keys and types such as `code`, `type`, and `message` when defined.
- **Message quality:** The error should help the client understand the failure without misleading it.
- **Information disclosure:** Check that responses do not expose stack traces, SQL statements, absolute server paths, secrets or personal data.
- **Consistency:** Similar errors should follow the same documented format and content-type.

**Petstore practice:** NEG-05 requested a nonexistent numeric pet ID and previously returned HTTP **404** with passing checks. NEG-04 requested a malformed ID (`abc123`) and previously returned **404** instead of the **400** expected by the test. The latter is an *investigation candidate*, not a confirmed product defect.

```http
GET https://petstore.swagger.io/v2/pet/abc123
```

**Illustrative response structure** (not a claim about the exact NEG-04 response):

```json
{
  "code": 1,
  "type": "error",
  "message": "Pet not found"
}
```

**Postman error-contract checks** (use with a case whose documented expected status is 404):

```javascript
pm.test("Returns the expected 404 error", () => {
  pm.response.to.have.status(404);
});

pm.test("Error response has a readable message", () => {
  const body = pm.response.json();
  pm.expect(body).to.be.an("object");
  pm.expect(body.message).to.be.a("string").and.not.empty;
});

pm.test("No obvious internal error details are exposed", () => {
  const bodyText = pm.response.text();
  pm.expect(bodyText).not.to.match(/Traceback|SQL syntax|BEGIN PRIVATE KEY|at [A-Za-z]+\.[A-Za-z]+\(/i);
});
```

The last assertion is a *limited heuristic*; it cannot prove information-disclosure safety by itself. Inspect the full response and supporting contract. Do not change a failed expected-status assertion just to achieve a green run.

### A2. Pagination, Filtering and Sorting — Boundaries and Empty Results

**Pagination** splits a large set into smaller pages. **Filtering** selects records matching conditions. **Sorting** orders records according to a specified field. A tester needs to check status *and* the correctness and completeness of the returned data.

| Area | Example test | Validation |
| --- | --- | --- |
| Pagination | First page and last page | Right items, no unintended omissions |
| Pagination | `limit=1`, beyond-last page, invalid page size | Documented boundary behavior |
| Filtering | Available pets | Every returned pet has `status="available"` |
| Filtering | Unsupported or missing status | Behavior follows documented rules |
| Filtering | Filter matching zero records | Valid empty results handled correctly |
| Sorting | Ascending vs descending | Correct order of values |
| Sorting | Duplicate values and empty results | Consistent tie-handling and ordering |

**Actual Day 7 Petstore filtering requests:**

```http
GET https://petstore.swagger.io/v2/pet/findByStatus?status=available
GET https://petstore.swagger.io/v2/pet/findByStatus?status=pending
```

POS-01 and POS-02 were exercised during Day 7. An additional content-validation test for POS-01 would be:

```javascript
pm.test("All results are available pets", () => {
  pm.response.to.have.status(200);
  const pets = pm.response.json();
  pm.expect(pets).to.be.an("array");
  pets.forEach(pet => pm.expect(pet.status).to.eql("available"));
});
```

NEG-07 exercised an invalid `status` filter and received HTTP **200** where the test expected **400**. Check the API documentation and returned body before deciding whether this is wrong.

**Pagination and sorting illustrations only** — these are **not confirmed Swagger Petstore v2 endpoints**:

```http
GET /products?page=1&limit=10
GET /products?sort=price&order=asc
```

For an API that actually exposes these parameters, test minimum/maximum page size, first/last page, beyond-last-page, invalid parameters, ascending/descending order, and empty results. **Do not claim these examples were executed in the Petstore collection.**

### A3. API vs UI Consistency — Comparing Network Data with Displayed Data

An API may return raw values that the frontend formats into labels, dates or currency amounts. **Consistency** means the UI represents those API values accurately according to the application's requirements.

**Practical DevTools workflow:**
1. Open a web application with an actual frontend that consumes an API.
2. Open **Chrome DevTools → Network → Fetch/XHR**.
3. Perform an action (open a user profile, change a filter, place an order).
4. Inspect the request URL, method, status and JSON response.
5. Compare the displayed UI with the returned record IDs, names, quantities, prices and status.
6. Consider intended transformations such as currency formatting, timezone conversion and translated labels.
7. Investigate mismatches caused by stale state, caching, wrong mappings or missed refreshes.
8. Save sanitized request/response evidence and a UI screenshot.

**Illustrative comparison:**

| Field | Example API value | Example UI result | Interpretation |
| --- | --- | --- | --- |
| Name | `"QA Tester"` | QA Tester | Consistent |
| Account status | `true` | Active | Consistent if specified by UI requirements |
| Quantity | `3` | 2 | Potential mismatch |
| Price | `1200` | ৳1,200 | May be correct formatting; check currency/unit rules |

This table is an *example*, not an observed defect. The Swagger Petstore API console is mainly for invoking endpoints; it does **not** provide a complete consumer application UI for validating these user-facing fields. The Day 6 OrangeHRM browser/DevTools work is a useful basis for doing this properly against an application frontend.

**What I learned:** To verify API vs UI consistency, compare both layers for the same action and the same underlying record. A `200` response alone cannot guarantee that the UI is correct.

---

## Part B — Additional Day 7 Practical Work and Execution Evidence

### Practical 1. Objective

My goal was to move beyond sending individual requests and learn to run a repeatable API test suite with evidence. The Day 7 assignment required at least **25 Postman requests** across positive, negative and authentication scenarios, plus **three cURL executions** and submission of the collection, commands and findings.

I practiced:
- Designing status-code, response-body, type and value assertions;
- Organizing tests into positive, negative and authentication groups;
- Executing dependent create/read/update/delete (CRUD) workflows in the correct order;
- Investigating API-contract mismatches rather than assuming a 200 response means success;
- Running a collection through the command line and interpreting assertion failures;
- Keeping human-readable reports separate from structured machine-readable evidence.

### Practical 2. System Under Test and Collection

- **Sample API:** Swagger Petstore v2
- **Base URL:** `https://petstore.swagger.io/v2`
- **Client:** Postman Desktop, Local View
- **Original collection format:** Postman Local View v3 YAML files
- **Converted collection:** `postman-collection/Robendevs-Day07-Swagger-Petstore.postman_collection.json` (Postman v2.1)
- **Command-line execution:** Newman; Node.js used as its JavaScript runtime
- **Collection size:** 25 named requests: 15 positive, 7 negative, 3 authentication-related
- **Folders:** `01 - Positive Tests`, `02 - Negative Tests`, `03 - Authentication Tests`

The original collection is represented by YAML files under `postman/collections/RoBenDevs - Day 07 - Swagger Petstore API Testing/`. The JSON file is a converted artifact for Newman. These two formats must be kept consistent when tests change.

### Why conversion was necessary for Newman

Newman accepts the standard Postman v2.1 collection JSON. Local View stored this particular collection as an arrangement of YAML files, including `.resources/definition.yaml` and separate `*.request.yaml` definitions. The conversion process needed to preserve:

1. Folder and request identity/order;
2. HTTP method and complete URL;
3. Parameters, headers, authentication and JSON body;
4. Before-request and after-response test scripts;
5. Assertion expectations without silently weakening them.

A syntactically valid JSON collection is **not sufficient**: the converted URLs, request order, body contents and scripts must also be checked against the YAML source.

### Practical 3. Test Design and Request Inventory

| Group | Test IDs | Coverage |
| --- | --- | --- |
| Positive | POS-01–POS-15 | Pet listing/CRUD, inventory, order CRUD, user CRUD |
| Negative | NEG-01–NEG-07 | Deleted resources, malformed/nonexistent identifiers, required fields, invalid status |
| Authentication | AUTH-01–AUTH-03 | Missing API key, invalid API key, invalid user credentials |

### Data dependencies

**Pet workflow:** create pet → get pet → update pet → verify updated pet → delete pet → verify pet is missing.

**Order workflow:** create order → get order → delete order → verify order is missing.

**User workflow:** create user → update user → verify updated fields → delete user → verify user is missing.

In the original collection, POS-13 was positioned before POS-14. If POS-13 asserts the *updated* user details, execute POS-14 first or revise the test's documented purpose. Never change ordering solely to hide an unexplained failure.

### Repeated-run considerations

- The public Petstore demo may retain or change records between executions.
- Fixed test IDs can collide with earlier runs or other testers.
- Create operations must succeed before dependent GET, update and delete assertions are meaningful.
- An unavailable resource can produce cascading failures. Record the root cause and downstream impact separately.
- Avoid running performance/load tests against the shared public demo without permission.

### Practical 4. Execution Summary

### Postman Collection Runner (observed earlier)

| Metric | Result |
| --- | ---: |
| Requests in collection | 25 |
| Assertions evaluated | 52 |
| Passed assertions | 46 |
| Failed assertions | 6 |
| Skipped assertions | 0 |
| Execution errors | 0 |
| Duration | 9.535 seconds |
| Average response time | 341 ms |

These are **Postman Runner** results from the prior run. They are not an export of the Newman execution.

### Newman execution reported by Codex

Codex reported a separate single-iteration Newman run with **46 passing and 6 failing assertions**. It also reported that **POS-15 could not run because its saved URL was empty**. This is a significant execution limitation, even if the assertion totals happen to match the earlier Postman Runner run.

**Interpretation:** 46/52 is an **assertion pass rate** of approximately 88.46%. It does **not** establish that 24 or 25 requests passed, or that all 25 ran successfully. Consult `reports/day07-newman-results.json` and `reports/execution-summary.json` for request-level outcomes.

### Practical 5. Findings and Investigations

The following six discrepancies were observed during individual Day 7 practice and are candidates for follow-up. Confirm each against the run's structured evidence before making it a formal bug.

| ID | Test | Observed behavior | Investigation |
| --- | --- | --- | --- |
| NEG-04 | Malformed pet ID | HTTP 404; expected 400 in the test | Compare actual routing/validation against Swagger documentation |
| NEG-06 | Create pet with required name omitted | HTTP 200 | Check validation requirements, actual payload and persisted response |
| NEG-07 | Unsupported pet status filter | HTTP 200 | Check allowable status values and documented behavior |
| AUTH-01 | Inventory without API key | HTTP 200 | Check whether the demo actually enforces the documented security requirement |
| AUTH-02 | Inventory with invalid API key | HTTP 200 | Compare missing/invalid/valid key outcomes; do not infer exploitable access |
| AUTH-03 | Login with invalid credentials | HTTP 200 | Inspect response body and login semantics before claiming login succeeded |

**Classification:** These are *potential API contract discrepancies*, not automatically six confirmed defects. A test failure can arise from a faulty assertion, unsuitable test data, incomplete documentation, unstable public demo data or an actual API defect.

### Execution blocker: POS-15

Codex found that the converted/saved **POS-15 — Delete Test User** request had an empty URL, so it could not be executed in the Newman run.

**Next verification steps:**
1. Inspect the POS-15 URL in the original YAML request.
2. Compare it against the converted v2.1 JSON request.
3. In Postman, verify the intended `DELETE /user/{username}` operation and saved URL.
4. Correct the authoritative source, regenerate the JSON, then rerun the dependent user workflow.
5. Record both the original failure and the corrected retest rather than replacing evidence.

A missing request URL is a **test-suite configuration defect**, not proof of a Petstore API bug.

### Practical 6. Reading the Reports

The Day 7 local workspace contains a `reports/` directory. From the VS Code screenshot, the generated artifacts include:

| Artifact | Purpose |
| --- | --- |
| `day07-newman-report.html` | Human-readable Newman execution report |
| `day07-newman-results.json` | Structured assertion and request-level execution details |
| `day07-newman-console.txt` | Terminal run log |
| `day07-api-testing-report.pdf` | Submission-friendly summary report |
| `execution-summary.json` | Summarized run metrics |
| `verification.json` | Verification output from the report workflow |
| `conversion-audit.json` | Checks related to YAML → JSON conversion |
| `day07-assessment.html` | Additional assessment view |
| `petstore-swagger-contract.json` | Reference API contract snapshot |

Files observed locally are **not automatically available on GitHub**. They must be reviewed for sensitive content, added, committed and pushed from the local repository. A report is only evidence for the run it actually records.

### Practical 7. Reproduce the Newman Execution on Windows

Codex installed a portable Node.js and Newman in:

`C:\Users\MORSHED\AppData\Local\CodexDay07Tools`

The current terminal can activate them with:

```powershell
$toolsPath = "$env:LOCALAPPDATA\CodexDay07Tools"
$env:Path = "$toolsPath\node-v22.23.5-win-x64;$toolsPath\node_modules\.bin;$env:Path"
node --version
npm.cmd --version
newman.cmd --version
```

From the `day-07-api-testing` directory:

```powershell
New-Item -ItemType Directory -Force ".\reports" | Out-Null

newman.cmd run ".\postman-collection\Robendevs-Day07-Swagger-Petstore.postman_collection.json" `
  -r cli,json,html `
  --reporter-json-export ".\reports\day07-newman-results.json" `
  --reporter-html-export ".\reports\day07-newman-report.html" `
  2>&1 | Tee-Object ".\reports\day07-newman-console.txt"
```

**Do not rerun just to claim the original results:** a new execution can differ from the previous run. To make a PDF manually, open the HTML report and use the browser's **Print → Save as PDF**.

### Practical 8. Defect Reporting Template

When a discrepancy is reproducible, prepare a Jira report with:

- **Title:** Endpoint and observable mismatch, not an assumed root cause.
- **Environment:** Swagger Petstore v2 public demo, timestamp and relevant base URL.
- **Preconditions:** Created test data and authentication setup.
- **Steps to reproduce:** Exact HTTP method, endpoint, relevant headers and sanitized body.
- **Expected:** Cited documented contract or approved acceptance criteria.
- **Actual:** HTTP code, response snippet, assertion and evidence filename.
- **Impact:** Potential functional, validation or security risk; severity and priority assessed separately.
- **Attachments:** Sanitized request/response, Postman script and execution screenshot.
- **Retest result:** Fixed/persisting, with new evidence after a change.

Never include real cookies, bearer tokens, user credentials or API keys in public attachments.

### Practical 9. Learning Outcomes

This work reinforced the distinction between:

- **An HTTP response and a passing test:** 200 does not automatically mean correct behavior.
- **A request and an assertion:** 25 requests can contain 52 separate validations.
- **An assertion failure and an API bug:** a failed check needs investigation.
- **A collection conversion and an API execution:** a valid JSON file can still contain a broken URL.
- **A past run and a retest:** reports represent different executions and must be labeled accurately.
- **Postman and Newman:** Postman helps author/debug requests, while Newman runs v2.1 JSON collections from the CLI.

### Practical 10. Completion Checklist

- [x] Save 25 test request definitions in three categories.
- [x] Practice positive, negative and authentication scenarios.
- [x] Execute at least three cURL requests during basic practice.
- [x] Convert the local collection to a Newman-compatible v2.1 JSON artifact.
- [x] Generate HTML, JSON, console and PDF reports (reported local artifacts).
- [x] Document 46 passed and 6 failed assertions and the POS-15 execution limitation.
- [ ] Verify POS-15's source URL, correct it and retest the dependent user workflow.
- [ ] Check the six observations against documentation and reproduce before Jira defect creation.
- [ ] Inspect generated reports and collection for secrets before committing publicly.
- [ ] Push the local generated artifacts and verify their GitHub links.

## References

- RoBenDevs QA Engineer Internship — 14-Day Foundation Programme, Day 7.
- [Swagger Petstore API documentation](https://petstore.swagger.io/)
- [Postman Learning Center](https://learning.postman.com/)
- [Newman — Postman collection runner](https://github.com/postmanlabs/newman)
