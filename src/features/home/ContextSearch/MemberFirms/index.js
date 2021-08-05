import React, { useEffect, useRef } from 'react';

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
  updateMemberFirmProfileImageRequest,
  removeMemberFirmLogoRequest,
  setContext,
  setManager,
} = appSlice.actions;

const MemberFirmsContainer = () => {
  const dispatch = useDispatch();

  const logoFileInputRef = useRef();

  const memberFirmData = useSelector(getSelectedMemberFirm);
  const memberFirmFormFields = useSelector(getSelectedMemberFirmFormFields);
  const masterSchemaMemberFirmFields = useSelector(getSelectedMemberFirmMSFields);

  const isMemberFirmFormFieldsLoading = useSelector(createLoadingSelector([getMemberFirmFormFieldsRequest.type], true));
  const isMasterSchemaFieldsForMemberFirmLoading = useSelector(createLoadingSelector([getMasterSchemaFieldsForMemberFirmRequest.type], true));


  const handleFileInputDialogOpen = () => {
    logoFileInputRef.current.click()
  };

  const handleLogoChange = (event) => {
    if(event.target.files.length){

      const formData = new FormData();
      formData.set('logo', event.target.files[0]);


      dispatch(updateMemberFirmProfileImageRequest({memberFirmId: memberFirmData.id, logo: formData}))
    }
  };

  const handleLogoRemove = () => {
    dispatch(removeMemberFirmLogoRequest(memberFirmData.id))
  };

  const handleNavigateToUserProfile = (user) => {
    dispatch(setManager(user));
    dispatch(setContext("User"))
  };

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
        onLogoChange={handleLogoChange}
        onFileInputDialogOpen={handleFileInputDialogOpen}
        logoFileInputRef={logoFileInputRef}
        onLogoRemove={handleLogoRemove}
      />
      <MemberFirmMembersContainer
        memberFirmId={memberFirmData.id}
        onNavigateToUserProfile={handleNavigateToUserProfile}
      />
    </Row>
  )
};

export default MemberFirmsContainer;
