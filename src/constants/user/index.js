export const getProfilePath =  "/api/user/profile";
export const getFilterPath =  "/api/user-filter";
export const getFilterPathByID = (id) =>  `/api/user-filter/${id}`;
export const getUsersPath =  "/api/user/getByEmail";
export const getUserByIdPath =  (id) => `/api/user/${id}`;
export const updateUserPath =  "/api/user";
export const updateUserRolesPath = (id) => `/api/user/${id}/roles`;
export const addUserGroupsPath = (id) => `/api/user/${id}/groups/add`;
export const removeUserGroupsPath = (id) => `/api/user/${id}/groups/remove`;
export const getUserAvatarPath =  "/api/file/user";
export const updateUserAvatarPath = (id) => `/api/file/user/${id}/avatar`;
export const deleteUserAvatarPath = (id) => `/api/file/${id}`;
export const getUsersDataPath = "api/user";
export const getAllowedUserListPath = "api/user/allowed-user-list";
export const createUserOnboarding = "api/onboarding";
export const deleteUserOnboarding = "api/onboarding";
export const createUserPath = "/api/user"
export const getInvitationsPath = "/api/invitation"
export const createInvitationsPath = ({managerId, resend}) => `/api/invitation?${new URLSearchParams({ user_id: managerId, resend })}`;
export const deleteInvitationsPath = (id) => `/api/invitation/${id}`;
export const revokeInvitationsPath = (id) => `/api/invitation/${id}/revoke`;
export const getInvitationPath = (id) => `/api/invitation/${id}`;
export const sendInvitationAcceptPath = '/api/invitation/accept';
export const getOnboardingsByUserPath = (userId) => `/api/user/${userId}/onboardings`;
export const updateUserApplicationsOrder = (userId) => `api/user/${userId}/sort-apps`;
