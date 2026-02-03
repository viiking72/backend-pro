exports.buildUsersCacheKey = (req) => {
  const {
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    order = "desc",
    role = "all",
    includeDeleted = "false",
  } = req.query;

  return `users:p=${page}:l=${limit}:s=${sortBy}:o=${order}:r=${role}:d=${includeDeleted}`;
};
