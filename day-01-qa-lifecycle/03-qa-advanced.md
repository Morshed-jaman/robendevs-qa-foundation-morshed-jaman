# Day 1 — Advanced: My Understanding of Modern QA Practices

**Name:** MD Morshed Jaman  
**Programme:** RoBenDevs QA Engineer Internship — 14-Day Foundation Programme  
**Level:** Advanced

## 1. Test Pyramid

I learned that tests should be balanced across three main levels:

| Level | Purpose | Payment feature example |
| --- | --- | --- |
| **Unit (many)** | Check small functions quickly. | Verify the discount or total-amount calculation. |
| **Integration (some)** | Check connected components. | Verify the payment API communicates with the gateway correctly. |
| **End-to-end/UI (fewer)** | Check important user journeys. | Place an order and complete a payment using a sandbox card. |

**My takeaway:** A few reliable end-to-end tests are useful, but they should not replace faster unit and integration tests.

## 2. Shift-Left and Shift-Right Testing

- **Shift-left:** Start quality checks early, before development is finished. *Example:* Review payment requirements and ask what happens when a card is declined or the amount is invalid.
- **Shift-right:** Continue observing quality after release. *Example:* Monitor failed payment rates, errors, and user feedback in production without making real test charges.

**My takeaway:** QA starts with requirements and continues after deployment.

## 3. Git Merge Conflicts and Rebase

- A **merge conflict** happens when Git cannot automatically combine overlapping changes, such as two people editing the same lines of a test case.
- I should open the conflicted file, choose the correct content, remove the conflict markers, run relevant checks, and commit the resolution.
- **Merge** combines branch histories. **Rebase** replays my branch commits on top of a newer base for a cleaner history; I should avoid rebasing a shared branch without team agreement.

**My takeaway:** I must review changes carefully and follow the team's branch and pull-request rules. I should never force-push to a protected/shared branch just to bypass a conflict.

## 4. How I Connect This to Our Workflow

After a developer's pull request is reviewed and merged into the **development branch**, the build is deployed to the **DEV environment**. QA tests it, reports bugs in **Jira**, and retests fixes. Once checks pass, the release candidate moves to **Staging** for final validation; an approved release goes to **Production**, where monitoring continues.

**Overall learning:** Quality is built through early reviews, appropriate test coverage, controlled Git changes, and continuous feedback.
