// src/cache/redisCache.js
const redis = require("../config/redis");

exports.get = async (key) => {
  const value = await redis.get(key);
  if (!value) return null;

  console.log("⚡ Redis cache hit");
  return JSON.parse(value);
};

exports.set = async (key, value, ttlMs) => {
  await redis.set(
    key,
    JSON.stringify(value),
    "PX",
    ttlMs
  );
};

exports.del = async (key) => {
  await redis.del(key);
};

exports.keys = async (pattern) => {
  let cursor = "0";
  const keys = [];

  do {
    const [nextCursor, batch] = await redis.scan(
      cursor,
      "MATCH",
      pattern,
      "COUNT",
      100
    );
    cursor = nextCursor;
    keys.push(...batch);
  } while (cursor !== "0");

  return keys;
};