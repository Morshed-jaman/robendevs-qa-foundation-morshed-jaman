# Day 2 — Basic: My Understanding of Requirements and Testability

**Name:** MD Morshed Jaman  
**Programme:** RoBenDevs QA Engineer Internship — 14-Day Foundation Programme  
**Topic:** Understanding Requirements and Testability  
**Level:** Basic

## 1. What I Learned About Requirement Analysis

I learned that **Quality Assurance starts before development**, with a proper understanding of the client's requirements.

When a client shares their business needs, the Product Manager (PM) gathers the information and prepares requirement documents such as a Business Requirements Document (BRD) or Product Requirements Document (PRD).

As a QA engineer, my responsibility is not just to read these documents but also to identify **ambiguity, inconsistency, missing information, and untestable requirements** before development begins.

I understood that unclear requirements may lead to incorrect implementation, additional development work, and defects.

## 2. Understanding a Product Requirements Document (PRD)

A **PRD** explains what a product should do, who will use it, and what functionality it must provide.

I learned to focus on five important sections:

| Component | My Understanding |
|---|---|
| **Goals** | Why the product is being developed and what problem it solves. |
| **Users** | Who will use the system and their different roles. |
| **Scope** | Which features are included or excluded. |
| **Features** | What functionality the application must provide. |
| **Non-functional requirements** | How well the application should perform, including performance, security, and usability. |

### Example: E-commerce Application

Suppose a client wants an online shopping application.

The PRD mentions that customers can register, log in, search for products, and make payments.

As a QA engineer, I should understand these requirements and identify missing details.

For example:

- Can users register with an already registered email?
- What happens after multiple incorrect login attempts?
- Can customers place orders when products are out of stock?
- What happens when a payment fails?

**My takeaway:** I should not assume that the requirements are complete. I need to understand the expected behaviour and raise questions wherever clarification is necessary.

## 3. User Stories and Acceptance Criteria

I learned that a **user story** describes a feature from the user's perspective.

A common format is:

**As a [user], I want [feature], so that [benefit].**

### Example

**User Story:**

As a customer, I want to reset my password so that I can regain access to my account.

However, a user story alone may not explain all the conditions required for the feature to work correctly.

This is where **Acceptance Criteria (AC)** become important.

Acceptance criteria define the conditions that must be satisfied for a feature to be accepted.

### Given / When / Then

I learned how to express acceptance criteria using the Given/When/Then format:

- **Given:** The initial condition.
- **When:** The action performed.
- **Then:** The expected outcome.

**Example: Successful Login**

```gherkin
Given the user has a registered account
And the user is on the login page
When the user enters valid credentials
And clicks the Login button
Then the user should be authenticated
And redirected to the dashboard
```

**Example: Invalid Login**

```gherkin
Given the user is on the login page
When the user enters an incorrect password
And clicks the Login button
Then the login attempt should be rejected
And an appropriate error message should appear
```

**My takeaway:** User stories explain what users need, while acceptance criteria help define how I can verify whether the expected behaviour has been implemented.

## 4. Understanding Testable Requirements

I learned that a requirement should be **clear, consistent, complete, and testable**.

A vague requirement makes it difficult for QA to determine whether the application passes or fails.

### Example 1: Performance

**Unclear requirement:**

"The application should load quickly."

**Improved requirement:**

"Under the agreed workload and testing conditions, the product listing page should load within 2 seconds."

The improved requirement is measurable, although the target must be confirmed by the PM or client.

### Example 2: File Upload

**Unclear requirement:**

"Users can upload large profile pictures."

**Improved requirement:**

"Users can upload JPG or PNG images up to 5 MB, and the system must display an error for unsupported files."

The size and format restrictions are illustrative and require approval.

### What I understood

As a QA engineer, I should check whether:

1. Requirements have a clear meaning.
2. Expected results can be verified.
3. Necessary conditions and limitations are defined.
4. Requirements contradict one another.
5. Important scenarios or exception cases are missing.

If something is unclear, I should raise a clarification question instead of making assumptions.

## 5. Reviewing Figma Designs Against Requirements

I learned that QA engineers also participate in the design-review process.

After the requirements are prepared, the UI/UX team creates application designs using tools such as **Figma**.

My responsibility is to compare the designs with the approved PRD and identify missing functionality, inconsistencies, or unclear user interactions.

### Example: Login Page

Suppose the PRD specifies:

"Users should be able to log in and reset forgotten passwords."

However, the Figma design includes only:

- Email field
- Password field
- Login button

There is no **Forgot Password** option.

As a QA engineer, I should identify this difference and ask the PM or designer how users are expected to access password recovery.

### What I Should Check During Design Review

- Are all required fields and buttons present?
- Are labels and error messages appropriate?
- Does navigation match the requirements?
- Are validation and error states considered?
- Are success, loading, and empty states defined where necessary?
- Are responsive layouts and accessibility considered?

**My takeaway:** QA should identify design-related issues before development whenever possible, rather than waiting until the application is implemented.

## 6. My Overall Learning

From today's Basic-level topics, I understood that **requirement analysis is one of the foundations of effective software testing**.

A QA engineer should not depend only on the implemented application to understand expected behaviour.

I learned how to read a PRD, understand user stories, interpret acceptance criteria, identify untestable requirements, and compare UI/UX designs with documented requirements.

Most importantly, I understood that **asking the right questions early can prevent defects later in the software development lifecycle**.

In the next level, I will focus on identifying requirement gaps and contradictions, preparing clarification questions, understanding implicit requirements, and using a Requirements Traceability Matrix (RTM).

## References

- RoBenDevs QA Engineer Internship — 14-Day Foundation Programme, Day 2.
- [Atlassian — User Stories](https://www.atlassian.com/agile/project-management/user-stories)
- [Atlassian — Product Requirements](https://www.atlassian.com/agile/product-management/requirements)