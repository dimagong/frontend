import _ from 'lodash';
// Expect array with at least one action type (e.g. [getUsersRequest.type])
export const createLoadingSelector = (actions) => (state) => {

  const actionNames = actions.map(ac => ac.replace(/Request|Success|Error/gi, ""));

  // returns true only when all actions is not loading
  // returns true in case if value is undefined. That could happen only in case if request wasn't
  // even sent, so to prevent some data blocks from rendering before request was successfully fetched it
  // states to be in loading state

  return _(actionNames).some((action) => _.get(state, `loading.${action}`, true));
};
