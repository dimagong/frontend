import React from 'react'
export default function HelpText(props) {
  return <div dangerouslySetInnerHTML={{__html: props.schema.description}} />;
}
