import * as yup from "yup";

import { ELEMENT_TYPES, FIELD_TYPES } from "components/DForm/constants";

import { DATE_WIDGET_FORMATS } from "./constants";

const { object, string, number } = yup;

const fieldTypesArray = Object.values(FIELD_TYPES);

// ToDo: handle it
const dynamicRenderValidation = object({});

const minMaxLengthSchema = object({
  minLength: number("Min length should be a number")
    .nullable()
    .integer("Min length should be an integer")
    .positive("Min length should be bigger then 0")
    .when("maxLength", (maxLength, schema) => {
      return schema.test({
        test: (minLength) => {
          if (!maxLength) return true;
          return minLength < maxLength;
        },
        message: "Min length should be smaller then max length",
      });
    }),
  maxLength: number("Max length should be a number")
    .nullable()
    .integer("Max length should be an integer")
    .positive("Max length should be bigger then 0"),
});

const minimumMaximumSchema = object({
  minimum: number("Minimum should be a number")
    .nullable()
    .integer("Minimum should be an integer")
    .positive("Minimum should be bigger then 0")
    .when("maximum", (maximum, schema) => {
      return schema.test({
        test: (minimum) => {
          if (!maximum) return true;
          return minimum < maximum;
        },
        message: "Minimum should be smaller then maximum",
      });
    }),
  maximum: number("Maximum should be a number")
    .nullable()
    .integer("Maximum should be an integer")
    .positive("Maximum should be bigger then 0"),
});

export const fieldCommonSchema = yup.object().shape({
  id: yup.string().required(),
  type: yup.string().oneOf(fieldTypesArray),
  title: yup.string().required(),
  isRequired: yup.boolean(),
  classes: yup.string(),
  isLabelShowing: yup.boolean(),
  conditions: yup.array().test("conditions-fields", "Condition fields must be filled", function test(value) {
    if (value == null) {
      // ToDo remove it and migrate all dforms to condition prop requeired as empty array
      console.warn("Migrate all dform templates to new conditions field validation. For now this is warning.");
      return true;
    }
    if (value.length === 0) {
      return true;
    } else {
      if (!value[0]?.effect) {
        return this.createError({
          message: "The 'This element will be' field is empty",
        });
      }
      if (value[0]?.field && !value[0]?.condition?.operandName) {
        return this.createError({
          message: "The 'Will be' field is empty",
        });
      }
      if (value[0]?.field && value[0]?.condition?.operandName === "filled") {
        return true;
      }
      if (value[0]?.condition?.operandName === "equal" && !value[0].expectedValue) {
        return this.createError({
          message: "The 'To' field is empty",
        });
      }
    }
    return true;
  }),
});

const textElementSchema = object({}).concat(minMaxLengthSchema);

const numberElementSchema = object({}).concat(minimumMaximumSchema);

const textareaElementSchema = object({}).concat(minMaxLengthSchema);

const longTextElementSchema = object({}).concat(minMaxLengthSchema);

const dateElementSchema = object({
  format: string().oneOf(DATE_WIDGET_FORMATS),
});

const fieldSpecificValidationSchemas = {
  [FIELD_TYPES.text]: fieldCommonSchema.concat(textElementSchema),
  [FIELD_TYPES.date]: fieldCommonSchema.concat(dateElementSchema),
  [FIELD_TYPES.file]: fieldCommonSchema,
  [FIELD_TYPES.select]: fieldCommonSchema,
  [FIELD_TYPES.number]: fieldCommonSchema.concat(numberElementSchema),
  [FIELD_TYPES.boolean]: fieldCommonSchema,
  [FIELD_TYPES.longText]: fieldCommonSchema.concat(longTextElementSchema),
  [FIELD_TYPES.textArea]: fieldCommonSchema.concat(textareaElementSchema),
  [FIELD_TYPES.fileList]: fieldCommonSchema,
  [FIELD_TYPES.resource]: fieldCommonSchema,
  [FIELD_TYPES.helpText]: fieldCommonSchema,
  [FIELD_TYPES.multiSelect]: fieldCommonSchema,
  conditions: fieldCommonSchema,
};

export const groupValidationSchema = dynamicRenderValidation.shape({
  name: yup
    .string()
    .required("Each group should have a name")
    .test("unique-group-name", "Group name should be unique", function test(value) {
      value = value.toLowerCase();
      const groups = Object.values(this.options.context.application.groups);
      return groups.filter((group) => group.name.toLowerCase() === value).length !== 1;
    }),
  id: yup.string().required(),
  isProtected: yup.boolean(),
  relatedFields: yup.array(),
  // ToDo: conditions put from commonFieldSchema
});

export const sectionValidationSchema = dynamicRenderValidation.shape({
  id: yup.string().required(),
  name: yup
    .string()
    .required("Each section should have a name")
    .test("unique-section-name", "Section name should be unique", function test(value) {
      value = value.toLowerCase();
      const sections = Object.values(this.options.context.application.sections);
      return sections.filter((section) => section.name.toLowerCase() === value).length !== 1;
    }),
  isProtected: yup.boolean(),
  isDisabled: yup.boolean(),
  isHidden: yup.boolean(),
  isAlreadyViewed: yup.boolean(),
  relatedGroups: yup.array(),
  // ToDo: conditions put from commonFieldSchema
});

export const elementValidationSchemas = {
  [ELEMENT_TYPES.field]: fieldSpecificValidationSchemas,
  [ELEMENT_TYPES.group]: groupValidationSchema,
  [ELEMENT_TYPES.section]: sectionValidationSchema,
};

export const MSPropertyValidationSchema = yup
  .string()
  .required("Master schema property should not be empty")
  .test("ms-property-validation", "Master schema property should not be duplicated", function test(value) {
    return !this.options.context.masterSchemaUsedPropertiesList.includes(value);
  });
