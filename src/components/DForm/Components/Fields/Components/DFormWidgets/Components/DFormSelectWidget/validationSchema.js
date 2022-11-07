import * as yup from "yup";

import { conditionalRequiredField } from "components/DForm/commonValidationSchemas";

const selectValidationSchema = conditionalRequiredField(yup.string());

export default selectValidationSchema;
