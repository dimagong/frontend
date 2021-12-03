import React from "react";
import { get } from "lodash/fp";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";

import appSlice from "app/slices/appSlice";
import { selectMovementOptions, selectSelectedId } from "app/selectors/masterSchemaSelectors";

import MSENodeRenamingForm from "./components/mse-node-renaming-form";
import MSENodeRelocationForm from "./components/mse-node-relocation-form";

const {
  updateFieldMasterSchemaRequest,
  updateGroupMasterSchemaRequest,
  fieldsMakeParentMasterSchemaRequest,
  fieldMakeParentMasterSchemaRequest,
  groupMakeParentMasterSchemaRequest,
} = appSlice.actions;

const MasterSchemaManager = ({ state }) => {
  const { selected } = state;

  const dispatch = useDispatch();
  const selectedId = useSelector(selectSelectedId);
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

  const onMultipleRelocateSubmit = (submitted) => {
    if (submitted.invalid) return;

    const fieldsIds = selected.fields.map(get("id"));
    const parentId = submitted.values.location.value.id;
    const payload = { masterSchemaId: selectedId, parentId, fieldsIds };

    dispatch(fieldsMakeParentMasterSchemaRequest(payload));
  };

  const render = () => {
    if (selected.fields.length > 1) {
      return (
        <div key={selected.node.name}>
          <div className="context-feature-template_header_title">Manage datapoints</div>
          <MSENodeRelocationForm
            className="my-2"
            label="Move datapoints to:"
            action="Move"
            multiple
            options={movementOptions}
            submitting={false}
            onSubmit={onMultipleRelocateSubmit}
          />
        </div>
      );
    }

    if (selected.fields.length === 1 && selected.field) {
      return (
        <div key={selected.node.name}>
          <div className="context-feature-template_header_title">Manage Datapoint</div>
          <MSENodeRenamingForm
            className="my-2"
            label="Rename datapoint to:"
            action="Rename"
            name={selected.field.name}
            submitting={false}
            onSubmit={onRenameSubmit}
          />
          <MSENodeRelocationForm
            className="my-2"
            label="Move datapoint to:"
            action="Move"
            node={selected.field}
            options={movementOptions}
            submitting={false}
            onSubmit={onRelocateSubmit}
          />
        </div>
      );
    }

    if (selected.groups.length === 1 && selected.group) {
      return (
        <div key={selected.node.name}>
          <div className="context-feature-template_header_title">Manage Branch</div>
          <MSENodeRenamingForm
            className="my-2"
            label="Rename branch to:"
            action="Rename"
            name={selected.group.name}
            submitting={false}
            onSubmit={onRenameSubmit}
          />
          <MSENodeRelocationForm
            className="my-2"
            label="Migrate branch contents to:"
            action="Migrate"
            node={selected.group}
            options={movementOptions}
            submitting={false}
            onSubmit={onRelocateSubmit}
          />
        </div>
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
