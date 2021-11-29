import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { createLoadingSelector } from "app/selectors/loadingSelector";
import { selectMasterSchemaList } from "app/selectors/masterSchemaSelectors";

import MasterSchemaContextSearchComponent from "./components/MasterSchemaComponent";

import appSlice from "app/slices/appSlice";

const { setContext, setSelectedMasterSchema, getMasterSchemaListRequest } = appSlice.actions;

const MasterSchemaContextSearch = () => {
  const dispatch = useDispatch();

  const masterSchemas = useSelector(selectMasterSchemaList);
  const isMasterSchemasLoading = useSelector(createLoadingSelector([getMasterSchemaListRequest.type]));

  const handleMasterSchemaSelect = (masterSchema) => {
    dispatch(setSelectedMasterSchema({ id: masterSchema.id }));
    dispatch(setContext("MasterSchema"));
  };

  useEffect(() => {
    dispatch(getMasterSchemaListRequest());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <MasterSchemaContextSearchComponent
      masterSchemas={masterSchemas}
      loading={isMasterSchemasLoading}
      onMasterSchemaSelect={handleMasterSchemaSelect}
    />
  );
};

export default MasterSchemaContextSearch;
