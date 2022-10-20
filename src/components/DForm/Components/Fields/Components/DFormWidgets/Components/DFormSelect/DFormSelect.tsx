import React from "react";
import type { FC } from "react";

import { NmpSelect } from "features/nmp-ui";

import { DFormItem } from "../DFormItem";
import type { AbstractDFormFieldProps } from "../../types";

const defaultPlaceholder = "Select an option";

type Props = AbstractDFormFieldProps & {
  options?: Array<string>;
};

export const DFormSelect: FC<Props> = (props) => {
  const { label, options = [], isRequired, isDisabled, isLabelShowing, masterSchemaFieldId, style, className } = props;

  return (
    <DFormItem
      name={masterSchemaFieldId}
      label={label}
      isRequired={isRequired}
      isLabelShowing={isLabelShowing}
      style={style}
      className={className}
    >
      <NmpSelect
        options={options.map((option) => ({ label: option, value: option }))}
        disabled={isDisabled}
        placeholder={defaultPlaceholder}
      />
    </DFormItem>
  );
};
