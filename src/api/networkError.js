import { PromisifiedError } from "./promisifiedError";

export class NetworkError extends PromisifiedError {
  static notOkResponse(response) {
    return new NetworkError(`Network error: ${response.statusText}`, response);
  }

  constructor(message, response) {
    super(message);

    this.name = "NetworkError";
    this.response = response;
  }
}
