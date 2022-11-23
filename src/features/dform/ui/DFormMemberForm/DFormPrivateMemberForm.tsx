import { Form } from "antd";
import type { FC } from "react";
import { useMutation } from "react-query";
import React, { useState, useMemo } from "react";

import { NmpCol, NmpRow, NmpCard, NmpButton } from "features/nmp-ui";

import { DFormContext } from "../DFormContext";
import { DFormMemberTabs } from "../DFormMemberTabs";
import { DFormMemberSection } from "./DFormMemberSection";
import { DformSchemaContext } from "../DformSchemaContext";
import { DFormMemberCheckSave } from "../DFormMemberCheckSave";
import { dformValidationMessages } from "../../dformValidationMessages";
import { MemberDFormService } from "../../data/services/memberDformService";
import { DformBlockId, DformFieldValueType, DformId, DformSectionId } from "../../data/models";
import { getDCREffect } from "../DCR/getDCREffect";

export type DFormPrivateMemberFormProps = {
  dformId: DformId;
  dformName: string;
  initialValues?: Record<DformBlockId, DformFieldValueType>;
};

export const DFormPrivateMemberForm: FC<DFormPrivateMemberFormProps> = (props) => {
  const { dformId, dformName, initialValues = {} } = props;

  const [form] = Form.useForm();
  const [values, setValues] = useState(() => initialValues);

  const { isAccessible } = DFormContext.useContext();
  const { dformSchema } = DformSchemaContext.useContext();

  const sections = useMemo(() => dformSchema.orderedSections, []);

  const [activeSectionId, setActiveSectionId] = useState(() => sections[0].id);

  const progresses = useMemo(() => {
    return sections.map(({ id }) => {
      return dformSchema.getQuantityOfValidFieldInSectionById(id, values);
    });
  }, [sections, values]);

  const effects = useMemo(() => {
    return sections.map((section) =>
      getDCREffect({
        conditions: section.conditions,
        getFieldById: (id) => dformSchema.getFieldById(id),
        getFieldValue: (id) => values[id],
      })
    );
  }, [sections, values]);

  console.log("asd", { effect: effects[sections.findIndex(({ id }) => activeSectionId == id)] });

  const section = dformSchema.getSectionById(activeSectionId);
  const activeSectionIndex = sections.findIndex((section) => section.id === activeSectionId);
  const isLastSection = activeSectionIndex === sections.length - 1;
  const isFirstSection = activeSectionIndex === 0;

  const submitMutation = useMutation({
    mutationFn: () => MemberDFormService.instance.submit({ dformId }),
  });

  const saveFieldValueMutation = useMutation({
    mutationFn: (data: any) => MemberDFormService.instance.saveFieldValue(data),
  });

  const onFinish = () => submitMutation.mutate();

  const onValuesChange = (changedValues: Record<DformBlockId, DformFieldValueType>) => {
    const changedValuesEntries = Object.entries(changedValues) as [DformBlockId, DformFieldValueType][];

    if (changedValuesEntries.length === 0) {
      return;
    }

    changedValuesEntries.forEach(([fieldId, value]) => {
      const field = dformSchema.getFieldById(fieldId);
      saveFieldValueMutation.mutate({ dformId, field, value });
    });

    setValues((prevValues) => {
      return changedValuesEntries.reduce(
        (values, [fieldId, value]) => {
          values[fieldId] = value;
          return values;
        },
        { ...prevValues }
      );
    });
  };

  const validateSection = () => {
    const nameList = dformSchema.getFieldsIdsBySectionId(section.id);
    return form.validateFields(nameList);
  };

  // Need to cover cases when section is hidden/disabled by DCR
  const tryMoveToNextSection = () => {
    validateSection().then(() =>
      setActiveSectionId((sectionId) => {
        const activeSectionIndex = sections.findIndex((section) => section.id === sectionId);
        const nextSectionId = sections[activeSectionIndex + 1].id;

        return nextSectionId;
      })
    );
  };

  const trySubmitDform = () => {
    validateSection().then(() => form.submit());
  };

  // Need to cover cases when section is hidden/disabled by DCR
  const onSectionTabClick = (sectionId: DformSectionId) => setActiveSectionId(sectionId);

  const onNextButtonClick = () => {
    if (isLastSection) {
      trySubmitDform();
    } else {
      tryMoveToNextSection();
    }
  };

  const onPrevButtonClick = () => {
    setActiveSectionId((sectionId) => {
      const activeSectionIndex = sections.findIndex((section) => section.id === sectionId);
      const nextSectionId = sections[activeSectionIndex - 1].id;

      return nextSectionId;
    });
  };

  return (
    <NmpRow>
      <NmpCol span="20">
        <DFormMemberTabs
          items={sections.map((section, index) => ({
            key: section.id,
            label: section.name,
            isViewed: section.isViewed,
            progress: progresses[index],
            disabled: effects[index].isDisabled,
            isHidden: effects[index].isHidden,
            children: (
              <>
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
              </>
            ),
          }))}
          activeKey={activeSectionId}
          onTabClick={onSectionTabClick}
          className="dform-member-form__tabs"
        />
      </NmpCol>
    </NmpRow>
  );
};
