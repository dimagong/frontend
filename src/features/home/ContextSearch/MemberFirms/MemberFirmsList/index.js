import React, { useEffect, useState } from "react";
import { Card, CardBody, CardImg, CardText, CardTitle, Col, Row } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import appSlice from "app/slices/appSlice";
import MemberFirmsListEmptyComponent from "./Components/MemberFirmsListEmptyComponent";
import noneAvatar from "../../../../../assets/img/portrait/none-avatar.png";

import { createLoadingSelector } from "app/selectors/loadingSelector";

import CustomPagination from "components/Pagination";

import { getMemberFirms } from "app/selectors/memberFirmsSelector";

const { setContext, getMemberFirmsRequest, getOrganizationsRequest, setSelectedMemberFirmId } = appSlice.actions;

const UserCardTemplate = ({ className, onClick, data }) => {
  return (
    <div>
      <Card
        key={data.id}
        className={"flex-row home__card user-card " + className}
        onClick={() => {
          onClick(data.id);
        }}
      >
        <div className="user-avatar-management">
          <CardImg src={data.logo_path || noneAvatar} className="user-card-img user-card-img-fit-contain" />
        </div>

        <CardBody className="user-card-body">
          <div className="user-card-body-left">
            <div>
              <CardTitle className="m-0 user-card-body_title">{data.main_fields.name}</CardTitle>
              <CardText style={{ marginBottom: "5px" }}>
                {`${data.numberOfMembers} member${data.numberOfMembers === 1 ? "" : "s"}`}
              </CardText>
            </div>
            <div>
              {!!data.main_fields.email && (
                <CardText>
                  <span style={{ paddingRight: "6px" }}>E:</span> {data.main_fields.email}
                </CardText>
              )}
              {!!data.main_fields.contactNumber && <CardText>M: {data.main_fields.contactNumber}</CardText>}
            </div>
          </div>
          <div className="user-card-body-right">
            {/* <CardText>*/}
            {/*  organization logo*/}
            {/*</CardText>*/}
            {/*<CardText className="user-card-body_last-seen">*/}
            {/*  Last seen 3 days ago*/}
            {/*</CardText> */}
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

const MemberFirmsList = () => {
  const dispatch = useDispatch();

  const [currentPage, setCurrentPage] = useState(0);

  const memberFirms = useSelector(getMemberFirms);
  const isMemberFirmsLoading = useSelector(createLoadingSelector([getMemberFirmsRequest.type]));

  const handleMemberFirmSelect = (memberFirmId) => {
    dispatch(setSelectedMemberFirmId(memberFirmId));
    dispatch(setContext(`Member Firms`));
  };

  useEffect(() => {
    dispatch(getMemberFirmsRequest());
    dispatch(getOrganizationsRequest());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isMemberFirmsLoading) {
    return (
      <Row>
        <Col className={`home__card-wrapper`}>
          <div>Loading...</div>
        </Col>
      </Row>
    );
  }

  if (!memberFirms.length) {
    return <MemberFirmsListEmptyComponent isLoading={isMemberFirmsLoading} />;
  }

  const ITEMS_PER_PAGE = 9;

  const totalPages = Math.ceil(memberFirms.length / ITEMS_PER_PAGE);

  const currentPageMemberFirms = memberFirms.slice(
    currentPage * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE + ITEMS_PER_PAGE
  );

  return (
    <Row>
      <Col className={`home__card-wrapper`}>
        {currentPageMemberFirms.map((memberFirm, idx) => (
          <UserCardTemplate data={memberFirm} className="cursor-pointer" onClick={handleMemberFirmSelect} key={idx} />
        ))}

        {memberFirms.length > 9 && (
          <CustomPagination setPage={setCurrentPage} totalPages={totalPages} currentPage={currentPage} />
        )}
      </Col>
    </Row>
  );
};

export default MemberFirmsList;
