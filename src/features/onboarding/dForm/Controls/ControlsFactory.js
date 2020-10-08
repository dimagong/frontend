import React, {useState} from 'react'
import {
    Badge,
    Card,
    CardBody,
    CardHeader,
    Col,
    FormGroup,
    Nav,
    NavItem,
    NavLink,
    Row,
    TabContent,
    TabPane
  } from "reactstrap";
import Checkbox from "components/@vuexy/checkbox/CheckboxesVuexy";
import classnames from "classnames";
import {Check, Plus} from "react-feather";
import ConrolsCreateModal from './ConrolsCreateModal'
import ControlsSections from './ControlsSections';
import ControlsSection from './ControlsSection';
import { useDispatch, useSelector } from "react-redux";
import { selectdForms, selectdForm } from "app/selectors/onboardingSelectors";

const ControlsFactory = () => {
  const dForm = useSelector(selectdForm);

    const onlySectionsKeys =  Object.keys(dForm.schema.uiSchema.onlySections);
    const [tabConfig, setTabConfig] = useState("1")

    return (
        <div className="dform__form__controls">
             <Row>
        {/* {renderElementsWithoutGroupsAndSections()} */}
      </Row>

      <Nav tabs className="dform__form__controls__sections  mt-1 border mb-0">
        {/* TODO: dForm sections */}
        {
          onlySectionsKeys.map((section, index) =>
            <NavItem key={section}>
              <NavLink
                className={classnames({
                  active: tabConfig === index
                })}
                onClick={() => {
                    setTabConfig(index)
                }}
              >
                <span className="align-middle ml-50">{section}</span>
                <div className="ml-1 float-right">
                  {/* TODO: dForm sections */}
                  <ConrolsCreateModal />

                  {/* {modalEditDependencies('sections', section)} */}
                </div>
              </NavLink>
            </NavItem>
          )
        }
        <NavItem className="border">
          <NavLink
            onClick={() => {
            //   addNewSection()
            }}
          >
            <span className="align-middle ml-50 primary">Add tab</span>
            <div className="ml-1 float-right">
              <Plus size={20} className="cursor-pointer primary"/>
            </div>
          </NavLink>
        </NavItem>
      </Nav>
      <TabContent activeTab={tabConfig} className="border form-create__tab-min-height">
        {
          onlySectionsKeys.map((sectionName, index) =>
          <TabPane tabId={index} key={sectionName}>
            <Row className="mx-0" col="12">
              <Col className="p-0" sm="12">
                <ControlsSections sectionName={sectionName}/>
                <div className="form-create__add-new-group" 
              //   onClick={() => 
                  // addNewGroup(section)
                  // }
                  >
                  Add group
                </div>
              </Col>
            </Row>
            <Row className="mt-1 mb-1">
              {/* {renderElementsWithNoGroupsAndSections(section)} */}
            </Row>
          </TabPane>
          )
        }
      </TabContent>
        </div>
    )
}

export default ControlsFactory
