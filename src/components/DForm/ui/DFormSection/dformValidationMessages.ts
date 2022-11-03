export const dformValidationMessages = {
  required: "Is required!",
  string: {
    len: "value must be exactly ${len} characters",
    min: "value must be at least ${min} characters",
    max: "value cannot be longer than ${max} characters",
    range: "value must be between ${min} and ${max} characters",
  },
  number: {
    len: "value must equal ${len}",
    min: "value cannot be less than ${min}",
    max: "value cannot be greater than ${max}",
    range: "value must be between ${min} and ${max}",
  },
  array: {
    len: "value must be exactly ${len} in length",
    min: "value cannot be less than ${min} in length",
    max: "value cannot be greater than ${max} in length",
    range: "value must be between ${min} and ${max} in length",
  },
};
