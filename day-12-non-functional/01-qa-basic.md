# Day 12 — Basic: Non-Functional Testing (Performance, Security, Accessibility)

**Programme:** RoBenDevs QA Engineer Internship — 14-Day Foundation Programme  
**Study date:** 23 November 2026  
**Level:** Basic  
**Syllabus reference:** Official Foundation Programme, Day 12, page 16

> **Scope:** Basic study notes only. No Day 12 load test, security audit, accessibility audit, Jira finding or assessment submission is claimed.

## 1. Functional vs. non-functional testing

**Functional testing** asks whether a feature behaves according to requirements. Example: Can a user log in with valid credentials?

**Non-functional testing** asks how well the application behaves, including speed, protection of information and usability by people with different abilities. Examples: How quickly does login respond? Are restricted pages protected? Can a user operate the form using a keyboard?

A feature may work functionally yet still have non-functional defects.

## 2. Performance basics

The syllabus requires four terms.

| Term | Definition | Illustrative example |
| --- | --- | --- |
| **Response time** | Time between initiating an operation and receiving its response. Define the measurement point and operation. | An API responds in 800 milliseconds. |
| **Throughput** | Completed operations per unit of time. | The server completes 100 requests per second. |
| **Concurrent users** | Users whose activity overlaps within the test period. This does **not** mean every user is sending a request simultaneously. | 50 CRM employees work in the app at once. |
| **Error rate** | Failed operations divided by total operations in a specified period. The definition of failure must be stated. | 5 failed requests among 100 = 5%. |

### Important distinctions

- **Response time vs. throughput:** Response time describes duration for an operation; throughput describes completed work per second/minute.
- **Concurrency vs. throughput:** 50 concurrent users does not necessarily mean 50 requests/second.
- **Pass/fail requires requirements:** An 800 ms response time cannot be declared acceptable or unacceptable without the agreed threshold and test conditions.

### Example QA scenario (hypothetical, not measured)

For a CRM API, suppose a load test reports 50 concurrent users, 800 ms average response time, 100 requests/second throughput and 2% errors. QA compares those results with the expected workload and acceptance criteria, checks which requests failed, and records the environment and time of the test.

**Intermediate later:** k6 scripts, ramping virtual users and reading real test results.

## 3. Security basics — OWASP Top 10

Security testing checks whether the application protects data, accounts and operations from unauthorized use. OWASP publishes a broad awareness list of web application security risk categories.

The Foundation Programme asks for an OWASP Top 10 understanding *at a tester's level* without specifying a version. For current context, the published **OWASP Top 10:2025** categories are:

| Category | Beginner QA interpretation / example |
| --- | --- |
| **A01 Broken Access Control** | A standard employee can open a restricted client record intended only for an administrator. |
| **A02 Security Misconfiguration** | A system exposes diagnostic data or unsafe settings. |
| **A03 Software Supply Chain Failures** | Untrusted or vulnerable dependencies create application risk. |
| **A04 Cryptographic Failures** | Sensitive information is not properly protected in storage or transit. |
| **A05 Injection** | Untrusted input changes how a query or command is interpreted. |
| **A06 Insecure Design** | A sensitive workflow has no appropriate control or safeguard. |
| **A07 Authentication Failures** | Login or session management permits unauthorized account access. |
| **A08 Software or Data Integrity Failures** | Untrusted updates or data changes are not properly checked. |
| **A09 Security Logging and Alerting Failures** | Important security events go unrecorded or unnoticed. |
| **A10 Mishandling of Exceptional Conditions** | Unexpected failures are handled unsafely or leak information. |

### QA example: user roles

Suppose a CRM has an **admin** role (can view all clients) and an **employee** role (can view assigned clients). In an approved test environment, QA can check whether an employee account is restricted to its assigned data and whether direct URLs enforce the same rules.

**Safe testing rule:** Only test security behavior against applications and accounts you are explicitly authorized to test. Use synthetic records in staging or other approved environments. Do not probe a live client CRM.

**Intermediate later:** Input validation, XSS/SQL injection checks in authorized test environments, and session handling.

## 4. Accessibility basics

Accessibility means people with diverse abilities can perceive, understand and operate the application. The syllabus asks for four essentials.

| Topic | What it means | Beginner manual QA check |
| --- | --- | --- |
| **Keyboard navigation** | Interactive features should be usable without a mouse. | Move with Tab / Shift+Tab, activate appropriate controls with Enter/Space, verify visible focus. |
| **Screen readers** | Assistive software reads out useful content, labels, and control roles or states. | Check whether an input has a meaningful accessible name; validate with a screen reader in a proper audit. |
| **Colour contrast** | Foreground and background should provide enough contrast for readability. | Check text contrast with an accessibility tool rather than estimating from colour alone. |
| **Labels** | Inputs should have clear, programmatically associated descriptions. | Check that an Email field has an actual accessible label, not only a placeholder. |

For **WCAG 2.2 Level AA**, normal text generally needs a contrast ratio of **4.5:1**, while large text generally needs **3:1**, subject to WCAG exceptions. This is additional reference detail; the Foundation Programme only specifies the colour contrast topic.

### Beginner practice idea (not executed)

On a safe public demo or personal test page: try keyboard-only navigation; inspect focus order; check fields have clear labels; note visible contrast issues; and document what was observed without claiming a full accessibility audit.

**Intermediate later:** Lighthouse and axe browser extensions.

## 5. Basic revision

1. **Functional vs non-functional?** Functional checks what works; non-functional checks qualities such as speed, security and accessibility.
2. **Response time vs throughput?** Duration of an operation vs amount of completed work per unit time.
3. **Concurrent users vs requests/sec?** Users with overlapping activity vs processing rate.
4. **What is error rate?** Failed operations / total operations × 100%, using a stated failure definition.
5. **What is the OWASP Top 10?** Awareness categories of important web application security risks.
6. **What should a tester check for keyboard access?** Reachability, logical focus order, visible focus and operability.
7. **Why do labels matter?** They identify controls for users and assistive technologies.

## 6. Progress and next tasks

- [x] Day 12 Basic theory documented: performance terminology, OWASP awareness, accessibility fundamentals.
- [ ] Run an actual k6 load test and summarize measurements.
- [ ] Perform an authorized basic security checklist and an accessibility audit.
- [ ] Document validated findings in Jira.
- [ ] Prepare Day 12 assessment evidence and CP-5 presentation as specified in the programme.

**Official Day 12 assignment:** Run k6 against a sample API, audit a sample application for accessibility and basic security, log findings in Jira, submit under `day-12-non-functional`, and prepare CP-5 slides covering Days 11–12. These deliverables are **not yet completed**.

## References

- RoBenDevs QA Engineer Internship — 14-Day Foundation Programme, Day 12 Basic and assessment, pages 16–17.
- [OWASP Top 10:2025](https://top10.owasp.org/)
- [W3C WCAG 2.2 — Contrast (Minimum)](https://www.w3.org/TR/WCAG22/#contrast-minimum)
