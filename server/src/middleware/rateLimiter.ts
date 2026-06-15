import rateLimit from "express-rate-limit";

export const authRateLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutos
  max: 15, // 15 tentativas por janela
  message: { error: "Muitas tentativas. Tente novamente em alguns minutos." },
  standardHeaders: true,
  legacyHeaders: false,
});
