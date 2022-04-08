import React from "react";

import { useStoreQuery } from "hooks/useStoreQuery";

import appSlice from "app/slices/appSlice";
import { selectMasterSchemas } from "app/selectors/masterSchemaSelectors";

import { useMasterSchemas } from "./useMasterSchemas";
import MasterSchemaContextSearchComponent from "./components/MasterSchemaComponent";

const { getMasterSchemasRequest } = appSlice.actions;

const MasterSchemaContextSearch = () => {
  const masterSchemas = useStoreQuery(getMasterSchemasRequest, selectMasterSchemas);
  const [selectedId, { select, reset }] = useMasterSchemas();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(() => () => reset(), []);

  return (
    <React.Profiler
      id="master-schema-context-search"
      onRender={(id, phase) => console.log(id, phase, { masterSchemas, selectedId })}
    >
      <MasterSchemaContextSearchComponent
        masterSchemas={masterSchemas.data}
        isLoading={masterSchemas.isLoading}
        selectedId={selectedId}
        onSelect={select}
      />
    </React.Profiler>
  );
};

export default MasterSchemaContextSearch;
