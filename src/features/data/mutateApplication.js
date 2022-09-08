import { toast } from "react-toastify";
import { validateDescriptionDesignMode } from "./validateApplication";

export const mutateApplication = (applicationData, mutation) => {
  const { isValid, errors: errValidation } = validateDescriptionDesignMode(applicationData);

  if (isValid) {
    const { name, description, isPrivate, type, errors, organization, ...schema } = applicationData;

    return mutation.mutateAsync({
      name,
      description,
      is_private: isPrivate,
      groups: [{ group_id: organization.id, type: organization.type }],
      schema,
    });
  } else {
    toast.error(errValidation.message);
  }
};
