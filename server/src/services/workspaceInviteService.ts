import { workspaceInviteRepository } from "../repositories/workspaceInviteRepository";
import { workspaceMemberRepository } from "../repositories/workspaceMemberRepository";
import { workspaceRepository } from "../repositories/workspaceRepository";
import { userRepository } from "../repositories/userRepository";
import { AppError } from "../errors/AppError";
import { WorkspaceRole } from "../types/workspaceMember.types";
import { getIO } from "../config/socket";

const MAX_REJECTIONS = 5;

async function invite(
  workspace_id: number,
  inviter_id: number,
  email: string,
  role: WorkspaceRole,
) {
  const membership = await workspaceMemberRepository.findMembership(
    workspace_id,
    inviter_id,
  );
  if (!membership || membership.role !== "owner") {
    throw new AppError("Apenas o dono pode convidar membros.", 403);
  }

  const invitee = await userRepository.findByEmail(email);
  if (!invitee) throw new AppError("Usuário não encontrado.", 404);

  if (invitee.id === inviter_id) {
    throw new AppError("Você não pode se convidar.", 400);
  }

  const existingMembership = await workspaceMemberRepository.findMembership(
    workspace_id,
    invitee.id,
  );
  if (existingMembership) throw new AppError("Usuário já é membro.", 409);

  if (role === "owner")
    throw new AppError("Não é possível convidar como owner.", 400);

  const existingInvite =
    await workspaceInviteRepository.findByWorkspaceAndInvitee(
      workspace_id,
      invitee.id,
    );

  if (existingInvite) {
    if (existingInvite.status === "pending") {
      throw new AppError("Usuário já tem um convite pendente.", 409);
    }
    if (existingInvite.rejected_count >= MAX_REJECTIONS) {
      throw new AppError("Este usuário recusou convites muitas vezes.", 403);
    }
  }

  const workspace = await workspaceRepository.findById(
    workspace_id,
    inviter_id,
  );
  const inviter = await userRepository.findPublicById(inviter_id);

  const result = existingInvite
    ? await workspaceInviteRepository.reactivate(existingInvite.id, role)
    : await workspaceInviteRepository.create(
        workspace_id,
        inviter_id,
        invitee.id,
        role,
      );

  try {
    getIO()
      .to(`user:${invitee.id}`)
      .emit("invite:received", {
        id: result!.id,
        workspace_id,
        workspace_name: workspace?.name ?? "",
        inviter_name: inviter?.name ?? "",
        role,
      });
  } catch {
    // socket não inicializado em testes
  }

  return result;
}

async function accept(invite_id: number, user_id: number) {
  const invite = await workspaceInviteRepository.findById(invite_id);
  if (!invite) throw new AppError("Convite não encontrado.", 404);
  if (invite.invitee_id !== user_id) throw new AppError("Acesso negado.", 403);
  if (invite.status !== "pending")
    throw new AppError("Convite não está pendente.", 400);
  if (new Date(invite.expires_at) < new Date())
    throw new AppError("Convite expirado.", 400);

  // adiciona como membro
  await workspaceMemberRepository.addMember(
    invite.workspace_id,
    user_id,
    invite.role,
    invite.inviter_id,
  );

  // marca convite como aceito
  await workspaceInviteRepository.updateStatus(invite_id, "accepted");

  return invite;
}

async function reject(invite_id: number, user_id: number) {
  const invite = await workspaceInviteRepository.findById(invite_id);
  if (!invite) throw new AppError("Convite não encontrado.", 404);
  if (invite.invitee_id !== user_id) throw new AppError("Acesso negado.", 403);
  if (invite.status !== "pending")
    throw new AppError("Convite não está pendente.", 400);

  await workspaceInviteRepository.updateStatus(invite_id, "rejected", true);
}

async function cancel(invite_id: number, user_id: number) {
  const invite = await workspaceInviteRepository.findById(invite_id);
  if (!invite) throw new AppError("Convite não encontrado.", 404);
  if (invite.inviter_id !== user_id) throw new AppError("Acesso negado.", 403);
  if (invite.status !== "pending")
    throw new AppError("Convite não está pendente.", 400);

  await workspaceInviteRepository.cancel(invite_id);

  try {
    getIO().to(`user:${invite.invitee_id}`).emit("invite:cancelled", {
      id: invite_id,
    });
  } catch {
    // socket não inicializado em testes
  }
}

async function getPendingInvites(user_id: number) {
  return workspaceInviteRepository.findPendingByInvitee(user_id);
}

async function getPendingByWorkspace(workspace_id: number) {
  return workspaceInviteRepository.findPendingByWorkspace(workspace_id);
}

export const workspaceInviteService = {
  invite,
  accept,
  reject,
  cancel,
  getPendingInvites,
  getPendingByWorkspace,
};
