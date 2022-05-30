import { toast } from "react-toastify";

const memberFirmsReducer = {
  createMasterSchemaFieldForMemberFirmSuccess: (state) => {
    state.isLoading = false;
    state.error = null;
  },

  createMemberFirmSuccess: (state, { payload }) => {
    state.memberFirms = [...state.memberFirms, payload];

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
    state.selectedMemberFirmUsers = payload.response;
    toast.success(payload.isEdit ? "The user role was successfully changed" : "The user was successfully added");

    state.isLoading = false;
    state.error = null;
  },

  removeMemberFirmUsersSuccess: (state, { payload }) => {
    state.selectedMemberFirmUsers = payload.response;
    toast.success("The user was successfully removed");
    state.isLoading = false;
    state.error = null;
  },

  getMasterSchemaFieldsForMemberFirmSuccess: (state, { payload }) => {
    state.selectedMemberFirmMSFields = payload;

    state.isLoading = false;
    state.error = null;
  },

  getMemberFirmFormFieldsSuccess: (state, { payload }) => {
    state.selectedMemberFirmFormFields = payload;

    state.isLoading = false;
    state.error = null;
  },

  updateMemberFirmFormValuesSuccess: (state) => {
    toast.success("Successfully saved");

    state.isLoading = false;
    state.error = null;
  },

  updateMemberFirmProfileImageSuccess: (state, { payload }) => {
    state.memberFirms = state.memberFirms.map((memberFirm) =>
      memberFirm.id === payload.id ? { ...memberFirm, logo: payload.logo } : memberFirm
    );

    state.isLoading = false;
    state.error = null;
  },

  removeMemberFirmLogoSuccess: (state, { payload }) => {
    state.memberFirms = state.memberFirms.map((memberFirm) =>
      memberFirm.id === payload.id ? { ...memberFirm, logo: null } : memberFirm
    );

    state.isLoading = false;
    state.error = null;
  },

  getMemberFirmSuccess: (state, { payload }) => {
    state.memberFirms = state.memberFirms.map((memberFirm) => (memberFirm.id === payload.id ? payload : memberFirm));

    state.isLoading = false;
    state.error = null;
  },

  getMemberFirmActivitiesSuccess: (state, { payload }) => {
    state.memberFirmActivities = payload.memberFirmActivities;

    state.isLoading = false;
    state.error = false;
  },

  addFieldToMemberFirmSuccess: (state, { payload }) => {
    state.selectedMemberFirmFormFields = payload;

    state.isLoading = false;
    state.error = false;
  },
};

export default memberFirmsReducer;
