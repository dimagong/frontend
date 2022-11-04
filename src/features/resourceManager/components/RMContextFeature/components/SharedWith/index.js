import React from "react";
import { Search } from "@material-ui/icons";

const SharedWith = () => {
  return (
    <div>
      <div className="d-flex align-items-center justify-content-between">
        <div className="title">MasterSchema connections</div>
        <div className="search-input-container">
          <Search className="search-input-icon" />
          <input className="search-input-custom" type="text" />
        </div>
      </div>
      <div className="d-flex justify-content-center pt-5 text-black-50 font-large-1">No connections found</div>
    </div>
  );
};

export default SharedWith;
