import React, {Fragment, useState} from 'react';
import MemberFirmEditUsers from "./MemberFirmEditUsers";
import {Button} from "reactstrap";

const MemberFirmsContent = ({ managers }) => {
  const [isEditUsersModalOpen, setIsEditUsersModalOpen] = useState(false);
  return (
    <Fragment>
      <Button onClick={() => setIsEditUsersModalOpen(!isEditUsersModalOpen)}>Open modal</Button>
      <MemberFirmEditUsers
        isModalOpen={isEditUsersModalOpen}
        setIsModalOpen={setIsEditUsersModalOpen}
        managers={managers}
      />
    </Fragment>
  )
};

export default MemberFirmsContent;
