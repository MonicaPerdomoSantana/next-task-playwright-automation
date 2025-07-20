import { Page } from "@playwright/test";
import { TaskCreationPage } from "./task-creation-page";
import { TaskEditionPage } from "./task-edition-page";

export class PageManager {
    private readonly page: Page;
    readonly taskCreation: TaskCreationPage;
    readonly taskEdition: TaskEditionPage;

    constructor(page: Page) {
        this.page = page;
        this.taskCreation = new TaskCreationPage(page);
        this.taskEdition = new TaskEditionPage(page);
    }
}
