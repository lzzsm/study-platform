import { workspaceMemberRepository } from "../repositories/workspaceMemberRepository";
import { userRepository } from "../repositories/userRepository";
import { workspaceRepository } from "../repositories/workspaceRepository";
import { AppError } from "../errors/AppError";
import { WorkspaceRole } from "../types/workspaceMember.types";
import { getIO } from "../config/socket";

async function inviteMember(
  workspace_id: number,
  inviter_id: number,
  email: string,
  role: WorkspaceRole,
) {
  // só owner pode convidar
  const inviterMembership = await workspaceMemberRepository.findMembership(
    workspace_id,
    inviter_id,
  );
  if (!inviterMembership || inviterMembership.role !== "owner") {
    throw new AppError("Apenas o dono pode convidar membros.", 403);
  }

  // verifica se o usuário convidado existe
  const user = await userRepository.findByEmail(email);
  if (!user) throw new AppError("Usuário não encontrado.", 404);

  // verifica se já é membro
  const existing = await workspaceMemberRepository.findMembership(
    workspace_id,
    user.id,
  );
  if (existing) throw new AppError("Usuário já é membro deste workspace.", 409);

  // não pode convidar com role owner
  if (role === "owner")
    throw new AppError("Não é possível convidar como owner.", 400);

  return workspaceMemberRepository.addMember(
    workspace_id,
    user.id,
    role,
    inviter_id,
  );
}

async function removeMember(
  workspace_id: number,
  requester_id: number,
  target_user_id: number,
) {
  const requesterMembership = await workspaceMemberRepository.findMembership(
    workspace_id,
    requester_id,
  );
  if (!requesterMembership || requesterMembership.role !== "owner") {
    throw new AppError("Apenas o dono pode remover membros.", 403);
  }

  const workspace = await workspaceRepository.findById(
    workspace_id,
    requester_id,
  );
  if (workspace?.owner_id === target_user_id) {
    throw new AppError("O dono do workspace não pode ser removido.", 400);
  }

  await workspaceMemberRepository.removeMember(workspace_id, target_user_id);

  try {
    getIO().to(`user:${target_user_id}`).emit("workspace:removed", {
      workspace_id,
    });
  } catch {
    // socket não inicializado em testes
  }
}

async function updateRole(
  workspace_id: number,
  requester_id: number,
  target_user_id: number,
  role: WorkspaceRole,
) {
  // só owner pode alterar papéis
  const requesterMembership = await workspaceMemberRepository.findMembership(
    workspace_id,
    requester_id,
  );
  if (!requesterMembership || requesterMembership.role !== "owner") {
    throw new AppError("Apenas o dono pode alterar papéis.", 403);
  }

  // papel owner não pode ser alterado
  const targetMembership = await workspaceMemberRepository.findMembership(
    workspace_id,
    target_user_id,
  );
  if (!targetMembership) throw new AppError("Membro não encontrado.", 404);
  if (targetMembership.role === "owner") {
    throw new AppError("O papel do dono não pode ser alterado.", 400);
  }

  // não pode promover a owner
  if (role === "owner")
    throw new AppError("Não é possível promover a owner.", 400);

  return workspaceMemberRepository.updateRole(
    workspace_id,
    target_user_id,
    role,
  );
}

async function findMembers(workspace_id: number, page = 1, limit = 10) {
  return workspaceMemberRepository.findMembers(workspace_id, page, limit);
}

async function findMembership(workspace_id: number, user_id: number) {
  return workspaceMemberRepository.findMembership(workspace_id, user_id);
}

export const workspaceMemberService = {
  inviteMember,
  removeMember,
  updateRole,
  findMembers,
  findMembership,
};
