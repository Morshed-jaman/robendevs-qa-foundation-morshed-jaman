# Day 10 — Intermediate: Browser Automation with Playwright

**Programme:** RoBenDevs QA Engineer Internship — 14-Day Foundation Programme  
**Study date:** 19 November 2026  
**Topic:** Browser Automation Fundamentals  
**Level:** Intermediate  
**Reference:** Official Foundation Programme, Day 10, page 15  
**Previous notes:** [01 — Basic: Browser Automation Fundamentals](01-qa-basic.md)

> **Learning notes, not executed-test evidence.** The JavaScript examples below illustrate Playwright patterns. Real execution results, screenshots, and findings belong in the practical assessment.

## 1. Learning objectives

The official Day 10 Intermediate syllabus includes:

1. **Page Object Model (POM):** organizing tests so they stay readable and maintainable.
2. **Waiting correctly:** Playwright auto-waiting and avoiding arbitrary delays.
3. **Browser contexts:** independent sessions, saved login state, and multiple users.
4. **Real browser actions:** forms, dropdowns, uploads, downloads, new tabs, and pop-ups.
5. **Debugging:** Trace Viewer, screenshots, and videos for failed tests.

The examples use **JavaScript** with **`@playwright/test`**, consistent with Day 10 Basic.

## 2. Page Object Model (POM)

**Meaning:** A page object is a JavaScript class that holds locators and reusable page actions. Test files describe **what to test** without repeating the browser interaction details.

**Benefits:**
- Keep test cases easy to read.
- Reuse page actions across multiple tests.
- Change one locator in one place when the UI changes.
- Separate test assertions and application workflows.

### 2.1 Example project layout

```text
day-10-browser-automation/
├── 01-qa-basic.md
├── 02-qa-intermediate.md
└── automation/                    # proposed practical project
    ├── pages/
    │   └── TodoPage.js
    ├── tests/
    │   └── todo.spec.js
    ├── fixtures/
    ├── playwright.config.js
    └── package.json
```

The `automation/` structure above is a **proposed future layout**, not a claim that these files already exist.

### 2.2 Page object: `automation/pages/TodoPage.js`

```javascript
class TodoPage {
  constructor(page) {
    this.page = page;
    this.newTodo = page.getByPlaceholder('What needs to be done?');
  }

  async goto() {
    await this.page.goto('https://demo.playwright.dev/todomvc/');
  }

  async addTodo(text) {
    await this.newTodo.fill(text);
    await this.newTodo.press('Enter');
  }
}

module.exports = { TodoPage };
```

### 2.3 Test: `automation/tests/todo.spec.js`

```javascript
const { test, expect } = require('@playwright/test');
const { TodoPage } = require('../pages/TodoPage');

test('add a new todo', async ({ page }) => {
  const todoPage = new TodoPage(page);
  await todoPage.goto();
  await todoPage.addTodo('Prepare test cases');

  await expect(
    page.getByText('Prepare test cases', { exact: true })
  ).toBeVisible();
});
```

**QA takeaway:** If the application's todo input changes, update the locator inside `TodoPage`; test cases can keep using `addTodo()`.

## 3. Auto-waiting and reliable assertions

Playwright performs **actionability checks** before actions such as `click()` and `fill()`, and its web-first assertions automatically retry until the condition is met or times out.

### 3.1 Incorrect approach: unnecessary fixed wait

```javascript
await page.waitForTimeout(5000);
await page.getByRole('button', { name: 'Save' }).click();
```

**Why it is risky:** The page might be ready much sooner—or may still not be ready after five seconds.

### 3.2 Better approach

```javascript
const saveButton = page.getByRole('button', { name: 'Save' });

await expect(saveButton).toBeEnabled();
await saveButton.click();
await expect(page.getByText('Saved successfully')).toBeVisible();
```

These selectors are illustrative; the application must expose matching accessible names and messages.

**QA takeaway:** Wait for meaningful conditions, not arbitrary elapsed time.

### 3.3 Useful assertions

| Assertion | Validates |
| --- | --- |
| `await expect(locator).toBeVisible()` | Element is visible |
| `await expect(locator).toBeEnabled()` | Element is enabled |
| `await expect(locator).toHaveText('Saved')` | Element text matches |
| `await expect(page).toHaveURL(/dashboard/)` | Current URL matches |
| `await expect(locator).toHaveValue('Alice')` | Input value matches |

## 4. Browser contexts and session isolation

A **browser context** behaves like an independent browser profile. Playwright Test normally creates isolated contexts for tests.

### 4.1 Two users in one test

```javascript
const { test, expect } = require('@playwright/test');

test('admin and customer have separate sessions', async ({ browser }) => {
  const adminContext = await browser.newContext();
  const customerContext = await browser.newContext();

  try {
    const adminPage = await adminContext.newPage();
    const customerPage = await customerContext.newPage();

    // Navigate and log in with separate authorized test accounts.
    // Verify each user's permitted actions and visible data.
  } finally {
    await adminContext.close();
    await customerContext.close();
  }
});
```

**QA scenarios:** Verify that a customer cannot see another customer's private records, or that admin-specific controls do not appear for ordinary users.

### 4.2 Saved login state

After a test account is authenticated, a reusable session can be saved:

```javascript
await page.context().storageState({ path: 'playwright/.auth/user.json' });
```

Later, a test suite can load it:

```javascript
test.use({ storageState: 'playwright/.auth/user.json' });
```

The `playwright/.auth/` directory must exist first and its files must be **gitignored** because they may contain authentication cookies or tokens. Do not share real credentials or session state. For the initial practical, manual login within each test is also acceptable.

## 5. Real browser interactions

Use these as **independent examples** after adapting locators to the actual application. They are not one runnable end-to-end test.

### 5.1 Forms

```javascript
await page.getByLabel('Full name').fill('Test User');
await page.getByLabel('Email').fill('test@example.com');
await page.getByRole('button', { name: 'Register' }).click();
```

### 5.2 Dropdown menus

For a native HTML `<select>`:

```javascript
await page.getByLabel('Country').selectOption('BD');
```

For a custom JavaScript dropdown, click the control and its visible option instead of assuming `selectOption()` will work.

### 5.3 File upload

```javascript
await page.getByLabel('Upload document')
  .setInputFiles('fixtures/sample.pdf');
```

This requires a real `fixtures/sample.pdf` test fixture and a compatible file input on the page. Use synthetic files without personal data.

### 5.4 File download

```javascript
const downloadPromise = page.waitForEvent('download');
await page.getByRole('button', { name: 'Download' }).click();
const download = await downloadPromise;

console.log(download.suggestedFilename());
// Optionally save with download.saveAs() to an existing folder.
```

**Important:** Register the download wait **before** clicking, otherwise the event may be missed.

### 5.5 New tab or pop-up window

```javascript
const popupPromise = page.waitForEvent('popup');
await page.getByRole('link', { name: 'Open details' }).click();

const popup = await popupPromise;
await expect(popup).toHaveURL(/details/);
```

The popup must be initiated by the current page for `page.waitForEvent('popup')` to detect it.

### 5.6 JavaScript dialog

```javascript
page.once('dialog', async dialog => {
  await dialog.accept();
});

await page.getByRole('button', { name: 'Delete' }).click();
```

Register the handler before the action, then verify the expected result after accepting the confirmation.

## 6. Debugging failures

When a Playwright test fails, inspect **what happened**, **where it failed**, and **why**.

### 6.1 Run tests in debug mode

```powershell
npx playwright test --debug
```

Playwright Inspector lets you examine steps and locators.

### 6.2 Enable a trace

Run locally:

```powershell
npx playwright test --trace on
```

Or configure diagnostics inside `playwright.config.js`:

```javascript
const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  use: {
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
});
```

These are example configuration settings; merge them with your existing config rather than replacing unrelated configuration.

### 6.3 Trace Viewer

A trace helps investigate:
- Ordered test actions.
- Locators used.
- Before/after DOM snapshots.
- Console and network information.
- Screenshots around failures.

Run the tests, then inspect the generated trace via the HTML report or:

```powershell
npx playwright show-trace path\to\trace.zip
```

The trace path depends on the test run and reporter output.

### 6.4 Screenshot and video

```javascript
await page.screenshot({ path: 'screenshot.png', fullPage: true });
```

A screenshot shows one state; a retained video helps show the sequence. A trace is often the most useful diagnostic for understanding an automated failure. Be careful that reports and artifacts do not leak passwords or private data.

## 7. Connecting Intermediate topics to earlier QA lessons

In Day 3, we worked with login requirements and functional, positive, negative, and UI checks.

| Earlier manual test idea | Intermediate automation skill |
| --- | --- |
| Successful login | POM plus URL assertion |
| Incorrect credentials | POM plus error-message assertion |
| Required fields | Auto-waiting and validation assertions |
| Separate user roles | Browser-context isolation |
| File attachment scenario | File-upload interaction |
| Bug investigation | Trace Viewer and screenshots |

Use the actual application's requirements, locators and test data. A scripted example is **not proof** of a tested feature until executed.

## 8. Practice checklist

- [ ] Explain why Page Object Model reduces duplicated code.
- [ ] Create a page class and use it in one test.
- [ ] Explain Playwright auto-waiting versus a fixed sleep.
- [ ] Describe how two browser contexts stay isolated.
- [ ] Try one form, dropdown, file upload and download on a suitable demo application.
- [ ] Learn to capture a trace and inspect an intentionally failing test.
- [ ] Record real execution evidence only after running the tests.

## 9. Next level and official assessment

**Advanced Day 10:** network interception/mocking, API-assisted UI tests, visual comparisons, Chromium/Firefox/WebKit, and mobile emulation.

**Official practical:** Automate 10 scenarios from Day 3 using the Page Object Model. Include at least three negative cases, one file upload, and one mocked API error.

**Submission:** A pull request containing the Playwright project in an `automation` folder with a short README, plus CP-4 slides in `presentations` covering Days 9–10.

**Current status:** Intermediate study notes prepared. No Playwright execution results or assessment completion is claimed.

## References

- [Official Playwright — Page Object Model](https://playwright.dev/docs/pom)
- [Official Playwright — Auto-waiting](https://playwright.dev/docs/actionability)
- [Official Playwright — Browser Contexts](https://playwright.dev/docs/browser-contexts)
- [Official Playwright — Authentication](https://playwright.dev/docs/auth)
- [Official Playwright — Downloads](https://playwright.dev/docs/downloads)
- [Official Playwright — Trace Viewer](https://playwright.dev/docs/trace-viewer)
