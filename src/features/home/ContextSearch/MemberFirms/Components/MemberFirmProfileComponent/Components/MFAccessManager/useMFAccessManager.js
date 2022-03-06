import React from "react";

import { RoleBdmService } from "api/roleBdm/roleBdmService";

const initialState = { loading: false, error: null, data: null };

export const useMFAccessManager = (memberFirmId) => {
  const [state, dispatch] = React.useReducer((s, p) => ({ ...s, ...p }), initialState);

  const dispatchData = React.useCallback((data) => dispatch({ data, loading: false }), []);

  const dispatchError = React.useCallback((error) => dispatch({ error, loading: false }), []);

  const dispatchPending = React.useCallback(() => dispatch({ loading: true }), []);

  React.useEffect(() => {
    dispatchPending();
    RoleBdmService.getBdmUsersByMemberFirm({ memberFirmId }).then(dispatchData, dispatchError);
    // RoleBdmService.getPotentialsBdmUsersByMemberFirm({ memberFirmId }).then(dispatchData, dispatchError);
  }, [dispatchData, dispatchError, dispatchPending, memberFirmId]);

  return state;
};
