import { requestLayout } from "../index";

import {
  attachUsersToMemberFirmUrl,
  createMemberFirm,
  detachUsersFromMemberFirmUrl,
  getMemberFirmMembersUrl,
  getMemberFirms,
  getPotentialMembers,
  getMasterSchemaFieldsForMemberFirmUrl,
  getMemberFirmFormFieldsUrl,
  updateMemberFirmFormValuesUrl,
  updateMemberFirmLogo,
} from "./constants";

const memberFirmsApi = {
  async createMemberFirm({ payload }) {
    return await requestLayout(createMemberFirm, "POST", payload)
  },

  async getMemberFirms() {
    return await requestLayout(getMemberFirms, "GET")
  },

  async getMemberFirmUsers(memberFirmId) {
    return await requestLayout(getMemberFirmMembersUrl(memberFirmId), "GET")
  },

  async getMemberFirmPotentialUsers(memberFirmId) {
    return await requestLayout(getPotentialMembers(memberFirmId), "GET")
  },

  async addMemberFirmUsers({memberFirmId, users}) {
    return await requestLayout(attachUsersToMemberFirmUrl(memberFirmId), "PUT", {users})
  },

  async removeMemberFirmUsers({memberFirmId, users}) {
    return await requestLayout(detachUsersFromMemberFirmUrl(memberFirmId), "PUT", {users})
  },

  async getMasterSchemaFieldsForMemberFirm(memberFirmId) {
    return await requestLayout(getMasterSchemaFieldsForMemberFirmUrl(memberFirmId), "GET")
  },

  async getMemberFirmFormFields(memberFirmId) {
    return await requestLayout(getMemberFirmFormFieldsUrl(memberFirmId), "GET")
  },

  async updateMemberFirmFormValues(payload) {
    return await requestLayout(updateMemberFirmFormValuesUrl(payload.memberFirmId), "PUT", payload.data)
  },

  async updateMemberFirmLogo(payload) {
    return await requestLayout(updateMemberFirmLogo(payload.memberFirmId), "PUT", payload.logo)
  }

};

export default memberFirmsApi;
