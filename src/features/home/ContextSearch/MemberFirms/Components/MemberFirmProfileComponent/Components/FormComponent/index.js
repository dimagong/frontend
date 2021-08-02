import React, { useState, useEffect } from 'react';

import appSlice from "../../../../../../../../app/slices/appSlice";
import {useDispatch} from "react-redux";
import {
  Spinner,
  Button,
} from 'reactstrap';

import LoadingButton from "components/LoadingButton";
import {
  InputText,
  InputEmail,
} from "../../../formComponents";

import './styles.scss';

const {
  updateMemberFirmFormValuesRequest,
} = appSlice.actions;

const Components = {
  text: InputText,
  email: InputEmail,
}

const FormComponent = ({
  isMemberFirmFormFieldsLoading,
  isMasterSchemaFieldsForMemberFirmLoading,
  memberFirmFormFields,
  masterSchemaMemberFirmFields,
  memberFirmId,
}) => {

  const dispatch = useDispatch();

  const [formData, setFormData] = useState({});

  const handleInputChange = (value, id) => {
    setFormData({
      ...formData,
      [id]: {
        id,
        value,
      }
    })
  };

  const handleError = (id, error) => {
    setFormData({
      ...formData,
      [id]: {
        ...(formData[id] || {}),
        error,
      }
    })
  };

  const handleSave = () => {
    const dataToSave = (Object.values(formData).map((field) => ({master_schema_field_id: field.id, value: field.value})));

    dispatch(updateMemberFirmFormValuesRequest({memberFirmId: memberFirmId, data: {fields: dataToSave}}))
  };

  const IS_SUBMIT_PROCESSING = false;

  const initForm = () => {
    const initialData = {};

    [...memberFirmFormFields].map((formField) => {

      // Handle different default values for different field types here
      const defaultValue = "";

      initialData[formField.id] = {
        id: formField.master_schema_field_id,
        value: formField.master_schema_field?.value?.value || defaultValue,
      };

      return false;
    });

    setFormData(initialData);
  };

  // Init form
  useEffect(() => {
    if(memberFirmFormFields.length) {
      initForm()
    }
  }, [memberFirmFormFields]);

  return (
    <div className="member_firm-form_component">
      {isMemberFirmFormFieldsLoading ? (
        <div className="member_firm-form_component-loader">
          <Spinner size={40} color="primary"/>
        </div>
      ) : (
        <div className="member_firm-form_component-fields">
          {memberFirmFormFields.map((formField, index) => {

            const FormFieldElement = Components[formField.type];

            return (
              <FormFieldElement
                fieldId={formField.master_schema_field_id}
                isRequired={formField.is_required}
                key={formField.id}
                name={formField.master_schema_field.name}
                label={formField.master_schema_field.name}
                value={formData[formField.id]?.value || ""}
                onChange={handleInputChange}
                disabled={IS_SUBMIT_PROCESSING}
              />
            )
          })}

          <div className="member_firm-form_component-fields-actions">
            {/*<Button color="primary">*/}
            {/*  +*/}
            {/*</Button>*/}

            <LoadingButton
              className="member_firm-form_component-fields-actions-save"
              value="Save"
              isLoading={false}
              onClick={handleSave}
            />
          </div>
        </div>
      )}
    </div>
  )
};

export default FormComponent;
