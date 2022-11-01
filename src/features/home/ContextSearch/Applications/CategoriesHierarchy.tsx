import "./styles.scss";

import React from "react";
import _ from "lodash/fp";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";

import { useDFormTemplateCategoryQuery, useCreateDFormTemplateCategoryMutation } from "./categoryQueries";
import { CategoryHierarchy } from "./CategoryHierarchy";

import { transformCategoriesToHierarchy } from "./utils/categoryHierarchyConverter";

import { ApplicationData, CreateCategorySubmitProps, Hierarchy, Search } from "./models";

import { INITIAL_APPLICATION_DATA } from "features/Applications/constants";
import { mutateApplication } from "features/data/mutateApplication";
import { useCreateApplicationTemplateMutation } from "features/data/applicationQueries";

import appSlice from "app/slices/appSlice";

const { setContext } = appSlice.actions;

export const CategoriesHierarchy: React.FC<Props> = ({ search }) => {
  const categories = useDFormTemplateCategoryQuery({ name: search });
  let hierarchies: Hierarchy[] = [];
  const dispatch = useDispatch();

  if (!_.isEmpty(categories.data)) {
    hierarchies = transformCategoriesToHierarchy(categories.data);
  }

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
          onFieldCreatingSubmit={onFieldCreatingSubmit}
          isLoading={isLoading}
        />
      ))}
    </div>
  );
};

type Props = {
  search: Search;
};
