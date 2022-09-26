import React, { FC, useState } from "react";

import { useDFormQuery, useDFormValuesQuery } from "api/Onboarding/prospectUserQuery";

import { MemberDForm } from "../MemberDForm";
import { MemberSubmittedStatusView } from "../MemberSumittedStatusView";

type Props = {
  dformId: number;
  status: string;
  organization: string;
};

const MemberDFormView: FC<Props> = ({ dformId, status, organization }) => {
  const [showDForm, onShowDForm] = useState<boolean>(false);

  // Queries
  const dformQuery = useDFormQuery({ dformId }, { refetchOnWindowFocus: false, keepPreviousData: true });
  const valuesQuery = useDFormValuesQuery({ dformId }, { refetchOnWindowFocus: false });

  if (dformQuery.isError) {
    return <div className="onboarding-survey_loading">Something was wrong ....</div>;
  }

  if (dformQuery.isLoading || valuesQuery.isLoading) {
    return <div className="onboarding-survey_loading">Loading</div>;
  }

  const { data: dform } = dformQuery;
  const { data: values } = valuesQuery;
  const { name, schema, access_type } = dform;
  const sections = schema.sectionsOrder.map((id) => schema.sections[id]);

  if (status === "submitted" && showDForm === false) {
    return <MemberSubmittedStatusView organization={organization} onShowDForm={onShowDForm} />;
  }

  return (
    <MemberDForm
      id={dformId}
      name={name}
      values={values}
      schema={schema}
      sections={sections}
      accessType={access_type}
    />
  );
};

export default MemberDFormView;
