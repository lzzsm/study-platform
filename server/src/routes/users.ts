import { Router, Request, Response, NextFunction } from "express";
import { userService } from "../services/userService";
import { authMiddleware } from "../middleware/auth";
import { validate } from "../middleware/validate";
import {
  updateProfileSchema,
  updatePasswordSchema,
} from "../schemas/user.schemas";
import { AppError } from "../errors/AppError";
import { analyticsService } from "../services/analyticsService";
import { userRepository } from "../repositories/userRepository";

const router = Router();
router.use(authMiddleware);

router.get("/me", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await userService.getProfile((req as any).user.id);
    res.json(user);
  } catch (err) {
    next(err);
  }
});

router.get(
  "/search",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const query = req.query.q as string;
      if (!query || query.trim().length < 2) {
        res
          .status(400)
          .json({ error: "Query deve ter pelo menos 2 caracteres." });
        return;
      }
      const users = await userRepository.search(query.trim());
      res.json(users);
    } catch (err) {
      next(err);
    }
  },
);

router.get(
  "/:id/profile",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const user = await userRepository.findPublicProfile(id);
      if (!user) throw new AppError("Usuário não encontrado.", 404);

      const stats = await analyticsService.getPublicStats(id);
      res.json({ ...user, stats });
    } catch (err) {
      next(err);
    }
  },
);

router.put(
  "/me",
  validate(updateProfileSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, bio, avatar_url } = req.body;
      const user = await userService.updateProfile(
        (req as any).user.id,
        name,
        bio ?? null,
        avatar_url ?? null,
      );
      res.json(user);
    } catch (err) {
      next(err);
    }
  },
);

router.put(
  "/me/password",
  validate(updatePasswordSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { currentPassword, newPassword } = req.body;
      await userService.updatePassword(
        (req as any).user.id,
        currentPassword,
        newPassword,
      );
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
);

router.post(
  "/me/logout-all",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await userService.logoutAll((req as any).user.id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
);

router.delete(
  "/me",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { currentPassword } = req.body;
      if (!currentPassword) throw new AppError("Senha obrigatória.", 400);
      await userService.deleteAccount((req as any).user.id, currentPassword);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
);

export default router;
