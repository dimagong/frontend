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
  Button,
} from "reactstrap";
import { ToastContainer } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import {
  selectdForms, selectGroups,
  selectManager,
  selectManagers,
  selectNotifications,
  selectContext,
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

import { X, ChevronLeft, ChevronRight, ChevronUp, Plus } from 'react-feather'

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
import {getGroupName} from '../../../utility/select/prepareSelectData'
import {groupTypes} from '../../../constants/group'

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
  const groups = useSelector(selectGroups)
  const context = useSelector(selectContext)

  const [page, setPage] = useState(0);
  const [selectedNavItem, setSelectedNavItem] = useState(NAV_OPTIONS[0])
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)

  const handleContextChange = (context) => {
    dispatch(setContext(context))
  }
  const closePreview = () => {
    dispatch(setPreview(null))
    setPage(0)
  }

  const width = useWindowSize()
  let itemsPerPage = width <= 1400 ? 6 : 9;

  itemsPerPage = preview ? 3 : itemsPerPage;
  const oneColumn = !!preview

  // Slice data depending on page, decide which template to use and render it
  const renderContent = (data, type, page) => {

    const sliceData = (data, page) => {


      return data.slice(itemsPerPage * page, itemsPerPage * (page + 1))
    }
    const getOrganizationName = (groupId, groupType) => {
      return getGroupName(groups, groupId, groupTypes[groupType])
    }

    const templates = {
      dForms: <DFormCardTemplate oneColumn={oneColumn} onClick={(e, dForm) => {
                if (e.ctrlKey) {
                  dispatch(setPreview({type: "dForm", id: dForm.id}))
                } else {
                  dispatch(setdForm(dForm));
                  handleContextChange("dForm")
                }
              }} />,
      managers: <UserCardTemplate oneColumn={oneColumn} onClick={(e, user) => {
                  if (e.ctrlKey) {
                    dispatch(setPreview({type: "user", id: user.id}))
                  } else {
                    dispatch(setManager(user));
                    handleContextChange("User")
                  }
                }} />,
      workFlows: <WorkFlowTemplate oneColumn={oneColumn} onClick={(e, workFlow) => {
                  if (e.ctrlKey) {
                    dispatch(setPreview({type: "workFlow", id: workFlow.id}))
                  } else {
                    dispatch(setWorkflow(workFlow))
                    handleContextChange("WorkFlow")
                  }
                }} />,
      notifications: <NotificationTemplate oneColumn={oneColumn} onClick={(e, notification) => {
                    if (e.ctrlKey) {
                      dispatch(setPreview({type: "notification", id: notification.id}))
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

  const onPreviewExpand = () => {
    const previewedManager = managers.filter(({ id }) => id === preview.id)[0]
    dispatch(setManager(previewedManager))
    handleContextChange("User")
  }

  const handleContextSearchHide = () => {
    if (context) {
      onContextSearchHide()
    }
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






  const handleResize = () => {
    setWindowWidth(window.innerWidth)
  }

  return (
    <>
    <Row className={`home context-search ${isShown ? "slide-in" : "slide-out"}`}>
      <Col sm="12" md="12" lg="12" xl="12">
        <div>
          <div className="">
            <Row className="app-user-list">
              <Col sm="12">
                <div>
                  <div>
                    <div className="grid">

                      <ContextSearchNav
                        onChange={handleNavItemChange}
                        selectedNavItem={selectedNavItem}
                        navOptions={NAV_OPTIONS}
                        onContextChange={handleContextChange}
                      />

                      <Row className={"contextual-search_wrapper"}>
                        <Col className={`home__card-wrapper ${preview ? "preview-visible" : ""}`} sm={preview ? oneColumn ? "5" : "8" : "12"}>
                          {data[selectedNavItem.id] && renderContent(data[selectedNavItem.id], selectedNavItem.id, page)}
                          {data[selectedNavItem.id] && getPagination().length > 1 && (
                            <div className="search-context-pagination">
                              <Button
                                className="pagination-arrow"
                                onClick={() => {
                                  if (page !== 0) setPage(page - 1)
                                }}
                              >
                                <ChevronLeft size={28} color="#707070"/>
                              </Button>
                              <Pagination aria-label="Page navigation">
                                {getPagination().map( (_, index) => (
                                  <PaginationItem key={index} active={page === index}>
                                    <PaginationLink onClick={() => {
                                      setPage(index)
                                    }}>
                                      {index + 1}
                                    </PaginationLink>
                                  </PaginationItem>
                                ))}
                              </Pagination>
                              <Button
                                className="pagination-arrow"
                                onClick={() => {
                                  if (page !== getPagination().length -1) setPage(page + 1)
                                }}
                              >
                                <ChevronRight size={28} color="#707070"/>
                              </Button>
                            </div>
                          )}
                        </Col>
                        {preview && (
                          <Col sm={oneColumn ? "7" : "4"} className="preview">
                            {{
                              user: <UserEditPreview />,
                              dForm: <DFormFormPreview />,
                              workFlow: <WorkflowFormPreview />,
                              notification: <NotificationsFormPreview />,
                            }[preview.type]}
                            <div className="preview-action-buttons">
                              <Button style={{borderRadius: "5rem"}} onClick={onPreviewExpand}>
                                Expand
                              </Button>
                              <Button style={{borderRadius: "5rem", paddingLeft: "10px", paddingRight: "10px"}} onClick={closePreview}>
                                <X size={20}/>
                              </Button>
                            </div>

                          </Col>
                        )}
                      </Row>
                      <div className="search-content-footer">
                        <Button
                          onClick={() => {handleContextChange("Create user")}}
                          color="primary"
                          className="add-icon p-0"
                        >
                          <Plus size={28}/>
                        </Button>

                        <Button color="primary" onClick={handleContextSearchHide} className="hide-context-icon p-0">
                          <ChevronUp size={28} />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        </div>
      </Col>
      <ToastContainer />

    </Row>
    </>
  )
}

export default ContextSearch;
