import { Router, Request, Response, NextFunction } from "express";
import { workspaceInviteService } from "../services/workspaceInviteService";
import { authMiddleware } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { z } from "zod";

const inviteSchema = z.object({
  email: z.string().email(),
  role: z.enum(["editor", "viewer"]),
});

// router para /invites
const router = Router();
router.use(authMiddleware);

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user_id = (req as any).user.id;
    const invites = await workspaceInviteService.getPendingInvites(user_id);
    res.json(invites);
  } catch (err) {
    next(err);
  }
});

router.post(
  "/:id/accept",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const invite_id = Number(req.params.id);
      const user_id = (req as any).user.id;
      await workspaceInviteService.accept(invite_id, user_id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
);

router.post(
  "/:id/reject",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const invite_id = Number(req.params.id);
      const user_id = (req as any).user.id;
      await workspaceInviteService.reject(invite_id, user_id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
);

router.delete(
  "/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const invite_id = Number(req.params.id);
      const user_id = (req as any).user.id;
      await workspaceInviteService.cancel(invite_id, user_id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
);

// router para /workspaces/:workspaceId/invite
export const workspaceInviteWorkspaceRouter = Router({ mergeParams: true });
workspaceInviteWorkspaceRouter.use(authMiddleware);

workspaceInviteWorkspaceRouter.get(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const workspace_id = Number(req.params.workspaceId);
      const invites =
        await workspaceInviteService.getPendingByWorkspace(workspace_id);
      res.json(invites);
    } catch (err) {
      next(err);
    }
  },
);

workspaceInviteWorkspaceRouter.post(
  "/",
  validate(inviteSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const workspace_id = Number(req.params.workspaceId);
      const inviter_id = (req as any).user.id;
      const { email, role } = req.body;
      const invite = await workspaceInviteService.invite(
        workspace_id,
        inviter_id,
        email,
        role,
      );
      res.status(201).json(invite);
    } catch (err) {
      next(err);
    }
  },
);

export default router;
