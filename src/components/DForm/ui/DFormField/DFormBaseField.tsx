import React from "react";
import type { CSSProperties, FC } from "react";

import { DFormLabeledItem } from "../DFormLabeledItem";
import { DFormFieldRenderer, DFormFieldRendererProps } from "./DFormFieldRenderer";

type Props = DFormFieldRendererProps & {
  label?: string;
  isRequired: boolean;
  isLabelShowing: boolean;
  style?: CSSProperties;
  className?: string;
};

export const DFormBaseField: FC<Props> = (props) => {
  const { isRequired, isLabelShowing, style, className, ...fieldProps } = props;

  return (
    <DFormLabeledItem
      label={fieldProps.label}
      isRequired={isRequired}
      isLabelShowing={isLabelShowing}
      style={style}
      className={className}
    >
      <DFormFieldRenderer {...fieldProps} />
    </DFormLabeledItem>
  );
};
