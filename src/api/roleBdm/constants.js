export const GetBdmSubordinates = (userId) => `/api/role-bdm/${userId}/subordinates`;

export const GetActiveBdmUsers = (userId) => `/api/role-bdm/${userId}/active-bdms`;
export const GetPotentialBdmUsers = (userId) => `/api/role-bdm/${userId}/potential-bdms`;
export const PutPotentialBdmUsers = (userId) => `/api/role-bdm/${userId}/sync-bdms`;

export const GetBdmUsersByMemberFirm = (memberFirmId) => `/api/role-bdm/${memberFirmId}/member-firm-bdms`;
export const GetPotentialBdmUsersByMemberFirm = (memberFirmId) => `/api/role-bdm/${memberFirmId}/member-firm-potential-bdms`;
export const PutPotentialBdmUsersByMemberFirm = (memberFirmId) => `/api/role-bdm/${memberFirmId}/member-firm-sync-bdms`;
