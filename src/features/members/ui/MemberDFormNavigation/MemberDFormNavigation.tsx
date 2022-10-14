import "./styles.scss";

import * as React from "react";

import { NpmButton } from "features/nmp-ui";

interface IProps {
  sectionNumber: number;
  sectionLimit: number;
  handlePreviousSection: () => any;
  loading?: boolean | { delay?: number };
  disabled?: boolean;
}

const MemberDFormNavigation = (props: IProps) => {
  const { sectionNumber, sectionLimit, disabled, loading, handlePreviousSection } = props;

  const isLastSection: boolean = sectionNumber >= sectionLimit;

  return (
    <div className="member-dform-navigation">
      {sectionNumber > 0 ? (
        <NpmButton type="nmp-ghost" disabled={disabled} loading={loading} onClick={handlePreviousSection}>
          Back
        </NpmButton>
      ) : null}
      <NpmButton type="nmp-primary" disabled={disabled} loading={loading} htmlType="submit">
        {isLastSection ? "Submit for review" : "Next Section"}
      </NpmButton>
    </div>
  );
};

export default MemberDFormNavigation;
