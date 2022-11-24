import { DformTextValidationFieldModel } from "../models/dformFieldModel";

const nameMaxLength = 500;

export const nameValidator = (_, value) => {
  const { isValid, message } = DformTextValidationFieldModel.stringValidator(value, 1, nameMaxLength);
  return isValid ? Promise.resolve() : Promise.reject(message);
};
