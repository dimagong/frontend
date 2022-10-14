import React from "react";
import PropTypes from "prop-types";

import { NmpCheckbox, NmpInput } from "features/nmp-ui";

import { DFormLabel } from "components/DForm/Components/Fields/Components/DFormWidgets/Components/DFormLabel";

export const ApplicationDescriptionFormFields = ({ name, description, isPrivate, onChange }) => {
  const onNameChange = ({ target }) => onChange({ name: target.value, description, isPrivate });

  const onPrivateChange = ({ target }) => onChange({ name, description, isPrivate: target.checked });

  const onDescriptionChange = ({ target }) => onChange({ name, description: target.value, isPrivate });

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
