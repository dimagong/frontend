import { CategoryForSelect, RootCategoryForSelect } from "../models";

export const getCategoriesAsOptions = (categories: CategoryForSelect[]) => categories?.map(getCategoryAsOption);

export const getCategoryAsOption = (category: CategoryForSelect) => ({
  value: category.categoryId,
  label: category.categoryName,
});

export const getRootCategoriesAsOptions = (categories: RootCategoryForSelect[]) =>
  categories?.map(getRootCategoryAsOptions);

export const getRootCategoryAsOptions = (category: RootCategoryForSelect) => ({
  value: category.id,
  label: category.name,
});
