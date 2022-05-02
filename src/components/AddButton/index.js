import React from "react";
import { Plus } from "react-feather";
import { Button } from "reactstrap";

import "./styles.scss";

const AddButton = ({ onClick }) => {
  return (
    <Button onClick={onClick} color="primary" className="add-button-component">
      <Plus size={28} />
    </Button>
  );
};

export default AddButton;
