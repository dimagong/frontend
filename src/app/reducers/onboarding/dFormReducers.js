const createSections = ({ dForm }) => {
  return Object.keys(dForm.schema.uiSchema.sectionGroups).map((section) => ({ type: section }));
};

const setdForms = (state, { payload }) => {
  state.dForm.dForms = payload.map((dForm) => ({ ...dForm }));
};

const setdForm = (state, { payload }) => {
  state.dForm.dForm = payload;
};

const setdFormGroups = (state, { payload }) => {
  state.dForm.dForm.groups = payload;
};

const setdFormActions = (state, { payload }) => {
  state.dForm.actions = payload;
};

const setdFormTriggers = (state, { payload }) => {
  state.dForm.triggers = payload;
};

export default {
  setdForms,
  setdForm,
  setdFormGroups,
  setdFormActions,
  setdFormTriggers,
};
