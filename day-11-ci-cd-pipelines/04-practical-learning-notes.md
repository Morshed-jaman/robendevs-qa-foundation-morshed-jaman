# Day 11 — Practical Learning Notes: GitHub Actions CI and Quality Gates

**Programme:** RoBenDevs QA Engineer Internship — 14-Day Foundation Programme  
**Date:** 23 November 2026  
**Scope:** Hands-on GitHub Actions CI testing with Playwright, Newman, and pull-request quality gates

These notes describe work performed and evidenced in this repository. GitHub Actions was used because a Bitbucket repository was not available.

## 1. Playwright browser tests

Created a Playwright JavaScript test file at `day-11-ci-cd-pipelines/playwright-automation/tests/todo.spec.js` for the public TodoMVC demo application.

Three tests were added:
- **Smoke:** Add one todo item.
- **Regression:** Add multiple todo items.
- **Regression:** Mark a todo as completed.

Used Playwright locators (`getByPlaceholder`, `getByTestId`, `getByRole`), actions (`fill`, `press`, `check`), and assertions (`toHaveText`, `toHaveClass`).

Practiced running tests locally with `npx.cmd` on Windows PowerShell, selecting smoke/regression tests through `--grep`, and opening an HTML test report. The screenshot of the local regression run showed **2 tests passed**.

## 2. GitHub Actions CI workflow

Added `.github/workflows/day11-qa-ci.yml`.

The workflow:
- Runs on pull requests targeting `main`, relevant pushes to `main`, and manual dispatch.
- Uses one job to install dependencies/Chromium and run the Playwright tests.
- Uses another job to run the existing Day 08 Newman read-only Swagger Petstore API smoke collection.
- Uploads Playwright output and Newman report files as GitHub Actions artifacts.

The two independent jobs can execute in parallel. This is automated **CI testing**, not an application deployment pipeline.

**Verified push run:** [GitHub Actions run 45141874922](https://github.com/Morshed-jaman/robendevs-qa-foundation-morshed-jaman/actions/runs/45141874922)
- Playwright - Chromium: passed.
- Newman - API smoke: passed.
- Two report artifact packages were present.

## 3. Protected branch and required checks

Configured a GitHub repository ruleset targeting the default branch (`main`), including:
- Require a pull request before merging.
- Require both status checks: `Playwright - Chromium` and `Newman - API smoke`.
- Require the branch to be up to date before merging.
- Block force pushes.

**Learning:** A successful workflow alone does not enforce a merge gate; GitHub's branch rules must require the relevant checks.

## 4. Pull-request quality-gate experiment

Created the practice branch `practice/day11-quality-gate` and [Pull Request #1](https://github.com/Morshed-jaman/robendevs-qa-foundation-morshed-jaman/pull/1).

1. **Passing case:** Both required checks passed, and GitHub enabled the merge button.
2. **Intentional failure:** Changed the first Playwright test's expected todo title from `Learn Playwright` to `Wrong Task Name`.
3. **Observed result:** Playwright failed, Newman passed, and GitHub disabled merging because a required check failed.
4. **Recovery:** Restored the assertion to `Learn Playwright` and pushed the correction.
5. **Final repository state:** Pull Request #1 was merged, and the test on `main` contains the original assertion.

The deliberate test failure was used only to verify merge protection, not to report an actual application defect.

## 5. What I learned

- **Playwright** executes browser-based tests; **Newman** executes Postman API collections.
- **GitHub Actions** runs existing tests automatically on configured repository events; it does not write the test cases.
- A **pull request** lets changes be checked before entering `main`.
- **Required status checks** can block merging when a test fails.
- A failed check should be investigated and fixed; a corrected push can trigger the checks again.
- **Artifacts** preserve test outputs for inspection; they are different from dependency caches.
- Passing these checks verifies the tested scenarios, not the entire application's correctness.

## 6. Not yet covered by this practical

- Configuring and using real CI secrets or test credentials.
- Executing Playwright sharding across CI jobs.
- Testing after a real staging or production deployment.
- Running or submitting the official Day 11 assessment in Bitbucket Pipelines.

**Evidence:** [Workflow file](https://github.com/Morshed-jaman/robendevs-qa-foundation-morshed-jaman/blob/main/.github/workflows/day11-qa-ci.yml) · [Passing push run](https://github.com/Morshed-jaman/robendevs-qa-foundation-morshed-jaman/actions/runs/45141874922) · [Quality-gate PR #1](https://github.com/Morshed-jaman/robendevs-qa-foundation-morshed-jaman/pull/1)
