import React from "react";
import type { FC } from "react";
import { Form, FormProps } from "antd";

import { DFormBaseSection } from "./DFormBaseSection";
import { dformValidationMessages } from "./dformValidationMessages";

import { NmpButton } from "features/nmp-ui";
import MemberDFormCheckSave from "features/members/ui/MemberDFormCheckSave";
// import MemberDFormNavigation from "../../../../features/members/ui/MemberDFormNavigation";

type Props = Omit<FormProps, "name" | "layout" | "validateMessages"> & {
  sectionId: string;
  sectionName: string;
};

export const DFormSection: FC<Props> = (props) => {
  const { sectionId, sectionName, initialValues, children, ...formProps } = props;

  return (
    <Form name={sectionId} layout="vertical" validateMessages={dformValidationMessages} {...formProps}>
      <DFormBaseSection sectionName={sectionName}>
        {children}

        <div>
          <MemberDFormCheckSave isSavedDFormFieldLoading={false} />

          <NmpButton type="nmp-ghost" disabled={false} loading={false}>
            Back
          </NmpButton>

          <NmpButton type="nmp-primary" disabled={false} loading={false} htmlType="submit">
            Next Section
          </NmpButton>

          <NmpButton type="nmp-primary" disabled={false} loading={false} htmlType="submit">
            Submit for review
          </NmpButton>
        </div>
      </DFormBaseSection>
    </Form>
  );
};
