import "./styles.scss";

import { isEmpty } from "lodash/fp";
import React, { useMemo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { useBoolean } from "hooks/use-boolean";
import ContextFeatureTemplate from "components/ContextFeatureTemplate";

import appSlice from "app/slices/appSlice";
import { selectMasterSchemaUsers } from "app/selectors/masterSchemaSelectors";

import { useMasterSchemaContext } from "features/MasterSchema/use-master-schema-context";

import MasterSchemaManager from "./components/MasterSchemaManager";
import MasterSchemaUserList from "./components/MasterSchemaUserList";

const { getUsersByMasterSchemaFieldRequest } = appSlice.actions;

const MasterSchemaContextFeatureComponent = () => {
  const dispatch = useDispatch();
  const { selectable, hierarchy } = useMasterSchemaContext();
  const masterSchemaUsers = useSelector(selectMasterSchemaUsers);
  const [isUsersFiltered, setIsUsersFiltered] = useBoolean(false);

  const selectedUsers = useMemo(() => {
    return (
      selectable.selected.nodes.length === 1 &&
      selectable.selected.field &&
      masterSchemaUsers[selectable.selected.field.id]
    );
  }, [masterSchemaUsers, selectable.selected]);

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
          {selectable.selected.fields.map((field) => (
            <p className="mb-0 mt-1 font-size-base font-weight-normal" key={field.id}>
              {field.path.join(".")}
            </p>
          ))}
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
    if (selectable.selected.field && !masterSchemaUsers[selectable.selected.field.id]) {
      const payload = { fieldId: selectable.selected.field.id };
      dispatch(getUsersByMasterSchemaFieldRequest(payload));
    }
  }, [dispatch, masterSchemaUsers, selectable.selected.field]);

  const renderUsers = () => {
    if (!selectedUsers) return null;

    // if (isUsersLoading) return (
    //   <Col className="d-flex justify-content-center pt-4">
    //     <Spinner />
    //   </Col>
    // );

    if (isUsersFiltered || !isEmpty(selectedUsers)) {
      return <MasterSchemaUserList
        users={selectedUsers}
        hierarchy={hierarchy}
        selected={selectable.selected}
        setUsersFiltered={setIsUsersFiltered}
      />
    }

    return null;
  };

  return (
    <ContextFeatureTemplate contextFeatureTitle={renderTitle()}>
      {renderUsers()}
      <MasterSchemaManager />
    </ContextFeatureTemplate>
  );
};

export default MasterSchemaContextFeatureComponent;
