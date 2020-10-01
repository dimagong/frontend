import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  Row,
  Col,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Button
} from "reactstrap";
import { X, Eye, EyeOff } from "react-feather";
import MultiSelect from "components/MultiSelect/multiSelect";
import { prepareSelectGroups } from "utility/select/prepareSelectData";
import { useDispatch, useSelector } from "react-redux";
import { selectdForms, selectdForm } from "app/selectors/onboardingSelectors";
import {Check, Plus} from "react-feather";
import DFormCreateModal from './DFormCreateModal'

const DFormForm = () => {
  const dForm = useSelector(selectdForm);

  const closeDForm = () => {};

  return (
    <Card className="dForm">
      <CardHeader>
        <CardTitle className="font-weight-bold">DForm</CardTitle>
        <div>
          {
            // this.state.isStateConfig ?
            true ? (
              <EyeOff
                size={15}
                className="cursor-pointer mr-1"
                onClick={() => this.changeStateConfig(false)}
              />
            ) : (
              <Eye
                size={15}
                className="cursor-pointer mr-1"
                onClick={() => this.changeStateConfig(true)}
              />
            )
          }
          <X size={15} className="cursor-pointer mr-1" onClick={closeDForm} />
        </div>
      </CardHeader>
      <CardBody className="card-top-padding">
        <div className="mt-2">
          <MultiSelect setGroups={() => null} groups={prepareSelectGroups(dForm.groups)} />
        </div>
        {/* <FormCreate fileLoader={false}
                      submitDForm={(dForm, data) => this.submitDForm(dForm, data)}
                      liveValidate={false}
                      isShowToggleProtectedProperties={true}
                      dForm={this.state.dFormTemplate}
                      isStateConfig={this.state.isStateConfig}
          ></FormCreate> */}
        <Row>
          <Col>
            <div className="dform__form__name form-group border-bottom">
              <label>Name</label>
              <input
                value={dForm.name}
                // onChange={handleDFormName}
                type="text"
                className="form-control"
              />
            </div>
            <div className="dform__form__description form-group border-bottom">
              <label>Description</label>
              <input
                value={dForm.description}
                // onChange={handleDFormDescription}
                type="text"
                className="form-control"
              />
            </div>

            <div className="dform__form__controls">
              <Nav tabs className="dform__form__controls__sections mt-1 border mb-0">
                {Object.keys(dForm.schema.uiSchema.onlySections).map((section, index) => (
                  <NavItem key={section}>
                    <NavLink
                      // className="active"
                      // onClick={switchTabSection}
                    >
                      <span className="align-middle ml-50">{section}</span>
                      <div className="ml-1 float-right">
                        {/* {this.modalEditDependencies("sections", section)} */}
                        <DFormCreateModal/>
                      </div>
                    </NavLink>
                  </NavItem>
                ))}
                <NavItem className="border">
                  <NavLink
                    // onClick={addNewSection}
                  >
                    <span className="align-middle ml-50 primary">Add tab</span>
                    <div className="ml-1 float-right">
                      <Plus size={20} className="cursor-pointer primary" />
                    </div>
                  </NavLink>
                </NavItem>
              </Nav>
              {/* <TabContent
                activeTab={this.state.tabConfig}
                className="border form-create__tab-min-height"
              >
                {onlySections.map((section, index) => (
                  <TabPane tabId={index} key={section}>
                    <Row className="mx-0" col="12">
                      <Col className="p-0" sm="12">
                        {renderElementsByGroupsAndSections(section)}
                        <div
                          className="form-create__add-new-group"
                          onClick={() => this.addNewGroup(section)}
                        >
                          Add group
                        </div>
                      </Col>
                    </Row>
                    <Row className="mt-1 mb-1">
                      {renderElementsWithNoGroupsAndSections(section)}
                    </Row>
                  </TabPane>
                ))}
              </TabContent> */}
            </div>
            <Row>
              <Col md="12">
                <div className="d-flex justify-content-center flex-wrap mt-2">
                  <Button
                    color="primary d-flex-left"
                    onClick={() => this.submitDForm()}
                  >
                    Save
                  </Button>
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
      </CardBody>
    </Card>
  );
};

export default DFormForm;
