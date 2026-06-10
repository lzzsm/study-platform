import bcrypt from "bcrypt";
import { userRepository } from "../repositories/userRepository";
import { AppError } from "../errors/AppError";

async function getProfile(id: number) {
  const user = await userRepository.findPublicById(id);
  if (!user) throw new AppError("Usuário não encontrado.", 404);
  return user;
}

async function updateProfile(
  id: number,
  name: string,
  bio: string | null,
  avatar_url: string | null,
) {
  const user = await userRepository.updateProfile(id, name, bio, avatar_url);
  if (!user) throw new AppError("Usuário não encontrado.", 404);
  return user;
}

async function updatePassword(
  id: number,
  currentPassword: string,
  newPassword: string,
) {
  const user = await userRepository.findById(id);
  if (!user) throw new AppError("Usuário não encontrado.", 404);

  const valid = await bcrypt.compare(currentPassword, user.password);
  if (!valid) throw new AppError("Senha atual incorreta.", 401);

  const hashed = await bcrypt.hash(newPassword, 10);
  await userRepository.updatePassword(id, hashed);
}

export const userService = { getProfile, updateProfile, updatePassword };
