import { clientAPI } from "api/clientAPI";
import { clientFetch } from "api/clientFetch";

export enum APIPrefix {
  API = "/api",
  Member = "/member-view-api",
}

// Temporary solution while there is no DI.
export abstract class AbstractService {
  static COMMON_PREFIX = "/api";
  static MEMBER_VIEW_PREFIX = "/api";
  protected apiClient: typeof clientAPI = clientAPI;
  protected httpClient: typeof clientFetch = clientFetch;

  protected abstract prefix: APIPrefix;

  getUrl(baseUrl: string): string {
    return `${this.prefix}${baseUrl}`;
  }
}

export class APIService extends AbstractService {
  static prefix = APIPrefix.API;
  static apiClient: typeof clientAPI = clientAPI;
  static httpClient: typeof clientFetch = clientFetch;
  protected prefix = APIPrefix.API;
}

export class MemberViewAPIService extends AbstractService {
  static prefix = APIPrefix.API;
  static apiClient: typeof clientAPI = clientAPI;
  static httpClient: typeof clientFetch = clientFetch;
  protected prefix = APIPrefix.Member;
}
