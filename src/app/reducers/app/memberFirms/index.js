const memberFirmsReducer = {
  createMemberFirmSuccess: (state, { payload }) => {
    console.log(payload);

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
  }
};

export default memberFirmsReducer;
