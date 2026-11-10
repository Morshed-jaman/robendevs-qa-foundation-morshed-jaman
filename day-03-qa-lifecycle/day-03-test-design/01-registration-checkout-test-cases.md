# Day 3 Assessment — Registration and Checkout Test Cases

**Techniques:** Equivalence Partitioning (EP), Boundary Value Analysis (BVA), Positive/Negative Testing  
**Type:** Black-box functional test design  
**Status:** All tests **NOT RUN**; not actual execution results  
**Reference:** [Exercise requirements and assumptions](README.md)

## 1. Test case structure

A test case specifies **ID, title/scenario, preconditions, steps, test data, expected result, and execution status**.

### Common registration preconditions and steps (REG)

**Preconditions:** Registration form is available. Use a fresh, unused email for each accepted submission. All other fields not under test contain valid values.

1. Open the registration form.
2. Set up a unique valid email, matching valid password and confirmation, and a valid name unless one of these is the field under test.
3. Replace the selected field(s) with the test data shown in the table.
4. Click **Register**.
5. Verify validation text, whether the form submits, and whether an account is created.

**Default valid data:** Name = "Rahim Ahmed"; Email = unique generated address; Password = "TestPass123"; Confirm Password = same. The name example uses ASCII only; Unicode names are tested separately.

**Execution record for every case:** Actual Result = _Not executed_; Status = **NOT RUN**.

## 2. Registration — Equivalence Partitioning

| Field | Partition | Representative value | Expected behaviour |
| --- | --- | --- | --- |
| Name | Invalid: empty | empty string | Required error |
| Name | Invalid: short | 1 character | Reject |
| Name | Valid length | 12 characters | Accept if all other rules pass |
| Name | Invalid: long | 51 characters | Reject |
| Email | Invalid: empty | empty string | Required error |
| Email | Invalid syntax | "not-an-email" | Reject |
| Email | Valid unique | unique address ending in example.com | Accept if other fields valid |
| Email | Valid but duplicate | existing registered test address | Reject |
| Password | Invalid: empty | empty string | Required error |
| Password | Invalid: short | 7 characters | Reject |
| Password | Valid | 12 characters | Accept if other rules pass |
| Password | Invalid: long | 21 characters | Reject |
| Confirm Password | Invalid: empty | empty string | Required error |
| Confirm Password | Mismatch | "WrongPass123" | Reject |
| Confirm Password | Match | "TestPass123" | Accept if other rules pass |

### Registration BVA: exact numeric boundaries

- **Name minimum 2:** test **1, 2, 3** characters.
- **Name maximum 50:** test **49, 50, 51** characters.
- **Password minimum 8:** test **7, 8, 9** characters.
- **Password maximum 20:** test **19, 20, 21** characters.

### Designed registration test cases (18)

All REG cases follow the **common preconditions and steps** above, with the following specific input replacing the default field.

| ID | Title / test data | Technique | Expected result |
| --- | --- | --- | --- |
| REG-01 | Submit with Name empty | EP / Negative | Required validation; no account created |
| REG-02 | Name = 1 character | BVA | Rejected, below min 2 |
| REG-03 | Name = 2 characters | BVA | Accepted; one account created if other fields valid |
| REG-04 | Name = 3 characters | BVA | Accepted; one account created |
| REG-05 | Name = 49 characters | BVA | Accepted; one account created |
| REG-06 | Name = 50 characters | BVA | Accepted; one account created |
| REG-07 | Name = 51 characters | BVA | Rejected, above max 50 |
| REG-08 | Password and matching confirmation = 7 characters | BVA | Rejected, below min 8 |
| REG-09 | Password and matching confirmation = 8 characters | BVA | Accepted if other fields valid |
| REG-10 | Password and matching confirmation = 9 characters | BVA | Accepted if other fields valid |
| REG-11 | Password and matching confirmation = 19 characters | BVA | Accepted if other fields valid |
| REG-12 | Password and matching confirmation = 20 characters | BVA | Accepted if other fields valid |
| REG-13 | Password and matching confirmation = 21 characters | BVA | Rejected, above max 20 |
| REG-14 | Email empty | EP / Negative | Required validation; no account created |
| REG-15 | Email = "not-an-email" | EP / Negative | Syntax validation; no account created |
| REG-16 | Email already registered in test environment | EP / Negative | Duplicate email rejected; original account unchanged |
| REG-17 | Confirm Password differs from Password | EP / Negative | Mismatch validation; no account created |
| REG-18 | All valid fields, unique email and matching password | EP / Positive | Exactly one account created and success shown |

**Setup note:** Each successful registration must use a new disposable email. Otherwise duplicate-email validation may incorrectly affect a boundary test.

### Full example — REG-03

**Title:** Accept minimum permitted two-character name  
**Preconditions:** Registration form available; unused email generated  
**Steps:** (1) Open Register, (2) fill valid email and matching valid password, (3) type name "AB", (4) submit, (5) inspect result.  
**Test data:** Name "AB" (2 characters), other required fields valid.  
**Expected:** Name satisfies the assumed inclusive 2-character minimum; registration succeeds and creates one account.  
**Actual:** Not executed. **Status:** NOT RUN.

## 3. Checkout — Equivalence Partitioning

| Input | Partition | Representative | Expected |
| --- | --- | --- | --- |
| Quantity | Below min | 0 | Reject |
| Quantity | Valid integer | 5 | Accept |
| Quantity | Above max | 11 | Reject |
| Quantity | Invalid negative | -1 | Reject |
| Quantity | Invalid non-integer | 1.5 | Reject |
| Discount subtotal | Below threshold | ৳999.99 | No coupon discount |
| Discount subtotal | At threshold | ৳1,000.00 | Coupon discount if all conditions satisfied |
| Discount subtotal | Above threshold | ৳1,000.01 | Coupon discount if all conditions satisfied |
| Coupon | Invalid/expired | "EXPIRED" test coupon | No discount |
| Coupon | Valid | configured valid coupon | Depends on subtotal and eligibility |
| User | Not eligible | configured ineligible account | No discount |
| User | Eligible | configured eligible account | Depends on subtotal and coupon |

### Checkout BVA: exact numeric boundaries

- **Quantity minimum 1:** test **0, 1, 2**.
- **Quantity maximum 10:** test **9, 10, 11**.
- **Coupon threshold ৳1,000.00:** test **৳999.99, ৳1,000.00, ৳1,000.01**.

### Common checkout preconditions and steps (CKO)

**Preconditions:** Registered test user is logged in, cart/test items are available, and sandbox payment setup is configured. For coupon tests, create cart fixtures with the exact subtotal given.

1. Open the cart and load the required fixture.
2. Set the test quantity or coupon/user conditions shown in the table.
3. Attempt to proceed to checkout or apply coupon.
4. If a payment case, complete only with the sandbox payment provider.
5. Compare the displayed total and server order/payment state with the expected result.

**Execution record for every case:** Actual Result = _Not executed_; Status = **NOT RUN**.

### Designed checkout test cases (24)

| ID | Title / test input | Technique | Expected result |
| --- | --- | --- | --- |
| CKO-01 | Quantity = 0 | BVA | Rejected; no checkout with quantity below 1 |
| CKO-02 | Quantity = 1; unit price ৳500 | BVA | Accepted; item subtotal ৳500 |
| CKO-03 | Quantity = 2; unit price ৳500 | BVA | Accepted; item subtotal ৳1,000 |
| CKO-04 | Quantity = 9; unit price ৳500 | BVA | Accepted; item subtotal ৳4,500 |
| CKO-05 | Quantity = 10; unit price ৳500 | BVA | Accepted; item subtotal ৳5,000 |
| CKO-06 | Quantity = 11 | BVA | Rejected; exceeds max 10 |
| CKO-07 | Quantity = -1 | EP / Negative | Rejected; negative input |
| CKO-08 | Quantity = 1.5 | EP / Negative | Rejected; requires whole number |
| CKO-09 | Eligible user + valid coupon + subtotal ৳999.99 | BVA | Discount not applied; below threshold |
| CKO-10 | Eligible user + valid coupon + subtotal ৳1,000.00 | BVA | 10% discount = ৳100.00; sample payable ৳900.00 |
| CKO-11 | Eligible user + valid coupon + subtotal ৳1,000.01 | BVA | 10% discount rounded = ৳100.00; sample payable ৳900.01 |
| CKO-12 | Eligible user + valid coupon + subtotal ≥ ৳1,000 | Decision / Positive | Discount applied |
| CKO-13 | Eligible user + invalid coupon + subtotal ≥ ৳1,000 | Decision / Negative | Discount not applied |
| CKO-14 | Ineligible user + valid coupon + subtotal ≥ ৳1,000 | Decision / Negative | Discount not applied |
| CKO-15 | Sandbox payment succeeds | State / Positive | Exactly one Paid order created |
| CKO-16 | Sandbox payment rejected by provider | State / Negative | Correct failure state; not marked Paid |
| CKO-17 | Retry after payment timeout | Behaviour | Final payment state reconciled; no unintended duplicate charge |
| CKO-18 | Double-click Pay | Behaviour | No unintended duplicate charges/orders |
| CKO-19 | Refresh during payment | Behaviour | No false success or duplicate payment |
| CKO-20 | Browser Back after payment success | Behaviour | No unintended new order/payment |
| CKO-21 | Session expires before Pay | Time | Protected payment action rejected until reauthentication |
| CKO-22 | Apply slow network throttling during checkout | Network | Correct loading/timeout feedback; consistent final status |
| CKO-23 | Update cart in Tab A while checking out in Tab B | Concurrency | Order charges server-validated correct total |
| CKO-24 | Two ৳500 items with eligible valid coupon | Positive / Calculation | Subtotal ৳1,000, discount ৳100, payable ৳900 (fees/tax excluded) |

**Calculation note:** In this illustrative exercise BDT amounts round to two decimals using **half-up** rounding at the final monetary rounding step, and tax/shipping are excluded. CKO-11 therefore rounds the discount from ৳100.001 to ৳100.00.

### Full example — CKO-10

**Title:** Apply discount exactly at ৳1,000 eligibility boundary  
**Preconditions:** Authenticated eligible test user; valid coupon; cart fixture subtotal ৳1,000.00.  
**Steps:** (1) Open checkout, (2) verify fixture subtotal, (3) enter valid coupon, (4) apply coupon, (5) inspect discount and payable total.  
**Test data:** Subtotal ৳1,000.00; valid coupon; eligible user.  
**Expected:** Coupon applies; discount ৳100.00; final sample total ৳900.00 without tax, shipping, or fees.  
**Actual:** Not executed. **Status:** NOT RUN.

## 4. Coverage summary

| Area | Count |
| --- | ---: |
| Registration cases | 18 |
| Checkout cases | 24 |
| **Total designed** | **42** |
| Executed | 0 |
| Passed / Failed | Not evaluated |

The [decision table and state diagram](02-decision-table-state-transition.md) and [30 edge cases](03-edge-case-checklist.md) complete the remaining required techniques. No execution status is claimed.
