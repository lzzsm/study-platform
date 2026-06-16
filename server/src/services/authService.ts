import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { userRepository } from "../repositories/userRepository";
import { refreshTokenRepository } from "../repositories/refreshTokenRepository";
import { AppError } from "../errors/AppError";
import { TokenPair } from "../types/refreshToken.types";

const ACCESS_TOKEN_EXPIRES_IN = "15m";
const REFRESH_TOKEN_EXPIRES_IN_DAYS = 7;

async function generateTokens(user_id: number): Promise<TokenPair> {
  const accessToken = jwt.sign({ id: user_id }, process.env.JWT_SECRET!, {
    expiresIn: ACCESS_TOKEN_EXPIRES_IN,
  });

  const refreshToken = jwt.sign({ id: user_id }, process.env.JWT_SECRET!, {
    expiresIn: `${REFRESH_TOKEN_EXPIRES_IN_DAYS}d`,
  });

  const tokenHash = await bcrypt.hash(refreshToken, 10);

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + REFRESH_TOKEN_EXPIRES_IN_DAYS);

  await refreshTokenRepository.create(user_id, tokenHash, expiresAt);

  return { accessToken, refreshToken };
}

async function register(
  name: string,
  email: string,
  password: string,
): Promise<TokenPair> {
  const existing = await userRepository.findByEmail(email);
  if (existing) throw new AppError("Email já cadastrado.", 409);

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await userRepository.create(name, email, hashedPassword);

  return generateTokens(user.id);
}

async function login(email: string, password: string): Promise<TokenPair> {
  const user = await userRepository.findByEmail(email);
  if (!user) throw new AppError("Email ou senha inválidos.", 401);

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) throw new AppError("Email ou senha inválidos.", 401);

  return generateTokens(user.id);
}

async function refresh(token: string): Promise<TokenPair> {
  let payload: { id: number };
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET!) as { id: number };
  } catch {
    throw new AppError("Refresh token inválido ou expirado.", 401);
  }

  const storedTokens = await refreshTokenRepository.findByUser(payload.id);

  let matchedToken = null;
  for (const stored of storedTokens) {
    const matches = await bcrypt.compare(token, stored.token_hash);
    if (matches) {
      matchedToken = stored;
      break;
    }
  }

  if (!matchedToken) {
    throw new AppError("Refresh token inválido ou expirado.", 401);
  }

  await refreshTokenRepository.remove(matchedToken.id);

  return generateTokens(payload.id);
}

async function logout(token: string): Promise<void> {
  let payload: { id: number };
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET!) as { id: number };
  } catch {
    return;
  }

  const storedTokens = await refreshTokenRepository.findByUser(payload.id);

  for (const stored of storedTokens) {
    const matches = await bcrypt.compare(token, stored.token_hash);
    if (matches) {
      await refreshTokenRepository.remove(stored.id);
      break;
    }
  }
}

export const authService = { register, login, refresh, logout };
