export const apiError = (message: string, statusCode: number) => {
  return {
    statusCode,
    message,
  };
};