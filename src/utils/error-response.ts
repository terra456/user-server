export default class ErrorResponse extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message); // Call the parent Error constructor
    this.statusCode = statusCode;
  }
}

export class NotFoundError extends ErrorResponse {
  constructor(message: string) {
    super(message, 404);
  }
}

