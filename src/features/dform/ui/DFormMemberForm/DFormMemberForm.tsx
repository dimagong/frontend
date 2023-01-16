import "./styles.scss";

import React from "react";
import type { FC } from "react";

import { DFormMemberProvider } from "./DFormMemberProvider";
import { DFormPrivateMemberForm } from "./DFormPrivateMemberForm";
import type { DformId, DformFieldValueType, DformBlockId, DformModel } from "../../data/models";

export type DFormMemberFormProps = {
  dformId: DformId;
  dform: DformModel;
  values: Record<DformBlockId, DformFieldValueType>;
};

export const DFormMemberForm: FC<DFormMemberFormProps> = (props) => {
  const { dform, values, dformId } = props;

  const { name, schema, accessType } = dform;
  const { blocks, groups, sections, relatedSectionsIds } = schema;

  return (
    <DFormMemberProvider
      blocks={blocks}
      groups={groups}
      dformId={dformId}
      sections={sections}
      accessType={accessType}
      relatedSectionsIds={relatedSectionsIds}
    >
      <DFormPrivateMemberForm dformId={dformId} dformName={name} initialValues={values} />
    </DFormMemberProvider>
  );
};
