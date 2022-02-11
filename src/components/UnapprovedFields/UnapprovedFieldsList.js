import _ from "lodash/fp";
import React from "react";
import PropTypes from "prop-types";
import { Spinner } from "reactstrap";
import { Close, Visibility, VisibilityOff } from "@material-ui/icons";

import { useToggle } from "hooks/use-toggle";

import UnapprovedFieldItem from "./UnapprovedFieldItem";

const iconStyles = {
  color: "#95989A",
  fontSize: "22px",
  marginLeft: "12px",
  cursor: "pointer",
};

const UnapprovedFieldsList = ({ fields, selectedIds, isLoading, onSelect, onUnselect }) => {
  const [visible, toggleVisibility] = useToggle(true);

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center">
        <Spinner />
      </div>
    );
  }

  if (fields && !_.isEmpty(fields)) {
    return (
      <div className="unapproved_fields-list">
        <div className="unapproved_fields-list-header">
          <div className="unapproved_fields-list-header-title mb-1">
            New unapproved elements
            {visible ? (
              <Visibility onClick={toggleVisibility} style={iconStyles} />
            ) : (
              <VisibilityOff onClick={toggleVisibility} style={iconStyles} />
            )}
          </div>
          <div className="unapproved_fields-list-header-selected_items">
            {!_.isEmpty(selectedIds) ? (
              <>
                <div className="unapproved_fields-list-header-selected_items-count">
                  <p>
                    {selectedIds.length} element{selectedIds.length === 1 ? "" : "s"} selected
                  </p>
                </div>
                <div className="unapproved_fields-list-header-selected_items-unselect_icon">
                  <Close style={{ fontSize: "16px", color: "black" }} onClick={onUnselect} />
                </div>
              </>
            ) : null}
          </div>
        </div>
        {visible ? (
          <div className="unapproved_fields-list-items">
            {fields.map((field) => (
              <UnapprovedFieldItem
                field={field}
                selected={selectedIds.includes(field.id)}
                onSelect={onSelect}
                key={field.id}
              />
            ))}
          </div>
        ) : null}
      </div>
    );
  }

  return null;
};

UnapprovedFieldsList.propTypes = {
  fields: PropTypes.arrayOf(PropTypes.object),
  isLoading: PropTypes.bool.isRequired,
  selectedIds: PropTypes.arrayOf(PropTypes.string).isRequired,

  onSelect: PropTypes.func.isRequired,
  onUnselect: PropTypes.func.isRequired,
};

export default UnapprovedFieldsList;
