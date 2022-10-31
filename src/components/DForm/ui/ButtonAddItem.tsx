import React from "react";

import { Plus } from "react-feather";

type ButtonAddItemType = {
  onClick: () => any;
  label: string;
  className: string;
};

export const ButtonAddItem = ({ onClick, label, className }: ButtonAddItemType) => {
  return (
    <>
      <div className={className} onClick={onClick}>
        <div className="element-add_icon">
          <Plus color="white" size={23} />
        </div>
        <div className="element-add_description">{label}</div>
      </div>
    </>
  );
};
