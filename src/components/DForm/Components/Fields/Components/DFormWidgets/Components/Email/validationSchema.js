import * as yup from 'yup';

import { conditionalRequiredField } from "components/DForm/commonValidationSchemas";

const emailValidationSchema = conditionalRequiredField(yup.string().email("Please, enter a valid email"));

export default emailValidationSchema;
