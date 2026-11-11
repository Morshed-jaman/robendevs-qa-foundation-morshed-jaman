# Day 4 — Advanced: My Understanding of Regression Strategy, Mobile Testing, and Testing Heuristics

**Programme:** RoBenDevs QA Engineer Internship — 14-Day Foundation Programme  
**Day:** 04  
**Level:** Advanced  
**Topic:** Risk-Based Regression, Mobile Application Testing, and Exploratory Testing Heuristics  
**Learning date:** 11 November 2026

> **Scope:** These are my learning notes with illustrative test scenarios. The mobile, regression, and exploratory examples below are **planned test ideas**, not executed results. My Jira/Xray practice includes Test **QP-3** and Test Execution **QP-4**, but REG-01 has not been verified against an application with confirmed matching requirements.

## 1. What I Learned at the Advanced Level

After learning manual test execution and exploratory testing, I focused on **choosing the most valuable tests when time is limited**, **handling real mobile-device conditions**, and **using testing heuristics to uncover unexpected risks**.

| Topic | My understanding |
| --- | --- |
| **Regression strategy** | Prioritize existing functions that may be affected by a change, using risk and impact. |
| **Mobile application testing** | Check installation, permissions, interruptions, backgrounding, and changing connectivity. |
| **Testing heuristics** | Use practical questions and patterns to guide exploratory testing beyond scripted cases. |

## 2. Risk-Based Regression Testing

**Regression testing** checks whether a software change has accidentally broken something that worked before. A **risk-based regression strategy** helps me choose what to test first when I cannot run the entire suite.

I consider:

- **Change impact:** Which modules or dependencies were modified?
- **Business impact:** Would a failure cause incorrect charges, data loss, or blocked orders?
- **Likelihood:** Has the area been fragile or closely coupled to other features?
- **Usage:** Is this a critical or frequently used customer journey?
- **Available time:** Which checks offer the most useful coverage before release?

### Example — A Checkout Coupon Fix

Suppose a developer changes the rule that determines whether a customer receives a 10% discount. In my Day 3 exercise, the discount requires a **valid coupon**, an **eligible user**, and a subtotal of at least **৳1,000**.

| Priority | Regression scenario | Why I would test it |
| --- | --- | --- |
| **High** | Eligible user + valid coupon + ৳1,000 subtotal | Confirm discount still applies at the exact threshold. |
| **High** | Ineligible user + valid coupon | Ensure the fix does not give unauthorized discounts. |
| **High** | Recalculate final payable amount | Prevent incorrect customer charges. |
| **High** | Checkout and sandbox payment | Ensure the total and order status remain consistent. |
| **Medium** | Remove and reapply coupon | Verify cart changes update totals correctly. |
| **Lower** | Product-description styling | Lower direct impact from a coupon-logic change. |

**My approach:** First review the change and related requirements; then run high-risk functional and integration checks, followed by relevant broader regression tests. The exact selection depends on the actual product and release risk.

**Key difference:** **Retesting** checks the specific defect after a fix. **Regression testing** checks whether the fix affected other working functionality.

## 3. Mobile Application Testing Basics

Mobile apps can be interrupted by calls, notifications, app switching, permission changes, and unstable networks. I need to test more than the normal happy path.

| Area | Example test scenario | What I would verify |
| --- | --- | --- |
| **Install and update** | Upgrade a banking app from v1 to v2 | App opens and existing transactions remain available as required. |
| **Permissions** | Deny location access in a delivery app | App handles denial gracefully; permission-dependent features explain the limitation. |
| **Incoming call** | Receive a call while payment is processing | Returning to the app shows the correct transaction status. |
| **Background/foreground** | Switch from registration to another app and back | Form state follows the product's rules; no unexpected submission. |
| **Offline/reconnection** | Disconnect internet after tapping Pay | No false success; retry does not create duplicate charges. |
| **Network switching** | Change from Wi-Fi to mobile data during an upload | Upload succeeds, resumes, or fails safely according to requirements. |

### Example — Payment Interrupted by an Incoming Call

**Given** a customer is using a sandbox payment flow  
**When** a call arrives and the application moves to the background  
**And** the customer returns to the app  
**Then** the app should show the **verified final payment status** and should not trigger an unintended second charge.

**What I learned:** A mobile app must recover from interruptions without misleading the user or corrupting important data. I should test these behaviours on suitable devices and supported operating-system versions.

## 4. Testing Heuristics

A **testing heuristic** is a useful thinking guideline that suggests situations worth investigating. It is **not a guaranteed rule** or a substitute for approved requirements.

When testing a registration or checkout form, I ask:

| Heuristic question | Example scenario | Possible risk |
| --- | --- | --- |
| **What if data is empty?** | Submit registration without a Name | Missing validation. |
| **What if data is extreme?** | Enter 1,000 characters in Name | Truncation, crash, or inconsistent limits. |
| **What if an action repeats?** | Double-click Register or Pay | Duplicate account, order, or charge. |
| **What if time runs out?** | Session expires during checkout | Unauthorized action or confusing state. |
| **What if a dependency fails?** | Disconnect internet during submission | Uncertain result or unsafe retry. |
| **What if two places change data?** | Edit cart in Tab A while paying in Tab B | Stale total or conflicting state. |

### Example — Turning a Heuristic into a Test Case

**Heuristic:** What if the user submits the same action twice?

**Test idea:** Rapidly click **Pay** twice with one valid cart and a sandbox payment method.

**Expected (illustrative):** No unintended duplicate charge or order is created. The final status reflects the payment provider's confirmed result.

**Evidence to collect if executed:** Sanitized Network requests, order records, sandbox transaction identifiers, and screenshots.

**What I learned:** A heuristic generates useful questions. I can then turn a question into a repeatable test case with preconditions, steps, expected results, and evidence.

## 5. How These Topics Connect to Day 4

- **Manual testing:** Execute defined steps and compare actual results with approved expectations.
- **Exploratory testing:** Investigate a feature while learning and adapting test ideas.
- **Regression strategy:** Prioritize retesting of existing behaviour after changes.
- **Mobile testing:** Consider interruptions and device-specific behaviour.
- **Heuristics:** Generate additional scenarios, particularly around boundaries, time, failure, and concurrency.

### My Planned Exploratory Sessions

**Session 1 — Registration (45 minutes):** Explore invalid inputs, Unicode names, duplicate submissions, and session-related behaviour.  
**Session 2 — Checkout (45 minutes):** Explore coupon boundaries, calculation consistency, duplicate Pay actions, refresh, and connectivity interruptions.

For each session I would record a **charter, start/end time, observations, questions, screenshots, and any reproducible defects**. These sessions are **not claimed as completed** in this note.

## 6. My Key Takeaways

1. **Risk-based regression** helps me prioritize financially important and change-affected features.
2. **Mobile testing** requires checking interruptions, permissions, app lifecycle, and connectivity changes.
3. **Heuristics** help me discover meaningful test ideas beyond the normal user journey.
4. **Evidence matters:** A designed scenario is not a PASS. I must execute it on the intended application and record what actually happened.

### Final Reflection

Day 4 Advanced helped me think more strategically about QA. I now understand how to prioritize regression coverage, anticipate mobile-specific failures, and use heuristics to guide focused exploratory sessions. These techniques will support my next practical steps: writing the Day 4 test plan, executing applicable Day 3 cases, and documenting two exploratory sessions with real observations.

## Reference

RoBenDevs QA Engineer Internship — **14-Day Foundation Programme**, Day 4: *Manual and Exploratory Testing* (Advanced topics and practical assignment).
