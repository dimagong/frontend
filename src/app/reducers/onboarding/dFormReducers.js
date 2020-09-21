  const setdForms = (state , {payload}) => ({
    ...state,
    dForm: {
      dForms: payload,
      dForm: state.dForm.dForm
    }
  });

  const setdForm = (state, {payload}) => ({
    ...state,
    dForm: {
      dForms: state.dForm.dForms,
      dForm: payload
    }
  });

  const setdFormGroups = (state, {payload}) => ({
    ...state,
    dForm: {
      dForms: state.dForm.dForms,
      dForm: {
        ...state.dForm.dForm,
        groups: payload
      }
    }
  })
  
export default {
    setdForms,
    setdForm,
    setdFormGroups
  };