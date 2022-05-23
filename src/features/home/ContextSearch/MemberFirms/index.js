import React, { useEffect, useRef } from "react";

import { createLoadingSelector } from "app/selectors/loadingSelector";
import { getSelectedMemberFirm } from "app/selectors/memberFirmsSelector";
import { useSelector, useDispatch } from "react-redux";
import "./index.scss";

import {
  getSelectedMemberFirmMSFields,
  getSelectedMemberFirmFormFields,
  getSelectedMemberFirmActivities,
} from "app/selectors/memberFirmsSelector";

import MemberFirmMembersContainer from "./Containers/MemberFirmMembersContainer";
import MemberFirmProfileComponent from "./Components/MemberFirmProfileComponent";

import { Row } from "reactstrap";

import appSlice from "app/slices/appSlice";

const {
  getMasterSchemaFieldsForMemberFirmRequest,
  getMemberFirmFormFieldsRequest,
  getMemberFirmActivitiesRequest,
  setContext,
  setManager,
} = appSlice.actions;

const MemberFirmsContainer = () => {
  const dispatch = useDispatch();

  const memberFirmData = useSelector(getSelectedMemberFirm);
  const memberFirmFormFields = useSelector(getSelectedMemberFirmFormFields);
  const masterSchemaMemberFirmFields = useSelector(getSelectedMemberFirmMSFields);
  const memberFirmActivities = useSelector(getSelectedMemberFirmActivities);

  const isMemberFirmFormFieldsLoading = useSelector(createLoadingSelector([getMemberFirmFormFieldsRequest.type], true));
  const isMasterSchemaFieldsForMemberFirmLoading = useSelector(
    createLoadingSelector([getMasterSchemaFieldsForMemberFirmRequest.type], true)
  );
  const isMemberFirmActivitiesLoading = useSelector(createLoadingSelector([getMemberFirmActivitiesRequest.type], true));

  const handleNavigateToUserProfile = (user) => {
    dispatch(setManager(user));
    dispatch(setContext("User"));
  };

  const handleLoadMoreDataForActivities = () => {};

  useEffect(() => {
    dispatch(getMasterSchemaFieldsForMemberFirmRequest(memberFirmData.id));
    dispatch(getMemberFirmFormFieldsRequest(memberFirmData.id));
    dispatch(getMemberFirmActivitiesRequest({ memberFirmId: memberFirmData.id, page: 1 }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [memberFirmData.id]);

  return (
    <Row>
      <MemberFirmProfileComponent
        data={memberFirmData}
        memberFirmId={memberFirmData.id}
        isMemberFirmFormFieldsLoading={isMemberFirmFormFieldsLoading}
        isMasterSchemaFieldsForMemberFirmLoading={isMasterSchemaFieldsForMemberFirmLoading}
        isMemberFirmActivitiesLoading={isMemberFirmActivitiesLoading}
        onLoadMoreDataForActivities={handleLoadMoreDataForActivities}
        memberFirmFormFields={memberFirmFormFields}
        masterSchemaMemberFirmFields={masterSchemaMemberFirmFields}
        memberFirmActivities={memberFirmActivities}
      />
      <MemberFirmMembersContainer
        memberFirmId={memberFirmData.id}
        onNavigateToUserProfile={handleNavigateToUserProfile}
      />
    </Row>
  );
};

export default MemberFirmsContainer;
