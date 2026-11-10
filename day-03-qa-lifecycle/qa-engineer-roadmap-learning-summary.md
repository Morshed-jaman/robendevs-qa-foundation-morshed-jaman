# QA Engineer Roadmap — Summary of My Learning

**Reference:** https://roadmap.sh/qa

## 1. QA Fundamentals
I learned that Quality Assurance (QA) focuses on improving software quality by preventing defects, identifying risks, and ensuring requirements are met.

I also learned three testing approaches:
- **Black Box Testing:** Testing functionality without knowing the internal code. Usually performed by QA engineers.
- **White Box Testing:** Testing internal code, logic, branches, and execution paths. Mainly performed by developers and technical testers.
- **Gray Box Testing:** Testing with partial knowledge of the internal system.

White box testing includes statement coverage, branch coverage, condition coverage, path coverage, loop testing, and data flow testing.

## 2. Project Management and SDLC
I learned how QA engineers work within the Software Development Life Cycle.

- **Waterfall:** Sequential development process.
- **V-Model:** Development and testing activities are linked.
- **Agile:** Software is developed and tested iteratively.
- **Scrum:** Work is organized into sprints.
- **Kanban:** Work is tracked using visual boards.

Tools like Jira help manage tasks, bugs, and workflows. TestRail and Zephyr help manage test cases and executions.

## 3. Manual Testing
I learned that manual testing involves checking software functionality without using automated execution scripts.

Important concepts include:
- Test scenarios and test cases
- Test planning
- Verification and validation
- Compatibility testing
- Expected versus actual results
- Bug reporting

## 4. Testing Techniques
I learned the difference between functional and non-functional testing.

**Functional Testing:** Checks whether software features work correctly.

Examples: Unit, Integration, Smoke, Sanity, Regression, Exploratory, and User Acceptance Testing (UAT).

**Non-Functional Testing:** Checks software quality attributes.

Examples: Performance, Load, Stress, Security, and Accessibility Testing.

## 5. Automation Testing
I learned that automation testing uses scripts and frameworks to execute tests automatically.

Three major areas are:

- **Frontend Automation:** Testing website interfaces using Playwright, Cypress, or Selenium.
- **Backend/API Automation:** Testing APIs using Postman, REST Assured, or other automation frameworks.
- **Mobile Automation:** Testing mobile applications using Appium, Espresso, or XCUITest.

I also learned about browser testing add-ons:
- **Selenium IDE:** Record and replay tests.
- **Ghost Inspector:** Create and run automated browser tests.
- **Bug Magnet:** Insert unusual test data to find bugs.

## 6. Specialized Testing
I learned about additional testing areas:

- **Accessibility Testing:** Checking whether people with disabilities can use software.
- **Performance Testing:** Measuring speed, response time, and stability.
- **Security Testing:** Checking authentication, authorization, and vulnerabilities.
- **Email Testing:** Checking email delivery, verification links, and content.

Tools include JMeter, k6, Lighthouse, WAVE, and axe.

## 7. Monitoring and Reporting
I learned that monitoring tools help teams identify software errors and performance issues.

Examples: Grafana, Kibana, Sentry, and Datadog.

Reporting tools such as Allure and JUnit reports help communicate test results, including passed, failed, and skipped tests.

## 8. Git and Repository Hosting
I learned that Git is used for version control, while GitHub, GitLab, and Bitbucket are platforms for hosting repositories and collaborating.

Important Git operations include cloning, branching, committing, pushing, pulling, and creating pull requests.

## 9. CI/CD — GitHub Actions, Jenkins, and GitLab CI/CD
One of my most important learnings was understanding what CI/CD tools actually do.

**GitHub Actions, Jenkins, and GitLab CI/CD do not normally write test cases themselves.**

Instead, they automate processes such as:
- Setting up the testing environment
- Building applications
- Executing existing automated tests
- Generating reports
- Deploying applications

For example:

1. A QA engineer writes automated tests using Playwright.
2. The tests are pushed to GitHub.
3. GitHub Actions starts a configured workflow.
4. Playwright executes the tests.
5. GitHub Actions reports whether the workflow passed or failed.

I understood that GitHub Actions and Jenkins serve similar purposes, but companies select different CI/CD tools depending on their infrastructure and requirements.

## 10. JavaScript Test Execution
I learned that JavaScript tests can be executed using several testing frameworks.

| Testing Tool | Command |
|---|---|
| Node.js Test Runner | `node --test` |
| Jest | `npx jest` |
| Playwright | `npx playwright test` |
| Cypress | `npx cypress run` |

These commands require the appropriate environment and tool setup.

For example, I can write a JavaScript test using Playwright, execute it manually from the terminal, or configure GitHub Actions to execute it automatically.

## 11. Headless Testing
I learned that headless testing means running automated browser tests without displaying a visible browser window.

It is useful for executing browser tests in CI/CD pipelines.

---

## My Key Takeaways

After exploring the QA Engineer Roadmap, I understand that:

1. QA is not only about finding bugs; it also involves preventing defects and improving software quality.
2. Manual testing and test design are essential foundations before learning automation.
3. Different testing techniques are used for different software quality requirements.
4. Developers mainly perform white box testing, but QA engineers with programming knowledge can also perform it.
5. Testing frameworks such as Playwright, Cypress, and Jest execute automated tests.
6. CI/CD tools such as GitHub Actions and Jenkins automate when, where, and how those tests are executed.
7. Git and GitHub help maintain test scripts and support team collaboration.
8. A QA engineer should understand the entire software development and testing lifecycle.

## Final Understanding

My biggest takeaway is understanding the relationship between **software testing, test automation, and CI/CD**.

**QA Engineer designs tests → Testing framework executes tests → CI/CD pipeline automates execution → Results are reviewed → Bugs are fixed and retested.**

This roadmap helped me understand the responsibilities, technologies, and practical skills required to grow from a beginner QA engineer into a professional SQA Automation Engineer.