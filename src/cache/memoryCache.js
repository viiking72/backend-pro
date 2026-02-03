const cache = new Map();
console.log("🧠 Memory cache initialized");
/**
 * Set value with TTL
 */
exports.set = (key, value, ttlMs) => {
  const expiresAt = Date.now() + ttlMs;

  cache.set(key, {
    value,
    expiresAt
  });
};

/**
 * Get value if not expired
 */
exports.get = (key) => {
  const entry = cache.get(key);
  if (!entry){
    console.log("❌Cache miss");
    return null;
  } 
  console.log("📞Cache hit");


  if (Date.now() > entry.expiresAt) {
    cache.delete(key);
    return null;
  }

  return entry.value;
};

exports.del = (key) => {
  cache.delete(key);
};
//Clearing for invalidation
exports.clear = () => {
  cache.clear();
};

exports.keys = () => {
  return Array.from(cache.keys());
};
