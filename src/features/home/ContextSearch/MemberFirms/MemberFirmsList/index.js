import React, {Fragment, useEffect, useRef, useState} from 'react';
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

const {
  setContext,
} = appSlice.actions;


const UserCardTemplate = ({className, onClick, ...manager }) => {

  return (
    <div>
      <Card
        key={Math.random()}
        className={"flex-row home__card user-card " + className}
        onClick={(e) => {
          onClick()
        }}
      >

        <div className="user-avatar-management">
          <CardImg variant="top" src={noneAvatar} className="user-card-img d-sm-flex d-none" />
        </div>

        <CardBody className="user-card-body">
          <div className="user-card-body-left">
            <div>
              <CardTitle className="m-0 user-card-body_title">
                City Capital
              </CardTitle>
            </div>
            <div>
              <CardText>
                <span style={{paddingRight: "6px"}}>E:</span> jane.doe@citycapital.co.uk
              </CardText>
                <CardText>
                  M: +49 332 423 2344
                </CardText>
            </div>
          </div>
          <div className="user-card-body-right">
            <CardText>
              organization logo
            </CardText>
            <CardText className="user-card-body_last-seen">
              Last seen 3 days ago
            </CardText>
          </div>
        </CardBody>
      </Card>
    </div>
  )
}



const MemberFirmsList = () => {
  const dispatch = useDispatch();

  return (
    <Row>
      <Col className={`home__card-wrapper`}>
        {Array.from({length: 9}).map(memberFirm => (
          <UserCardTemplate className="cursor-pointer" onClick={() => dispatch(setContext('Member Firms'))} />
        ))}
      </Col>
    </Row>
  );
};

export default MemberFirmsList;
