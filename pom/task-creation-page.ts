import { Page } from "@playwright/test";

export class TaskCreationPage {
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async createTask(
    taskName: string,
    taskDescription: string = "",
    taskDeadline: string = "",
    taskCategory: string = "",
    taskColor: string = ""
  ) {
    await this.page.getByRole("textbox", { name: "Task Name" }).fill(taskName);

    await this.page
      .getByRole("textbox", { name: "Description" })
      .fill(taskDescription);
    await this.page
      .getByRole("textbox", { name: "Task Deadline" })
      .fill(taskDeadline);

    if (taskCategory !== "") {
      await this.page.getByRole("combobox").click();
      await this.page.getByRole("img", { name: taskCategory }).click();
      await this.page.keyboard.press("Escape");
    }

    if (taskColor !== "") {
      await this.page.locator("button", { hasText: "Color" }).click();
      await this.page
        .getByRole("button", { name: "Select color - " + taskColor })
        .click();
    }
    
    await this.page.getByRole("button", { name: "Create Task" }).click();
  }
}
