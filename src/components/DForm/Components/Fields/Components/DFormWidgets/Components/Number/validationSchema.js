import * as yup from "yup";

import { conditionalRequiredField } from "components/DForm/commonValidationSchemas";

const numberValidationSchema = conditionalRequiredField(yup.string());

export default numberValidationSchema;
