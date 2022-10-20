import React from "react";
import type { FC } from "react";
// import type { Validator } from "rc-field-form/lib/interface";

import { NmpInput } from "features/nmp-ui";

import { DFormItem } from "../DFormItem";
import type { AbstractDFormNumberLikeFieldProps } from "../../types";

type Props = AbstractDFormNumberLikeFieldProps;

export const DFormNumber: FC<Props> = (props) => {
  const { label, minimum, maximum, isRequired, isDisabled, isLabelShowing, masterSchemaFieldId, style, className } =
    props;

  const validator = async (_, value: unknown) => {
    const valueAsNumber = Number(value);

    if (Number.isNaN(valueAsNumber)) {
      return Promise.reject(`value must be numeric!`);
    }

    if (minimum !== undefined && maximum !== undefined) {
      return valueAsNumber >= minimum && valueAsNumber <= maximum
        ? Promise.resolve()
        : Promise.reject(`value must be between ${minimum} and ${maximum}!`);
    }
    if (minimum !== undefined) {
      valueAsNumber >= minimum ? Promise.resolve() : Promise.reject(`value must be at least ${minimum}!`);
    }
    if (maximum !== undefined) {
      valueAsNumber <= maximum ? Promise.resolve() : Promise.reject(`value cannot be longer than ${maximum}!`);
    }
  };

  return (
    <DFormItem
      name={masterSchemaFieldId}
      label={label}
      rules={[{ validator }]}
      isRequired={isRequired}
      isLabelShowing={isLabelShowing}
      style={style}
      className={className}
    >
      <NmpInput type="number" disabled={isDisabled} placeholder="Enter your answer here" />
    </DFormItem>
  );
};
