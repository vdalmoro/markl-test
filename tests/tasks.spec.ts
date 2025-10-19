import { test } from "@playwright/test";
import { TaskModel } from "./fixtures/task.model";
import { deleteTaskByHelper, createTaskByHelper } from "./support/helpers";
import { TasksPage } from "./support/pages/tasks";

test("Deve poder cadastrar uma nova tarefa", async ({ page, request }) => {
  const task: TaskModel = {
    name: "Ler um livro de Typescript",
    is_done: false,
  };

  await deleteTaskByHelper(request, task.name);

  const tasksPage: TasksPage = new TasksPage(page);

  await tasksPage.goto();
  await tasksPage.create(task);
  await tasksPage.shouldHaveText(task.name);
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

  const tasksPage: TasksPage = new TasksPage(page);

  await tasksPage.goto();
  await tasksPage.create(task);
  await tasksPage.alertHaveText("Task already exists!");
});
