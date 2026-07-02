import { Router, Request, Response, NextFunction } from "express";
import { aiService } from "../services/aiService";
import { authMiddleware } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { authRateLimiter } from "../middleware/rateLimiter";
import { z } from "zod";

const router = Router();
router.use(authMiddleware);

const suggestGoalSchema = z.object({
  description: z.string().min(5).max(500),
  previousSuggestion: z.any().optional(),
  refinementRequest: z.string().max(300).optional(),
});

router.post(
  "/suggest-goal",
  authRateLimiter,
  validate(suggestGoalSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { description, previousSuggestion, refinementRequest } = req.body;
      const suggestion = await aiService.suggestGoal(
        description,
        previousSuggestion,
        refinementRequest,
      );
      res.json(suggestion);
    } catch (err) {
      next(err);
    }
  },
);

export default router;
