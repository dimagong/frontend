
import React from 'react'
import {
    Card,
    CardHeader,
    CardTitle,
    CardBody,
    Col,
    Button,
    UncontrolledTooltip
  } from "reactstrap"
import {X, Check} from "react-feather"
import Select from "react-select"
import {colourStyles, colorMultiSelect} from "utility/select/selectSettigns";
import {DropdownIndicator} from 'components/MultiSelect/multiSelect'
import Checkbox from "components/@vuexy/checkbox/CheckboxesVuexy";
import { useDispatch, useSelector } from "react-redux";
import { selectManager, selectUserDForms, selectUserWorkfows, selectUserReviewers } from "app/selectors";
import {setManagerOnboardingProperty, setManagerOnboarding , setUserDForms, setUserWorkflows, setUserReviewers, createUserOnboardingRequest, deleteUserOnboardingRequest} from 'app/slices/appSlice'

const prepareSelect = (data) => {
  return data.map((value) => {
    return {
      value: value,
      label: value["first_name"],
      color: colorMultiSelect
    };
  });
}
const prepareDFormSelect = (data) => {
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
      values ? dispatch(setUserDForms(values[0].value)) : dispatch(setUserDForms(null))
    }

    const onSelectReviewersChange = (values) => {
      values ? dispatch(setUserReviewers(reviewers.filter( group => values.some( value => value.label === group.first_name)))) : dispatch(setUserDForms([]))
    }

    const onSelectWorkflowChange = (values) => {
      values ? dispatch(setUserWorkflows(values[0].value)) : dispatch(setUserDForms(null))
    }

    const createOnboarding = () => {
      dispatch(createUserOnboardingRequest(manager.onboarding))
    }

    const deleteOnboarding = () => {
      if(window.confirm("Are you sure?")){
        dispatch(deleteUserOnboardingRequest(manager.onboarding))
      }
    }
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
                                        value={prepareDFormSelect(manager.onboarding.d_form ? [manager.onboarding.d_form] : [])}
                                        maxMenuHeight={200}
                                        isMulti
                                        isClearable={false}
                                        styles={colourStyles}
                                        options={prepareDFormSelect(dForms)}
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
                                        value={prepareDFormSelect(manager.onboarding.workflow ? [manager.onboarding.workflow] : [])}
                                        maxMenuHeight={200}
                                        isMulti
                                        isClearable={false}
                                        styles={colourStyles}
                                        options={prepareDFormSelect(workflows)}
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
                                    isCreate.current
                                    ?<div className="d-flex justify-content-end flex-wrap mt-2">
                                      <Button className="mt-1" color="primary" onClick={createOnboarding}>Save</Button>
                                    </div>
                                    : <div className="d-flex justify-content-end flex-wrap mt-2">
                                    <Button disabled={!!!manager.onboarding.id} className="mt-1" color="danger" onClick={deleteOnboarding}>Delete onboarding</Button>
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
