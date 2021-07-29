export const getMemberFirms = '/api/member-firm/';
export const createMemberFirm = "/api/member-firm/";
export const updateMemberFirm = (memberFirmId) => `/api/member-firm/${memberFirmId}`;
export const updateMemberFirmLogo = (memberFirmId) => `/api/member-firm/${memberFirmId}/logo`;
export const getPotentialMembers = (memberFirmId) => `api/member-firm/${memberFirmId}/potential-members`;
export const attachUsersToMemberFirmUrl = (memberFirmId) => `/api/member-firm/${memberFirmId}/attach-users`;
export const detachUsersFromMemberFirmUrl = (memberFirmId) => `api/member-firm/${memberFirmId}/detach-users`;
export const getMemberFirmMembersUrl = (memberFirmId) => `/api/member-firm/${memberFirmId}/members`;
