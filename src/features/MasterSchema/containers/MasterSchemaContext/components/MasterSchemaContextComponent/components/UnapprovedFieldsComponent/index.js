import "./styles.scss";

import moment from "moment";
import { get, pipe } from "lodash/fp";
import { PropTypes } from "prop-types";
import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Visibility, VisibilityOff } from "@material-ui/icons";
import { CardTitle, CardSubtitle, Col, Label, Row } from "reactstrap";

import Checkbox from "components/Checkbox";
import appSlice from "app/slices/appSlice";
import { selectMovementOptions, selectSelectedId } from "app/selectors/masterSchemaSelectors";

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
  const selected = useMemo(() => selectable.includes(field.key), [field, selectable]);

  const handleFieldClick = () => selectable.select(field.key);
  const handleFieldChange = () => selectable.toggle(field.key);

  return (
    <div className="unapproved_fields-list-items-item" onClick={handleFieldClick}>
      <div className="d-flex">
        <div className="unapproved_fields-list-items-item-state">
          <Checkbox checked={selected} onChange={handleFieldChange} />
        </div>
        <div className="unapproved_fields-list-items-item-description">
          <div className="unapproved_fields-list-items-item-description-name">{field.name}</div>
          <div className="unapproved_fields-list-items-item-description-appearances">
            dForm: {field.dFormNames?.join(", ") || "Not used in dForms"}
          </div>
        </div>
      </div>
      <div className="unapproved_fields-list-items-item_creation_info">
        <p>{`Created by SOME_USER on ${moment(field.createdAt).format("DD.MM.YYYY")}`}</p>
      </div>
    </div>
  );
};

const UnapprovedFieldsComponent = ({ fields }) => {
  const dispatch = useDispatch();
  const selectedId = useSelector(selectSelectedId);
  const movementOptions = useSelector(selectMovementOptions);

  const selectable = useToggleable([]);

  const [visible, toggleVisibility] = useToggle(true);
  const [location, setLocation] = useFormField(null, [Validators.required]);
  const form = useFormGroup({ location });

  const onSubmit = () => {
    const parentId = form.values.location.value.id;
    const fieldsIds = fields.filter(pipe(get("key"), selectable.includes)).map(get("id"));
    const payload = { masterSchemaId: selectedId, parentId, fieldsIds };

    dispatch(approveUnapprovedFieldsRequest(payload));
  };

  // clear select value depends on fields selecting
  useEffect(() => void setLocation(null), [selectable.isEmpty, setLocation]);

  return (
    <>
      <div className="unapproved_fields">
        <div className="unapproved_fields-list">
          <div className="unapproved_fields-list-header">
            <div className="unapproved_fields-list-header-title">
              <h4>
                New unapproved elements
                {visible ? (
                  <Visibility onClick={toggleVisibility} style={iconStyles} />
                ) : (
                  <VisibilityOff onClick={toggleVisibility} style={iconStyles} />
                )}
              </h4>
            </div>
            <div className="unapproved_fields-list-header-selected_items">
              <div className="unapproved_fields-list-header-selected_items-count">
                {!!selectable.keys.length && <p>{selectable.keys.length} elements selected</p>}
              </div>
              <div className="unapproved_fields-list-header-selected_items-unselect_icon" />
            </div>
          </div>
          {visible && (
            <div className="unapproved_fields-list-items">
              {fields.map((field) => (
                <UnapprovedFieldItem field={field} selectable={selectable} key={field.key} />
              ))}
            </div>
          )}
        </div>
      </div>

      {!selectable.isEmpty && (
        <MSESelectField
          name="elementLocation"
          placeholder="Choose location"
          options={movementOptions}
          onChange={setLocation}
          label={(id) => (
            <Label for={id} className="approve__label">
              <CardTitle className="approve__title font-weight-bold">Approve selected fields</CardTitle>
              <CardSubtitle className="approve__subtitle mt-1">
                Which branch should the selected 2 elements be approved into?
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
    </>
  );
};

UnapprovedFieldsComponent.propTypes = {
  fields: PropTypes.array.isRequired,
};

export default UnapprovedFieldsComponent;
