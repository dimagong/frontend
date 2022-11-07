import * as yup from "yup";

import { conditionalRequiredField } from "components/DForm/commonValidationSchemas";

const multiSelectValidationSchema = conditionalRequiredField(yup.string());

export default multiSelectValidationSchema;
