import "./userCard.scss";

import React from "react";
import { Edit } from "react-feather";
import { useDispatch } from "react-redux";
import { Card, CardBody, CardText, CardTitle } from "reactstrap";

import appSlice from "app/slices/appSlice";
import { capitalizeAll } from "utility/common";
import NmpUserAvatar from "components/nmp/NmpUserAvatar";

const { setContext, setSelectedMemberFirmId } = appSlice.actions;

const UserCardTemplate = ({ className, oneColumn, onClick, editable = false, onEdit = () => {}, ...manager }) => {
  const dispatch = useDispatch();

  const handleNavigateToMemberFirm = (e, memberFirmId) => {
    e.stopPropagation();
    dispatch(setSelectedMemberFirmId(memberFirmId));
    dispatch(setContext("Member Firms"));
  };

  return (
    <div>
      <Card
        key={manager.email}
        className={"flex-row home__card user-card " + className}
        onClick={(e) => {
          onClick(e, manager);
        }}
      >
        <div className="mr-1">
          <NmpUserAvatar
            userId={manager.id}
            fileId={manager.avatar?.id}
            isEditable={editable}
            className="user-card-img d-sm-flex d-none card-img"
          />
        </div>

        <CardBody className="user-card-body">
          <div className="user-card-body-left">
            <div>
              <CardTitle className="m-0 user-card-body_title">
                {`${manager.first_name} ${manager.last_name}`}
                {!!editable && (
                  <Edit
                    onClick={() => {
                      onEdit();
                    }}
                    style={{ marginLeft: "5px", marginBottom: "3px", cursor: "pointer" }}
                    size={15}
                  />
                )}
              </CardTitle>
              <CardText style={{ marginBottom: "5px" }}>
                {manager?.permissions?.ability && capitalizeAll(manager.permissions.ability.replace("_", " "))}
              </CardText>
            </div>
            <div>
              <CardText>
                <span style={{ paddingRight: "6px" }}>E:</span> {manager.email ? `${manager.email}` : "email is empty"}
              </CardText>
              {!!manager.number && <CardText>M: {manager.number}</CardText>}
            </div>
          </div>
          <div className="user-card-body-right">
            <CardText>
              {manager.permissions?.organization} <br />
              {!!manager.member_firm && (
                <span
                  onClick={(e) => {
                    handleNavigateToMemberFirm(e, manager.member_firm.id);
                  }}
                  className="user-card-body-right-member_firm_name"
                >
                  {manager.member_firm.main_fields.name}
                </span>
              )}
            </CardText>
            <CardText className="user-card-body_last-seen">{/*Last seen 3 days ago*/}</CardText>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default UserCardTemplate;
