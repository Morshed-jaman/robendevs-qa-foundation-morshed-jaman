# Day 11 — Advanced: Quality Gates, Post-Deployment Testing, Secrets and Pipeline Optimization

**Programme:** RoBenDevs QA Engineer Internship — 14-Day Foundation Programme  
**Study date:** 20 November 2026  
**Topic:** CI/CD and Automation in the Pipeline  
**Level:** Advanced  
**Source:** Official Foundation Programme, Day 11, page 16  
**Previous lessons:** [01 — Basic](01-qa-basic.md) · [02 — Intermediate](02-qa-intermediate.md)

> **Learning notes, not a completed pipeline assessment.** The YAML and commands below are teaching examples for a Bitbucket Cloud repository. This learning repository is on GitHub, and the Day 10 Playwright suite is not yet implemented in a runnable `automation/` project. No passing Bitbucket pipeline, blocked merge, production deployment or verified deployment smoke test is claimed.

## 1. Advanced learning objectives

The official Day 11 Advanced syllabus includes:

1. **Quality gates:** merge checks that block a pull request when critical tests fail.
2. **Post-deployment checks:** automatic smoke tests after deployment to staging or production.
3. **Environments and secrets:** pipeline variables, test credentials and keeping them safe.
4. **Speed:** parallel steps, test sharding and keeping pipelines fast.

These build on Day 11 Basic (CI/CD stages and triggers) and Intermediate (Bitbucket YAML, Newman, Playwright, artifacts and flaky tests).

## 2. Quality gates: preventing unsafe merges

A **quality gate** is a required condition that a change must satisfy before moving forward, for example a successful build or passing automated tests.

**Example:** If the payment API smoke test fails in a pull-request pipeline, the team wants to prevent merging to `main` until the failure is investigated and resolved.

```text
Pull request opened / updated
              |
              v
      CI pipeline executes
              |
      +-------+--------+
      |                |
  Tests PASS       Tests FAIL
      |                |
      v                v
Other review       Investigate issue,
rules met?         fix & rerun
      |
      v
Merge permitted by configured rules
```

### 2.1 How merge blocking works in Bitbucket

A failing pipeline can publish a failed build status, but **the pipeline status alone is not sufficient to guarantee merge blocking**.

For enforced merge protection, authorized repository/workspace administrators must configure appropriate **branch restrictions / required merge checks** for protected branches, such as requiring successful builds on the latest pull-request commit.

**Important caveat:** Enforcement behavior and availability depend on Bitbucket Cloud plan and settings. Some merge checks may only recommend rather than block. Verify the actual repository configuration; do not assume a check is enforced just because a failed build appears in the PR.

**Suggested QA gate criteria (examples to agree with the team):**
- Relevant API smoke checks pass.
- Relevant browser smoke checks pass.
- Critical regression failures have been investigated.
- No known critical production-blocking defects are left without approved mitigation.
- Test evidence and release decisions are documented.

### 2.2 Illustrative PR pipeline (not yet runnable here)

```yaml
pipelines:
  pull-requests:
    '**':
      - step:
          name: Validate pull request
          script:
            - echo "Run required, real validation commands here"
```

**Reminder:** An `echo` command is **not a test** and cannot demonstrate a passing quality gate. Replace it with verified commands after the Day 10 Playwright project is built. A passing status becomes a merge blocker only with the correct Bitbucket merge rules.

**QA responsibilities:** Define meaningful tests, investigate failure evidence, and communicate release risk; do not simply mark a failing test as passed.

## 3. Post-deployment smoke testing

**Meaning:** Automatically check critical user journeys immediately after a new version is deployed.

A smoke test should be **fast, reliable, safe, and minimally destructive**. It is not the same as the complete regression suite.

### 3.1 Example post-deployment workflow

```text
Pull request passes quality gates
             |
             v
      Merge to main
             |
             v
     Deploy to staging
             |
             v
  Run staging smoke checks
             |
         PASS / FAIL
             |
             v
    Approved production release
             |
             v
 Run safe production smoke checks
             |
      Alert / investigate failures
```

**QA example:**
- Verify that a public health endpoint responds successfully.
- Verify login page availability without exposing credentials.
- Verify that a non-destructive read-only API endpoint returns the expected structure.
- Use disposable accounts/data in staging; avoid creating live financial transactions in production.

### 3.2 Example smoke command (adapt to a real application)

A simple HTTP check might be:

```bash
curl --fail --silent --show-error "$STAGING_BASE_URL/health"
```

This assumes a real, documented `/health` endpoint exists and that `STAGING_BASE_URL` is properly configured. A successful health endpoint alone **does not prove complete application readiness**.

A Bitbucket deployment step can be followed by a separate smoke-test step once valid deployment scripts and environment access are available.

### 3.3 When a post-deployment smoke test fails

- Capture pipeline logs, timing, environment and app version.
- Distinguish app failure from test/environment failure.
- Notify the appropriate owner and stop the planned promotion if required.
- Follow the team's approved rollback or remediation procedure; do not invent production deployment commands or unilaterally roll back shared services.

## 4. Environments, variables, and secrets

**Common environments:**

| Environment | Typical purpose | Testing approach |
| --- | --- | --- |
| Development | Rapid developer feedback | Unit and integration tests |
| Staging | Pre-release verification | API, smoke, E2E and regression tests |
| Production | Actual users | Non-destructive smoke and monitoring |

### 4.1 Variables versus secrets

- **Normal configuration variable:** A non-sensitive base URL such as `STAGING_BASE_URL`.
- **Secret:** Passwords, API tokens, access keys and session credentials. Must be managed securely.

Avoid putting credentials directly in YAML files, Git commits, screenshots, chat messages, or public test reports.

Example in a Bitbucket pipeline script:

```yaml
script:
  - test -n "$STAGING_BASE_URL"
  - test -n "$TEST_API_TOKEN"
  - node scripts/run-smoke.js
```

This is illustrative. The referenced script must exist before execution. The environment variables must be created in Bitbucket with suitable scopes and permissions. Mark secret values as secured and avoid printing them into logs.

### 4.2 Protect test credentials

- Prefer dedicated, least-privilege synthetic test accounts.
- Separate development, staging, and production credentials.
- Use secured repository/deployment/workspace variables or an approved secret manager.
- Rotate exposed secrets immediately following organizational procedure.
- Audit who can access sensitive variables and deployment environments.
- Keep Playwright storage-state files, Newman environment secrets, traces containing tokens, and generated credentials out of public repositories.

**Important:** Masked output does not make an unsafe credential safe if an artifact still includes it. Review reports and traces before sharing.

## 5. Pipeline speed: parallel steps

**Parallel execution** runs independent jobs at the same time instead of waiting for each job to finish.

Example: one step runs Newman API smoke tests while another runs Playwright browser smoke tests.

```yaml
pipelines:
  pull-requests:
    '**':
      - parallel:
          - step:
              name: API smoke checks
              script:
                - echo "Replace with validated Newman command"
          - step:
              name: Browser smoke checks
              script:
                - echo "Replace with validated Playwright command"
```

**Teaching example only:** The `echo` placeholders do not run real tests. Real commands must be added after verifying dependencies, paths, runtime images, and the actual test suite.

### 5.1 Parallelism trade-offs

**Benefits:** Lower wall-clock time when jobs can truly execute concurrently.

**Risks:** Higher simultaneous resource usage, repeated dependency installation, isolated job environments, and collisions when tests share mutable users or database records.

**QA check:** Ensure tests do not fail merely because independent jobs execute simultaneously.

## 6. Playwright sharding: splitting one suite across jobs

**Sharding** divides the tests from one Playwright suite into separate subsets.

For a two-shard suite:

```bash
npx playwright test --shard=1/2
npx playwright test --shard=2/2
```

Both commands must run (commonly in separate pipeline steps) for the entire suite to be covered. Running only one shard is **not** equivalent to running all tests.

### 6.1 Practical concerns

- All shards should use a compatible Playwright version/configuration.
- Use independent or partitioned test data.
- Each shard produces its own reports or blob artifacts.
- Merge reporting output deliberately if a single consolidated report is required.
- More parallel jobs do not always mean faster total work if tests contend on the same services.

## 7. Practical CI/CD QA strategy

| Pipeline checkpoint | Example tests | Gate or action |
| --- | --- | --- |
| Pull request | Unit, selected API smoke, small UI smoke | Required check before merge (if configured) |
| After staging deploy | API and browser end-to-end checks | Investigate failures before release |
| Nightly | Broader regression, cross-browser tests | Track failures and trends |
| After production deploy | Safe, read-only smoke checks | Alert and follow incident procedure |

This is an **example QA strategy**; real scope and gating rules require team approval.

## 8. Official Day 11 assignment roadmap

The programme asks for:

1. A root-level `bitbucket-pipelines.yml` running the **Day 08 Newman collection** and **Day 10 Playwright suite** for each pull request.
2. Published test reports/artifacts.
3. Merge blocking for failed checks.
4. A full CI/CD pipeline diagram marking different test types.
5. A pull request with the pipeline file and diagram.
6. A link to a **real, passing** pipeline run.

**Existing learning material:**
- Day 08 API tests: `../day-08-advanced-api-testing/api-tests/`
- Day 10 browser automation study: `../day-10-browser-automation/` (currently notes only)

**Dependencies before claiming assessment complete:**
- Implement and run a real Day 10 Playwright suite.
- Configure a suitable Bitbucket repository and required quality gate.
- Validate pipeline YAML and test dependencies.
- Execute actual PR checks and retain a genuine build result.
- Create and review the pipeline diagram.

## 9. QA review questions

1. **Does a red PR pipeline always block merge?**  
   No. Required merge checks and appropriate branch restrictions must be configured and enforced.
2. **Why avoid full regression directly in production?**  
   It can be slow, disruptive, or destructive; production checks should usually be safe and limited.
3. **Why use secured pipeline variables?**  
   To avoid hardcoding credentials and to control access to sensitive values.
4. **What is the difference between parallel steps and sharding?**  
   Parallel steps run multiple jobs concurrently; sharding divides one test suite across jobs.
5. **Is a pipeline green if it only runs `echo "Tests passed"`?**  
   A command may succeed, but it provides no genuine test assurance.

## 10. Practice checklist

- [ ] Explain how required merge checks protect a branch.
- [ ] Distinguish pipeline failure status from an enforced merge gate.
- [ ] Design a safe staging/production smoke-check strategy.
- [ ] Identify secured credentials and environment variable scopes.
- [ ] Explain when parallel jobs help and when they cause conflicts.
- [ ] Run both halves of a sharded Playwright suite once tests exist.
- [ ] Prepare a complete, evidence-based Day 11 assessment and pipeline diagram.

**Current status:** Day 11 Advanced study notes documented. Pipeline configuration, real smoke execution, passing build URL, and assessment submission remain pending.

## 11. References

- Official RoBenDevs QA Engineer Internship 14-Day Foundation Programme, Day 11 (page 16).
- [Bitbucket — Suggest or require checks before a merge](https://support.atlassian.com/bitbucket-cloud/docs/suggest-or-require-checks-before-a-merge/)
- [Bitbucket — Variables and secrets](https://support.atlassian.com/bitbucket-cloud/docs/variables-and-secrets/)
- [Bitbucket — Parallel step options](https://support.atlassian.com/bitbucket-cloud/docs/parallel-step-options/)
- [Bitbucket — Set up and monitor deployments](https://support.atlassian.com/bitbucket-cloud/docs/set-up-and-monitor-deployments/)
- [Playwright — Sharding](https://playwright.dev/docs/test-sharding)
