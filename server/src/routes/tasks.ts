import { Router, Request, Response, NextFunction } from "express";
import { taskService } from "../services/taskService";
import { authMiddleware } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { AppError } from "../errors/AppError";
import { createTaskSchema, updateTaskSchema } from "../schemas/task.schemas";
import { requireWorkspaceRole } from "../middleware/workspaceAuth";

const router = Router({ mergeParams: true });
router.use(authMiddleware);

router.get(
  "/",
  requireWorkspaceRole("owner", "editor", "viewer"),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const workspace_id = Number(req.params.workspaceId);
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const status = req.query.status as "pending" | "completed" | undefined;
      const result = await taskService.findAll(
        workspace_id,
        page,
        limit,
        status,
      );
      res.status(200).json(result);
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
      const task = await taskService.findById(
        Number(req.params.id),
        workspace_id,
      );
      if (!task) throw new AppError("Task não encontrada.", 404);
      res.status(200).json(task);
    } catch (err) {
      next(err);
    }
  },
);

router.post(
  "/",
  requireWorkspaceRole("owner", "editor"),
  validate(createTaskSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { title, description } = req.body;
      const workspace_id = Number(req.params.workspaceId);
      const task = await taskService.create(title, description, workspace_id);
      res.status(201).json(task);
    } catch (err) {
      next(err);
    }
  },
);

router.put(
  "/:id",
  requireWorkspaceRole("owner", "editor"),
  validate(updateTaskSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { title, description } = req.body;
      const task = await taskService.update(
        Number(req.params.id),
        title,
        description,
      );
      if (!task) throw new AppError("Task não encontrada.", 404);
      res.status(200).json(task);
    } catch (err) {
      next(err);
    }
  },
);

router.patch(
  "/:id/toggle",
  requireWorkspaceRole("owner", "editor"),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { completed } = req.body;
      const task = await taskService.toggleCompleted(
        Number(req.params.id),
        completed,
      );
      if (!task) throw new AppError("Task não encontrada.", 404);
      res.status(200).json(task);
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
      const task = await taskService.remove(Number(req.params.id));
      if (!task) throw new AppError("Task não encontrada.", 404);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
);

export default router;
