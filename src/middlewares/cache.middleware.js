// src/middlewares/cache.middleware.js
const redisCache = require("../cache/redisCache");

/**
 * Generic cache middleware
 * @param {Function} keyBuilder - builds cache key from req
 * @param {number} ttlMs
 */
exports.cacheMiddleware = (keyBuilder, ttlMs = 60_000) => {
  return async (req, res, next) => {
    try {
      const key = keyBuilder(req);

      const cachedResponse = await redisCache.get(key);
      if (cachedResponse) {
        return res.status(200).json(cachedResponse);
      }

      const originalJson = res.json.bind(res);

      res.json = (body) => {
        redisCache.set(key, body, ttlMs);
        return originalJson(body);
      };

      next();
    } catch (err) {
      // cache must fail open
      next();
    }
  };
};
