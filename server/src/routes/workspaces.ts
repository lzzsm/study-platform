import { Router, Request, Response, NextFunction } from "express";
import { workspaceService } from "../services/workspaceService";
import { authMiddleware } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { AppError } from "../errors/AppError";
import {
  createWorkspaceSchema,
  updateWorkspaceSchema,
} from "../schemas/workspace.schemas";

const router = Router();
router.use(authMiddleware);

router.post(
  "/",
  validate(createWorkspaceSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, description } = req.body;
      const owner_id = (req as any).user.id;
      const workspace = await workspaceService.create(
        name,
        description,
        owner_id,
      );
      res.status(201).json(workspace);
    } catch (err) {
      next(err);
    }
  },
);

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const owner_id = (req as any).user.id;
    const workspaces = await workspaceService.findAll(owner_id);
    res.status(200).json(workspaces);
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const owner_id = (req as any).user.id;
    const workspace = await workspaceService.findById(
      Number(req.params.id),
      owner_id,
    );
    if (!workspace) throw new AppError("Workspace não encontrada.", 404);
    res.status(200).json(workspace);
  } catch (err) {
    next(err);
  }
});

router.put(
  "/:id",
  validate(updateWorkspaceSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const owner_id = (req as any).user.id;
      const { name, description } = req.body;
      const workspace = await workspaceService.update(
        Number(req.params.id),
        name,
        description,
        owner_id,
      );
      if (!workspace) throw new AppError("Workspace não encontrada.", 404);
      res.status(200).json(workspace);
    } catch (err) {
      next(err);
    }
  },
);

router.delete(
  "/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const owner_id = (req as any).user.id;
      const workspace = await workspaceService.remove(
        Number(req.params.id),
        owner_id,
      );
      if (!workspace) throw new AppError("Workspace não encontrada.", 404);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
);

export default router;
