import React, {useEffect} from 'react';

import MemberFirmMembersComponent from "./Components/MemberFirmMembersComponent";
import {useDispatch, useSelector} from "react-redux";
import {
  getSelectedMemberFirm,
  getSelectedMemberFirmPotentialUsers,
  getSelectedMemberFirmUsers
} from "app/selectors/memberFirmsSelector";
import appSlice from "app/slices/appSlice";

const {
  getMemberFirmUsersRequest,
  getMemberFirmPotentialUsersRequest,
} = appSlice.actions;

const MemberFirmMembersContainer = () => {
  const dispatch = useDispatch()
  const selectedMemberFirm = useSelector(getSelectedMemberFirm)
  const members = useSelector(getSelectedMemberFirmUsers)
  const potentialMembers = useSelector(getSelectedMemberFirmPotentialUsers)

  useEffect(() => {
    dispatch(getMemberFirmUsersRequest(selectedMemberFirm.id))
    dispatch(getMemberFirmPotentialUsersRequest(selectedMemberFirm.id))
    dispatch(getMemberFirmPotentialUsersRequest(selectedMemberFirm.id))
  }, [selectedMemberFirm])

  return (
    <MemberFirmMembersComponent
      members={members}
      potentialMembers={potentialMembers}
      memberFirm={selectedMemberFirm}
    />
  )
};


export default MemberFirmMembersContainer;
