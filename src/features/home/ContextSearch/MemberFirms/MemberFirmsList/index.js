import React, { useEffect } from 'react';
import {
  Button,
  Card,
  CardBody,
  CardImg, CardText, CardTitle,
  Col,
  Pagination,
  PaginationItem,
  PaginationLink,
  Row,
  Spinner
} from "reactstrap";
import {useDispatch, useSelector} from "react-redux";
import appSlice from "app/slices/appSlice";

import noneAvatar from "../../../../../assets/img/portrait/none-avatar.png";

import { createLoadingSelector } from "app/selectors/loadingSelector";

import {
  getMemberFirms,
} from "app/selectors/memberFirmsSelector";

const {
  setContext,
  getMemberFirmsRequest,
  setSelectedMemberFirmId,
} = appSlice.actions;


const UserCardTemplate = ({className, onClick, data }) => {

  return (
    <div>
      <Card
        key={data.id}
        className={"flex-row home__card user-card " + className}
        onClick={() => {
          onClick(data.id)
        }}
      >

        <div className="user-avatar-management">
          <CardImg variant="top" src={noneAvatar} className="user-card-img d-sm-flex d-none" />
        </div>

        <CardBody className="user-card-body">
          <div className="user-card-body-left">
            <div>
              <CardTitle className="m-0 user-card-body_title">
                {data.name}
              </CardTitle>
            </div>
            {/*<div>*/}
            {/*  <CardText>*/}
            {/*    <span style={{paddingRight: "6px"}}>E:</span> jane.doe@citycapital.co.uk*/}
            {/*  </CardText>*/}
            {/*    <CardText>*/}
            {/*      M: +49 332 423 2344*/}
            {/*    </CardText>*/}
            {/*</div>*/}
          </div>
          <div className="user-card-body-right">
            {/*<CardText>*/}
            {/*  organization logo*/}
            {/*</CardText>*/}
            {/*<CardText className="user-card-body_last-seen">*/}
            {/*  Last seen 3 days ago*/}
            {/*</CardText>*/}
          </div>
        </CardBody>
      </Card>
    </div>
  )
}



const MemberFirmsList = () => {
  const dispatch = useDispatch();

  const memberFirms = useSelector(getMemberFirms);
  const isMemberFirmsLoading = useSelector(createLoadingSelector([getMemberFirmsRequest.type]));

  const handleMemberFirmSelect = (memberFirmId) => {
    dispatch(setSelectedMemberFirmId(memberFirmId));
    dispatch(setContext(`Member Firms`));
  };

  useEffect(() => {
    dispatch(getMemberFirmsRequest())
  }, []);

  if (isMemberFirmsLoading) {
    return (
      <Row>
        <Col className={`home__card-wrapper`}>
          <div>Loading...</div>
        </Col>
      </Row>
    )
  }

  return (
    <Row>
      <Col className={`home__card-wrapper`}>
        {memberFirms.data.map(memberFirm => (
          <UserCardTemplate
            data={memberFirm}
            className="cursor-pointer"
            onClick={handleMemberFirmSelect}
          />
        ))}
      </Col>
    </Row>
  );
};

export default MemberFirmsList;
