import React from "react";
import type { FC } from "react";

export type DFormHelpTextProps = {
  helpText?: string;
};

export const DFormHelpText: FC<DFormHelpTextProps> = ({ helpText }) => {
  return <div dangerouslySetInnerHTML={{ __html: helpText ?? "" }} />;
};
