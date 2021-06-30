const requestActionTemplate = (state) => {
  state.isLoading = true;
  state.isError = null;
};
const errorActionTemplate = (state , {payload}) => {
  state.isLoading = false;
  state.isError = payload;
};

// Expected object with actions written following redux-toolkit specification (example: requestActionTemplate)
// Check if exist and generate (.*)Error || (.*)Request actions
// In case if new api request created, you can only add (.*)Success action to store
// Appropriate Error and Request actions would be generated and passed to slice automatically
// In case you specify Error || Request action by yourself, it wouldn't be replaced
export function generateRequestAndErrorActions(actions) {

  // all actions from reducer
  const actionTypes = Object.keys(actions);

  // Only actions that have "Success" suffix
  const successActions = actionTypes.filter((action) => /(.*)(Success)/.exec(action));

  const generatedActions = {};

  const generateActionIfNotExist = (action, suffix) => {
    const verifiableAction = action.replace("Success", suffix);

    // Check if action is already exists, otherwise add template for that action
    if (!~actionTypes.findIndex(a => a === verifiableAction)) {
      generatedActions[verifiableAction] = suffix === "Error" ? errorActionTemplate : requestActionTemplate;
    }
  };

  successActions.forEach((action) => {
    generateActionIfNotExist(action, "Error");
    generateActionIfNotExist(action, "Request");
  });

  return {...actions, ...generatedActions}
}
