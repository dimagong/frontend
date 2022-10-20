import React from "react";
import type { FC } from "react";

type Props = { helpText?: string };

export const DFormHelpText: FC<Props> = ({ helpText }) => {
  return <div dangerouslySetInnerHTML={{ __html: helpText ?? "" }} />;
};
