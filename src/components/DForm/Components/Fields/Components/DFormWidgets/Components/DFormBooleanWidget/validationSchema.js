import * as yup from "yup";

import { conditionalRequiredField } from "components/DForm/commonValidationSchemas";

const booleanValidationSchema = conditionalRequiredField(yup.string());

export default booleanValidationSchema;
