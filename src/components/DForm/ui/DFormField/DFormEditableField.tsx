import React from "react";
import type { FC } from "react";

import { DFormBaseField, DFormBaseFieldProps } from "./DFormBaseField";

type Props = Omit<DFormBaseFieldProps, "id" | "onChange"> & {
  fieldId: string;
};

export const DFormEditableField: FC<Props> = (props) => {
  const { fieldId, ...fieldProps } = props;

  return <DFormBaseField id={fieldId} {...fieldProps} />;
};
