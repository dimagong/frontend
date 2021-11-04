import React from 'react';
import moment from "moment";


import Checkbox from "components/Checkbox";
import {Visibility, VisibilityOff} from '@material-ui/icons'

import './styles.scss'

const iconStyles = {
  color: "#95989A",
  fontSize: "22px",
  marginLeft: "12px",
};

const UnapprovedFieldsListItem = ({ onClick, field, isSelected}) => {

  const handleFieldClick = () => {
    onClick(field);
  };

  return (
    <div className="unapproved_fields-list-items-item" onClick={handleFieldClick}>
      <div className="d-flex">
        <div className="unapproved_fields-list-items-item-state">
          <Checkbox checked={isSelected} />
        </div>
        <div className="unapproved_fields-list-items-item-description">
          <div className="unapproved_fields-list-items-item-description-name">
            {field.name}
          </div>
          <div className="unapproved_fields-list-items-item-description-appearances">
            dForm: {field.d_form_names.join(", ") || "Not used in dForms"}
          </div>
        </div>
      </div>
      <div className="unapproved_fields-list-items-item_creation_info">
        <p>{`Created by SOME_USER on ${moment(field.created_at).format("DD.MM.YYYY")}`}</p>
      </div>
    </div>
  );
};

const UnapprovedFieldsComponent = ({
  fields,
  selectedFields,
  onFieldClick,
  onUnselectAll,
  isListVisible,
  onListVisibilityToggle,
}) => {

  return (
    <div className="unapproved_fields">
        <div className="unapproved_fields-list">
          <div className="unapproved_fields-list-header">
            <div className="unapproved_fields-list-header-title">
              <h4>New unapproved elements <span onClick={onListVisibilityToggle}>{isListVisible ? <Visibility style={iconStyles}/> : <VisibilityOff style={iconStyles} />}</span></h4>
            </div>
            <div className="unapproved_fields-list-header-selected_items">
              <div className="unapproved_fields-list-header-selected_items-count">
                {!!selectedFields.length && (
                  <p>{selectedFields.length} elements selected</p>
                )}
              </div>
              <div className="unapproved_fields-list-header-selected_items-unselect_icon">

              </div>
            </div>
          </div>
          {isListVisible && (
            <div className="unapproved_fields-list-items">
              {fields.map(field => (
                <UnapprovedFieldsListItem
                  key={field.id}
                  onClick={onFieldClick}
                  field={field}
                  isSelected={selectedFields.includes(field)}
                />
              ))}
            </div>
          )}
        </div>
    </div>
  )
};

export default UnapprovedFieldsComponent;
