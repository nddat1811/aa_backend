export const CODE_SUCCESS = 200;
export const ERROR_BAD_REQUEST = 400;
export const CodeErrorInvalidEmailPassword = 102;

interface MyResponse<T> {
  Code: number;
  Message: string;
  Data: T;
}

function returnResponse<T>(
  Code: number,
  Message: string,
  Data: T
): MyResponse<T> {
  return { Code, Message, Data };
}

export default returnResponse;
