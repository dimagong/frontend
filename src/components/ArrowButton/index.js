import React from "react";
import { ChevronUp, ChevronDown } from "react-feather";
import { Button } from "reactstrap";

import "./styles.scss";

const ArrowButton = ({ onClick, className, chevronSize = 28, direction }) => {
  return (
    <Button color="primary" onClick={onClick} className="chevron-up-button">
      {direction === "up" ? <ChevronUp size={chevronSize} /> : <ChevronDown size={chevronSize} />}
    </Button>
  );
};

export default ArrowButton;
