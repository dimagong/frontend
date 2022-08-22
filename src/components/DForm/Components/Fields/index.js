import { Plus } from "react-feather";
import React, { useState, useEffect } from "react";

// import './styles.scss';
import { toast } from "react-toastify";

import formComponents from "./Components/DFormWidgets";
import { DFormWidgetEventsTypes } from "./Components/DFormWidgets/events";
import { FIELD_TYPES } from "../../../../features/Applications/constants";

const FormComponent = ({ groupFields, data, onElementClick, group, values, onFieldEvent, isConfigurable }) => {
  const [formData, setFormData] = useState({});

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

  // const handleError = (id, error) => {
  //   setFormData({
  //     ...formData,
  //     [id]: {
  //       ...formData[id],
  //       error,
  //     }
  //   })
  // };
  //
  // const isFormValid = async (fields) => {
  //   let isFormValid = true;
  //
  //   await Promise.all(fields.map( async (field) => {
  //     await validationSchemas[field.type]
  //       .validate(field.value, {context: {isRequired: field.isRequired}})
  //       .catch((err) => {
  //         handleError(field.id, err.message)
  //       });
  //
  //     const isValid = await validationSchemas[field.type].isValid(field.value, {context: {isRequired: field.isRequired}});
  //
  //     if (!isValid) isFormValid = false;
  //   }));
  //
  //   return isFormValid;
  // };

  // const initForm = () => {
  //   const initialData = {};
  //
  //   [...groupFields].map((formField) => {
  //
  //     // Handle different default values for different field types here
  //     const defaultValue = "";
  //
  //     initialData[formField.master_schema_field_id] = {
  //       id: formField.master_schema_field_id,
  //       type: formField.type,
  //       value: formField.master_schema_field?.master_schema_field_value?.value || defaultValue,
  //       isRequired: formField.is_required,
  //     };
  //
  //     return false;
  //   });
  //
  //   setFormData(initialData);
  // };

  // Init form
  // useEffect(() => {
  //   if(groupFields.length) {
  //     initForm()
  //   }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [groupFields]);

  return (
    <>
      {groupFields.map((formField) => {
        const field = data.fields[formField];

        if (field.isHidden) return null;

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
            className={`editable px-0 custom-form-field ${field.classes ? field.classes : "col-12"}`}
            onClick={() => onElementClick({ ...field, groupId: group }, "field")}
            key={formField}
          >
            <FormFieldElement
              {...field}
              fieldId={field.id}
              isRequired={field.isRequired}
              key={field.id}
              name={field.title}
              label={field.isLabelShowing ? field.title : ""}
              value={fieldValue}
              onEvent={(event) => onFieldEvent({ ...event, field })}
              disabled={formField.isDisabled} // TODO handle disabled
              error={""}
              fieldClasses={field.classes}
            />
          </div>
        );
      })}

      {!groupFields ||
        (!groupFields.length && <div className="px-2 py-5 text-center w-100">There are no fields in this group</div>)}

      {isConfigurable ? (
        <div className="custom-form-field col-12 px-0">
          <div className="element-add" onClick={() => onFieldEvent({ type: DFormWidgetEventsTypes.Create, group })}>
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
