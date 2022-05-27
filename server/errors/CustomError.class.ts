export class CustomError extends Error {
  message: string;
  httpStatusCode: number;
  constructor (message: string, httpStatusCode: number) {
    super(message);
    this.message = message;
    this.httpStatusCode = httpStatusCode;
  }
}
