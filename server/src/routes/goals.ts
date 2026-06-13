import { Router, Request, Response, NextFunction } from "express";
import { goalService } from "../services/goalService";
import { authMiddleware } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { AppError } from "../errors/AppError";
import {
  createGoalSchema,
  updateGoalSchema,
  updateProgressSchema,
  toggleGoalSchema,
} from "../schemas/goal.schemas";
import { requireWorkspaceRole } from "../middleware/workspaceAuth";

const router = Router({ mergeParams: true });
router.use(authMiddleware);

router.get(
  "/",
  requireWorkspaceRole("owner", "editor", "viewer"),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const workspace_id = Number(req.params.workspaceId);
      const goals = await goalService.findAll(workspace_id);
      res.status(200).json(goals);
    } catch (err) {
      next(err);
    }
  },
);

router.get(
  "/:id",
  requireWorkspaceRole("owner", "editor", "viewer"),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const workspace_id = Number(req.params.workspaceId);
      const goal = await goalService.findById(
        Number(req.params.id),
        workspace_id,
      );
      if (!goal) throw new AppError("Meta não encontrada.", 404);
      res.status(200).json(goal);
    } catch (err) {
      next(err);
    }
  },
);

router.post(
  "/",
  requireWorkspaceRole("owner", "editor"),
  validate(createGoalSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { title, description, type, target_value, expires_at } = req.body;
      const workspace_id = Number(req.params.workspaceId);
      const goal = await goalService.create(
        title,
        description,
        type,
        target_value,
        expires_at,
        workspace_id,
      );
      res.status(201).json(goal);
    } catch (err) {
      next(err);
    }
  },
);

router.put(
  "/:id",
  requireWorkspaceRole("owner", "editor"),
  validate(updateGoalSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { title, description, target_value, expires_at } = req.body;
      const goal = await goalService.update(
        Number(req.params.id),
        title,
        description,
        target_value,
        expires_at,
      );
      if (!goal) throw new AppError("Meta não encontrada.", 404);
      res.status(200).json(goal);
    } catch (err) {
      next(err);
    }
  },
);

router.patch(
  "/:id/progress",
  requireWorkspaceRole("owner", "editor"),
  validate(updateProgressSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { current_value } = req.body;
      const goal = await goalService.updateProgress(
        Number(req.params.id),
        current_value,
      );
      if (!goal) throw new AppError("Meta não encontrada.", 404);
      res.status(200).json(goal);
    } catch (err) {
      next(err);
    }
  },
);

router.patch(
  "/:id/toggle",
  requireWorkspaceRole("owner", "editor"),
  validate(toggleGoalSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { completed } = req.body;
      const goal = await goalService.toggleCompleted(
        Number(req.params.id),
        completed,
      );
      if (!goal) throw new AppError("Meta não encontrada.", 404);
      res.status(200).json(goal);
    } catch (err) {
      next(err);
    }
  },
);

router.delete(
  "/:id",
  requireWorkspaceRole("owner", "editor"),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const goal = await goalService.remove(Number(req.params.id));
      if (!goal) throw new AppError("Meta não encontrada.", 404);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
);

export default router;
