import "./styles.scss";

import _ from "lodash";
import React, { FC, useEffect, useRef, useState } from "react";

import { NmpCard, NmpRow, NmpCol, NmpStepper } from "features/nmp-ui";
import { DForm, AccessTypes, FieldTypes, isMemberViewDFormAccessible } from "components/DForm";
import {
  useSaveDFormFieldValueMutation,
  useSubmitDFormMutation,
  useProspectUserProfileQuery,
} from "api/Onboarding/prospectUserQuery";

import MemberDFormCheckSave from "../MemberDFormCheckSave";
import MemberDFormNavigation from "../MemberDFormNavigation";
import MemberThanksStatusView from "../MemberThanksStatusView";

interface Props {
  id: number;
  name: string;
  schema: any;
  values: any;
  accessType: AccessTypes;
  sections: any[];
}

export const MemberDForm: FC<Props> = (props) => {
  const { id, name, schema, values: propValues, accessType, sections } = props;

  const [values, setValues] = useState<any>(() => propValues);
  const [successSubmit, onSuccessSubmit] = useState<boolean>(() => false);

  const [sectionId, setSectionId] = useState<string>(() => sections[0].id);

  const step = sections.findIndex(({ id }) => id === sectionId) || 0;
  const stepperStatus = step < sections.length ? "process" : "finish";

  const onFieldValueError = (error: any): void => {
    console.log({ error });
  };

  // Mutations
  const saveFieldValueMutation = useSaveDFormFieldValueMutation({ dformId: id }, { onError: onFieldValueError });

  const submitDFormMutation = useSubmitDFormMutation(
    { dformId: id },
    {
      onSuccess: () => {
        onSuccessSubmit(true);
      },
    }
  );

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
    if (isFinalSection) {
      return submitDFormMutation.mutate();
    }

    if (step < sections.length - 1) {
      setSectionId(sections[step + 1].id);
    }
  };

  const onPreviousSection = (): void => {
    setSectionId(sections[step - 1].id);
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

  if (successSubmit) {
    return <MemberThanksStatusView data={submitData} organization={organization} surveyName={userName} />;
  }

  return (
    <div className="member-dform member-dform__container">
      <NmpRow>
        <NmpCol xl={{ span: 16, push: 4 }} span={12} push={6}>
          <h2 className="member-dform__title">{name}</h2>
        </NmpCol>
      </NmpRow>

      <NmpRow>
        <NmpCol sm={4} className="member-dform__steps">
          <div className="member-dform__steps-scroll">
            <NmpStepper status={stepperStatus} sections={sections} current={step} onChange={onChangeStep} />
          </div>
        </NmpCol>

        <NmpCol xl={{ span: 16, push: 4 }} span={12} push={6}>
          <NmpCard>
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

            <NmpRow justify="space-between" align="middle">
              <NmpCol>
                <MemberDFormCheckSave isSavedDFormFieldLoading={saveFieldValueMutation.isLoading} />
              </NmpCol>

              <NmpCol>
                <MemberDFormNavigation
                  sectionNumber={step}
                  sectionLimit={sections.length - 1}
                  disabled={isFinalSection && !isAccessible}
                  loading={submitDFormMutation.isLoading}
                  handleNextSection={onNextSection}
                  handlePreviousSection={onPreviousSection}
                />
              </NmpCol>
            </NmpRow>
          </NmpCard>
        </NmpCol>
      </NmpRow>
    </div>
  );
};
