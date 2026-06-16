import { Router, Request, Response, NextFunction } from "express";
import { authService } from "../services/authService";
import { authMiddleware } from "../middleware/auth";
import { AppError } from "../errors/AppError";
import { userRepository } from "../repositories/userRepository";
import { validate } from "../middleware/validate";
import { registerSchema, loginSchema } from "../schemas/auth.schemas";
import { authRateLimiter } from "../middleware/rateLimiter";

const router = Router();

router.get(
  "/me",
  authMiddleware,
  async (req: any, res: Response, next: NextFunction) => {
    try {
      const user = await userRepository.findPublicById(req.user.id);
      if (!user) throw new AppError("Usuário não encontrado.", 404);
      res.json(user);
    } catch (err) {
      next(err);
    }
  },
);

router.post(
  "/register",
  authRateLimiter,
  validate(registerSchema),
  async (req, res, next) => {
    try {
      const { name, email, password } = req.body;
      const tokens = await authService.register(name, email, password);
      res.status(201).json(tokens);
    } catch (err) {
      next(err);
    }
  },
);

router.post(
  "/login",
  authRateLimiter,
  validate(loginSchema),
  async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const tokens = await authService.login(email, password);
      res.status(200).json(tokens);
    } catch (err) {
      next(err);
    }
  },
);

router.post(
  "/refresh",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken)
        throw new AppError("Refresh token não fornecido.", 400);

      const tokens = await authService.refresh(refreshToken);
      res.status(200).json(tokens);
    } catch (err) {
      next(err);
    }
  },
);

router.post(
  "/logout",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { refreshToken } = req.body;
      if (refreshToken) await authService.logout(refreshToken);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
);

export default router;
