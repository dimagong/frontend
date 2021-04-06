import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  Button,
  TabContent,
  TabPane,
} from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  selectManagers,
  selectContext, selectProfile
} from "app/selectors";

import {
  ChevronUp,
  Plus,
} from 'react-feather'

import { NAV_OPTIONS } from './ContextSearchNav/constants'

import ContextSearchNav from './ContextSearchNav'

import { selectAuth } from "app/selectors/authSelectors"
import {selectVuexyUser} from 'app/selectors'
import Applications from './Applications'
import MasterSchema from 'views/pages/master-schema'
import Organizations from './Organizations'
import UserManagement from './UserManagement'

import './styles.scss'

import { createLoadingSelector } from 'app/selectors/loadingSelector'

import appSlice from 'app/slices/appSlice'

const {
  getUserManagment,
  getdFormsRequest,
  getNotificationsRequest,
  getWorkflowsRequest,
  setContext,
} = appSlice.actions;

const ContextSearch = ({isShown, onContextSearchHide}) => {
  const dispatch = useDispatch();
  const managers = useSelector(selectManagers);

  const isAuth = useSelector(selectAuth);
  const vuexyUser = useSelector(selectVuexyUser);
  const context = useSelector(selectContext);
  const profile = useSelector(selectProfile);

  const test = useSelector(createLoadingSelector([getdFormsRequest.type, getNotificationsRequest.type, getWorkflowsRequest.type]));
  console.log("test loadinig", test);

  const [selectedNavItem, setSelectedNavItem] = useState(NAV_OPTIONS[0]);
  const [showManagers, setShowManagers] = useState(managers);


  const handleContextChange = (context) => {
    dispatch(setContext(context))
  };

  const handleAdd = () => {
    if (selectedNavItem.id === "managers") {
      dispatch(setContext("Create user"))
    } else if (selectedNavItem.id === "organizations") {
      dispatch(setContext("OrganizationCreate"))
    } else {
      dispatch(setContext("Create dForm"))
    }
  };

  const handleNavItemChange = (navItem) => {
    setSelectedNavItem(navItem)
  };

  const handleContextSearchHide = () => {
    if (context) {
      onContextSearchHide()
    }
  };

  const handleFilter = (filteredManagers) => {
    setShowManagers(filteredManagers);
  }

  useEffect(() => {
    if (isAuth && vuexyUser) {
      dispatch(getUserManagment());
      dispatch(getWorkflowsRequest());
      dispatch(getdFormsRequest());
      dispatch(getNotificationsRequest())
    }
  }, [isAuth, vuexyUser]);

  let nav;

  // users without role admin shouldn't see organisations tab
  if(profile && profile?.permissions?.ability === "admin") {
    nav = NAV_OPTIONS
  } else {
    nav = NAV_OPTIONS.filter((n) => n.id !== "organizations")
  }

  return (
    <>
    <Row className={`home context-search ${isShown ? "slide-in" : "slide-out"}`}>
      <Col sm="12" md="12" lg="12" xl="12">
        <div>
          <div className="">
            <Row className="app-user-list" style={{paddingBottom: "2px"}}>
              <Col sm="12">
                <div>
                  <div>
                    <div className="grid">

                      <ContextSearchNav
                        onChange={handleNavItemChange}
                        selectedNavItem={selectedNavItem}
                        navOptions={nav}
                        onContextChange={handleContextChange}
                        handleFilter={handleFilter}
                        managers={managers}
                      />

                      <Row className={"contextual-search_wrapper"}>
                        <Col>
                          <TabContent activeTab={selectedNavItem.id}>
                            <TabPane tabId={NAV_OPTIONS[0].id}>
                              <UserManagement managers={showManagers} handleContextChange={handleContextChange} />
                            </TabPane>
                            <TabPane tabId={NAV_OPTIONS[1].id}>
                              <Applications />
                            </TabPane>
                            <TabPane tabId={NAV_OPTIONS[2].id}>
                              <MasterSchema />
                            </TabPane>
                            <TabPane tabId={NAV_OPTIONS[3].id}>
                              <Organizations />
                            </TabPane>
                          </TabContent>

                        </Col>
                      </Row>
                      <div className="search-content-footer">
                        {selectedNavItem.id !== "MasterSchema" ? (
                          <Button
                            onClick={() => {handleAdd()}}
                            color="primary"
                            className="add-icon p-0"
                          >
                            <Plus size={28}/>
                          </Button>
                        ) : <div />}

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
    </Row>
    </>
  )
}

export default ContextSearch;
