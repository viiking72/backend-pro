const memoryCache = require("./memoryCache");

exports.invalidateUsersCache = () => {
  const keys = memoryCache.keys();

  for (const key of keys) {
    if (key.startsWith("users:")) {
      memoryCache.del(key);
    }
  }
};