import React from "react";
import _ from "lodash/fp";

import { useCategoryHierarchy, useCreateApplicationCategory } from "./categoryQueries";
import { CategoryHierarchy } from "./CategoryHierarchy";

import { transformCategoriesToHierarchy } from "./utils/categoryHierarchyParser";

import { CreateCategorySubmitProps, Hierarchy, Search } from "./models";

import "./styles.scss";

export const CategoriesHierarchy: React.FC<Props> = ({ search }) => {
  const hierarchy = useCategoryHierarchy({ name: search }, [search]);
  let transformedHierarchy: Hierarchy[] = [];

  if (!_.isEmpty(hierarchy.data)) {
    console.log("hierarchy.data", hierarchy.data);
    transformedHierarchy = transformCategoriesToHierarchy(hierarchy.data);
  }

  //@ts-ignore
  const createCategory = useCreateApplicationCategory();

  const onElementCreationSubmit = ({ type, name, parentId }: CreateCategorySubmitProps) => {
    //@ts-ignore
    createCategory.mutate({ name: name, parent_id: parentId });
  };

  if (hierarchy.isLoading) {
    return <div>loading...</div>;
  }

  if (_.isEmpty(hierarchy.data) && !_.isEmpty(search)) {
    return <div>No search results found...</div>;
  }

  return (
    <div className="tree-hierarchies-wrapper">
      {transformedHierarchy.map((hierarchy, index) => (
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
