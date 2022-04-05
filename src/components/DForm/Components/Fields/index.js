import React, { useState, useEffect } from 'react';

// import './styles.scss';
import {toast} from "react-toastify";

import formComponents from './Components/DFormWidgets'

const FormComponent = ({groupFields, data, onElementClick}) => {

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

  return groupFields.map((formField) => {
    const field = data.fields[formField];
    const FormFieldElement = formComponents[field.type];
    // const fieldId = formField.master_schema_field_id;

    return (
      <div className={`custom-form-field ${field.classes ? field.classes : "col-12"}`} onClick={(e) => onElementClick(e, field)}>
        <FormFieldElement
          fieldId={field.id}
          isRequired={field.isRequired}
          key={field.id}
          name={field.title}
          label={field.title}
          value={""}
          // onChange={handleInputChange}
          onChange={() => {}}
          disabled={false} // TODO handle disabled
          error={""}
          fieldClasses={field.classes}
        />
      </div>
    )
  });
};

export default FormComponent;
