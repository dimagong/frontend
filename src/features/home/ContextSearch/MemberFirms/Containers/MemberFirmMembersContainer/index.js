import React, {useEffect, useState} from 'react';

import MemberFirmMembersComponent from "./Components/MemberFirmMembersComponent";
import {useDispatch, useSelector} from "react-redux";
import {
  getSelectedMemberFirm,
  getSelectedMemberFirmPotentialUsers,
  getSelectedMemberFirmMembers,
  getSelectedMemberFirmPrincipals,
} from "app/selectors/memberFirmsSelector";

import { createLoadingSelector } from "app/selectors/loadingSelector";

import appSlice from "app/slices/appSlice";

const {
  getMemberFirmUsersRequest,
  getMemberFirmPotentialUsersRequest,
} = appSlice.actions;

const MemberFirmMembersContainer = ({ onNavigateToUserProfile }) => {
  const dispatch = useDispatch();

  const [searchQuery, setSearchQuery] = useState("");

  const selectedMemberFirm = useSelector(getSelectedMemberFirm);
  const potentialMembers = useSelector(getSelectedMemberFirmPotentialUsers);

  const memberFirmMembers = useSelector(getSelectedMemberFirmMembers);
  const memberFirmPrincipals = useSelector(getSelectedMemberFirmPrincipals);

  const isMemberFirmMembersLoading = useSelector(createLoadingSelector([getMemberFirmUsersRequest.type], true));

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filterUsersByName = (users) => {

  };

  useEffect(() => {
    dispatch(getMemberFirmUsersRequest(selectedMemberFirm.id));
    dispatch(getMemberFirmPotentialUsersRequest(selectedMemberFirm.id));
    dispatch(getMemberFirmPotentialUsersRequest(selectedMemberFirm.id))
  }, [selectedMemberFirm.id]);

  return (
    <MemberFirmMembersComponent
      onNavigateToUserProfile={onNavigateToUserProfile}
      searchQuery={searchQuery}
      onSearch={handleSearch}
      isMemberFirmMembersLoading={isMemberFirmMembersLoading}
      members={memberFirmMembers}
      principals={memberFirmPrincipals}
      potentialMembers={potentialMembers}
      memberFirm={selectedMemberFirm}
    />
  )
};


export default MemberFirmMembersContainer;
