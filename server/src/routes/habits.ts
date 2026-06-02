import { Router, Request, Response, NextFunction } from "express";
import { habitService } from "../services/habitService";
import { authMiddleware } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { AppError } from "../errors/AppError";
import { createHabitSchema, updateHabitSchema } from "../schemas/habit.schemas";

const router = Router({ mergeParams: true });
router.use(authMiddleware);

router.post(
  "/",
  validate(createHabitSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { title, description } = req.body;
      const workspace_id = Number(req.params.workspaceId);
      const habit = await habitService.create(title, description, workspace_id);
      res.status(201).json(habit);
    } catch (err) {
      next(err);
    }
  },
);

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const workspace_id = Number(req.params.workspaceId);
    const habits = await habitService.findAll(workspace_id);
    res.status(200).json(habits);
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const workspace_id = Number(req.params.workspaceId);
    const habit = await habitService.findById(
      Number(req.params.id),
      workspace_id,
    );
    if (!habit) throw new AppError("Hábito não encontrado.", 404);
    res.status(200).json(habit);
  } catch (err) {
    next(err);
  }
});

router.put(
  "/:id",
  validate(updateHabitSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { title, description } = req.body;
      const habit = await habitService.update(
        Number(req.params.id),
        title,
        description,
      );
      if (!habit) throw new AppError("Hábito não encontrado.", 404);
      res.status(200).json(habit);
    } catch (err) {
      next(err);
    }
  },
);

router.patch(
  "/:id/complete",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await habitService.complete(Number(req.params.id));
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  },
);

router.delete(
  "/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const habit = await habitService.remove(Number(req.params.id));
      if (!habit) throw new AppError("Hábito não encontrado.", 404);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
);

export default router;
