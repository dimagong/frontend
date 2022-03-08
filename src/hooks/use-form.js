import _ from "lodash/fp";
import React from "react";

// Validator :: <T>(value: T) -> string | true | false
export const Validators = {
  required: (value) => (!!value && !_.isEmpty(value)) || "Value is required",
  identical: (initial) => (value) => initial === value ? "Value should be changed" : true,
  identicalArrayBy: (initial, by) => (v) => {
    const diff = _.xorBy(by, initial, v);
    return _.isEmpty(diff) ? "Value should be changed" : true;
  },
};

const initialValidationState = { valid: true, errors: [] };

const validatorsReducer =
  (value) =>
  ({ valid, errors }, validator) => {
    const errorOrBool = validator(value);

    switch (typeof errorOrBool) {
      case "string":
        return { errors: [...errors, errorOrBool], valid: false };
      default:
        return { errors, valid: errorOrBool && valid };
    }
  };

const useFormControl = (value, validators) => {
  const { valid, errors } = React.useMemo(
    () => validators.reduce(validatorsReducer(value), initialValidationState),
    [validators, value]
  );

  return { value, valid, invalid: !valid, errors };
};

// ToDo: consider, how to reset pristine state on submit.
// ToDo: consider, is field valid when it is pristine ?
export const useFormField = (initialValue, validators = []) => {
  const [value, setValue] = React.useState(initialValue);
  const control = useFormControl(value, validators);

  return [control, setValue];
};

const groupControlsValidator = (controls) => _.every(({ valid }) => valid, controls);

export const useFormGroup = (controls) => {
  const { valid, invalid, errors } = useFormControl(controls, [groupControlsValidator]);
  const values = React.useMemo(() => _.mapValues(({ value }) => value, controls), [controls]);

  return { valid, errors, invalid, values, controls };
};
