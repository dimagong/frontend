import _ from "lodash";
// Expect array with at least one action type (e.g. [getUsersRequest.type])
// Pass true as a second argument in case if you strictly need "loading" false
// which states that request was called and finished
export const createLoadingSelector =
  (actions, isRequired = false) =>
  (state) => {
    const actionNames = actions.map((ac) => ac.replace(/Request|Success|Error/gi, ""));

    // returns true only when all actions are not loading
    // returns true in case if value is undefined. That could happen only in case if request wasn't
    // even sent, so to prevent some data blocks from rendering before request was successfully fetched it
    // states to be in loading state

    return _(actionNames).some((action) => _.get(state, `loading.${action}`, !isRequired));
  };
