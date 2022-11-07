import * as yup from "yup";

import { conditionalRequiredField } from "components/DForm/commonValidationSchemas";

const textareaValidationSchema = conditionalRequiredField(yup.string());

export default textareaValidationSchema;
