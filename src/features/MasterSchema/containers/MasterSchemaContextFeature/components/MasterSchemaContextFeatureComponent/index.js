import PropTypes from "prop-types";
import { isEmpty } from "lodash/fp";
import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

import appSlice from "app/slices/appSlice";
import { selectMasterSchemaUsers } from "app/selectors/masterSchemaSelectors";

import ContextFeatureTemplate from "components/ContextFeatureTemplate";

import MasterSchemaManager from "./components/MasterSchemaManager";
import MasterSchemaUserList from "./components/MasterSchemaUserList";

const { getUsersByMasterSchemaFieldRequest } = appSlice.actions;

const MasterSchemaContextFeatureComponent = ({ state }) => {
  const dispatch = useDispatch();
  const masterSchemaUsers = useSelector(selectMasterSchemaUsers);

  const { selected, hierarchy } = state;
  const selectedUsers = useMemo(() => {
    return selected.nodes.length === 1 && selected.field && masterSchemaUsers[selected.field.id];
  }, [masterSchemaUsers, selected]);

  const renderTitle = () => {
    if (selected.nodes.length === 1) {
      const path = [...selected.node.path];
      const firstName = path.shift();
      const restNames = isEmpty(path) ? null : `.${path.join(".")}`;

      return (
        <>
          {firstName}
          { restNames && <span className="font-weight-normal">{restNames}</span> }
        </>
      );
    }

    if (selected.fields.length > 1) {
      return `${selected.fields.length} Datapoints Selected`;
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
      {selectedUsers && !isEmpty(selectedUsers) && <MasterSchemaUserList users={selectedUsers} hierarchy={hierarchy} />}
      <MasterSchemaManager state={state} />
    </ContextFeatureTemplate>
  );
};

MasterSchemaContextFeatureComponent.propTypes = {
  state: PropTypes.object.isRequired,
};

export default MasterSchemaContextFeatureComponent;
