const memberFirmsReducer = {
  createMemberFirmSuccess: (state, { payload }) => {
    console.log(payload);

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
    console.log('current', payload);

    state.selectedMemberFirmUsers = payload;

    state.isLoading = false;
    state.error = null;
  },

  getMemberFirmPotentialUsersSuccess: (state, { payload }) => {
    console.log('potential', payload);

    state.selectedMemberFirmPotentialUsers = payload

    state.isLoading = false;
    state.error = null;
  },

  addMemberFirmUsersSuccess: (state, { payload }) => {
    console.log('add', payload);

    state.selectedMemberFirmUsers = payload

    state.isLoading = false;
    state.error = null;
  },

  removeMemberFirmUsersSuccess: (state, { payload }) => {
    console.log('remove', payload);

    state.selectedMemberFirmUsers = payload

    state.isLoading = false;
    state.error = null;
  },
};

export default memberFirmsReducer;
