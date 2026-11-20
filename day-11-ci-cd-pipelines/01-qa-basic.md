# Day 11 — Basic: CI/CD and Automation in the Pipeline

**Programme:** RoBenDevs QA Engineer Internship — 14-Day Foundation Programme  
**Study date:** 20 November 2026  
**Topic:** CI/CD and Automation in the Pipeline  
**Level:** Basic  
**Syllabus reference:** Official Foundation Programme, Day 11, page 15  
**Previous day:** [Day 10 — Browser Automation](../day-10-browser-automation/)

> **Study documentation only.** This file explains CI/CD concepts and QA responsibilities. It does not claim a Bitbucket Pipeline was configured, executed or passed. Pipeline setup, reports, screenshots and assessment evidence will be separate.

## 1. Official Day 11 Basic learning objectives

The Basic syllabus requires understanding:

1. **CI/CD concepts:** Continuous Integration, Continuous Delivery, and Continuous Deployment.
2. **Pipeline stages:** build, test, deploy to staging, test again, release to production.
3. **Pipeline triggers:** push, pull request, and a schedule.
4. **QA's role:** which tests run at each stage and who responds when a stage fails.

The later levels cover Bitbucket Pipelines YAML, automated Newman/Playwright execution, artifacts, quality gates, secrets, and pipeline performance.

## 2. CI/CD: What does it mean?

**Continuous Integration (CI)** means making small code changes frequently and automatically building/testing them so integration problems are discovered quickly.

**Continuous Delivery (CD)** means keeping the software validated and ready to release. The production release may still require a manual approval step.

**Continuous Deployment (CD)** means automatically deploying validated software changes to production after the pipeline's required checks pass.

| Practice | Main goal | Example |
| --- | --- | --- |
| Continuous Integration | Detect problems when combining code changes | A pull request automatically runs build and tests |
| Continuous Delivery | Keep the release ready to deploy | Staging tests pass; a lead approves the production release |
| Continuous Deployment | Automatically release qualifying changes | Validated changes go to production without a manual per-release approval |

**Remember:** Delivery and deployment are different. A passing pipeline does not always mean code has been released to users.

### Why teams use CI/CD

- Faster feedback after new commits.
- Repeated and consistent test execution.
- Earlier detection of regressions.
- More predictable release preparation.
- Clear visibility of failed checks and responsible owners.

CI/CD tools **execute configured steps**; they do not automatically design or write good test cases. QA and developers still write and maintain meaningful tests.

## 3. Pipeline stages and quality checks

A typical learning workflow is:

```text
Developer push / pull request
             |
             v
       Install & build
             |
             v
    Unit & integration tests
             |
             v
       API test checks
             |
             v
      Deploy to staging
             |
             v
  Staging smoke / E2E tests
             |
             v
      Release approval*
             |
             v
      Deploy to production
             |
             v
   Post-deployment smoke
```

`*Release approval` is project-specific: required for continuous delivery with a manual gate, not for every automated deployment workflow.

**Stages explained:**

| Stage | What happens | Typical QA focus |
| --- | --- | --- |
| Build | Install packages, compile and package application | Review build and test environment readiness |
| Test | Run fast unit, integration, and API checks | Review failures, coverage, and test reliability |
| Deploy to staging | Release code to a nonproduction environment | Confirm correct version and test data |
| Test again | Run staging smoke, regression, and browser E2E tests | Verify user-facing critical workflows |
| Production release | Publish approved application version | Help assess release risk and unresolved defects |
| Post-release | Smoke-check live critical paths and monitor | Report production regressions quickly |

The **exact order**, environments, and test selection depend on the system. Some pipelines test before and after staging, and some use additional security/performance gates.

## 4. Pipeline triggers

A **trigger** tells a CI/CD system when to start running a pipeline.

### 4.1 Push trigger

**When:** A developer pushes changes to a tracked branch.

**QA scenario:** Run compilation, linting, and fast automated tests before the changes are reviewed.

### 4.2 Pull request (PR) trigger

**When:** A developer opens or updates a pull request.

**QA scenario:** Run branch validation checks before changes can be merged. Some repositories require passing checks before allowing merge.

### 4.3 Scheduled trigger

**When:** A configured schedule runs (e.g., each night).

**QA scenario:** Run a larger regression suite that would make every developer PR too slow.

### 4.4 Manual trigger (extra context)

A developer, QA, or authorized release engineer can start a configured pipeline manually, for example before a controlled release.

| Trigger | Common fast/slow test selection |
| --- | --- |
| Push | Unit + selected integration tests |
| Pull request | Unit, API, selected smoke checks |
| Nightly schedule | Larger regression / cross-browser suite |
| Manual release | Release-specific checks and approval steps |

These mappings are **examples**, not fixed rules from the programme.

## 5. How QA fits into CI/CD

QA is involved **before**, **during**, and **after** pipeline execution:

- **Before:** Understand requirements, design test scenarios, and help define quality gates.
- **During:** Maintain automated API and browser tests; inspect failures and evidence.
- **After:** Verify staging behavior, confirm fixes, and report release risks.
- **Post-release:** Help with safe smoke tests and investigation of any defect.

### 5.1 Who responds to failures?

| Failure | Usually investigated by |
| --- | --- |
| Application does not build | Developer / DevOps |
| Unit test fails after code change | Developer; QA may help reproduce |
| API assertion fails | QA / Developer together |
| Playwright browser test fails | QA automation / Developer, depending on root cause |
| Deployment infrastructure fails | DevOps / Platform team |
| Business-critical staging test fails | QA reports; developer fixes; release owner assesses approval |

**Important:** Responsibilities differ by team; failing tests should not be ignored, and a failed automated test is not automatically an application bug. It may be test data, an environment issue, or a flaky test.

## 6. Relating CI/CD to our RoBenDevs work

Previously we studied:
- **Day 7:** Postman API tests.
- **Day 8:** Newman, data-driven and advanced API testing.
- **Day 9:** SQL and database/data verification.
- **Day 10:** Playwright and browser automation.

Day 11 connects these activities into a pipeline:

```text
Code change -> Bitbucket pipeline
                    |
                    +-- API tests: Newman collection (Day 8)
                    |
                    +-- Browser tests: Playwright suite (Day 10)
                    |
                    +-- Test reports, screenshots and traces
                    |
                    +-- Fail/pass signal for review and release gating
```

**Key distinction:** The current learning repository is on **GitHub**; the official Day 11 assignment specifically requires **Bitbucket Pipelines**. A GitHub commit alone is not evidence of a passing Bitbucket pipeline.

## 7. Basic-level knowledge check

**Question 1:** What is the difference between Continuous Delivery and Continuous Deployment?

**Answer:** Continuous Delivery keeps the product ready to release, often with a manual approval. Continuous Deployment releases qualifying changes automatically after passing release checks.

**Question 2:** What is a pull request pipeline used for?

**Answer:** To run validation and provide feedback on proposed changes before merge.

**Question 3:** Should a failing API test always block deployment?

**Answer:** It depends on criticality and the quality gate. Investigate failures rather than treating them all equally or ignoring them.

**Question 4:** Do CI/CD tools automatically create application test cases?

**Answer:** No. They run configured scripts; testers and developers are responsible for test design and maintenance.

## 8. Learning/practice checklist

- [ ] Explain CI, Continuous Delivery, and Continuous Deployment in plain English.
- [ ] Draw a build -> test -> staging -> test -> production pipeline.
- [ ] Identify push, pull request, and scheduled triggers.
- [ ] Explain which tests QA would run at different stages.
- [ ] Describe a failed pipeline's investigation and escalation path.
- [ ] Distinguish tests/frameworks (Newman/Playwright) from CI orchestrators (Bitbucket Pipelines/GitHub Actions/Jenkins).

## 9. Official next lessons and practical

**Intermediate:** Read/write `bitbucket-pipelines.yml`, images/steps/caches, run Newman and headless Playwright, publish reports/screenshots/traces, separate smoke/regression suites, investigate flaky tests.

**Advanced:** Merge-blocking quality gates, post-deployment smoke tests, secret variables, parallel jobs/sharding and pipeline speed.

**Official assessment:** Configure a `bitbucket-pipelines.yml` that runs the **Day 8 Newman collection** and **Day 10 Playwright suite** on every pull request, publishes test reports, and blocks merge on failure. Draw the complete RoBenDevs CI/CD pipeline with appropriate test locations.

**Official submission:** A pull request containing the pipeline file and diagram, plus a link to a **verified passing** pipeline run.

**Current status:** Basic learning notes completed. Pipeline configuration and real execution evidence remain to be done.

## 10. References

- Official RoBenDevs 14-Day Foundation Programme, Day 11 (pages 15–16).
- [Atlassian: Continuous Integration vs Delivery vs Deployment](https://www.atlassian.com/continuous-delivery/principles/continuous-integration-vs-delivery-vs-deployment)
- [Bitbucket Cloud: Pipeline Triggers](https://support.atlassian.com/bitbucket-cloud/docs/pipeline-triggers/)
- [Bitbucket Cloud: Pipeline Configuration Reference](https://support.atlassian.com/bitbucket-cloud/docs/bitbucket-pipelines-configuration-reference/)
- [Playwright: Continuous Integration](https://playwright.dev/docs/ci)
