import React from "react";
import { useDispatch, useSelector } from "react-redux";

import appSlice from "app/slices/appSlice";
import { selectSelectedMasterSchemaId } from "app/selectors/masterSchemaSelectors";

const { setSelectedMasterSchemaId, setContext, hideContextSearch } = appSlice.actions;

export const useMasterSchemas = () => {
  const dispatch = useDispatch();
  const selectedIdStore = useSelector(selectSelectedMasterSchemaId);
  const selectedId = React.useMemo(() => selectedIdStore, [selectedIdStore]);

  const select = React.useCallback(
    (masterSchema) => {
      dispatch(setContext("MasterSchema"));
      dispatch(hideContextSearch());
      dispatch(setSelectedMasterSchemaId({ id: masterSchema.id }));
    },
    [dispatch]
  );

  const reset = React.useCallback(() => dispatch(setSelectedMasterSchemaId({ id: null })), [dispatch]);

  return [selectedId, { select, reset }];
};
