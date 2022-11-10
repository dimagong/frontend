import React, { FC, useState } from "react";

import { DformId } from "features/dform/data/models";
import { DFormMemberForm } from "features/dform/ui/DFormMemberForm";

import MemberThanksStatusView from "../MemberThanksStatusView";
import { MemberSubmittedStatusView } from "../MemberSumittedStatusView";

type Props = {
  status: string;
  dformId: number;
  organization: string;
  userFirstName: string;
};

const MemberDFormView: FC<Props> = ({ status, dformId, organization, userFirstName }) => {
  const [showDForm, onShowDForm] = useState<boolean>(false);

  if (status === "submitted") {
    // Change new Date to real submit date later
    return <MemberThanksStatusView data={new Date()} organization={organization} surveyName={userFirstName} />;
  }

  if (status === "submitted" && showDForm === false) {
    return <MemberSubmittedStatusView organization={organization} onShowDForm={onShowDForm} />;
  }

  return <DFormMemberForm dformId={dformId as unknown as DformId} />;
};

export default MemberDFormView;
