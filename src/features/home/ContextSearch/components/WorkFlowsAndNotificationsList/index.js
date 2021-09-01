import React, {useState} from 'react';
import {
  Card,
  CardBody, Col,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Navbar,
  NavItem,
  UncontrolledDropdown
} from "reactstrap";
import {Scrollbars} from "react-custom-scrollbars";
import ListItem from "../ListItem";
import {useDispatch, useSelector} from "react-redux";
import {selectNotifications} from "app/selectors";
import {selectSurveyWorkFlows, selectApplicationWorkFlows} from "app/selectors/onboardingSelectors";
import onboardingSlice from "app/slices/onboardingSlice";
import appSlice from "app/slices/appSlice";

import './styles.scss'

const {
  setNotification,
  setWorkflow,
} = onboardingSlice.actions;

const {
  setContext,
  setNotificationsAndWorkFlowsContext,
} = appSlice.actions;

const dependenciesList = [
  {
    title:"Workflows",
    actionTitle: "Create Workflow",
    context: "Create workflow"
  },
  {
    title: "Notifications",
    actionTitle: "Create Notification",
    context: "Create notification"
  }
];

const WorkFlowsAndNotificationsList = ({ context }) => {
  const dispatch = useDispatch();

  const [selectedItem, setSelectedItem] = useState(null);
  const [dependenciesSelectedActiveItem, setDependenciesSelectedActiveItem] = useState(dependenciesList[0]);

  const notifications = useSelector(selectNotifications);
  const surveyWorkFlows = useSelector(selectSurveyWorkFlows);
  const applicationWorkFlows = useSelector(selectApplicationWorkFlows);
  const workflows = context === "dForm" ? applicationWorkFlows : surveyWorkFlows;

  const changeContext = (newContext) => {
    // newContext is just context that we want to appear
    // context from props is context for notifications\workflows creation
    dispatch(setNotificationsAndWorkFlowsContext(context));
    dispatch(setContext(newContext));
  };

  const handleItemSelect = (item, itemType) => {
    setSelectedItem({item, itemType});
    if (itemType === "Notification") {
      dispatch(setNotification(item))
    } else if (itemType === "WorkFlow") {
      dispatch(setWorkflow(item))
    }

    changeContext(itemType)
  };

  const renderListItem = (item, type) => (
    <ListItem
      key={`${type}-${item.id}`}
      item={item}
      onClick={() => {handleItemSelect(item, type)}}
      isSelected={selectedItem && selectedItem.item?.id === item.id && selectedItem.itemType === type}
    />
  );

  return (
    <Col className="workflows-and-notifications">
      <Card className={"workflows-and-notifications_header-container"}>
        <CardBody className="workflows-and-notifications_header">
          <Navbar light expand="md" className="p-0">
            <UncontrolledDropdown>
              <DropdownToggle
                className={"workflows-and-notifications_header_dropdown"}
                nav
                caret={true}
              >
                {dependenciesSelectedActiveItem.title}
              </DropdownToggle>
              <DropdownMenu left>
                {dependenciesList.map((item, index) => (
                  <DropdownItem
                    key={index}
                    onClick={() => {setDependenciesSelectedActiveItem(item)}}
                  >
                    <NavItem className={"workflows-and-notifications_header_dropdown_nav-item"}>
                      {item.title}
                    </NavItem>
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </UncontrolledDropdown>
            <div className="ml-auto">
                <span
                  className="workflows-and-notifications_header_selected-item"
                  onClick={() => {
                    setSelectedItem(null);
                    changeContext(dependenciesSelectedActiveItem.context)
                  }}
                >
                  {dependenciesSelectedActiveItem.actionTitle}
                </span>
            </div>
          </Navbar>
        </CardBody>
      </Card>
      <div className="list-header">
        <div>
          Name
        </div>
        <div>
          Description
        </div>
        <div>
          Organisations
        </div>
      </div>
      <Scrollbars autoHeight autoHeightMax={430}>
        <div className="items-list">
          {dependenciesSelectedActiveItem.title === "Workflows" ? (
            !!workflows.length && workflows.map((item) => (
              renderListItem(item, "WorkFlow")
            ))
          ) : (
            !!notifications.length && notifications.map((item) => (
              renderListItem(item, "Notification")
            ))
          )}
        </div>
      </Scrollbars>
    </Col>
  )
};

export default WorkFlowsAndNotificationsList;
