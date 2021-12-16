import { isEmpty } from "lodash/fp";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import React, { useState, useEffect, useMemo, useRef } from "react";

import { usePrevious } from "hooks/common";

import appSlice from "app/slices/appSlice";
import { createLoadingSelector } from "app/selectors/loadingSelector";
import { getSelectedMemberFirm } from "app/selectors/memberFirmsSelector";

import SurveyModal from "features/Surveys/Components/SurveyModal";
import { Input, Select, Checkbox } from "features/Surveys/Components/SurveyFormComponents";

import getValidationDependingOnComponent from "./validations";

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

const { createMasterSchemaFieldForMemberFirmRequest } = appSlice.actions;

const transformMSPropertiesToOptions = (properties) => {
  return Object.values(properties).map((property) => ({
    value: property.id,
    label: `${property.breadcrumbs}.${property.name}`,
  }));
};

const AddFieldModal = ({
  isOpen,
  onClose,
  isMSPropertiesLoading,
  MSProperties,
  memberFirmId,
  onSubmit,
  isSubmitProceeding,
  error,
}) => {
  const dispatch = useDispatch();
  const memberFirmData = useSelector(getSelectedMemberFirm);
  const isNewPropertyLoading = useSelector(
    createLoadingSelector([createMasterSchemaFieldForMemberFirmRequest.type], true)
  );

  const breadcrumbs = memberFirmData?.master_schema_breadcrumbs ?? "";
  const [fieldTitle, setFieldTitle] = useState("");
  const [fieldType, setFieldType] = useState(null);

  const newPropertyRef = useRef(null);
  const [property, setProperty] = useState(null);
  const [newProperty, setNewProperty] = useState("");
  const initialPropertyOptions = useMemo(() => transformMSPropertiesToOptions(MSProperties), [MSProperties]);
  const propertyOptions = useMemo(() => {
    return isEmpty(newProperty)
      ? initialPropertyOptions.concat({ label: `${breadcrumbs}.<newField>`, value: null, placeholder: true })
      : [{ label: `${breadcrumbs}.${newProperty}`, value: null, _new: true }];
  }, [initialPropertyOptions, breadcrumbs, newProperty]);

  const [isFieldRequired, setIsFieldRequired] = useState(false);
  const isSubmitProceedingPrev = usePrevious(isSubmitProceeding);

  const onPropertyChange = (option) => {
    if (option.placeholder) return;

    if (option._new && window.confirm(`Are you sure you want to create a field: "${option.label}"?`)) {
      const payload = { member_firm_id: memberFirmId, data: { name: newProperty } };

      newPropertyRef.current = `${breadcrumbs}.${newProperty}`;
      dispatch(createMasterSchemaFieldForMemberFirmRequest(payload));
      return;
    }

    setProperty(option);
  };

  const handleSubmit = async () => {
    const dataToSubmit = {
      master_schema_field_id: property?.value,
      type: fieldType?.value,
      title: fieldTitle,
      is_required: isFieldRequired,
      settings: null,
    };

    const validationSchema = getValidationDependingOnComponent(dataToSubmit.type);

    const isValid = await validationSchema.validate(dataToSubmit).catch((err) => {
      toast.error(err.message);
    });

    if (!isValid) return;

    onSubmit(dataToSubmit);
  };

  const handleClearAllValues = () => {
    setFieldTitle("");
    setFieldType(null);
    setProperty(null);
    setNewProperty("");
    setIsFieldRequired(false);
  };

  useEffect(() => {
    if (!isSubmitProceeding && isSubmitProceedingPrev && !error) {
      onClose();
      handleClearAllValues();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSubmitProceeding]);

  useEffect(() => {
    if (!newPropertyRef.current || isNewPropertyLoading) return;

    const newOption = propertyOptions.find(({ label }) => label === newPropertyRef.current);

    if (!newOption) return;

    setProperty(newOption);
    newPropertyRef.current = null;
  }, [isNewPropertyLoading, propertyOptions]);

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
        options={propertyOptions}
        isLoading={isMSPropertiesLoading}
        maxMenuHeight={300}
        value={property}
        onChange={onPropertyChange}
        onInputChange={setNewProperty}
      />
      <Checkbox
        label="Required"
        name={"required"}
        onChange={(e) => setIsFieldRequired(e.target.checked)}
        checked={isFieldRequired}
      />
    </SurveyModal>
  );
};

export default AddFieldModal;
