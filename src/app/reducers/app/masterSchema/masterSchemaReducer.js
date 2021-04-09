const getMasterSchemaFieldsSuccess = (state, {payload}) => {
  state.isLoading = false;
  state.isError = null;
  state.masterSchema.fields = payload;
};

export default {
  getMasterSchemaFieldsSuccess,
};
