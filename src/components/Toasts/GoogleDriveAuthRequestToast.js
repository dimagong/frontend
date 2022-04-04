import React from 'react';
import EditIcon from "../../assets/img/icons/edit.png";
import NmpButton from "../nmp/NmpButton";

export const GoogleDriveAuthRequestToast = ({link}) => {

  const openLink = () => {
    return window.open(link, "_blank");
  }

  return <div>
    <NmpButton
      className="mr-1"
      size="sm"
      textColor="#95989a"
      backgroundColor="transparent"
      onClick={openLink}
    >Please click to allow access to Google Drive (only access to documents created by NMP)</NmpButton>
  </div>
}