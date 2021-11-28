import React, { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

import appSlice from "app/slices/appSlice";
import { selectSelectedNodes } from "app/selectors/masterSchemaSelectors";

import MSENodeRenamingForm from "./components/mse-node-renaming-form";
import MSENodeRelocationForm from "./components/mse-node-relocation-form";

const { updateFieldMasterSchemaRequest, updateGroupMasterSchemaRequest, fieldMakeParentMasterSchemaRequest, groupMakeParentMasterSchemaRequest } =
  appSlice.actions;

const MasterSchemaManager = () => {
  const dispatch = useDispatch();
  const selectedNodes = useSelector(selectSelectedNodes);
  const selectedNode = useMemo(() => selectedNodes[0], [selectedNodes]);

  const onRenameSubmit = (submitted) => {
    if (submitted.invalid) return;

    const { name } = submitted.values;
    const { id, isContainable } = selectedNode;
    const payload = { id, name };
    const action = isContainable ? updateGroupMasterSchemaRequest : updateFieldMasterSchemaRequest;

    dispatch(action(payload));
  };

  const onRelocateSubmit = (submitted) => {
    if (submitted.invalid) return;

    const { id, isContainable } = selectedNode;
    const { value } = submitted.values.location;
    const payload = { nodeId: id, parentId: value.id };
    const action = isContainable ? groupMakeParentMasterSchemaRequest : fieldMakeParentMasterSchemaRequest;

    dispatch(action(payload));
  };

  return selectedNodes.length === 1 && selectedNode && !selectedNode.isSystem ? (
    <>
      <MSENodeRenamingForm className="my-2" name={selectedNode.name} submitting={false} onSubmit={onRenameSubmit} />
      <MSENodeRelocationForm className="my-2" node={selectedNode} submitting={false} onSubmit={onRelocateSubmit} />
    </>
  ) : null;
};

export default MasterSchemaManager;
