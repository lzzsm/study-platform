import { Router, Request, Response, NextFunction } from "express";
import { userService } from "../services/userService";
import { authMiddleware } from "../middleware/auth";
import { validate } from "../middleware/validate";
import {
  updateProfileSchema,
  updatePasswordSchema,
} from "../schemas/user.schemas";

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

export default router;
