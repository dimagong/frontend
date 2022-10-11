import React from "react";
import { Form } from "antd";

import { FIELD_STYLES_CLASSES, MULTI_SELECT_UI_STYLES } from "features/Applications/constants";
import { NmpButton, NmpSelect } from "features/nmp-ui";

import { FieldTypes } from "components/DForm";
import { DFormSelectWidget } from "components/DForm/Components/Fields/Components/DFormWidgets/Components/DFormSelectWidget";

const defaultUIStyle = { label: "default", value: null };

const uIStylesOptions = [defaultUIStyle, ...MULTI_SELECT_UI_STYLES.map((value) => ({ label: value, value }))];

const FieldStyles = ({
  element,
  onElementChange,
  onDeleteButtonClick,
  onElementChangesSave,
  onElementChangesCancel,
}) => {
  const handleElementChange = (property, value) => {
    onElementChange({ ...element, [property]: value });
  };

  const handleUIStyleChange = ({ value }) => handleElementChange("uiStyle", value);

  const renderSpecificStyles = () => {
    switch (element.type) {
      case FieldTypes.MultiSelect: {
        return (
          <DFormSelectWidget
            id="ui-style"
            label="UI style"
            value={element.uiStyle ? { label: element.uiStyle, value: element.uiStyle } : defaultUIStyle}
            options={uIStylesOptions}
            isError={false}
            isRequired={false}
            isDisabled={false}
            isLabelShowing={false}
            onChange={handleUIStyleChange}
          />
        );
      }
      default:
        return null;
    }
  };

  return (
    <Form layout={"vertical"}>
      <div className="mb-2">
        <Form.Item name="classes" className="dform-field mb-2">
          <NmpSelect
            id={"classes"}
            value={{ label: element.classes, value: element.classes }}
            options={FIELD_STYLES_CLASSES.map((className) => ({ label: className, value: className }))}
            onChange={({ value }) => handleElementChange("classes", value)}
            placeholder={"Select an option"}
          />
        </Form.Item>
      </div>
      {renderSpecificStyles()}

      <div className="application_delimiter" />

      <div className="d-flex justify-content-between">
        <Form.Item>
          <NmpButton type="default" shape="round" size="large" onClick={onElementChangesCancel}>
            Cancel
          </NmpButton>
        </Form.Item>

        <div className="d-flex">
          <Form.Item>
            <NmpButton className="mr-1" type="primary" danger shape="round" size="large" onClick={onDeleteButtonClick}>
              Delete
            </NmpButton>
          </Form.Item>
          <Form.Item>
            <NmpButton
              className="button-success"
              type="primary"
              size="large"
              shape="round"
              onClick={onElementChangesSave}
            >
              Save
            </NmpButton>
          </Form.Item>
        </div>
      </div>
    </Form>
  );
};

export default FieldStyles;
