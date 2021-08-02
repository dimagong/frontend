import React, {useState} from 'react';

import ContextFeatureTemplate from "components/ContextFeatureTemplate";

import { Button } from 'reactstrap'
import {Settings} from 'react-feather';
import MemberFirmEditUsers from "../../../../MemberFirmEditUsers";
import MemberFirmUsersList from "./Components/MemberFirmUsersList";

import "./styles.scss"

const MemberFirmMembersComponent = ({members, principals, potentialMembers, memberFirm, isMemberFirmMembersLoading}) => {

  const [isEditUserModalOpened, setIsEditUserModalOpened] = useState(false);

  const allMembers = [...members, ...principals];

  return (
    <ContextFeatureTemplate contextFeatureTitle="Associated members" isSearchEnabled onSearchValueChange={() => {}} searchValue={""}>
      <div className="member-firm-associated-members">
        <MemberFirmUsersList
          className={"principals"}
          users={principals}
          label="Principals"
          isLoading={isMemberFirmMembersLoading}
        />
        <MemberFirmUsersList
          className={"members"}
          users={members}
          label="Members"
          isLoading={isMemberFirmMembersLoading}
        />
      </div>

      <Button
        className="member-firm-associated-members_settings-button"
        color="primary"
        onClick={() => setIsEditUserModalOpened(true)}
      >
        <Settings />
      </Button>

      <MemberFirmEditUsers
        isModalOpen={isEditUserModalOpened}
        setIsModalOpen={setIsEditUserModalOpened}
        members={(potentialMembers && allMembers) ? potentialMembers.filter(item => allMembers.findIndex(element => element.id === item.id) !== -1) : []}
        potentialMembers={potentialMembers
          ? potentialMembers.filter(item => allMembers.findIndex(element => element.id === item.id) === -1)
          : []}
        memberFirm={memberFirm}
      />
    </ContextFeatureTemplate>
  )
};

export default MemberFirmMembersComponent;
