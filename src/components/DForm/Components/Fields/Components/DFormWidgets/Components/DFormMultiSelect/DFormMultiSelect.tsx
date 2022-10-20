import React from "react";
import type { FC } from "react";

import { MultiSelectUIStyles } from "features/Applications/constants";
import { NmpSelect, NmpCheckbox, NmpRow, NmpCol } from "features/nmp-ui";

import { DFormItem } from "../DFormItem";
import { DFormLabel } from "../DFormLabel";
import type { AbstractDFormSelectFieldProps } from "../../types";

const defaultPlaceholder = "Select an option";

type Props = AbstractDFormSelectFieldProps & { uiStyle: MultiSelectUIStyles };

export const DFormMultiSelect: FC<Props> = (props) => {
  const {
    label,
    options = [],
    uiStyle,
    isRequired,
    isDisabled,
    isLabelShowing,
    masterSchemaFieldId,
    style,
    className,
  } = props;

  if (uiStyle === MultiSelectUIStyles.Checkboxes) {
    return (
      <DFormItem
        name={masterSchemaFieldId}
        label={label}
        isRequired={isRequired}
        isLabelShowing={isLabelShowing}
        style={style}
        className={className}
      >
        <NmpCheckbox.Group disabled={isDisabled}>
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
      </DFormItem>
    );
  }

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
        mode="multiple"
        options={options.map((option) => ({ label: option, value: option }))}
        disabled={isDisabled}
        allowClear
        placeholder={defaultPlaceholder}
      />
    </DFormItem>
  );
};
