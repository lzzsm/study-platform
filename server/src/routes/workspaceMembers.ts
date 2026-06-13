import { Router, Request, Response, NextFunction } from "express";
import { workspaceMemberService } from "../services/workspaceMemberService";
import { authMiddleware } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { z } from "zod";

const router = Router({ mergeParams: true });
router.use(authMiddleware);

const inviteSchema = z.object({
  email: z.string().email(),
  role: z.enum(["editor", "viewer"]),
});

const updateRoleSchema = z.object({
  role: z.enum(["editor", "viewer"]),
});

// listar membros
router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const workspace_id = Number(req.params.workspaceId);
    const members = await workspaceMemberService.findMembers(workspace_id);
    res.json(members);
  } catch (err) {
    next(err);
  }
});

// convidar membro
router.post(
  "/",
  validate(inviteSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const workspace_id = Number(req.params.workspaceId);
      const requester_id = (req as any).user.id;
      const { email, role } = req.body;
      const member = await workspaceMemberService.inviteMember(
        workspace_id,
        requester_id,
        email,
        role,
      );
      res.status(201).json(member);
    } catch (err) {
      next(err);
    }
  },
);

// atualizar papel
router.put(
  "/:userId/role",
  validate(updateRoleSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const workspace_id = Number(req.params.workspaceId);
      const requester_id = (req as any).user.id;
      const target_user_id = Number(req.params.userId);
      const { role } = req.body;
      const member = await workspaceMemberService.updateRole(
        workspace_id,
        requester_id,
        target_user_id,
        role,
      );
      res.json(member);
    } catch (err) {
      next(err);
    }
  },
);

// remover membro
router.delete(
  "/:userId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const workspace_id = Number(req.params.workspaceId);
      const requester_id = (req as any).user.id;
      const target_user_id = Number(req.params.userId);
      await workspaceMemberService.removeMember(
        workspace_id,
        requester_id,
        target_user_id,
      );
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
);

export default router;
