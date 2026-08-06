export const errorHandler = (err, req, res, _next) => {
  console.error("Backend Error:", err);

  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message || "Internal Server Error";

  // Mongoose duplicate key error
  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue || {})[0] || "field";
    message = `An account with this ${field} already exists.`;
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((val) => val.message)
      .join(", ");
  }

  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
  });
};
