import React, { useState, useEffect } from 'react';

import appSlice from "../../../../../../../../../../app/slices/appSlice";
import {useDispatch, useSelector} from "react-redux";
import {createLoadingSelector} from "app/selectors/loadingSelector";
import {
  Spinner,
  Button,
} from 'reactstrap';

import LoadingButton from "components/LoadingButton";
import AddFieldModal from "./Components/AddFieldModal";
import validationSchemas from "../../../../../formComponents/validationSchemas";
import formComponents from "../../../../../formComponents";

import { selectError } from "app/selectors";

import {Plus} from "react-feather";
import './styles.scss';
import {toast} from "react-toastify";

const {
  updateMemberFirmFormValuesRequest,
  addFieldToMemberFirmRequest,
} = appSlice.actions;

const FormComponent = ({
  isMemberFirmFormFieldsLoading,
  isMasterSchemaFieldsForMemberFirmLoading,
  memberFirmFormFields,
  masterSchemaMemberFirmFields,
  memberFirmId,
  onFieldAdd,
}) => {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({});
  const [isAddFieldModalVisible, setIsAddFieldModalVisible] = useState(false);

  const isSubmitProceeding = useSelector(createLoadingSelector([updateMemberFirmFormValuesRequest.type], true));
  const isAddingFieldToMemberFirmLoading = useSelector(createLoadingSelector([addFieldToMemberFirmRequest.type], true));
  const error = useSelector(selectError);

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

  const handleSave = async () => {

    const fields = Object.values(formData);

    const isValid = await isFormValid(fields);

    if (!isValid) {
      toast.error("Please, enter valid information");

      return;
    }

    const dataToSave = (Object.values(formData).map((field) => ({master_schema_field_id: field.id, value: field.value})));

    dispatch(updateMemberFirmFormValuesRequest({memberFirmId: memberFirmId, data: {fields: dataToSave}}))
  };

  const initForm = () => {
    const initialData = {};

    [...memberFirmFormFields].map((formField) => {

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

  const handleAddFieldModalOpen = () => {
    setIsAddFieldModalVisible(true);
  };

  const handleAddFieldModalClose = () => {
    setIsAddFieldModalVisible(false)
  };

  const handleAddFieldSubmit = (data) => {
    dispatch(addFieldToMemberFirmRequest({memberFirmId: memberFirmId, data}))
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
          {memberFirmFormFields.map((formField) => {

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
                disabled={isSubmitProceeding}
                error={formData[fieldId]?.error || ""}
              />
            )
          })}

          <div className={`member_firm-form_component-fields-actions ${onFieldAdd ? "with_add_button" : ""}`}>
            {onFieldAdd && (
              <Button onClick={handleAddFieldModalOpen} className="member_firm-form_component-fields-actions-add_field" color="primary">
                <Plus size={28}/>
              </Button>
            )}

            <LoadingButton
              className="member_firm-form_component-fields-actions-save"
              value="Save"
              isLoading={isSubmitProceeding}
              onClick={handleSave}
            />
          </div>
        </div>
      )}

      <AddFieldModal
        isOpen={isAddFieldModalVisible}
        onClose={handleAddFieldModalClose}
        isMSPropertiesLoading={isMasterSchemaFieldsForMemberFirmLoading}
        memberFirmId={memberFirmId}
        MSProperties={masterSchemaMemberFirmFields}
        onSubmit={handleAddFieldSubmit}
        isSubmitProceeding={isAddingFieldToMemberFirmLoading}
        error={error}
      />
    </div>
  )
};

export default FormComponent;
