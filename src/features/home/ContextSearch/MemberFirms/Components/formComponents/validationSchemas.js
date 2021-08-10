import * as yup from 'yup';

const conditionalRequiredField = (baseSchema, errorMessage = "Field is required") => {
  return baseSchema.when("$isRequired", (isRequired, schema) => (isRequired ? schema.required(errorMessage) : schema));

};

export default  {
  text: conditionalRequiredField(yup.string()),
  email: conditionalRequiredField(yup.string().email("Please, enter a valid email")),
};
