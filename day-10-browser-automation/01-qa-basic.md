# Day 10 — Basic: Browser Automation Fundamentals

**Programme:** RoBenDevs QA Engineer Internship — 14-Day Foundation Programme  
**Study date:** 19 November 2026  
**Topic:** Browser Automation Fundamentals  
**Level:** Basic  
**Syllabus source:** Official Foundation Programme, Day 10 (pages 14–15)  
**Primary references:** [Playwright installation](https://playwright.dev/docs/intro) · [Playwright locators](https://playwright.dev/docs/locators) · [Playwright best practices](https://playwright.dev/docs/best-practices)

> **Study notes, not execution evidence.** Commands and test cases here are examples to run locally. No successful Playwright execution is claimed in this document.

## 1. Basic learning objectives

The official Day 10 Basic syllabus covers:

1. **When to automate:** stable, repeated and high-value checks; know what to leave manual.
2. **Browser automation:** automation drives a real browser in headed or headless mode.
3. **Playwright setup:** installation, project structure and first test.
4. **Locators:** role, text, label and test ID selectors, and why stable locators matter.
5. **Assertions:** verifying visible text, URLs, elements and states.

## 2. What is browser automation?

Browser automation uses code to simulate actions a user might perform in a real browser and compare the results with expected behavior.

Example: Navigate to a login page → enter credentials → click Log in → verify dashboard or an error message.

**Manual testing vs automation:**

| Situation | Recommended approach | Why |
| --- | --- | --- |
| Stable login smoke check | Automate | Repeatable, high business value |
| Checkout regression across releases | Automate | Repeated, critical |
| New or ambiguous UI/UX | Manual exploratory first | Human observation and changing behavior |
| One-time visual review | Manual initially | Automation may not justify maintenance cost |
| Complex repeated browser flow | Automate after requirements stabilize | Repeated execution reduces effort |

Automation **supports** manual QA; it does not replace exploratory thinking, test design or bug analysis.

## 3. Headed and headless browsers

- **Headed:** a visible browser window opens. Good for learning and investigating failures.
- **Headless:** the browser runs without a visible window. Common for pipelines and repeated test runs.

Both modes execute against a real browser engine; headless does not mean that the test is just an API call.

## 4. Install and initialize Playwright (Windows / VS Code)

### 4.1 Prerequisites

Install a supported Node.js version and verify availability in PowerShell:

```powershell
node --version
npm --version
```

### 4.2 Work in the repository's Day 10 folder

After pulling the latest repository files, run these commands from the repository root:

```powershell
git pull origin main
cd day-10-browser-automation
```

Initialize Playwright in this folder:

```powershell
npm init playwright@latest
```

For this programme, select **JavaScript** when prompted. A typical initial project uses a `tests/` directory; install browsers when prompted. If browser binaries are missing, run:

```powershell
npx playwright install
```

**Important:** The command may create `package.json`, `playwright.config.js`, sample tests and a `package-lock.json`. These are **generated locally**, not yet part of this repository unless you choose to commit them.

### 4.3 Typical structure after initialization

```text
day-10-browser-automation/
├── 01-qa-basic.md
├── package.json                  # generated locally after npm init
├── package-lock.json             # generated locally after npm init
├── playwright.config.js          # generated locally after npm init
└── tests/
    └── example.spec.js           # generated locally after npm init
```

The assessment will later use an `automation/` folder with tests organized using the Page Object Model. That structure is **planned**, not implemented yet.

## 5. Your first Playwright test

Create or edit `tests/first-test.spec.js`:

```javascript
const { test, expect } = require('@playwright/test');

test('Playwright website title is correct', async ({ page }) => {
  await page.goto('https://playwright.dev/');
  await expect(page).toHaveTitle(/Playwright/);
});
```

Explanation:
- `test(...)`: defines one test case.
- `async ({ page })`: receives an isolated browser page from the Playwright test runner.
- `page.goto(...)`: visits a URL.
- `expect(page).toHaveTitle(...)`: asserts that the page title matches the expected pattern.

Run it:

```powershell
npx playwright test tests/first-test.spec.js --project=chromium
```

Watch a visible browser:

```powershell
npx playwright test tests/first-test.spec.js --project=chromium --headed
```

Other useful commands:

```powershell
npx playwright test --ui
npx playwright show-report
```

Do **not** record PASS before actually executing the test and reviewing output.

## 6. Locators: finding elements reliably

A **locator** identifies an element to interact with or assert against.

| Locator | Example | When to use |
| --- | --- | --- |
| Role | `page.getByRole('button', { name: 'Log in' })` | Buttons, links, headings with accessible names |
| Label | `page.getByLabel('Email')` | Form inputs with accessible labels |
| Text | `page.getByText('Invalid credentials')` | User-visible messages |
| Test ID | `page.getByTestId('submit-button')` | Stable explicit automation identifiers |

The above selectors are **illustrative**: they only work if the tested page has matching roles, labels, text or `data-testid` values.

### Why stable locators matter

- Prefer selectors based on user-facing meaning or deliberate test IDs.
- Avoid brittle, deeply nested CSS or position-based selectors when possible.
- Example of brittle selector: `div:nth-child(4) > button:nth-child(2)`.
- A minor page-layout change may break brittle selectors without breaking the feature itself.

## 7. Assertions: check expected behavior

**Visible text:**

```javascript
await expect(page.getByText('Welcome')).toBeVisible();
```

**Current URL:**

```javascript
await expect(page).toHaveURL(/dashboard/);
```

**Element exists/is visible:**

```javascript
await expect(page.getByRole('button', { name: 'Save' })).toBeVisible();
```

**State of an input:**

```javascript
await expect(page.getByLabel('Email')).toBeEnabled();
```

Assertions validate results, not merely that a click or typing command happened. Playwright's web-first assertions automatically retry for a bounded period.

## 8. Connecting Day 10 to our earlier QA work

Day 3 used OrangeHRM Demo to design login acceptance criteria and manual test cases.

Possible Playwright cases to automate **after confirming the actual page locators and expected results**:

1. Valid credentials → dashboard.
2. Invalid credentials → error message.
3. Empty required fields → validation.
4. Password field → masked input state.

Use the live application's accessible labels and inputs rather than assuming the Day 3 story's wording exactly matches the deployed demo.

## 9. Basic practice checklist

- [ ] Confirm Node.js and npm work.
- [ ] Initialize Playwright inside `day-10-browser-automation`.
- [ ] Run a first test against the Playwright documentation website.
- [ ] Repeat with `--headed`.
- [ ] Identify one example each of role, text, label and test ID locators.
- [ ] Explain what a Playwright assertion checks.
- [ ] Save actual terminal results or screenshots before reporting PASS.

## 10. Next steps and assignment preview

**Intermediate:** Page Object Model, reliable waits, browser context isolation, real user actions, debugging and trace viewer.

**Advanced:** Network interception/mocking, API-assisted UI tests, visual comparison, cross-browser/device testing.

**Official practical assignment:** Automate **10 scenarios from Day 3 test cases** using the Page Object Model; include **3 negative cases**, **1 file-upload test**, and **1 API-error mocking test**.

**Official submission:** Pull request with the Playwright project under an `automation` folder and a short README; CP-4 presentation covering Days 9–10.

**Current status:** Day 10 Basic study notes prepared. Playwright installation and actual browser execution remain for local practical verification.
