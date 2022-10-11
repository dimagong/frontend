import { CategoryHierarchy, CategoryForSelect } from "../models";
import camelize from "camelize";

export const parseHierarchyCategory = (category: any): CategoryHierarchy => {
  return camelize(category) as CategoryHierarchy;
};

export const parseSelectCategory = (category: any): CategoryForSelect => {
  return camelize(category) as CategoryForSelect;
};
