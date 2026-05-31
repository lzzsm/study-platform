import "dotenv/config";
import express from "express";
import cors from "cors";
import authRouter from "./routes/auth";
import workspaceRouter from "./routes/workspaces";
import taskRouter from "./routes/tasks";
import goalRouter from "./routes/goals";
import habitRouter from "./routes/habits";
import analyticsRouter from "./routes/analytics";
import { Request, Response, NextFunction } from "express";
import { AppError } from "./errors/AppError";

if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET não definido.");
if (!process.env.DB_PASSWORD) throw new Error("DB_PASSWORD não definida.");

const app = express();
const PORT: number = 3000;

app.use(cors());
app.use(express.json());
app.use("/auth", authRouter);
app.use("/workspaces", workspaceRouter);
app.use("/workspaces/:workspaceId/tasks", taskRouter);
app.use("/workspaces/:workspaceId/goals", goalRouter);
app.use("/workspaces/:workspaceId/habits", habitRouter);
app.use("/analytics", analyticsRouter);

app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof AppError) {
    res.status(err.status).json({ error: err.message });
    return;
  }
  console.error(err);
  res.status(500).json({ error: "Erro interno do servidor." });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
