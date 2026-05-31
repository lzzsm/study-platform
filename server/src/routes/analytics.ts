import { Router, Request, Response, NextFunction } from "express";
import { analyticsService } from "../services/analyticsService";
import { authMiddleware } from "../middleware/auth";

const router = Router();
router.use(authMiddleware);

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const owner_id = (req as any).user.id;
    const data = await analyticsService.getAnalytics(owner_id);
    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
});

export default router;
