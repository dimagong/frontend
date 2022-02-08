import React from "react";
import './styles.scss';

const UsersMSResourceLink = ({inputValue, ...attrs}) => {
  return (
    <div className={'user-master-schema-type-field'} {...attrs}>
      <label htmlFor={'resource-link'} className="user-master-schema-type-field-label">
        Resource link
      </label>
      <input
        className="user-master-schema-type-field-input"
        name={'resource-link'}
        type="text"
        disabled
        value={inputValue}
      />
    </div>
  )
}

export default UsersMSResourceLink;
