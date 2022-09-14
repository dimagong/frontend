import { applicationSubmitValidation } from "./applicationSubmitValidation";

export const validateDescriptionDesignMode = (validData) => {
  try {
    applicationSubmitValidation.validateSync(validData, { abortEarly: false });
  } catch (validationError) {
    console.log("error", validationError);
    return { isValid: false, errors: validationError };
  }
  return { isValid: true };
};
