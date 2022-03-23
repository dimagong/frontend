import React, { useState, useEffect } from 'react';

import './styles.scss';
import {toast} from "react-toastify";

const FormComponent = ({handleSave, groupFields}) => {

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
  const handleInputChange = (value, id) => {
    setFormData({
      ...formData,
      [id]: {
        ...formData[id],
        value,
        error: "",
      }
    })
  };

  const handleError = (id, error) => {
    setFormData({
      ...formData,
      [id]: {
        ...formData[id],
        error,
      }
    })
  };

  const isFormValid = async (fields) => {
    let isFormValid = true;

    await Promise.all(fields.map( async (field) => {
      await validationSchemas[field.type]
        .validate(field.value, {context: {isRequired: field.isRequired}})
        .catch((err) => {
          handleError(field.id, err.message)
        });

      const isValid = await validationSchemas[field.type].isValid(field.value, {context: {isRequired: field.isRequired}});

      if (!isValid) isFormValid = false;
    }));

    return isFormValid;
  };

  const onSave = async () => {

    const fields = Object.values(formData);

    const isValid = await isFormValid(fields);

    if (!isValid) {
      toast.error("Please, enter valid information");

      return;
    }

    const dataToSave = (Object.values(formData).map((field) => ({master_schema_field_id: field.id, value: field.value})));

    handleSave(dataToSave)
  };

  const initForm = () => {
    const initialData = {};

    [...groupFields].map((formField) => {

      // Handle different default values for different field types here
      const defaultValue = "";

      initialData[formField.master_schema_field_id] = {
        id: formField.master_schema_field_id,
        type: formField.type,
        value: formField.master_schema_field?.master_schema_field_value?.value || defaultValue,
        isRequired: formField.is_required,
      };

      return false;
    });

    setFormData(initialData);
  };


  // Init form
  useEffect(() => {
    if(groupFields.length) {
      initForm()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupFields]);

  return (
    <div>

      <div>
        {groupFields.map((formField) => {

          const FormFieldElement = formComponents[formField.type];
          const fieldId = formField.master_schema_field_id;

          return (
            <FormFieldElement
              fieldId={fieldId}
              isRequired={formField.is_required}
              key={formField.id}
              name={formField.master_schema_field.name}
              label={formField.title}
              value={formData[fieldId]?.value || ""}
              onChange={handleInputChange}
              disabled={false} // TODO handle disabled
              error={formData[fieldId]?.error || ""}
            />
          )
        })}
      </div>

    </div>
  )
};

export default FormComponent;
