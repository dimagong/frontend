
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
import {
  selectManager,
  selectUserDForms,
  selectUserWorkflows,
  selectUserReviewers,
} from "app/selectors";

import appSlice from 'app/slices/appSlice'

const {
  setManagerOnboardingProperty,
  setManagerOnboarding,
  setUserDForms,
  setUserWorkflows,
  setUserReviewers,
  createUserOnboardingRequest,
  deleteUserOnboardingRequest,
  updateUserOnboardingReviewersRequest,
  updateUserOnboardingWorkflowRequest,
} = appSlice.actions;

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
  const dispatch = useDispatch();

  const manager = useSelector(selectManager);
  const dForms = useSelector(selectUserDForms)
  const workflows = useSelector(selectUserWorkflows)
  const reviewers = useSelector(selectUserReviewers)

  const closeCreateOnboarding = () => {
    dispatch(setManagerOnboarding(null))
  }

  const onSelectDFormChange = (values) => {
    values ? dispatch(setUserDForms(values[0].value)) : dispatch(setUserDForms(null))
  }

  const onSelectReviewersChange = (values) => {
    values ? dispatch(setUserReviewers(reviewers.filter(group => values.some( value => value.value.id === group.id)))) : dispatch(setUserReviewers([]))

    if(!isCreate.current && values) {
      dispatch(updateUserOnboardingReviewersRequest({
        reviewersIds: values.map(reviewer => reviewer.value.id),
        onboardingId: manager.onboarding.id,
        managerId: manager.id,
      }))
    }
  }

  const onSelectWorkflowChange = (values) => {
    values ? dispatch(setUserWorkflows(values[values.length-1].value)) : dispatch(setUserWorkflows(null))

    if(!isCreate.current && values) {
      dispatch(updateUserOnboardingWorkflowRequest({
        workflowId: values[values.length-1].value.id,
        onboardingId: manager.onboarding.id,
        managerId: manager.id
      }))
    }
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
    <Col md="12" lg="12" className="p-0 ml-0">
      <Card className="border-0 mb-0">
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
                    isDisabled={!isCreate.current}
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
                  />
                </div>
              </div>
              <div className="d-flex mb-1">
                <div className="font-weight-bold column-sizing">Reviewer</div>
                <div className="full-width">
                  <Select
                    components={{DropdownIndicator}}
                    value={prepareSelect(manager.onboarding.reviewers)}
                    maxMenuHeight={200}
                    isMulti
                    isSearchable={manager.onboarding.reviewers && manager.onboarding.reviewers.length < 5}
                    isClearable={false}
                    styles={colourStyles}
                    options={(manager.onboarding.reviewers && manager.onboarding.reviewers.length < 5) ? prepareSelect(reviewers) : []}
                    noOptionsMessage={() => (manager.onboarding.reviewers && manager.onboarding.reviewers.length < 5) ? "No options" : "Maximum reviewers count is 5"}
                    onChange={(values) => {
                      onSelectReviewersChange(values)
                    }}
                    className="fix-margin-select"
                    classNamePrefix="select"
                  />

                </div>
              </div>
              <div className="d-flex mb-1">
                <div className="font-weight-bold column-sizing">Workflow</div>
                <div className="full-width">

                  <Select
                    components={{DropdownIndicator: null}}
                    value={prepareDFormSelect(manager.onboarding.workflow ? [manager.onboarding.workflow] : [])}
                    maxMenuHeight={200}
                    isSearchable={!manager.onboarding.workflow}
                    isMulti
                    isClearable={false}
                    styles={colourStyles}
                    options={prepareDFormSelect(workflows)}
                    onChange={(values) => {
                      onSelectWorkflowChange(values)
                    }}
                    className="fix-margin-select"
                    classNamePrefix="select"
                  />

                </div>
              </div>
              <div className="d-flex">
                <div className="font-weight-bold column-sizing">Private</div>
                <div className="" id="onboarding-create-config-is-internal">
                  <Checkbox
                    disabled={!isCreate.current}
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
