import React from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";

import appSlice from "app/slices/appSlice";
import { selectMovementOptions } from "app/selectors/masterSchemaSelectors";

import MSENodeRenamingForm from "./components/mse-node-renaming-form";
import MSENodeRelocationForm from "./components/mse-node-relocation-form";

const {
  updateFieldMasterSchemaRequest,
  updateGroupMasterSchemaRequest,
  fieldMakeParentMasterSchemaRequest,
  groupMakeParentMasterSchemaRequest,
} = appSlice.actions;

const MasterSchemaManager = ({ state }) => {
  const { selected } = state;
  const dispatch = useDispatch();
  const movementOptions = useSelector(selectMovementOptions);

  const onRenameSubmit = (submitted) => {
    if (submitted.invalid) return;

    const { name } = submitted.values;
    const { id, isContainable } = selected.node;
    const payload = { id, name };
    const action = isContainable ? updateGroupMasterSchemaRequest : updateFieldMasterSchemaRequest;

    dispatch(action(payload));
  };

  const onRelocateSubmit = (submitted) => {
    if (submitted.invalid) return;

    const { id, isContainable } = selected.node;
    const { value } = submitted.values.location;
    const payload = { nodeId: id, parentId: value.id };
    const action = isContainable ? groupMakeParentMasterSchemaRequest : fieldMakeParentMasterSchemaRequest;

    dispatch(action(payload));
  };

  const render = () => {
    // ToDo: handle multiple fields managing
    // if (selected.fields > 1) {
    //   return (
    //     <>
    //       <div>Manage datapoints</div>
    //       <MSENodeRelocationForm
    //         className="my-2"
    //         node={selected.node}
    //         options={movementOptions}
    //         submitting={false}
    //         onSubmit={onRelocateSubmit}
    //       />
    //     </>
    //   );
    // }

    if (selected.node && selected.node.isSystem) return null;

    if (selected.field) {
      return (
        <>
          <div className="context-feature-template_header_title">Manage Datapoint</div>
          <MSENodeRenamingForm
            className="my-2"
            name={selected.field.name}
            submitting={false}
            onSubmit={onRenameSubmit}
          />
          <MSENodeRelocationForm
            className="my-2"
            node={selected.field}
            options={movementOptions}
            submitting={false}
            onSubmit={onRelocateSubmit}
          />
        </>
      );
    }

    if (selected.group) {
      return (
        <>
          <div className="context-feature-template_header_title">Manage Branch</div>
          <MSENodeRenamingForm
            className="my-2"
            name={selected.group.name}
            submitting={false}
            onSubmit={onRenameSubmit}
          />
          <MSENodeRelocationForm
            className="my-2"
            node={selected.group}
            options={movementOptions}
            submitting={false}
            onSubmit={onRelocateSubmit}
          />
        </>
      );
    }

    return null;
  };

  return render();
};

MasterSchemaManager.propTypes = {
  state: PropTypes.object.isRequired,
};

export default MasterSchemaManager;
