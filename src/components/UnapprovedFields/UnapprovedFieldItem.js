import React from "react";
import moment from "moment";
import PropTypes from "prop-types";

import { stopPropagation } from "utility/event-decorators";

import Checkbox from "../Checkbox";

const UnapprovedFieldItem = ({ field, selected, onSelect }) => {
  const handleFieldClick = () => onSelect(field.id);
  const handleFieldChange = stopPropagation(() => onSelect(field.id));

  return (
    <div className="unapproved_fields-list-items-item" onClick={handleFieldClick}>
      <div className="d-flex">
        <div className="unapproved_fields-list-items-item-state">
          <Checkbox checked={selected} onChange={handleFieldChange} />
        </div>
        <div className="unapproved_fields-list-items-item-description">
          <div className="unapproved_fields-list-items-item-description-name">
            {`${field.parentGroupName}/${field.name}`}
          </div>
          <div className="unapproved_fields-list-items-item-description-appearances">
            Applications: {field.applicationNames?.join(", ") || "Not used in Applications"}
          </div>
        </div>
      </div>
      <div className="unapproved_fields-list-items-item_creation_info">
        <p>
          {field.providedByFullName
            ? `Created by ${field.providedByFullName} on ${moment(field.createdAt).format("DD.MM.YYYY")}`
            : `Created on ${moment(field.createdAt).format("DD.MM.YYYY")}`}
        </p>
      </div>
    </div>
  );
};

UnapprovedFieldItem.propTypes = {
  field: PropTypes.object.isRequired,
  selected: PropTypes.bool.isRequired,
  onSelect: PropTypes.func.isRequired,
};

export default UnapprovedFieldItem;
