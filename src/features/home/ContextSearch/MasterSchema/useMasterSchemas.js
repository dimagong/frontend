import React from "react";
import { useDispatch, useSelector } from "react-redux";

import appSlice from "app/slices/appSlice";
import { selectSelectedMasterSchemaId } from "app/selectors/masterSchemaSelectors";

const { setSelectedMasterSchema, setContext, hideContextSearch } = appSlice.actions;

export const useMasterSchemas = () => {
  const dispatch = useDispatch();
  const selectedId = useSelector(selectSelectedMasterSchemaId);

  const select = React.useCallback(
    (masterSchema) => {
      dispatch(setContext("MasterSchema"));
      dispatch(hideContextSearch());
      dispatch(setSelectedMasterSchema({ masterSchema }));
    },
    [dispatch]
  );

  const reset = React.useCallback(() => dispatch(setSelectedMasterSchema({ masterSchema: null })), [dispatch]);

  return [selectedId, { select, reset }];
};
