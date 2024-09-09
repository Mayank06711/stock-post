class ApiError extends Error {
  constructor(
    statusCode, 
    message = "Something went wrong", 
    errors = [], 
    stack = "" 
  ) {
    super(message); 
    this.statusCode = statusCode;
    this.data = null; 
    this.errors = errors; 
    this.stack = stack; 
    this.success = false;
    if (stack) {
      this.stack = stack; 
    } else {
      console.log("Error  from ApiError ");
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
export { ApiError };
