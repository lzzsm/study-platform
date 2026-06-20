import { habitRepository } from "../repositories/habitRepository";

async function create(
  title: string,
  description: string | null,
  workspace_id: number,
) {
  return habitRepository.create(title, description, workspace_id);
}

async function update(id: number, title: string, description: string | null) {
  return habitRepository.update(id, title, description);
}

async function complete(id: number) {
  const alreadyCompleted = await habitRepository.wasCompletedToday(id);
  if (alreadyCompleted) return { alreadyCompleted: true };

  await habitRepository.logToday(id);

  const completedYesterday = await habitRepository.wasCompletedYesterday(id);
  return completedYesterday
    ? habitRepository.incrementStreak(id)
    : habitRepository.resetStreak(id);
}

async function remove(id: number) {
  return habitRepository.remove(id);
}

async function findAll(workspace_id: number, page = 1, limit = 10) {
  return habitRepository.findAll(workspace_id, page, limit);
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
