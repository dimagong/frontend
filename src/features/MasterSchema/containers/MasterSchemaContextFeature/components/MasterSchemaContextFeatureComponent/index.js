import "./styles.scss";

import { isEmpty, get, pipe, join } from "lodash/fp";
import PropTypes from "prop-types";
import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

import appSlice from "app/slices/appSlice";
import { selectMasterSchemaUsers } from "app/selectors/masterSchemaSelectors";

import ContextFeatureTemplate from "components/ContextFeatureTemplate";

import { useMasterSchemaContext } from "features/MasterSchema/use-master-schema-context";

import MasterSchemaManager from "./components/MasterSchemaManager";
import MasterSchemaUserList from "./components/MasterSchemaUserList";

const { getUsersByMasterSchemaFieldRequest } = appSlice.actions;

const MasterSchemaContextFeatureComponent = ({ state }) => {
  const { selectable } = useMasterSchemaContext();
  const dispatch = useDispatch();
  const masterSchemaUsers = useSelector(selectMasterSchemaUsers);

  const { selected, hierarchy } = state;
  const selectedUsers = useMemo(() => {
    return selected.nodes.length === 1 && selected.field && masterSchemaUsers[selected.field.id];
  }, [masterSchemaUsers, selected]);

  const renderTitle = () => {
    if (selectable.selected.nodes.length === 1) {
      const path = [...selectable.selected.node.path];
      const firstName = path.shift();
      const restNames = isEmpty(path) ? null : `.${path.join(".")}`;

      return (
        <>
          {firstName}
          {restNames && <span className="font-weight-normal">{restNames}</span>}
        </>
      );
    }

    if (selectable.selected.fields.length > 1) {
      return (
        <>
          {`${selectable.selected.fields.length} Datapoints Selected`}
          <p className="mb-0 mt-1 font-size-base font-weight-normal">
            {selectable.selected.fields.map(pipe(get("path"), join("."))).join(", ")}
          </p>
          {selectable.selected.areSelectedFieldsContainCommonAndMemberFirmFields && (
            <p className="mb-0 mt-1 font-size-base font-weight-normal text-danger">
              There are selected fields not from member firm.
            </p>
          )}
        </>
      );
    }
  };

  useEffect(() => {
    if (selected.field && !masterSchemaUsers[selected.field.id]) {
      const payload = { fieldId: selected.field.id };
      dispatch(getUsersByMasterSchemaFieldRequest(payload));
    }
  }, [dispatch, masterSchemaUsers, selected.field]);

  return (
    <ContextFeatureTemplate contextFeatureTitle={renderTitle()}>
      {selectedUsers && !isEmpty(selectedUsers) && <MasterSchemaUserList users={selectedUsers} hierarchy={hierarchy} selected={selected} />}
      <MasterSchemaManager state={state} />
    </ContextFeatureTemplate>
  );
};

export default MasterSchemaContextFeatureComponent;
