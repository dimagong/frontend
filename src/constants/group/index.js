export const groupTypes = {
  "App\\Admin": "admin",
  "App\\Corporation": "corporation",
  "App\\Network": "network",
  "App\\MemberFirm": "member_firm",
};
export const groupRelationsPath = "/api/groups-relations";
export const groupRelationsByUserIdPath = (id) => `/api/groups-relations/${id}`;
