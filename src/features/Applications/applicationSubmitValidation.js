import * as yup from "yup";

export const applicationSubmitValidation = yup.object().shape({
  description: yup.string().required("An application should have a description"),
  name: yup.string().required("An application should have a name"),
  organization: yup
    .object()
    .shape({
      name: yup.string().required(),
    })
    .required("An application should have an organization"),
  fields: yup
    .object()
    .shape({})
    .test("design-mode-validation", "Design mode must contain at least one field", function test(value) {
      return Object.keys(value).length > 0;
    }),
});
