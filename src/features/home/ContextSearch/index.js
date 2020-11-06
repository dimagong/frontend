import React, { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  Row,
  Col,
  Nav,
  NavItem,
  NavLink,
  Collapse,
  Navbar,
  NavbarToggler,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  CardImg,
  CardText,
  CardTitle,
  Pagination,
  PaginationItem,
  PaginationLink,
} from "reactstrap";
import { ToastContainer } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import {
  selectManager,
  selectManagers,
} from "app/selectors";
import { getUserManagment } from "app/slices/appSlice";

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

import { X } from 'react-feather'

import ContextSearchNav from './ContextSearchNav'

const ContextSearch = ({isShown, onContextSearchHide}) => {

  const [activeTab, setActiveTab] = useState(0);
  const manager = useSelector(selectManager);
  const managers = useSelector(selectManagers);
  const dispatch = useDispatch();
  const { push } = useRouter();

  useEffect(() => {
    managers !== undefined && !managers.length && dispatch(getUserManagment());
  }, []);

  const getPagination = () => {
    return Array.from(Array(Math.ceil(managers.length/8)))
  }

  const users = (number) => {
    return managers.slice(8 * number, 8 * (number + 1))
  }

  const redirectToManager = (id) => {
    push(userManagmentOptionsPath(id))
  }

  if(!isShown) return null;

  return (
    <Row className="home mb-2">
      <Col sm="12" md="12" lg="12" xl="12">
        <Card>
          <CardBody className="pt-2">
            <Row className="app-user-list">
              <Col sm="12">
                <Card>
                  <CardBody>
                    <div className="grid">

                      <ContextSearchNav />

                      <Row>
                        <Col className="home__card-wrapper">
                          {
                            managers && users(activeTab).map((manager) => (
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
                                    {manager.email ? `${manager.email}` : "email is empty"}
                                  </CardText>
                                </CardBody>
                              </Card>
                            ))
                          }
                        </Col>
                      </Row>
                      <Pagination aria-label="Page navigation">
                        {managers && getPagination().map( (_, index) => (
                          <PaginationItem key={index} active={activeTab === index}>
                            <PaginationLink onClick={() => {
                              setActiveTab(index)
                            }}>
                              {index + 1}
                            </PaginationLink>
                          </PaginationItem>
                        ))}
                      </Pagination>
                      <X className={"align-self-end"} size={15} onClick={onContextSearchHide}/>
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
  )
}

export default ContextSearch;
