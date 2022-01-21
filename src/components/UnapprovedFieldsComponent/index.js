import "./styles.scss";

import _ from "lodash/fp";
import moment from "moment";
import { PropTypes } from "prop-types";
import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Visibility, VisibilityOff, Close } from "@material-ui/icons";
import { CardTitle, CardSubtitle, Col, Label, Row } from "reactstrap";

import Checkbox from "components/Checkbox";
import appSlice from "app/slices/appSlice";
import { selectSelectedId } from "app/selectors/masterSchemaSelectors";

import { stopPropagation } from "utility/event-decorators";

import { useToggle } from "hooks/use-toggle";
import { useToggleable } from "hooks/use-toggleable";
import { useFormField, useFormGroup, Validators } from "hooks/use-form";

import MSEButton from "features/MasterSchema/share/mse-button";
import MSESelectField from "features/MasterSchema/share/mse-select-field";
import MSEEditorForm from "features/MasterSchema/share/mse-editor-form";

const { approveUnapprovedFieldsRequest } = appSlice.actions;

const iconStyles = {
  color: "#95989A",
  fontSize: "22px",
  marginLeft: "12px",
  cursor: "pointer",
};

const UnapprovedFieldItem = ({ selectable, field }) => {
  const selected = useMemo(() => selectable.includes(field.id), [field, selectable]);

  const handleFieldClick = () => selectable.toggle(field.id);
  const handleFieldChange = stopPropagation(() => selectable.toggle(field.id));

  return (
    <div className="unapproved_fields-list-items-item" onClick={handleFieldClick}>
      <div className="d-flex">
        <div className="unapproved_fields-list-items-item-state">
          <Checkbox checked={selected} onChange={handleFieldChange} />
        </div>
        <div className="unapproved_fields-list-items-item-description">
          <div className="unapproved_fields-list-items-item-description-name">
            {`${field.parentGroupName}/${field.name}`}
          </div>
          <div className="unapproved_fields-list-items-item-description-appearances">
            Applications: {field.applicationNames?.join(", ") || "Not used in Applications"}
          </div>
        </div>
      </div>
      <div className="unapproved_fields-list-items-item_creation_info">
        <p>
          {field.providedByFullName
            ? `Created by ${field.providedByFullName} on ${moment(field.createdAt).format("DD.MM.YYYY")}`
            : `Created on ${moment(field.createdAt).format("DD.MM.YYYY")}`}
        </p>
      </div>
    </div>
  );
};

const customSelectStyles = {
  control: (provided) => ({
    ...provided,
    borderRadius: 0,
    borderTop: "none",
    borderLeft: "none",
    borderRight: "none",
    boxShadow: "none",
  }),
};

const UnapprovedFieldsComponent = ({ fields, movementOptions, onApprove }) => {
  const dispatch = useDispatch();
  const selectedId = useSelector(selectSelectedId);

  const selectable = useToggleable();

  const [visible, toggleVisibility] = useToggle(true);
  const [location, setLocation] = useFormField(null, [Validators.required]);
  const form = useFormGroup({ location });

  const onSubmit = () => {
    const parentId = form.values.location.value.id;
    const fieldsIds = selectable.keys;
    const payload = { masterSchemaId: selectedId, parentId, fieldsIds };

    onApprove(payload);
    dispatch(approveUnapprovedFieldsRequest(payload));
  };

  const handleUnselectAll = () => selectable.clear();

  // clear select value depends on fields selecting
  useEffect(() => void setLocation(null), [selectable.isEmpty, setLocation]);

  return (
    <>
      <div className="unapproved_fields">
        <div className="unapproved_fields-list">
          <div className="unapproved_fields-list-header">
            <div className="unapproved_fields-list-header-title mb-1">
              New unapproved elements
              {visible ? (
                <Visibility onClick={toggleVisibility} style={iconStyles} />
              ) : (
                <VisibilityOff onClick={toggleVisibility} style={iconStyles} />
              )}
            </div>
            <div className="unapproved_fields-list-header-selected_items">
              {!!selectable.keys.length && (
                <>
                  <div className="unapproved_fields-list-header-selected_items-count">
                    <p>
                      {selectable.keys.length} element{selectable.keys.length === 1 ? "" : "s"} selected
                    </p>
                  </div>
                  <div className="unapproved_fields-list-header-selected_items-unselect_icon">
                    <Close style={{ fontSize: "16px", color: "black" }} onClick={handleUnselectAll} />
                  </div>
                </>
              )}
            </div>
          </div>
          {visible && (
            <div className="unapproved_fields-list-items">
              {fields.map((field) => (
                <UnapprovedFieldItem field={field} selectable={selectable} key={field.id} />
              ))}
            </div>
          )}
        </div>
        {!selectable.isEmpty && (
          <MSESelectField
            name="elementLocation"
            placeholder="Choose location"
            options={movementOptions}
            onChange={setLocation}
            styles={customSelectStyles}
            components={{ IndicatorSeparator: null }}
            label={(id) => (
              <Label for={id} className="approve__label">
                <CardTitle className="approve__title font-weight-bold">Approve selected fields</CardTitle>
                <CardSubtitle className="approve__subtitle mt-1">
                  Which branch should the selected {selectable.keys.length} element
                  {selectable.keys.length === 1 ? "" : "s"} be approved into?
                </CardSubtitle>
              </Label>
            )}
          >
            {({ select, error, label }) => (
              <MSEEditorForm
                onSubmit={onSubmit}
                header={label}
                body={
                  <Row>
                    <Col xs={12}>
                      {select}
                      {error}
                    </Col>
                    <Col xs={12} className="d-flex mt-3">
                      <MSEButton className="ml-auto" color="primary" type="submit" disabled={form.invalid}>
                        Approve and move
                      </MSEButton>
                    </Col>
                  </Row>
                }
              />
            )}
          </MSESelectField>
        )}
      </div>
    </>
  );
};

UnapprovedFieldsComponent.defaultProps = {
  onApprove: _.noop,
};

UnapprovedFieldsComponent.propTypes = {
  fields: PropTypes.array.isRequired,
  movementOptions: PropTypes.array.isRequired,
  onApprove: PropTypes.func,
};

export default UnapprovedFieldsComponent;
