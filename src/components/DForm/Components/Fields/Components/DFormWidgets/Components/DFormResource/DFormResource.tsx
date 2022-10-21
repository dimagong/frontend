import React from "react";
import type { FC } from "react";

import { DFormItem } from "../DFormItem";
import type { AbstractDFormFieldProps } from "../../types";

import { DFormResourceItem } from "./DFormResourceItem";

type Props = AbstractDFormFieldProps;

export const DFormResource: FC<Props> = (props) => {
  const { label, isRequired, isDisabled, isLabelShowing, masterSchemaFieldId, style, className } = props;

  return (
    <DFormItem
      name={masterSchemaFieldId}
      label={label}
      isRequired={isRequired}
      isLabelShowing={isLabelShowing}
      style={style}
      className={className}
    >
      <DFormResourceItem isDisabled={isDisabled} masterSchemaFieldId={masterSchemaFieldId} />
    </DFormItem>
  );
};
