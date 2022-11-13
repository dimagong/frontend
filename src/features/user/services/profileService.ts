import { AbstractService, API_PREFIX_TYPE } from "features/common";

abstract class ProfileService extends AbstractService {
  get(): Promise<unknown> {
    const url = this.getUrl("/user/profile");

    return this.apiClient.get(url);
  }
}

/**
 * Currently there is no api to distinguish which is profile need to use.
 */
// export class MemberProfileService extends ProfileService {
//   static get instance() {
//     return new MemberProfileService();
//   }
//
//   readonly prefix: API_PREFIX_TYPE = "/member-view-api";
// }

export class ManagerProfileService extends ProfileService {
  static get instance() {
    return new ManagerProfileService();
  }

  readonly prefix: API_PREFIX_TYPE = "/api";
}
