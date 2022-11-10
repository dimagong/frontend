import React, { FC, useRef, useState } from "react";

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

const MemberDFormView: FC<Props> = ({ status: initialStatus, dformId, organization, userFirstName }) => {
  // const actualUpdateRef = useRef(false);
  const [showDForm, onShowDForm] = useState<boolean>(false);
  const [status, setStatus] = useState(() => initialStatus);

  const onStatusChange = (status) => {
    setStatus(status);
    // actualUpdateRef.current = true;
  };

  if (status === "submitted" && showDForm === false) {
    return <MemberSubmittedStatusView organization={organization} onShowDForm={onShowDForm} />;
  }

  // if (status === "submitted" && actualUpdateRef.current === true) {
  //   // Change new Date to real submit date later
  //   actualUpdateRef.current = false;
  //   return <MemberThanksStatusView data={new Date()} organization={organization} surveyName={userFirstName} />;
  // }

  return <DFormMemberForm dformId={dformId as unknown as DformId} onStatusChange={onStatusChange} />;
};

export default MemberDFormView;
