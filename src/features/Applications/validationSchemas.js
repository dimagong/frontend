import * as yup from "yup";
import { ELEMENT_TYPES, FIELD_TYPES } from "./constants";
import { DATE_WIDGET_FORMATS } from "./constants";

const { object, string, min, number, ref } = yup;
const fieldTypesArray = Object.values(FIELD_TYPES);

const dynamicRenderValidation = object({});

// STRUCTURE
// DR - dynamic render validation
// ----------
// GROUP
// DR -> group validation
// ----------
// Section
// DR -> section validation
// ----------
// Field
// DR -> field common validation -> field validation by field type

const minMaxLengthSchema = object({
  minLength: number("Min length should be a number")
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
    .integer("Max length should be an integer")
    .positive("Max length should be bigger then 0"),
});

const minimumMaximumSchema = object({
  minimum: number("Minimum should be a number")
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
    .integer("Maximum should be an integer")
    .positive("Maximum should be bigger then 0"),
});

export const fieldCommonSchema = yup.object().shape({
  id: yup.string().required(),
  isNotMasterSchemaRelated: yup.boolean(),
  type: yup.string().oneOf(fieldTypesArray),
  title: yup.string().required(),
  isRequired: yup.boolean(),
  classes: yup.string(),
  isLabelShowing: yup.boolean(),
});

const textElementSchema = object({}).concat(minMaxLengthSchema);

const numberElementSchema = object({}).concat(minimumMaximumSchema);

const textareaElementSchema = object({}).concat(minMaxLengthSchema);

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
  [FIELD_TYPES.longText]: fieldCommonSchema,
  [FIELD_TYPES.textArea]: fieldCommonSchema.concat(textareaElementSchema),
  [FIELD_TYPES.fileList]: fieldCommonSchema,
  [FIELD_TYPES.resource]: fieldCommonSchema,
  [FIELD_TYPES.helpText]: fieldCommonSchema,
  [FIELD_TYPES.multiSelect]: fieldCommonSchema,
};

export const groupValidationSchema = dynamicRenderValidation.shape({
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

export const sectionValidationSchema = dynamicRenderValidation.shape({
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
  [ELEMENT_TYPES.field]: fieldSpecificValidationSchemas,
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

export const testSchema = yup.object().shape({
  name: yup.string(),
});
