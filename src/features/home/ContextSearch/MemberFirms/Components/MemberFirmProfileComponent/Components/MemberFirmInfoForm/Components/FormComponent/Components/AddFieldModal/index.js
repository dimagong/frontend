import React, { useState, useEffect } from 'react';

import SurveyModal from "../../../../../../../../../../../Surveys/Components/SurveyModal";
import { Input, Select, Checkbox } from "../../../../../../../../../../../Surveys/Components/SurveyFormComponents";
import { usePrevious } from "hooks/common";
import getValidationDependingOnComponent from "./validations";
import {toast} from "react-toastify";


const inputTypes = [
  {
    value: "text",
    label: "Text",
  },
  {
    value: "email",
    label: "Email",
  },
];

const AddFieldModal = ({
  isOpen,
  onClose,
  isMSPropertiesLoading,
  isEdit,
  MSProperties,
  onSubmit,
  isSubmitProceeding,
  error,
}) => {

  const [fieldTitle, setFieldTitle] = useState("");
  const [fieldType, setFieldType] = useState(null);
  const [masterSchemaProperty, setMasterSchemaProperty] = useState(null);
  const [isFieldRequired, setIsFieldRequired] = useState(false);

  const isSubmitProceedingPrev = usePrevious(isSubmitProceeding);

  const MSPropertiesOptions = Object.values(MSProperties).map(property => ({
    value: property.id,
    label: `${property.breadcrumbs}.${property.name}`,
  }));

  const handleSubmit = async () => {
    const dataToSubmit = {
      master_schema_field_id: masterSchemaProperty?.value,
      type: fieldType?.value,
      title: fieldTitle,
      is_required: isFieldRequired,
      settings: null,
    };

    const validationSchema = getValidationDependingOnComponent(dataToSubmit.type);

    const isValid = await validationSchema
      .validate(dataToSubmit)
      .catch((err) => { toast.error(err.message) });

    if (!isValid) return;

    onSubmit(dataToSubmit)
  };

  const handleClearAllValues = () => {
    setFieldTitle("");
    setFieldType(null);
    setMasterSchemaProperty(null);
    setIsFieldRequired(false);
  };

  useEffect(() => {
    if (!isSubmitProceeding && isSubmitProceedingPrev && !error) {
      onClose();
      handleClearAllValues()
    }
  }, [isSubmitProceeding]);

  return (
    <SurveyModal
      title={"Add field"}
      isOpen={isOpen}
      onClose={onClose}
      submitBtnText={"Add"}
      isSubmitProceed={isSubmitProceeding}
      onSubmit={handleSubmit}
    >
      <Input
        label={"Title"}
        name={"Title"}
        placeholder={"Please enter field title"}
        onChange={(e) => setFieldTitle(e.target.value)}
        value={fieldTitle}
      />
      <Select
        label="Select Field Type"
        className="mb-2"
        searchable={false}
        options={inputTypes}
        value={fieldType}
        maxMenuHeight={300}
        onChange={setFieldType}
      />
      <Select
        label="MS Property"
        className="mb-2"
        options={MSPropertiesOptions}
        isLoading={isMSPropertiesLoading}
        maxMenuHeight={300}
        value={masterSchemaProperty}
        onChange={setMasterSchemaProperty}
        noOptionsMessage={() => "There is no available MS fields for this member firm"}
      />
      <Checkbox
        label="Required"
        name={"required"}
        onChange={(e) => setIsFieldRequired(e.target.checked)}
        checked={isFieldRequired}
      />
    </SurveyModal>
  )
};

export default AddFieldModal;
