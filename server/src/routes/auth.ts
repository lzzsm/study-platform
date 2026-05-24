import { Router, Request, Response, NextFunction } from "express";
import { authService } from "../services/authService";
import { authMiddleware } from "../middleware/auth";
import { AppError } from "../errors/AppError";
import { userRepository } from "../repositories/userRepository";

const router = Router();

router.get(
  "/me",
  authMiddleware,
  async (req: any, res: Response, next: NextFunction) => {
    try {
      const user = await userRepository.findById(req.user.id);
      if (!user) throw new AppError("Usuário não encontrado.", 404);
      res.json(user);
    } catch (err) {
      next(err);
    }
  },
);

router.post(
  "/register",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, email, password } = req.body;
      const token = await authService.register(name, email, password);
      res.status(201).json({ token });
    } catch (err) {
      next(err);
    }
  },
);

router.post(
  "/login",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      const token = await authService.login(email, password);
      res.status(200).json({ token });
    } catch (err) {
      next(err);
    }
  },
);

export default router;
