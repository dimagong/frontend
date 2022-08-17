import * as yup from "yup";

export const decriptionValidationSchema = yup.object().shape({
  description: yup.string().required(),
  name: yup.string().required(),
  organization: yup.object().shape({
    name: yup.string().required("Each organization should have a name"),
  }),
  fields: yup.object().shape({
    optionalObject: yup.object().shape({}),
  }),
});
