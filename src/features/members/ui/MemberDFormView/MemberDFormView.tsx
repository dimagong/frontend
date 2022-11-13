import "./styles.scss";

import type { FC } from "react";
import React, { useEffect, useState } from "react";

import { DformId } from "features/dform/data/models";
import { DFormMemberForm } from "features/dform/ui/DFormMemberForm";

import { MemberSubmittedStatusView } from "../MemberSumittedStatusView";

type Props = {
  status: string;
  dformId: number;
  organization: string;
};

const MemberDFormView: FC<Props> = ({ status, dformId, organization }) => {
  const [showDForm, onShowDForm] = useState<boolean>(false);

  if (status === "approved") {
    return <MemberSubmittedStatusView organization={organization} isReviewed />;
  }

  if (status === "submitted" && showDForm === false) {
    return <MemberSubmittedStatusView organization={organization} onShowDForm={onShowDForm} />;
  }

  return (
    <div className="member-dform">
      <div className="member-dform__container">
        <DFormMemberForm dformId={dformId as unknown as DformId} />
      </div>
    </div>
  );
};

export default MemberDFormView;
