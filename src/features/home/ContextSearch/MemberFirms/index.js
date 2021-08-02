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

import {
  getSelectedMemberFirmMSFields,
  getSelectedMemberFirmFormFields,
} from "app/selectors/memberFirmsSelector";

import MemberFirmMembersContainer from "./Containers/MemberFirmMembersContainer";
import MemberFirmProfileComponent from "./Components/MemberFirmProfileComponent";

import {Row} from 'reactstrap';

import appSlice from "app/slices/appSlice";

const {
  getMasterSchemaFieldsForMemberFirmRequest,
  getMemberFirmFormFieldsRequest,
} = appSlice.actions;

const MemberFirmsContainer = () => {
  const dispatch = useDispatch();

  const managers = useSelector(selectManagers);

  const memberFirmData = useSelector(getSelectedMemberFirm);
  const memberFirmFormFields = useSelector(getSelectedMemberFirmFormFields);
  const masterSchemaMemberFirmFields = useSelector(getSelectedMemberFirmMSFields);

  const isMemberFirmFormFieldsLoading = useSelector(createLoadingSelector([getMemberFirmFormFieldsRequest.type], true));
  const isMasterSchemaFieldsForMemberFirmLoading = useSelector(createLoadingSelector([getMasterSchemaFieldsForMemberFirmRequest.type], true));


  useEffect(() => {
    dispatch(getMasterSchemaFieldsForMemberFirmRequest(memberFirmData.id));
    dispatch(getMemberFirmFormFieldsRequest(memberFirmData.id));
  }, [memberFirmData.id]);

  return (
    <Row>
      <MemberFirmProfileComponent
        memberFirmId={memberFirmData.id}
        data={memberFirmData}
        isMemberFirmFormFieldsLoading={isMemberFirmFormFieldsLoading}
        isMasterSchemaFieldsForMemberFirmLoading={isMasterSchemaFieldsForMemberFirmLoading}
        memberFirmFormFields={memberFirmFormFields}
        masterSchemaMemberFirmFields={masterSchemaMemberFirmFields}
      />
      <MemberFirmMembersContainer memberFirmId={memberFirmData.id} />
      {/*<MemberFirmsContent*/}
      {/*  managers={managers}*/}
      {/*/>*/}
    </Row>
  )
};

export default MemberFirmsContainer;
