import { toast } from "react-toastify";

const getGroupsSuccess = (state, { payload }) => {
  state.isLoading = false;
  state.isError = null;
  state.user.groups = payload;
};

const getOrganizationsSuccess = (state, { payload }) => {
  state.organizations.network = payload.filter((org) => org.type === "network");
  state.organizations.corporation = payload.filter((org) => org.type === "corporation");
  state.organizations.member_firm = payload.filter((org) => org.type === "member_firm");
};

const setSelectedOrganizationIdAndType = (state, { payload }) => {
  state.organizations.selectedOrganizationIdAndType = { id: payload.id, type: payload.type };
};

const createOrganizationSuccess = (state, { payload }) => {
  state.isLoading = false;
  state.organizations[payload.type].push(payload);
  toast.success("Organization created");
};

const updateOrganizationSuccess = (state, { payload }) => {
  state.isLoading = false;
  const updatedOrgIndex = state.organizations[payload.type].findIndex(
    (org) => payload.id === org.id && payload.type === org.type
  );
  state.organizations[payload.type][updatedOrgIndex] = payload;

  toast.success(`${payload.name} organization saved`);
};

const getOrganizationLogoRequest = (state, { payload }) => {
  state.isLoading = true;

  const orgIndex = state.organizations[payload.type].findIndex((org) => org.id === payload.id);

  state.organizations[payload.type][orgIndex].logo.isLoading = true;

  state.isError = null;
};

const getOrganizationLogoSuccess = (state, { payload }) => {
  state.isLoading = false;
  const orgIndex = state.organizations[payload.orgType].findIndex((org) => org.id === payload.orgId);

  state.organizations[payload.orgType][orgIndex].logo.base64 = payload.logoBase64;
  state.organizations[payload.orgType][orgIndex].logo.isLoading = false;
};

export default {
  getGroupsSuccess,
  getOrganizationsSuccess,
  createOrganizationSuccess,
  updateOrganizationSuccess,
  getOrganizationLogoRequest,
  getOrganizationLogoSuccess,
  setSelectedOrganizationIdAndType,
};
