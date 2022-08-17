import * as yup from "yup";

export const decriptionValidationSchema = yup.object().shape({
  description: yup.string().required("Each application should have a description"),
  name: yup.string().required("Each application should have a name"),
  organization: yup.object().shape({
    name: yup.string().required("Each organization should have a name"),
  }),
});

export const designModeValidationSchema = yup.object().shape({
  fields: yup
    .object()
    .shape({})
    .test(
      "Design-mode-validation",
      "Design mode must contain at least one field", // error message
      function test(value) {
        return !!Object.keys(value).length;
      }
    ),
});
