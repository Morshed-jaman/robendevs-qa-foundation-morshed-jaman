# Day 11 — Intermediate: Bitbucket Pipelines and Test Automation in CI

**Programme:** RoBenDevs QA Engineer Internship — 14-Day Foundation Programme  
**Study date:** 20 November 2026  
**Topic:** CI/CD and Automation in the Pipeline  
**Level:** Intermediate  
**Syllabus reference:** Official Foundation Programme, Day 11, page 16  
**Previous lesson:** [01 — Basic: CI/CD and Automation in the Pipeline](01-qa-basic.md)

> **Learning documentation, not pipeline execution evidence.** The examples below demonstrate what a Bitbucket pipeline could do. This GitHub repository is not itself a Bitbucket Cloud repository, and the Day 10 folder presently contains study notes rather than a runnable Playwright automation project. Do not report a passing Bitbucket pipeline, attached artifacts, or a completed assessment until they are genuinely produced and verified.

## 1. Learning objectives

The official Day 11 Intermediate syllabus covers:

1. **Bitbucket Pipelines:** reading and writing `bitbucket-pipelines.yml`, steps, images, and caches.
2. **Running tests in the pipeline:** headless Playwright tests and Newman API runs.
3. **Test reports and artifacts:** publishing reports, screenshots, and traces from runs.
4. **Test suites:** tagging smoke and regression tests and running the appropriate suite at each stage.
5. **Flaky tests:** investigating the cause and fixing it instead of repeatedly rerunning failing checks.

## 2. What is Bitbucket Pipelines?

Bitbucket Pipelines is Bitbucket Cloud's built-in CI/CD service. A configuration file named **`bitbucket-pipelines.yml`**, located at the **root** of a Bitbucket repository, declares which tasks run and when.

### 2.1 Simple YAML example

```yaml
image: node:22

pipelines:
  pull-requests:
    '**':
      - step:
          name: Run tests
          caches:
            - node
          script:
            - npm ci
            - npm test
```

This example assumes a Node.js repository with a valid `package-lock.json` and `npm test` command. It is **not** tailored to our QA foundation repository yet.

### 2.2 YAML keywords

| Keyword | Meaning |
| --- | --- |
| `image` | Docker image providing the runtime/environment |
| `pipelines` | All pipeline definitions |
| `pull-requests` | Run for matching pull requests |
| `'**'` | Match pull requests from any source branch |
| `step` | An executable pipeline job |
| `name` | Display name in pipeline results |
| `caches` | Reuse dependency caches to reduce setup work |
| `script` | Ordered shell commands; a failed required command normally fails the step |
| `artifacts` | Files kept from a step for later steps or pipeline review |

**YAML matters:** Indentation is significant; mixing tabs and spaces or putting a field at the wrong level can invalidate the pipeline.

### 2.3 Docker images

Each step runs inside a container. The image needs the necessary runtime and system dependencies.

Examples:
- `node:22`: useful for Node.js tools such as Newman.
- A Playwright-compatible image or Node image with Playwright browsers and system libraries installed: useful for browser tests.

**Version alignment:** Match the Playwright package and browser dependencies. Do not blindly copy a Docker tag from another project.

### 2.4 Caching vs. artifacts

- **Cache:** speeds up later pipeline runs by reusing dependencies, for example the `node` cache.
- **Artifact:** preserves files produced by a run, such as test-result XML, a browser trace, or screenshot.

A cache is **not** a test report, and an artifact does **not** mean a step passed.

## 3. Running Newman API tests in CI

Our repository already includes this Day 08 study/practice collection:

```text
day-08-advanced-api-testing/api-tests/ci-smoke.postman_collection.json
```

Example, from the repository root in a compatible Node.js environment:

```bash
npm install --no-save newman
mkdir -p reports
npx newman run \
  day-08-advanced-api-testing/api-tests/ci-smoke.postman_collection.json \
  -r cli,junit \
  --reporter-junit-export reports/newman-results.xml
```

**Notes:**
- The collection is an existing repository resource, but its requests may depend on external availability and configuration.
- If a collection needs an environment file, supply it explicitly with `-e`; do not commit real secrets.
- `cli` prints results in logs; `junit` produces an XML test report.
- Confirm command exit codes and failing assertions, not only the presence of an XML file.

Newman reporters and CLI options: https://learning.postman.com/docs/collections/using-newman-cli/newman-options

## 4. Running Playwright browser tests in CI

A standard JavaScript Playwright project uses a lockfile, `@playwright/test`, a config, and actual `*.spec.js` test files.

For a **future runnable Playwright project** under:

```text
day-10-browser-automation/automation/
```

Example commands:

```bash
cd day-10-browser-automation/automation
npm ci
npx playwright install --with-deps chromium
npx playwright test --project=chromium
```

`npm ci` requires an existing lockfile, and the install step requires permission to install browser dependencies. A suitable pinned Playwright container can avoid repeatedly installing browsers.

Playwright runs headlessly by default in normal test mode. `--headed` is not normally needed for CI.

**Current repo status:** Day 10 presently has `01-qa-basic.md`, `02-qa-intermediate.md`, and `03-qa-advanced.md` only. The actual `automation/` project must be created and executed before these commands can work.

Playwright CI guide: https://playwright.dev/docs/ci

## 5. Combined pipeline example (not ready to run yet)

The following is a **learning template**, not the submitted `bitbucket-pipelines.yml`. Its Playwright step requires the future Day 10 `automation/` directory. Review and test all paths, images, credentials, environment variables, and artifacts before using it in a real Bitbucket repository.

```yaml
image: node:22-bookworm

pipelines:
  pull-requests:
    '**':
      - step:
          name: Newman API smoke tests
          caches:
            - node
          script:
            - npm install --no-save newman
            - mkdir -p reports
            - npx newman run day-08-advanced-api-testing/api-tests/ci-smoke.postman_collection.json -r cli,junit --reporter-junit-export reports/newman-results.xml
          artifacts:
            - reports/**

      - step:
          name: Playwright Chromium tests
          caches:
            - node
          script:
            - cd day-10-browser-automation/automation
            - npm ci
            - npx playwright install --with-deps chromium
            - npx playwright test --project=chromium
          artifacts:
            - day-10-browser-automation/automation/playwright-report/**
            - day-10-browser-automation/automation/test-results/**
```

The pipeline uses sequential steps. The pipeline should fail when a required Newman or Playwright test fails; do **not** mask failures using `|| true` or silently bypass them.

**Important:** For a complete official Day 11 assessment, the actual Day 08 collection and Day 10 Playwright tests must be verified for repeatability and compatibility in a Bitbucket repository. The final assignment also requires a merge-blocking quality gate and a link to a genuine passing run.

## 6. Test reports and artifacts

### 6.1 Newman JUnit XML report

Generate a CI-friendly report:

```bash
npx newman run collection.json -r cli,junit --reporter-junit-export reports/newman-results.xml
```

### 6.2 Playwright HTML report, traces, and screenshots

A sample Playwright configuration can include:

```javascript
const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
});
```

**Why QA needs artifacts:**
- Reports summarize passed and failed tests.
- Screenshots reveal visual states.
- Traces show browser actions, snapshots, and network details.
- Videos can help reproduce sequences involving timing or navigation.

**Safety:** Logs and traces may contain sensitive tokens, personal data, or URLs. Use synthetic test data and avoid publishing unrestricted artifacts.

Bitbucket artifact reference: https://support.atlassian.com/bitbucket-cloud/docs/use-bitbucket-artifacts-in-step/

## 7. Tagging smoke and regression tests

**Smoke tests:** Small, fast checks that critical features are available.  
**Regression tests:** Broader checks to detect features broken by new code.

A Playwright test can use descriptive tags in its title:

```javascript
const { test, expect } = require('@playwright/test');

test('login page opens @smoke', async ({ page }) => {
  await page.goto('https://playwright.dev/');
  await expect(page).toHaveTitle(/Playwright/);
});

test('navigation behaves correctly @regression', async ({ page }) => {
  await page.goto('https://playwright.dev/');
  await expect(page.getByRole('link', { name: 'Docs' })).toBeVisible();
});
```

(The sample tags demonstrate grouping; the example cases use the public Playwright website rather than a real application login.)

Run only tagged smoke tests:

```bash
npx playwright test --grep @smoke
```

Run only regression tests:

```bash
npx playwright test --grep @regression
```

**Suggested stage selection:**

| Stage | Example test selection |
| --- | --- |
| Pull request | Fast smoke + selected API checks |
| Staging | E2E and broader regression |
| Nightly schedule | Larger regression and multi-browser coverage |
| After production deployment | Safe, non-destructive smoke checks |

This mapping is a **recommendation**, not a mandatory rule in the source programme.

## 8. Flaky tests and how to investigate

A **flaky test** sometimes passes and sometimes fails without an intentional application change.

### Common causes

| Cause | Symptoms | Better approach |
| --- | --- | --- |
| Fixed sleep or timing assumption | Test fails on slower CI machines | Use Playwright auto-waiting and web-first assertions |
| Fragile locator | Click finds the wrong element | Use role/label/test ID and clear scoping |
| Shared test data | Passes alone, fails when tests run together | Isolate accounts, fixtures and records |
| External service variability | Test fails on unrelated API outage | Mock nonessential external calls where appropriate |
| Race condition | Different order of events across runs | Assert on stable state and isolate concurrent activity |
| Environment configuration | Passes locally but fails in CI | Align versions, base URLs, browsers and credentials |

### Debugging method

1. Read the failing assertion and stack trace.
2. Open the saved screenshot or trace.
3. Check whether failure is application logic, test design, test data, or infrastructure.
4. Reproduce under controlled conditions.
5. Fix the root cause, then rerun the affected suite and relevant regression checks.

**Do not simply rerun a failing test until it becomes green.** Repeated retries can conceal real product defects or unstable test behavior.

## 9. Day 11 Intermediate practice checklist

- [ ] Explain `image`, `pipelines`, `step`, `script`, `caches`, and `artifacts`.
- [ ] Explain the difference between dependency caching and report artifacts.
- [ ] Identify the existing Day 08 CI smoke collection.
- [ ] Explain how Newman creates a JUnit XML report.
- [ ] Explain why the Day 10 Playwright suite must exist before CI execution.
- [ ] Run smoke-only and regression-only tests using tags once tests are implemented.
- [ ] Explain how to diagnose and fix a flaky test.

## 10. Next: Advanced and official assessment

**Advanced syllabus:** Merge-blocking quality gates, post-deployment smoke checks, secrets/environment variables, and pipeline speed using parallel steps or sharding.

**Official practical assessment:** Write a root-level `bitbucket-pipelines.yml` that runs the Day 08 Newman collection **and** Day 10 Playwright suite on every pull request, publishes reports, and blocks merges on failures. Draw the full RoBenDevs CI/CD pipeline, marking where each kind of testing happens.

**Submission:** A pull request with the pipeline file, diagram, and a verified link to a passing pipeline run.

**Current status:** Intermediate study notes written. No Bitbucket pipeline deployment, browser run, pass claim, or assessment submission yet.

## References

- Official RoBenDevs Foundation Programme, Day 11, page 16.
- [Bitbucket Pipelines configuration](https://support.atlassian.com/bitbucket-cloud/docs/bitbucket-pipelines-configuration-reference/)
- [Bitbucket artifacts](https://support.atlassian.com/bitbucket-cloud/docs/use-bitbucket-artifacts-in-step/)
- [Bitbucket caches](https://support.atlassian.com/bitbucket-cloud/docs/cache-dependencies/)
- [Playwright CI](https://playwright.dev/docs/ci)
- [Newman CLI options](https://learning.postman.com/docs/collections/using-newman-cli/newman-options)
