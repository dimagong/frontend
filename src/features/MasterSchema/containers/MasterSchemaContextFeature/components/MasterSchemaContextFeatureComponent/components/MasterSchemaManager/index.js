import { get } from "lodash/fp";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import appSlice from "app/slices/appSlice";
import {
  selectMovementOptions,
  selectRelatedApplications,
  selectSelectedId,
} from "app/selectors/masterSchemaSelectors";

import { useMasterSchemaContext } from "features/MasterSchema/use-master-schema-context";

import MSENodeRenamingForm from "./components/mse-node-renaming-form";
import MSENodeRelocationForm from "./components/mse-node-relocation-form";
import MSENodeRelatedTable from "./components/mse-node-related-table";

const {
  updateFieldMasterSchemaRequest,
  updateGroupMasterSchemaRequest,
  fieldsMakeParentMasterSchemaRequest,
  fieldMakeParentMasterSchemaRequest,
  groupMakeParentMasterSchemaRequest,
  getRelatedApplicationsRequest,
  fieldsMergeMasterSchemaRequest,
} = appSlice.actions;

const MasterSchemaManager = () => {
  const {
    selectable: { selected },
  } = useMasterSchemaContext();

  const dispatch = useDispatch();
  const selectedId = useSelector(selectSelectedId);
  const movementOptions = useSelector(selectMovementOptions);
  const relatedApplications = useSelector(selectRelatedApplications(selected?.node?.id));

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

  const onMergeSubmit = (submitted) => {
    if (submitted.invalid) return;

    const parentId = submitted.values.location.value.id;
    const fieldsIds = selected.fields.map(get("id")).filter(item => item !== parentId);
    const payload = { parentId, fieldsIds };

    dispatch(fieldsMergeMasterSchemaRequest(payload));
  };

  useEffect(() => {
    if (selected?.node?.id) {
      dispatch(getRelatedApplicationsRequest({ fieldId: selected.node.id }));
    }
  }, [selected]);

  const render = () => {
    // reminder - the !selected.areSelectedFieldsContainCommonAndMemberFirmFields work the same for merge feature
    if (selected.fields.length > 1 && !selected.areSelectedFieldsContainCommonAndMemberFirmFields) {
      return (
        <div key={selected.node.name}>
          <div className="context-feature-template_header_title">Manage datapoints</div>
          <MSENodeRelocationForm
            className="my-2"
            label="Merge selection into"
            action="Merge"
            multiple
            options={selected.fields.map(item => {return {label: item.path.join('.'), value: item}})}
            submitting={false}
            onSubmit={onMergeSubmit}
            note={<p className={'mse-note'}><strong>Note: </strong>Source files will be deleted.
              Only field that are <strong>not</strong> referenced in dFrom can be merged.</p>}
          />

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
          {relatedApplications?.length > 0 && (
            <MSENodeRelatedTable className="my-2" relatedApplications={relatedApplications} />
          )}
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

  return selected.node && !selected.thereIsSelectedSystemNode ? render() : null;
};

export default MasterSchemaManager;
