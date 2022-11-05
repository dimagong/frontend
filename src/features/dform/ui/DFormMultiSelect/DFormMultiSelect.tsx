import React from "react";
import type { FC } from "react";

import { DFormMultiSelectUIStyles } from "../../types";
import { NmpSelect, NmpCheckbox, NmpRow, NmpCol } from "features/nmp-ui";

import { DFormLabel } from "../DFormLabel";

export type DFormMultiSelectProps = {
  id?: string;
  value?: Array<string>;
  options?: Array<string>;
  uiStyle?: DFormMultiSelectUIStyles;
  isDisabled?: boolean;
  onChange?: (value: Array<string>) => void;
};

export const DFormMultiSelect: FC<DFormMultiSelectProps> = (props) => {
  const { id, value, options = [], uiStyle, isDisabled, onChange } = props;

  if (uiStyle === DFormMultiSelectUIStyles.Checkboxes) {
    return (
      <NmpCheckbox.Group value={value} disabled={isDisabled} onChange={onChange}>
        {options.map((option, index) => (
          <NmpRow key={`${option}${index}`}>
            <NmpCol>
              <NmpCheckbox value={option}>
                <DFormLabel label={option} isSmall />
              </NmpCheckbox>
            </NmpCol>
          </NmpRow>
        ))}
      </NmpCheckbox.Group>
    );
  }

  return (
    <NmpSelect
      id={id}
      value={value}
      mode="multiple"
      options={options.map((option) => ({ label: option, value: option }))}
      disabled={isDisabled}
      allowClear
      placeholder="Select an option"
      onChange={onChange}
    />
  );
};
