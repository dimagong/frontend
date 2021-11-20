import { useMemo, useState } from 'react';
import { every, mapValues, isNil } from 'lodash/fp';

// Validator :: <T>(value: T) -> string | true | false
export const Validators = {
  required: (value) => !!value || 'Value is required',
};

const initialValidationState = { valid: null, errors: [] };

const validatorsReducer =
  (value) =>
  ({ valid, errors }, validator) => {
    const errorOrBool = validator(value);

    switch (typeof errorOrBool) {
      case 'string':
        return { errors: [...errors, errorOrBool], valid };
      default:
        return { errors: errors, valid: isNil(valid) ? errorOrBool : errorOrBool && valid };
    }
  };

const useFormControl = (value, validators) => {
  const { valid, errors } = useMemo(
    () => validators.reduce(validatorsReducer(value), initialValidationState),
    [validators, value]
  );

  return { value, valid, invalid: !valid, errors };
};

// ToDo: consider, is field valid when it is pristine ?
export const useFormField = (initialValue, validators = []) => {
  const [value, setValue] = useState(initialValue);
  const control = useFormControl(value, validators);

  return [control, setValue];
};

const groupControlsValidator = (controls) => every(({ valid }) => valid, controls);

export const useFormGroup = (controls) => {
  const { valid, invalid, errors } = useFormControl(controls, [groupControlsValidator]);
  const values = useMemo(() => mapValues(({ value }) => value, controls), [controls]);

  return { valid, errors, invalid, values, controls };
};
