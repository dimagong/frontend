import { clientAPI } from "api/clientAPI";
import { clientFetch } from "api/clientFetch";

// Temporary solution while there is no DI.
export abstract class AbstractService {
  protected apiClient: typeof clientAPI = clientAPI;
  protected httpClient: typeof clientFetch = clientFetch;

  protected abstract prefix: "/api" | "/member-view-api";

  getUrl(baseUrl: string): string {
    return `${this.prefix}${baseUrl}`;
  }
}
