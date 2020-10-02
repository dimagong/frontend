
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
import {colourStyles, colorMultiSelect} from "utility/select/selectSettigns";
import {DropdownIndicator} from 'components/MultiSelect/multiSelect'
import Checkbox from "components/@vuexy/checkbox/CheckboxesVuexy";
import { useDispatch, useSelector } from "react-redux";
import { selectManager, selectUserDForms, selectUserWorkfows, selectUserReviewers } from "app/selectors";
import {setManagerOnboardingProperty, setManagerOnboarding , setUserDForms, setUserWorkflows, setUserReviewers} from 'app/slices/appSlice'

const prepareSelect = (data) => {
  return data.map((value) => {
    return {
      value: value,
      label: value["name"],
      color: colorMultiSelect
    };
  });
}

const UserOnboardingCreate = ({isCreate}) => {
    const manager = useSelector(selectManager);
    const dForms = useSelector(selectUserDForms)
    const workflows = useSelector(selectUserWorkfows)
    const reviewers = useSelector(selectUserReviewers)
    const dispatch = useDispatch();

    

    const closeCreateOnboarding = () => {
      dispatch(setManagerOnboarding(null))
    }

    const onSelectDFormChange = (values) => {
     console.log(values)
      values ? dispatch(setUserDForms(values[0].value)) : dispatch(setUserDForms(null))
    }

    const onSelectReviewersChange = (values) => {
      console.log("onSelectDFormChange dForms", dForms)
      console.log("onSelectDFormChange", values)
      console.log("odForms", manager.onboarding)
      values ? dispatch(setUserReviewers(reviewers.filter( group => values.some( value => value.label === group.name)))) : dispatch(setUserDForms([]))

    }

    const onSelectWorkflowChange = (values) => {
      values ? dispatch(setUserWorkflows(values[0].value)) : dispatch(setUserDForms(null))
    }

    const createOnboarding = () => {}

    return (
        <Col md="12" lg="12" className="pl-0 ml-0 mt-2">
                          <Card className="border mb-0">
                            <CardHeader className="m-0">
                              <CardTitle>
                                Onboarding create
                              </CardTitle>
                              <X size={15} onClick={closeCreateOnboarding}/>
                            </CardHeader>
                            <CardBody className="pt-0">
                              <hr/>
                              <div className="mt-3">
                                <div className="users-page-view-table">
                                  <div className="d-flex mb-1">
                                    <div className="font-weight-bold column-sizing">dForm</div>
                                    <div className="full-width">
                                      <Select
                                        isDisabled={isCreate.current?false:true}
                                        components={{DropdownIndicator: null}}
                                        value={prepareSelect(manager.onboarding.d_form ? [manager.onboarding.d_form] : [])}
                                        maxMenuHeight={200}
                                        isMulti
                                        isClearable={false}
                                        styles={colourStyles}
                                        options={prepareSelect(dForms)}
                                        className="fix-margin-select"
                                        onChange={(values) => {
                                          onSelectDFormChange(values)
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
                                        isDisabled={isCreate.current?false:true}
                                        components={{DropdownIndicator}}
                                        value={prepareSelect(manager.onboarding.reviewers)}
                                        maxMenuHeight={200}
                                        isMulti
                                        isClearable={false}
                                        styles={colourStyles}
                                        options={prepareSelect(reviewers)}
                                        onChange={(values) => {
                                          onSelectReviewersChange(values)
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
                                        isDisabled={isCreate.current?false:true}
                                        components={{DropdownIndicator: null}}
                                        value={prepareSelect(manager.onboarding.workflow ? [manager.onboarding.workflow] : [])}
                                        maxMenuHeight={200}
                                        isMulti
                                        isClearable={false}
                                        styles={colourStyles}
                                        options={prepareSelect(workflows)}
                                        onChange={(values) => {
                                          onSelectWorkflowChange(values)
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
                                        disabled={isCreate.current?false:true}
                                        size="sm"
                                        color="primary"
                                        icon={<Check className="vx-icon" size={12}/>}
                                        label=""
                                        checked={manager.onboarding.is_internal}
                                        onChange={(event) => dispatch(setManagerOnboardingProperty({
                                            is_internal: event.target.checked
                                        }))}
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
                                      <Button className="mt-1" color="primary" onClick={createOnboarding}>Save</Button>
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
