const asyncHandler = (requestHandler) =>
  (req, res, next) => {
    // Resolve the requestHandler promise and catch any errors
    Promise.resolve(requestHandler(req, res, next)).catch((err) => {
      console.log("ERROR FROM REQUEST HANDLER FUNCTION: " + err);
      next(err);
    });
  };


export default asyncHandler



