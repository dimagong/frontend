import React, { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

import appSlice from "app/slices/appSlice";
import { selectSelectedNodes, selectSelectedOrganization } from "app/selectors/masterSchemaSelectors";

import MSENodeRenamingForm from "./components/mse-node-renaming-form";
import MSENodeRelocationForm from "./components/mse-node-relocation-form";

const { updateFieldMasterSchemaRequest, updateGroupMasterSchemaRequest } = appSlice.actions;

const MasterSchemaManager = () => {
  const dispatch = useDispatch(selectSelectedNodes);
  const selectedNodes = useSelector(selectSelectedNodes);
  const selectedOrganization = useSelector(selectSelectedOrganization);
  const selectedNode = useMemo(() => selectedNodes[0], [selectedNodes]);

  const onRenameSubmit = (submitted) => {
    if (submitted.invalid) return;

    const { name } = submitted.values;
    const { id, parentKey, containable } = selectedNode;
    const payload = { name, id, parentKey, organization: selectedOrganization };
    const action = containable ? updateGroupMasterSchemaRequest : updateFieldMasterSchemaRequest;

    dispatch(action(payload));
  };

  const onRelocateSubmit = (submitted) => {};

  return selectedNodes.length === 1 ? (
    <>
      <MSENodeRenamingForm className="my-2" name={selectedNode.name} submitting={false} onSubmit={onRenameSubmit} />
      {/* ToDo: don't show for root */}
      <MSENodeRelocationForm className="my-2" node={selectedNode} submitting={false} onSubmit={onRelocateSubmit} />
    </>
  ) : null;
};

export default MasterSchemaManager;
