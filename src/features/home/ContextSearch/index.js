import "./styles.scss";

import { ChevronUp, Plus } from "react-feather";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col, Button, TabContent, TabPane } from "reactstrap";

import appSlice from "app/slices/appSlice";
import { NmpCollapse } from "features/nmp-ui";
import { selectSearchText } from "app/selectors/userSelectors";
import MasterSchema from "features/home/ContextSearch/MasterSchema";
import { selectManagers, selectProfile, selectContextSearchVisibility } from "app/selectors";

import Surveys from "./Surveys";
import Organizations from "./Organizations";
import UserManagement from "./UserManagement";
import { Applications } from "./Applications";
import ContextSearchNav from "./ContextSearchNav";
import { RMContextSearch } from "./RMContextSearch";
import SurveyCreateModal from "./SurveyCreateModal";
import { NAV_OPTIONS } from "./ContextSearchNav/constants";
import MemberFirmCreateModal from "./MemberFirmCreateModal";
import MemberFirmsList from "./MemberFirms/MemberFirmsList";

const { setContext, getFilterRequest, getUserManagment, getdFormsRequest, hideContextSearch } = appSlice.actions;

const ContextSearch = () => {
  const dispatch = useDispatch();

  const managers = useSelector(selectManagers);
  const searchText = useSelector(selectSearchText);
  const isContextSearchVisible = useSelector(selectContextSearchVisibility);

  const [currSearch, setCurrSearch] = useState("");
  const [searchedManagers, setSearchedManagers] = useState([]);

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

  const profile = useSelector(selectProfile);

  const [selectedNavItem, setSelectedNavItem] = useState(NAV_OPTIONS[0]);

  const [isSurveyCreateModalVisible, setIsSurveyCreateModalVisible] = useState(false);
  const [isMemberFirmCreateModalVisible, setIsMemberFirmCreateModalVisible] = useState(false);
  const [showManagers, setShowManagers] = useState([]);

  const handleContextChange = (context) => dispatch(setContext(context));

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

  const handleNavItemChange = (navItem) => setSelectedNavItem(navItem);

  const handleContextSearchHide = () => dispatch(hideContextSearch());

  const handleFilter = (filteredManagers) => setShowManagers([...filteredManagers]);

  useEffect(() => {
    dispatch(getFilterRequest());
    dispatch(getUserManagment());
    dispatch(getdFormsRequest());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      <NmpCollapse
        ghost
        activeKey={isContextSearchVisible ? "a" : void 0}
        expandIcon={() => null}
        destroyInactivePanel
        className="context-search__collapse"
      >
        <NmpCollapse.Panel key="a" header={null}>
          <Row className="home context-search">
            <Col sm="12" md="12" lg="12" xl="12">
              <Row className="app-user-list">
                <Col sm="12">
                  <div className="grid">
                    <ContextSearchNav
                      onChange={handleNavItemChange}
                      selectedNavItem={selectedNavItem}
                      navOptions={nav}
                      onContextChange={handleContextChange}
                      handleFilter={handleFilter}
                      managers={searchedManagers}
                    />

                    <Row className="contextual-search_wrapper">
                      <Col>
                        {userAbility === "BDM" ? (
                          <TabContent activeTab={selectedNavItem.id}>
                            <TabPane tabId={NAV_OPTIONS[0].id}>
                              {NAV_OPTIONS[0].id === selectedNavItem.id ? (
                                <UserManagement
                                  managers={showManagers}
                                  allManagers={managers}
                                  handleContextChange={handleContextChange}
                                />
                              ) : null}
                            </TabPane>
                            <TabPane tabId={NAV_OPTIONS[5].id}>
                              {NAV_OPTIONS[5].id === selectedNavItem.id ? <MemberFirmsList /> : null}
                            </TabPane>
                          </TabContent>
                        ) : (
                          <TabContent activeTab={selectedNavItem.id}>
                            <TabPane tabId={NAV_OPTIONS[0].id}>
                              {NAV_OPTIONS[0].id === selectedNavItem.id ? (
                                <UserManagement
                                  managers={showManagers}
                                  allManagers={managers}
                                  handleContextChange={handleContextChange}
                                />
                              ) : null}
                            </TabPane>
                            <TabPane tabId={NAV_OPTIONS[1].id}>
                              {NAV_OPTIONS[1].id === selectedNavItem.id ? <Applications /> : null}
                            </TabPane>
                            <TabPane tabId={NAV_OPTIONS[2].id}>
                              {NAV_OPTIONS[2].id === selectedNavItem.id ? <MasterSchema /> : null}
                            </TabPane>
                            <TabPane tabId={NAV_OPTIONS[3].id}>
                              {NAV_OPTIONS[3].id === selectedNavItem.id ? <Organizations /> : null}
                            </TabPane>
                            <TabPane tabId={NAV_OPTIONS[4].id}>
                              {NAV_OPTIONS[4].id === selectedNavItem.id ? <Surveys /> : null}
                            </TabPane>
                            <TabPane tabId={NAV_OPTIONS[5].id}>
                              {NAV_OPTIONS[5].id === selectedNavItem.id ? <MemberFirmsList /> : null}
                            </TabPane>
                            <TabPane tabId={NAV_OPTIONS[6].id}>
                              {NAV_OPTIONS[6].id === selectedNavItem.id ? <RMContextSearch /> : null}
                            </TabPane>
                          </TabContent>
                        )}
                      </Col>
                    </Row>

                    <div className="search-content-footer">
                      {!["MasterSchema", "resourceManager", "applications"].includes(selectedNavItem.id) ? (
                        <Button color="primary" className="add-icon p-0" onClick={handleAdd}>
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
                </Col>
              </Row>
            </Col>
          </Row>
        </NmpCollapse.Panel>
      </NmpCollapse>

      <SurveyCreateModal isOpen={isSurveyCreateModalVisible} onClose={() => setIsSurveyCreateModalVisible(false)} />

      <MemberFirmCreateModal
        isOpen={isMemberFirmCreateModalVisible}
        onClose={() => setIsMemberFirmCreateModalVisible(false)}
      />
    </>
  );
};

export default ContextSearch;
