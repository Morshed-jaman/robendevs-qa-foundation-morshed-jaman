# Day 01 — QA Foundations, Testing Lifecycle & Collaboration

**Programme:** RoBenDevs QA Engineer Internship — 14-Day Foundation Programme  
**Level:** Basic → Intermediate → Advanced  
**Focus:** Understanding the QA role and how a feature moves from client requirements to release.

## What I Learned

I learned that **Quality Assurance starts at requirement analysis, not after development ends**. In the workflow introduced to me, the PM gathers client needs and documents them in a BRD/PRD; QA reviews those requirements for ambiguity, inconsistency, missing details, and testability. QA also participates in design review, development feedback, test execution, bug tracking, and release checks.

### Basic
- QA vs QC vs Testing, and why quality is a shared responsibility.
- The eight QA lifecycle stages: **requirement review → test planning → test design → test execution → bug reporting → automation → regression → UAT/release**.
- Collaboration with the client, PM, UI/UX designers, developers, and DevOps.
- Git fundamentals and the roles of Jira, Confluence, and Bitbucket.

### Intermediate
- Testing levels: **unit, integration, system, and acceptance**.
- Testing types: **functional, smoke, sanity, regression, exploratory, and non-functional**.
- Example: after a payment feature is deployed, I would run a small **smoke check** of the critical payment flow before deeper tests such as declined cards, invalid amounts, and retry behaviour (in an approved test environment).
- Pull requests, code review, and linking Git work to Jira issues.

### Advanced
- **Test pyramid:** many fast unit checks, integration checks, and fewer costly end-to-end UI checks.
- **Shift-left:** clarify requirements early; **shift-right:** monitor quality after deployment.
- Merge conflicts, rebase, and following team branch/review rules.

## Testing Lifecycle Diagram

I mapped the described workflow from **client requirements → PM/BRD/PRD → QA review → design → development → DEV testing → staging validation → production (AWS) → client**, including Jira bug reporting, developer fixes, and QA retesting. The diagram illustrates the process discussed during training; actual release and approval responsibilities depend on the project.

![Day 1 QA Testing Lifecycle](./Testing_Lifecycle_Flowchart_01-day.png)

## Files

| File | Contents |
| --- | --- |
| [01-qa-foundations.md](./01-qa-foundations.md) | Basic QA concepts, roles, requirements, and workflow |
| [02-qa-intermediate.md](./02-qa-intermediate.md) | Testing levels, types, PRs, and Jira/Bitbucket collaboration |
| [03-qa-advanced.md](./03-qa-advanced.md) | Test pyramid, shift-left/right, Git collaboration, and references |
| [Testing_Lifecycle_Flowchart_01-day.png](./Testing_Lifecycle_Flowchart_01-day.png) | Lifecycle flowchart with environments and feedback loop |

## Key Takeaway

**My main learning:** QA is not just finding bugs. It is understanding requirements, preventing avoidable problems, providing useful test evidence, and following defects through the team workflow.

> These notes reflect my learning and use illustrative scenarios. They do not disclose or verify a specific client implementation.
