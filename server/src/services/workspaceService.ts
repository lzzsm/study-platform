import { workspaceRepository } from "../repositories/workspaceRepository";
import { workspaceMemberRepository } from "../repositories/workspaceMemberRepository";
import pool from "../database";

async function create(name: string, description: string, owner_id: number) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const workspace = await workspaceRepository.create(
      name,
      description,
      owner_id,
      client,
    );
    await workspaceMemberRepository.addMember(
      workspace.id,
      owner_id,
      "owner",
      owner_id,
      client,
    );

    await client.query("COMMIT");
    return workspace;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
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

async function findAll(owner_id: number, page = 1, limit = 10) {
  return workspaceRepository.findAll(owner_id, page, limit);
}

async function findById(id: number, owner_id: number) {
  return workspaceRepository.findById(id, owner_id);
}

export const workspaceService = { create, update, remove, findAll, findById };
