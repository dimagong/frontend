import React from "react";
import classnames from "classnames";

import formComponents from "./Components/DFormWidgets";

const DFormElement = ({ isSelected, onClick, children }) => {
  return (
    <div onClick={onClick} className={classnames("d-flex editable mb-3 w-100 col-12", { selected: isSelected })}>
      {children}
    </div>
  );
};

export const DFormField = (props) => {
  const { formField, isSelected, field, onElementClick, label, value, options, isDisabled, onChange } = props;

  const FormFieldElement = formComponents[field.type];

  if (!FormFieldElement) {
    throw new Error(`There is no dform field with type: ${field.type}.`);
  }

  return (
    <DFormElement isSelected={isSelected} onClick={onElementClick} key={formField}>
      <FormFieldElement
        id={field.id}
        error={""}
        label={label}
        value={value}
        options={options}
        format={field.format}
        uiStyle={field.uiStyle}
        isError={false}
        isDisabled={isDisabled}
        isRequired={field.isRequired}
        isLabelShowing={field.isLabelShowing}
        masterSchemaFieldId={Number(field.masterSchemaFieldId)}
        onChange={onChange}
        key={field.id}
      />
    </DFormElement>
  );
};
