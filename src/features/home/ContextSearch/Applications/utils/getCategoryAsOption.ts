import { CategoryForSelect } from "../models";

export const getCategoriesAsOptions = (categories: CategoryForSelect[]) => categories?.map(getCategoryAsOption);

export const getCategoryAsOption = (category: CategoryForSelect) => ({
  value: category.categoryId,
  label: category.categoryName,
});
