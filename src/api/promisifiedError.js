export class PromisifiedError extends Error {
  toReject() {
    return Promise.reject(this);
  }
}
