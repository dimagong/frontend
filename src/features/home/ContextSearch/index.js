import React, { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  Row,
  Col,
  Pagination,
  PaginationItem,
  PaginationLink,
} from "reactstrap";
import { ToastContainer } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import {
  selectdForms,
  selectManager,
  selectManagers,
  selectNotifications,
} from "app/selectors";

import {
  getUserManagment,
  getdFormsRequest,
  getNotificationsRequest,
  getWorkflowsRequest,
  setManager,
  setContext,
} from "app/slices/appSlice";

import {
  setWorkflow,
  setdForm,
  setNotification,
} from 'app/slices/onboardingSlice'

import { X } from 'react-feather'

import { NAV_OPTIONS } from './ContextSearchNav/constants'

import ContextSearchNav from './ContextSearchNav'

import {selectLoading} from 'app/selectors'
import {selectWorkflows} from 'app/selectors/onboardingSelectors'


import DFormCardTemplate from './CardTemplates/dFormCard'
import WorkFlowTemplate from './CardTemplates/workFlowCard'
import UserCardTemplate from './CardTemplates/userCard'
import NotificationTemplate from './CardTemplates/notificationsCard'

const ContextSearch = ({isShown, onContextSearchHide}) => {
  const dispatch = useDispatch();

  const manager = useSelector(selectManager);
  const managers = useSelector(selectManagers);
  const dForms = useSelector(selectdForms)
  const notifications = useSelector(selectNotifications)
  const workFlows = useSelector(selectWorkflows)
  const isLoading = useSelector(selectLoading)


  const [page, setPage] = useState(0);
  const [selectedNavItem, setSelectedNavItem] = useState(NAV_OPTIONS[0])

  const handleContextChange = (context) => {
    dispatch(setContext(context))
  }

  // Slice data depending on page, decide which template to use and render it
  const renderContent = (data, type, page) => {

    const sliceData = (data, page) => {
      return data.slice(8 * page, 8 * (page + 1))
    }

    const templates = {
      dForms: <DFormCardTemplate onClick={(dForm) => {
                dispatch(setdForm(dForm));
                handleContextChange("dForm")
              }} />,
      managers: <UserCardTemplate onClick={(user) => {
                  dispatch(setManager(user));
                  handleContextChange("User")
                }} />,
      workFlows: <WorkFlowTemplate onClick={(workFlow) => {
                  dispatch(setWorkflow(workFlow))
                  handleContextChange("WorkFlow")
                }} />,
      notifications: <NotificationTemplate onClick={(notification) => {
                      dispatch(setNotification(notification))
                      handleContextChange("Notification")
                    }} />,
    }

    return sliceData(data, page).map((elData) => (React.cloneElement(templates[type], elData)))
  }


  const handleNavItemChange = (navItem) => {
    setSelectedNavItem(navItem)
  }

  const getPagination = () => {
    return Array.from(Array(Math.ceil(data[selectedNavItem.id].length/8)))
  }

  const data = {
    dForms,
    notifications,
    workFlows,
    managers,
  }

  useEffect(() => {
    dispatch(getUserManagment());
    dispatch(getWorkflowsRequest())
    dispatch(getdFormsRequest())
    dispatch(getNotificationsRequest())
  }, []);

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

                      <ContextSearchNav
                        onChange={handleNavItemChange}
                        selectedNavItem={selectedNavItem}
                        navOptions={NAV_OPTIONS}
                        onContextChange={handleContextChange}
                      />

                      <Row>
                        <Col className="home__card-wrapper">
                          {data[selectedNavItem.id] && renderContent(data[selectedNavItem.id], selectedNavItem.id, page)}
                        </Col>
                      </Row>
                      <Pagination aria-label="Page navigation">
                        {data[selectedNavItem.id] && getPagination().length > 1 && getPagination().map( (_, index) => (
                          <PaginationItem key={index} active={page === index}>
                            <PaginationLink onClick={() => {
                              setPage(index)
                            }}>
                              {index + 1}
                            </PaginationLink>
                          </PaginationItem>
                        ))}
                      </Pagination>
                      <X className="align-self-end cursor-pointer" size={15} onClick={onContextSearchHide}/>
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
