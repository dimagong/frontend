import React from "react";
import PropTypes from "prop-types";

import { DFormTextWidget } from "components/DForm/Components/Fields/Components/DFormWidgets/Components/DFormTextWidget";
import { DFormBooleanWidget } from "components/DForm/Components/Fields/Components/DFormWidgets/Components/DFormBooleanWidget";

export const ApplicationDescriptionFormFields = ({ name, description, isPrivate, onChange }) => {
  const onNameChange = (name) => onChange({ name, description, isPrivate });

  const onPrivateChange = (isPrivate) => onChange({ name, description, isPrivate });

  const onDescriptionChange = (description) => onChange({ name, description, isPrivate });

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
