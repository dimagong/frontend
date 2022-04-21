import _ from "lodash/fp";
import { useMemo, useState } from "react";

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
  const { valid, errors } = useMemo(
    () => validators.reduce(validatorsReducer(value), initialValidationState),
    [validators, value]
  );

  return { value, valid, invalid: !valid, errors };
};

// ToDo: consider, how to reset pristine state on submit.
// ToDo: consider, is field valid when it is pristine ?

export const useBasicFormField = (initialValue, validators = []) => {
  const [value, setValue] = useState(initialValue);
  const control = useFormControl(value, validators);

  return [control, setValue];
};

export const useAdvancedFormField = (initialValue, validators = []) => {
  const [value, setValue] = useState(initialValue);
  const control = useFormControl(value, validators);

  const onChange = (value) => setValue(value);

  return useMemo(() => ({ ...control, onChange, setValue }), [control]);
};

const defaultOptions = { useAdvanced: false };

export const useFormField = (initialValue, validators, { useAdvanced } = defaultOptions) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return useAdvanced ? useAdvancedFormField(initialValue, validators) : useBasicFormField(initialValue, validators);
};

const groupControlsValidator = (controls) => _.every(({ valid }) => valid, controls);

export const useFormGroup = (controls) => {
  const { valid, invalid, errors } = useFormControl(controls, [groupControlsValidator]);
  const values = useMemo(() => _.mapValues(({ value }) => value, controls), [controls]);

  return { valid, errors, invalid, values, controls };
};
