const getMasterSchemaFieldsRequest = (state, {payload}) => {
  state.isLoading = true;
  state.isError = null;
};

const getMasterSchemaFieldsSuccess = (state, {payload}) => {
  state.isLoading = false;
  state.isError = null;
  state.masterSchema.fields = payload;
};

const getMasterSchemaFieldsError = (state , {payload}) => {
  state.isLoading = false;
  state.isError = payload;
};



export default {
  getMasterSchemaFieldsSuccess,
  getMasterSchemaFieldsRequest,
  getMasterSchemaFieldsError,
};
