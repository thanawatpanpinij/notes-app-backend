export default function errorHandling(error, request, response, next) {
  const status = error.status;
  const stack = error.stack;
  const errorResponse = {
    status,
    isError: error.isError,
    message: error.message,
  };

  if (error.details) {
    errorResponse.details = error.details;
  }

  if (process.env.NODE_ENV === "development") {
    errorResponse.stack = stack;
  }

  console.error(stack);
  response.status(status).json(errorResponse);
}
