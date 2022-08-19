import * as yup from 'yup';

const conditionalRequiredField = (baseSchema, errorMessage = "Field is required") => {
  return baseSchema.when("$isRequired", (isRequired, schema) => (isRequired ? schema.required(errorMessage) : schema));

};

export {
  conditionalRequiredField,
};
