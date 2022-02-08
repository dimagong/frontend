import React from "react";
import './styles.scss';

const UsersMSElementType = ({inputValue, ...attrs}) => {
  return (
    <div className={'user-master-schema-type-field'} {...attrs}>
      <label htmlFor={'element-type'} className="user-master-schema-type-field-label">
        Element Type
      </label>
      <input
        className="user-master-schema-type-field-input user-master-schema-type-field-element-type"
        name={'element-type'}
        type="text"
        disabled
        value={inputValue}
      />
    </div>
  )
}

export default UsersMSElementType;
