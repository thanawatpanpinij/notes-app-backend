import rateLimit from "express-rate-limit";

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 100, // limit each IP at 100 requests
  standardHeaders: true,
  legacyHeaders: false,
});

export default limiter;
