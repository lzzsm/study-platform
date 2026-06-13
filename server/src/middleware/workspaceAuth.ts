import { Request, Response, NextFunction } from "express";
import { workspaceMemberRepository } from "../repositories/workspaceMemberRepository";
import { AppError } from "../errors/AppError";
import { WorkspaceRole } from "../types/workspaceMember.types";

export function requireWorkspaceRole(...roles: WorkspaceRole[]) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const workspace_id = Number(req.params.workspaceId);
      const user_id = (req as any).user.id;

      const membership = await workspaceMemberRepository.findMembership(
        workspace_id,
        user_id,
      );

      if (!membership) {
        throw new AppError("Acesso negado.", 403);
      }

      if (!roles.includes(membership.role)) {
        throw new AppError("Permissão insuficiente.", 403);
      }

      // disponibiliza o papel pra usar nas rotas se necessário
      (req as any).membership = membership;

      next();
    } catch (err) {
      next(err);
    }
  };
}
