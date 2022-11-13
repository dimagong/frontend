import "./styles.scss";

import React from "react";
import type { FC } from "react";
import { useQuery } from "react-query";

import { NpmSpin } from "features/nmp-ui";

import { DformId } from "../../data/models";
import { DFormMemberProvider } from "./DFormMemberProvider";
import { DFormPrivateMemberForm } from "./DFormPrivateMemberForm";
import { MemberDFormService } from "../../data/services/memberDformService";

export type DFormMemberFormProps = {
  dformId: DformId;
};

export const DFormMemberForm: FC<DFormMemberFormProps> = (props) => {
  const { dformId } = props;

  const dformQuery = useQuery({
    queryFn: () => MemberDFormService.instance.getDform({ dformId }),
    queryKey: MemberDFormService.queryKeys.byId(dformId),
    refetchOnWindowFocus: false,
  });

  if (!dformQuery.data) {
    return <NpmSpin size={60} />;
  }

  const { dform, values } = dformQuery.data;
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
