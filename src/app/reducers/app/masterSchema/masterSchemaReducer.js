const masterSchemaReducer = {
  getMasterSchemaFieldsSuccess: (state, {payload}) => {
    state.isLoading = false;
    state.isError = null;
    state.masterSchema.fields = payload;
  },

  getMasterSchemaOrganizationsSuccess: (state, {payload}) => {

    state.masterSchema.organizations = payload;

    state.isLoading = false;
    state.isError = null;
  },

  setSelectedOrganizationMasterSchema: (state, {payload}) => {
    state.masterSchema.selectedOrganization = payload;
  },
};

export default masterSchemaReducer;
