import React, { useState, useEffect } from "react";
import { Card, CardBody, Row, Col, Nav, NavItem, NavLink, TabContent, TabPane } from "reactstrap";
import classnames from "classnames";
import { useDispatch, useSelector } from "react-redux";
import { selectManager, selectManagers } from "app/selectors";
import { navItemFactory } from "./contants";
import UserEdit from "./userEdit/UserEdit";
import { useRouter } from "hooks/useRouter";

import appSlice from "app/slices/appSlice";

const { getUserManagment, setManager } = appSlice.actions;

const UserManagment = () => {
  const manager = useSelector(selectManager);
  const managers = useSelector(selectManagers);
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("1");
  const { query } = useRouter();

  useEffect(() => {
    !managers.length && dispatch(getUserManagment());
  }, []);

  useEffect(() => {
    if (query.user_id && managers.length) {
      dispatch(setManager(managers.find((manager) => manager.id === +query.user_id)));
    }
  }, [managers]);

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
                <TabPane tabId={`${index + 1}`}>{component({ activeTab })}</TabPane>
              ))}
            </TabContent>
          </CardBody>
        </Card>
      </Col>
      <Col sm="12" md="12" lg="12" xl="7">
        {manager ? <UserEdit /> : null}
      </Col>
    </Row>
  );
};

export default UserManagment;