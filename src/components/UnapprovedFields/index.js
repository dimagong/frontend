import "./styles.scss";

import React from "react";
import { PropTypes } from "prop-types";
import { Col, Row } from "reactstrap";
import { useSelector } from "react-redux";

import { useStoreQuery } from "hooks/useStoreQuery";
import { useToggleable } from "hooks/use-toggleable";
import { useStoreMutation } from "hooks/useStoreMutation";

import appSlice from "app/slices/appSlice";
import {
  selectAllMasterSchemaGroupsAsOptions,
  selectMasterSchemaUnapprovedFields,
} from "app/selectors/masterSchemaSelectors";

import ApproveFieldsForm from "./ApproveFieldsForm";
import UnapprovedFieldsList from "./UnapprovedFieldsList";

const { getUnapprovedFieldsMasterSchemaRequest, approveUnapprovedFieldsRequest } = appSlice.actions;

const UnapprovedFields = ({ masterSchemaId }) => {
  const locationOptions = useSelector(
    React.useCallback(selectAllMasterSchemaGroupsAsOptions(masterSchemaId), [masterSchemaId])
  );

  const fields = useStoreQuery(
    () => getUnapprovedFieldsMasterSchemaRequest({ masterSchemaId }),
    React.useCallback(selectMasterSchemaUnapprovedFields(masterSchemaId), [masterSchemaId])
  );

  const approveFields = useStoreMutation(approveUnapprovedFieldsRequest);

  const [selectedIds, selectable] = useToggleable([], { useRefactored: true });

  const approve = React.useCallback(
    ({ parentId }) => {
      selectable.clear();
      approveFields.mutate({ parentId, fieldsIds: selectedIds, masterSchemaId });
    },
    [approveFields, masterSchemaId, selectable, selectedIds]
  );

  return (
    <React.Profiler id="unapproved-fields" onRender={(id, phase) => console.log(id, phase, { selectedIds })}>
      <Row className="unapproved_fields position-relative zindex-2 mb-4">
        <Col>
          <UnapprovedFieldsList
            fields={fields.data}
            isLoading={fields.isLoading}
            selectedIds={selectedIds}
            onSelect={selectable.toggle}
            onUnselect={selectable.clear}
          />

          {!selectable.isEmpty ? (
            <ApproveFieldsForm
              selectedIds={selectedIds}
              locationOptions={locationOptions}
              isSubmitting={approveFields.isLoading}
              onApprove={approve}
            />
          ) : null}
        </Col>
      </Row>
    </React.Profiler>
  );
};

UnapprovedFields.propTypes = {
  masterSchemaId: PropTypes.number.isRequired,
};

export default UnapprovedFields;
