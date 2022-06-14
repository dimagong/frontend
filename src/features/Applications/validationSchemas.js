import * as yup from "yup";
import { ELEMENT_TYPES, FIELD_TYPES } from "./constants";

const fieldTypesArray = Object.values(FIELD_TYPES);

export const groupValidationSchema = yup.object().shape({
  name: yup
    .string()
    .required("Each group should have a name")
    .test(
      "unique-group-name",
      "Name should be unique", // error message
      function test(value) {
        const groupNames = Object.values(this.options.context.application.groups).map((group) => group.name);
        return groupNames.filter((name) => name.toLowerCase() === value.toLowerCase()).length === 1;
      }
    ),
  id: yup.string().required(),
  isProtected: yup.boolean(),
  relatedFields: yup.array(),
});

export const fieldValidationSchema = yup.object().shape({
  id: yup.string().required(),
  isMasterSchemaRelated: yup.boolean(),
  type: yup.string().oneOf(fieldTypesArray),
  title: yup.string().required(),
  isRequired: yup.boolean(),
  classes: yup.string(),
  isLabelShowing: yup.boolean(),
});

export const sectionValidationSchema = yup.object().shape({
  id: yup.string().required(),
  name: yup
    .string()
    .required("Each section should have a name")
    .test(
      "unique-section-name",
      "Name should be unique", // error message
      function test(value) {
        const sectionsNames = Object.values(this.options.context.application.sections).map((section) => section.name);
        return sectionsNames.filter((name) => name.toLowerCase() === value.toLowerCase()).length === 1;
      }
    ),
  isProtected: yup.boolean(),
  isDisabled: yup.boolean(),
  isHidden: yup.boolean(),
  isAlreadyViewed: yup.boolean(),
  relatedGroups: yup.array(),
  // conditions
});

export const elementValidationSchemas = {
  [ELEMENT_TYPES.field]: fieldValidationSchema,
  [ELEMENT_TYPES.group]: groupValidationSchema,
  [ELEMENT_TYPES.section]: sectionValidationSchema,
};

export const MSPropertyValidationSchema = yup
  .string()
  .required("Master schema property should not be empty")
  .test(
    "ms-property-validation",
    "Master schema property should not be duplicated", // error message
    function test(value) {
      // NOTE: this must not be an arrow function, because yup binds it to it's "this"
      return !this.options.context.masterSchemaUsedPropertiesList.includes(value);
    }
  );
