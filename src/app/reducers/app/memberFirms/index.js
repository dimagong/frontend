import {toast} from "react-toastify";

const memberFirmsReducer = {
  createMemberFirmSuccess: (state, { payload }) => {
    state.memberFirms.data = [...state.memberFirms.data, payload];

    state.isLoading = false;
    state.error = null;
  },

  getMemberFirmsSuccess: (state, { payload }) => {
    state.memberFirms = payload;

    state.isLoading = false;
    state.error = null;
  },

  setSelectedMemberFirmId: (state, { payload }) => {
    state.selectedMemberFirmId = payload;
  },

  getMemberFirmUsersSuccess: (state, { payload }) => {
    state.selectedMemberFirmUsers = payload;

    state.isLoading = false;
    state.error = null;
  },

  getMemberFirmPotentialUsersSuccess: (state, { payload }) => {
    state.selectedMemberFirmPotentialUsers = payload;

    state.isLoading = false;
    state.error = null;
  },

  addMemberFirmUsersSuccess: (state, { payload }) => {
    state.selectedMemberFirmUsers = payload;
    state.selectedMemberFirmUsers = payload.response
    toast.success(payload.isEdit ? "The user role was successfully changed" : "The user was successfully added")

    state.isLoading = false;
    state.error = null;
  },

  removeMemberFirmUsersSuccess: (state, { payload }) => {
    state.selectedMemberFirmUsers = payload;
    toast.success("The user was successfully removed")
    state.isLoading = false;
    state.error = null;
  },

  getMasterSchemaFieldsForMemberFirmSuccess: (state, {payload}) => {
    state.selectedMemberFirmMSFields = payload;

    state.isLoading = false;
    state.error = null;
  },

  getMemberFirmFormFieldsSuccess: (state, {payload}) => {
    state.selectedMemberFirmFormFields = payload;

    state.isLoading = false;
    state.error = null;
  },

  updateMemberFirmFormValuesSuccess: (state) => {
    toast.success("Successfully saved");

    state.isLoading = false;
    state.error = null;
  },

  updateMemberFirmProfileImageSuccess: (state, {payload}) => {
    console.log("UMFPIS", payload);

    state.isLoading = false;
    state.error = null;
  },
};

export default memberFirmsReducer;
