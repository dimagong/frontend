import * as yup from "yup";
import { conditionalRequiredField } from "components/DForm/commonValidationSchemas";

const resourceValidationSchema = conditionalRequiredField(yup.string());

export default resourceValidationSchema;
