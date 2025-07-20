import { Page } from "@playwright/test";

export class TaskEditionPage {
    private readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async goToTaskEdition() {
        await this.page.getByRole("button", { name: "Task Menu" }).click();
        await this.page.getByRole("menuitem", { name: "Edit" }).click();
    }

    async editTask(
        saveTask: boolean = true,
        taskName: string,
        taskDescription: string = "",
        taskDeadline: string = "",
        taskCategoryOld: string = "",
        taskCategoryNew: string = "",
        taskColor: string = ""
    ) {
        await this.page.getByRole("textbox", { name: "Name" }).fill(taskName);

        await this.page.getByRole("textbox", { name: "Description" }).fill(taskDescription);

        await this.page.getByRole("textbox", { name: "Deadline date" }).fill(taskDeadline);

        if (taskCategoryNew !== "") {
            await this.page.getByRole("combobox").click();
            await this.page.getByRole("img", { name: taskCategoryOld }).click();
            await this.page.getByRole("img", { name: taskCategoryNew }).click();
            await this.page.keyboard.press("Escape");
        }

        if (taskColor !== "") {
            await this.page.locator("button", { hasText: "Color" }).click();
            await this.page.getByRole("button", { name: "Select color - " + taskColor }).click();
        }

        if (saveTask) {
            await this.page.locator("button", { hasText: "Save" }).click();
        }
    }
}
