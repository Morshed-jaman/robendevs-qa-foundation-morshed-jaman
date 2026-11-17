# Day 08 — Practical Work: CSV Data-Driven Testing and Newman CI

**Programme:** RoBenDevs QA Engineer Internship — 14-Day Foundation Programme  
**Date:** 17 November 2026  
**Reference:** Day 8, page 13  
**API:** Swagger Petstore v2 (`https://petstore.swagger.io/v2`)

> This is my practical progress record, not a claim that every Day 8 assignment requirement has been completed. Source results and workflow evidence are distinguished from planned tasks.

## 1. Files and evidence

| File | Purpose |
| --- | --- |
| [`api-tests/data/pet-status.csv`](api-tests/data/pet-status.csv) | Three input rows for data-driven filtering |
| [`reports/day08-data-driven-results.txt`](reports/day08-data-driven-results.txt) | Saved, verified Postman CLI output |
| [`api-tests/ci-smoke.postman_collection.json`](api-tests/ci-smoke.postman_collection.json) | Separate read-only v2.1 collection for Newman CI |
| [`02-qa-intermediate.md`](02-qa-intermediate.md) | Theory and analysis of Intermediate topics |
| [`day-08-extra-learning.md`](day-08-extra-learning.md) | Original trial-and-error notes |
| [GitHub Actions workflow](../.github/workflows/day08-newman.yml) | Workflow YAML located at repository root |

The data-driven Postman request is saved in the existing Day 7 **Local View** collection, under `04 - Data Driven Tests/DDT-01 - Filter Pets by Status`. It is a Day 8 addition to the shared collection, not part of the original 25-request Day 7 baseline.

## 2. Practical A — CSV data-driven API test

**Target:** `GET /pet/findByStatus?status={{status}}`  
**Input:** `pet-status.csv`

```csv
status,expectedCode
available,200
pending,200
sold,200
```

The same Postman request executed three times, reading `status` and `expectedCode` from the CSV row with `pm.iterationData.get(...)`. Each response was checked for status 200, an array response and matching pet statuses.

### Command used from repository root

```powershell
$request = Get-ChildItem ".\day-07-api-testing\postman\collections" -Recurse -Filter "DDT-01*.request.yaml" -File |
  Select-Object -First 1 -ExpandProperty FullName
$csv = ".\day-08-advanced-api-testing\api-tests\data\pet-status.csv"
postman.cmd collection run "$request" --iteration-data "$csv" -r cli
```

Postman Desktop's CSV selection displayed an upgrade dialog. The CLI initially rejected `-r cli,html,json` for the local multi-protocol collection, so I used the supported `-r cli` reporter.

### Verified results from committed CLI log

| Input | HTTP response | Assertions |
| --- | --- | --- |
| available | 200 OK | 3 passed |
| pending | 200 OK | 3 passed |
| sold | 200 OK | 3 passed |
| **Overall** | **3 requests / 3 iterations** | **9 passed, 0 failed** |

Additional logged metrics: total duration **2.7 seconds**; mean response time **810 ms**; **0 request errors**.

The test verifies matching statuses in returned objects but does not fail for an empty array, so it should not be presented as proof of nonempty filtered results.

## 3. Practical B — Newman triggered by GitHub Actions

### Test case

**CI-01 — Find Available Pets** is a standalone read-only collection file:
`api-tests/ci-smoke.postman_collection.json`.

```http
GET https://petstore.swagger.io/v2/pet/findByStatus?status=available
```

The saved collection contains two assertions:
- The response status is 200.
- The JSON response is an array.

### Workflow

Workflow file at repository root: `.github/workflows/day08-newman.yml`.

```text
Push relevant CI test/workflow file or manually dispatch
                      |
                      v
GitHub Actions: checkout repository
                      |
                      v
Set up Node.js 22 and install Newman
                      |
                      v
Newman runs CI-01 read-only Petstore test
                      |
                      v
Upload JUnit/XML and JSON execution artifacts
```

The workflow has a push trigger **only for changes to the CI smoke collection or the workflow file**, plus a manual `workflow_dispatch` trigger. It does not automatically run for every repository change.

### Observed CI result

In the GitHub Actions screenshot, the `api-smoke-test` job displayed **succeeded**, completing in **19 seconds**. Its job setup and repository checkout steps were visibly successful.

I have **not yet recorded the individual Newman assertion counts from the expanded execution step**, so the observed green job status is not presented as a separate screenshot-verified `2/2` assertion report. The configured collection contains two assertions, and GitHub's succeeded job means the workflow finished successfully.

GitHub Actions: [Open repository Actions](https://github.com/Morshed-jaman/robendevs-qa-foundation-morshed-jaman/actions).

### How to inspect the result

1. Open the Day 08 Newman workflow under **Actions**.
2. Select the most recent successful run and job `api-smoke-test`.
3. Expand **Run read-only Petstore smoke test** to read request and assertion results.
4. On the run summary, open **Artifacts** and download `day08-newman-smoke-results` for JSON and JUnit XML evidence.
5. Attach sanitized screenshots or recorded figures to this document if needed.

## 4. My understanding

- **Postman** defines and stores the API request and assertions.
- **CSV** supplies a different dataset for each iteration.
- **Postman CLI** executed the local YAML request with iteration data.
- **Newman** executes a standard Postman v2.1 JSON collection.
- **GitHub Actions** provides the temporary runner, sets up tools and invokes Newman automatically when triggered.
- A failed assertion should be investigated: it may be a product issue, test expectation issue or environment/data problem.

## 5. Still pending from the Day 8 assignment

- [ ] Implement and run a new **request-chaining** example.
- [ ] Implement and run **JSON Schema** validation.
- [x] Complete a **CSV data-driven test** (3 iterations, 9/9 assertions passed).
- [x] Set up **Newman inside GitHub Actions** and observe the job succeed.
- [ ] Verify the detailed CI log and optionally download report artifacts.
- [ ] Perform a controlled **idempotency** test.
- [ ] Perform an **authorization** test using a suitable API and separate user permissions.
- [ ] Prepare the final **Day 8 assignment findings** and **CP-3 slides** for Days 7–8.

## References

- RoBenDevs QA Engineer Internship — 14-Day Foundation Programme, Day 8, page 13
- [Postman Learning Center](https://learning.postman.com/)
- [Newman documentation](https://github.com/postmanlabs/newman)
- [GitHub Actions documentation](https://docs.github.com/en/actions)
