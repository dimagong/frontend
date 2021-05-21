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
import {selectSearchText} from "../../../app/selectors/userSelectors";
import Dashboard from "./Dashboard";

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

  const searchText = useSelector(selectSearchText);
  const [searchedManagers, setSearchedManagers] = useState([]);
  const [currSearch, setCurrSearch] = useState('');
  let managersWithName = managers.map(({ first_name, last_name, ...rest }) => ({ name: first_name + ' ' + last_name, first_name, last_name, ...rest }));
  if (managers.length > 0 && searchText.length === 0 && searchedManagers.length === 0) {
    setSearchedManagers(managersWithName);
  }
  let isNotUpdated = false;
  if (searchedManagers.length > 0 && managers.length > 0) {
    for (let manager of managers) {
      let searchedManager = searchedManagers.find(item => item.id === manager.id);
      if (searchedManager && manager.url && searchedManager.url !== manager.url) {
        isNotUpdated = true;
        break;
      }
    }
  }

  let newManagers = [];
  if (currSearch !== searchText && searchText.length === 0) {
    setCurrSearch(searchText);
    setSearchedManagers(managersWithName);
  } else
  if (isNotUpdated || (searchText && searchText.length > 0 && currSearch !== searchText)) {
    newManagers = managersWithName.filter(i => {
      let startCondition = i['name']
          .toLowerCase()
          .startsWith(searchText.toLowerCase()),
        includeCondition = i['name']
          .toLowerCase()
          .includes(searchText.toLowerCase())

      return startCondition || includeCondition;
    })
    setCurrSearch(searchText);
    setSearchedManagers(newManagers);
  }

  const isAuth = useSelector(selectAuth);
  const vuexyUser = useSelector(selectVuexyUser);
  const context = useSelector(selectContext);
  const profile = useSelector(selectProfile);

  const test = useSelector(createLoadingSelector([getdFormsRequest.type, getNotificationsRequest.type, getWorkflowsRequest.type]));
  console.log("test loadinig", test);

  const [selectedNavItem, setSelectedNavItem] = useState(NAV_OPTIONS[0]);
  const [showManagers, setShowManagers] = useState(searchedManagers);


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
                        managers={searchedManagers}
                      />

                      <Row className={"contextual-search_wrapper"}>
                        <Col>
                          <TabContent activeTab={selectedNavItem.id}>
                            <TabPane tabId={NAV_OPTIONS[0].id}>
                              <UserManagement allManagers={managers} managers={showManagers} handleContextChange={handleContextChange} />
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
                      {selectedNavItem.id === 'managers' && <Dashboard/>}
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
