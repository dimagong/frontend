import * as yup from "yup";

import { FieldTypes } from "components/DForm/constants";

const { object, number, string, boolean, date } = yup;

const numberSchema = object({
  value: number()
    .when("isRequired", {
      is: true,
      then: number()
        .transform((value) => (isNaN(value) ? undefined : value))
        .required("The value is required"),
    })
    .integer("Value should be an integer")
    .positive("Value should be more than 0")
    .test("number-prospect-manager", function test(value) {
      if (this.options.parent.maximum && value > this.options.parent.maximum) {
        return this.createError({
          message: `The value more than ${this.options.parent.maximum}`,
        });
      }
      if (this.options.parent.minimum && value < this.options.parent.minimum) {
        return this.createError({
          message: `The value less than ${this.options.parent.minimum}`,
        });
      }
      return true;
    }),
  maximum: number(),
  minimum: number(),
});

const textSchema = object({
  value: string()
    .when("isRequired", {
      is: true,
      then: string().required("The value is required"),
    })
    .matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed for this field ")
    .test("text-prospect-manager", function test(value) {
      if (this.options.parent.maxLength && value.length > this.options.parent.maxLength) {
        return this.createError({
          message: `The value more than ${this.options.parent.maxLength}`,
        });
      }
      if (this.options.parent.minLength && value.length < this.options.parent.minLength) {
        return this.createError({
          message: `The value less than ${this.options.parent.minLength}`,
        });
      }
      return true;
    }),
  maxLength: number(),
  minLength: number(),
});

const booleanSchema = object({
  value: boolean().when("isRequired", {
    is: true,
    then: boolean().required("The field is required"),
  }),
});

const dateSchema = object({
  value: date()
    .default(() => new Date())
    .when("isRequired", {
      is: true,
      then: date().required("The field is required"),
    }),
});

export const fieldCommonSchema = yup.object().shape({
  id: string().required(),
  edited: boolean(),
  classes: string(),
  isLabelShowing: boolean(),
  type: string(),
  title: string().required(),
  isRequired: boolean(),
});

const textElementSchema = object({}).concat(textSchema);
const numberElementSchema = object({}).concat(numberSchema);
const dateElementSchema = object({}).concat(dateSchema);
const booleanElementSchema = object({}).concat(booleanSchema);

export const fieldValidationSchemas = {
  [FieldTypes.Text]: fieldCommonSchema.concat(textElementSchema),
  [FieldTypes.Date]: fieldCommonSchema.concat(dateElementSchema),
  [FieldTypes.Number]: fieldCommonSchema.concat(numberElementSchema),
  [FieldTypes.Boolean]: fieldCommonSchema.concat(booleanElementSchema),
  [FieldTypes.LongText]: fieldCommonSchema.concat(textElementSchema),
  [FieldTypes.TextArea]: fieldCommonSchema.concat(textElementSchema),
  [FieldTypes.HelpText]: fieldCommonSchema.concat(textElementSchema),
  //[FIELD_TYPES.file]: fieldCommonSchema,
  //[FIELD_TYPES.select]: fieldCommonSchema,
  //[FIELD_TYPES.fileList]: fieldCommonSchema,
  //[FIELD_TYPES.resource]: fieldCommonSchema,
  //[FIELD_TYPES.multiSelect]: fieldCommonSchema,
  //conditions: fieldCommonSchema,
};
