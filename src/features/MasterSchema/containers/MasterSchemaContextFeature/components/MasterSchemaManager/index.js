import "./styles.scss";

import _ from "lodash/fp";
import React from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";

import appSlice from "app/slices/appSlice";
import { selectAllMasterSchemaGroupsAsOptions, selectRelatedApplications } from "app/selectors/masterSchemaSelectors";

import MSENodeRenamingForm from "./components/mse-node-renaming-form";
import MSENodeRelatedTable from "./components/mse-node-related-table";
import MSENodeRelocationForm from "./components/mse-node-relocation-form";

const {
  updateFieldMasterSchemaRequest,
  updateGroupMasterSchemaRequest,
  fieldsMakeParentMasterSchemaRequest,
  fieldMakeParentMasterSchemaRequest,
  groupMakeParentMasterSchemaRequest,
  getRelatedApplicationsRequest,
  fieldsMergeMasterSchemaRequest,
} = appSlice.actions;

const MasterSchemaManager = ({ masterSchemaId, selected }) => {
  const dispatch = useDispatch();
  const locationOptions = useSelector(selectAllMasterSchemaGroupsAsOptions(masterSchemaId));
  const relatedApplications = useSelector(selectRelatedApplications(selected.node?.id));

  const onRenameSubmit = React.useCallback(
    (submitted) => {
      if (submitted.invalid) return;

      const { name } = submitted.values;
      const { id, isContainable } = selected.node;
      const payload = { id, name };
      const action = isContainable ? updateGroupMasterSchemaRequest : updateFieldMasterSchemaRequest;

      dispatch(action(payload));
    },
    [dispatch, selected.node]
  );

  const onRelocateSubmit = React.useCallback(
    (submitted) => {
      if (submitted.invalid) return;

      const { id, isContainable } = selected.node;
      const { value } = submitted.values.location;
      const payload = { nodeId: id, parentId: value.id };
      const action = isContainable ? groupMakeParentMasterSchemaRequest : fieldMakeParentMasterSchemaRequest;

      dispatch(action(payload));
    },
    [dispatch, selected.node]
  );

  const onMultipleRelocateSubmit = React.useCallback(
    (submitted) => {
      if (submitted.invalid) return;

      const fieldsIds = selected.fields.map(_.get("id"));
      const parentId = submitted.values.location.value.id;
      const payload = { masterSchemaId, parentId, fieldsIds };

      dispatch(fieldsMakeParentMasterSchemaRequest(payload));
    },
    [dispatch, masterSchemaId, selected.fields]
  );

  const onMergeSubmit = React.useCallback(
    (submitted) => {
      if (submitted.invalid) return;

      const parentId = submitted.values.location.value.id;
      const fieldsIds = selected.fields.map(_.get("id")).filter((item) => item !== parentId);
      const payload = { parentId, fieldsIds };

      dispatch(fieldsMergeMasterSchemaRequest(payload));
    },
    [dispatch, selected.fields]
  );

  React.useEffect(() => {
    if (selected.field) {
      dispatch(getRelatedApplicationsRequest({ fieldId: selected.field.id }));
    }
  }, [dispatch, selected]);

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
            options={selected.fields.map((item) => {
              return { label: item.path.join("."), value: item };
            })}
            submitting={false}
            onSubmit={onMergeSubmit}
            note={
              <p className={"mse-note"}>
                <strong>Note: </strong>Source files will be deleted. Only field that are <strong>not</strong> referenced
                in dFrom can be merged.
              </p>
            }
          />

          <MSENodeRelocationForm
            className="my-2"
            label="Move datapoints to:"
            action="Move"
            multiple
            options={locationOptions}
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
          {!_.isEmpty(relatedApplications) ? (
            <MSENodeRelatedTable className="my-2" relatedApplications={relatedApplications} />
          ) : null}
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
            options={locationOptions}
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
            options={locationOptions}
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

MasterSchemaManager.propTypes = {
  masterSchemaId: PropTypes.number.isRequired,
  selected: PropTypes.object.isRequired,
};

export default MasterSchemaManager;
