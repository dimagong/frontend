import * as yup from "yup";

import { conditionalRequiredField } from "components/DForm/commonValidationSchemas";

const dateValidationSchema = conditionalRequiredField(yup.string());

export default dateValidationSchema;
