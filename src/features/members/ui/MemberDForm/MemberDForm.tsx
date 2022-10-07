import "./styles.scss";

import _ from "lodash";
import { Col, Row, Form } from "antd";
import React, { FC, useEffect, useRef, useState } from "react";

import { NpmCard, NpmStepper } from "features/nmp-ui";
import { DForm, AccessTypes, FieldTypes, isMemberViewDFormAccessible } from "components/DForm";
import {
  useSaveDFormFieldValueMutation,
  useSubmitDFormMutation,
  useProspectUserProfileQuery,
} from "api/Onboarding/prospectUserQuery";

import MemberDFormCheckSave from "../MemberDFormCheckSave";
import MemberDFormNavigation from "../MemberDFormNavigation";
import MemberThanksStatusView from "../MemberThanksStatusView";

// type ValidationError = {
//   errors: Record<string, string[]>;
//   message: string;
//   status: number;
// };

interface Props {
  id: number;
  name: string;
  schema: any;
  values: any;
  accessType: AccessTypes;
  sections: Array<{ id: string; name: string }>;
}

export const MemberDForm: FC<Props> = (props) => {
  const { id, name, schema, values: propValues, accessType, sections } = props;

  const [form] = Form.useForm();

  const [values, setValues] = useState<any>(() => propValues);
  const [sectionId, setSectionId] = useState<string>(() => sections[0].id);
  const [successSubmit, onSuccessSubmit] = useState<boolean>(() => false);

  const step = sections.findIndex(({ id }) => id === sectionId) || 0;
  const sectionName = sections[step]?.name || `${step + 1}`;
  const stepperStatus = step < sections.length ? "process" : "finish";

  // const catchError = (error: ValidationError) => {
  //   // Skip no validation status
  //   if (error.status !== 422) return;
  //
  //   setErrors(error.errors);
  // };

  const onSubmitConfig = { onSuccess: () => onSuccessSubmit(true) };

  // Mutations
  const submitDFormMutation = useSubmitDFormMutation({ dformId: id }, onSubmitConfig);
  const saveFieldValueMutation = useSaveDFormFieldValueMutation({ dformId: id });

  const userDFormProfile = useProspectUserProfileQuery({ staleTime: Infinity });

  const saveFieldValueRef = useRef(_.throttle((v) => saveFieldValueMutation.mutate(v), 1500, { leading: false }));
  const saveFieldValue = (v) => saveFieldValueRef.current(v);
  const flushFieldValue = () => saveFieldValueRef.current.flush();

  const onFieldChange = (field, newValue) => {
    let newFieldValue;
    const currentValue = values[field.masterSchemaFieldId];

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

    const newApplicationValue = { ...values, [field.masterSchemaFieldId]: newFieldValue };

    setValues(newApplicationValue);

    // Do not save Files. Files save in a different way.
    if ([FieldTypes.File, FieldTypes.FileList].includes(field.type)) return;
    saveFieldValue({ master_schema_field_id: field.masterSchemaFieldId, value: newValue });
  };

  const isFinalSection = step === sections.length - 1;
  const isAccessible = isMemberViewDFormAccessible(accessType);

  const onNextSection = () => {
    if (step < sections.length - 1) {
      setSectionId(sections[step + 1].id);
    }
  };

  const onPreviousSection = () => {
    setSectionId(sections[step - 1].id);
  };

  const onFinish = (...args) => {
    // submitDFormMutation.mutate();
    console.log("Finish", { args });
  };

  const onFinishFailed = (values, ...args) => {
    console.log("FinishFailed", { values, args });
  };

  // Immediately call save on component unmount if any save currently throttled
  useEffect(() => () => flushFieldValue(), []);

  const onChangeStep = (step: number): void => {
    if (step < sections.length) {
      setSectionId(sections[step].id);
    }
  };

  const submitData =
    (submitDFormMutation as any).data?.updated_at || (submitDFormMutation as any).data?.finished_at || new Date();
  const userName: string = userDFormProfile.data.first_name || "Smiths";
  const organization: string = userDFormProfile.data.permissions.organization || "The Queen Is Dead";

  return (
    <Row className="memberDForm">
      <Col span={4} className={successSubmit ? "memberDForm-stepper-hidden" : "memberDForm-stepper"}>
        <div>
          <NpmStepper status={stepperStatus} sections={sections} current={step} onChange={onChangeStep} />
        </div>
      </Col>

      <Col span={successSubmit ? 24 : 20} className="memberDForm-content">
        {successSubmit ? (
          <div>
            <MemberThanksStatusView data={submitData} organization={organization} surveyName={userName} />
          </div>
        ) : (
          <div className="memberDForm-content_box">
            <div className="memberDForm-content_box_title">{name}</div>

            <NpmCard style={{ minHeight: "50vh", maxWidth: "783px", width: "57vw", marginTop: "3%" }}>
              <Form form={form} onFinish={onFinish} onFinishFailed={onFinishFailed} layout="vertical">
                <div className="memberDForm-content_box_card">
                  <div className="memberDForm-content_box_card_section-name">Section {sectionName}</div>

                  <div className="memberDForm-content_box_card_section-fields">
                    <DForm
                      // @ts-ignore
                      isMemberView
                      schema={schema}
                      values={values}
                      dFormId={id}
                      accessType={accessType}
                      renderSections={false}
                      currentSection={sectionId}
                      onFieldChange={onFieldChange}
                    />
                  </div>

                  <div className="memberDForm-content_box_card_section-navigation">
                    <MemberDFormCheckSave isSavedDFormFieldLoading={saveFieldValueMutation.isLoading} />

                    <Form.Item noStyle>
                      <MemberDFormNavigation
                        loading={submitDFormMutation.isLoading}
                        disabled={isFinalSection && !isAccessible}
                        sectionLimit={sections.length - 1}
                        sectionNumber={step}
                        handleNextSection={onNextSection}
                        handlePreviousSection={onPreviousSection}
                      />
                    </Form.Item>
                  </div>
                </div>
              </Form>
            </NpmCard>
          </div>
        )}
      </Col>
    </Row>
  );
};
