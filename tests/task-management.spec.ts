import { test, expect } from "@playwright/test";
import { TaskCreationPage } from "../pom/task-creation-page";

const BASE_URL = "https://solara-next-task.netlify.app/";
let taskCreationPage: TaskCreationPage;

test.beforeEach(async ({ page }) => {
  await page.route("**//*.github.com/**", (route) => route.abort());
  taskCreationPage = new TaskCreationPage(page);
  await page.goto(BASE_URL);
});

test.describe("Task creation", () => {
  test.beforeEach(async ({ page }) => {
    await page.getByRole("button", { name: "Add Task" }).click({ force: true });
  });

  test("TC01-Create task with all valid fields", async ({ page }) => {
    await taskCreationPage.createTask(
      "Buy Milk",
      "2 liters",
      "2025-08-01T12:00",
      "office",
      "#7ACCFA"
    );

    const taskTitle = page.getByRole("heading", { name: "Buy milk" });
    await expect(taskTitle).toBeVisible();
  });

  test("TC02-Create task with only required fields", async ({ page }) => {
    await taskCreationPage.createTask("Call Mom");

    await expect(page.getByRole("heading", { name: "Call Mom" })).toBeVisible();
  });

  test("TC03-Attempt create with empty name", async ({ page }) => {
    await taskCreationPage.createTask("");

    await expect(page.getByText("Task Name is required")).toBeVisible();
  });

  test("TC04-Create task with special characters in name", async ({ page }) => {
    await taskCreationPage.createTask("Fix bug#123!@Home");

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
    await taskCreationPage.createTask(
      "Buy Milk",
      "2 liters",
      "2025-08-01T12:00",
      "office",
      "#7ACCFA"
    );
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

  test("TC07-Attempt to save with empty name", async ({ page }) => {
    await page.getByRole("button", { name: "Task Menu" }).click();
    await page.getByRole("menuitem", { name: "Edit" }).click();
    await page.getByRole("textbox", { name: "Name" }).fill("");

    const saveButton = page.locator("button", { hasText: "Save" });
    await expect(saveButton).toBeDisabled();
  });

  test("TC08-Attempt to save by pressing Enter Key", async ({ page }) => {
    await page.getByRole("button", { name: "Task Menu" }).click();
    await page.getByRole("menuitem", { name: "Edit" }).click();
    await page.getByRole("textbox", { name: "Name" }).fill("Buy bread");
    await page.keyboard.press("Enter");

    await expect(
      page.getByRole("heading", { name: "Buy bread" })
    ).not.toBeVisible();
  });
});

test.describe("Task completion", () => {
  test.beforeEach(async ({ page }) => {
    await page.getByRole("button", { name: "Add Task" }).click({ force: true });
    await taskCreationPage.createTask(
      "Buy Milk",
      "2 liters",
      "2025-08-01T12:00",
      "office",
      "#7ACCFA"
    );
  });

  test("TC09-Mark task as done", async ({ page }) => {
    await page.getByRole("button", { name: "Task Menu" }).click();
    await page.getByRole("menuitem", { name: "Mark as done" }).click();

    const taskName = page.getByRole("heading", { name: "Buy milk" });
    await expect(taskName).toHaveCSS("text-decoration", /line-through/);
  });

  test("TC10-Unmark completed task (mark as not done)", async ({ page }) => {
    await page.getByRole("button", { name: "Task Menu" }).click();
    await page.getByRole("menuitem", { name: "Mark as done" }).click();
    await page.getByRole("button", { name: "Task Menu" }).click();
    await page.getByRole("menuitem", { name: "Mark as not done" }).click();

    const taskName = page.getByRole("heading", { name: "Buy milk" });
    await expect(taskName).not.toHaveCSS("text-decoration", /line-through/);
  });
});

test.describe("Task deletion", () => {
  test.beforeEach(async ({ page }) => {
    await page.getByRole("button", { name: "Add Task" }).click({ force: true });
    taskCreationPage.createTask(
      "Buy Milk",
      "2 liters",
      "2025-08-01T12:00",
      "office",
      "#7ACCFA"
    );
  });

  test("TC11-Delete task with confirmation)", async ({ page }) => {
    await page.getByRole("button", { name: "Task Menu" }).click();
    await page.getByRole("menuitem", { name: "Delete" }).click();
    await page.getByRole("button", { name: "Confirm Delete" }).click();

    const taskTitle = page.getByRole("heading", { name: "Buy milk" });
    await expect(taskTitle).not.toBeVisible();
  });

  test("TC12-Cancel deletion in confirmation dialog", async ({ page }) => {
    await page.getByRole("button", { name: "Task Menu" }).click();
    await page.getByRole("menuitem", { name: "Delete" }).click();
    await page.getByRole("button", { name: "Cancel" }).click();

    const taskTitle = page.getByRole("heading", { name: "Buy milk" });
    await expect(taskTitle).toBeVisible();
  });
});
