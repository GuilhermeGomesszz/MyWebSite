import NodeCache from "node-cache";

// Inicializa o cache com TTL padrão de 5 minutos (300 segundos) e verificação a cada 60 segundos
export const cache = new NodeCache({ stdTTL: 300, checkperiod: 60 });

/**
 * Middleware para cachear respostas de requisições GET.
 * @param {number} ttlInSeconds - Tempo de expiração do cache em segundos.
 */
export const cacheMiddleware = (ttlInSeconds = 300) => {
    return (req, res, next) => {
        // Cacheia apenas requisições GET
        if (req.method !== "GET") {
            return next();
        }

        const key = req.originalUrl || req.url;
        const cached = cache.get(key);

        if (cached) {
            res.setHeader("Content-Type", cached.contentType || "application/json");
            res.setHeader("X-Cache", "HIT");
            return res.send(cached.body);
        }

        res.setHeader("X-Cache", "MISS");

        // Sobrescreve o res.send original para capturar e salvar a resposta no cache
        const originalSend = res.send;
        res.send = function (body) {
            if (res.statusCode === 200) {
                cache.set(key, {
                    body,
                    contentType: res.getHeader("Content-Type")
                }, ttlInSeconds);
            }
            return originalSend.call(this, body);
        };

        next();
    };
};

/**
 * Invalida chaves do cache que contêm um determinado padrão/prefixo.
 * Útil para limpar o cache quando ocorrem mutações (POST, PUT, DELETE, PATCH).
 * @param {string} pattern - O padrão a ser buscado nas chaves (ex: "/api/services").
 */
export const clearCachePattern = (pattern) => {
    try {
        const keys = cache.keys();
        const matches = keys.filter(key => key.includes(pattern));
        if (matches.length > 0) {
            cache.del(matches);
            console.log(`[Cache Invalidation] Chaves removidas para o padrão "${pattern}":`, matches);
        }
    } catch (error) {
        console.error("[Cache Invalidation Error] Erro ao limpar cache:", error);
    }
};
