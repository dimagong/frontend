import * as yup from "yup";
import { ELEMENT_TYPES, FIELD_TYPES } from "./constants";

const fieldTypesArray = Object.values(FIELD_TYPES);

export const groupValidationSchema = yup.object().shape({
  name: yup.string().required("Each group should have a name"),
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
  name: yup.string().required("Each section should have a name"),
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
