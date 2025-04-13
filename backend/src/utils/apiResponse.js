export class APIResponse {
  constructor(data = null, message = 'Success', success = true) {
    this.success = success;
    this.message = message;
    this.data = data;
    this.timestamp = new Date().toISOString();
  }

  static success(res, data, message = 'Success', statusCode = 200) {
    return res.status(statusCode).json(new APIResponse(data, message));
  }

  static error(res, data, message = 'Error', statusCode = 400) {
    return res.status(statusCode).json(new APIResponse(data, message));
  }
}
