import "./styles.scss";

import * as React from "react";

import { NpmButton } from "features/nmp-ui";

interface IProps {
  sectionNumber: number;
  sectionLimit: number;
  handleNextSection: () => any;
  handlePreviousSection: () => any;
  loading?: boolean | { delay?: number };
  disabled?: boolean;
}

const MemberDFormNavigation = (props: IProps) => {
  const { sectionNumber, sectionLimit, disabled, loading, handleNextSection, handlePreviousSection } = props;

  const isLastSection: boolean = sectionNumber >= sectionLimit;

  return (
    <div className="member-dform-navigation">
      {sectionNumber > 0 ? (
        <NpmButton type="nmp-ghost" disabled={disabled} loading={loading} onClick={handlePreviousSection}>
          Back
        </NpmButton>
      ) : null}
      <NpmButton
        type="nmp-primary"
        disabled={disabled}
        loading={loading}
        onClick={isLastSection ? undefined : handleNextSection}
        htmlType={isLastSection ? "submit" : "button"}
      >
        {isLastSection ? "Submit for review" : "Next Section"}
      </NpmButton>
    </div>
  );
};

export default MemberDFormNavigation;
