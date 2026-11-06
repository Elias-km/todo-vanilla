
import { test, expect } from '@playwright/test';

test('loads initial tasks and preserves them on reload', async ({ page }) => {
  await page.goto('./');

  const tasks = page.locator('[data-todo]');

  await expect(page.getByRole('heading', {
    name: 'ToDo List Vanilla',
  })).toBeVisible();

  await expect(tasks).toHaveText([
    'Plan my week',
    'Buy groceries',
    'Finish my personal project',
  ]);

  await page.reload();

  await expect(tasks).toHaveCount(3);
});

test('adds, deletes, undoes and redoes tasks', async ({ page }) => {
  await page.goto('./');

  const tasks = page.locator('[data-todo]');

  // Open the add-task dialog
  await page.getByRole('button', { name: 'ADD' }).click();

  const dialog = page.getByRole('dialog', {
    name: 'Add item to list',
  });

  await expect(dialog).toBeVisible();

  // Create a new task
  await dialog.getByRole('textbox').fill('Review Playwright tests');
  await dialog.getByRole('button', { name: 'ADD' }).click();

  await expect(dialog).toBeHidden();
  await expect(tasks).toHaveCount(4);

  // Select two tasks
  await page.getByRole('button', {
    name: 'Plan my week',
  }).click();

  await page.getByRole('button', {
    name: 'Review Playwright tests',
  }).click();

  // Delete selected tasks
  const deleteButton = page.getByRole('button', { name: 'DELETE' });

  await expect(deleteButton).toBeEnabled();
  await deleteButton.click();

  await expect(tasks).toHaveCount(2);

  // Undo
  await page.getByRole('button', { name: 'Undo' }).click();
  await expect(tasks).toHaveCount(4);

  // Redo
  await page.getByRole('button', { name: 'Redo' }).click();
  await expect(tasks).toHaveCount(2);

  // Verify persistence
  await page.reload();
  await expect(tasks).toHaveCount(2);

  // History must reset after reload
  await expect(page.getByRole('button', {
    name: 'Undo',
  })).toBeDisabled();
});
