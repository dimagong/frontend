import React from "react";
import PropTypes from "prop-types";
import { isEmpty } from "lodash/fp";
import { useDispatch, useSelector } from "react-redux";

import appSlice from "app/slices/appSlice";
import { createLoadingSelector } from "app/selectors/loadingSelector";
import { selectMovementOptions, selectSelectedId } from "app/selectors/masterSchemaSelectors";

import { useDidUpdate } from "hooks/use-did-update";

import ContextTemplate from "components/ContextTemplate";
import MasterSchemaHierarchy from "components/MasterSchemaHierarchy";

import UnapprovedFieldsComponent from "components/UnapprovedFieldsComponent";

const { getMasterSchemaHierarchyRequest, setUnapprovedMasterSchemaRequest, approveUnapprovedFieldsRequest } =
  appSlice.actions;

const MasterSchemaContext = ({ hierarchy, selectedIds, unapproved, onSelect }) => {
  const dispatch = useDispatch();
  const selectedId = useSelector(selectSelectedId);
  const movementOptions = useSelector(selectMovementOptions);
  const isApprovingLoading = useSelector(createLoadingSelector([approveUnapprovedFieldsRequest.type], false));

  const onApproveSubmit = ({ parentId, fieldsIds }) => {
    dispatch(
      approveUnapprovedFieldsRequest({
        parentId,
        fieldsIds,
        masterSchemaId: selectedId,
      })
    );
  };

  useDidUpdate(() => {
    if (!isApprovingLoading) {
      dispatch(setUnapprovedMasterSchemaRequest({ id: hierarchy.masterSchemaId }));
      dispatch(getMasterSchemaHierarchyRequest({ id: hierarchy.masterSchemaId }));
    }
  }, [isApprovingLoading]);

  return (
    <ContextTemplate contextTitle="Master Schema" contextName="Organization view">
      {!isEmpty(unapproved) && (
        <UnapprovedFieldsComponent
          fields={unapproved}
          movementOptions={movementOptions}
          onApproveSubmit={onApproveSubmit}
        />
      )}
      <MasterSchemaHierarchy hierarchy={hierarchy} selectedIds={selectedIds} onSelect={onSelect} />
    </ContextTemplate>
  );
};

MasterSchemaContext.defaultProps = {
  unapproved: [],
};

MasterSchemaContext.propTypes = {
  hierarchy: PropTypes.object,
  unapproved: PropTypes.array,

  onSelect: PropTypes.func,
  selectedIds: PropTypes.arrayOf(PropTypes.string),
};

export default MasterSchemaContext;
