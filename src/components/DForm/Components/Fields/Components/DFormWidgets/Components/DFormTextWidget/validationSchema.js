import * as yup from "yup";

import { conditionalRequiredField } from "components/DForm/commonValidationSchemas";

const textValidationSchema = conditionalRequiredField(yup.string());

export default textValidationSchema;
