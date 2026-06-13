import { workspaceRepository } from "../repositories/workspaceRepository";
import { workspaceMemberRepository } from "../repositories/workspaceMemberRepository";

async function create(name: string, description: string, owner_id: number) {
  const workspace = await workspaceRepository.create(
    name,
    description,
    owner_id,
  );

  // adiciona o criador como owner na tabela de membros
  await workspaceMemberRepository.addMember(
    workspace.id,
    owner_id,
    "owner",
    owner_id,
  );

  return workspace;
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
