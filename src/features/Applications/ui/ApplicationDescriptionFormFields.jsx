import React from "react";
import PropTypes from "prop-types";

import { DFormTextWidget } from "components/DForm/Components/Fields/Components/DFormWidgets/Components/DFormTextWidget";
import { DFormBooleanWidget } from "components/DForm/Components/Fields/Components/DFormWidgets/Components/DFormBooleanWidget";
import { DFormSelectWidget } from "components/DForm/Components/Fields/Components/DFormWidgets/Components/DFormSelectWidget";
import {
  getCategoriesAsOptions,
  getCategoryAsOption,
} from "features/home/ContextSearch/Applications/utils/getCategoryAsOption";

export const ApplicationDescriptionFormFields = ({ name, description, isPrivate, onChange, category, categories }) => {
  const onNameChange = (name) => onChange({ name, description, isPrivate, categoryId: category.categoryId });

  const onPrivateChange = (isPrivate) => onChange({ name, description, isPrivate, categoryId: category.categoryId });

  const onDescriptionChange = (description) =>
    onChange({ name, description, isPrivate, categoryId: category.categoryId });

  const onCategoryChange = (_category) => onChange({ name, description, isPrivate, categoryId: _category.value });

  const categoryValue = category ? getCategoryAsOption(category) : null;

  const categoriesOptions = categories ? getCategoriesAsOptions(categories) : null;

  return (
    <>
      <DFormTextWidget
        id="application-name"
        label="Name"
        value={name}
        isError={false}
        isRequired={false}
        isDisabled={false}
        isLabelShowing={true}
        placeholder="Enter application name"
        onChange={onNameChange}
        className="mb-2"
      />

      <DFormTextWidget
        id="application-description"
        value={description}
        label="Description"
        isError={false}
        isRequired={false}
        isDisabled={false}
        isLabelShowing={true}
        placeholder="Enter application description"
        onChange={onDescriptionChange}
        className="mb-2"
      />

      {categories ? (
        <DFormSelectWidget
          id="dform-organization-category"
          label="Select organization category"
          value={categoryValue}
          options={categoriesOptions}
          isError={false}
          isRequired={false}
          isDisabled={false}
          isLabelShowing={true}
          onChange={onCategoryChange}
          className="mb-2"
        />
      ) : null}

      <DFormBooleanWidget
        id="application-private"
        label="Is private"
        value={isPrivate}
        isError={false}
        isRequired={false}
        isDisabled={false}
        isLabelShowing={true}
        onChange={onPrivateChange}
      />
    </>
  );
};

ApplicationDescriptionFormFields.propTypes = {
  name: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  isPrivate: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
};
