import { workspaceRepository } from "../repositories/workspaceRepository";

async function create(name: string, description: string, owner_id: number) {
  return workspaceRepository.create(name, description, owner_id);
}

async function update(
  id: number,
  name: string,
  description: string,
  owner_id: number,
) {
  return workspaceRepository.update(id, name, description, owner_id);
}

async function remove(id: number, owner_id: number) {
  return workspaceRepository.remove(id, owner_id);
}

async function findAll(owner_id: number) {
  return workspaceRepository.findAll(owner_id);
}

async function findById(id: number, owner_id: number) {
  return workspaceRepository.findById(id, owner_id);
}

export const workspaceService = { create, update, remove, findAll, findById };
