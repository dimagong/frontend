import "./styles.scss";

import * as React from "react";

import { NpmButton } from "./../../../nmp-ui";

interface IProps {
  sectionNumber: number;
  sectionLimit: number;
  handleNextSection: () => any;
}

const MemberDFormNavigation = (props: IProps) => {
  const { sectionNumber, sectionLimit, handleNextSection } = props;
  const isLastSection: boolean = sectionNumber >= sectionLimit;
  return (
    <NpmButton style={{ padding: "0 7%" }} onClick={handleNextSection}>
      <span>{isLastSection ? "Submit for review" : "Next Section"}</span>
    </NpmButton>
  );
};

export default MemberDFormNavigation;
