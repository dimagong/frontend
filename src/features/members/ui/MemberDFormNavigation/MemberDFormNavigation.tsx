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
    <NpmButton disabled={disabled} loading={loading} style={{ padding: "0 7%" }} onClick={handleNextSection}>
      <span>{isLastSection ? "Submit for review" : "Next Section"}</span>
    </NpmButton>
  );
};

export default MemberDFormNavigation;
