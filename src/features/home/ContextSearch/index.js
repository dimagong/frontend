import React, { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  Row,
  Col,
  Pagination,
  PaginationItem,
  PaginationLink,
  Badge,
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
  setPreview,
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
import { selectAuth } from "app/selectors/authSelectors"
import {selectVuexyUser} from 'app/selectors'
import {selectPreview} from '../../../app/selectors/layoutSelector'

import DFormCardTemplate from './CardTemplates/dFormCard'
import WorkFlowTemplate from './CardTemplates/workFlowCard'
import UserCardTemplate from './CardTemplates/userCard'
import NotificationTemplate from './CardTemplates/notificationsCard'
import useWindowSize from '../../../hooks/windowWidth'

import UserEditPreview from 'features/user-managment/userEdit/userEditPreview'
import DFormFormPreview from 'features/onboarding/dForm/DFormFormPreview'
import WorkflowFormPreview from 'features/onboarding/workflow/workflowPreview'
import NotificationsFormPreview from 'features/onboarding/notifications/notificationPreview'

import './styles.scss'

const ContextSearch = ({isShown, onContextSearchHide}) => {
  const dispatch = useDispatch();

  const manager = useSelector(selectManager);
  const managers = useSelector(selectManagers);
  const dForms = useSelector(selectdForms)
  const notifications = useSelector(selectNotifications)
  const workFlows = useSelector(selectWorkflows)
  const isLoading = useSelector(selectLoading)
  const isAuth = useSelector(selectAuth)
  const vuexyUser = useSelector(selectVuexyUser)
  const preview = useSelector(selectPreview)

  const [page, setPage] = useState(0);
  const [selectedNavItem, setSelectedNavItem] = useState(NAV_OPTIONS[0])
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)

  const handleContextChange = (context) => {
    dispatch(setContext(context))
  }
  const width = useWindowSize()

  const oneColumn =  preview;
  const itemsPerPage = oneColumn ? 4 : 8;

  // Slice data depending on page, decide which template to use and render it
  const renderContent = (data, type, page) => {

    const sliceData = (data, page) => {


      return data.slice(itemsPerPage * page, itemsPerPage * (page + 1))
    }


    const templates = {
      dForms: <DFormCardTemplate oneColumn={oneColumn} onClick={(e, dForm) => {
                if (e.ctrlKey) {
                  dispatch(setPreview({type: "dForm", ...dForm}))
                } else {
                  dispatch(setdForm(dForm));
                  handleContextChange("dForm")
                }
              }} />,
      managers: <UserCardTemplate oneColumn={oneColumn} onClick={(e, user) => {
                  if (e.ctrlKey) {
                    dispatch(setPreview({type: "user", ...user}))
                  } else {
                    dispatch(setManager(user));
                    handleContextChange("User")
                  }
                }} />,
      workFlows: <WorkFlowTemplate oneColumn={oneColumn} onClick={(e, workFlow) => {
                  if (e.ctrlKey) {
                    dispatch(setPreview({type: "workFlow", ...workFlow}))
                  } else {
                    dispatch(setWorkflow(workFlow))
                    handleContextChange("WorkFlow")
                  }
                }} />,
      notifications: <NotificationTemplate oneColumn={oneColumn} onClick={(e, notification) => {
                    if (e.ctrlKey) {
                      dispatch(setPreview({type: "notification", ...notification}))
                    } else {
                      dispatch(setNotification(notification))
                      handleContextChange("Notification")
                    }
                    }} />,
    }

    return sliceData(data, page).map((elData) => (React.cloneElement(templates[type], elData)))
  }


  const handleNavItemChange = (navItem) => {
    setSelectedNavItem(navItem)
  }

  const getPagination = () => {
    return Array.from(Array(Math.ceil(data[selectedNavItem.id].length/itemsPerPage)))
  }

  const data = {
    dForms,
    notifications,
    workFlows,
    managers,
  }

  useEffect(() => {
    if (isAuth && vuexyUser) {
      dispatch(getUserManagment())
      dispatch(getWorkflowsRequest())
      dispatch(getdFormsRequest())
      dispatch(getNotificationsRequest())
    }
  }, [isAuth, vuexyUser]);


  useEffect(() => {
    window.addEventListener("resize", handleResize);
  }, [])


  if(!isShown) return null;



  const handleResize = () => {
    setWindowWidth(window.innerWidth)
  }

  return (
    <Row className="home mb-2 context-search">
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
                        <Col className="home__card-wrapper" sm={preview ? oneColumn ? "5" : "8" : "12"}>
                          {data[selectedNavItem.id] && renderContent(data[selectedNavItem.id], selectedNavItem.id, page)}
                        </Col>
                        {preview && (
                          <Col sm={oneColumn ? "6" : "4"} className="preview">
                            {{
                              user: <UserEditPreview />,
                              dForm: <DFormFormPreview />,
                              workFlow: <WorkflowFormPreview />,
                              notification: <NotificationsFormPreview />,
                            }[preview.type]}
                          </Col>
                        )}
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
