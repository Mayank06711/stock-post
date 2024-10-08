class ApiError extends Error {
  constructor(
    statusCode,
    message = "Something went wrong",
    errors = [],
    stack = ""
  ) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.stack = stack;
    if (stack) {
      this.stack = stack;
    } else {
      console.log("Error  from ApiError ");
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
export { ApiError };
