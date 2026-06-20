import { goalRepository } from "../repositories/goalRepository";

async function create(
  title: string,
  description: string | null,
  type: "quantitative" | "qualitative",
  target_value: number | null,
  expires_at: string | null,
  workspace_id: number,
) {
  return goalRepository.create(
    title,
    description,
    type,
    target_value,
    expires_at,
    workspace_id,
  );
}

async function update(
  id: number,
  title: string,
  description: string | null,
  target_value: number | null,
  expires_at: string | null,
) {
  return goalRepository.update(
    id,
    title,
    description,
    target_value,
    expires_at,
  );
}

async function updateProgress(id: number, current_value: number) {
  return goalRepository.updateProgress(id, current_value);
}

async function toggleCompleted(id: number, completed: boolean) {
  return goalRepository.toggleCompleted(id, completed);
}

async function remove(id: number) {
  return goalRepository.remove(id);
}

async function findAll(workspace_id: number, page = 1, limit = 10) {
  return goalRepository.findAll(workspace_id, page, limit);
}

async function findById(id: number, workspace_id: number) {
  return goalRepository.findById(id, workspace_id);
}

export const goalService = {
  create,
  update,
  updateProgress,
  toggleCompleted,
  remove,
  findAll,
  findById,
};
