# Day 3 — Intermediate: Test Design Techniques and Edge Case Analysis

**Programme:** RoBenDevs QA Engineer Internship — 14-Day Foundation Programme  
**Level:** Intermediate  
**Topic:** Decision Tables, State Transitions, Pairwise Testing, Error Guessing, and Edge Cases

## 1. What I Learned About Intermediate Test Design

After learning the basic testing techniques, I explored how QA engineers design more effective test cases when an application contains multiple business rules, workflows, input combinations, and unexpected user actions.

I learned that testing only valid and invalid inputs is not enough. A good QA engineer also needs to understand how different conditions interact, how the system changes between states, and how unusual scenarios may reveal hidden defects.

The five techniques I studied are:

| Technique | Purpose |
|---|---|
| **Decision Table Testing** | Verify combinations of business conditions and their expected results |
| **State Transition Testing** | Verify valid and invalid changes between system states |
| **Pairwise Testing** | Reduce test combinations while covering every pair of input values |
| **Error Guessing** | Identify likely defects based on experience and common failure patterns |
| **Edge Case Analysis** | Test unusual, extreme, or unexpected inputs and behaviours |

---

## 2. Decision Table Testing

### My Understanding

Decision Table Testing is a black-box testing technique used when an application's output depends on multiple conditions.

Instead of testing each condition separately, I can create a table containing combinations of conditions and their expected outcomes.

This technique is particularly useful for business rules involving:

- Discount eligibility
- Login permissions
- Loan approval
- Shipping charges
- Payment restrictions

### Practical Example: Discount Coupon

Suppose an e-commerce application applies a 10% discount only when:

1. The cart amount is at least ৳1,000.
2. The coupon is valid.
3. The customer is eligible.

I can represent the conditions using a decision table.

| Test | Cart ≥ ৳1,000 | Coupon valid | Eligible user | Expected result |
|---|---|---|---|---|
| TC-01 | Yes | Yes | Yes | Discount applied |
| TC-02 | Yes | Yes | No | Discount rejected |
| TC-03 | Yes | No | Yes | Discount rejected |
| TC-04 | Yes | No | No | Discount rejected |
| TC-05 | No | Yes | Yes | Discount rejected |
| TC-06 | No | Yes | No | Discount rejected |
| TC-07 | No | No | Yes | Discount rejected |
| TC-08 | No | No | No | Discount rejected |

Each condition has two possible values: Yes or No.

**Total combinations = 2 × 2 × 2 = 8**

### Example Test Scenario

**Given** a customer has a cart total of ৳1,500  
**And** the customer has a valid coupon  
**And** the customer is not eligible for the discount  
**When** the customer applies the coupon  
**Then** the discount should not be applied.

### What I Learned

Decision Table Testing helps me systematically verify business rules. It reduces the chance of overlooking a combination that might cause incorrect application behaviour.

---

## 3. State Transition Testing

### My Understanding

State Transition Testing verifies how an application moves from one state to another based on user actions or system events.

A state represents the current condition of an object or process.

For example, an order might have the following states:

**Pending → Paid → Shipped → Delivered**

Some transitions may be valid, while others should be rejected.

### Practical Example: Order Management

Assume an application follows these business rules:

- A pending order can be paid or cancelled.
- A paid order can be shipped or cancelled.
- A shipped order can be delivered.
- A shipped order cannot be cancelled.
- A delivered order cannot return to pending.

### State Transition Table

| Test | Current state | Action | Expected result |
|---|---|---|---|
| TC-01 | Pending | Complete payment | Paid |
| TC-02 | Pending | Cancel order | Cancelled |
| TC-03 | Paid | Ship order | Shipped |
| TC-04 | Paid | Cancel order | Cancelled |
| TC-05 | Shipped | Mark delivered | Delivered |
| TC-06 | Shipped | Cancel order | Rejected; remain Shipped |
| TC-07 | Delivered | Return to Pending | Rejected; remain Delivered |

### Example Test Scenario

**Given** an order has already been shipped  
**When** the customer attempts to cancel the order  
**Then** the system should reject the cancellation request  
**And** the order should remain in the Shipped state.

### What I Learned

State Transition Testing is important for features involving workflows, including order processing, payment processing, account activation, and password resets.

I learned to test both allowed and prohibited transitions rather than checking only the normal workflow.

---

## 4. Pairwise Testing

### My Understanding

Pairwise Testing is a test design technique used when a system contains multiple configuration parameters.

Testing every possible combination can require many test cases. Pairwise testing reduces the number of cases while ensuring that every pair of parameter values appears together in at least one test.

### Practical Example: Checkout Compatibility

Suppose an e-commerce application supports:

**Browsers:** Chrome, Firefox, Edge  
**Devices:** Desktop, Mobile  
**Payment Methods:** Card, Wallet

The number of combinations required for exhaustive testing is:

**3 × 2 × 2 = 12 test cases**

Using Pairwise Testing, I can cover every pair with six carefully selected combinations.

| Test | Browser | Device | Payment method |
|---|---|---|---|
| TC-01 | Chrome | Desktop | Card |
| TC-02 | Chrome | Mobile | Wallet |
| TC-03 | Firefox | Desktop | Wallet |
| TC-04 | Firefox | Mobile | Card |
| TC-05 | Edge | Desktop | Card |
| TC-06 | Edge | Mobile | Wallet |

### Why It Is Useful

This test set covers:

- Every browser with every device type.
- Every browser with every payment method.
- Every device type with every payment method.

However, pairwise testing does not test every possible three-way combination.

### What I Learned

Pairwise Testing helps optimize testing effort, especially in compatibility and configuration testing.

I also learned that critical or high-risk combinations may need additional test cases even when pairwise coverage is complete.

---

## 5. Error Guessing

### My Understanding

Error Guessing is an experience-based testing technique where I identify potential problems based on previous defects, common programming mistakes, application behaviour, and knowledge of how users interact with software.

Unlike Decision Table Testing, it does not follow a fixed mathematical method.

### Practical Example: Online Payment

Consider a checkout page where a customer clicks the Pay button.

A normal test verifies that the payment succeeds.

Using Error Guessing, I would also test unusual situations.

| Scenario | Possible defect |
|---|---|
| Double-click the Pay button | Duplicate payment |
| Refresh during payment | Incorrect transaction status |
| Disconnect internet during payment | Inconsistent payment result |
| Press Back after completing payment | Duplicate transaction or order |
| Open checkout in two tabs | Conflicting cart or payment state |
| Let the session expire during checkout | Authentication or transaction errors |
| Submit an invalid payment amount | Incorrect amount validation |

### Example Test Scenario

**Given** a customer is on the payment page  
**When** the customer rapidly clicks the Pay button twice  
**Then** the system should prevent duplicate charges  
**And** only one payment should be processed for the intended transaction.

### What I Learned

Error Guessing encourages me to think from both a technical and user-behaviour perspective.

It is useful for uncovering defects that may not appear during standard positive and negative testing.

---

## 6. Edge Case Analysis

### My Understanding

Edge Case Analysis focuses on unusual or extreme inputs and conditions that may expose weaknesses in application validation or behaviour.

I learned that many defects occur when users provide unexpected values rather than normal input.

### Practical Example: Registration Form

Suppose a registration form contains a Name field with a maximum length of 20 characters.

I would consider the following scenarios.

| Test | Input condition | What I need to verify |
|---|---|---|
| TC-01 | Empty string | Required-field validation |
| TC-02 | Null value through API | Null handling |
| TC-03 | One character | Minimum input behaviour |
| TC-04 | Exactly 20 characters | Maximum allowed boundary |
| TC-05 | 21 characters | Maximum-length rejection |
| TC-06 | Leading spaces | Trimming or validation |
| TC-07 | Trailing spaces | Input handling |
| TC-08 | Special characters | Allowed-character rules |
| TC-09 | Emoji | Unicode support |
| TC-10 | Copy and paste | Consistent validation |

### Important Difference: Empty, Null, and Missing

An empty string means a field exists but contains no characters:

`{"name": ""}`

A null value means the field explicitly has no value:

`{"name": null}`

A missing field means the property is absent from the request:

`{}`

These inputs may produce different responses in an API, depending on the requirements.

### What I Learned

I should not assume that the application handles all unusual inputs correctly.

I need to understand the intended validation rules before deciding whether a particular response is correct or defective.

---

## 7. Combining Intermediate Testing Techniques

I learned that different techniques address different types of testing problems.

For example, consider an e-commerce checkout application.

| Technique | How I would apply it |
|---|---|
| Decision Table | Verify combinations of coupon validity, order amount, and eligibility |
| State Transition | Verify Pending → Paid → Shipped and invalid transitions |
| Pairwise | Test combinations of browser, device, and payment method |
| Error Guessing | Test repeated clicks, network interruption, and browser refresh |
| Edge Case Analysis | Test zero, negative, decimal, unusually large, and missing values |

Combining these approaches gives broader coverage than relying on a single technique.

## 8. How I Would Apply This in a QA Project

When assigned a new feature, I would follow this approach:

1. Review the user story and acceptance criteria.
2. Identify business conditions that may require decision tables.
3. Identify workflow states and allowed transitions.
4. Find configuration combinations suitable for pairwise testing.
5. Brainstorm likely failure scenarios using error guessing.
6. Prepare an edge case checklist based on input constraints.
7. Write test cases with clear expected results.
8. Execute the tests and record actual results.
9. Report defects with reproducible steps and supporting evidence.

This approach helps me create structured and risk-aware test coverage.

---

## 9. My Key Takeaways

From the Intermediate level of Day 3, I learned:

- **Decision Table Testing:** How to test combinations of business conditions systematically.
- **State Transition Testing:** How to verify allowed and prohibited changes in an application's workflow.
- **Pairwise Testing:** How to reduce the number of configuration tests while maintaining pairwise coverage.
- **Error Guessing:** How to anticipate likely defects based on common failure patterns.
- **Edge Case Analysis:** How to test unusual inputs and unexpected user actions.

### Final Reflection

I now understand that effective test design is not about writing as many test cases as possible. It is about selecting meaningful scenarios that provide useful coverage of application requirements and risks.

These techniques will help me prepare better test cases, identify potential defects earlier, and improve my approach to real-world QA testing.