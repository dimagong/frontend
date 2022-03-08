import { from } from "rxjs";

import { http } from "api";

import * as Urls from "./constants";

export const RoleBdmService = {
  getActiveBdmUsers({ userId }) {
    return http.get(Urls.GetActiveBdmUsers(userId));
  },

  getActiveBdmUsers$({ userId }) {
    return from(RoleBdmService.getActiveBdmUsers({ userId }));
  },

  getPotentialBdmUsers({ userId }) {
    return http.get(Urls.GetPotentialBdmUsers(userId));
  },

  getPotentialBdmUsers$({ userId }) {
    return from(RoleBdmService.getPotentialBdmUsers({ userId }));
  },

  putPotentialBdmUsers({ userId, bdmUsersIds }) {
    return http.put(Urls.PutPotentialBdmUsers(userId), { bdm_user_ids: bdmUsersIds });
  },

  putPotentialBdmUsers$({ userId, bdmUsersIds }) {
    return from(RoleBdmService.putPotentialBdmUsers({ userId, bdmUsersIds }));
  },

  // MemberFirm

  getBdmUsersByMemberFirm({ memberFirmId }) {
    return http.get(Urls.GetBdmUsersByMemberFirm(memberFirmId));
  },

  getBdmUsersByMemberFirm$({ memberFirmId }) {
    return from(RoleBdmService.getBdmUsersByMemberFirm({ memberFirmId }));
  },

  getPotentialBdmUsersByMemberFirm({ memberFirmId }) {
    return http.get(Urls.GetPotentialBdmUsersByMemberFirm(memberFirmId));
  },

  getPotentialBdmUsersByMemberFirm$({ memberFirmId }) {
    return from(RoleBdmService.getPotentialBdmUsersByMemberFirm({ memberFirmId }));
  },

  putPotentialBdmUsersByMemberFirm({ memberFirmId, bdmUsersIds }) {
    return http.put(Urls.PutPotentialBdmUsersByMemberFirm(memberFirmId), { bdm_users_ids: bdmUsersIds });
  },

  putPotentialBdmUsersByMemberFirm$({ memberFirmId, bdmUsersIds }) {
    return from(RoleBdmService.putPotentialBdmUsersByMemberFirm({ memberFirmId, bdmUsersIds }));
  },
};
