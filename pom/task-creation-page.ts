import { Page } from "@playwright/test";

export class TaskCreationPage {
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async createTask(taskName: string, taskDescription: string) {
    await this.page.getByRole("textbox", { name: "Task Name" }).fill(taskName);

    await this.page
      .getByRole("textbox", { name: "Description" })
      .fill(taskDescription);
    await this.page
      .getByRole("textbox", { name: "Task Deadline" })
      .fill("2025-08-01T12:00");
    await this.page.getByRole("combobox").click();
    await this.page.getByRole("img", { name: "office" }).click();
    await this.page.keyboard.press("Escape");
    await this.page.locator("button", { hasText: "Color" }).click();
    await this.page
      .getByRole("button", { name: "Select color - #7ACCFA" })
      .click();
    await this.page.getByRole("button", { name: "Create Task" }).click();
  }
}
