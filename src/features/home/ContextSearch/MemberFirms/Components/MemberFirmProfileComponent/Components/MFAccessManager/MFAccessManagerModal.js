import React from "react";
import { Settings } from "react-feather";

import { useBoolean } from "hooks/use-boolean";

import CustomModal from "components/CustomModal";

const MFAccessManagerModal = ({ children }) => {
  const [modal, openModal, closeModal] = useBoolean(false);

  return (
    <>
      <button className="btn p-0 member-firm-role__settings" onClick={openModal}>
        <Settings className="member-firm-role__settings-icon" />
      </button>

      <CustomModal
        onClose={closeModal}
        isOpen={modal}
        title="Access Manager"
        size="sm"
        submitBtnText="Save"
        footerDisabled
      >
        {children}
      </CustomModal>
    </>
  );
};

export default MFAccessManagerModal;
