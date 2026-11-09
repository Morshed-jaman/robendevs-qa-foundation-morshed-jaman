# Day 2 — Advanced: My Understanding of Business Rules, Non-Functional Requirements, and Impact Analysis

**Name:** MD Morshed Jaman  
**Programme:** RoBenDevs QA Engineer Internship — 14-Day Foundation Programme  
**Topic:** Understanding Requirements and Testability  
**Level:** Advanced

## 1. What I Learned About Business Rules

I learned that **business rules define the conditions, restrictions, and logic that control how an application should behave**. A feature may work technically but still violate the expected business requirements.

As a QA engineer, I need to understand four important areas:

| Business Rule | My Understanding | Example |
|---|---|---|
| **Validation** | Defines which inputs are acceptable or invalid. | Product quantity must be greater than zero. |
| **Permissions** | Defines which actions different users are authorized to perform. | Customers cannot manage products through admin features. |
| **Calculations** | Defines how the system calculates values. | Applying discounts, taxes, and delivery charges. |
| **Workflow States** | Defines the possible states and allowed transitions. | Pending → Paid → Shipped → Delivered. |

### Example 1: Validation

Suppose a password must contain 8–20 characters.

I should consider testing:

- 7 characters — Reject
- 8 characters — Accept if other conditions are satisfied
- 20 characters — Accept if other conditions are satisfied
- 21 characters — Reject

This helped me understand why **boundary values** are important when verifying validation rules.

### Example 2: Permissions

Suppose an application has Customer and Admin roles.

Even if the Admin button is hidden from customers, I should consider whether a customer can access restricted pages or APIs directly.

I learned that **authentication identifies the user, while authorization determines what the user can access**.

### Example 3: Calculations

Suppose an order contains:

- Product price: BDT 1,000
- Discount: 10%
- Delivery charge: BDT 60

Assuming no tax and a discount applied only to the product price:

**Expected total = 1,000 − 100 + 60 = BDT 960**

As QA, I should verify the result using approved calculation rules and consider discount limits, rounding, tax, and multiple coupons.

### Example 4: Workflow States

An order may follow:

`Pending → Paid → Shipped → Delivered`

However, other states, such as Cancelled or Failed, may also exist.

If the approved requirement allows cancellation only before shipment, I should verify that cancellation is rejected once an order has been shipped.

**My takeaway:** Testing a feature is not only about checking whether an action works. I also need to verify whether the action is allowed under the correct business conditions.

## 2. Understanding Non-Functional Requirements (NFRs)

I learned that **functional requirements describe what the system does, while non-functional requirements describe how well the system performs or which quality constraints it must satisfy**.

For example:

- Functional requirement: Customers can search for products.
- Non-functional requirement: Product searches must meet an agreed response-time target.

I understood that vague requirements such as **"fast," "secure," or "user-friendly"** should be clarified into measurable or objectively verifiable criteria.

| Quality Area | Unclear Requirement | Example of a Testable Requirement |
|---|---|---|
| Performance | The application should be fast. | 95% of search API requests should complete within 2 seconds under an agreed workload of 100 concurrent users. |
| Security | The application should be secure. | Unauthenticated users must not access protected order information. |
| Usability | The system should be easy to use. | At least 90% of representative participants should complete a defined checkout task without assistance. |
| Accessibility | The application should be accessible. | Required functions should be operable using a keyboard according to the approved accessibility criteria. |

*These are illustrative targets, not confirmed RoBenDevs project requirements.*

### Example: Payment Security

Suppose a PRD states:

"Online payment must be secure."

Instead of assuming the meaning of "secure," I should ask:

- Are users required to authenticate before viewing their payment history?
- Can one user access another user's payment information?
- Are payment requests transmitted securely?
- How are expired sessions handled?

These questions help identify specific security requirements that can be verified.

**My takeaway:** As a QA engineer, I should request measurable performance targets and clearly defined security, usability, and accessibility expectations rather than making assumptions.

## 3. Understanding Impact Analysis

I learned that **impact analysis identifies which existing features, components, or business processes might be affected when a requirement or implementation changes**.

Even a small change may affect multiple connected functionalities.

### Example: Discount Rule Change

Suppose the client changes the first-order discount from **10% to 20%**.

Initially, it may seem that only the discount calculation needs updating.

However, I should also consider its possible impact on:

| Affected Area | What I Should Verify |
|---|---|
| Shopping Cart | Whether the updated discount is displayed correctly. |
| Checkout | Whether the final amount is calculated correctly. |
| Payment | Whether the charged amount matches the checkout total. |
| Invoice | Whether the invoice reflects the correct discount. |
| Refund | Whether the refund calculation follows the approved policy. |
| Eligibility | Whether the discount applies only to eligible customers. |

### Impact Analysis vs Regression Testing

I also learned the relationship between these concepts:

- **Impact Analysis:** Identifies which areas could be affected by a change.
- **Regression Testing:** Verifies that existing functionality still works correctly after the change.

For example, if a developer modifies the checkout calculation, I should first identify related features and then select appropriate regression tests.

**My takeaway:** I should not test only the modified feature. I need to understand its dependencies and consider whether the change could introduce defects elsewhere.

## 4. Connecting These Concepts to the QA Workflow

From my understanding of the RoBenDevs QA workflow, requirement analysis is an important starting point for preventing defects.

When the PM prepares the requirements, QA should examine business rules, identify unclear non-functional requirements, and consider the possible effects of changes.

Once the requirements are clarified and approved, they provide the basis for test design and expected results.

During development and testing, impact analysis helps determine which related features may need verification.

This helped me understand that **business rules, non-functional requirements, and impact analysis work together to improve test coverage and reduce quality risks**.

## 5. My Overall Learning

From today's Advanced-level topics, I learned how to think more deeply about requirements and their effects on the overall system.

I understood that **business rules** control validation, permissions, calculations, and workflow states. Therefore, I need to verify not only whether functionality works but also whether it follows the correct business conditions.

I also learned how to identify vague **non-functional requirements** and clarify them into measurable or objectively testable expectations.

Finally, **impact analysis** taught me that even a small requirement change may affect multiple features. Understanding these dependencies can help me select more effective regression tests.

**My main learning:** A good QA engineer should understand the business logic, question unclear quality expectations, and consider the wider impact of changes before deciding what and how to test.

## References

1. RoBenDevs QA Engineer Internship — 14-Day Foundation Programme, Day 2.
2. [ISTQB — Certified Tester Foundation Level](https://istqb.org/certifications/certified-tester-foundation-level-ctfl-v4-0/)
3. [Atlassian — Product Requirements](https://www.atlassian.com/agile/product-management/requirements)
4. [OWASP — Web Security Testing Guide](https://owasp.org/www-project-web-security-testing-guide/)
5. [W3C — Web Content Accessibility Guidelines (WCAG) 2.2](https://www.w3.org/TR/WCAG22/)

*All examples are hypothetical scenarios used to explain my understanding through reading different sources.