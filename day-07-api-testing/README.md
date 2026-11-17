# Day 7 — API Testing

Date: 16 November 2026 (Asia/Dhaka). Application: Swagger Petstore v2, https://petstore.swagger.io/v2.

25 execution entries; 24 HTTP responses; 1 request errors. Assertions: 52 total, 46 passed, 6 failed.

All 25 saved YAML requests are in the [v2.1 collection](postman-collection/Robendevs-Day07-Swagger-Petstore.postman_collection.json). Existing notes and YAML are preserved. The conversion is custom schema-validated mapping, not a native export. [Audit](reports/conversion-audit.json).

## Reports

- [Assessment and methodology](assessment.md)
- [HTML execution report](reports/day07-newman-report.html)
- [JSON evidence](reports/day07-newman-results.json)
- [CLI output](reports/day07-newman-console.txt)
- [PDF QA report](reports/day07-api-testing-report.pdf)
- [Execution summary](reports/execution-summary.json)
- [Verification](reports/verification.json)

## PowerShell execution

From the repository root, reproduce the conversion, dependency order, one-iteration run, sanitization and reports:

```powershell
$toolDir = Join-Path $env:LOCALAPPDATA "CodexDay07Tools"
$nodeDir = (Get-Content (Join-Path $toolDir "node-directory.txt")).Trim()
$env:Path = "$nodeDir;$env:Path"
node .\day-07-api-testing\scripts\run-day07.cjs
```

Portable Node and tools are installed outside Git in $env:LOCALAPPDATA\CodexDay07Tools. Dependencies: newman, newman-reporter-html, yaml, ajv-draft-04, postman-collection, puppeteer-core, pdf-parse. To set up again with Node installed: npm.cmd install --prefix $toolDir newman newman-reporter-html yaml ajv-draft-04 postman-collection puppeteer-core pdf-parse. Download https://schema.getpostman.com/json/collection/v2.1.0/collection.json to $toolDir\collection-schema.json. The script requires Chrome at its specified executable path.

Standalone Newman (uses folder order; the script above applies the interleaved workflow order):

```powershell
& "$toolDir\node_modules\.bin\newman.cmd" run ".\day-07-api-testing\postman-collection\Robendevs-Day07-Swagger-Petstore.postman_collection.json" --iteration-count 1 --timeout-request 15000 --reporters cli,html,json --reporter-html-export "$env:TEMP\day07-newman-report.html" --reporter-json-export "$env:TEMP\day07-newman-results.json"
```

Standalone output may include session data; inspect/redact before publishing. The automated script redacts returned session/cookie material. Public demo fixtures are retained; no private environments are included.

## Findings and limitations

POS-15 is an empty-URL GET; NEG-03 uses a different username; no updated-user verification is saved. The complete desired user workflow therefore cannot be claimed. Source assertion expectations were preserved. Shared demo responses require contract investigation before classifying bugs/security issues.

Export preserves source folders. Newman runs a derived in-memory list to interleave deletion checks, then independent negatives/authentication. Source UUIDs are absent; names and case identifiers are retained. Historical Postman results (52 assertions, 46 passed, 6 failed) are separately identified in the assessment; no previous run was exported.

References: [Postman collection schemas](https://learning.postman.com/docs/use/use-collections/collections-schemas), [Petstore contract](https://petstore.swagger.io/v2/swagger.json).

## Day 7 baseline vs. Day 8 extensions

The reports above represent the **Day 7 baseline (25 requests)** from 16 November 2026. On 17 November, I extended the same Postman Local View workspace with `04 - Data Driven Tests/DDT-01 - Filter Pets by Status` and a staging environment as part of **Day 8 — Advanced API Testing**. These additions are saved under the original `day-07-api-testing/postman/` workspace because they extend that collection; they do **not** change the historical Day 7 Newman report or its 25-request baseline.

The Day 8 CSV file, learning notes and separate CLI run evidence are documented in [Day 8 — Advanced API Testing](../day-08-advanced-api-testing/). Treat the new DDT request as **Day 8 practical work**, not an additional Day 7 result.
