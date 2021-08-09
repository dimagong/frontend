export const getMemberFirms = '/api/member-firm/';
export const createMemberFirm = "/api/member-firm/";
export const updateMemberFirmLogo = (memberFirmId) => `/api/member-firm/${memberFirmId}/logo`;
export const getPotentialMembers = (memberFirmId) => `api/member-firm/${memberFirmId}/potential-members`;
export const attachUsersToMemberFirmUrl = (memberFirmId) => `/api/member-firm/${memberFirmId}/attach-users`;
export const detachUsersFromMemberFirmUrl = (memberFirmId) => `api/member-firm/${memberFirmId}/detach-users`;
export const getMemberFirmMembersUrl = (memberFirmId) => `/api/member-firm/${memberFirmId}/members`;
export const getMasterSchemaFieldsForMemberFirmUrl = (memberFirmId) => `/api/member-firm/${memberFirmId}/master-schema-fields`;
export const getMemberFirmFormFieldsUrl = (memberFirmId) => `/api/member-firm/${memberFirmId}/field-structure`;
export const updateMemberFirmFormValuesUrl = (memberFirmId) => `/api/member-firm/${memberFirmId}/master-schema-field-values`;
export const removeMemberFirmLogoUrl = (memberFirmId) => `/api/member-firm/${memberFirmId}/logo`;
export const getMemberFirm = (memberFirmId) => `/api/member-firm/${memberFirmId}`;
export const getMemberFirmActivitiesUrl = (memberFirmId) => `/api/user/member-firm-dashboard?member_firm_ids[]=${memberFirmId}`;

export const addFormFieldToMemberFirmUrl = (memberFirmId) => `/api/member-firm/${memberFirmId}/field-structure`;
