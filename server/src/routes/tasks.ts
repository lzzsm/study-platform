import { Router, Request, Response, NextFunction } from "express";
import { taskService } from "../services/taskService";
import { authMiddleware } from "../middleware/auth";
import { AppError } from "../errors/AppError";

const router = Router({ mergeParams: true });
router.use(authMiddleware);

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, description } = req.body;
    const workspace_id = Number(req.params.workspaceId);
    const task = await taskService.create(title, description, workspace_id);
    res.status(201).json(task);
  } catch (err) {
    next(err);
  }
});

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const workspace_id = Number(req.params.workspaceId);
    const tasks = await taskService.findAll(workspace_id);
    res.status(200).json(tasks);
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
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
});

router.put("/:id", async (req: Request, res: Response, next: NextFunction) => {
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
});

router.patch(
  "/:id/toggle",
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
