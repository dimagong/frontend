import React from 'react';
import {Modal, ModalBody} from "reactstrap";

const MemberFirmEditUsers = ({isModalOpen, setIsModalOpen}) => {

  return (
    <Modal className={"member-firms-users-modal"} isOpen={isModalOpen} fade={false} toggle={()=>{setIsModalOpen(false)}}>
        <ModalBody>
          Content
        </ModalBody>
      </Modal>
  )
};

export default MemberFirmEditUsers;
