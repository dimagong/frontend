import React from "react";

const HelpText = (props) => {
  return <div dangerouslySetInnerHTML={{ __html: props.value }} />;
};

export default HelpText;
