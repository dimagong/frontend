import React from "react";
import TermsAndConditions from "assets/ValidPath-privacy-policy.pdf";
import { Button } from "reactstrap";

const AuthButton = ({ value, onClick }) => {
  const handleClick = (e) => {
    e.preventDefault();

    onClick(e);
  };

  return (
    <div className="d-flex justify-content-between align-items-end">
      <div>
        <a href={TermsAndConditions} target="_blank" rel="noopener noreferrer">
          Privacy & Terms
        </a>
      </div>
      <Button color="primary" type="submit" onClick={handleClick}>
        {value}
      </Button>
    </div>
  );
};

export default AuthButton;
