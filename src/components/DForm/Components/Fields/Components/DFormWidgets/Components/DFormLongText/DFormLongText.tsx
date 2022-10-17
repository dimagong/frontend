import React from "react";
import type { FC } from "react";
import classnames from "classnames";

import { NmpLongText } from "features/nmp-ui";

import { DFormItem } from "../DFormItem";
import type { AbstractDFormFieldProps } from "../../types";

type Props = AbstractDFormFieldProps;

export const DFormLongText: FC<Props> = (props) => {
  const { label, isRequired, isDisabled, isLabelShowing, masterSchemaFieldId, style, className } = props;

  return (
    <DFormItem
      name={masterSchemaFieldId}
      label={label}
      isRequired={isRequired}
      isLabelShowing={isLabelShowing}
      style={style}
      className={classnames(className, "mb-0")}
    >
      <NmpLongText isDisabled={isDisabled} />
    </DFormItem>
  );
};
