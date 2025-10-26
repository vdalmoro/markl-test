import { expect, test } from "@playwright/test";
import { TaskModel } from "./fixtures/task.model";
import { deleteTaskByHelper, createTaskByHelper } from "./support/helpers";
import { TasksPage } from "./support/pages/tasks";

import data from "./fixtures/tasks.json" with { type: 'json' };

let tasksPage: TasksPage;

test.beforeEach(({ page }) => {
  tasksPage = new TasksPage(page);
});

test.describe("cadastro",  () => {

  test("Deve poder cadastrar uma nova tarefa", async ({ request }) => {
  const task = data.success as TaskModel;

  await deleteTaskByHelper(request, task.name);

  await tasksPage.goto();
  await tasksPage.create(task);
  await tasksPage.shouldHaveText(task.name);
});

test("Não deve poder cadastrar uma tarefa com nome duplicado", async ({
  request,
}) => {
  const task = data.duplicate as TaskModel;

  await deleteTaskByHelper(request, task.name);
  await createTaskByHelper(request, task);

  await tasksPage.goto();
  await tasksPage.create(task);
  await tasksPage.alertHaveText("Task already exists!");
});

test("Campo obrigatório ao cadastrar uma nova tarefa", async () => {
  const task = data.required as TaskModel;

  await tasksPage.goto();
  await tasksPage.create(task);

  const validationMessage = await tasksPage.inputTaskName.evaluate(
    (e) => (e as HTMLInputElement).validationMessage
  );
  expect(validationMessage).toEqual("This is a required field");
});
  
});

test.describe("atualização", () => {

  test("Concluir tarefa", async ({ request }) => {
  const task = data.update as TaskModel;

  await deleteTaskByHelper(request, task.name);
  await createTaskByHelper(request, task);

  await tasksPage.goto();
  await tasksPage.toggle(task.name);
  await tasksPage.shouldBeDone(task.name);
});
});

test.describe("exclusão", () => {

  test("Excluir tarefa", async ({ request }) => {
  const task = data.delete as TaskModel;

  await deleteTaskByHelper(request, task.name);
  await createTaskByHelper(request, task);

  await tasksPage.goto();
  await tasksPage.remove(task.name);
  await tasksPage.shouldNotExist(task.name);
});
});