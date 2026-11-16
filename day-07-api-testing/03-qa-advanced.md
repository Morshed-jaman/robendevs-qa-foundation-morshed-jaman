# Day 7 — Advanced: API Test Execution, Reporting and Defect Analysis

**Programme:** RoBenDevs QA Engineer Internship — 14-Day Foundation Programme  
**Topic:** API Testing using Postman, Swagger Petstore v2 and Newman  
**Level:** Advanced / Practical  
**Date:** 16 November 2026  
**API under test:** `https://petstore.swagger.io/v2`  
**Repository location:** `day-07-api-testing/`

> **Evidence integrity:** The figures below are the reported Day 7 execution summary, not a fresh execution performed while writing this document. Inspect the saved Newman JSON/HTML before claiming an individual assertion failed or passed. Swagger Petstore is a shared demonstration service, not a production security target.

## 1. Objective

My goal was to move beyond sending individual requests and learn to run a repeatable API test suite with evidence. The Day 7 assignment required at least **25 Postman requests** across positive, negative and authentication scenarios, plus **three cURL executions** and submission of the collection, commands and findings.

I practiced:
- Designing status-code, response-body, type and value assertions;
- Organizing tests into positive, negative and authentication groups;
- Executing dependent create/read/update/delete (CRUD) workflows in the correct order;
- Investigating API-contract mismatches rather than assuming a 200 response means success;
- Running a collection through the command line and interpreting assertion failures;
- Keeping human-readable reports separate from structured machine-readable evidence.

## 2. System Under Test and Collection

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

## 3. Test Design and Request Inventory

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

## 4. Execution Summary

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

## 5. Findings and Investigations

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

## 6. Reading the Reports

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

## 7. Reproduce the Newman Execution on Windows

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

## 8. Defect Reporting Template

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

## 9. Learning Outcomes

This work reinforced the distinction between:

- **An HTTP response and a passing test:** 200 does not automatically mean correct behavior.
- **A request and an assertion:** 25 requests can contain 52 separate validations.
- **An assertion failure and an API bug:** a failed check needs investigation.
- **A collection conversion and an API execution:** a valid JSON file can still contain a broken URL.
- **A past run and a retest:** reports represent different executions and must be labeled accurately.
- **Postman and Newman:** Postman helps author/debug requests, while Newman runs v2.1 JSON collections from the CLI.

## 10. Completion Checklist

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
