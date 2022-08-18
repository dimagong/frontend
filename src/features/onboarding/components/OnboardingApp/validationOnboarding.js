import * as yup from "yup";
import { FIELD_TYPES } from "./../../../Applications/constants";

const { object, number, createError } = yup;

const numberSchema = object({
  value: number("Only digets are allowed for this field ")
    .integer("Value should be an integer")
    .positive("Value should be bigger then 0"),
});
const textSchema = object({
  value: yup
    .string()
    .required("The field is required")
    .matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed for this field "),
});
const emailSchema = object({
  value: yup.string().email("Invalid email format").required("Required"),
});

const booleanSchema = object({
  value: yup.boolean(),
});

const dateSchema = object({
  value: yup.date().default(() => new Date()),
});

// const textElementSchema = object({}).concat(textSchema);

export const fieldValidationSchemas = {
  [FIELD_TYPES.text]: textSchema,
  [FIELD_TYPES.date]: dateSchema,
  //[FIELD_TYPES.file]: fieldCommonSchema,
  //[FIELD_TYPES.select]: fieldCommonSchema,
  [FIELD_TYPES.number]: numberSchema,
  [FIELD_TYPES.boolean]: booleanSchema,
  [FIELD_TYPES.longText]: textSchema,
  [FIELD_TYPES.textArea]: textSchema,
  //[FIELD_TYPES.fileList]: fieldCommonSchema,
  //[FIELD_TYPES.resource]: fieldCommonSchema,
  [FIELD_TYPES.helpText]: textSchema,
  //[FIELD_TYPES.multiSelect]: fieldCommonSchema,
  email: emailSchema,
  //conditions: fieldCommonSchema,
};
