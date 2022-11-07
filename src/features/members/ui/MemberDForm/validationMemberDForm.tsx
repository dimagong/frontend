import "./styles.scss";

import _ from "lodash";
import type { FC } from "react";
import React, { useMemo, useRef, useState } from "react";
import type { FormProviderProps } from "antd/lib/form/context";

import { DFormMemberForm } from "features/dform/ui/DFormMemberForm";
import { getValuesBySectionId } from "features/dform/data/getValuesBySectionId";
import { applyDynamicConditionalRender } from "features/dform/data/applyConditionalRender";
import { getFieldByMasterSchemaFieldId } from "features/dform/data/getFieldByMasterSchemaFieldId";
import { DFormSchema, DFormAccessTypes, DFormFieldTypes, NormalizedDFormValues } from "features/dform/types";

import {
  useSubmitDFormMutation,
  useProspectUserProfileQuery,
  useSaveDFormFieldValueMutation,
} from "api/Onboarding/prospectUserQuery";

import MemberThanksStatusView from "../MemberThanksStatusView";

type Props = {
  dformId: number;
  dformName: string;
  accessType: DFormAccessTypes;
  initialSchema: DFormSchema;
  initialValues: NormalizedDFormValues;
};

export const MemberDForm: FC<Props> = (props) => {
  const { dformId, dformName, accessType, initialSchema, initialValues } = props;

  const [successSubmit, onSuccessSubmit] = useState<boolean>(() => false);

  // const [values, setValues] = useState(() => getValuesBySectionId(sectionId, initialSchema, initialValues));
  // const schema = useMemo(() => applyDynamicConditionalRender(initialSchema, values), [initialSchema, values]);

  // Mutations
  // const submitDFormMutation = useSubmitDFormMutation({ dformId: id }, { onSuccess: () => onSuccessSubmit(true) });
  // const saveFieldValueMutation = useSaveDFormFieldValueMutation({ dformId: id });

  // Queries
  const userDFormProfile = useProspectUserProfileQuery();

  // const saveFieldValueRef = useRef(_.throttle((v) => saveFieldValueMutation.mutate(v), 1500, { leading: false }));
  // const saveFieldValue = (v) => saveFieldValueRef.current(v);

  // const submitData =
  //   (submitDFormMutation as any).data?.updated_at ||
  //   (submitDFormMutation as any).data?.finished_at ||
  //   new Date().toISOString();
  // const userName = userDFormProfile.data.first_name;
  // const organization = userDFormProfile.data.permissions.organization;

  // const changeSection = (sectionId) => {
  //   setSectionId(sectionId);
  //   setValues(getValuesBySectionId(sectionId, initialSchema, initialValues));
  //
  //   // Scroll to Top
  //   const scrollable = document.querySelector(".scrollbar-container > :first-child");
  //   if (scrollable) scrollable.scrollTo({ top: 0, behavior: "smooth" });
  // };

  // const onChangeStep = (step) => {
  //   if (step < sections.length) {
  //     changeSection(sections[step].id);
  //   }
  // };

  // const onPreviousSection = () => changeSection(sections[step - 1].id);

  // Form

  // const onFieldChange = (masterSchemaFieldId, newValue) => {
  //   const field = getFieldByMasterSchemaFieldId(masterSchemaFieldId, initialSchema);
  //
  //   // Do not save Files. Files save in a different way.
  //   if ([DFormFieldTypes.File, DFormFieldTypes.FileList].includes(field.type)) return;
  //
  //   saveFieldValue({ master_schema_field_id: masterSchemaFieldId, value: newValue });
  // };

  // const onFormFinish: FormProviderProps["onFormFinish"] = (sectionId, { forms }) => {
  //   const form = forms[sectionId];
  //
  //   form.validateFields().then(() => {
  //     const isLastSection = step === sections.length - 1;
  //
  //     if (!isLastSection) {
  //       const nextSectionId = sections[step + 1].id;
  //       changeSection(nextSectionId);
  //     } else {
  //       submitDFormMutation.mutate();
  //     }
  //   });
  // };

  // ToDo: Make validation rules for Fields with Form.Item (like min max ...)
  // ToDo: Next section if all required fields are valid
  // ToDo: Figure out how to - Watch required fields in section and
  // ToDo: Implement - Watch required fields in section and
  // ToDo: Set section if viewed when submitted
  // ToDo: Apply DCR to NpmStepper (isHidden & isDisabled)
  /*const onFormChange: FormProviderProps["onFormChange"] = (sectionId, { changedFields, forms }) => {
    const form = forms[sectionId];
    const values = form.getFieldsValue();

    console.log("Change", { sectionId, changedFields, forms, values });

    Object.values(changedFields).forEach((data) => {
      const masterSchemaFieldId = Number(Array.isArray(data.name) ? data.name.join() : data.name);

      onFieldChange(masterSchemaFieldId, data.value);
    });

    // Optimizing DCR rendering, cause it leads to whole schema re-render.
    _.debounce(setValues, 300)(values);
  };*/

  // if (successSubmit) {
  //   return <MemberThanksStatusView data={submitData} organization={organization} surveyName={userName} />;
  // }

  return (
    <div className="member-dform member-dform__container">
      {/*<DFormMemberForm dformId={} />*/}
      {/*
      <Row>
        <Col xl={{ span: 16, push: 4 }} span={12} push={6}>
          <h2 className="member-dform__title">{name}</h2>
        </Col>
      </Row>

      <Row>
        <Col sm={4} className="member-dform__stepper-sticky">
          <NmpStepper
            className="member-dform__scrollbar"
            status={stepperStatus}
            current={step}
            sections={sections}
            onChange={onChangeStep}
          />
        </Col>

        <Col xl={{ span: 16, push: 4 }} span={12} push={6}>
          <NmpCard title={<strong className="member-dform__section-name">Section {sectionName}</strong>} />
          <Form.Provider onFormFinish={onFormFinish} onFormChange={onFormChange}>
            <DFormContext.Provider dformId={id} accessType={accessType} isMemberView>
              <DFormSection
                  schema={schema}
                  actions={
                    <Row justify="space-between" align="middle">
                      <Col>
                        <MemberDFormCheckSave isSavedDFormFieldLoading={saveFieldValueMutation.isLoading} />
                      </Col>

                      <Col>
                        <MemberDFormNavigation
                          loading={submitDFormMutation.isLoading || saveFieldValueMutation.isLoading}
                          disabled={isFinalSection && !isAccessible}
                          sectionLimit={sections.length - 1}
                          sectionNumber={step}
                          handlePreviousSection={onPreviousSection}
                        />
                      </Col>
                    </Row>
                  }
                  isHidden={schema.sections[sectionId]?.isHidden ?? false}
                  sectionId={sectionId}
                  isDisabled={schema.sections[sectionId]?.isDisabled ?? false}
                  relatedGroups={schema.sections[sectionId]?.relatedGroups ?? []}
                  initialValues={values}
                  key={sectionId}
                />
            </DFormContext.Provider>
          </Form.Provider>
        </Col>
      </Row>*/}
    </div>
  );
};
