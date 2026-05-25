import { AppError } from "../errors/AppError";
import { goalRepository } from "../repositories/goalRepository";
import {
  createGoalSchema,
  updateGoalSchema,
  updateProgressSchema,
  toggleGoalSchema,
} from "../schemas/goal.schemas";

async function create(
  title: string,
  description: string | null,
  type: "quantitative" | "qualitative",
  target_value: number | null,
  expires_at: string | null,
  workspace_id: number,
) {
  const result = createGoalSchema.safeParse({
    title,
    description,
    type,
    target_value,
    expires_at,
  });
  if (!result.success) throw new AppError(result.error.issues[0].message, 400);
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
  const result = updateGoalSchema.safeParse({
    title,
    description,
    target_value,
    expires_at,
  });
  if (!result.success) throw new AppError("Dados inválidos.", 400);
  return goalRepository.update(
    id,
    title,
    description,
    target_value,
    expires_at,
  );
}

async function updateProgress(id: number, current_value: number) {
  const result = updateProgressSchema.safeParse({ current_value });
  if (!result.success) throw new AppError("Dados inválidos.", 400);
  return goalRepository.updateProgress(id, current_value);
}

async function toggleCompleted(id: number, completed: boolean) {
  const result = toggleGoalSchema.safeParse({ completed });
  if (!result.success) throw new AppError("Dados inválidos.", 400);
  return goalRepository.toggleCompleted(id, completed);
}

async function remove(id: number) {
  return goalRepository.remove(id);
}

async function findAll(workspace_id: number) {
  return goalRepository.findAll(workspace_id);
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
