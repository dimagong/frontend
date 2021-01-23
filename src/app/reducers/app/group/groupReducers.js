import {toast} from 'react-toastify'

const getGroupsSuccess = (state, {payload}) => {
  state.isLoading = false;
  state.isError = null;
  state.user.groups = payload;
};

const getGroupsRequest = (state) => {
  state.isLoading = true;
  state.isError = null;
};
const getGroupsError = (state, {payload}) => {
  state.isLoading = false;
  state.isError = payload;
};

const getOrganizationsRequest = (state) => {
  state.isLoading = true;
  state.isError = null;
}

const getOrganizationsSuccess = (state, {payload}) => {
  state.organizations.network = payload.filter((org) =>  org.type === "network");
  state.organizations.corporation = payload.filter((org) =>  org.type === "corporation");
  state.organizations.member_firm = payload.filter((org) =>  org.type === "member_firm");
}

const getOrganizationsError = (state, {payload}) => {
  state.isLoading = false;
  state.isError = payload;
}

const setSelectedOrganizationIdAndType = (state, {payload}) => {
  state.organizations.selectedOrganizationIdAndType = {id: payload.id, type: payload.type}
}

const createOrganizationRequest = (state) => {
  state.isLoading = true;
  state.isError = null;
}
const createOrganizationSuccess = (state, {payload}) => {
  state.isLoading = false;
  console.log(payload)
  state.organizations[payload.type].push(payload)
  toast.success("Organization created")
}
const createOrganizationError = (state, {payload}) => {
  state.isLoading = false;
  state.isError = payload;
}

const updateOrganizationRequest = (state) => {
  state.isLoading = true;
  state.isError = null;
}
const updateOrganizationSuccess = (state, {payload}) => {
  state.isLoading = false;
  const updatedOrgIndex = state.organizations[payload.type].findIndex((org) => payload.id === org.id && payload.type === org.type)
  state.organizations[payload.type][updatedOrgIndex] = payload;

  toast.success(`${payload.name} organization saved` )
}
const updateOrganizationError = (state, {payload}) => {
  state.isLoading = false;
  state.isError = payload;
}

export default {
  getGroupsSuccess,
  getGroupsRequest,
  getGroupsError,

  getOrganizationsRequest,
  getOrganizationsSuccess,
  getOrganizationsError,

  createOrganizationRequest,
  createOrganizationSuccess,
  createOrganizationError,

  updateOrganizationRequest,
  updateOrganizationSuccess,
  updateOrganizationError,

  setSelectedOrganizationIdAndType,
};
