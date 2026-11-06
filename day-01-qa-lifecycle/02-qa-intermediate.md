# Day 1 — Intermediate: My Understanding of Testing Levels, Types, and QA Collaboration

**Name:** MD Morshed Jaman  
**Programme:** RoBenDevs QA Engineer Internship — 14-Day Foundation Programme  
**Topic:** Intermediate QA Concepts  
**Level:** Intermediate — Commit 2

## 1. How My Understanding Has Developed

After learning the basic QA lifecycle, I now understand that **testing is not just checking whether a feature works once**. I need to know *what part of the system I am testing*, *why I am testing it*, and *which risks I want to investigate*.

For example, suppose the development team implements a new **online payment feature** and makes it available on the development testing server. My first question is not, “How many test cases can I run?” Instead, I first ask, “Is this build stable enough for me to start detailed testing?”

This leads to smoke testing. If the basic checkout flow works using an approved **sandbox/test payment method**, I can proceed to more detailed checks such as incorrect amounts, declined cards, insufficient funds, duplicate submissions, and network failures. A passing smoke test gives me confidence to continue; it does **not** prove the feature is defect-free.

The payment scenarios below are **illustrative learning examples**. I have not executed them against an actual RoBenDevs client project. Their final expected results must come from the approved PRD, acceptance criteria, and payment provider's documented behaviour.

## 2. Testing Levels — Which Part of the System Am I Testing?

I learned four common testing levels:

| Level | My understanding | Payment example | Typical responsibility |
| --- | --- | --- | --- |
| **Unit** | Test one small function or component in isolation | Verify a function calculates subtotal minus discount plus delivery charge | Often developer; QA may review coverage |
| **Integration** | Test how components communicate and exchange data | Confirm the backend processes a payment-gateway response and updates the order record | Developer and/or QA |
| **System** | Test the whole integrated application | Add a product, check out, complete a sandbox payment, and verify the order confirmation | Commonly QA |
| **Acceptance** | Verify that business needs and acceptance criteria are satisfied | Client or Product Owner confirms checkout follows agreed business rules | Business stakeholder/PO with QA support |

### My simple example

Suppose a cart contains products worth **BDT 1,200**, an approved discount of **BDT 100**, and a delivery charge of **BDT 50**. Assuming there are no other fees or taxes, the payable total should be **BDT 1,150**.

- At the **unit level**, I would expect a calculation function to return 1,150 for these inputs.
- At the **integration level**, I would check that the checkout backend sends the intended amount to the payment service and handles its response correctly.
- At the **system level**, I would complete the full customer journey and confirm the displayed total, payment result, and order status are consistent.
- At the **acceptance level**, the client or Product Owner would confirm the process matches business expectations.

I must not confuse a testing *level* with a testing *type*. A level tells me the scope or layer under test; a type tells me the testing objective.

## 3. Smoke Testing — Should I Continue Testing This Build?

My understanding of **smoke testing** is that it is a small set of critical checks to decide whether the build is stable enough for planned testing.

### Payment example

After the payment feature is deployed to the testing environment, I would perform a short smoke check:

1. Does the website load?
2. Can I open a product and add it to the cart?
3. Can I reach the checkout page?
4. Can I submit an approved sandbox/test payment successfully?
5. Does the application show an appropriate payment or order confirmation?

If the checkout page crashes or the basic test payment cannot be completed, I would report the blocking issue instead of spending time on every detailed test case immediately.

**What I learned:** Smoke testing is **broad and shallow**. It checks the most essential paths, not every variation of the payment feature. The exact smoke suite depends on which functions are critical to the product.

## 4. Functional Testing — Does the Feature Meet Its Requirements?

If smoke testing passes, I can perform deeper functional testing against the approved requirements.

For payment, I want to verify not only that money can be simulated as paid but also that the **amount, status, messages, and order records** are correct.

### My payment test scenario examples

| ID | Scenario | Expected result to verify |
| --- | --- | --- |
| PAY-01 | Complete a payment with an approved successful test method | Payment succeeds and the corresponding order is updated according to the PRD |
| PAY-02 | Use a payment-provider test method configured to decline | Payment is not treated as successful; the user receives an appropriate response |
| PAY-03 | Use test input simulating an expired card | System handles the failure safely and follows the specified retry rules |
| PAY-04 | Simulate insufficient funds using an approved provider test case | The payment fails correctly; no false paid order is created |
| PAY-05 | Enter invalid or incomplete card details in the test form | Appropriate input validation occurs; the transaction is not incorrectly completed |
| PAY-06 | Verify subtotal, discount, delivery charge, and final amount | The payable amount matches the approved pricing rules |
| PAY-07 | Send a zero, negative, or otherwise invalid amount through an authorized test API | Server rejects invalid values according to the contract |
| PAY-08 | Change or tamper with a client-side amount in an authorized security test | Backend uses trusted server-side pricing and does not accept an unauthorized amount |
| PAY-09 | Double-click the Pay button or retry the same test request | The system avoids unintended duplicate charges/orders according to its design |
| PAY-10 | Simulate a network interruption or timeout | Payment and order states remain recoverable and do not falsely show success |
| PAY-11 | Try to access another user's payment details in an authorized test environment | Access is denied according to permissions and privacy requirements |
| PAY-12 | Check the order after a successful or failed test payment | Database/order status matches the authoritative payment outcome |

These are **test ideas**, not guaranteed requirements for every project. For example, not every checkout accepts a user-entered amount. If the amount is calculated by the server, I should verify that the browser cannot override it. Some payment statuses may remain pending while the provider completes asynchronous processing.

I would use only payment-provider sandbox data and approved test accounts. I should not use real customer cards, real money, production credentials, or sensitive client data for these exercises.

## 5. Positive vs Negative Testing

I learned that **positive testing** checks valid behaviour and **negative testing** checks how the application responds to invalid, unexpected, or disallowed input.

### Positive example

I select an available product, apply an allowed discount, enter valid sandbox payment details, and complete checkout. I expect an appropriate success result.

### Negative examples

- I use a test card that the provider is configured to decline.
- I submit missing required information.
- I try to pay an invalid amount through an approved test API.
- I use an expired session or unauthorized account.
- I retry after a failed transaction and check that the old failure does not incorrectly become a successful payment.

**My key lesson:** A well-tested feature should behave correctly when input is valid **and** fail safely when it is invalid.

## 6. Smoke vs Sanity vs Retesting vs Regression

These names sounded similar at first, but I now understand their different purposes.

| Type | Question I am trying to answer | Payment example |
| --- | --- | --- |
| **Smoke** | Is this build ready for more detailed testing? | Can basic checkout and a successful sandbox payment work? |
| **Sanity** | After a focused change, does the affected feature appear to work? | After a discount-calculation update, do the main checkout totals behave sensibly? |
| **Retesting / confirmation testing** | Is the specific bug I reported actually fixed? | Repeat the exact steps that previously produced an incorrect amount |
| **Regression** | Did the change introduce problems in existing behaviour? | Recheck cart totals, coupons, order creation, invoices, and payment status as relevant |

### A complete example in order

1. A new build arrives. I run **smoke tests** on critical paths.
2. Smoke passes, so I perform detailed **functional, negative, and other planned tests**.
3. I discover that a discount is applied twice, so I report a bug in Jira.
4. A developer fixes it and the fix is deployed to the test environment.
5. I **retest** the original failing scenario with the same conditions.
6. I perform a focused **sanity check** of the changed checkout area if required by the team's process.
7. I run relevant **regression tests** to check that coupons, final totals, and payment processing still work.

Sanity testing is a commonly used team term and may overlap with a focused regression or confirmation check. I should follow the test definitions agreed by my team rather than assume every company uses the exact same labels.

## 7. Exploratory Testing — Learning While Testing

I learned that **exploratory testing** combines learning about a feature, designing checks, and executing them dynamically. It does not mean randomly clicking without a goal.

For a payment feature, I could start a focused exploratory session with this **charter**:

> Investigate how the checkout handles interrupted or repeated payment attempts without creating incorrect order states.

During that session, I could explore:

- Refreshing the page while payment is pending.
- Navigating back and forward during checkout.
- Reopening checkout in another browser tab.
- Retrying after a declined test payment.
- Observing what happens when the network temporarily disconnects.

I would record my observations, test data, unexpected behaviour, and questions. If I find a reproducible defect, I should create a clear Jira ticket with evidence.

## 8. Non-Functional Testing — How Well Does It Work?

Functional testing asks whether a feature performs the required action. Non-functional testing considers important quality characteristics.

| Quality area | What I would investigate | Payment example |
| --- | --- | --- |
| Performance | Response time, throughput, stability under expected load | Does checkout remain responsive during an agreed test workload? |
| Security | Authentication, authorization, sensitive data handling | Can an unauthorized user see another customer's payment record? |
| Accessibility | Whether people with different abilities can use the interface | Can keyboard and assistive-technology users navigate checkout? |
| Reliability | Behaviour when services or networks fail | Does a timeout leave the order in a correct recoverable state? |

The acceptance targets must be agreed in requirements; “fast,” “secure,” or “easy to use” alone are not sufficiently measurable.

This is a basic introduction to non-functional testing. The foundation programme studies performance, security, and accessibility in more detail on Day 12.

## 9. Pull Requests and Code Review

I learned that a **pull request (PR)** lets a team review changes on a branch before merging them into the main branch.

My understanding of the workflow is:

1. Create a branch for a task or learning topic.
2. Add or update the relevant notes, tests, or code.
3. Make meaningful Git commits.
4. Push the branch to the remote repository.
5. Open a pull request with a clear title and summary.
6. A reviewer checks the changed files and leaves comments or requests changes.
7. I address feedback and push follow-up commits to the same branch.
8. After required review and checks pass, the change can be merged according to team rules.

As a QA engineer, I may submit documentation, test cases, API collections, automated tests, and other QA artifacts for review. I also want to learn how to review test quality: Do the expected results make sense? Are test names clear? Is important evidence missing? Are negative cases covered?

The RoBenDevs programme describes **Bitbucket** as the official training repository platform. I currently use **GitHub** for my personal learning notes; both platforms support pull-request-based review, although their interfaces and integration settings differ.

## 10. Jira and Git Repository Integration

I learned that linking code changes to a **Jira issue key** helps the team trace which branch, commit, or PR addresses a story or bug.

For example, if my team has an actual Jira issue such as `QA-123`, I might see a branch named `QA-123-checkout-validation` and a commit message such as `QA-123 add checkout validation tests`.

**`QA-123` is only an example.** I should use the real issue key assigned by my team.

When Jira and Bitbucket are connected, recognized issue keys in branches, commits, or PR titles can associate development activity with the Jira ticket. This helps reviewers understand the reason for a change and follow its progress.

I should not assume that Jira integration is active in my separate personal GitHub repository unless the connection has actually been configured.

## 11. How I Would Report a Payment Defect

If a payment fails in an unexpected way, I should not create a vague ticket saying “Payment not working.” I need enough detail for another person to reproduce it.

### Illustrative bug report

**Title:** Checkout creates a paid order after a simulated declined payment

**Environment:** Development test environment, approved sandbox payment provider

**Preconditions:** A test account has a product in the cart; the payment provider supports a decline simulation.

**Steps to reproduce:**

1. Open checkout.
2. Select the provider's approved decline test method.
3. Submit the payment.
4. View the payment result and order status.

**Expected:** The application should handle the decline according to the PRD and must not incorrectly mark the order as paid.

**Actual (hypothetical defect):** The order is marked Paid even though the provider reports a decline.

**Evidence to collect:** Sanitized screenshot, test order reference, environment/build information, and relevant non-sensitive logs.

This example helps me understand why **actual results and expected results must be clearly separated**. I should not claim to have found this bug unless I reproduce it in an authorized project.

### My Jira Practice — Kanban Board and Bug Ticket

I created a **QA Practice** space in Jira with **To Do, In Progress, and Done** columns and submitted my first practice bug: [QP-1 — Checkout marks order as Paid after declined payment](https://g-team-qfw281wn.atlassian.net/browse/QP-1).

Through this exercise, I learned to:

- Select the **Bug** work type and write a specific summary.
- Record the environment, preconditions, reproduction steps, expected result, and actual result.
- Use a **Kanban board** to view work by status.
- Identify a ticket by its unique key, **QP-1**, which can be referenced in branches, commits, and pull requests. Automatic linking requires repository integration, which I have not configured in this exercise.

**This ticket is a hypothetical practice example, not a reproduced application defect.** I completed the space setup and ticket creation; fixing and retesting remain future exercises.

## 14. My Key Takeaway

**I now understand that a QA engineer does not simply ask, “Can the customer pay?”** I need to ask whether the complete payment journey is correct, what happens when the payment fails, whether amounts and order states remain consistent, whether users have proper access, and whether the new change affects existing features.

Smoke testing tells me whether I can proceed with deeper testing. The remaining test types and levels help me evaluate the feature from different perspectives. Collaboration through Jira and pull requests keeps the evidence, changes, and decisions traceable.

---

### References for further learning

- [ISTQB — Smoke Testing](https://glossary.istqb.org/en_US/term/smoke-testing)
- [ISTQB — Exploratory Testing](https://glossary.istqb.org/en_US/term/exploratory-testing)
- [Stripe — Automated Testing and Simulated Payment Failures](https://docs.stripe.com/automated-testing)
- [GitHub — Reviewing Proposed Changes in a Pull Request](https://docs.github.com/en/pull-requests/how-tos/review-pull-requests/reviewing-proposed-changes-in-a-pull-request)
- [Atlassian — Integrate Bitbucket and Jira](https://support.atlassian.com/bitbucket-cloud/docs/use-bitbucket-cloud-and-jira-together/)

*This is my personal learning summary. Payment defect examples are hypothetical and do not describe actual client defects or production payment attempts. The Jira space setup and practice ticket creation described above were completed by me.*
