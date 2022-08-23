import React from "react";
import classnames from "classnames";
import { Plus } from "react-feather";

import { ELEMENT_TYPES, FIELD_TYPES } from "features/Applications/constants";

import formComponents from "./Components/DFormWidgets";

const FormComponent = (props) => {
  const {
    data,
    values,
    group,
    groupFields,
    isConfigurable,
    selectedElement,
    onElementClick,
    onFieldChange,
    onFieldCreate,
  } = props;

  // Each field store with structure:
  // - id - id of master schema field id
  // - value - value of input
  // - type - specify type of component that will be used
  // - validationSchema - yup validation schema for that exact field
  // - isRequired - used for conditional validation in yup validation schema
  // - dataPushPrepare - function that prepare input value to common format
  //
  // Each of this properties should be passed on field initialization
  // const handleInputChange = (value, id) => {
  //   setFormData({
  //     ...formData,
  //     [id]: {
  //       ...formData[id],
  //       value,
  //       error: "",
  //     }
  //   })
  // };

  return (
    <>
      {groupFields.map((formField) => {
        const field = data.fields[formField];

        if (field.isHidden) return null;

        const isSelected = selectedElement?.elementType === ELEMENT_TYPES.field && selectedElement?.id === field.id;

        const FormFieldElement = formComponents[field.type];

        //TODO handle default empty value for each widget
        let fieldValue = "";

        if (!field.isNotMasterSchemaRelated && values && values[field.masterSchemaPropertyId]) {
          if ([FIELD_TYPES.file, FIELD_TYPES.fileList].includes(field.type)) {
            fieldValue = values[field.masterSchemaPropertyId].files;
          } else {
            fieldValue = values[field.masterSchemaPropertyId].value ?? "";
          }
        }

        if (!FormFieldElement) {
          console.log(field.type, formComponents);
          console.error("There is no element with type " + field.type);

          return null;
        }

        return (
          <div
            className={classnames("editable px-0 custom-form-field", field.classes || "col-12", {
              selected: isSelected,
            })}
            onClick={() => onElementClick({ ...field, groupId: group }, "field")}
            key={formField}
          >
            <FormFieldElement
              {...field}
              error={""}
              name={field.title}
              value={fieldValue}
              fieldId={field.id}
              disabled={field.disabled}
              fieldClasses={field.classes}
              isRequired={field.isRequired}
              label={field.isLabelShowing ? field.title : ""}
              onChange={(value) => onFieldChange(field, value)}
              key={field.id}
            />
          </div>
        );
      })}

      {!groupFields ||
        (!groupFields.length && <div className="px-2 py-5 text-center w-100">There are no fields in this group</div>)}

      {isConfigurable ? (
        <div className="custom-form-field col-12 px-0">
          <div className="element-add" onClick={() => onFieldCreate(group)}>
            <div className="element-add_icon">
              <Plus color="white" size={23} />
            </div>
            <div className="element-add_description">Add new form element</div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default FormComponent;
