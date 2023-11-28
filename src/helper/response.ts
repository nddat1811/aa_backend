export const CODE_SUCCESS = 200;


export const ERROR_BAD_REQUEST = 400;
export const ERROR_NOT_FOUND = 404
export const CodeErrorInvalidEmailPassword = 102;

interface MyResponse<T> {
  Code: number;
  Message: string;
  Data: T;
}

interface PageInfo<T> {
  Total: number;
  CurrentTotal: number;
  CurrentPage: number;
  Data: T;
}

interface PagingResponse<T> {
  Code: number;
  Message: string;
  Data: PageInfo<T>;
}

function returnPagingResponse<T>(
  Code: number,
  Message: string,
  Total: number,
  CurrentTotal: number,
  CurrentPage: number,
  Data: T
): PagingResponse<T> {
  return {
    Code,
    Message,
    Data: {
      Total,
      CurrentTotal,
      CurrentPage,
      Data,
    },
  };
}

function returnResponse<T>(
  Code: number,
  Message: string,
  Data: T
): MyResponse<T> {
  return { Code, Message, Data };
}

export { returnResponse, returnPagingResponse };
