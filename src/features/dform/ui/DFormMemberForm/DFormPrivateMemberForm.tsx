import { Form } from "antd";
import type { FC } from "react";
import { useMutation } from "react-query";
import React, { useState, useMemo } from "react";

import { NmpCol, NmpRow, NmpCard, NmpButton } from "features/nmp-ui";

import { DFormSteps } from "../DFormSteps";
import { DFormContext } from "../DFormContext";
import { DFormMemberSection } from "./DFormMemberSection";
import { DformSchemaContext } from "../DformSchemaContext";
import { DFormMemberCheckSave } from "../DFormMemberCheckSave";
import { DformBlockId, DformFieldValueType, DformId } from "../../data/models";
import { dformValidationMessages } from "../../dformValidationMessages";
import { MemberDFormService } from "../../data/services/memberDformService";

export type DFormPrivateMemberFormProps = {
  dformId: DformId;
  dformName: string;
  initialValues?: Record<number, DformFieldValueType>;
};

export const DFormPrivateMemberForm: FC<DFormPrivateMemberFormProps> = (props) => {
  const { dformId, dformName, initialValues = {} } = props;

  const [form] = Form.useForm();
  const [values, setValues] = useState(() => initialValues);

  const { isAccessible } = DFormContext.useContext();
  const { dformSchema } = DformSchemaContext.useContext();
  const sections = dformSchema.orderedSections;

  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);

  const section = sections[currentSectionIndex];
  const isLastSection = currentSectionIndex === sections.length - 1;
  const isFirstSection = currentSectionIndex === 0;

  const percent = useMemo(() => {
    const requiredFields = dformSchema.getRequiredFieldsBySectionId(section.id);

    if (requiredFields.length === 0) {
      return 0;
    }

    const validRequiredFields = dformSchema.getValidRequiredFieldsBySectionId(section.id, values);
    const percent = Math.round((validRequiredFields.length / requiredFields.length) * 100);

    return percent;
  }, [values, section.id]);

  const submitMutation = useMutation({
    mutationFn: () => MemberDFormService.instance.submit({ dformId }),
  });

  const saveFieldValueMutation = useMutation({
    mutationFn: (data: any) => MemberDFormService.instance.saveFieldValue(data),
  });

  const onFinish = () => submitMutation.mutate();

  const onValuesChange = (changedValues, values) => {
    Object.entries(changedValues).forEach(([id, value]) => {
      const fieldId = id as DformBlockId;
      const field = dformSchema.getFieldById(fieldId);
      saveFieldValueMutation.mutate({ dformId, field, value });
    });

    setValues(values);
  };

  const validateSection = () => {
    const nameList = dformSchema.getFieldsIdsBySectionId(section.id);
    return form.validateFields(nameList);
  };

  const tryMoveToNextSection = () => {
    validateSection().then(() => setCurrentSectionIndex((index) => index + 1));
  };

  const trySubmitDform = () => {
    validateSection().then(() => form.submit());
  };

  const onSectionChange = (index: number) => {
    setCurrentSectionIndex(index);
  };

  const onNextButtonClick = () => {
    if (isLastSection) {
      trySubmitDform();
    } else {
      tryMoveToNextSection();
    }
  };

  const onPrevButtonClick = () => setCurrentSectionIndex((index) => (index > 0 ? index - 1 : index));

  return (
    <NmpRow>
      <NmpCol sm={5} className="dform-member-form__steps">
        <div className="dform-member-form__steps-scroll">
          <DFormSteps
            items={sections.map((section) => ({ title: section.name }))}
            percent={percent}
            current={currentSectionIndex}
            onChange={onSectionChange}
          />
        </div>
      </NmpCol>

      <NmpCol span={14}>
        <h2 className="dform-member-form__title">{dformName}</h2>

        <NmpCard className="dform-member-form__card">
          <Form
            form={form}
            name={section.id}
            initialValues={initialValues}
            validateMessages={dformValidationMessages}
            onFinish={onFinish}
            onValuesChange={onValuesChange}
          >
            <DFormMemberSection sectionId={section.id}>
              <NmpRow justify="space-between" align="middle" className="dform-member-form__actions" gutter={24}>
                <NmpCol flex="1">
                  <DFormMemberCheckSave isLoading={false} />
                </NmpCol>

                {isFirstSection ? null : (
                  <NmpCol>
                    <NmpButton type="nmp-ghost" onClick={onPrevButtonClick}>
                      Back
                    </NmpButton>
                  </NmpCol>
                )}

                <NmpCol>
                  <NmpButton
                    type="nmp-primary"
                    onClick={onNextButtonClick}
                    loading={submitMutation.isLoading || saveFieldValueMutation.isLoading}
                    disabled={!isAccessible && isLastSection}
                  >
                    {isLastSection ? "Submit for review" : "Next Section"}
                  </NmpButton>
                </NmpCol>
              </NmpRow>
            </DFormMemberSection>
          </Form>
        </NmpCard>
      </NmpCol>
    </NmpRow>
  );
};
