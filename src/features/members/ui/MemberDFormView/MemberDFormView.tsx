import React, { FC, useState } from "react";

import { useDFormQuery, useDFormValuesQuery } from "api/Onboarding/prospectUserQuery";

import { MemberDForm } from "../MemberDForm";
import { MemberSubmittedStatusView } from "../MemberSumittedStatusView";
import { normalizeValues } from "../../../../components/DForm/data/normalizeValues";

type Props = {
  dformId: number;
  status: string;
  organization: string;
};

const MemberDFormView: FC<Props> = ({ dformId, status, organization }) => {
  const [showDForm, onShowDForm] = useState<boolean>(false);

  // Queries
  const dformQuery = useDFormQuery({ dformId });
  const valuesQuery = useDFormValuesQuery({ dformId });

  if (dformQuery.isError) {
    return <div className="onboarding-survey_loading">Something was wrong ....</div>;
  }

  if ((dformQuery.isLoading && !dformQuery.data) || (valuesQuery.isLoading && !valuesQuery.data)) {
    return <div className="onboarding-survey_loading">Loading</div>;
  }

  const { data: dform } = dformQuery;
  const { data: values } = valuesQuery;
  const { name, schema, access_type } = dform;
  const sections = schema.sectionsOrder.map((id) => schema.sections[id]);
  const initialValues = normalizeValues(values, schema);

  if (status === "submitted" && showDForm === false) {
    return <MemberSubmittedStatusView organization={organization} onShowDForm={onShowDForm} />;
  }

  return (
    <MemberDForm
      id={dformId}
      name={name}
      sections={sections}
      accessType={access_type}
      initialSchema={schema}
      initialValues={initialValues}
    />
  );
};

export default MemberDFormView;
