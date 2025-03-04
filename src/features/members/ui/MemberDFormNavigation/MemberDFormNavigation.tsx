import "./styles.scss";

import React from "react";

import { NmpButton } from "features/nmp-ui";

interface IProps {
  sectionNumber: number;
  sectionLimit: number;
  handleNextSection: () => void;
  handlePreviousSection: () => void;
  loading?: boolean | { delay?: number };
  disabled?: boolean;
}

const MemberDFormNavigation = (props: IProps) => {
  const { sectionNumber, sectionLimit, disabled, loading, handleNextSection, handlePreviousSection } = props;

  const isLastSection: boolean = sectionNumber >= sectionLimit;

  return (
    <div className="member-dform-navigation">
      {sectionNumber > 0 ? (
        <NmpButton type="nmp-ghost" disabled={disabled} loading={loading} onClick={handlePreviousSection}>
          Back
        </NmpButton>
      ) : null}
      <NmpButton type="nmp-primary" disabled={disabled} loading={loading} onClick={handleNextSection}>
        {isLastSection ? "Submit for review" : "Next Section"}
      </NmpButton>
    </div>
  );
};

export default MemberDFormNavigation;
