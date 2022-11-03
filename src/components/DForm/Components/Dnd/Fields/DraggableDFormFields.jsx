import React from "react";

import { DFormElementTypes, DFormFieldTypes } from "components/DForm";
import { useDFormContext } from "components/DForm/DFormContext";

import formComponents from "../../Fields/Components/DFormWidgets";
import { DFormDraggableElement } from "../DFormDraggableElement";
import { DFormField } from "../../Fields/DFormField";

export const DraggableDFormFields = (props) => {
  const {
    data,
    groupId,
    isDisabled: propIsDisabled,
    groupFields,
    selectedElement,
    onElementClick: propOnElementClick,
  } = props;
  // ToDo: Remove values later
  const values = {};
  const onFieldChange = () => {};

  const { isAccessible, isConfigurable } = useDFormContext();

  return (
    <>
      {groupFields.map((formField, index) => {
        const field = data.fields[formField];

        // DCR controls a field rendering
        if (field.isHidden) return null;

        const FormFieldElement = formComponents[field.type];

        if (!FormFieldElement) {
          throw new Error(`There is no dform field with type: ${field.type}.`);
        }

        // An DForm template can be selected, it should be refactored, cause FormField should not know
        // anything about DForm creating process.
        const isSelected = selectedElement?.elementType === DFormElementTypes.Field && selectedElement?.id === field.id;

        // An DForm's fields can be disabled by DForm AccessType. Currently, only user-lock is used.
        const isDisabled = !isAccessible || propIsDisabled || field.isDisabled;

        // Getting a field value depending on its type and is it master schema element or not.
        // It can be refactored later, for example, a DForm can have a construction block that is not always like form
        // elements, and that construction block may have implementation as form elements or any kind of render.
        let value;
        if (isConfigurable) {
          switch (field.type) {
            case DFormFieldTypes.Text:
            case DFormFieldTypes.Date:
            case DFormFieldTypes.Number:
            case DFormFieldTypes.TextArea:
            case DFormFieldTypes.LongText:
              value = "";
              break;
            case DFormFieldTypes.Boolean:
              value = false;
              break;
            case DFormFieldTypes.MultiSelect:
              value = [];
              break;
            // Set example fake file to show how it looks like
            case DFormFieldTypes.File:
            case DFormFieldTypes.FileList:
            case DformFieldTypes.Resource:
              value = Array.from({ length: DformFieldTypes.FileList === field.type ? 2 : 1 }).fill({
                name: "Example.file",
              });
              break;
            case DformFieldTypes.HelpText:
              value = field.helpTextValue ?? "";
              break;
            // For rest fields set null value
            default:
              value = null;
          }
        } else {
          const fieldValue = values[field.masterSchemaFieldId];
          switch (field.type) {
            case DformFieldTypes.Text:
            case DformFieldTypes.Date:
            case DformFieldTypes.Number:
            case DformFieldTypes.TextArea:
            case DformFieldTypes.LongText:
              value = fieldValue?.value ?? "";
              break;
            case DformFieldTypes.Boolean:
              value = fieldValue?.value ?? false;
              break;
            case DformFieldTypes.Select:
              value = fieldValue?.value ? { value: fieldValue.value, label: fieldValue.value } : null;
              break;
            case DformFieldTypes.MultiSelect:
              value = fieldValue?.value ? fieldValue.value.map((value) => ({ label: value, value })) : [];
              break;
            // Get files from response instead value in case when field type is file/fileList
            case DformFieldTypes.File:
            case DformFieldTypes.FileList:
            case DformFieldTypes.Resource:
              value = fieldValue?.files ?? [];
              break;
            case DformFieldTypes.HelpText:
              value = field.helpTextValue;
              break;
            // In other case, use value
            default:
              value = fieldValue?.value;
          }
        }

        const onElementClick = () => {
          if (!propOnElementClick) return;

          propOnElementClick({ ...field, groupId }, "field");
        };

        const onChange = (value) => {
          // Do not call on change while dform is configurable
          if (isConfigurable) {
            return;
          }

          switch (field.type) {
            case DformFieldTypes.MultiSelect:
              onFieldChange(field, Array.isArray(value) ? value.map(({ value }) => value) : []);
              break;
            // Extract value from option for field select
            case DformFieldTypes.Select:
              onFieldChange(field, value.value);
              break;
            default:
              onFieldChange(field, value);
          }
        };

        // Used for select and multiselect field types
        const options = field.options ? field.options.map((option) => ({ label: option, value: option })) : null;

        const label = field.title;

        return (
          <DFormDraggableElement
            key={formField}
            draggableId={formField}
            index={index}
            classname={field.classes}
            dragIconClasses={"dform-dnd__drag-handle-icon dform-dnd__drag-handle-icon--field"}
          >
            <DFormField
              formField={formField}
              isSelected={isSelected}
              field={field}
              onElementClick={onElementClick}
              label={label}
              value={value}
              options={options}
              isDisabled={isDisabled}
              onChange={onChange}
            />
          </DFormDraggableElement>
        );
      })}

      {!groupFields || !groupFields.length ? (
        <div className="px-2 py-5 text-center w-100">There are no fields in this group</div>
      ) : null}
    </>
  );
};
