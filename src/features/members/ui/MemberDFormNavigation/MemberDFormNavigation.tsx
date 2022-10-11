import "./styles.scss";

import * as React from "react";

import { NmpButton } from "features/nmp-ui";

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
        <NmpButton type="nmp-ghost" disabled={disabled} loading={loading} onClick={handlePreviousSection}>
          Back
        </NmpButton>
      ) : null}
      <NmpButton
        type="nmp-primary"
        disabled={disabled}
        loading={loading}
        onClick={isLastSection ? undefined : handleNextSection}
        // onClick={handleNextSection}
        htmlType={isLastSection ? "submit" : "button"}
      >
        {isLastSection ? "Submit for review" : "Next Section"}
      </NmpButton>
    </div>
  );
};

export default MemberDFormNavigation;
