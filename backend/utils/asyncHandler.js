/**
 * asyncHandler utility to wrap async express routes and catch errors
 * to be handled by the global error handler middleware.
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;