import { CSSProperties, ReactNode } from "react";

export type AbstractDFormFieldProps = {
  label?: ReactNode;
  isRequired?: boolean;
  isDisabled?: boolean;
  isLabelShowing?: boolean;
  masterSchemaFieldId: number;
  style?: CSSProperties;
  className?: string;
};
