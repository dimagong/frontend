import React, {useEffect, useState} from 'react';
import {Modal, ModalBody} from "reactstrap";
import MemberFirmModalTable from "./MemberFirmModalTable";

const MemberFirmEditUsers = ({isModalOpen, setIsModalOpen, managers}) => {
  const [managersIn, setManagersIn] = useState([]);
  const [managersOut, setManagersOut] = useState([]);

  const addUser = (user) => {
    setManagersOut([...managersOut].filter(item => item.id !== user.id))
    setManagersIn([user, ...managersIn])
  }

  const removeUser = (user) => {
    setManagersIn([...managersIn].filter(item => item.id !== user.id))
    setManagersOut([user, ...managersOut])
  }

  useEffect(() => {
    // Temporary set managers in and out
    setManagersIn(managers ? [managers[0], managers[1]] : []);
    setManagersOut(managers ? managers.slice(2) : []);
  }, [managers?.length])

  return (
    <Modal
      size="lg"
      className={"member-firms-users-modal"}
      isOpen={isModalOpen}
      fade={false}
      toggle={()=>{setIsModalOpen(false)}}>
        <ModalBody>
          <MemberFirmModalTable
            array={managersOut}
            setArray={setManagersOut}
            changeUser={addUser}
            isTitle
            isAddUser
          />
          <div style={{fontWeight: 'bold'}}>Existing</div>
          <MemberFirmModalTable
            array={managersIn}
            changeUser={removeUser}
          />
        </ModalBody>
      </Modal>
  )
};

export default MemberFirmEditUsers;
