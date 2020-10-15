import React, { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  Row,
  Col,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
} from "reactstrap";
import classnames from "classnames";
// import UserCreate from './UserCreate'
// import UserList from './UserList'
// import InvitationList from '../invitation/InvitationList'
// import UserEdit from './UserEdit'
import { ToastContainer } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { selectGroups, selectRoles, selectManager, selectManagers } from "app/selectors";
import { getUserManagment } from "app/slices/appSlice";
import { navItemFactory } from "./contants";
import UserEdit from './userEdit/UserEdit'

const UserManagment = () => {
  const manager = useSelector(selectManager);
  const managers = useSelector(selectManagers);
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("1");

  useEffect(() => {
    !managers.length && dispatch(getUserManagment());
  }, []);

  return (
    <Row className="user-managment">
      <Col sm="12" md="12" lg="12" xl="5">
        <Card>
          <CardBody className="pt-2">
            <Nav tabs>
              {navItemFactory.map(({ title, icon }, index) => (
                <NavItem>
                  <NavLink
                    className={classnames({
                      active: activeTab === `${index + 1}`,
                    })}
                    onClick={() => {
                      setActiveTab(`${index + 1}`);
                    }}
                  >
                    {icon()}
                    <span className="align-middle ml-50">{title}</span>
                  </NavLink>
                </NavItem>
              ))}
            </Nav>
            <TabContent activeTab={activeTab}>
              {navItemFactory.map(({ component }, index) => (
                <TabPane tabId={`${index + 1}`}>{component({activeTab})}</TabPane>
              ))}
            </TabContent>
          </CardBody>
        </Card>
      </Col>
      <Col sm="12" md="12" lg="12" xl="7">
        {manager ? <UserEdit /> : null}
      </Col>
      <ToastContainer />
    </Row>
  );
};

export default UserManagment;
