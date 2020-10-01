
import React from 'react'
import {
    Card,
    CardHeader,
    CardTitle,
    CardBody,
    FormGroup,
    Row,
    Col,
    Input,
    Form,
    Button,
    FormFeedback,
    Nav,
    NavItem,
    NavLink,
    TabContent,
    TabPane,
    Media, Spinner,
    UncontrolledTooltip
  } from "reactstrap"
import {User, X, Check, Plus, Edit2, RefreshCw, EyeOff, Eye} from "react-feather"
import Select, {components} from "react-select"
import {colourStyles} from "utility/select/selectSettigns";
import {DropdownIndicator} from 'components/MultiSelect/multiSelect'
import Checkbox from "components/@vuexy/checkbox/CheckboxesVuexy";

const UserOnboardingCreate = () => {
    return (
        <Col md="12" lg="12" className="pl-0 ml-0 mt-2">
                          <Card className="border mb-0">
                            <CardHeader className="m-0">
                              <CardTitle>
                                Onboarding create
                              </CardTitle>
                              <X size={15} onClick={() => this.closeCreateOnboarding()}/>
                            </CardHeader>
                            <CardBody className="pt-0">
                              <hr/>
                              <div className="mt-3">
                                <div className="users-page-view-table">
                                  <div className="d-flex mb-1">
                                    <div className="font-weight-bold column-sizing">dForm</div>
                                    <div className="full-width">
  
                                      <Select
                                        components={{DropdownIndicator: null}}
                                        value={this.getCustomSelectedValues(this.state.onboardingTemplate.d_form)}
                                        maxMenuHeight={200}
                                        isMulti
                                        isClearable={false}
                                        styles={colourStyles}
                                        options={this.selectNoRepeat(this.state.dFormSelects, this.getCustomSelectedValues(this.state.onboardingTemplate.d_form))}
                                        className="fix-margin-select"
                                        onChange={(values) => {
                                          this.setDFormCreate(values)
                                        }}
                                        classNamePrefix="select"
                                        id="languages"
                                      />
                                    </div>
                                  </div>
                                  <div className="d-flex mb-1">
                                    <div className="font-weight-bold column-sizing">Reviewer</div>
                                    <div className="full-width">
  
                                      <Select
                                        components={{DropdownIndicator}}
                                        value={this.getCustomSelects(this.state.onboardingTemplate.reviewers)}
                                        maxMenuHeight={200}
                                        isMulti
                                        isClearable={false}
                                        styles={colourStyles}
                                        options={this.selectNoRepeat(this.state.reviewersSelect, this.getCustomSelects(this.state.onboardingTemplate.reviewers))}
                                        onChange={(values) => {
                                          this.setReviewersCreate(values)
                                        }}
                                        className="fix-margin-select"
                                        classNamePrefix="select"
                                        id="languages"
                                      />
  
                                    </div>
                                  </div>
                                  <div className="d-flex mb-1">
                                    <div className="font-weight-bold column-sizing">Workflow</div>
                                    <div className="full-width">
  
                                      <Select
                                        components={{DropdownIndicator: null}}
                                        value={this.getCustomSelectedValues(this.state.onboardingTemplate.workflow)}
                                        maxMenuHeight={200}
                                        isMulti
                                        isClearable={false}
                                        styles={colourStyles}
                                        options={this.selectNoRepeat(this.state.workflowSelects, this.getCustomSelectedValues(this.state.onboardingTemplate.workflow))}
                                        onChange={(values) => {
                                          this.setWorkflowCreate(values)
                                        }}
                                        className="fix-margin-select"
                                        classNamePrefix="select"
                                        id="languages"
                                      />
  
                                    </div>
                                  </div>
                                  <div className="d-flex">
                                    <div className="font-weight-bold column-sizing">Private</div>
                                    <div className="" id="onboarding-create-config-is-internal">
                                      <Checkbox
                                        size="sm"
                                        color="primary"
                                        icon={<Check className="vx-icon" size={12}/>}
                                        label=""
                                        checked={this.state.onboardingTemplate.is_internal}
                                        onChange={(event) => this.setState({
                                          onboardingTemplate: {
                                            ...this.state.onboardingTemplate,
                                            is_internal: event.target.checked
                                          }
                                        })}
                                      />
  
                                    </div>
                                    <UncontrolledTooltip placement="right" target="onboarding-create-config-is-internal">
                                      For reviewers only
                                    </UncontrolledTooltip>
                                  </div>
                                </div>
                                <div>
                                  {
                                    <div className="d-flex justify-content-end flex-wrap mt-2">
                                      <Button className="mt-1" color="primary" onClick={() => {
                                        this.createOnboarding()
                                      }}>Save</Button>
                                    </div>
                                  }
                                </div>
                              </div>
  
                            </CardBody>
                          </Card>
                        </Col>
    )
}

export default UserOnboardingCreate
