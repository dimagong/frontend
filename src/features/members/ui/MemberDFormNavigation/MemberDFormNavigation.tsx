import "./styles.scss";

import * as React from "react";

import { NpmButton } from "features/nmp-ui";

interface IProps {
  sectionNumber: number;
  sectionLimit: number;
  handleNextSection: () => any;
  loading?: boolean | { delay?: number };
  disabled?: boolean;
}

const MemberDFormNavigation = (props: IProps) => {
  const { sectionNumber, sectionLimit, disabled, loading, handleNextSection } = props;

  const isLastSection: boolean = sectionNumber >= sectionLimit;

  return (
    <NpmButton type="nmp-primary" disabled={disabled} loading={loading} onClick={handleNextSection}>
      {isLastSection ? "Submit for review" : "Next Section"}
    </NpmButton>
  );
};

export default MemberDFormNavigation;
