import React, {useState} from 'react';
import {useSelector} from 'react-redux'
import {selectdForms} from '../../../../app/selectors'

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

const dependenciesList = ["Workflows", "Notifications"]

const Applications = () => {

  const [selectedDForm, setSelectedDForm] = useState(null)
  const [dependenciesSelectActiveItem, setDependenciesSelectActiveItem] = useState(dependenciesList[0])

  const dForms = useSelector(selectdForms)
  console.log(dForms)

  const DFormListItem = ({ dForm, index, onClick }) => {

    return (
      <div
        className={`dform-list_item ${selectedDForm && selectedDForm.id === dForm.id ? "selected" : ""}`}
        key={`${dForm.name} ${index}`}
        onClick={onClick}
      >
        <div className="dform-list_item_name">
          {dForm.name}
        </div>
        <div className="dform-list_item_description">
          {dForm.description}
        </div>
        <div className="dform-list_item_organizations">
          {dForm.groups && dForm.groups.map((group) => <div>{group.name}</div>)}
        </div>

      </div>
    )
  }

  return (
    <Row>
      <Col className="applications">
        <div className="applications_header">
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
          <div className="applications_list">
            {dForms && dForms.map((dForm) => (
              <DFormListItem dForm={dForm} onClick={() => {setSelectedDForm(dForm)}} />
            ))}
          </div>
        </Scrollbars>
      </Col>
      {selectedDForm && (
        <Col className="application-dependencies">
          <Card className={"application-dependencies_header-container"}>
            <CardBody className="application-dependencies_header">
              <Navbar light expand="md" className="p-0">
                <UncontrolledDropdown>
                  <DropdownToggle nav caret={true} style={{fontSize: "18px", color: "#707070"}}>
                    {dependenciesSelectActiveItem}
                  </DropdownToggle>
                  <DropdownMenu left>
                    {dependenciesList.map((item) => (
                      <DropdownItem
                        onClick={() => {setDependenciesSelectActiveItem(item)}}
                      >
                        <NavItem style={{fontSize: "16px"}}>
                          {item}
                        </NavItem>
                      </DropdownItem>
                    ))}
                  </DropdownMenu>
                </UncontrolledDropdown>
                <div className="ml-auto">
                  <span className="font-weight-bold" style={{color: "#707070"}}>{selectedDForm.name} dependencies</span>
                </div>
              </Navbar>
            </CardBody>
          </Card>
        </Col>
      )}
    </Row>
  )
}

export default Applications;
