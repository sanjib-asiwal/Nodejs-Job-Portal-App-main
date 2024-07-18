const errorMiddleware = (err, req, res, next) => {
  console.error(err); // Logs the full error object for debugging

  const defaultErrors = {
    statusCode: 500,
    message: "Internal Server Error",
  };

  // Validation error (e.g., missing fields)
  if (err.name === "ValidationError") {
    defaultErrors.statusCode = 400;
    defaultErrors.message = Object.values(err.errors)
      .map((item) => item.message)
      .join(", ");
  }

  // Duplicate key error
  if (err.code && err.code === 11000) {
    defaultErrors.statusCode = 400;
    defaultErrors.message = `${Object.keys(err.keyValue)} field must be unique`;
  }

  res.status(defaultErrors.statusCode).json({ message: defaultErrors.message });
};

module.exports = errorMiddleware;
