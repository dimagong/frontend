import React from "react";
import { Row } from "reactstrap";
import { useSelector } from "react-redux";

import { selectSelectedMasterSchema } from "app/selectors/masterSchemaSelectors";

import { useMasterSchemaSelectable } from "./hooks/useMasterSchemaSelectable";

import MasterSchemaContext from "./containers/MasterSchemaContext";
import MasterSchemaContextFeature from "./containers/MasterSchemaContextFeature";

const MasterSchema = () => {
  const masterSchema = useSelector(selectSelectedMasterSchema);

  const [selectedNodes, { select, clear }] = useMasterSchemaSelectable(
    useMasterSchemaSelectable.Stratagy.SingleGroupAndMultipleFields
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(() => void clear(), [masterSchema?.id]);

  if (!masterSchema) {
    return null;
  }

  return (
    <React.Profiler
      id="general-master-schema"
      onRender={(id, phase) => console.log(id, phase, { masterSchema, selectedNodes })}
    >
      <Row key={masterSchema.id}>
        <MasterSchemaContext
          masterSchemaId={masterSchema.id}
          masterSchemaName={masterSchema.name}
          selectedNodes={selectedNodes}
          onSelect={select}
        />
        <MasterSchemaContextFeature masterSchemaId={masterSchema.id} selectedNodes={selectedNodes} />
      </Row>
    </React.Profiler>
  );
};

export default MasterSchema;
