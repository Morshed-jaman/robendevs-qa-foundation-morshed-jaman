# Day 3 — Advanced: Data, Time, and User Behaviour Edge Case Testing

**Programme:** RoBenDevs QA Engineer Internship — 14-Day Foundation Programme  
**Level:** Advanced  
**Topic:** Advanced Edge Case Testing and Real-World QA Scenarios

## 1. What I Learned About Advanced Edge Case Testing

After completing the Basic and Intermediate test design topics, I studied less-obvious situations that can expose defects even when a feature works in its normal workflow.

An **edge case** is an unusual, extreme, or less-common condition. It is not automatically a bug: a defect exists when the application's actual behaviour violates an agreed requirement or expected behaviour.

| Category | Topics covered |
|---|---|
| **Data edge cases** | Very large numbers, decimals, rounding, currencies, unusual names and addresses |
| **Time edge cases** | Time zones, daylight saving changes, leap years, month-end dates, expired sessions |
| **User behaviour edge cases** | Double clicks, Back button, refreshing mid-action, multiple tabs, slow networks |

## 2. Data Edge Cases

### 2.1 Very Large Numbers

A shopping application may work with a quantity of \`5\` but fail when someone submits \`999999999999999\`. Possible risks are numeric overflow, lost precision, unexpected database values, calculation errors, and crashes.

**Given** I am on checkout  
**When** I enter a quantity larger than the supported limit  
**Then** the system should reject or otherwise safely handle it according to the requirements  
**And** it should not calculate an incorrect total or crash.

**What I learned:** Testing values beyond realistic input helps uncover weaknesses in limits and validation.

### 2.2 Decimal Values and Rounding

For example, two items cost ৳10.10 and ৳20.20. The expected mathematical total is **৳30.30**. Binary floating-point precision, rounding at different stages, or tax/discount calculation order can produce incorrect totals.

I should verify the required rounding rule, calculation order, display precision, and final charged amount rather than assuming every currency always has two decimal places.

### 2.3 Currency Handling

An application that supports BDT, USD, EUR, or other currencies should use the correct symbol, conversion rule, minor-unit precision, and charge currency.

**QA checks:** The selected currency, displayed total, confirmation screen, and actual transaction should agree. Currency conversion must follow the business rules and the configured rates.

### 2.4 Unusual Names and Addresses

| Input | Example | Possible issue |
|---|---|---|
| Apostrophe | O'Connor | Incorrect filtering or saving |
| Hyphen | Anne-Marie | Incorrect character rules |
| Accented letters | José | Unicode/encoding problems |
| Bengali script | মোহাম্মদ রহিম | Unsupported text handling |
| Address symbols | House 12/A, Road #5 | Incorrect character restrictions |
| Very long address | Longer than the allowed maximum | Truncation or missing validation |

**What I learned:** Unusual inputs can still be legitimate. I must validate them against documented rules, not personal assumptions.

## 3. Time Edge Cases

### 3.1 Time Zones

The same event can appear at different local times. For example, **09:00 UTC = 15:00 in Bangladesh (UTC+06:00)**. I should check storage, display, date boundaries, event ordering, and timezone conversion.

**Given** an event is stored for 09:00 UTC  
**When** a user views it in Bangladesh and local-time display is required  
**Then** 15:00 should be displayed for that date.

### 3.2 Daylight Saving Time (DST)

In some regions the clock jumps forward, so a local time may not exist, or backward, so a local time may occur twice. A booking system should explicitly handle these cases according to its rules.

**What I learned:** Correct time-zone testing requires knowing the region and the date, not just adding a fixed number of hours.

### 3.3 Leap Years

| Input date | Calendar validity |
|---|---|
| 29 February 2028 | Valid |
| 29 February 2027 | Invalid |
| 28 February 2027 | Valid |

A date picker and API should handle these correctly, subject to any additional business restrictions such as a date-of-birth range.

### 3.4 End of Month

A subscription created on 31 January might renew at the end of February, on 1 March, or under another approved rule. I should verify the agreed rule for months of different lengths rather than invent the expected result.

### 3.5 Expired Sessions

A logged-in user may leave checkout idle until the session expires.

**Given** an authenticated session has expired  
**When** the user tries to perform a protected action  
**Then** the system should enforce authentication requirements  
**And** avoid unauthorized changes or payments.

**What I learned:** Session expiry is a time-dependent functional and security risk.

## 4. User Behaviour Edge Cases

### 4.1 Double Clicks

A customer may click **Pay** twice very quickly. The system should prevent duplicate charges. Disabling the button helps the UI, but a payment backend should also handle retries and duplicated requests safely.

**Given** a valid checkout is ready  
**When** I rapidly click Pay twice  
**Then** no unintended second charge or order should be created.

### 4.2 Browser Back Button

A user may complete checkout and press Back, returning to a previous screen. I should verify that navigation cannot accidentally resubmit payment or display a misleading transaction state.

### 4.3 Refresh Mid-Action

Refreshing during registration, file upload, or payment can interrupt the UI. I should check that completed actions are not duplicated, unfinished actions are reported accurately, and system data remains consistent.

### 4.4 Multiple Tabs

A customer can update the cart in Tab A and submit checkout in Tab B, or log out in one tab while trying a protected action in another.

**QA checks:** Session authorization, synchronization, conflicting updates, and safe handling of repeated submissions.

### 4.5 Slow Networks

Using **Browser DevTools → Network → Throttling**, I can simulate slower connections.

I should verify loading feedback, timeout handling, retry behaviour, protection against duplicate submissions, and consistency between UI and server results.

**What I learned:** Applications should not rely on a fast connection or perfectly sequential user actions.

## 5. Advanced Edge Case Checklist — 25 Scenarios

These are **proposed tests**, not executed results. Actual expected results depend on approved application requirements.

| ID | Category | Scenario | Verification focus |
|---|---|---|---|
| EC-01 | Data | Extremely large quantity | Numeric limits and stability |
| EC-02 | Data | Negative quantity | Invalid-input handling |
| EC-03 | Data | Decimal quantity | Allowed quantity rules |
| EC-04 | Data | Decimal item prices | Calculation precision |
| EC-05 | Data | Percentage discount | Correct rounding |
| EC-06 | Data | Switch checkout currency | Currency consistency |
| EC-07 | Data | Name containing apostrophe | Character handling |
| EC-08 | Data | Name in Bengali | Unicode support |
| EC-09 | Data | Very long delivery address | Length validation |
| EC-10 | Time | 29 February in leap year | Valid date handling |
| EC-11 | Time | 29 February in non-leap year | Invalid date rejection |
| EC-12 | Time | Renewal from 31 January | Month-end rule |
| EC-13 | Time | View event in different time zone | Correct conversion |
| EC-14 | Time | Booking during DST change | Missing/ambiguous local time |
| EC-15 | Time | Submit after session expiry | Authentication enforcement |
| EC-16 | Behaviour | Double-click Register | No unintended duplicate account |
| EC-17 | Behaviour | Double-click Pay | No unintended duplicate charge |
| EC-18 | Behaviour | Refresh during registration | Submission consistency |
| EC-19 | Behaviour | Refresh during payment | Accurate transaction recovery |
| EC-20 | Behaviour | Press Back after payment | No duplicate order |
| EC-21 | Behaviour | Edit cart from two tabs | State consistency |
| EC-22 | Behaviour | Log out from another tab | Protected action rejected |
| EC-23 | Behaviour | Submit on slow network | Loading and timeout handling |
| EC-24 | Behaviour | Disconnect during checkout | Error/recovery handling |
| EC-25 | Behaviour | Retry timed-out payment | Idempotency and transaction status |

## 6. Example Structured Test Case

**ID:** TC-ADV-01  
**Title:** Prevent duplicate payment after rapid clicks  
**Module:** Checkout and Payment  
**Preconditions:** Test user is authenticated, has an eligible cart, and can use a sandbox payment method.

**Steps:**
1. Open checkout with a valid cart.
2. Verify the displayed total.
3. Rapidly click Pay twice.
4. Inspect requests in DevTools Network.
5. Inspect the order record and sandbox payment transaction records.

**Expected:** Only the intended single charge/order is created; additional submissions are handled safely.  
**Actual:** Not executed.  
**Status:** Not Run.  
**Evidence to collect:** Network requests, confirmation page, order status, and transaction IDs (redacted).

## 7. How I Would Apply This in a QA Project

1. Review the user story, business rules, and acceptance criteria.
2. Identify numeric, text, currency, date, and session constraints.
3. List repeated, interrupted, and cross-tab user actions.
4. Prioritize high-risk scenarios involving financial loss, unauthorized access, or data inconsistency.
5. Write test cases with clear steps and measurable expected outcomes.
6. Execute using controlled test data and collect relevant evidence.
7. Record actual results and report reproducible defects in Jira.

## 8. My Key Takeaways

- **Data:** Extreme values, precision, currency and international text need purposeful tests.
- **Time:** Time zones, DST, leap years, month ends and session expiry can change expected behaviour.
- **User behaviour:** Repeated clicks, Back, refresh, multiple tabs and slow networks reveal workflow risks.
- **Evidence:** A proposed scenario is not a passed test. Record expected results separately from actual observations.

### Final Reflection

I learned that testing only the normal user journey is not enough. Users may enter unusual values, face network interruptions, or take unexpected actions. Advanced edge case testing helps me identify risks early and design stronger, practical QA coverage.

**Day 3 learning:** Basic, Intermediate, and Advanced notes completed. The hands-on registration and checkout assessment is documented separately.