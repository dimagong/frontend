import React from 'react';
import {ChevronUp} from "react-feather";
import {Button} from "reactstrap";

import './styles.scss'

const ChevronUpButton = ({ onClick, className, chevronSize = 28 }) => {

  return (
    <Button color="primary" onClick={onClick} className="chevron-up-button">
      <ChevronUp size={chevronSize} />
    </Button>
  )
};

export default ChevronUpButton;
