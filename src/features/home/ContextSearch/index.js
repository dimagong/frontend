import React, { useEffect, useState } from "react";
import { Row, Col, Button, TabContent, TabPane } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { selectManagers, selectContext, selectProfile } from "app/selectors";

import { ChevronUp, Plus } from "react-feather";

import { NAV_OPTIONS } from "./ContextSearchNav/constants";

import ContextSearchNav from "./ContextSearchNav";

import { selectAuth } from "app/selectors/authSelectors";
import { selectVuexyUser } from "app/selectors";
import Applications from "./Applications";
// import MasterSchema from 'views/pages/master-schema'
import MasterSchema from "features/home/ContextSearch/MasterSchema";
import Organizations from "./Organizations";
import UserManagement from "./UserManagement";
import Surveys from "./Surveys";
import ResourceManagerContextSearch from "./ResourceManagerContextSearch";

import "./styles.scss";

import appSlice from "app/slices/appSlice";
import SurveyCreateModal from "./SurveyCreateModal";
import MemberFirmCreateModal from "./MemberFirmCreateModal";
import { selectSearchText } from "../../../app/selectors/userSelectors";
import MemberFirmsList from "./MemberFirms/MemberFirmsList";

const {
  getUserManagment,
  getdFormsRequest,
  getNotificationsRequest,
  getWorkflowsRequest,
  setContext,
  getFilterRequest,
  getSurveysRequest,
} = appSlice.actions;

const ContextSearch = ({ isShown, onContextSearchHide }) => {
  const dispatch = useDispatch();
  const managers = useSelector(selectManagers);

  const searchText = useSelector(selectSearchText);
  const [searchedManagers, setSearchedManagers] = useState([]);
  const [currSearch, setCurrSearch] = useState("");
  let managersWithName = managers.map(({ first_name, last_name, ...rest }) => ({
    name: first_name + " " + last_name,
    first_name,
    last_name,
    ...rest,
  }));
  if (managers.length > 0 && searchText.length === 0 && searchedManagers.length === 0) {
    setSearchedManagers(managersWithName);
  }
  let isNotUpdated = false;
  if (searchedManagers.length > 0 && managers.length > 0) {
    for (let manager of managers) {
      let searchedManager = searchedManagers.find((item) => item.id === manager.id);
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
  } else if (isNotUpdated || (searchText && searchText.length > 0 && currSearch !== searchText)) {
    newManagers = managersWithName.filter((i) => {
      let startCondition = i["name"].toLowerCase().startsWith(searchText.toLowerCase()),
        includeCondition = i["name"].toLowerCase().includes(searchText.toLowerCase());

      return startCondition || includeCondition;
    });
    setCurrSearch(searchText);
    setSearchedManagers(newManagers);
  }

  const isAuth = useSelector(selectAuth);
  const vuexyUser = useSelector(selectVuexyUser);
  const context = useSelector(selectContext);
  const profile = useSelector(selectProfile);

  const [selectedNavItem, setSelectedNavItem] = useState(NAV_OPTIONS[0]);

  const [isSurveyCreateModalVisible, setIsSurveyCreateModalVisible] = useState(false);
  const [isMemberFirmCreateModalVisible, setIsMemberFirmCreateModalVisible] = useState(false);
  const [showManagers, setShowManagers] = useState([]);

  const handleContextChange = (context) => {
    dispatch(setContext(context));
  };

  const handleAdd = () => {
    if (selectedNavItem.id === "managers") {
      dispatch(setContext("Create user"));
    } else if (selectedNavItem.id === "organizations") {
      dispatch(setContext("OrganizationCreate"));
    } else if (selectedNavItem.id === "applications") {
      dispatch(setContext("Create dForm"));
    } else if (selectedNavItem.id === "memberFirms") {
      setIsMemberFirmCreateModalVisible(true);
    } else {
      setIsSurveyCreateModalVisible(true);
    }
  };

  const handleNavItemChange = (navItem) => {
    setSelectedNavItem(navItem);
  };

  const handleContextSearchHide = () => {
    if (context) {
      onContextSearchHide();
    }
  };

  const handleFilter = (filteredManagers) => {
    setShowManagers([...filteredManagers]);
  };

  useEffect(() => {
    if (isAuth && vuexyUser) {
      dispatch(getFilterRequest());
      dispatch(getUserManagment());
      dispatch(getWorkflowsRequest());
      dispatch(getdFormsRequest());
      dispatch(getNotificationsRequest());
      dispatch(getSurveysRequest());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuth, vuexyUser]);

  let nav;

  const userAbility = profile && profile?.permissions?.ability;

  // users without role admin shouldn't see organisations tab
  if (userAbility === "admin") {
    nav = NAV_OPTIONS;
  } else if (userAbility === "network_manager" || userAbility === "corporation_manager") {
    nav = NAV_OPTIONS.filter((n) => n.id !== "organizations");
  } else if (userAbility === "BDM") {
    nav = NAV_OPTIONS.filter((n) => ["memberFirms", "managers"].includes(n.id));
  } else {
    nav = NAV_OPTIONS.filter((n) => n.id !== "organizations" && n.id !== "memberFirms");
  }

  return (
    <>
      <Row className={`home context-search ${isShown ? "slide-in" : "slide-out"}`}>
        <Col sm="12" md="12" lg="12" xl="12">
          <div>
            <div className="">
              <Row className="app-user-list" style={{ paddingBottom: "2px" }}>
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
                            {userAbility === "BDM" ? (
                              <TabContent activeTab={selectedNavItem.id}>
                                <TabPane tabId={NAV_OPTIONS[0].id}>
                                  <UserManagement
                                    allManagers={managers}
                                    managers={showManagers}
                                    handleContextChange={handleContextChange}
                                  />
                                </TabPane>
                                <TabPane tabId={NAV_OPTIONS[5].id}>
                                  <MemberFirmsList />
                                </TabPane>
                              </TabContent>
                            ) : (
                              <TabContent activeTab={selectedNavItem.id}>
                                <TabPane tabId={NAV_OPTIONS[0].id}>
                                  <UserManagement
                                    allManagers={managers}
                                    managers={showManagers}
                                    handleContextChange={handleContextChange}
                                  />
                                </TabPane>
                                <TabPane tabId={NAV_OPTIONS[1].id}>
                                  <Applications />
                                </TabPane>
                                <TabPane tabId={NAV_OPTIONS[2].id}>
                                  {NAV_OPTIONS[2].id === selectedNavItem.id && <MasterSchema />}
                                </TabPane>
                                <TabPane tabId={NAV_OPTIONS[3].id}>
                                  <Organizations />
                                </TabPane>
                                <TabPane tabId={NAV_OPTIONS[4].id}>
                                  <Surveys />
                                </TabPane>
                                <TabPane tabId={NAV_OPTIONS[5].id}>
                                  <MemberFirmsList />
                                </TabPane>
                                {/*<TabPane tabId={NAV_OPTIONS[6].id}>*/}
                                {/*<ResourceManagerContextSearch />*/}
                                {/*</TabPane>*/}
                              </TabContent>
                            )}
                          </Col>
                        </Row>
                        <div className="search-content-footer">
                          {!["MasterSchema", "resourceManager"].includes(selectedNavItem.id) ? (
                            <Button
                              onClick={() => {
                                handleAdd();
                              }}
                              color="primary"
                              className="add-icon p-0"
                            >
                              <Plus size={28} />
                            </Button>
                          ) : (
                            <div />
                          )}

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
      <SurveyCreateModal isOpen={isSurveyCreateModalVisible} onClose={() => setIsSurveyCreateModalVisible(false)} />
      <MemberFirmCreateModal
        isOpen={isMemberFirmCreateModalVisible}
        onClose={() => setIsMemberFirmCreateModalVisible(false)}
      />
    </>
  );
};

export default ContextSearch;
