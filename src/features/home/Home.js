import React, { useEffect, useState } from "react";
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
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  NavbarText,
  Button,
  CardImg,
  CardText,
  CardTitle,
  Pagination,
  PaginationItem,
  PaginationLink,
  Spinner,
} from "reactstrap";
import classnames from "classnames";
// import UserCreate from './UserCreate'
// import UserList from './UserList'
// import InvitationList from '../invitation/InvitationList'
// import UserEdit from './UserEdit'
import { ToastContainer } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import {
  selectGroups,
  selectRoles,
  selectManager,
  selectManagers,
} from "app/selectors";
import { getUserManagment } from "app/slices/appSlice";
import { ChangeDetectionStrategyType } from "ag-grid-react/lib/changeDetectionService";
// import { ContextLayout } from "utility/context/Layout";
import { AgGridReact } from "ag-grid-react";
import {
  masterSchemaPath,
  notificationsPath,
  dformsPath,
  workflowsPath,
  userManagmentPath,
  userManagmentOptionsPath
} from "constants/paths";
import noneAvatar from "assets/img/portrait/none-avatar.png";
import { useRouter } from "hooks/useRouter";

const Home = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const manager = useSelector(selectManager);
  const managers = useSelector(selectManagers);
  const dispatch = useDispatch();
  const { push } = useRouter();

  useEffect(() => {
    !managers.length && dispatch(getUserManagment());
  }, []);

  const toggle = () => setIsOpen(!isOpen);

  const getPagination = () => {
   return Array.from(Array(Math.ceil(managers.length/8)))
  }

  const users = (number) => {
    return managers.slice(8 * number, 8 * (number + 1))
  }

  const redirectToManager = (id) => {
    push(userManagmentOptionsPath(id))
  }

  return (
    <Row className="home">
      <Col sm="12" md="12" lg="12" xl="9">
        <Card>
          <CardBody className="pt-2">
            <Row className="app-user-list">
              <Col sm="12">
                <Card>
                  <CardBody>
                    <div className="grid">
                      <Row>
                        <Col>
                          <Navbar light expand="md">
                            <Nav>
                              <NavItem>
                                <NavLink href={userManagmentPath}>
                                  Users
                                </NavLink>
                              </NavItem>
                            </Nav>

                            <NavbarToggler onClick={toggle} />
                            <Collapse isOpen={isOpen} navbar>
                              <Nav className="ml-auto" navbar>
                                <NavItem>
                                  <NavLink href={masterSchemaPath}>
                                    MasterSchema
                                  </NavLink>
                                </NavItem>
                                <UncontrolledDropdown nav inNavbar>
                                  <DropdownToggle nav caret={true}>
                                    Onboarding
                                  </DropdownToggle>
                                  <DropdownMenu right>
                                    <DropdownItem>
                                      <NavItem>
                                        <NavLink href={notificationsPath}>
                                          Notifications
                                        </NavLink>
                                      </NavItem>
                                    </DropdownItem>
                                    <DropdownItem>
                                      <NavItem>
                                        <NavLink href={dformsPath}>
                                          dForm
                                        </NavLink>
                                      </NavItem>
                                    </DropdownItem>
                                    <DropdownItem>
                                      <NavItem>
                                        <NavLink href={workflowsPath}>
                                          Workflows
                                        </NavLink>
                                      </NavItem>
                                    </DropdownItem>
                                  </DropdownMenu>
                                </UncontrolledDropdown>
                              </Nav>
                            </Collapse>
                          </Navbar>
                        </Col>
                      </Row>
                      <Row>
                        <Col className="home__card-wrapper">
                          {
                             users(activeTab).map((manager) => (
                                <Card
                                  key={`${manager.email}`}
                                  className="flex-row flex-wrap home__card"
                                  onClick={() => redirectToManager(manager.id)}
                                >
                                  <CardImg variant="top" src={noneAvatar} className="round user-nav d-sm-flex d-none" />
                                  <CardBody>
                                    <CardTitle>{`${manager.first_name} ${manager.last_name}`}</CardTitle>
                                    <CardText>
                                      {manager.number ? `${manager.number}` : "phone number is empty"}
                                    </CardText>
                                    <CardText>
                                      {manager.email ? `${manager.email}` : "email number is empty"}
                                    </CardText>
                                  </CardBody>
                                </Card>
                              ))
                           }
                        </Col>
                      </Row>
                        <Pagination aria-label="Page navigation">
                          {getPagination().map( (_, index) => (
                            <PaginationItem key={index} active={activeTab === index}>
                              <PaginationLink onClick={() => {
                                setActiveTab(index)
                              }}>
                                {index + 1}
                             </PaginationLink>
                            </PaginationItem>
                          ))}
                        </Pagination>
                    </div>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </CardBody>
        </Card>
      </Col>
      <ToastContainer />
    </Row>
  );
};

export default Home;
