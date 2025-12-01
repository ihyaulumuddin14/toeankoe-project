export default class HttpError extends Error {
  statusCode: number
  name: string
  details?: string

  constructor(statusCode: number, message: string, details?: string) {
    super(message);
    this.statusCode = statusCode;
    this.name = "HttpError";
    this.details = details;

    Object.setPrototypeOf(this, HttpError.prototype);
  }
}