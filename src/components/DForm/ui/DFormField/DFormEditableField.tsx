import React from "react";
import type { FC } from "react";

import { DFormBaseField } from "./DFormBaseField";
import { DFormFieldRendererProps } from "./DFormFieldRenderer";

type Props = DFormFieldRendererProps & {
  label?: string;
  isRequired: boolean;
  isLabelShowing: boolean;
};

export const DFormEditableField: FC<Props> = (props) => {
  const { isRequired, isLabelShowing, ...fieldProps } = props;

  return (
    <DFormBaseField label={fieldProps.label} isRequired={isRequired} isLabelShowing={isLabelShowing} {...fieldProps} />
  );
};
