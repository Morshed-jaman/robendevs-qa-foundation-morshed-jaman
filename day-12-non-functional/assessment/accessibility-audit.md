# Day 12 — Accessibility Audit Report

## Scope and environment
- **Application:** Intentionally flawed local Sample CRM Login page (training only; not a company or production CRM).
- **Page:** `assessment/accessibility/index.html`, served locally using VS Code Live Server at `http://127.0.0.1:5500/day-12-non-functional/assessment/accessibility/index.html`.
- **Browser:** Google Chrome on Windows.
- **Tools:** Chrome Lighthouse and axe DevTools (axe-core 4.13.0; WCAG 2.1 AA selected).
- **Audit date:** 25 November 2026.

## Results summary

| Check | Observed result | Interpretation |
| --- | --- | --- |
| Lighthouse accessibility | **88/100** | Automated accessibility score; not proof of full WCAG compliance |
| Lighthouse contrast check | **Failed** | Insufficient foreground/background contrast |
| Lighthouse main landmark | **Best-practice warning** | Document does not have a main landmark; track separately |
| axe DevTools | **1 automated issue** | 1 serious, 0 critical |
| axe contrast issue | **Confirmed** | Normal-sized helper text contrast below WCAG AA minimum |

## Confirmed finding — A11Y-001: Low contrast on login helper text

**Jira bug:** [QP-7 — Sample CRM login helper text fails WCAG AA contrast](https://g-team-qfw281wn.atlassian.net/browse/QP-7)

- **Affected HTML:** `<p class="hint">Please enter your credentials.</p>`
- **Foreground:** `#dddddd`
- **Background:** `#ffffff`
- **Measured contrast (axe):** **1.35:1**
- **Expected contrast:** **at least 4.5:1** for normal text
- **Text size:** 16 px, normal weight
- **Applicable requirement:** **WCAG 2.1 success criterion 1.4.3 — Contrast (Minimum), Level AA**
- **axe impact classification:** Serious
- **Current QA status:** Reported. A fix and retest have **not** been confirmed.

### Reproduction steps

1. Serve the training page locally and open it in Chrome.
2. Open Developer Tools → **axe DevTools**.
3. Run a full-page accessibility scan.
4. Expand **Elements must meet minimum color contrast ratio thresholds**.
5. Inspect the flagged `p.hint` helper text and its contrast measurement.

### Expected versus actual
- **Expected:** Helper text meets WCAG 1.4.3 AA normal-text contrast minimum of 4.5:1.
- **Actual:** axe measured 1.35:1, so the test **fails**.

### User impact
Low-vision users may find the helper text difficult to read.

### Suggested remediation and retest
Use a sufficiently dark foreground colour, confirm the computed contrast meets the minimum, and rerun axe and Lighthouse. Record actual retest results before marking QP-7 fixed.

## Additional observation — Main landmark
Lighthouse reported that the sample document lacks a `main` landmark. This is recorded as a **best-practice observation**, not combined with the independently verified contrast violation. Its accessibility impact should be evaluated before reporting it as a separate WCAG defect.

## Evidence
- [axe screenshot](reports/axe-accessibility.png)
- [Lighthouse screenshot](reports/lighthouse-accessibility.png)
- [Sample HTML](accessibility/index.html)
- [Jira issue QP-7](https://g-team-qfw281wn.atlassian.net/browse/QP-7)

**Privacy note:** Share only sanitized screenshots and never include passwords or real credentials in public repository evidence.

## Assessment status
- k6 local-API load test: completed and reported separately in [performance-report.md](performance-report.md).
- Lighthouse and axe scans: completed with the results documented above.
- Jira bug: QP-7 created.
- Accessibility remediation/retest: pending.
- Day 12 security checklist and CP-5: not evidenced here; do not treat them as completed.

## Reference
[W3C WCAG 2.1 — Success Criterion 1.4.3 Contrast (Minimum)](https://www.w3.org/TR/WCAG21/#contrast-minimum)
