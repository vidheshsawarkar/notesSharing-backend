const setRateLimit = require("express-rate-limit");

// Rate limit middleware
const rateLimitMiddleware = setRateLimit({
  windowMs: 10 * 1000,
  max: 5,
  message: "Too many requests at the same time. Please try again",
  headers: true,
});

module.exports = rateLimitMiddleware;