import "./styles.scss";

import React from "react";
import type { FC } from "react";
import { useQuery } from "react-query";

import { NmpCol, NmpRow } from "features/nmp-ui";

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
    return <p>Loading...</p>;
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
      <NmpRow>
        <NmpCol xl={{ span: 12, push: 6 }} span={16} push={4}>
          <h2 className="dform-member-form__title">{name}</h2>
        </NmpCol>
      </NmpRow>

      <DFormPrivateMemberForm dformId={dformId} initialValues={values} />
    </DFormMemberProvider>
  );
};
