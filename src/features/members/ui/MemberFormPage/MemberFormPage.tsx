import "./styles.scss";

import type { FC } from "react";
import { useQuery } from "react-query";
import React, { useState } from "react";
import { useParams } from "react-router-dom";

import { NmpCol, NmpRow, NpmSpin } from "features/nmp-ui";
import type { DformId } from "features/dform/data/models";
import { DFormMemberForm } from "features/dform/ui/DFormMemberForm";
import { useMVADFormsQuery } from "api/Onboarding/prospectUserQuery";
import { useProfileQuery } from "features/user/queries/useProfileQuery";
import { MemberDFormService } from "features/dform/data/services/memberDformService";

import { MemberSubmittedStatusView } from "../MemberSumittedStatusView";

export const MemberFormPage: FC = () => {
  const { formId } = useParams<{ formId: string }>();

  const profileQuery = useProfileQuery();
  const profile = profileQuery.data!;

  const dformQuery = useQuery({
    queryFn: () => MemberDFormService.instance.getDform({ dformId: formId as DformId }),
    queryKey: MemberDFormService.queryKeys.byId(formId),
    refetchOnWindowFocus: false,
  });
  const { data: dforms } = useMVADFormsQuery();

  const [showDForm, onShowDForm] = useState<boolean>(false);

  if (dformQuery.isError) {
    const status = (dformQuery.error as any)?.status ?? 0;

    return (
      <NmpRow justify="center" style={{ padding: "2rem 0" }}>
        <NmpCol>
          <h2>{status === 404 ? `There is no form with id "${formId}".` : "Something went wrong."}</h2>
        </NmpCol>
      </NmpRow>
    );
  }

  if (!dformQuery.data) {
    return <NpmSpin size={60} />;
  }

  const { status } = (dforms as any[]).find(({ id }) => Number(id) === Number(formId));

  if (status === "approved") {
    return <MemberSubmittedStatusView organization={profile.permissions.organization} isReviewed />;
  }

  if (status === "submitted" && showDForm === false) {
    return <MemberSubmittedStatusView organization={profile.permissions.organization} onShowDForm={onShowDForm} />;
  }

  const { dform, values } = dformQuery.data;

  return (
    <div className="member-dform">
      <div className="member-dform__container">
        <DFormMemberForm dform={dform} values={values} dformId={formId as DformId} />
      </div>
    </div>
  );
};
