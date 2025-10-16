import { test, expect } from "@playwright/test";
import { TaskModel } from "./fixtures/task.model";
import { deleteTaskByHelper, createTaskByHelper } from "./support/helpers";

test("Deve poder cadastrar uma nova tarefa", async ({ page, request }) => {
  const task: TaskModel = {
    name: "Ler um livro de Typescript",
    is_done: false,
  };

  await deleteTaskByHelper(request, task.name);

  await page.goto("http://localhost:8080");

  const inputTaskName = page.locator("input[class*=_listInputNewTask]");
  await inputTaskName.fill(task.name);

  await page.click("css=button >> text=Create");

  const target = page.locator(`css=.task-item p >> text=${task.name}`);
  await expect(target).toBeVisible();
});

test("Não deve poder cadastrar uma tarefa com nome duplicado", async ({
  page,
  request,
}) => {
  const task: TaskModel = {
    name: "Comprar Mostarda",
    is_done: false,
  };

  await deleteTaskByHelper(request, task.name);
  await createTaskByHelper(request, task);

  await page.goto("http://localhost:8080");

  const inputTaskName = page.locator("input[class*=_listInputNewTask]");
  await inputTaskName.fill(task.name);
  await page.click("css=button >> text=Create");

  const target = page.locator(".swal2-html-container");
  await expect(target).toHaveText("Task already exists!");
});
