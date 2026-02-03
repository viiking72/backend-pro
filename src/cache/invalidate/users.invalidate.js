// src/cache/invalidate/users.invalidate.js
const redisCache = require("../cache/redisCache");

exports.invalidateUsersCache = async () => {
  const keys = await redisCache.keys("users:*");

  for (const key of keys) {
    await redisCache.del(key);
  }
};
