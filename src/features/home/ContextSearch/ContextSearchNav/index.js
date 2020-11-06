import React, { useState } from 'react'

import {
  Row,
  Col,
  Navbar,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  NavItem,
  NavbarToggler,
  Collapse,
  Nav,
  NavLink,
} from 'reactstrap'

import {
  dformsPath,
  masterSchemaPath,
  notificationsPath,
  userManagmentPath,
  workflowsPath
} from '../../../../constants/paths'


const navBar = [
  {
    title: "Users",
    actions: [
      {
        title: "Create user",
      },
      {
        title: "Invitations",
      },
    ]
  },
  {
    title: "Notifications",
    actions: [
      {
        title: "Create notification",
      },
    ]
  },
  {
    title: "dForms",
    actions: [
      {
        title: "Create dForm",
      },
    ]
  },
  {
    title: "Workflows",
    actions: [
      {
        title: "Create workflow",
      },
    ]
  },
  {
    title: "MasterSchema",
    actions: [],
  },
]

const ContextSearchNav = () => {

  const [selectedNavItem, setSelectedNavItem] = useState(navBar[0])
  const [isCollapsedNavBarOpen, setIsCollapsedNavBarOpen] = useState(false)

  const toggle = () => setIsCollapsedNavBarOpen(!isCollapsedNavBarOpen);

  return (
    <Row>
      <Col>
        <Navbar light expand="md">
          <UncontrolledDropdown>
            <DropdownToggle nav caret={true}>
              {selectedNavItem.title}
            </DropdownToggle>
            <DropdownMenu left>
              {navBar.map((navEl) => (
                <DropdownItem>
                  <NavItem onClick={() => setSelectedNavItem(navEl)}>
                    {navEl.title}
                  </NavItem>
                </DropdownItem>
              ))}
            </DropdownMenu>
          </UncontrolledDropdown>


          <NavbarToggler onClick={toggle} />
          <Collapse isOpen={isCollapsedNavBarOpen} navbar>
            <Nav className="ml-auto" navbar>
              {selectedNavItem.actions.map((navItemAction) => (
                <NavItem>
                  {navItemAction.title}
                </NavItem>
              ))}
            </Nav>
          </Collapse>
        </Navbar>
      </Col>
    </Row>
  )
}

export default ContextSearchNav;
