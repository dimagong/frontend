import "./styles.scss";

import React from "react";

import CrossIcon from "assets/img/svg/ms-user-cross.svg";
import EditIcon from "assets/img/svg/ms-user-edit.svg";
import DownloadIcon from "assets/img/svg/ms-user-cloud-download.svg";

const UsersMSVersionField = ({ inputValue, onDownload, onEdit, onClose, ...attrs }) => {
  return (
    <div className={"user-master-schema-type-field"} {...attrs}>
      <h1 className={"user-master-schema-type-field-title"}>Current</h1>
      <label htmlFor={"version-field"} className="user-master-schema-type-field-label">
        Version
      </label>
      <input
        className="user-master-schema-type-field-input"
        name={"version-field"}
        type="text"
        disabled
        value={inputValue}
      />
      <div className={"user-master-schema-type-field-buttons"}>
        <img src={DownloadIcon} alt={"download"} onClick={onDownload} />
        <img src={EditIcon} alt={"edit"} onClick={onEdit} />
        <img src={CrossIcon} alt={"close"} onClick={onClose} />
      </div>
    </div>
  );
};

export default UsersMSVersionField;
