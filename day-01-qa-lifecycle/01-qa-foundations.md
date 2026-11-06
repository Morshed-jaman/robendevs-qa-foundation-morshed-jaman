# Day 1 — QA Foundations: Roles, Responsibilities, and Project Workflow

**Name:** MD Morshed Jaman  
**Programme:** RoBenDevs QA Engineer Internship — 14-Day Foundation Programme  
**Topic:** QA Role, Testing Lifecycle, Git, and Atlassian Tools  
**Level:** Foundation

## 1. What I Learned About Quality Assurance

Before starting this foundation programme, I thought mainly about testing software after development. Now I understand that **Quality Assurance (QA) begins much earlier**. A QA engineer helps the team build the right product by identifying unclear requirements, design mismatches, implementation defects, and release risks throughout the software development lifecycle.

I learned the difference between three related terms:

| Term | What it means to me | Simple example |
| --- | --- | --- |
| **Quality Assurance (QA)** | Working to prevent quality problems by improving how we understand, design, build, and verify a product | Asking about a missing password-reset rule before coding begins |
| **Quality Control (QC)** | Evaluating the product to determine whether it meets agreed quality expectations | Checking whether a finished login feature meets acceptance criteria |
| **Software Testing** | Executing or evaluating software to discover defects and provide information about its behaviour | Attempting to log in with an incorrect password and observing the response |

I understand that testing is an important QC activity, but QA is broader than testing. QA does not guarantee that a product will contain zero defects. It helps the team find problems earlier and make informed decisions about quality.

## 2. How I Understand the RoBenDevs Project Workflow

Based on the workflow explained to me, I understand a client project as a sequence of connected activities. QA does not wait until the end; it participates at multiple points.

1. **Client and PM discussion:** The client explains the business problem, goals, and desired features. The Product Manager (PM) gathers and clarifies the requirements.
2. **BRD and PRD:** The PM documents the business needs and product behaviour, using documents such as a Business Requirements Document (BRD) and Product Requirements Document (PRD).
3. **QA requirement review:** QA reads the requirements and raises questions about ambiguity, inconsistency, missing information, and statements that cannot be tested clearly.
4. **UI/UX design:** The design team prepares screens and user journeys. QA compares the designs with the approved requirements and reports mismatches or missing states.
5. **Development:** Developers implement the approved features. QA stays involved by clarifying expected behaviour, preparing test ideas, and testing features as they become available.
6. **Development-environment testing:** QA tests an available build on the development server and records the actual results. When a defect is found, QA creates a reproducible Jira bug ticket.
7. **Bug triage, fix, and retest:** The responsible team members prioritize and assign the bug. A developer implements a fix. After the fix is available in a testable environment, QA retests the original defect and checks for related regressions.
8. **Staging testing:** A release candidate moves to a staging environment, where QA repeats the appropriate checks in a setup that is intended to resemble production.
9. **Production and client:** After the necessary approvals, the team deploys to production, which may be hosted on AWS. QA performs safe post-deployment checks and supports client acceptance and feedback.

This is my current understanding of the workflow, not a claim that every project has identical handoffs or approval rules. Development, QA, PM, design, and DevOps activities can overlap. The exact environment names, Jira statuses, responsibilities, and release approvals depend on the project.

## 3. BRD and PRD: Why I Need Both

I learned that a **BRD explains the business need** while a **PRD describes the product that will address that need**. They answer different questions.

- **BRD — Business Requirements Document:** Why does the client need the system? What problem should it solve? What business outcomes and high-level scope are expected?
- **PRD — Product Requirements Document:** What features, behaviour, rules, constraints, and acceptance criteria should the product have?

### My example: An online clothing store

A client might say, *“I want customers to place orders online instead of sending messages manually.”*

In a **BRD**, I would expect to see a goal such as reducing manual order handling and improving order visibility. The business may need online ordering, inventory visibility, and payment support.

In a **PRD**, I would expect more precise behaviour, such as:

- A customer can add available products to a cart.
- The checkout shows product prices, quantities, delivery charges, and the final payable amount.
- After a successful order, the customer receives an order reference.
- The order status follows defined business rules.

I also learned that the PRD is not automatically testable just because it is detailed. The team still needs clear acceptance criteria. For example, *“Checkout should be fast”* is too vague unless the expected performance metric, workload, and test environment are defined.

## 4. How I Would Review Requirements as QA

I understand four common requirement-quality problems:

| Problem | Meaning | Example | My QA question |
| --- | --- | --- | --- |
| **Ambiguity** | More than one interpretation is possible | “The page should load quickly.” | How quickly, under what conditions, and how will it be measured? |
| **Inconsistency** | Two statements conflict | “Paid orders can be cancelled before shipping” vs “Paid orders cannot be cancelled” | Which cancellation rule is correct? |
| **Incompleteness** | Necessary information is missing | “Users can reset passwords.” | When does the reset link expire, and can it be reused? |
| **Untestability** | No objective pass/fail condition is available | “The interface should be user-friendly.” | What usability or accessibility criteria should be met? |

My responsibility is to **raise precise questions and record the agreed answers**, not invent business rules on my own. The PM or another authorized stakeholder should confirm the expected behaviour. After clarification, I can use the approved requirement to design test cases later.

## 5. What I Learned About QA Involvement During Design

After the requirements are clarified, the design team turns them into screens, interactions, and user journeys. I learned that QA can review these designs before development begins.

For example, if the PRD requires a “Forgot Password” option but the login design has no link or recovery route, QA should report that discrepancy early. I should also look for missing states such as:

- Empty fields and validation messages.
- Loading, success, and failure states.
- What happens when no data exists.
- Mobile or responsive behaviour where required.
- Permission-based visibility, such as what an admin can see versus a normal user.

The designer owns design decisions, while the PM confirms product rules. My QA contribution is to identify gaps and help make the design consistent and testable.

## 6. What I Learned About QA During Development

I learned that developers write and maintain the product code, but QA can prepare test ideas and discuss potential failure cases during implementation.

For example, while a developer works on a registration feature, I can ask what should happen when:

- The same email address is registered twice.
- A required field is missing.
- The server fails while saving a new account.
- The user clicks the Submit button multiple times.

These questions help me understand risks before I execute the actual tests. They also help developers and QA agree on expected behaviour.

## 7. What I Learned About Jira Bug Reporting and Follow-Up

When a feature behaves differently from the approved requirement, I need to determine whether it is a defect and create a clear **Jira bug ticket**.

I learned that a useful bug report should contain:

1. **Title:** A short, specific description of the defect.
2. **Environment/build:** Where and on which version I observed it.
3. **Preconditions:** The setup required before reproducing it.
4. **Steps to reproduce:** Exact, repeatable actions.
5. **Expected result:** What should happen according to the requirement.
6. **Actual result:** What happened instead.
7. **Evidence:** Relevant screenshots, videos, logs, or request details, without exposing secrets.
8. **Severity/priority:** The impact and urgency, according to the team's conventions.

### Example Jira bug I could report

**Title:** Checkout total does not update after changing product quantity

**Environment:** Development testing environment

**Precondition:** A customer has one product in the cart.

**Steps:**

1. Open the shopping cart.
2. Increase the quantity from one to two.
3. Observe the displayed total.

**Expected:** The total should reflect the updated quantity and approved pricing rules.

**Actual:** The displayed total remains unchanged.

**Evidence:** A screenshot or screen recording showing the quantity and total.

This is an illustrative training example, not a bug I claim to have discovered on a RoBenDevs client project.

### How I understand the bug lifecycle

I learned a typical flow:

**New/Open → Triage → Assigned/In Progress → Fixed or Ready for QA → Retesting → Closed**

If the original problem still occurs, I would **reopen** the ticket or move it back to the appropriate status following the Jira workflow. Different projects can use different status names and transitions.

I also understand the responsibilities more clearly:

- **QA** identifies, documents, verifies, and follows up on the defect.
- **PM or team lead** can help triage, prioritize, coordinate, and assign the defect.
- **Developer** usually investigates the code and implements the technical fix.
- **QA** retests once that fix is deployed to the environment being tested.

Based on the process explained to me, if an issue remains unresolved for around **four or five days**, I should discuss its status and impact with the PM. However, that is a practical follow-up example rather than a universal SLA: critical bugs may require escalation immediately, while low-priority issues may have a different schedule.

I must also remember that **merging code is not the same as deploying it**. I can retest only when the relevant fix is available in the environment I am using.

## 8. Retesting vs Regression Testing

I now understand these as two different checks:

- **Retesting:** I reproduce the original bug scenario after a developer's fix to verify that the defect is resolved.
- **Regression testing:** I check related or existing functionality to see whether the change introduced new problems.

For example, after the checkout-total bug is fixed, I would retest changing the quantity. I might also check quantity reduction, discounts, delivery charges, and checkout submission as appropriate regression scenarios.

If the issue persists, I should add fresh evidence to Jira and follow the team's workflow for reopening or returning it to development.

## 9. Development, Staging, and Production Environments

The environment flow I learned is **Development → Staging → Production**, with the exact deployment and approval steps determined by the team.

| Environment | How I understand its purpose | My QA focus |
| --- | --- | --- |
| **Development (Dev)** | Where ongoing implementation and fixes are made available | Test new features, reproduce bugs, and retest fixes |
| **Staging** | A pre-production environment intended to resemble the live system | Validate release candidates, key user journeys, integrations, and regressions |
| **Production (Prod)** | The live system used by real users or clients; it may run on AWS | Perform approved, low-risk smoke checks and monitor issues after release |

I learned that passing tests in development is not enough. Differences in configurations, services, databases, permissions, or deployment packages may create problems in staging. Similarly, passing staging tests does not prove that production is risk-free.

I should **not run destructive tests or create uncontrolled test data in production**. Production checks must follow the team's permissions and release procedures. Client UAT or sign-off may happen before production, after a controlled release, or at another agreed stage; it is not necessarily the final activity after deployment.

## 10. The Eight QA Lifecycle Stages in My Own Words

The Day 1 programme also describes the broader QA lifecycle using eight stages. I summarize them this way:

| Stage | What I understand | Typical input | Typical output |
| --- | --- | --- | --- |
| 1. Requirement review | I study requirements and find gaps | BRD, PRD, stories, designs | Questions and clarified requirements |
| 2. Test planning | I decide what needs testing and which risks matter | Approved scope and requirements | Test plan or strategy |
| 3. Test design | I prepare scenarios, cases, and test data | Acceptance criteria | Test cases and test data |
| 4. Test execution | I run tests and compare actual results with expected results | Testable build and cases | Pass/fail results and evidence |
| 5. Bug reporting | I record and follow defects | Observed failures | Jira bug tickets |
| 6. Automation | I automate appropriate repeatable checks | Stable, valuable scenarios | Automated test scripts and results |
| 7. Regression | I verify that changes did not break related functionality | Updated build | Regression evidence |
| 8. UAT and release | I support acceptance and communicate release risks | Release candidate and test evidence | UAT feedback and release recommendation |

These stages are a useful learning model, but the real workflow is iterative. Requirement clarification, testing, reporting, automation, and retesting can happen repeatedly rather than only once in a fixed order.

## 11. Who Does What in the Team?

I learned that software quality is a shared responsibility:

| Team member | Main responsibility | How I collaborate as QA |
| --- | --- | --- |
| **Client / stakeholder** | Explains business needs and accepts outcomes | Understand expected business behaviour through approved channels |
| **Product Manager (PM)** | Manages requirements, scope, decisions, and priorities | Ask clarification questions and communicate release risks |
| **UI/UX designer** | Designs screens and user journeys | Check design consistency with requirements |
| **Developer** | Implements and fixes software | Report reproducible defects and verify fixes |
| **DevOps / release team** | Manages build, deployment, infrastructure, and environments | Report environment problems and validate releases |
| **QA engineer** | Investigates quality risks and provides test evidence | Participate across the lifecycle and communicate findings |

## 12. Atlassian Tools I Need to Know

I understand the three tools in the RoBenDevs foundation programme as follows:

- **Confluence:** The place for project knowledge and documentation, such as requirements, decisions, and test plans.
- **Jira:** The place for tracking user stories, tasks, bugs, status, assignees, and follow-up work.
- **Bitbucket:** The place for Git repositories, branches, pull requests, code review, and related CI pipelines.

An example of how they connect: I read the requirement in Confluence, test the implemented feature, log a defect in Jira, and submit my testing notes or automation in a Git branch for review through Bitbucket.

## 13. Git Basics I Learned

Git is a version control system. It helps me keep a history of my learning notes, collaborate safely, and submit work for review.

I remember the basic flow as:

**Working files → Stage changes → Commit locally → Push to remote → Open a pull request**

| Command | Meaning in my words |
| --- | --- |
| `git clone <repo-url>` | Get a copy of an existing remote repository |
| `git switch -c <branch-name>` | Create and switch to a separate branch |
| `git status` | Check which files have changed and what is staged |
| `git add <file>` | Choose file changes for my next commit |
| `git commit -m "message"` | Save a meaningful snapshot in local Git history |
| `git push` | Upload my local commits to the remote repository |
| `git pull` | Fetch and integrate remote changes into my current branch |

I also learned that a **pull request is not the same as `git pull`**. A pull request asks teammates or a senior reviewer to review and merge branch changes. I will follow the repository's review requirements before merging into the default branch.

For this training, I plan to keep the Day 1 work in one branch and make **three separate commits**: Basic, Intermediate, and Advanced. This document is intended for the **first commit** only. I should not claim that the Intermediate or Advanced topics are complete until I study and write those notes.

## 14. My Key Takeaways from QA Foundations

1. I learned that QA starts from requirements, not only from testing a completed feature.
2. I can explain why a BRD and PRD are useful and how QA identifies ambiguity, inconsistency, incompleteness, and untestable requirements.
3. I understand that QA can review designs, collaborate during development, and report clear defects in Jira.
4. I understand how a bug can move through triage, development, retesting, reopening, and closure.
5. I learned the difference between retesting and regression testing.
6. I understand the purpose of development, staging, and production environments, including safe production validation.
7. I can describe the eight QA lifecycle stages and the roles of PM, design, development, DevOps, and QA.
8. I understand the purpose of Confluence, Jira, Bitbucket, Git commits, and pull requests.


### References for my further learning

- [Atlassian — Product Requirements Document](https://www.atlassian.com/agile/product-management/requirements)
- [Atlassian — Understand Jira Workflows](https://support.atlassian.com/jira-cloud-administration/docs/work-with-issue-workflows)
- [AWS — Understanding DevOps Environments](https://docs.aws.amazon.com/prescriptive-guidance/latest/choosing-git-branch-approach/understanding-the-dev-ops-environments.html)
- [Git — Official Git Tutorial](https://git-scm.com/docs/gittutorial)

*This is my learning summary based on the foundation syllabus, the workflow explained to me, and general QA principles. Illustrative examples are not claims about actual client defects or completed company tasks.*
