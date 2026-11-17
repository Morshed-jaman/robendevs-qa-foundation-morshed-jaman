# Day 08 — Intermediate: Advanced API Testing

**Programme:** RoBenDevs QA Engineer Internship — 14-Day Foundation Programme  
**Day:** 08  
**Level:** Intermediate  
**Date:** 17 November 2026  
**Source:** Foundation Programme, Day 8, page 13  
**Practice API:** Swagger Petstore v2 — `https://petstore.swagger.io/v2`

> **Evidence approach:** I am separating topics I have practiced from those I understand in theory but have not executed yet. The Day 7 baseline collection and its previous results remain separate from the Day 8 extensions.

## 1. Today's Intermediate Topics

The official Day 8 Intermediate syllabus covers:

1. **Request chaining:** Passing a token or ID from one response into another request.
2. **Schema validation:** Validating JSON response structure with a JSON Schema.
3. **Data-driven testing:** Running the same request with different CSV values.
4. **Command-line collection runs:** Running Postman collections with Newman, including CI usage.

I already learned how to write individual Postman assertions and how to use Newman on Day 7. Today I focused on making API tests **reusable** and understanding how they run through GitHub Actions.

## 2. Request Chaining — Passing Values Between Requests

**Concept:** A response from one request may supply a resource ID or token needed by the next request. Chaining removes the need to manually copy those values or hardcode IDs in every URL.

### Example using the Petstore pet workflow

First, a successful `POST /pet` creates a test pet. If its response includes an ID, the *After response* script can save it:

```javascript
const pet = pm.response.json();

pm.test("Created pet has an ID", function () {
    pm.expect(pet.id).to.exist;
});

pm.collectionVariables.set("petId", String(pet.id));
```

The next requests can use the saved value:

```http
GET {{baseUrl}}/pet/{{petId}}
DELETE {{baseUrl}}/pet/{{petId}}
```

**Expected flow:** Create pet → save `petId` → read pet → update → verify update → delete → verify 404.

### What a QA engineer must watch for

- The create request needs to succeed **before** dependent requests use the ID.
- Variable scopes matter: collection, environment and iteration variables may have different values.
- A stale ID from an earlier run can make tests unreliable.
- Test data should be unique or reliably reset between executions.
- Tokens and secrets must never be committed in public collection exports.

**Progress:** Request chaining was studied and discussed, but I have not yet verified a newly chained Day 8 CRUD run. My Day 7 pet workflow was performed using fixed identifiers.

## 3. JSON Schema Validation — Checking Response Structure

**Concept:** A JSON Schema defines the allowed structure of a response. It can check objects, arrays, required fields, values and data types.

A successful `200` response does not guarantee correct JSON. For example, if `id` should be a number but arrives as a string, a schema check should detect that mismatch.

### Example schema for a Petstore pet

The following is a **practice schema** for an example pet object; it is not a claim that I executed it or that every Petstore response must contain exactly these properties.

```javascript
const schema = {
    type: "object",
    required: ["name", "photoUrls"],
    properties: {
        id: { type: "integer" },
        name: { type: "string" },
        photoUrls: {
            type: "array",
            items: { type: "string" }
        },
        status: { type: "string" }
    }
};

pm.test("Pet response matches JSON Schema", function () {
    pm.response.to.have.jsonSchema(schema);
});
```

Use this check on a **single pet object**, such as a successful `GET /pet/{petId}` response, **not** on the entire `GET /pet/findByStatus` array unless an array schema is defined.

### Schema validation vs. business assertions

| Type | What it checks |
| --- | --- |
| Status assertion | HTTP response meets the expected status |
| JSON Schema | Data structure and type match the schema |
| Business assertion | Correct record, price, order quantity or status is returned |

A schema might allow `name` to be any string; a separate business assertion can verify the name matches the pet I created.

**Progress:** Understood in theory; a saved and executed Day 8 schema test is still pending.

## 4. Data-Driven Testing — Completed Practical

**Concept:** One API request and its assertion script are executed repeatedly using different input rows. The CSV contains the data; the request and script define the test logic.

### My saved dataset

File: [`api-tests/data/pet-status.csv`](api-tests/data/pet-status.csv)

```csv
status,expectedCode
available,200
pending,200
sold,200
```

The Day 7 Postman Local View collection was extended with `04 - Data Driven Tests/DDT-01 - Filter Pets by Status`.

The parameterized endpoint is:

```http
GET https://petstore.swagger.io/v2/pet/findByStatus?status={{status}}
```

I used three checks for each row:
1. Expected HTTP status code;
2. Response must be a JSON array;
3. Returned pet statuses must match that row's input.

The script retrieves values with `pm.iterationData.get("status")` and `pm.iterationData.get("expectedCode")`.

### Actual verified CLI results

These values are taken from the committed [Postman CLI log](reports/day08-data-driven-results.txt), **not estimated**.

| Metric | Observed |
| --- | ---: |
| Iterations | **3** |
| Requests sent | **3** |
| Assertions executed | **9** |
| Assertions passed | **9** |
| Assertions failed | **0** |
| Request errors | **0** |
| Total run duration | **2.7 s** |
| Average response time | **810 ms** |

| CSV input | HTTP result | Assertions |
| --- | --- | --- |
| `available` | 200 OK | 3 PASS |
| `pending` | 200 OK | 3 PASS |
| `sold` | 200 OK | 3 PASS |

### Issue and solution

The Postman Desktop Collection Runner displayed a **paid-plan upgrade dialog** when I tried to attach the CSV file. I used **Postman CLI** with the local YAML request and CSV instead:

```powershell
$request = Get-ChildItem ".\day-07-api-testing\postman\collections" -Recurse -Filter "DDT-01*.request.yaml" -File |
    Select-Object -First 1 -ExpandProperty FullName
$csv = ".\day-08-advanced-api-testing\api-tests\data\pet-status.csv"
postman.cmd collection run "$request" --iteration-data "$csv" -r cli
```

I first attempted unsupported reporters and received:

`Reporter "html", "json" is not supported for multi-protocol collections.`

Using `-r cli` resolved the reporter problem. The log confirms the three iterations completed.

**Testing limitation:** Checking each returned pet's status using `forEach` does not require the array to be nonempty. An additional count assertion would need a documented minimum-result requirement.

## 5. Command-Line Runs with Newman and GitHub Actions

I already ran Newman manually on Day 7. For Day 8, I connected a small read-only Newman collection to **GitHub Actions** as an example of CI execution.

**Collection:** [`api-tests/ci-smoke.postman_collection.json`](api-tests/ci-smoke.postman_collection.json)  
**Workflow:** [`.github/workflows/day08-newman.yml`](../.github/workflows/day08-newman.yml) (repository-root link is available in the Day 8 practical notes)

The smoke test sends:

```http
GET https://petstore.swagger.io/v2/pet/findByStatus?status=available
```

It has two assertions:
- HTTP status is `200`;
- The JSON body is an array.

### CI sequence

```text
Push the collection/workflow to GitHub
             |
             v
GitHub Actions workflow starts
             |
             v
Checkout repository -> Set up Node.js -> Install Newman
             |
             v
Newman executes the smoke-test collection
             |
             v
GitHub records job status and uploads report artifacts
```

The workflow uses `actions/checkout@v4`, `actions/setup-node@v4` (Node 22), and `npm install --global newman`. Newman generates **JSON and JUnit XML** reports, which the workflow uploads using `actions/upload-artifact@v4` even if the execution step fails.

**Observed result:** The GitHub Actions screenshot showed `api-smoke-test` **succeeded in 19 seconds**. The individual Newman log and downloaded artifact totals have not yet been independently reviewed in this document, so I am not presenting an unverified CLI assertion summary.

The workflow supports manual execution and triggers on pushes that modify the smoke-test collection or its workflow file. It does **not** run on every push to every file.

### Why GitHub Actions and Newman are different

- **I write the API assertions** in the Postman collection.
- **Newman runs** the saved v2.1 JSON collection and reports failures.
- **GitHub Actions schedules and executes** the Newman command in a temporary runner.
- **GitHub displays** the job status and stores logs/artifacts.

## 6. What I Have Completed vs. What Is Next

| Topic | Status | Evidence or next action |
| --- | --- | --- |
| Request chaining | Theory studied | Implement on a controlled pet CRUD test |
| JSON Schema validation | Theory studied | Save a response schema test and execute it |
| CSV data-driven testing | **Completed** | 3 iterations, 9/9 PASS in CLI log |
| Newman locally | Previously completed | Day 7 Newman report |
| Newman in GitHub Actions | **Workflow succeeded** | GitHub job screenshot; review detailed logs/artifact |
| Idempotency and authorization | Not yet completed | Day 8 Advanced practical |

## 7. Important Learning

Data-driven testing, chaining, schema checks and CI execution solve different problems:

- **Data-driven:** Vary input rows without duplicating test requests.
- **Chaining:** Reuse a resource ID or token returned by an earlier request.
- **Schema:** Validate the shape and types of a response.
- **CI/Newman:** Execute tests automatically when the configured trigger fires.

I should not claim Day 8 is fully complete until I have saved and run the remaining required chaining, schema, idempotency and authorization checks.

## References

- RoBenDevs QA Engineer Internship — 14-Day Foundation Programme, Day 8, page 13
- [Postman Learning Center](https://learning.postman.com/)
- [Newman](https://github.com/postmanlabs/newman)
- [GitHub Actions documentation](https://docs.github.com/en/actions)
