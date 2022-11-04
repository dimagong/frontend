import "./styles.scss";

import React from "react";
import type { FC } from "react";

export type DFormHelpTextProps = {
  helpText?: string;
};

export const DFormHelpText: FC<DFormHelpTextProps> = ({ helpText }) => {
  return (
    <div className="dform-help-text">
      <div className="dform-help-text__content" dangerouslySetInnerHTML={{ __html: helpText ?? "" }} />
    </div>
  );
};
