import React from "react";
import _ from "lodash/fp";

import { useDFormTemplateCategoryQuery, useCreateDFormTemplateCategoryMutation } from "./categoryQueries";
import { CategoryHierarchy } from "./CategoryHierarchy";

import { transformCategoriesToHierarchy } from "./utils/categoryHierarchyConverter";

import { CategoryId, CreateCategorySubmitProps, Search } from "./models";

import "./styles.scss";

export const CategoriesHierarchy: React.FC<Props> = ({ search, rootCategoryId }) => {
  const { data: category, isLoading } = useDFormTemplateCategoryQuery({ name: search, rootCategoryId });

  const hierarchy = category ? transformCategoriesToHierarchy(category)[0] : null;

  //@ts-ignore
  const createCategory = useCreateDFormTemplateCategoryMutation();

  const onElementCreationSubmit = ({ type, name, parentId }: CreateCategorySubmitProps) => {
    //@ts-ignore
    createCategory.mutate({ name: name, parent_id: parentId });
  };

  if (isLoading) {
    return <div>loading...</div>;
  }

  if (_.isEmpty(category) && !_.isEmpty(search)) {
    return <div>No search results found...</div>;
  }

  return (
    <div className="tree-hierarchies-wrapper">
      {hierarchy ? (
        <CategoryHierarchy
          hierarchy={hierarchy}
          search={search}
          onElementCreationSubmit={onElementCreationSubmit}
          isLoading={createCategory.isLoading}
        />
      ) : null}
    </div>
  );
};

type Props = {
  search: Search;
  rootCategoryId: CategoryId;
};
