import React from "react";
import type { CSSProperties, FC } from "react";

import { DFormLabeledItem } from "../DFormLabeledItem";
import { DFormFieldRenderer, DFormFieldRendererProps } from "./DFormFieldRenderer";

type Props = DFormFieldRendererProps & {
  id?: string;
  label?: string;
  isRequired: boolean;
  isLabelShowing: boolean;
  masterSchemaFieldId?: number;
  style?: CSSProperties;
  className?: string;
};

export const DFormBaseField: FC<Props> = (props) => {
  const { id, isRequired, isLabelShowing, style, className, ...fieldProps } = props;

  return (
    <DFormLabeledItem
      id={id}
      label={fieldProps.label}
      isRequired={isRequired}
      isLabelShowing={isLabelShowing}
      style={style}
      className={className}
    >
      <DFormFieldRenderer id={id} {...fieldProps} />
    </DFormLabeledItem>
  );
};
