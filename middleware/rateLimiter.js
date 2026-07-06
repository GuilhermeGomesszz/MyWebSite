import rateLimit from "express-rate-limit";

// Limite de requisições global para a API (ex: 150 requisições a cada 15 minutos por IP)
export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 150, // Limite de 150 requisições
    message: {
        status: "error",
        message: "Muitas requisições vindas deste IP. Por favor, tente novamente mais tarde."
    },
    standardHeaders: true, // Retorna os cabeçalhos de limite nos headers RateLimit-*
    legacyHeaders: false, // Desativa X-RateLimit-* antigos
});

// Limite específico para autenticação para prevenir força bruta (ex: 15 requisições a cada 15 minutos)
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 15, // Limite de 15 requisições
    message: {
        status: "error",
        message: "Muitas tentativas de login ou registro. Por favor, tente novamente após 15 minutos."
    },
    standardHeaders: true,
    legacyHeaders: false,
});
