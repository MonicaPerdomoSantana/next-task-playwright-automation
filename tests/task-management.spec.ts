import { test, expect } from "@playwright/test";

const BASE_URL = "https://solara-next-task.netlify.app/";

test.beforeEach(async ({ page }) => {
  await page.goto(BASE_URL);
});

test.describe("Task creation", () => {
  test.beforeEach(async ({ page }) => {
    await page.getByRole("button", { name: "Add Task" }).click({ force: true });
  });

  test("TC01-Create task with all valid fields", async ({ page }) => {
    await page.getByRole("textbox", { name: "Task Name" }).fill("Buy milk");
    await page.getByRole("textbox", { name: "Description" }).fill("2 liters");
    await page
      .getByRole("textbox", { name: "Task Deadline" })
      .fill("2025-08-01T12:00");
    await page.getByRole("combobox").click();
    await page.getByRole("img", { name: "office" }).click();
    await page.keyboard.press("Escape");
    await page.locator("button", { hasText: "Color" }).click();
    await page.getByRole("button", { name: "Select color - #7ACCFA" }).click();
    await page.getByRole("button", { name: "Create Task" }).click();

    const taskTitle = page.getByRole("heading", { name: "Buy milk" });
    await expect(taskTitle).toBeVisible();
  });

  test("TC02-Create task with only required fields", async ({ page }) => {
    await page.getByRole("textbox", { name: "Task Name" }).fill("Call Mom");
    await page.getByRole("button", { name: "Create Task" }).click();

    await expect(page.getByRole("heading", { name: "Call Mom" })).toBeVisible();
  });

  test("TC03-Attempt create with empty name", async ({ page }) => {
    await page.getByRole("textbox", { name: "Task Name" }).fill("");
    await page.getByRole("button", { name: "Create Task" }).click();

    await expect(page.getByText("Task Name is required")).toBeVisible();
  });

  test("TC04-Create task with special characters in name", async ({ page }) => {
    await page
      .getByRole("textbox", { name: "Task Name" })
      .fill("Fix bug#123!@Home");
    await page.getByRole("button", { name: "Create Task" }).click();

    await expect(
      page.getByRole("heading", { name: "Fix bug#123!@Home" })
    ).toBeVisible();
  });

  test("TC05-Attempt to submit by pressing Enter key", async ({ page }) => {
    await page.getByRole("textbox", { name: "Task Name" }).fill("Buy Eggs");
    await page.keyboard.press("Enter");

    await expect(
      page.getByRole("heading", { name: "Buy Eggs" })
    ).not.toBeVisible();
  });
});

test.describe("Task edition", () => {
  test.beforeEach(async ({ page }) => {
    await page.getByRole("button", { name: "Add Task" }).click({ force: true });
    await page.getByRole("textbox", { name: "Task Name" }).fill("Buy milk");
    await page.getByRole("textbox", { name: "Description" }).fill("2 liters");
    await page
      .getByRole("textbox", { name: "Task Deadline" })
      .fill("2025-08-01T12:00");
    await page.getByRole("combobox").click();
    await page.getByRole("img", { name: "office" }).click();
    await page.keyboard.press("Escape");
    await page.locator("button", { hasText: "Color" }).click();
    await page.getByRole("button", { name: "Select color - #7ACCFA" }).click();
    await page.getByRole("button", { name: "Create Task" }).click();
  });

  test("TC06-Edit all fields with valid data", async ({ page }) => {
    await page.getByRole("button", { name: "Task Menu" }).click();
    await page.getByRole("menuitem", { name: "Edit" }).click();
    await page.getByRole("textbox", { name: "Name" }).fill("Buy bread");
    await page
      .getByRole("textbox", { name: "Description" })
      .fill("Whole grain loaf");
    await page
      .getByRole("textbox", { name: "Deadline date" })
      .fill("2025-08-05T12:00");
    await page.getByRole("combobox").click();
    await page.getByRole("img", { name: "office" }).click();
    await page.getByRole("img", { name: "muscle" }).click();
    await page.keyboard.press("Escape");
    await page.locator("button", { hasText: "Color" }).click();
    await page.getByRole("button", { name: "Select color - #3AE836" }).click();
    await page.locator("button", { hasText: "Save" }).click();

    const taskTitle = page.getByRole("heading", { name: "Buy bread" });
    await expect(taskTitle).toBeVisible();

    const div = page.locator('[data-testid="task-container"]');
    await expect(div).toHaveCSS("background-color", "rgb(58, 232, 54)");
  });
});
