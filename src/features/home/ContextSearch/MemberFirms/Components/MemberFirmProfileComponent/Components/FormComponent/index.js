import React, { useState, useEffect } from 'react';

import appSlice from "../../../../../../../../app/slices/appSlice";
import {useDispatch, useSelector} from "react-redux";
import {createLoadingSelector} from "app/selectors/loadingSelector";
import {
  Spinner,
  Button,
} from 'reactstrap';

import LoadingButton from "components/LoadingButton";
import {
  InputText,
  InputEmail,
} from "../../../formComponents";

import {Plus} from "react-feather";
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

  const isSubmitProceeding = useSelector(createLoadingSelector([updateMemberFirmFormValuesRequest.type], true));

  // Each field store with structure:
  // - id - id of master schema field id
  // - value - value of input
  // - validationSchema - yup validation schema for that exact field
  // - isRequired - used for conditional validation in yup validation schema
  // - dataPushPrepare - function that prepare input value to common format
  //
  // Each of this properties should be passed on field initialization
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

      initialData[formField.master_schema_field_id] = {
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
      {isMemberFirmFormFieldsLoading && !isSubmitProceeding && !memberFirmFormFields.length ? (
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
                label={formField.title}
                value={formData[formField.master_schema_field_id]?.value || ""}
                onChange={handleInputChange}
                disabled={IS_SUBMIT_PROCESSING}
              />
            )
          })}

          <div className="member_firm-form_component-fields-actions">
            {/*<Button className="member_firm-form_component-fields-actions-add_field" color="primary">*/}
            {/*  <Plus size={28}/>*/}
            {/*</Button>*/}

            <LoadingButton
              className="member_firm-form_component-fields-actions-save"
              value="Save"
              isLoading={isSubmitProceeding}
              onClick={handleSave}
            />
          </div>
        </div>
      )}
    </div>
  )
};

export default FormComponent;
