import React from "react";
import EditIcon from "../../assets/img/icons/edit.png";
import DeprecatedNmpButton from "../nmp/DeprecatedNmpButton";

export const GoogleDriveAuthRequestToast = ({ link }) => {
  const openLink = () => {
    return window.open(link, "_blank");
  };

  return (
    <div>
      <DeprecatedNmpButton
        className="mr-1"
        size="sm"
        textColor="#95989a"
        backgroundColor="transparent"
        onClick={openLink}
      >
        Please click to allow access to Google Drive (only access to documents created by NMP)
      </DeprecatedNmpButton>
    </div>
  );
};
