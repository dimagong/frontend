import { clientAPI } from "api/clientAPI";
import { clientFetch } from "api/clientFetch";

export type API_PREFIX_TYPE = "/api" | "/member-view-api";

// Temporary solution while there is no DI.
export abstract class AbstractService {
  protected apiClient: typeof clientAPI = clientAPI;
  protected httpClient: typeof clientFetch = clientFetch;

  protected abstract prefix: API_PREFIX_TYPE;

  getUrl(baseUrl: string): string {
    return `${this.prefix}${baseUrl}`;
  }
}
