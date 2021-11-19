import { useMemo, useState } from 'react';
import { isEmpty, isString, every, mapValues } from 'lodash/fp';

// ValidationError :: string

// Validator :: <T>(value: T) -> ValidationError | true

// FormField :: {
//   value: any,
//   errors: ValidationError[],
//   valid: boolean,
//   invalid: boolean
// }

export const Validators = {
  required: (value) => !!value || 'Value is required',
};

export const useFormField = (initialValue, validators = []) => {
  const [value, setValue] = useState(initialValue);
  const errors = useMemo(() => validators.map((validator) => validator(value)).filter(isString), [validators, value]);
  const valid = useMemo(() => isEmpty(errors), [errors]);

  const field = useMemo(() => ({ value, errors, valid, invalid: !valid }), [errors, valid, value]);

  return [field, setValue];
};

// FieldName :: string
// FormFields :: { [FieldName]: Field }
// FormValues :: { [FieldName]: any }

// FormGroup :: {
//   valid: boolean,
//   invalid: boolean,
//   fields: FormFields,
//   values: FormValues,
// }

// ToDo: make possible group in group
export const useFormGroup = (fields) => {
  // ToDo: consider, is form valid with some pristine field ?
  const valid = useMemo(() => every((field) => field.valid, fields), [fields]);
  const values = useMemo(() => mapValues((field) => field.value, fields), [fields]);
  const formGroup = useMemo(() => ({ valid, invalid: !valid, fields, values }), [valid, fields, values]);

  return [formGroup];
};
