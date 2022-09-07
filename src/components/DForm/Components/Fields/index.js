import React from "react";
import classnames from "classnames";
import { Plus } from "react-feather";

import { ELEMENT_TYPES, FieldTypes } from "components/DForm/constants";

import formComponents from "./Components/DFormWidgets";

const DFormElement = ({ classes, isSelected, onClick, children }) => {
  return (
    <div
      onClick={onClick}
      className={classnames("editable px-0 custom-form-field", classes || "col-12", { selected: isSelected })}
    >
      {children}
    </div>
  );
};

const FormComponent = (props) => {
  const {
    data,
    values,
    group,
    groupFields,
    isConfigurable,
    selectedElement,
    onElementClick: propOnElementClick,
    onFieldChange,
    onFieldCreate,
  } = props;

  return (
    <>
      {groupFields.map((formField) => {
        const field = data.fields[formField];

        // DCR controls a field rendering
        if (field.isHidden) return null;

        // Temporary checks, whether API contains field with disabled and do we need a DB migration.
        if (Object.hasOwnProperty.call(field, "disabled")) {
          throw new Error(`The field: ${field.type} ${field.title} has disabled property.`);
        }
        // Temporary checks, whether API contains field with disabled and do we need a DB migration.
        if (Object.hasOwnProperty.call(field, "multiple")) {
          throw new Error(`The field: ${field.type} ${field.title} has multiple property.`);
        }

        const FormFieldElement = formComponents[field.type];

        if (!FormFieldElement) {
          throw new Error(`There is no dform field with type: ${field.type}.`);
        }

        // An DForm template can be selected, it should be refactored, cause FormField should not know
        // anything about DForm creating process.
        const isSelected = selectedElement?.elementType === ELEMENT_TYPES.field && selectedElement?.id === field.id;

        // Getting a field value depending on its type and is it master schema element or not.
        // It can be refactored later, for example, a DForm can have a construction block that is not always like form
        // elements, and that construction block may have implementation as form elements or any kind of render.
        let value;
        if (isConfigurable) {
          switch (field.type) {
            case FieldTypes.Text:
            case FieldTypes.Date:
            case FieldTypes.Number:
            case FieldTypes.TextArea:
            case FieldTypes.LongText:
              value = "";
              break;
            case FieldTypes.Boolean:
              value = false;
              break;
            case FieldTypes.MultiSelect:
              value = [];
              break;
            // Set example fake file to show how it looks like
            case FieldTypes.File:
            case FieldTypes.FileList:
            case FieldTypes.Resource:
              value = Array.from({ length: FieldTypes.FileList === field.type ? 2 : 1 }).fill({ name: "Example.file" });
              break;
            case FieldTypes.HelpText:
              value = field.helpTextValue ?? "";
              break;
            // For rest fields set null value
            default:
              value = null;
          }
        } else {
          const fieldValue = values[field.masterSchemaFieldId];
          switch (field.type) {
            case FieldTypes.Text:
            case FieldTypes.Date:
            case FieldTypes.Number:
            case FieldTypes.TextArea:
            case FieldTypes.LongText:
              value = fieldValue.value ?? "";
              break;
            case FieldTypes.Boolean:
              value = fieldValue.value ?? false;
              break;
            case FieldTypes.Select:
              value = fieldValue.value ? { value: fieldValue.value, label: fieldValue.value } : null;
              break;
            case FieldTypes.MultiSelect:
              value = fieldValue.value ? fieldValue.value.map((value) => ({ label: value, value })) : [];
              break;
            // Get files from response instead value in case when field type is file/fileList
            case FieldTypes.File:
            case FieldTypes.FileList:
            case FieldTypes.Resource:
              value = fieldValue.files ?? [];
              break;
            case FieldTypes.HelpText:
              value = field.helpTextValue;
              break;
            // In other case, use value
            default:
              value = fieldValue.value;
          }
        }

        const onElementClick = () => propOnElementClick({ ...field, groupId: group }, "field");

        const onChange = (value) => {
          // Do not call on change while dform is configurable
          if (isConfigurable) {
            return;
          }

          switch (field.type) {
            case FieldTypes.MultiSelect:
              onFieldChange(field, Array.isArray(value) ? value.map(({ value }) => value) : []);
              break;
            // Extract value from option for field select
            case FieldTypes.Select:
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
          <DFormElement classes={field.classes} isSelected={isSelected} onClick={onElementClick} key={formField}>
            <FormFieldElement
              id={field.id}
              error={""}
              label={label}
              value={value}
              options={options}
              format={field.format}
              uiStyle={field.uiStyle}
              isError={false}
              isDisabled={field.isDisabled}
              isRequired={field.isRequired}
              isLabelShowing={field.isLabelShowing}
              masterSchemaFieldId={field.masterSchemaFieldId}
              onChange={onChange}
              key={field.id}
            />
          </DFormElement>
        );
      })}

      {!groupFields || !groupFields.length ? (
        <div className="px-2 py-5 text-center w-100">There are no fields in this group</div>
      ) : null}

      {isConfigurable ? (
        <div className="custom-form-field col-12 px-0">
          <div className="element-add" onClick={() => onFieldCreate(group)}>
            <div className="element-add_icon">
              <Plus color="white" size={23} />
            </div>
            <div className="element-add_description">Add new form element</div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default FormComponent;
