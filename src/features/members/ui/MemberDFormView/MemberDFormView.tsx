import "./styles.scss";

import React, { FC, useEffect, useRef, useState } from "react";

import { Col, Row } from "antd";
import _ from "lodash";

import {
  useDFormByIdQuery,
  useDFormsValuesByIdQuery,
  useSaveDFormFieldValue,
  useSubmitDFormForReviewMutation,
} from "api/Onboarding/prospectUserQuery";

import { toast } from "react-toastify";

import { fieldValidationSchemas } from "./../../data/validation/validationDFormFields";

import { DForm, AccessTypes, FieldTypes } from "components/DForm";

import MemberDFormNavigation from "./../MemberDFormNavigation";
import MemberDFormCheckSave from "./../MemberDFormCheckSave";

import { NpmCard, NpmButton } from "../../../nmp-ui";
import NpmInputSelect from "./../../../nmp-ui/NpmInputSelect";
import NpmDatePicker from "./../../../nmp-ui/NpmDatePicker";
import NpmTimePicker from "./../../../nmp-ui/NpmTimePicker";
import NpmRadioGroup from "./../../../nmp-ui/NpmRadioGroup";
import NpmTextArea from "./../../../nmp-ui/NpmTextArea";
import NpmModal from "./../../../nmp-ui/NpmModal";
import NpmLongText from "./../../../nmp-ui/NpmLongText";
import NpmStepper from "./../../../nmp-ui/NpmStepper";
import NpmProgress from "./../../../nmp-ui/NpmProgress";
import { ArrowUpOutlined } from "@ant-design/icons";
import NpmFileLoading from "./../../../nmp-ui/NpmFileLoading";
import NpmDragAndDrop from "./../../../nmp-ui/NpmDragAndDrop";

import { IProfile, IForm } from "./../../data/models/models";
import Groups from "../../../../components/DForm/Components/Groups";
import Fields from "../../../../components/DForm/Components/Fields";

interface IProps {
  profile: IProfile;
  selectedForm: IForm;
  setRecentlySubmitted: (data: boolean) => any;
}

const MemberDFormView: FC<IProps> = ({ profile, selectedForm, setRecentlySubmitted }: IProps) => {
  // const optionsTest = ["option-1", "option-2", "option-3", "option-4", "option-5", "option-6", "option-7"];
  console.log("profile", profile);
  console.log("selectedForm", selectedForm);

  const [applicationData, setApplicationData] = useState<any>(null);

  const [applicationValues, setApplicationValues] = useState<any>(null);

  const [currentSection, setCurrentSection] = useState<null | string>(null);

  console.log("applicationData", applicationData);
  console.log("applicationValues", applicationValues);
  console.log("currentSection", currentSection);

  const { isLoading: isFormLoading } = useDFormByIdQuery(
    { id: selectedForm.id },
    {
      onSuccess: (data) => {
        const { schema, ...rest } = data;
        console.log("useDFormByIdQuery", data);
        setApplicationData({ ...schema, ...rest });
        setCurrentSection(data.schema.sectionsOrder[0]);
      },
      refetchOnWindowFocus: false,
    }
  );

  const dFormValues = useDFormsValuesByIdQuery(
    { dFormId: selectedForm.id },
    {
      onSuccess: (data) => {
        setApplicationValues(data);
      },
      refetchOnWindowFocus: false,
    }
  );

  const saveDFormFieldValue = useSaveDFormFieldValue(
    { dFormId: selectedForm.id },
    {
      onError: () => {
        toast.error("Last changes in field doesn't saved");
      },
    }
  );

  const throttleOnSave = useRef(_.throttle((data) => saveDFormFieldValue.mutate(data), 1500, { leading: false }));

  const submitDFormForReview = useSubmitDFormForReviewMutation(
    { dFormId: selectedForm.id },
    {
      onSuccess: () => setRecentlySubmitted(true),
    }
  );

  const validateFieldsSubmit = (fields) => {
    const checkSubmit = fields.map((field) => {
      const selectedValidationSchema = fieldValidationSchemas[field.type];
      try {
        selectedValidationSchema.validateSync(field);
      } catch (validationError) {
        return { isValid: false, errors: validationError };
      }
      return { isValid: true };
    });
    return checkSubmit.find((el) => !el.isValid) ?? null;
  };

  const handleApplicationSubmit = () => {
    // ToDo: turn on validation
    /*const checkFields = validateFieldsSubmit(appProperties);
    if (checkFields) {
      console.log("checkFields error", checkFields);
      toast.error(checkFields.errors.message);
    } else {
      submitDFormForReview.mutate();
    }*/
    submitDFormForReview.mutate();
  };

  const validateFields = (field) => {
    const selectedValidationSchema = fieldValidationSchemas[field.type];
    try {
      selectedValidationSchema.validateSync(field);
    } catch (validationError) {
      return { isValid: false, errors: validationError };
    }
    return { isValid: true };
  };

  const handleFieldChange = (field, newValue) => {
    let newFieldValue;
    const currentValue = applicationValues[field.masterSchemaFieldId];

    switch (field.type) {
      case FieldTypes.File:
      case FieldTypes.FileList:
        newFieldValue = { ...currentValue, files: newValue };
        break;
      case FieldTypes.Text:
      case FieldTypes.TextArea:
      case FieldTypes.LongText:
      case FieldTypes.Date:
      case FieldTypes.Number:
      case FieldTypes.Boolean:
      case FieldTypes.Select:
      case FieldTypes.MultiSelect:
      default:
        newFieldValue = { ...currentValue, value: newValue };
    }

    const newApplicationValue = { ...applicationValues, [field.masterSchemaFieldId]: newFieldValue };

    setApplicationValues(newApplicationValue);

    // ToDo: turn on validation
    /*const { errors } = validateFields({ value, ...field });
    if (errors) {
      console.log("validateFields errors", errors);
      toast.error(errors.message);
    } else {
      throttleOnSave.current({ master_schema_field_id: field.masterSchemaFieldId, value });
    }*/

    // Do not save Files
    if ([FieldTypes.File, FieldTypes.FileList].includes(field.type)) return;

    throttleOnSave.current({ master_schema_field_id: field.masterSchemaFieldId, value: newValue });
  };

  // TODO make dform disabled on user-lock
  // const isFormLocked = () => ~["user-lock", "hard-lock"].indexOf(applicationSchema?.access_type);

  // Immediately call save on component unmount if any save currently throttled
  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    return () => throttleOnSave.current.flush();
  }, []);

  //? for testing
  // const handleChange = (option) => {
  //   console.log("option", option);
  // };

  // const onchangeDate = (time, timeString) => {
  //   console.log("Date", time, timeString);
  // };

  // const onChangeTime = (time, timeString) => {
  //   console.log("Time", time, timeString);
  // };

  const isDisabled = applicationData?.sections[0]?.isDisabled;

  //!Mock section
  // const sectionMockName = applicationData?.sectionsOrder[0];
  // console.log("sectionMockName", sectionMockName);
  // const currentSection = applicationData ? applicationData.sections[`${sectionMockName}`] : null;

  const handleNextSection = () => {
    //todo check all fields
    const { sectionsOrder }: { sectionsOrder: [] } = applicationData;
    const currentSectionIndex = sectionsOrder.findIndex((el) => el === currentSection);
    console.log("currentSectionIndex", currentSectionIndex);
    if (currentSectionIndex < sectionsOrder.length - 1) {
      setCurrentSection(sectionsOrder[currentSectionIndex + 1]);
    } else if (currentSectionIndex === sectionsOrder.length - 1) {
      handleApplicationSubmit();
    }
  };

  console.log("currentSection", currentSection);
  if (isFormLoading || dFormValues.isLoading || !currentSection) {
    return (
      <div className="onboarding-survey_loading">
        {/* <Spinner color="primary" size="40" /> */}
        Something was wrong ....
      </div>
    );
  }

  let sectionsSterrer: { sectionId: string; name: string }[] = [];
  applicationData.sectionsOrder.map((el) => {
    const name = applicationData.sections[el].name;
    return sectionsSterrer.push({ sectionId: el, name });
  });

  const currentStep = applicationData.sectionsOrder.indexOf(currentSection) || 0;
  return (
    <Row className="memberDForm">
      <Col span={4} className="memberDForm-stepper">
        <div>
          <NpmStepper sections={sectionsSterrer} current={currentStep} />
        </div>
      </Col>
      <Col span={20} className="memberDForm-content">
        <div className="memberDForm-content_box">
          <div className="memberDForm-content_box_title">{selectedForm?.name}</div>
          <NpmCard style={{ minHeight: "50vh", maxWidth: "783px", width: "57vw", marginTop: "3%" }}>
            <div className="memberDForm-content_box_card">
              <div className="memberDForm-content_box_card_section-name">Section 1</div>
              <div className="memberDForm-content_box_card_section-fields">
                <DForm
                  isMemberView
                  data={applicationData}
                  values={applicationValues}
                  dFormId={applicationData.id}
                  accessType={applicationData.access_type}
                  onFieldChange={handleFieldChange}
                  currentSection={currentSection}
                />
              </div>
              <div className="memberDForm-content_box_card_section-navigation">
                <MemberDFormCheckSave isSavedDFormFieldLoading={saveDFormFieldValue.isLoading} />
                <MemberDFormNavigation sectionNumber={0} sectionLimit={10} handleNextSection={handleNextSection} />
              </div>

              {/* {currentSection.relatedGroups.map((sectionGroup) => {
                  const group = applicationData.groups[sectionGroup];
                  console.log("group", group);

                  if (group.isHidden) {
                    return null;
                  }

                  //const isDisabled = propIsDisabled || Boolean(group.isDisabled);
                  const isDisabled = false;

                  return (
                    <div className="group" key={sectionGroup}>
                      <div className="group-content row mr-0 ml-0">
                        <Fields
                          data={applicationData}
                          values={applicationValues}
                          group={sectionGroup}
                          isDisabled={isDisabled}
                          groupFields={group.relatedFields}
                          onFieldChange={handleFieldChange}
                          // accessType={applicationData.access_type}
                          //dFormId={applicationData.id}
                        />
                      </div>
                    </div>
                  );
                })} */}
              {/* <Groups
                        data={applicationData}
                        values={applicationValues}
                        sectionId={section.id}
                        isDisabled={section.isDisabled}
                        sectionGroups={section.relatedGroups}
                        onFieldChange={handleFieldChange}
                      /> */}
              {/* <NpmLongText isModalOpen={true} /> */}
              {/* <NpmFileLoading />
                <NpmProgress
                  strokeColor="#35A046"
                  strokeWidth={15}
                  width={25}
                  format={(percent) => <ArrowUpOutlined style={{ color: "#35A046" }} />}
                />
                <NpmDragAndDrop /> */}
            </div>
          </NpmCard>
        </div>
      </Col>
    </Row>
  );
};

export default MemberDFormView;
