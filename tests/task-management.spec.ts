import { test, expect } from "@playwright/test";
import { TaskCreationPage } from "../pom/task-creation-page";
import { TaskEditionPage } from "../pom/task-edition-page";

const BASE_URL = "https://solara-next-task.netlify.app/";
let taskCreationPage: TaskCreationPage;
let taskEditionPage: TaskEditionPage;

test.beforeEach(async ({ page }) => {
    await page.route("**//*.github.com/**", (route) => route.abort());
    taskCreationPage = new TaskCreationPage(page);
    taskEditionPage = new TaskEditionPage(page);
    await page.goto(BASE_URL);
});

test.describe("Task creation", () => {
    test.beforeEach(async ({ page }) => {
        await taskCreationPage.goToCreateTask();
    });

    test("TC01-Create task with all valid fields", async ({ page }) => {
        await taskCreationPage.createTask("Buy Milk", "2 liters", "2025-08-01T12:00", "office", "#7ACCFA");

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

        await expect(page.getByRole("heading", { name: "Fix bug#123!@Home" })).toBeVisible();
    });

    test("TC05-Attempt to submit by pressing Enter key", async ({ page }) => {
        await page.getByRole("textbox", { name: "Task Name" }).fill("Buy Eggs");
        await page.keyboard.press("Enter");

        await expect(page.getByRole("heading", { name: "Buy Eggs" })).not.toBeVisible();
    });
});

test.describe("Task edition", () => {
    test.beforeEach(async ({ page }) => {
        await taskCreationPage.goToCreateTask();
        await taskCreationPage.createTask("Buy Milk", "2 liters", "2025-08-01T12:00", "office", "#7ACCFA");
        await taskEditionPage.goToTaskEdition();
    });

    test("TC06-Edit all fields with valid data", async ({ page }) => {
        await taskEditionPage.editTask(
            true,
            "Buy bread",
            "Whole grain loaf",
            "2025-08-05T12:00",
            "office",
            "muscle",
            "#3AE836"
        );

        const taskTitle = page.getByRole("heading", { name: "Buy bread" });
        await expect(taskTitle).toBeVisible();

        const div = page.locator('[data-testid="task-container"]');
        await expect(div).toHaveCSS("background-color", "rgb(58, 232, 54)");
    });

    test("TC07-Attempt to save with empty name", async ({ page }) => {
        await taskEditionPage.editTask(false, "");

        const saveButton = page.locator("button", { hasText: "Save" });
        await expect(saveButton).toBeDisabled();
    });

    test("TC08-Attempt to save by pressing Enter Key", async ({ page }) => {
        await taskEditionPage.editTask(false, "Buy bread");

        await page.keyboard.press("Enter");

        await expect(page.getByRole("heading", { name: "Buy bread" })).not.toBeVisible();
    });
});

test.describe("Task completion", () => {
    test.beforeEach(async ({ page }) => {
        await taskCreationPage.goToCreateTask();
        await taskCreationPage.createTask("Buy Milk", "2 liters", "2025-08-01T12:00", "office", "#7ACCFA");
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
        await taskCreationPage.goToCreateTask();
        await taskCreationPage.createTask("Buy Milk", "2 liters", "2025-08-01T12:00", "office", "#7ACCFA");
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
