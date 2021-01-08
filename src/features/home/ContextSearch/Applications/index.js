import React, {useState} from 'react';
import {useSelector, useDispatch} from 'react-redux'
import {selectdForms, selectNotifications} from '../../../../app/selectors'

import { setContext } from 'app/slices/appSlice'
import { setdForm, setNotification, setWorkflow } from 'app/slices/onboardingSlice'

import { Scrollbars } from 'react-custom-scrollbars';
import {
  Row,
  Col,
  Card,
  CardBody,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  NavItem, Navbar
} from 'reactstrap'

import './styles.scss'
import {selectWorkflows} from '../../../../app/selectors/onboardingSelectors'

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
]

const Applications = () => {
  const dispatch = useDispatch();

  const [selectedItem, setSelectedItem] = useState(null)
  const [dependenciesSelectActiveItem, setDependenciesSelectActiveItem] = useState(dependenciesList[0])

  const dForms = useSelector(selectdForms)
  const notifications = useSelector(selectNotifications)
  const workflows = useSelector(selectWorkflows)

  const ListItem = ({item, index, onClick }) => {

    return (
      <div
        className={`list_item ${selectedItem && selectedItem.id === item.id ? "selected" : ""}`}
        key={`${item.name} ${index}`}
        onClick={onClick}
      >
        <div className="list_item_name">
          {item.name}
        </div>
        <div className="list_item_description">
          {item.description}
        </div>
        <div className="list_item_organizations">
          {item.groups && item.groups.map((group) => <div>{group.name}</div>)}
        </div>

      </div>
    )
  }

  const changeContext = (context) => {
    dispatch(setContext(context))
  }

  const handleItemSelect = (e, item, itemType) => {
    setSelectedItem(item)
    switch(itemType) {
      case "dForm": dispatch(setdForm(item)); break;
      case "Notification": dispatch(setNotification(item)); break;
      case "WorkFlow": dispatch(setWorkflow(item)); break;
    }

    changeContext(itemType)
  }

  return (
    <Row style={{marginBottom: "40px"}}>
      <Col className="applications">
        <div className="list-header">
          <div>
            Name
          </div>
          <div>
            Description
          </div>
          <div>
            Organizations
          </div>
        </div>

        <Scrollbars  autoHeight autoHeightMax={500}>
          <div className="items-list">
            {!!dForms.length && dForms.map((item) => (
              <ListItem item={item} onClick={(e) => {handleItemSelect(e, item, "dForm")}} />
            ))}
          </div>
        </Scrollbars>
      </Col>

      <Col className="application-dependencies">
        <Card className={"application-dependencies_header-container"}>
          <CardBody className="application-dependencies_header">
            <Navbar light expand="md" className="p-0">
              <UncontrolledDropdown>
                <DropdownToggle nav caret={true} style={{fontSize: "18px", color: "#707070"}}>
                  {dependenciesSelectActiveItem.title}
                </DropdownToggle>
                <DropdownMenu left>
                  {dependenciesList.map((item) => (
                    <DropdownItem
                      onClick={() => {setDependenciesSelectActiveItem(item)}}
                    >
                      <NavItem style={{fontSize: "16px"}}>
                        {item.title}
                      </NavItem>
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </UncontrolledDropdown>
              <div className="ml-auto">
                <span
                  className="font-weight-bold"
                  style={{color: "#707070", cursor: "pointer"}}
                  onClick={() => {
                    setSelectedItem(null)
                    changeContext(dependenciesSelectActiveItem.context)
                  }}
                >
                  {dependenciesSelectActiveItem.actionTitle}
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
            Organizations
          </div>
        </div>
        <Scrollbars  autoHeight autoHeightMax={430}>
          <div className="items-list">
            {dependenciesSelectActiveItem.title === "Workflows" ? (
              !!workflows.length && workflows.map((item) => (
                <ListItem key={`${item.id}`} item={item} onClick={(e) => {handleItemSelect(e, item, "WorkFlow")}} />
              ))
            ) : (
              !!notifications.length && notifications.map((item) => (
                <ListItem key={`${item.id}`} item={item} onClick={(e) => {handleItemSelect(e, item, "Notification")}} />
              ))
            )}
          </div>
        </Scrollbars>

      </Col>
    </Row>
  )
}

export default Applications;
