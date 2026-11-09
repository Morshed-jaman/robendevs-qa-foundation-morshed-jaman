# Day 2 — Intermediate: My Understanding of Requirement Review and Traceability

**Name:** MD Morshed Jaman  
**Programme:** RoBenDevs QA Engineer Internship — 14-Day Foundation Programme  
**Topic:** Understanding Requirements and Testability  
**Level:** Intermediate

## 1. What I Learned About Requirement Review

I learned that requirement review is not just about reading the PRD. As a QA engineer, I need to **critically analyze requirements** to identify gaps, contradictions, missing system states, and undefined business rules before development begins.

I understood four common requirement problems:

| Problem | My Understanding | Example |
|---|---|---|
| **Requirement Gap** | Important information is missing. | An order cancellation feature does not specify when cancellation is allowed. |
| **Contradiction** | Two requirements conflict with each other. | One section allows cancellation after payment, while another prohibits it. |
| **Missing State** | A possible system condition is not described. | A payment feature defines success and failure but not pending transactions. |
| **Undefined Business Rule** | A rule needed to determine system behaviour is missing. | A discount feature does not specify its maximum limit. |

### Example: Online Payment Feature

Suppose a PRD states:

"Customers can make payments online and receive refunds after cancelling orders."

As a QA engineer, I should consider questions such as:

- What happens when a payment fails?
- What if the payment remains pending?
- Can customers cancel an order after shipment?
- How long does refund processing take?
- What happens if a customer clicks the Pay button multiple times?

**My takeaway:** I should identify possible problems in requirements before developers implement them. Early clarification helps reduce misunderstandings and unnecessary rework.

## 2. Writing Clarification Questions for the PM

I learned that **QA engineers should not make assumptions about unclear business requirements**.

When I find missing information or ambiguity, I should raise specific questions to the Product Manager (PM) or the responsible stakeholder.

A good clarification question should be clear, relevant, and explain what information is needed.

### Example

**Requirement:** Customers can cancel orders.

**Unclear question:**

"How does cancellation work?"

**Better question:**

"Can customers cancel orders after payment is completed, or is cancellation allowed only before shipment?"

The second question is more useful because it identifies the exact business rule that needs clarification.

### Tracking Clarification Questions

I also learned that clarification questions should be recorded so the team can track their status and decisions.

| ID | Requirement Issue | Question to PM | Status |
|---|---|---|---|
| CL-01 | Refund timeline missing | Within how many days should refunds be processed? | Open |
| CL-02 | Discount eligibility unclear | Does a failed first order affect discount eligibility? | Open |
| CL-03 | Cancellation rule missing | Can a shipped order be cancelled? | Open |
| CL-04 | Payment retry undefined | Can users retry payment without creating a new order? | Open |

*These are illustrative examples, not actual RoBenDevs project records.*

Once the PM clarifies an issue, I should record the approved decision and ensure the relevant requirements are updated.

**My takeaway:** Instead of simply identifying a problem, I should communicate it clearly, ask the right question, and track the resolution.

## 3. Understanding the Requirements Traceability Matrix (RTM)

I learned that a **Requirements Traceability Matrix (RTM)** is used to connect requirements with their corresponding test cases and defects.

It helps QA engineers track test coverage and identify requirements that have not been properly verified.

### Example: E-commerce Application

Suppose the PRD contains requirements for login, payment, order cancellation, and discounts.

A simple RTM might look like this:

| Requirement ID | Requirement | Test Case ID | Test Status | Bug ID |
|---|---|---|---|---|
| REQ-01 | User can log in with valid credentials | TC-001 | Not Run | — |
| REQ-02 | Invalid credentials must be rejected | TC-002 | Not Run | — |
| REQ-03 | Successful payment updates order status | TC-003 | Not Run | — |
| REQ-04 | Customers can cancel eligible orders | TC-004 | Not Run | — |
| REQ-05 | Discounts are calculated correctly | TC-005 | Not Run | — |

*This RTM is an example for learning purposes. It does not represent actual test execution.*

### How I Understand RTM

For example, if **REQ-03** requires the system to update an order after successful payment, I can link it with **TC-003**, which verifies the expected payment and order status.

If the test fails and I confirm a defect, I can link the corresponding Jira bug to that requirement and test case.

An RTM helps me answer important questions:

- Have all requirements been covered by test cases?
- Which requirements have not been tested?
- Which tests have failed?
- Which defects are associated with specific requirements?
- What areas may need retesting after a requirement changes?

I also understood that one requirement may need multiple test cases, including positive, negative, and boundary scenarios.

**My takeaway:** RTM helps maintain traceability between requirements, testing, and defects. However, linking a test case does not automatically guarantee complete test coverage.

## 4. Understanding Implicit Requirements

I learned that **implicit requirements are expected behaviours that may not be explicitly mentioned in the PRD**.

As a QA engineer, I should think beyond the written requirements and consider how users expect the system to behave.

### Example 1: Login Feature

**Explicit requirement:**

"Users can log in using their email and password."

**Possible implicit requirements:**

- Passwords should be masked while typing.
- Users should not access another customer's account.
- Protected pages should not remain accessible after logout.
- Incorrect credentials should not expose sensitive information.

### Example 2: Payment Feature

**Explicit requirement:**

"Customers can pay for orders online."

**Possible implicit requirements:**

- Double-clicking Pay should not create duplicate charges.
- Failed payments should not mark orders as paid.
- Refreshing the page should not automatically repeat payment.
- Users should receive appropriate feedback when payment times out.

### Example 3: Product Search

**Explicit requirement:**

"Users can search for products."

**Possible implicit requirements:**

- Empty search results should display an appropriate message.
- Leading and trailing spaces may need to be handled.
- Search behaviour with uppercase and lowercase letters should be defined.
- Very long input should not cause the application to crash.

I understood that these expectations are **potential requirements, not automatically approved business rules**.

I should raise them with the PM when necessary and confirm their expected behaviour before using them as acceptance criteria.

**My takeaway:** A good QA engineer should think beyond normal user actions, consider unexpected scenarios, and identify potential risks that may not be directly mentioned in the PRD.

## 5. How I Connect These Concepts to the QA Workflow

From my understanding of the RoBenDevs workflow, requirement analysis happens early, but QA involvement continues throughout development.

The PM gathers client requirements and prepares the necessary documents. QA reviews these requirements and raises questions about unclear or incomplete behaviour.

After clarification, the design and development teams can work using more clearly defined requirements.

QA then prepares test cases based on the approved requirements and can use an RTM to track coverage.

If defects are found during execution, QA reports them in Jira and follows the defect lifecycle until they are resolved or otherwise appropriately handled.

This helped me understand how **requirement review, clarification, test design, traceability, and bug tracking are connected**.

## 6. My Overall Learning

From today's Intermediate-level topics, I learned how to analyze requirements more deeply rather than simply accepting everything written in the PRD.

I understood how to identify requirement gaps, contradictions, missing states, and undefined business rules.

I also learned the importance of asking precise clarification questions and tracking approved answers.

The RTM concept helped me understand how requirements can be connected with test cases and defects to monitor test coverage.

Finally, implicit requirements taught me to think from both the user's and the system's perspectives, identify potential problems, and seek clarification before making assumptions.

**My main learning:** Effective QA starts with critical thinking. Identifying the right questions during requirement analysis can prevent defects before they reach development and testing.

## References

1. RoBenDevs QA Engineer Internship — 14-Day Foundation Programme, Day 2.
2. [Atlassian — User Stories](https://www.atlassian.com/agile/project-management/user-stories)
3. [Atlassian — Product Requirements](https://www.atlassian.com/agile/product-management/requirements)

*The examples are hypothetical scenarios used to demonstrate my understanding of requirement analysis and traceability.*