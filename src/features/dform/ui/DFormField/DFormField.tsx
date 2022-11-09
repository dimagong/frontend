import React from "react";
import type { FC } from "react";

import { DformFieldTypes } from "../../data/models";
import { DFormLabeled, DFormLabeledProps } from "../DFormLabeled";
import { DFormFieldRenderer, DFormFieldRendererProps } from "./DFormFieldRenderer";

export type DFormFieldProps = DFormFieldRendererProps & Omit<DFormLabeledProps, "children">;

export const DFormField: FC<DFormFieldProps> = (props) => {
  const { fieldType, isRequired, isLabelShowing, ...fieldsProps } = props;
  const { id, label, value, format, uiStyle, options, isDisabled, masterSchemaFieldId, onChange } = fieldsProps;

  return (
    <DFormLabeled
      id={fieldType === DformFieldTypes.Boolean ? undefined : id}
      label={label}
      isRequired={isRequired}
      isLabelShowing={isLabelShowing}
    >
      <DFormFieldRenderer
        id={id}
        label={label}
        value={value}
        format={format}
        options={options}
        uiStyle={uiStyle}
        fieldType={fieldType}
        isDisabled={isDisabled}
        masterSchemaFieldId={masterSchemaFieldId}
        onChange={onChange}
      />
    </DFormLabeled>
  );
};
