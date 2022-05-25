import { NetworkError } from "./networkError";

export const clientFetch = (input, init) => {
  return window.fetch(input, init).then((response) => {
    if (!response.ok) {
      return NetworkError.notOkResponse(response).toReject();
    }

    return Promise.resolve(response);
  });
};
