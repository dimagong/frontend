import React from "react";
import type { FC } from "react";

import { DFormBaseField } from "./DFormBaseField";
import { DFormFieldRendererProps } from "./DFormFieldRenderer";

type Props = DFormFieldRendererProps & {
  label?: string;
  fieldId?: string;
  isRequired: boolean;
  isLabelShowing: boolean;
};

export const DFormEditableField: FC<Props> = (props) => {
  const { fieldId, isRequired, isLabelShowing, ...fieldProps } = props;

  return (
    <DFormBaseField
      id={fieldId}
      label={fieldProps.label}
      isRequired={isRequired}
      isLabelShowing={isLabelShowing}
      {...fieldProps}
    />
  );
};
