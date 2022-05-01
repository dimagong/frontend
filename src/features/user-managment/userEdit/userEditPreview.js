import React, { useState, useRef, useEffect } from "react";
import {
  Card,
  CardTitle,
  CardBody,
  NavItem,
  CardImg,
  CardText,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
} from "reactstrap";

import UserRoles from "../../../components/UserRoles";

import { useDispatch, useSelector } from "react-redux";
import { selectManagers } from "app/selectors";

import { selectOrganizations } from "app/selectors/groupSelector";

import { selectPreview } from "../../../app/selectors/layoutSelector";
import noneAvatar from "../../../assets/img/portrait/none-avatar.png";

import "./userEditPreview.scss";
import { selectUserOrganizations } from "app/selectors/userSelectors";

import { capitalizeAll } from "../../../utility/common";

import appSlice from "app/slices/appSlice";

const { getUserOnboardingRequest, getOrganizationsRequest, getUserOrganizationsRequest } = appSlice.actions;

const UserEditPreview = () => {
  const [activeTab, setActiveTab] = useState("Permissions");

  const preview = useSelector(selectPreview);
  const dispatch = useDispatch();
  const managers = useSelector(selectManagers);

  const organizations = useSelector(selectOrganizations);

  const manager = managers.filter(({ id }) => id === preview.id)[0];

  const userOrganizations = useSelector(selectUserOrganizations(manager.id));

  useEffect(() => {
    // todo what is that
    dispatch(getUserOnboardingRequest({ userId: manager.id }));
    if (organizations.length === 0) {
      dispatch(getOrganizationsRequest());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    dispatch(getUserOrganizationsRequest(manager.id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [manager.id]);

  const modalContainer = useRef();

  const selectItems = ["Permissions", "Activity", "Applications", "MasterSchema"];

  return (
    <div className="user-managment user-edit-preview" ref={modalContainer}>
      <Card className="tablet-hidden">
        <CardImg variant="top" src={manager.url ? manager.url : noneAvatar} />
        <CardBody className="user-edit-preview_body">
          <CardTitle className="title">{`${manager.first_name} ${manager.last_name}`}</CardTitle>
          <CardText className="mb-0 email">
            <span style={{ paddingRight: "6px" }}>E:</span> {manager.email ? `${manager.email}` : "email is empty"}
          </CardText>
          {!!manager.number && <CardText>M: {manager.number}</CardText>}

          <CardText className="mt-3">
            {manager?.permissions?.ability && manager?.permissions?.organization
              ? capitalizeAll(manager?.permissions?.ability.replace("_", " ")) +
                " at " +
                manager?.permissions?.organization
              : ""}
          </CardText>
        </CardBody>
      </Card>
      <Card key={manager.email} className="flex-row home__card cursor-pointer tablet-visible preview-card">
        <CardImg
          variant="top"
          src={manager.url ? manager.url : noneAvatar}
          className="user-card-img d-sm-flex d-none"
        />
        <CardBody className="user-card-body">
          <div className="user-card-body-left">
            <div>
              <CardTitle className="m-0 user-card-body_title">{`${manager.first_name} ${manager.last_name}`}</CardTitle>
              <CardText style={{ marginBottom: "5px" }}>
                {capitalizeAll(manager?.permissions?.ability.replace("_", " "))}
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
            <CardText>{manager?.permissions?.organization}</CardText>
            <UncontrolledDropdown>
              <DropdownToggle nav caret={true} style={{ fontSize: "18px" }}>
                {activeTab}
              </DropdownToggle>
              <DropdownMenu right>
                {selectItems.map((item) => (
                  <DropdownItem
                    onClick={() => {
                      setActiveTab(item);
                    }}
                    disabled={item !== "permissions"}
                  >
                    <NavItem style={{ fontSize: "16px" }}>{item}</NavItem>
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </UncontrolledDropdown>
          </div>
        </CardBody>
      </Card>
      <div>
        <Card className="tablet-hidden">
          <CardBody>
            <UncontrolledDropdown>
              <DropdownToggle style={{ fontSize: "22px" }} nav caret={true}>
                {activeTab}
              </DropdownToggle>
              <DropdownMenu left>
                {selectItems.map((item) => (
                  <DropdownItem
                    onClick={() => {
                      setActiveTab(item);
                    }}
                    disabled={item !== "permissions"}
                  >
                    <NavItem style={{ fontSize: "18px" }}>{item}</NavItem>
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </UncontrolledDropdown>
          </CardBody>
        </Card>

        <UserRoles manager={manager} userOrganizations={userOrganizations} />
      </div>
    </div>
  );
};

export default UserEditPreview;
