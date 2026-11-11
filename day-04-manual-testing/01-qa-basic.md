# Day 4 — Basic: My Understanding of Manual Testing and Test Execution

**Programme:** RoBenDevs QA Engineer Internship — 14-Day Foundation Programme  
**Day:** 04  
**Level:** Basic  
**Topic:** Manual Testing, Test Planning, Test Execution, Smoke, Sanity, and Regression Testing  
**Prepared by:** MD Morshed Jaman  
**Learning date:** 11 November 2026

> **Scope:** These are my Day 4 Basic learning notes and an account of my Jira/Xray practice. I created a manual test specification and its Test Execution record, but I have **not executed the registration test against a real application**. Example test outcomes below describe expected behaviour, not observed results.

## 1. What I Learned on Day 4

On Day 3, I learned how to **design test cases** using Equivalence Partitioning (EP), Boundary Value Analysis (BVA), Decision Tables, and State Transitions. Day 4 focuses on **planning and performing manual testing**, comparing actual and expected results, and deciding which checks to run when software changes.

The Basic topics in the foundation programme are:

1. **Test plans:** scope, approach, environments, entry and exit criteria, risks.
2. **Test execution:** running test cases and recording Pass, Fail, and Blocked results.
3. **Smoke and sanity testing:** quick checks before or after focused changes.
4. **Regression testing:** rechecking existing functionality after changes.

## 2. Manual Testing — My Understanding

Manual testing means a tester performs test actions and evaluates the application's behaviour without using an automated script to carry out the test steps. Tools such as Jira, Xray, and Browser DevTools can still assist with documentation and investigation.

For example, to test a registration form, I would open the page, enter data, submit the form, inspect the displayed behaviour, and compare the **actual result** with the **expected result**.

**What I learned:** Writing a test case is not the same as executing it. A test becomes a recorded result only after I run it on a defined application and environment.

## 3. Test Planning

A **test plan** explains what will be tested, how the testing will be approached, which environment and data are needed, when testing can begin or finish, and which risks deserve attention.

### Example — Registration and Checkout Test Plan (Illustrative)

| Test plan element | What it means | Example for a sample e-commerce application |
| --- | --- | --- |
| **Scope** | Features included in testing | Registration, login, cart, coupons, checkout |
| **Approach** | Types and methods of testing | Manual functional tests, smoke, sanity, regression, exploratory tests |
| **Environment** | Where tests will run | Assigned staging website, browser/build/version to be recorded |
| **Entry criteria** | Conditions required to start | Deployed build, reachable application, approved requirements, test accounts and data |
| **Exit criteria** | Conditions agreed for completion | Planned tests executed; important failures reviewed; remaining risks reported |
| **Risks** | Areas where failures matter most | Incorrect order total, duplicate charge, invalid account creation, session expiry |

A real test plan needs the assigned application's actual URL, business rules, test environment, and release criteria. The example above is a planning illustration, not a completed project-specific plan.

**What I learned:** A test plan helps me avoid random testing and communicates scope, dependencies, and risks to the team.

## 4. Test Execution

**Test execution** is the process of following a defined test case, observing the application, and comparing what happened with what was expected.

### Example — REG-01: Registration rejects an empty Name field

This example is taken from my Day 3 registration/checkout test-design assessment.

| Field | Details |
| --- | --- |
| **Test ID** | REG-01 |
| **Jira Xray Test** | [QP-3 — Verify registration rejects an empty name](https://g-team-qfw281wn.atlassian.net/browse/QP-3) |
| **Technique** | Equivalence Partitioning / Negative Testing |
| **Precondition** | A registration form is available; other required data can be valid |
| **Test data** | Name = empty; unique valid email; matching valid passwords |
| **Expected result** | Required-field validation is displayed; no account is created |
| **Actual result** | Not observed on a registration application |
| **Execution status** | **NOT RUN** |

**My planned manual steps:**

1. Open the registration page.
2. Leave the **Name** field empty.
3. Enter a unique valid email and matching valid passwords.
4. Click **Register** and inspect the validation behaviour.
5. Confirm that no new account was created for the email.

**Important assumption:** My Day 3 exercise assumes Name is required. This should be confirmed in the requirements of the real application before execution.

### Execution status meanings

| Status | Meaning | Example |
| --- | --- | --- |
| **PASS** | Actual behaviour matches the expected result | Empty Name is rejected and no account is created |
| **FAIL** | Actual behaviour differs from the expected result | Empty Name is accepted and an account is created |
| **BLOCKED** | A dependency prevents the test from being executed | Registration page is unavailable |
| **TODO / NOT RUN** | No valid execution result has been recorded | QP-3 has test steps but no tested application outcome |
| **EXECUTING** | Test run has been started but is not finished | A run is open in Xray; this alone is not a PASS |

The **Jira issue workflow status** (such as *To Do*) and the **Xray Test Run status** (such as *TODO* or *EXECUTING*) are different things.

### Evidence I would collect during a real execution

- Screenshot of the submitted form and validation message.
- Browser and environment details, including application/build version.
- Relevant sanitized Network information if verification requires it.
- Confirmation that the account was not created, using an authorized verification method.
- A defect ticket linked to the test if the observed behaviour genuinely violates the confirmed requirement.

**What I learned:** I should never report PASS or FAIL based only on a written expectation or a test-management screen.

## 5. Smoke Testing

**Smoke testing** is a small set of high-priority checks used to decide whether a new build is stable enough for deeper testing.

**Example — E-commerce smoke checks:**

1. Website opens successfully.
2. A user can log in.
3. A product can be added to the cart.
4. Checkout opens.
5. A sandbox payment can reach its expected confirmation or failure state.

If an essential flow is broken, the QA team can report the blocker before investing time in detailed tests.

**What I learned:** Smoke testing is **broad but shallow**; it checks critical paths rather than every detail.

## 6. Sanity Testing

**Sanity testing** is focused testing after a limited change or bug fix to check whether the changed functionality behaves as intended.

**Example:** Suppose a developer fixes a coupon issue where ineligible customers received a discount.

I would verify that:

- An ineligible customer does **not** receive the discount.
- An eligible customer with a valid coupon and sufficient subtotal still **does** receive it.
- The change has not obviously broken the relevant coupon calculation.

**What I learned:** Sanity testing concentrates on the specific changed area, while smoke testing checks overall build readiness.

## 7. Regression Testing

**Regression testing** checks whether a new change unexpectedly breaks functionality that previously worked.

**Example:** After modifying coupon calculations, I would consider retesting:

- Cart subtotal calculation.
- Coupon threshold and eligibility.
- Final payable amount and rounding.
- Payment processing and order confirmation.
- Behaviour when a coupon is removed or invalid.

These examples are drawn from the registration/checkout domain used in my Day 3 assessment. The final regression selection depends on what changed and how risky the related features are.

**What I learned:** Regression testing protects existing behaviour when a feature changes; it is not simply repeating every test without considering impact.

## 8. Smoke vs Sanity vs Regression — Quick Comparison

| Aspect | Smoke | Sanity | Regression |
| --- | --- | --- | --- |
| **Main question** | Is this build ready for deeper testing? | Does the changed/fixed area work? | Did the change break existing behaviour? |
| **Scope** | Broad, essential paths | Narrow, changed area | Impacted existing functionality |
| **Example** | Login, cart, and checkout can open | Coupon eligibility fix works | Coupon change has not broken totals or payment |

## 9. My Hands-On Jira and Xray Practice

During Day 4, I explored the Xray test-management workflow in my QA Practice Jira project.

| Jira item | What I created | Purpose |
| --- | --- | --- |
| [**QP-3**](https://g-team-qfw281wn.atlassian.net/browse/QP-3) | Xray **Test**: `REG-01 — Verify registration rejects an empty name` | Stores the manual test specification |
| [**QP-4**](https://g-team-qfw281wn.atlassian.net/browse/QP-4) | Xray **Test Execution**: `Day 4 — Registration Manual Test Execution (REG-01)` | Organizes an execution of QP-3 |

### What I practised

1. Created the Xray-related Jira work types, including Test and Test Execution.
2. Opened an Xray **Manual** Test issue.
3. Added the **Action**, **Data**, and **Expected Result** for each of the five REG-01 steps.
4. Created a **Test Execution** linked to the Test.
5. Opened **Test Runs** and explored the execution screen, including status and timer.
6. Identified that **Test**, **Test Execution**, and **Test Run** have different purposes.

### What each Xray item means

| Xray item | Purpose | Needed for my current practice? |
| --- | --- | --- |
| **Test** | Stores the test definition and steps | Yes |
| **Test Execution** | Groups tests to be executed in a specific run | Yes |
| **Test Run** | Stores the per-test execution status, step outcomes, and evidence | Yes, when actual execution begins |
| **Precondition** | Reusable prerequisites for tests | Optional for this small exercise |
| **Test Set** | Organizes related test cases | Optional |
| **Xray Test Plan** | Groups tests and executions for coverage planning | Optional for this single-test Xray practice |

**Important distinction:** My foundation programme still requires a **written Day 4 test plan**, even if I do not create an Xray *Test Plan* issue.

### Current execution limitation

I have not been provided or selected a registration application whose actual requirements match the Day 3 assumed rules. Although I opened a Test Run in Xray, I have **not performed the application test**, verified account creation, or collected execution evidence. Therefore, I must not claim a PASS or a FAIL for QP-3.

## 10. Day 4 Assignment — What Remains

The Day 4 practical assignment requires:

- [ ] Write a test plan for a sample web application.
- [ ] Confirm the application's requirements and prepare usable test data.
- [ ] Execute relevant Day 3 test cases on the assigned/sample application.
- [ ] Record actual results, statuses, and evidence.
- [ ] Run two **45-minute exploratory testing sessions**, each with a charter and notes.
- [ ] Save the test plan, execution results, and exploratory session notes in `day-04-manual-testing/`.

This Basic note documents **learning and Xray setup**. It does not claim that the practical execution and exploratory-session deliverables are complete.

## 11. My Key Takeaways

- **Planning:** Know the scope, environment, entry/exit conditions, and risks before testing.
- **Execution:** Compare actual behaviour with the expected result and record evidence honestly.
- **Smoke:** Check essential features before deeper testing.
- **Sanity:** Verify a targeted change or fix.
- **Regression:** Recheck related existing functionality after a change.
- **Xray:** A Test defines the test, a Test Execution organizes its run, and a Test Run records the outcome.

### Final Reflection

Day 4 helped me connect the test-design skills from Day 3 to the real QA workflow. I now understand how a test plan guides testing, how manual tests should be executed and recorded, and how smoke, sanity, and regression checks serve different purposes. My Xray practice with QP-3 and QP-4 helped me learn test management, while reinforcing that a **created test case is not the same as a completed test execution**.

## Reference

RoBenDevs QA Engineer Internship — 14-Day Foundation Programme, **Day 4: Manual and Exploratory Testing**, page 10 (Basic topics and practical assignment).
