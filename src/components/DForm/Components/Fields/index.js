import classnames from "classnames";
import React, { useState } from "react";

import { ElementTypes } from "components/DForm";
import { useDFormContext } from "components/DForm/DFormContext";
import { ButtonAddItem } from "components/DForm/ui/ButtonAddItem";
// import { DFormField } from "./DFormField";

import formComponents from "./Components/DFormWidgets";

const DFormElement = ({ classes, isSelected, onClick, children, onFieldCreate, groupId, fieldId }) => {
  const [selected, onSelected] = useState(false);
  const onMouseEnter = (e) => {
    onSelected(true);
  };
  const onMouseLeave = () => {
    onSelected(false);
  };

  const createField = () => {
    onFieldCreate(groupId, fieldId);
    onSelected(false);
  };
  return (
    <div onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} className="w-100 mb-3">
      <div
        onClick={onClick}
        className={classnames("d-flex editable w-100", classes || "col-12", { selected: isSelected })}
      >
        {children}
      </div>
      {selected && <ButtonAddItem className="element-add mt-1" onClick={createField} label={"Add new form element"} />}
    </div>
  );
};

const FormComponent = (props) => {
  const {
    data,
    groupId,
    isDisabled: propIsDisabled,
    groupFields,
    selectedElement,
    onElementClick: propOnElementClick,
    onFieldCreate,
  } = props;

  const { isAccessible, isConfigurable } = useDFormContext();

  return (
    <>
      {groupFields.map((fieldId) => {
        const field = data.fields[fieldId];

        // DCR controls a field rendering
        if (field.isHidden) return null;

        const FormFieldElement = formComponents[field.type];

        if (!FormFieldElement) {
          throw new Error(`There is no dform field with type: ${field.type}.`);
        }

        // An DForm template can be selected, it should be refactored, cause FormField should not know
        // anything about DForm creating process.
        const isSelected = selectedElement?.elementType === ElementTypes.Field && selectedElement?.id === field.id;

        // An DForm's fields can be disabled by DForm AccessType. Currently, only user-lock is used.
        const isDisabled = !isAccessible || propIsDisabled || field.isDisabled;

        const onElementClick = () => {
          if (!propOnElementClick || !isConfigurable) return;

          propOnElementClick({ ...field, groupId }, "field");
        };

        const label = field.title;

        return (
          <DFormElement
            classes={field.classes}
            isSelected={isSelected}
            onClick={onElementClick}
            key={fieldId}
            fieldId={fieldId}
            onFieldCreate={onFieldCreate}
            groupId={groupId}
          >
            <FormFieldElement
              id={field.id}
              label={label}
              format={field.format ? field.format : undefined}
              options={field.options ? field.options : undefined}
              uiStyle={field.uiStyle ? field.uiStyle : undefined}
              helpText={field.helpTextValue ? field.helpTextValue : undefined}
              minimum={field.minimum ? Number(field.minimum) : undefined}
              maximum={field.maximum ? Number(field.maximum) : undefined}
              minLength={field.minLength ? Number(field.minLength) : undefined}
              maxLength={field.maxLength ? Number(field.maxLength) : undefined}
              isDisabled={isDisabled}
              isRequired={field.isRequired}
              isLabelShowing={field.isLabelShowing}
              masterSchemaFieldId={Number(field.masterSchemaFieldId)}
            />
          </DFormElement>
        );
      })}

      {!groupFields || !groupFields.length ? (
        <div className="px-2 py-5 text-center w-100">There are no fields in this group</div>
      ) : null}
    </>
  );
};

export default FormComponent;
