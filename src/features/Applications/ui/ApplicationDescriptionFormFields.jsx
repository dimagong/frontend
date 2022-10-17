import React from "react";
import PropTypes from "prop-types";

import { NmpCheckbox, NmpInput } from "features/nmp-ui";

import { DFormLabel } from "components/DForm/Components/Fields/Components/DFormWidgets/Components/DFormLabel";
import { DFormSelectWidget } from "components/DForm/Components/Fields/Components/DFormWidgets/Components/DFormSelectWidget";

import {
  getCategoriesAsOptions,
  getCategoryAsOption,
} from "features/home/ContextSearch/Applications/utils/getCategoryAsOption";

export const ApplicationDescriptionFormFields = ({ name, description, isPrivate, onChange, category, categories }) => {
  const onNameChange = ({ target }) => onChange({ name: target.value, description, isPrivate });

  const onPrivateChange = ({ target }) => onChange({ name, description, isPrivate: target.checked });

  const onDescriptionChange = ({ target }) => onChange({ name, description: target.value, isPrivate });

  const onCategoryChange = (_category) => onChange({ name, description, isPrivate, categoryId: _category.value });

  const categoryValue = category ? getCategoryAsOption(category) : null;

  const categoriesOptions = categories ? getCategoriesAsOptions(categories) : null;

  return (
    <>
      <div className="mb-2">
        <DFormLabel label="Name" id="application-name" />
        <NmpInput
          id="application-name"
          type="text"
          value={name}
          placeholder="Enter application name"
          onChange={onNameChange}
        />
      </div>

      <div className="mb-2">
        <DFormLabel label="Description" id="application-description" />
        <NmpInput
          id="application-description"
          type="text"
          value={description}
          placeholder="Enter application description"
          onChange={onDescriptionChange}
        />
      </div>

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

      <NmpCheckbox id="application-private" checked={isPrivate} onChange={onPrivateChange}>
        <DFormLabel label="Is private" />
      </NmpCheckbox>
    </>
  );
};

ApplicationDescriptionFormFields.propTypes = {
  name: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  isPrivate: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
};
