# Day 10 — Advanced: Network Mocking, API-Assisted UI Tests, Visual Testing and Browser Coverage

**Programme:** RoBenDevs QA Engineer Internship — 14-Day Foundation Programme  
**Study date:** 19 November 2026  
**Topic:** Browser Automation Fundamentals  
**Level:** Advanced  
**Source:** Official Foundation Programme, Day 10, page 15  
**Previous lessons:** [01 — Basic](01-qa-basic.md) · [02 — Intermediate](02-qa-intermediate.md)

> **Study notes only.** All URLs, expected messages, accounts, and test flows below are examples to adapt to a real local/test application. No Playwright test execution, screenshot baseline approval, or assessment completion is claimed.

## 1. Official learning objectives

The official Day 10 Advanced syllabus covers:

1. **Network control:** intercept network requests and mock API responses to test error states.
2. **API-assisted UI tests:** create test data through an API to make browser testing faster.
3. **Visual comparisons:** identify UI layout changes using screenshot tests.
4. **Cross-browser and device runs:** Chromium, Firefox, WebKit, and mobile emulation.

These build on Day 10 Basic (locators, assertions) and Intermediate (Page Object Model, browser contexts, debugging).

## 2. Network interception and mocking

### 2.1 Meaning

The browser issues requests for data. With Playwright, a test can observe or intercept matched requests before the server responds.

- `route.fulfill()`: replace a real server response with a chosen mocked response.
- `route.continue()`: allow the matched request to continue, optionally with changes.
- `route.abort()`: make the request fail at the network level.

**Why QA uses it:** Test server errors, empty responses, unexpected values, and network outages in a controlled and reproducible way without deliberately breaking a shared backend.

### 2.2 Mock an API error (example only)

Example application assumptions:
- Browser page: `http://localhost:3000/dashboard`
- The page calls `GET /api/users` after loading
- The UI is designed to display `Unable to load users` on an HTTP 500 response

```javascript
const { test, expect } = require('@playwright/test');

test('shows error state when users API returns 500', async ({ page }) => {
  await page.route('**/api/users', async (route) => {
    await route.fulfill({
      status: 500,
      contentType: 'application/json',
      body: JSON.stringify({ message: 'Internal Server Error' }),
    });
  });

  await page.goto('http://localhost:3000/dashboard');

  await expect(
    page.getByText('Unable to load users')
  ).toBeVisible();
});
```

Register the route **before navigation** so the relevant request is intercepted. Change the selector, URL, and error text to match your application.

### 2.3 Mock an empty response

```javascript
await page.route('**/api/users', async (route) => {
  await route.fulfill({
    status: 200,
    json: [],
  });
});
```

**Expected result to investigate:** Does the UI show a proper empty state (e.g., `No users found`) instead of an unhelpful blank panel?

### 2.4 Simulate a network failure

```javascript
await page.route('**/api/users', async (route) => {
  await route.abort('failed');
});
```

**QA checks:** A useful error message appears; loading stops; retry works if specified; no stale or misleading data is shown.

**Important:** A returned `500` HTTP response is **not** the same as a network failure. Use `fulfill({ status: 500 })` to test error responses and `abort()` to test connection failures.

## 3. API-assisted UI testing

### 3.1 Why use APIs to prepare test data?

A test does not always need to fill every setup form through the browser. It can create required data by calling an API, then verify the resulting UI.

**Flow:**

```text
API request creates disposable test data
                 |
                 v
Browser opens the relevant screen
                 |
                 v
Playwright verifies user-visible results
                 |
                 v
Cleanup removes the disposable data
```

### 3.2 Example: create an order, then verify it in the UI

Assume a **dedicated test application** exposes an authenticated `POST /api/orders` endpoint and a matching `/orders` page:

```javascript
const { test, expect } = require('@playwright/test');

test('created order is visible in UI', async ({ request, page }) => {
  const createResponse = await request.post(
    'http://localhost:3000/api/orders',
    {
      data: { product: 'QA Demo Item', quantity: 1 },
    }
  );

  expect(createResponse.ok()).toBeTruthy();

  const order = await createResponse.json();

  try {
    await page.goto('http://localhost:3000/orders');
    await expect(page.getByText('QA Demo Item')).toBeVisible();
  } finally {
    // Adapt to your application's actual cleanup endpoint.
    // Do not assume DELETE exists or call it in production.
    // If supported, delete order.id from the disposable test environment.
  }
});
```

**Important:** The sample only demonstrates the workflow. If the API needs a token or the UI needs login, configure test credentials/session safely. Make sure the data is visible to the same test user and clean up disposable data.

### 3.3 UI setup versus API setup

| Setup style | Best use |
| --- | --- |
| UI-only | Verify that the actual user workflow (e.g., registration form) works |
| API-assisted | Prepare state quickly for a separate UI behavior |
| Mixed | Prepare prerequisite data by API, then test the critical browser interactions |

Do not replace a user-facing workflow with API setup when the actual **UI workflow is what the requirement asks you to test**.

## 4. Visual regression testing

### 4.1 What is visual comparison?

Playwright can capture a page or an element as a screenshot, store an approved baseline, and compare a later screenshot against that baseline.

```text
Approved baseline screenshot
             |
             v
Current screenshot
             |
             v
Compare differences
             |
       PASS or investigate
```

### 4.2 Example: compare screenshots

```javascript
const { test, expect } = require('@playwright/test');

test('login page visual appearance', async ({ page }) => {
  await page.goto('http://localhost:3000/login');
  await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible();

  await expect(page).toHaveScreenshot('login-page.png');
});
```

First create and manually **review** the expected baseline:

```powershell
npx playwright test --update-snapshots
```

Then run the tests without the update flag:

```powershell
npx playwright test
```

**QA checks:** Unexpected spacing, missing buttons, changed typography, image shifts, cropped text, broken responsive layout, or altered colors.

### 4.3 Reducing false positives

Visual comparisons can differ across operating systems, fonts, browser versions, animations, time-sensitive content, and dynamically loaded images.

Good practices:
- Use a stable environment and viewport.
- Wait for known UI readiness.
- Use consistent test data.
- Hide or mask truly nondeterministic regions when appropriate.
- Review snapshot changes; **never blindly approve a failing baseline**.

A visual screenshot check does **not** prove functional behavior, accessibility, or semantic correctness. Combine it with ordinary assertions.

## 5. Cross-browser testing

A web app can behave differently in different browser engines.

| Playwright browser | Common coverage |
| --- | --- |
| `chromium` | Chromium engine |
| `firefox` | Firefox engine |
| `webkit` | WebKit engine, useful for Safari-like behavior |

### 5.1 Multi-browser configuration

Inside the Playwright project, example `playwright.config.js`:

```javascript
const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  projects: [
    { name: 'chromium', use: { browserName: 'chromium' } },
    { name: 'firefox',  use: { browserName: 'firefox' } },
    { name: 'webkit',   use: { browserName: 'webkit' } },
  ],
});
```

Run all configured projects:

```powershell
npx playwright test
```

Run one project:

```powershell
npx playwright test --project=firefox
```

Install supported browser binaries when needed:

```powershell
npx playwright install
```

**QA use:** Catch browser-specific rendering and interaction differences (e.g., focus, input behavior, CSS layout, navigation).

## 6. Mobile device emulation

Playwright provides predefined device descriptors that apply screen dimensions, user agent and device-specific options.

### 6.1 Example: add an emulated mobile project

```javascript
const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile-webkit', use: { ...devices['iPhone 13'] } },
  ],
});
```

Run the emulated mobile project:

```powershell
npx playwright test --project=mobile-webkit
```

**QA checks:** Navigation menu behavior, responsive layout, clickable target sizes, form readability, overflow, and orientation-related UI differences.

**Important limitation:** Mobile device emulation is **not the same as testing on a physical phone**. Real-device verification may still be needed for browser/platform-specific behavior and hardware features.

## 7. Linking Advanced topics to our Day 3 scenarios

| Test idea | Advanced technique | Expected check |
| --- | --- | --- |
| Login service fails | Mock HTTP 500 | User sees a meaningful error |
| Required profile data already exists | API-assisted setup | UI renders correct values |
| Login form unexpectedly changes | Screenshot comparison | Investigate visual difference |
| Dashboard works across browsers | Multiple browser projects | Same functional behavior |
| Login on a narrow screen | Device emulation | Usable responsive UI |

**Note:** These are proposed additional exercises. They must be reconciled with the real Day 3 test cases and actual app functionality before claiming they are completed.

## 8. Intermediate-to-Advanced mini checklist

- [ ] Understand `route.fulfill()`, `route.continue()`, and `route.abort()`.
- [ ] Mock one API `500` response and verify its expected UI message.
- [ ] Describe one use case for API-assisted test setup.
- [ ] Create and review a baseline screenshot; compare the next run.
- [ ] Configure projects for Chromium, Firefox, and WebKit.
- [ ] Try a mobile-emulated test and inspect responsive behavior.
- [ ] Record actual output and evidence only after executing tests.

## 9. Official Day 10 practical assessment

According to the foundation programme, the practical requires:

1. Automate **10 scenarios from Day 3 test cases** using the **Page Object Model**.
2. Include **3 negative cases**.
3. Include **1 file-upload test**.
4. Include **1 test that mocks an API error**.
5. Submit a **pull request** with the Playwright project in an **`automation` folder**, including a short **README**.
6. Prepare **CP-4 slides** covering Days 9–10 in the `presentations` folder.

**Status:** Day 10 Advanced learning notes prepared. Browser automation execution, assessment evidence, and pull-request submission are not yet complete.

## 10. References

- [Playwright — Network](https://playwright.dev/docs/network)
- [Playwright — API Testing](https://playwright.dev/docs/api-testing)
- [Playwright — Visual Comparisons](https://playwright.dev/docs/test-snapshots)
- [Playwright — Projects](https://playwright.dev/docs/test-projects)
- [Playwright — Emulation](https://playwright.dev/docs/emulation)
- [Playwright — Browsers](https://playwright.dev/docs/browsers)
