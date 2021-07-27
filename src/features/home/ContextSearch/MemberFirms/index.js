import React, { useEffect } from 'react';
import MemberFirmsContent from "./MemberFirmsContent";
import {selectManagers} from "app/selectors";

import { createLoadingSelector } from "app/selectors/loadingSelector";
import { getSelectedMemberFirm } from "app/selectors/memberFirmsSelector";
import {
  useSelector,
  useDispatch,
} from "react-redux";
import './index.scss';

import MemberFirmMembersContainer from "./Containers/MemberFirmMembersContainer";
import MemberFirmMembersComponent from "./Containers/MemberFirmMembersContainer/Components/MemberFirmMembersComponent";

import {Row} from 'reactstrap';

import appSlice from "app/slices/appSlice";

const {

} = appSlice.actions;

const MemberFirmsContainer = () => {
  const dispatch = useDispatch();

  const managers = useSelector(selectManagers);

  const memberFirmData = useSelector(getSelectedMemberFirm);

  return (
    <Row>

      <MemberFirmMembersComponent />
      <MemberFirmMembersContainer memberFirmId={memberFirmData.id} />
      {/*<MemberFirmsContent*/}
      {/*  managers={managers}*/}
      {/*/>*/}
    </Row>
  )
};

export default MemberFirmsContainer;
