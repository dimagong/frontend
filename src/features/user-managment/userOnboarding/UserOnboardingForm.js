import React, { useState } from 'react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  Col,
  Button,
  UncontrolledTooltip, Row
} from "reactstrap"
import {X, Check, Plus, ChevronDown} from "react-feather"
import Select, {components} from "react-select"
import Checkbox from "components/@vuexy/checkbox/CheckboxesVuexy";
import { useDispatch, useSelector } from "react-redux";
import {
  selectManager,
  selectUserDForms,
  selectUserWorkflows,
  selectUserReviewers,
} from "app/selectors";

import {toast} from "react-toastify";
import * as yup from "yup";

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

const selectStyles = {
  control: styles => ({
    ...styles,
    backgroundColor: "white",
    border: "1px solid rgba(34, 60, 80, 0.2)",
    borderRadius: "8px",
    // This line disable the blue border
    boxShadow: "none",
    minHeight: "auto",
    cursor: "pointer",
    padding: "0 0 0 7px",
    fontSize: "11px",
    fontFamily: "Montserrat",
  }),
  placeholder: (styles) => ({
    ...styles,
    color: "#4B484D",
  }),
  input: (styles) => ({
    ...styles,

    padding: "6px 7px 6px 0",
  }),

  indicatorSeparator: () => ({display: 'none'}),
};

const prepareSelect = (data) => {
  return data.map((value) => ({
    value: value,
    label: value["first_name"] + " " + value["last_name"]
  }));
};
const prepareDFormSelect = (data) => {
  return data.map((value) => ({
    value: value,
    label: value["name"]
  }));
};

const DropdownIndicator = props => {
  return (
    <components.DropdownIndicator {...props}>
      <ChevronDown />
    </components.DropdownIndicator>
  );
};

const onboardingCreateValidationSchema = yup.object().shape({
  reviewers: yup.array().of(yup.object()).min(1, 'Please, select reviewer and click plus button to add at least one reviewer'),
  workflow: yup.object().typeError('Please, select workflow'),
  d_form: yup.object().typeError('Please, select dForm'),
});

const UserOnboardingCreate = ({isCreate}) => {
  const dispatch = useDispatch();

  const manager = useSelector(selectManager);
  const dForms = useSelector(selectUserDForms);
  const workflows = useSelector(selectUserWorkflows);
  const reviewers = useSelector(selectUserReviewers);

  const [selectedReviewer, setSelectedReviewer] = useState(null);

  const onSelectDFormChange = (value) => {
    value ? dispatch(setUserDForms(value.value)) : dispatch(setUserDForms(null))
  };

  const onSelectReviewersChange = (values) => {

    if (values && !values.length && !isCreate.current) {
      toast.error("You cannot delete last reviewer");

      return;
    }

    values ? (
      dispatch(setUserReviewers(values))
    ) : (
      dispatch(setUserReviewers([]))
    );

    // update reviewers for existing onboarding
    if(!isCreate.current && values) {
      dispatch(updateUserOnboardingReviewersRequest({
        reviewersIds: values.map(reviewer => reviewer.id),
        onboardingId: manager.onboarding.id,
        managerId: manager.id,
      }))
    }
  };

  const onSelectWorkflowChange = (value) => {
    value ? dispatch(setUserWorkflows(value.value)) : dispatch(setUserWorkflows(null));

    if(!isCreate.current && value) {
      dispatch(updateUserOnboardingWorkflowRequest({
        workflowId: value.value.id,
        onboardingId: manager.onboarding.id,
        managerId: manager.id
      }))
    }
  };

  const createOnboarding = async () => {
    const isValid = await onboardingCreateValidationSchema
      .validate(manager.onboarding)
      .catch((err) => { toast.error(err.message) });

    if (isValid) {
      dispatch(createUserOnboardingRequest(manager.onboarding))
    }
  };

  const deleteOnboarding = () => {
    if(window.confirm("Are you sure?")){
      dispatch(deleteUserOnboardingRequest(manager.onboarding))
    }
  };

  const handleReviewerAdd = () => {
    if (selectedReviewer) {
      const newReviewers = [...manager.onboarding.reviewers, selectedReviewer.value];
      setSelectedReviewer(null);
      onSelectReviewersChange(newReviewers)

    }
  };

  const handleReviewerRemove = (reviewer) => {
    const newReviewers = manager.onboarding.reviewers.filter(selectedReviewer => selectedReviewer.id !== reviewer.id);
    onSelectReviewersChange(newReviewers);
  };

  const isReviewersLimitNotExceed = manager.onboarding.reviewers && manager.onboarding.reviewers.length < 5;

  const availableReviewers = reviewers.filter(reviewer => !manager.onboarding.reviewers.filter(onboardingReviewer => onboardingReviewer.id === reviewer.id).length);

  return (
    <Col md="12" lg="12" className="p-0 ml-0">
      <Card className="border-0 mb-0">
        <CardBody className="onboarding-create-feature_body">


          <Row>
            <Col md={4}>
              <Row className="mb-2">
                <Col>
                  <div className="survey-assign_body_select-label">
                    Select dForm
                  </div>
                  <Select
                    isDisabled={!isCreate.current}
                    styles={selectStyles}
                    components={{ DropdownIndicator }}
                    value={prepareDFormSelect(manager.onboarding.d_form ? [manager.onboarding.d_form] : [])}
                    options={prepareDFormSelect(dForms)}
                    onChange={(value) => {
                      onSelectDFormChange(value)
                    }}
                  />
                </Col>
              </Row>
              <Row>
                <Col>
                  <div className="survey-assign_body_select-label">
                    Select workflow
                  </div>
                  <Select
                    isDisabled={!isCreate.current}
                    styles={selectStyles}
                    components={{ DropdownIndicator }}
                    value={prepareDFormSelect(manager.onboarding.workflow ? [manager.onboarding.workflow] : [])}
                    options={prepareDFormSelect(workflows)}
                    onChange={(value) => {
                      onSelectWorkflowChange(value)
                    }}
                  />
                </Col>

              </Row>
            </Col>
            <Col>
              <Row className="mb-2">
                <Col md={6}>
                  <div className="survey-assign_body_select-label">
                    Who will review the results?
                  </div>
                  <div className="survey-assign_body_reviewers-select_container">
                    <div className="survey-assign_body_reviewers-select_container_select">
                      <Select
                        components={{DropdownIndicator}}
                        value={selectedReviewer}
                        styles={selectStyles}
                        options={isReviewersLimitNotExceed ? prepareSelect(availableReviewers) : []}
                        noOptionsMessage={() => isReviewersLimitNotExceed ? "No options" : "Maximum reviewers count is 5"}
                        onChange={(value) => {
                          setSelectedReviewer(value)
                        }}
                      />
                    </div>
                    <button onClick={() =>{handleReviewerAdd()}}>
                      <Plus />
                    </button>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col>
                  <div className="survey-assign_body_reviewers">
                    {manager.onboarding.reviewers.map(reviewer => (
                      <div className="reviewer-tile">
                        <div className="reviewer-tile_name">
                          {`${reviewer.first_name} ${reviewer.last_name}`}
                        </div>
                        <div className="reviewer-tile_cross" onClick={() => {handleReviewerRemove(reviewer)}}>
                          <X color="white" size={15} />
                        </div>

                      </div>
                    ))}
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>


          <div className="mt-4 d-flex justify-content-between align-items-center">

            <div className="d-flex align-items-center">
              <div className="font-weight-bold mr-1">Private</div>
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

            <div>
              {
                isCreate.current
                  ?<div>
                    <Button className="px-4" color="primary" onClick={createOnboarding}>Create</Button>
                  </div>
                  : <div>
                    <Button disabled={!!!manager.onboarding.id} color="danger" onClick={deleteOnboarding}>Delete onboarding</Button>
                  </div>
              }
            </div>
          </div>

        </CardBody>
      </Card>
    </Col>
  )
};

export default UserOnboardingCreate
