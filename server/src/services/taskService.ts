import { taskRepository } from "../repositories/taskRepository";
import { PaginatedResult } from "../types/pagination.types";
import { Task } from "../types/task.types";

async function create(
  title: string,
  description: string,
  workspace_id: number,
) {
  return taskRepository.create(title, description, workspace_id);
}

async function update(id: number, title: string, description: string) {
  return taskRepository.update(id, title, description);
}

async function remove(id: number) {
  return taskRepository.remove(id);
}

async function findAll(
  workspace_id: number,
  page = 1,
  limit = 10,
  status?: "pending" | "completed",
): Promise<PaginatedResult<Task>> {
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
