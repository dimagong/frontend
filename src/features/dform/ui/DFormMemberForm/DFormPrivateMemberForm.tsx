import { Form } from "antd";
import type { FC } from "react";
import { useMutation } from "react-query";
import React, { useState, useMemo } from "react";
import { toast } from "react-toastify";

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

  const [errorSectionsId, setErrorSectionsId] = useState<string[]>([]);

  const sections = dformSchema.orderedSections;

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

  const section = dformSchema.getSectionById(activeSectionId);
  const activeSectionIndex = sections.findIndex((section) => section.id === activeSectionId);
  const isLastSection = activeSectionIndex === sections.length - 1;
  const isFirstSection = activeSectionIndex === 0;

  const submitMutation = useMutation({
    mutationFn: () => MemberDFormService.instance.submit({ dformId }),
    onSuccess: () => {
      toast.success("Form submitted successfully");
    },
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

    // if errors appear in the section, section will be placed in the errorSectionId.
    // if there are no errors it will be removed from the errorSectionId.
    checkSectionErrors();

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

  const checkSectionErrors = () => {
    return validateSection()
      .then(() => {
        removeSectionIdFromErrorList(section.id);
      })
      .catch(({ errorFields }) => {
        if (errorFields.length > 0) {
          setSectionIdToErrorList(section.id);
        } else {
          removeSectionIdFromErrorList(section.id);
        }
      });
  };

  const checkAllErrors = () => {
    return generalValidation().catch(({ errorFields: errorFormFields }) => {
      const errorFieldsId = errorFormFields.map((formField) => formField.name).flat();
      const errorFields = errorFieldsId.map((errorFieldId) => dformSchema.getFieldById(errorFieldId));

      const errorSections = errorFields.map((errorField) => dformSchema.getSectionByGroupId(errorField.groupId));
      const errorSectionsId = errorSections.map((errorSection) => errorSection.id);

      setErrorSectionsId(errorSectionsId);

      toast.error("Fill required fields in sections");
    });
  };

  const removeSectionIdFromErrorList = (sectionId) => {
    if (errorSectionsId.includes(sectionId)) {
      setErrorSectionsId(errorSectionsId.filter((errorSection) => errorSection !== sectionId));
    }
  };

  const setSectionIdToErrorList = (sectionId) => {
    if (!errorSectionsId.includes(sectionId)) {
      setErrorSectionsId([...errorSectionsId, section.id]);
    }
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
    checkAllErrors().then(() => form.submit());
  };

  const generalValidation = () => {
    return form.validateFields();
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
        <Form
          form={form}
          name={section.id}
          initialValues={initialValues}
          validateMessages={dformValidationMessages}
          onFinish={onFinish}
          onValuesChange={onValuesChange}
        >
          <DFormMemberTabs
            items={sections.map((section, index) => ({
              key: section.id,
              label: section.name,
              isViewed: section.isViewed,
              progress: progresses[index],
              disabled: effects[index].isDisabled,
              isHidden: effects[index].isHidden,
              isRequired: errorSectionsId.includes(section.id),
              forceRender: true,
              children: (
                <>
                  <h2 className="dform-member-form__title">{dformName}</h2>

                  <NmpCard className="dform-member-form__card">
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
                  </NmpCard>
                </>
              ),
            }))}
            activeKey={activeSectionId}
            onTabClick={onSectionTabClick}
            className="dform-member-form__tabs"
          />
        </Form>
      </NmpCol>
    </NmpRow>
  );
};
