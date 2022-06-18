import * as yup from "yup";

import { conditionalRequiredField } from "components/DForm/commonValidationSchemas";

const longTextValidationSchema = conditionalRequiredField(yup.string());

export default longTextValidationSchema;
