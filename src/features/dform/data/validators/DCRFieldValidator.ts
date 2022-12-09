export const DCRFieldValidator = (elementType, relatedFields, _, value) => {
  const elementTypesFunctions = {
    section: () => sectionValidator(relatedFields, value),
    group: () => groupValidator(relatedFields, value),
    field: () => fieldValidator(),
  };

  const isValid = elementTypesFunctions[elementType]();

  return isValid
    ? Promise.resolve()
    : Promise.reject(`Condition for a ${elementType} cannot depend on a field in that ${elementType}`);
};

const sectionValidator = (relatedFields, value): boolean => {
  return !relatedFields.includes(value);
};

const groupValidator = (relatedFields, value): boolean => {
  return !relatedFields.includes(value);
};

const fieldValidator = (): boolean => {
  return true;
};
