import "./styles.scss";

import React, { useEffect, useState } from "react";
import _ from "lodash/fp";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";

import { useDFormTemplateCategoryQuery, useCreateDFormTemplateCategoryMutation } from "./categoryQueries";
import { CategoryHierarchy } from "./CategoryHierarchy";

import { transformCategoriesToHierarchy } from "./utils/categoryHierarchyConverter";

import { ApplicationData, CategoryId, CreateCategorySubmitProps, Hierarchy, Search } from "./models";

import { INITIAL_APPLICATION_DATA } from "features/applications/constants";
import { mutateApplication } from "features/applications/data/mutateApplication";
import { useCreateApplicationTemplateMutation } from "features/applications/data/applicationQueries";

import appSlice from "app/slices/appSlice";

const { setContext } = appSlice.actions;

export const CategoriesHierarchy: React.FC<Props> = ({ search, rootCategoryId }) => {
  const { data: category, isLoading: isLoadingCategory } = useDFormTemplateCategoryQuery({
    name: search,
    rootCategoryId,
  });

  const [hierarchy, setHierarchy] = useState<Hierarchy>();

  const dispatch = useDispatch();

  useEffect(() => {
    if (category) {
      setHierarchy(transformCategoriesToHierarchy(category)[0]);
    }
  }, [category]);

  //@ts-ignore
  const createCategory = useCreateDFormTemplateCategoryMutation();

  const onElementCreationSubmit = ({ type, name, parentId }: CreateCategorySubmitProps) => {
    //@ts-ignore
    createCategory.mutate({ name: name, parent_id: parentId });
  };

  const onFieldCreatingSubmit = async (submitted: ApplicationData) => {
    const { name, description, isPrivate, category: categoryId, organization } = submitted;

    await mutateApplication(
      {
        ...INITIAL_APPLICATION_DATA,
        name,
        description,
        isPrivate,
        categoryId,
        organization,
      },
      createApplicationMutation
    );
  };

  const createApplicationMutation = useCreateApplicationTemplateMutation({
    onSuccess: () => {
      // @ts-ignore
      dispatch(setContext("dForm"));
      toast.success("Application created");
    },
    onError: (error) => {
      //TODO handle error
      console.error(error);
    },
  });

  const isLoading = createApplicationMutation.isLoading || createCategory.isLoading;

  if (isLoadingCategory) {
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
          onFieldCreatingSubmit={onFieldCreatingSubmit}
          isLoading={isLoading}
        />
      ) : null}
    </div>
  );
};

type Props = {
  search: Search;
  rootCategoryId: CategoryId;
};
