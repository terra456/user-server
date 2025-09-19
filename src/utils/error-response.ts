export default class ErrorResponse extends Error {
  statusCode: number;
  constructor(statusCode: number, message: string) {
    super(message); // Call the parent Error constructor
    this.statusCode = statusCode;
  }
}

export class NotFoundError extends ErrorResponse {
  constructor(message: string) {
    super(404, message);
  }
}

export class AccessDenied extends ErrorResponse {
  constructor() {
    super(403, 'Доступ запрещен');
  }
}

