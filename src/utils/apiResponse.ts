export const apiResponse = (data: any, statusCode: number) => {
  return {
    statusCode,
    data,
  };
};