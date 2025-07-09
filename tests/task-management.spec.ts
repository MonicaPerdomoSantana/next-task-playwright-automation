import { test, expect } from "@playwright/test";

test("TC01-Create task with all valid fields", async ({ page }) => {
  await page.goto("https://solara-next-task.netlify.app/");
  await page.getByRole("button", { name: "Add Task",  }).click({ force: true });
  await page.getByRole('textbox', { name: 'Task Name' }).fill("Buy milk")
  await page.getByRole('textbox', { name: 'Description' }).fill("2 liters")
  await page.getByRole('textbox', { name: 'Task Deadline' }).fill("2025-08-01T12:00")
  await page.getByRole('combobox').click();
  await page.getByRole('img', { name: 'office' }).click();
  await page.keyboard.press('Escape')
  await page.locator('button', { hasText: 'Color' }).click();
  await page.getByRole('button', { name: 'Select color - #7ACCFA' }).click();
  await page.getByRole('button', { name: 'Create Task' }).click();

  await expect(page.getByRole('heading', { name: 'Buy milk' })).toBeVisible();
});
