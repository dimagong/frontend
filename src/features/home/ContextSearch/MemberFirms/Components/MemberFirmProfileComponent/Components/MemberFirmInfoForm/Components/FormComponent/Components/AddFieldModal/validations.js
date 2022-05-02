import * as yup from "yup";

const mainValidationSchema = yup.object().shape({
  master_schema_field_id: yup.number().required("Please, select a MS property for that field"),
  type: yup.string().required("Please, select a field type"),
  title: yup.string().required("Please, enter a title for field"),
});

const validationSchemaForSelectComponent = yup.object().shape({
  settings: yup.object(),
});

const SELECT_COMPONENTS_TYPES = ["select", "multiSelect"];

const getValidationDependingOnComponent = (componentType) => {
  if (SELECT_COMPONENTS_TYPES.includes(componentType)) {
    return mainValidationSchema.concat(validationSchemaForSelectComponent);
  } else {
    return mainValidationSchema;
  }
};

export default getValidationDependingOnComponent;
