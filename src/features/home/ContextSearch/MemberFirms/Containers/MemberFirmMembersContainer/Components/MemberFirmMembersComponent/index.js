import React, {useState} from 'react';

import ContextFeatureTemplate from "components/ContextFeatureTemplate";

import { Button } from 'reactstrap'
import {Settings} from 'react-feather';
import MemberFirmEditUsers from "../../../../MemberFirmEditUsers";
import MemberFirmUsersList from "./Components/MemberFirmUsersList";

import "./styles.scss"

const MemberFirmMembersComponent = ({members, principals, potentialMembers, memberFirm, isMemberFirmMembersLoading, searchQuery, onSearch}) => {

  const [isEditUserModalOpened, setIsEditUserModalOpened] = useState(false);

  const allMembers = [...members, ...principals];


  const isUserMatchSearchQuery = (user) => {
    if (!searchQuery) return true;

    return !!~(user.first_name + " " + user.last_name).toLowerCase().search(searchQuery.toLowerCase());
  };

  return (
    <ContextFeatureTemplate contextFeatureTitle="Associated members" isSearchEnabled onSearchValueChange={onSearch} searchValue={searchQuery}>
      <div className="member-firm-associated-members">
        <MemberFirmUsersList
          className={"principals"}
          users={principals.filter(user => isUserMatchSearchQuery(user))}
          label="Principals"
          isLoading={isMemberFirmMembersLoading}
          isSearch={!!searchQuery}
        />
        <MemberFirmUsersList
          className={"members"}
          users={members.filter(user => isUserMatchSearchQuery(user))}
          label="Members"
          isLoading={isMemberFirmMembersLoading}
          isSearch={!!searchQuery}
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
        allMembers={allMembers}
        isModalOpen={isEditUserModalOpened}
        setIsModalOpen={setIsEditUserModalOpened}
        members={(potentialMembers && allMembers) ? potentialMembers.filter(item => allMembers.findIndex(element => element.id === item.id) !== -1) : []}
        potentialMembers={potentialMembers
          ? potentialMembers.filter(item => allMembers.findIndex(element => element.id === item.id) === -1)
          : []}
        memberFirm={memberFirm}
        principals={principals}
      />
    </ContextFeatureTemplate>
  )
};

export default MemberFirmMembersComponent;
