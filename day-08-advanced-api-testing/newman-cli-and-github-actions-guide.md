# Day 08 — How Newman Works: CLI Commands, Reports and GitHub Actions

**Programme:** RoBenDevs QA Engineer Internship — 14-Day Foundation Programme  
**Day:** 08 — Advanced API Testing  
**Topic:** Newman collection runner, data-driven execution, reporting and CI  
**Practice date:** 17 November 2026  
**Related files:** [Day 08 assessment](assessment.md) · [Intermediate notes](02-qa-intermediate.md) · [Postman collection](api-tests/day08-assessment.postman_collection.json)

## 1. What I understood about Newman

**Newman is a command-line collection runner for Postman.** It reads an exported Postman collection, sends its HTTP requests to the target API, executes saved pre-request and post-response scripts, checks assertions, and prints or exports the results.

I use these tools for different purposes:

| Tool | My understanding | Example from Day 08 |
| --- | --- | --- |
| **Postman** | I create requests, test scripts and collections | Write `pm.test(...)` assertions |
| **Newman** | I run the exported collection without opening Postman | `newman.cmd run ...` |
| **GitHub Actions** | I set up when and where the command executes automatically | Run a read-only Newman smoke test after specified file changes |

**Important:** Newman does not write good test cases by itself. It executes the requests and assertions I have already defined. HTTP `403` is not necessarily a failed test: if I expect access to be denied and assert `403`, that assertion should **pass**.

### Basic execution flow

```text
Postman collection (requests and assertions)
                   |
                   v
               Newman CLI
                   |
      Resolve environment and data
                   |
       Run pre-request script, if any
                   |
                   v
            Send HTTP request
                   |
                   v
         Receive server response
                   |
       Run post-response assertions
                   |
                   v
       Print results / export reports
                   |
       Exit with success/failure code
```

## 2. My Day 08 collection and environment files

In my repository, the assessment collection and environment are saved as:

```text
day-08-advanced-api-testing/
  api-tests/
    day08-assessment.postman_collection.json
    day08-demo.postman_environment.json
    data/
      pet-status.csv
  reports/
    assessment/
      authorization-results.json
      schema-results.json
      schema-results.xml
      idempotency-results.json
      ddt-results.json
      ddt-results.xml
```

The **collection** stores API methods, URLs, optional request bodies, scripts and named folders. The **environment** stores reusable variable values, for example:

```text
baseUrl     = https://petstore.swagger.io/v2
authBaseUrl = http://127.0.0.1:3001
```

So this request:

```http
GET {{baseUrl}}/pet/findByStatus?status=available
```

becomes:

```http
GET https://petstore.swagger.io/v2/pet/findByStatus?status=available
```

**Distinction:** `$collection` and `$environment` in PowerShell are file-path variables. `{{baseUrl}}` and `{{day08PetId}}` are Postman variables resolved during the collection run.

## 3. Explaining my complete Newman command

This is the command I used for the **JSON Schema Validation** folder, written across multiple PowerShell lines:

```powershell
$collection = ".\day-08-advanced-api-testing\api-tests\day08-assessment.postman_collection.json"
$environment = ".\day-08-advanced-api-testing\api-tests\day08-demo.postman_environment.json"

newman.cmd run "$collection" `
  -e "$environment" `
  --folder "06 - JSON Schema Validation" `
  -r cli,json,junit `
  --reporter-json-export ".\day-08-advanced-api-testing\reports\assessment\schema-results.json" `
  --reporter-junit-export ".\day-08-advanced-api-testing\reports\assessment\schema-results.xml"
```

| Part | Meaning | Why I used it |
| --- | --- | --- |
| `newman.cmd` | Starts the installed Newman executable on Windows | Run without opening Postman |
| `run` | Command to execute a Postman collection | Start API testing |
| `"$collection"` | File path to the collection JSON | Identify which requests and scripts to execute |
| `-e "$environment"` | Load an environment JSON file | Resolve the API base URLs |
| `--folder "06 - JSON Schema Validation"` | Select one collection folder | Avoid running unrelated folders |
| `-r cli,json,junit` | Enable CLI, JSON and JUnit reporters | Show a summary and generate machine-readable results |
| `--reporter-json-export ...` | Location for the detailed JSON report | Save structured test evidence |
| `--reporter-junit-export ...` | Location for JUnit XML | Save CI-compatible test evidence |

The **backtick** (`\` `) at the end of each PowerShell command line means the command continues on the next line. It must be the last character on that line, with no trailing spaces.

### How I check the installation

```powershell
newman.cmd --version
newman.cmd run -h
```

On my Windows setup, portable Node.js and Newman are installed outside the repository. In a new terminal session, I can make them available on `PATH`:

```powershell
$toolsPath = "$env:LOCALAPPDATA\CodexDay07Tools"
$env:Path = "$toolsPath\node-v22.23.5-win-x64;$toolsPath\node_modules\.bin;$env:Path"

node --version
newman.cmd --version
```

## 4. What happens with each API request?

A saved Postman test can look like this:

```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Response is a JSON array", function () {
    pm.expect(pm.response.json()).to.be.an("array");
});
```

Newman:

1. Loads the selected request and resolves variables such as `{{baseUrl}}`.
2. Runs the pre-request script if one exists (for example, generating a pet ID).
3. Sends the API request.
4. Receives the HTTP response.
5. Evaluates the saved assertions.
6. Shows the result and continues according to the collection flow.

**An HTTP response of 200 is not the same as every assertion passing.** The HTTP status might be 200, while the returned JSON has the wrong structure or data.

## 5. My Idempotency Testing example

For the Day 08 idempotency practical, the assessment collection ran five requests **in sequence**:

| Request | Action | What was checked |
| --- | --- | --- |
| `IDEM-00` | Create a disposable pet | The new pet and ID are valid |
| `IDEM-01A` | First `PUT /pet` | Pet is updated to `sold` |
| `IDEM-01B` | Second identical `PUT /pet` | Same ID and `sold` status |
| `IDEM-02` | `GET /pet/{{day08PetId}}` | Final stored state is correct |
| `IDEM-03` | `DELETE /pet/{{day08PetId}}` | Disposable record is cleaned up |

I used:

```powershell
newman.cmd run "$collection" `
  -e "$environment" `
  --folder "07 - Idempotency Testing" `
  -r cli,json `
  --reporter-json-export ".\day-08-advanced-api-testing\reports\assessment\idempotency-results.json"
```

**Verified terminal result:** 5 requests, **9/9 assertions passed**, 0 failures.

The important idempotency check is the **final resource state**, not merely receiving 200 twice. For payment/order APIs, testing must also consider duplicate records and actual side effects.

## 6. Data-driven API testing with Newman

My CSV file is [`api-tests/data/pet-status.csv`](api-tests/data/pet-status.csv):

```csv
status,expectedCode
available,200
pending,200
sold,200
```

The collection contains:

```http
GET {{baseUrl}}/pet/findByStatus?status={{status}}
```

The script uses the current CSV row:

```javascript
const status = pm.iterationData.get("status");
const expectedCode = Number(pm.iterationData.get("expectedCode"));

pm.test("Expected HTTP status", function () {
    pm.response.to.have.status(expectedCode);
});
```

My Newman command included the **`-d` flag**:

```powershell
$csv = ".\day-08-advanced-api-testing\api-tests\data\pet-status.csv"

newman.cmd run "$collection" `
  -e "$environment" `
  --folder "04 - Data Driven Tests" `
  -d "$csv" `
  -r cli,json,junit `
  --reporter-json-export ".\day-08-advanced-api-testing\reports\assessment\ddt-results.json" `
  --reporter-junit-export ".\day-08-advanced-api-testing\reports\assessment\ddt-results.xml"
```

`-d` (or `--iteration-data`) provides CSV/JSON **iteration data**. For each CSV row, Newman re-executes the selected collection/folder with that row's values.

| Iteration | Input | Expected HTTP code |
| --- | --- | --- |
| 1 | available | 200 |
| 2 | pending | 200 |
| 3 | sold | 200 |

The complete DDT-01 request has **three assertions per iteration**. The observed total was:

```text
3 CSV rows × 3 assertions = 9 assertions
```

**Verified Newman result:** 3 requests across 3 iterations, **9/9 assertions passed**, 0 failures. Duration: **3.5 seconds**.

**Limitation:** A status-check loop over an empty response array can pass without verifying that any pet was returned. A minimum-result check requires an appropriate API requirement.

## 7. Reporter outputs and how they differ

| Reporter | Output | My use |
| --- | --- | --- |
| `cli` | Readable terminal output | See passed/failed tests immediately |
| `json` | Detailed JSON results | Save request and assertion evidence |
| `junit` | XML suitable for CI reporting systems | Integrate into automated reporting |

`-r cli,json,junit` enables the reporters, and the corresponding `--reporter-...-export` options specify the destination files.

Before running a command with exported reports, I make sure the folder exists:

```powershell
New-Item -ItemType Directory -Force ".\day-08-advanced-api-testing\reports\assessment" | Out-Null
```

**Safety:** Newman JSON outputs may contain request headers, payloads, variables or returned data. I review them and remove private credentials/tokens before publishing reports.

## 8. How Newman works with GitHub Actions (CI)

I also created a small **read-only** CI collection and workflow:

- [CI smoke-test collection](api-tests/ci-smoke.postman_collection.json)
- [GitHub Actions workflow](https://github.com/Morshed-jaman/robendevs-qa-foundation-morshed-jaman/blob/main/.github/workflows/day08-newman.yml)

A simplified workflow step is:

```yaml
- name: Install Newman
  run: npm install --global newman

- name: Run Petstore smoke test
  run: newman run day-08-advanced-api-testing/api-tests/ci-smoke.postman_collection.json
```

The practical workflow also checks out the repository, sets up Node.js, exports JSON/JUnit reports, and uploads artifacts.

```text
Push selected collection/workflow file (or manually start workflow)
                       |
                       v
        GitHub Actions starts a runner
                       |
                       v
          Checkout repo and install Newman
                       |
                       v
             Newman executes API checks
                       |
                       v
        Exit code indicates success/failure
                       |
                       v
       GitHub shows green/red job status
```

In general, Newman returns **exit code 0** for a successful run and a **nonzero code** when a run fails. This lets a CI step fail visibly when an assertion or request fails.

**Observed in my repo:** The GitHub Actions `api-smoke-test` job completed successfully in **19 seconds**. Its configured push trigger only covers changes to the smoke-test collection or workflow YAML; it does **not** execute on every push to any file.

### When 403 is a passing test

For my local authorization lab, I deliberately attempted to read another user's profile.

- User A accessing their own profile: expected `200`, observed `200` → **PASS**
- User A accessing User B's profile: expected `403`, observed `403` → **PASS**
- Request without token: expected `401`, observed `401` → **PASS**

So **an API error response is not automatically a Newman test failure**. It depends on the expected behavior written in the assertion.

## 9. My verified Day 08 Newman results

These are **four independent, folder-scoped Newman executions**, not one single run of the whole collection.

| Test area | Requests | Assertions passed | Failed |
| --- | ---: | ---: | ---: |
| Authorization | 3 | 3 | 0 |
| JSON Schema | 1 | 3 | 0 |
| Idempotency | 5 | 9 | 0 |
| CSV data-driven | 3 | 9 | 0 |
| **Total** | **12** | **24** | **0** |

**Evidence:** [`reports/assessment/`](reports/assessment/) and [`assessment.md`](assessment.md). The separate GitHub Actions smoke-test is not added to the 24 assertions above.

## 10. Commands I want to remember

```powershell
# Verify Newman
newman.cmd --version

# Run a collection
newman.cmd run collection.json

# Use an environment
newman.cmd run collection.json -e environment.json

# Run one folder
newman.cmd run collection.json --folder "Folder Name"

# Run with CSV iteration data
newman.cmd run collection.json -d data.csv

# Enable the CLI and JSON reporters
newman.cmd run collection.json -r cli,json

# See full options
newman.cmd run -h
```

**Note:** `-r cli,json` selects reporters; `--reporter-json-export ...` specifies an explicit path for the JSON file.

### Postman CLI vs. Newman

During Day 08, I used **both** tools:

- `postman.cmd collection run ... --iteration-data ... -r cli` for the local Postman YAML request.
- `newman.cmd run ...` for exported **Postman v2.1 JSON** collections, including CI and reports.

These are different commands and should not be confused.

## 11. Interview-ready explanation

> Newman is a command-line collection runner for Postman. I write API requests and assertions in Postman, then use Newman to execute those tests without opening the Postman app. I can pass environments and CSV iteration data, run selected folders, and export JSON or JUnit reports. I also configured GitHub Actions to execute a Newman smoke test automatically when specified repository files change.

**My key takeaway:** **Postman is where I create tests; Newman is how I execute them; GitHub Actions is how I automate the execution.**

## References

- [Postman documentation](https://learning.postman.com/)
- [Newman documentation and CLI options](https://github.com/postmanlabs/newman)
- [GitHub Actions documentation](https://docs.github.com/en/actions)
- [My Day 08 practical assessment](assessment.md)
