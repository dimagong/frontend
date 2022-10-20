import { CSSProperties, ReactNode } from "react";

export interface AbstractDFormFieldProps {
  label?: ReactNode;
  isRequired?: boolean;
  isDisabled?: boolean;
  isLabelShowing?: boolean;
  masterSchemaFieldId: number;
  style?: CSSProperties;
  className?: string;
}

export interface AbstractDFormSelectFieldProps extends AbstractDFormFieldProps {
  options?: Array<string>;
}
