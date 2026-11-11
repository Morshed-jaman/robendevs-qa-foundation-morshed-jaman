# Day 4 — Intermediate: My Understanding of Exploratory Testing and Test Management

**Programme:** RoBenDevs QA Engineer Internship — 14-Day Foundation Programme  
**Day:** 04 | **Level:** Intermediate  
**Topic:** Exploratory Testing, Jira/Xray Test Management, Cross-Browser & Responsive Testing, Test Data  
**Date:** 11 November 2026

> **Progress:** These are my learning notes and planned practice scenarios. I created Xray Test **QP-3** and Test Execution **QP-4**. Registration/checkout test execution and the exploratory sessions are **not yet completed**.

## 1. What I Learned

After learning manual test planning and execution in Basic, I studied how to explore an application beyond scripted cases, organize tests with Xray, verify different browsers and screen sizes, and prepare reliable test data.

## 2. Exploratory Testing

Exploratory testing means **learning, designing, and performing tests while investigating an application**. Unlike scripted testing, I can adjust my next check based on what I observe. It still requires a clear goal and documented findings.

| Scripted testing | Exploratory testing |
| --- | --- |
| Follows predefined steps | Adapts tests during the investigation |
| Example: run **REG-01** exactly as written | Example: try unexpected inputs or double-click Register |
| Good for repeatable checks | Good for discovering overlooked risks |

**Registration example:** Besides checking an empty Name field, I would explore leading spaces, Unicode names, duplicate emails, mismatched passwords, repeated clicks, and page refreshes. These are **test ideas**, not confirmed defects.

### Test Charter, Time Box, and Session Notes

- **Test charter:** A short mission explaining *what* to explore and *why*.
- **Time-boxed session:** A fixed duration, for example **45 minutes**, for focused exploration.
- **Session notes:** A record of areas covered, test data, observations, questions, defects, and evidence.

### Planned Session 1 — Registration (45 minutes)

**Charter:** Explore registration validation and duplicate-submission risks.  
**Focus:** Empty fields, unusual names, invalid/duplicate email, mismatched password, rapid clicks.  
**Evidence to collect:** Screenshots, validation messages, relevant network requests and findings.

### Planned Session 2 — Checkout (45 minutes)

**Charter:** Explore payment interruptions and calculation consistency.  
**Focus:** Invalid quantities, coupon threshold, double-click Pay, refresh, browser Back, slow/offline network.  
**Evidence to collect:** Cart totals, payment/order status, network activity, and potential defect details.

**Note:** Both sessions are planned. I will record actual observations and session timing only after performing them on a suitable test application.

## 3. Test Management in Jira (Xray)

Xray extends Jira with dedicated objects for defining tests, grouping them, planning coverage, and recording executions.

| Xray item | Purpose |
| --- | --- |
| **Test** | Stores test steps and expected results |
| **Precondition** | Reusable setup requirements |
| **Test Set** | Groups related tests |
| **Test Plan** | Organizes planned testing scope |
| **Test Execution** | Contains one or more test runs |
| **Test Run** | Records actual step results and evidence |

### My Hands-On Practice

- **[QP-3](https://g-team-qfw281wn.atlassian.net/browse/QP-3) — REG-01:** Created an Xray Manual Test for rejecting an empty Name field, with **Action, Data, and Expected Result** steps.
- **[QP-4](https://g-team-qfw281wn.atlassian.net/browse/QP-4):** Created a Test Execution and opened the linked Test Run.
- Learned that the Jira board status **To Do** and an Xray run status such as **TODO** or **EXECUTING** describe different things.

**Important:** Opening a run does not mean the application was tested. REG-01 remains **not verified against a real registration application**. I should only record PASS/FAIL after actual execution with confirmed requirements.

## 4. Cross-Browser and Responsive Testing

**Cross-browser testing** checks whether the same feature behaves consistently across browsers. **Responsive testing** checks whether the interface remains usable at different screen sizes.

| Environment | Example checks |
| --- | --- |
| Chrome / Edge / Firefox | Registration validation, navigation, button behaviour |
| Desktop | Form layout, labels, error messages |
| Tablet | Layout spacing, menus, horizontal scrolling |
| Mobile | Field visibility, touch targets, keyboard overlap, checkout button |

**Example:** The Register button might work on desktop but be covered by the mobile keyboard. I can use **DevTools → Device Emulation** for an initial check, followed by real-device testing when possible.

## 5. Test Data and Clean Environments

Test data includes accounts, inputs, records, and configurations needed to run a test reliably.

| Scenario | Data needed |
| --- | --- |
| Valid registration | Fresh unused email and valid password |
| Duplicate email | Existing registered test email |
| Invalid registration | Empty Name, malformed email, mismatched passwords |
| Coupon testing | Eligible/ineligible accounts and controlled cart subtotals |
| Payment testing | **Sandbox** payment details only |

I should use disposable accounts, avoid real customer credentials, reset changed data where possible, and keep each test independent. For example, reusing an email after a successful registration could make the next test fail for the wrong reason.

## 6. My Key Takeaways

- Exploratory testing is **purposeful investigation**, not random clicking.
- A **charter + time box + notes** makes sessions focused and reviewable.
- Xray separates **test design** from **test execution and evidence**.
- Browser, device, and test data differences can reveal important defects.
- I must clearly distinguish **planned scenarios, actual observations, and confirmed bugs**.

### Final Reflection

Day 4 Intermediate helped me connect the test cases I designed in Day 3 with real-world exploratory testing and test management. My next practical work is to execute suitable tests against an assigned application and document both 45-minute session results accurately.

**Reference:** RoBenDevs QA Engineer Internship — 14-Day Foundation Programme, Day 4: Manual and Exploratory Testing.
