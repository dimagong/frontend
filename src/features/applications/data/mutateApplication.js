import { toast } from "react-toastify";
import { validateDescriptionDesignMode } from "./validateApplication";

export const mutateApplication = (applicationData, mutation) => {
  const { isValid, errors: errValidation } = validateDescriptionDesignMode(applicationData);

  if (isValid) {
    const { name, description, isPrivate, type, errors, organization, categoryId, ...schema } = applicationData;

    return mutation.mutateAsync({
      name,
      description,
      is_private: isPrivate,
      category_id: categoryId,
      groups: [{ group_id: organization.id, type: organization.type }],
      schema: {
        fields: schema.fields,
        groups: schema.groups,
        sections: schema.sections,
        sectionsOrder: schema.sectionsOrder,
      },
    });
  } else {
    toast.error(errValidation.message);
  }
};
