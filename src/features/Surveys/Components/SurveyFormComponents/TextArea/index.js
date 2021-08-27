import React from 'react';

import './styles.scss';

const TextArea = ({ name, height, value, onChange, disabled }) => {

  return (
    <div className="survey-textarea-component">
      <textarea
        value={value}
        onChange={onChange}
        name={name}
        id={name}
        rows={height}
        disabled={disabled}
      />
    </div>
  )
};

export default TextArea;
