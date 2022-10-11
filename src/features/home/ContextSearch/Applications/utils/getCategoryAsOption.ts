export const getCategoriesAsOptions = (categories) => categories?.map(getCategoryAsOption);

export const getCategoryAsOption = (category) => ({
  value: category.id,
  label: category.name,
});
