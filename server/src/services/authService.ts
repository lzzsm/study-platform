import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { userRepository } from "../repositories/userRepository";
import { registerSchema, loginSchema } from "../schemas/auth.schemas";
import { AppError } from "../errors/AppError";

async function register(
  name: string,
  email: string,
  password: string,
): Promise<string> {
  const result = registerSchema.safeParse({ name, email, password });

  if (!result.success) {
    throw new AppError("Dados inválidos.", 400);
  }

  const existing = await userRepository.findByEmail(email);

  if (existing) {
    throw new AppError("Email já cadastrado.", 409);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await userRepository.create(name, email, hashedPassword);

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, {
    expiresIn: "7d",
  });

  return token;
}

async function login(email: string, password: string): Promise<string> {
  const result = loginSchema.safeParse({ email, password });

  if (!result.success) {
    throw new AppError("Dados inválidos.", 400);
  }

  const user = await userRepository.findByEmail(email);

  if (!user) {
    throw new AppError("Email ou senha inválidos.", 401);
  }

  const validPassword = await bcrypt.compare(password, user.password);

  if (!validPassword) {
    throw new AppError("Email ou senha inválidos.", 401);
  }

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, {
    expiresIn: "7d",
  });

  return token;
}

export const authService = { register, login };
