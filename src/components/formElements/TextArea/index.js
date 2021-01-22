import React from 'react'

import './styles.scss'

const TextArea = ({value, onChange}) => {

  return (
    <div className={"form-element_textarea"}>
      <textarea id="" cols="30" rows="10" value={value} onChange={onChange}/>
    </div>
  )
}

export default TextArea;

// WysiwygEditor
