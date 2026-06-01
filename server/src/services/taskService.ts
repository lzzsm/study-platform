import { AppError } from "../errors/AppError";
import { taskRepository } from "../repositories/taskRepository";
import { createTaskSchema, updateTaskSchema } from "../schemas/task.schemas";

async function create(
  title: string,
  description: string,
  workspace_id: number,
) {
  const result = createTaskSchema.safeParse({ title, description });
  if (!result.success) {
    throw new AppError("Dados inválidos.", 400);
  }
  return taskRepository.create(title, description, workspace_id);
}

async function update(id: number, title: string, description: string) {
  const result = updateTaskSchema.safeParse({ title, description });
  if (!result.success) {
    throw new AppError("Dados inválidos.", 400);
  }
  return taskRepository.update(id, title, description);
}

async function remove(id: number) {
  return taskRepository.remove(id);
}

async function findAll(
  workspace_id: number,
  page: number = 1,
  limit: number = 10,
  status?: "pending" | "completed",
) {
  return taskRepository.findAll(workspace_id, page, limit, status);
}

async function findById(id: number, workspace_id: number) {
  return taskRepository.findById(id, workspace_id);
}

async function toggleCompleted(id: number, completed: boolean) {
  return taskRepository.toggleCompleted(id, completed);
}

export const taskService = {
  create,
  update,
  remove,
  findAll,
  findById,
  toggleCompleted,
};
