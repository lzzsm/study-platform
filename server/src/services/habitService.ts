import { AppError } from "../errors/AppError";
import { habitRepository } from "../repositories/habitRepository";
import { createHabitSchema, updateHabitSchema } from "../schemas/habit.schemas";

async function create(
  title: string,
  description: string | null,
  workspace_id: number,
) {
  const result = createHabitSchema.safeParse({ title, description });
  if (!result.success) throw new AppError("Dados inválidos.", 400);
  return habitRepository.create(title, description, workspace_id);
}

async function update(id: number, title: string, description: string | null) {
  const result = updateHabitSchema.safeParse({ title, description });
  if (!result.success) throw new AppError("Dados inválidos.", 400);
  return habitRepository.update(id, title, description);
}

async function complete(id: number) {
  const alreadyCompleted = await habitRepository.wasCompletedToday(id);
  if (alreadyCompleted) {
    return { alreadyCompleted: true };
  }

  await habitRepository.logToday(id);

  const completedYesterday = await habitRepository.wasCompletedYesterday(id);

  if (completedYesterday) {
    return habitRepository.incrementStreak(id);
  } else {
    return habitRepository.resetStreak(id);
  }
}

async function remove(id: number) {
  return habitRepository.remove(id);
}

async function findAll(workspace_id: number) {
  return habitRepository.findAll(workspace_id);
}

async function findById(id: number, workspace_id: number) {
  return habitRepository.findById(id, workspace_id);
}

export const habitService = {
  create,
  update,
  complete,
  remove,
  findAll,
  findById,
};
