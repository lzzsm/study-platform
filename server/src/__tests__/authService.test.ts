import { describe, it, expect, vi, beforeEach } from "vitest";
import { authService } from "../services/authService";
import { userRepository } from "../repositories/userRepository";
import { refreshTokenRepository } from "../repositories/refreshTokenRepository";
import bcrypt from "bcrypt";

vi.mock("../repositories/userRepository");
vi.mock("../repositories/refreshTokenRepository");
vi.mock("bcrypt");

// Objeto compartilhado para evitar duplicação e facilitar manutenção
const mockUser = {
  id: 1,
  name: "Luiz",
  email: "luiz@email.com",
  password: "hashed",
  avatar_url: null,
  bio: null,
  created_at: new Date(),
  updated_at: new Date(),
};

const mockRefreshToken = {
  id: 1,
  user_id: 1,
  token_hash: "hashed_refresh_token",
  expires_at: new Date(),
  created_at: new Date(),
  updated_at: new Date(),
};

describe("authService.register", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deve retornar um token quando os dados são válidos", async () => {
    // Simula que o email não existe no banco
    vi.mocked(userRepository.findByEmail).mockResolvedValue(null);

    // Simula que o usuário foi criado com sucesso
    vi.mocked(userRepository.create).mockResolvedValue(mockUser);

    // Mock necessário para o bcrypt.hash executado no service de registro
    vi.mocked(bcrypt.hash as any).mockResolvedValue("hashed_password");

    // Mock do refresh token salvo no banco
    vi.mocked(refreshTokenRepository.create).mockResolvedValue(
      mockRefreshToken,
    );

    const tokens = await authService.register(
      "Luiz",
      "luiz@email.com",
      "12345678",
    );

    expect(tokens.accessToken).toBeDefined();
    expect(tokens.refreshToken).toBeDefined();
    expect(typeof tokens.accessToken).toBe("string");
    expect(typeof tokens.refreshToken).toBe("string");
  });

  it("deve lançar AppError 409 quando o email já existe", async () => {
    // Simula que o email já está cadastrado
    vi.mocked(userRepository.findByEmail).mockResolvedValue(mockUser);

    await expect(
      authService.register("Luiz", "luiz@email.com", "12345678"),
    ).rejects.toMatchObject({ status: 409 });
  });
});

describe("authService.login", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("login com credenciais válidas → retorna token", async () => {
    // Simula que o email existe
    vi.mocked(userRepository.findByEmail).mockResolvedValue(mockUser);

    // Simula que a comparação de senha retornou verdadeira (senha correta)
    vi.mocked(bcrypt.compare as any).mockResolvedValue(true);

    // Mock do refresh token salvo no banco
    vi.mocked(refreshTokenRepository.create).mockResolvedValue(
      mockRefreshToken,
    );

    const tokens = await authService.login("luiz@email.com", "12345678");

    expect(tokens.accessToken).toBeDefined();
    expect(tokens.refreshToken).toBeDefined();
    expect(typeof tokens.accessToken).toBe("string");
    expect(typeof tokens.refreshToken).toBe("string");
  });

  it("login com email inexistente → AppError 401", async () => {
    // Simula que o email não existe
    vi.mocked(userRepository.findByEmail).mockResolvedValue(null);

    await expect(
      authService.login("luiz@email.com", "12345678"),
    ).rejects.toMatchObject({ status: 401 });
  });

  it("login com senha incorreta → AppError 401", async () => {
    // Simula que o usuário existe no banco
    vi.mocked(userRepository.findByEmail).mockResolvedValue(mockUser);

    // Simula que a senha informada é incorreta
    vi.mocked(bcrypt.compare as any).mockResolvedValue(false);

    await expect(
      authService.login("luiz@email.com", "senha incorreta"),
    ).rejects.toMatchObject({ status: 401 });
  });
});
