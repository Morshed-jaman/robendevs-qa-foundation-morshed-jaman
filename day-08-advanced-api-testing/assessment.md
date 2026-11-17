# Day 08 — Assessment: Advanced API Testing

**Programme:** RoBenDevs QA Engineer Internship — 14-Day Foundation Programme  
**Day:** 08 — Advanced API Testing  
**Date:** 17 November 2026  
**Reference:** Official Foundation Programme, page 13  
**Test environments:** Swagger Petstore v2 (public demo); local authorization lab (127.0.0.1:3001); local race-condition lab (127.0.0.1:3000)

## 0. Verified Newman results — 17 November 2026

These are **four separate folder-scoped Newman executions**, evidenced by screenshots of the terminal outputs. The corresponding generated report files are still local until committed/pushed.

| Test area | Requests | Assertions | Failed | Evidence |
| --- | ---: | ---: | ---: | --- |
| Authorization (local mock) | 3 | 3 | 0 | AUTHZ-01 200; AUTHZ-02 403; AUTHZ-03 401 |
| JSON Schema (Petstore) | 1 | 3 | 0 | HTTP 200, JSON Schema PASS, status-filter PASS |
| Idempotency (Petstore) | 5 | 9 | 0 | POST, identical PUT twice, GET final `sold`, DELETE |
| CSV data-driven (Petstore) | 3 | 9 | 0 | Three CSV rows, 3.5 s, 0 failures |
| **Total across these independent runs** | **12** | **24** | **0** | **Not a single end-to-end combined run** |

The final state of the local concurrency lab was also observed as `stock=0`, `orders=1` after the fix; this is separate from the 24 Newman assertions above.

## 1. Assignment requirement

> Extend the Day 7 collection with environments, chained requests, assertions, schema checks and a data-driven test. Run it with Newman and include one idempotency and one authorisation test.

**Submission:** Updated collection in `api-tests`, Newman report and findings; CP-3 slides under `presentations`.

This assessment separates **verified executions** from **examples created but still awaiting a test run**. It does not treat a saved request as a passed test.

## 2. Work completed and verified

| Requirement / activity | Actual evidence | Status |
| --- | --- | --- |
| Existing Day 7 API testing baseline | Existing 25-request JSON collection is retained in `day-07-api-testing/postman-collection` | Retained |
| Postman environments | `api-tests/day08-demo.postman_environment.json` used by Newman against Petstore and the local authorization lab | **Verified** in separate runs |
| Chained create/read/delete | Existing Local View Postman folder `05 - Request Chaining` and added Day 8 runnable collection | Configured; full clean execution not verified |
| Assertions | HTTP status, response JSON shape, IDs and business values tested during exercises | Practiced |
| JSON Schema | Newman execution screenshot: 1 request, 3/3 assertions passed; JSON and JUnit files generated | **Verified** |
| CSV-driven API test | Saved Postman CLI log from local YAML collection, `status = available/pending/sold` | **3 iterations, 3 requests, 9/9 assertions PASS** |
| Newman in CI | Separate `ci-smoke.postman_collection.json` and GitHub Actions workflow; job screenshot showed success in 19 seconds | **Smoke CI run succeeded**; detailed assertion log not checked |
| Full extended assessment with Newman | Four selected folders executed independently: **12 requests and 24/24 assertions passed** | **Verified folder-scoped runs**; no one-shot entire collection run |
| Idempotency | Newman screenshot: create, first PUT, identical second PUT, final GET and cleanup DELETE | **5 requests, 9/9 assertions PASS** |
| Authorization / BOLA | Newman screenshot: own profile 200, other user blocked 403, no token 401 | **3 requests, 3/3 assertions PASS** |
| Concurrency / race condition (additional advanced practical) | Local Node lab and screenshots | **Bug reproduced** (stock -1, orders 2); corrected state observed (stock 0, orders 1) |
| CP-3 Days 7–8 slides | Not verified as submitted in repository | Pending |

**Important corrections found during the GitHub audit:** The previously committed Local View file `SCHEMA-01` has an empty URL; the Local View `IDEM-01` file shows method GET despite the PUT screenshot; and some locally saved delete requests show GET. The Staging YAML environment contains no values. These are **save/export discrepancies**, not proof that the earlier on-screen tests did not work. The new standalone assessment collection contains explicitly defined methods, URLs, assertions, and demo variables. Do not overwrite the historical Day 7 baseline until the new requests have been verified.

## 3. Submitted assessment assets

- [`api-tests/day08-assessment.postman_collection.json`](api-tests/day08-assessment.postman_collection.json) — runnable Day 8 extension, with folders for chaining, schema, CSV, idempotency and local authorization.
- [`api-tests/day08-demo.postman_environment.json`](api-tests/day08-demo.postman_environment.json) — non-secret environment variables.
- [`api-tests/data/pet-status.csv`](api-tests/data/pet-status.csv) — the three data rows.
- [`api-tests/authorization-lab.js`](api-tests/authorization-lab.js) — local object-level authorization example.
- [`api-tests/race-condition-lab.js`](api-tests/race-condition-lab.js) — local unsafe/safe concurrency demonstration.
- [`api-tests/ci-smoke.postman_collection.json`](api-tests/ci-smoke.postman_collection.json) — read-only CI smoke collection.
- [`reports/day08-data-driven-results.txt`](reports/day08-data-driven-results.txt) — actual CSV execution log.
- [`day-08-practical-work.md`](day-08-practical-work.md) — earlier practical record.
- [GitHub Actions workflow](https://github.com/Morshed-jaman/robendevs-qa-foundation-morshed-jaman/blob/main/.github/workflows/day08-newman.yml) — Newman workflow and CI artifact setup.

**Scope note:** The standalone assessment collection supplements the preserved Day 7 baseline instead of embedding its original 25 items in the same exported JSON. If the trainer requires a *single combined* collection, merge Day 7's original folders with these new Day 8 folders in Postman and export again.

## 4. Data-driven execution: actual results

The local Postman CLI run used the three-row CSV:

```csv
status,expectedCode
available,200
pending,200
sold,200
```

| Input | Observed HTTP | Assertions |
| --- | --- | --- |
| available | 200 OK | 3 PASS |
| pending | 200 OK | 3 PASS |
| sold | 200 OK | 3 PASS |
| **Total** | **3 requests** | **9 PASS, 0 FAIL** |

From the committed CLI log: **3 iterations, 2.7 seconds total duration, 810 ms average response time.**

The array-status assertion does not establish nonempty results: a `forEach` over `[]` performs no checks.

## 5. Chaining and schema test design

**Chaining:** `CHAIN-01` creates a disposable pet and saves `day08PetId`; `CHAIN-02` fetches the same pet by ID; `CHAIN-03` deletes it. The assessment collection generates a fresh temporary numeric ID in the create request's pre-request script. Confirm that the response returns the same ID and that no test data remains after cleanup.

**Schema:** `SCHEMA-01` requests `GET /pet/findByStatus?status=available` and asserts HTTP 200, a JSON array of pet objects with valid specified field types, and matching `available` statuses. The practice schema validates types of properties when present; it does not require every property or a nonempty list.

**Environment:** `baseUrl=https://petstore.swagger.io/v2` and `authBaseUrl=http://127.0.0.1:3001`. No API keys or personal credentials are included. The local authorization API must never be treated as an externally accessible host.

## 6. Idempotency test design and observation

**Purpose:** Repeat the same `PUT /pet` with the same ID and payload and ensure the final state remains one pet with status `sold`.

**Expected:** First PUT 200, second identical PUT 200, GET returns the matching ID and `sold` status. HTTP responses do not need to be byte-identical for the operation to be idempotent.

**Observed now:** The later Newman run executed setup POST, two identical PUT requests, final GET, and cleanup DELETE successfully: **5 requests, 9/9 assertions PASS**. Earlier manual evidence also showed one PUT with 3/3 PASS.

**Execution note:** Create a disposable pet with `CHAIN-01`, execute `IDEM-01` **twice without changing its body**, execute `IDEM-02` once, then clean up with `CHAIN-03`. Because Postman/Newman folder runs do not themselves repeat a single request twice, **do not claim a one-pass folder run proves idempotency**.

## 7. Authorization test design: local object-level access control

Authorization is different from simply checking whether an API accepts an invalid API key. This assessment needs a user-specific resource and a request that changes a user ID.

The new local mock server uses explicit demo identities:
- User A: token `demo-token-a`, allowed to read `/users/user-a`
- User B: token `demo-token-b`, allowed to read `/users/user-b`

The intended checks:

| Test | Caller | Requested resource | Expected |
| --- | --- | --- | --- |
| AUTHZ-01 | User A | User A profile | 200 |
| **AUTHZ-02** | **User A** | **User B profile** | **403 Forbidden** |
| AUTHZ-03 | No token | User A profile | 401 Unauthorized |

**Current status:** Executed against the local-only lab with Newman; **3/3 assertions PASS** (HTTP 200, 403, 401). These demo tokens are hardcoded learning fixtures, not real authentication credentials. The lab exercises object-level authorization rules locally; it is not a security finding against Swagger Petstore.

## 8. Newman execution instructions

The assessment collection is standard Postman v2.1 JSON. It can be executed using Newman from the repository root. Set up PATH in a new PowerShell session if necessary:

```powershell
$tools = "$env:LOCALAPPDATA\CodexDay07Tools"
$env:Path = "$tools\node-v22.23.5-win-x64;$tools\node_modules\.bin;$env:Path"
newman.cmd --version
```

**First, run safe read-only schema validation** and save a JSON/JUnit report:

```powershell
$collection = ".\day-08-advanced-api-testing\api-tests\day08-assessment.postman_collection.json"
$environment = ".\day-08-advanced-api-testing\api-tests\day08-demo.postman_environment.json"
New-Item -ItemType Directory -Force ".\day-08-advanced-api-testing\reports\assessment" | Out-Null

newman.cmd run "$collection" -e "$environment" --folder "06 - JSON Schema Validation" -r cli,json,junit --reporter-json-export ".\day-08-advanced-api-testing\reports\assessment\schema-results.json" --reporter-junit-export ".\day-08-advanced-api-testing\reports\assessment\schema-results.xml"
```

**Then run data-driven tests** with the CSV:

```powershell
$csv = ".\day-08-advanced-api-testing\api-tests\data\pet-status.csv"
newman.cmd run "$collection" -e "$environment" --folder "04 - Data Driven Tests" -d "$csv" -r cli,json --reporter-json-export ".\day-08-advanced-api-testing\reports\assessment\ddt-results.json"
```

**Authorization test:** Start the local mock server in another PowerShell terminal:

```powershell
node ".\day-08-advanced-api-testing\api-tests\authorization-lab.js"
```

Then run:

```powershell
newman.cmd run "$collection" -e "$environment" --folder "09 - Authorization Testing (Local Lab)" -r cli,json --reporter-json-export ".\day-08-advanced-api-testing\reports\assessment\authorization-results.json"
```

**Chaining and idempotency:** Run their requests in the documented order and retain result logs. Do **not** blindly run the whole mixed collection three times with CSV input: it combines public data mutations with local-only authorization tests and can generate unwanted duplicate test data.

**Required after executing:** Check the actual assertion totals, examine failures, and commit the resulting sanitized reports. Merely generating this Markdown does not prove that Newman has run the entire Day 8 assessment.

## 9. Additional advanced finding: deliberate race condition

**Observed before fix:** Two concurrent `POST /buy-unsafe` requests could both succeed even though initial stock was 1. Postman showed **2 failed protective assertions**, and the browser displayed `stock=-1`, `orders=2`.

**Observed after fix:** After using `POST /buy-safe` and resetting inventory, the browser displayed `stock=0`, `orders=1`. The browser verified the expected final inventory state. The individual post-fix Postman assertion totals were not separately evidenced in the final screenshot.

**Cause:** The unsafe endpoint checks availability before a delayed stock update, so two requests can both read the same starting stock. The fixed local example updates stock synchronously before delaying the response.

**Limit:** This illustrates a race and its fix inside a single-process Node.js lab; production systems may require database locks, transactions or atomic updates.

## 10. Key findings and limitations

1. **Positive verified result:** CSV-driven filtering completed **9/9 assertions PASS**.
2. **Positive verified result:** GitHub Actions ran the standalone Newman smoke-test workflow successfully; the job reported completion in **19 seconds**.
3. **Demonstrated defect:** The intentionally vulnerable local inventory endpoint oversold one item, demonstrating why concurrency assertions matter.
4. **Corrected behavior observed:** Local safe purchase endpoint preserved inventory (`stock=0`, `orders=1`).
5. **Resolved:** Schema, authorization, idempotency and data-driven folders have each been executed with Newman: **24/24 assertions PASS** across four separate runs. Evidence reports need to be committed from the local workstation.
6. **Current gap:** The updated collection is separate from the original Day 7 JSON export; merge into one collection if required by the trainer.
7. **Current gap:** CP-3 slides for Days 7–8 and a final assessment report are still to be confirmed.

## 11. Final submission checklist

- [x] Document the assignment and practical outcomes in `assessment.md`.
- [x] Add a Day 8 assessment collection with chaining, schema, CSV, idempotency and local authorization requests.
- [x] Add a working, non-secret environment export.
- [x] Preserve verified CLI CSV log (9/9).
- [x] Include local concurrency lab and verified before/after inventory observations.
- [x] Set up GitHub Actions for a read-only Newman smoke test.
- [x] Run schema folder with Newman: **3/3 PASS** (JSON and JUnit reports generated locally).
- [x] Run authorization folder with Newman against local mock API: **3/3 PASS** (JSON report generated locally).
- [x] Verify two identical PUTs, final GET and cleanup DELETE with Newman: **9/9 PASS**.
- [ ] Commit locally generated Newman JSON/XML reports from all four assessment runs after checking them for sensitive data.
- [ ] Export a combined Day 7 + Day 8 collection if requested by trainer.
- [ ] Prepare CP-3 slides for Days 7–8 and place them under `presentations`.

## References

- RoBenDevs QA Engineer Internship — 14-Day Foundation Programme, Day 8, page 13.
- [Postman API test scripting](https://learning.postman.com/docs/tests-and-scripts/write-scripts/test-scripts/)
- [Newman CLI](https://github.com/postmanlabs/newman)
- [GitHub Actions](https://docs.github.com/en/actions)
