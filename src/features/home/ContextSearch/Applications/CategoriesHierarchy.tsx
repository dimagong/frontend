import React from "react";
import _ from "lodash/fp";

import { useDFormTemplateCategoryQuery, useCreateDFormTemplateCategoryMutation } from "./categoryQueries";
import { CategoryHierarchy } from "./CategoryHierarchy";

import { transformCategoriesToHierarchy } from "./utils/categoryHierarchyConverter";

import { CreateCategorySubmitProps, Hierarchy, Search } from "./models";

import "./styles.scss";

export const CategoriesHierarchy: React.FC<Props> = ({ search }) => {
  const categories = useDFormTemplateCategoryQuery({ name: search });
  let hierarchies: Hierarchy[] = [];

  if (!_.isEmpty(categories.data)) {
    hierarchies = transformCategoriesToHierarchy(categories.data);
  }

  //@ts-ignore
  const createCategory = useCreateDFormTemplateCategoryMutation();

  const onElementCreationSubmit = ({ type, name, parentId }: CreateCategorySubmitProps) => {
    //@ts-ignore
    createCategory.mutate({ name: name, parent_id: parentId });
  };

  if (categories.isLoading) {
    return <div>loading...</div>;
  }

  if (_.isEmpty(categories.data) && !_.isEmpty(search)) {
    return <div>No search results found...</div>;
  }

  return (
    <div className="tree-hierarchies-wrapper">
      {hierarchies.map((hierarchy, index) => (
        <CategoryHierarchy
          key={index}
          hierarchy={hierarchy}
          search={search}
          onElementCreationSubmit={onElementCreationSubmit}
          isLoading={createCategory.isLoading}
        />
      ))}
    </div>
  );
};

type Props = {
  search: Search;
};
