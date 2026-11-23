
const { test, expect } = require('@playwright/test');

test.beforeEach(async ({ page }) => {
  await page.goto('https://demo.playwright.dev/todomvc/');
});

// TEST 01 — Smoke
test('Add a todo @smoke', async ({ page }) => {
  const input = page.getByPlaceholder('What needs to be done?');

  await input.fill('Learn Playwright');
  await input.press('Enter');

  await expect(page.getByTestId('todo-title'))
    .toHaveText(['Wrong Task Name']);
});

// TEST 02 — Regression
test('Add multiple todos @regression', async ({ page }) => {
  const input = page.getByPlaceholder('What needs to be done?');

  await input.fill('Learn Playwright');
  await input.press('Enter');

  await input.fill('Practice CI/CD');
  await input.press('Enter');

  await expect(page.getByTestId('todo-title'))
    .toHaveText(['Learn Playwright', 'Practice CI/CD']);
});

// TEST 03 — Regression
test('Complete a todo @regression', async ({ page }) => {
  const input = page.getByPlaceholder('What needs to be done?');

  await input.fill('Learn Playwright');
  await input.press('Enter');

  const todo = page.getByTestId('todo-item')
    .filter({ hasText: 'Learn Playwright' });

  await todo.getByRole('checkbox').check();

  await expect(todo).toHaveClass(/completed/);
});
