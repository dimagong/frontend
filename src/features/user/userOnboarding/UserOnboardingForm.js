import * as yup from "yup";
import { toast } from "react-toastify";
import React, { useState } from "react";
import { X, Check, Plus } from "react-feather";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardBody, Col, Button, UncontrolledTooltip, Row } from "reactstrap";

import DeprecatedNmpSelect from "components/nmp/DeprecatedNmpSelect";
import Checkbox from "components/@vuexy/checkbox/CheckboxesVuexy";
import DeprecatedNmpButton from "components/nmp/DeprecatedNmpButton";

import { prepareSelectReviewers } from "utility/select/prepareSelectData";

import appSlice from "app/slices/appSlice";
import { createLoadingSelector } from "app/selectors/loadingSelector";
import { selectManager, selectUserDForms, selectUserWorkflows, selectUserReviewers } from "app/selectors";

const {
  setManagerOnboardingProperty,
  setUserDForms,
  setUserWorkflows,
  setUserReviewers,
  createUserOnboardingRequest,
  deleteUserOnboardingRequest,
  updateUserOnboardingReviewersRequest,
  updateUserOnboardingWorkflowRequest,
} = appSlice.actions;

const selectStyles = {
  control: (styles) => ({
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
  }),
  placeholder: (styles) => ({
    ...styles,
    color: "#4B484D",
  }),
  input: (styles) => ({
    ...styles,

    padding: "6px 7px 6px 0",
  }),

  indicatorSeparator: () => ({ display: "none" }),
};

const prepareDFormSelect = (data) => {
  return data.map((value) => ({
    value: value,
    label: value["name"],
  }));
};

const onboardingCreateValidationSchema = yup.object().shape({
  reviewers: yup
    .array()
    .of(yup.object())
    .min(1, "Please, select reviewer and click plus button to add at least one reviewer"),
  workflow: yup.object().typeError("Please, select workflow"),
  d_form: yup.object().typeError("Please, select dForm"),
});

const sortByLabel = (a, b) => a.label.localeCompare(b.label);

const UserOnboardingCreate = ({ isCreate }) => {
  const dispatch = useDispatch();

  const manager = useSelector(selectManager);
  const dForms = useSelector(selectUserDForms);
  const workflows = useSelector(selectUserWorkflows);
  const reviewers = useSelector(selectUserReviewers);
  const isOnboardingCreateLoading = useSelector(createLoadingSelector([createUserOnboardingRequest.type], true));

  const dFormWorkFlows = workflows.filter((wf) => wf.context === "application");

  const [selectedReviewer, setSelectedReviewer] = useState(null);

  const onSelectDFormChange = (value) => {
    value ? dispatch(setUserDForms(value.value)) : dispatch(setUserDForms(null));
  };

  const onSelectReviewersChange = (values) => {
    if (values && !values.length && !isCreate) {
      toast.error("You cannot delete last reviewer");

      return;
    }

    values ? dispatch(setUserReviewers(values)) : dispatch(setUserReviewers([]));

    // update reviewers for existing onboarding
    if (!isCreate && values) {
      dispatch(
        updateUserOnboardingReviewersRequest({
          reviewersIds: values.map((reviewer) => reviewer.id),
          onboardingId: manager.onboarding.id,
          managerId: manager.id,
        })
      );
    }
  };

  const onSelectWorkflowChange = (value) => {
    value ? dispatch(setUserWorkflows(value.value)) : dispatch(setUserWorkflows(null));

    if (!isCreate && value) {
      dispatch(
        updateUserOnboardingWorkflowRequest({
          workflowId: value.value.id,
          onboardingId: manager.onboarding.id,
          managerId: manager.id,
        })
      );
    }
  };

  const createOnboarding = async () => {
    const isValid = await onboardingCreateValidationSchema.validate(manager.onboarding).catch((err) => {
      toast.error(err.message);
    });

    if (isValid) {
      dispatch(
        createUserOnboardingRequest({
          ...manager.onboarding,
          is_internal: manager?.onboarding?.d_form?.is_private || manager?.onboarding?.is_internal,
        })
      );
    }
  };

  const deleteOnboarding = () => {
    if (window.confirm("Are you sure?")) {
      dispatch(deleteUserOnboardingRequest(manager.onboarding));
    }
  };

  const handleReviewerAdd = () => {
    if (selectedReviewer) {
      const newReviewers = [...manager.onboarding.reviewers, selectedReviewer.value];
      setSelectedReviewer(null);
      onSelectReviewersChange(newReviewers);
    }
  };

  const handleReviewerRemove = (reviewer) => {
    const newReviewers = manager.onboarding.reviewers.filter((selectedReviewer) => selectedReviewer.id !== reviewer.id);
    onSelectReviewersChange(newReviewers);
  };

  const isReviewersLimitNotExceed =
    manager.onboarding && manager.onboarding.reviewers && manager.onboarding.reviewers.length < 5;

  const availableReviewers = reviewers.filter(
    (reviewer) =>
      !manager.onboarding.reviewers.filter((onboardingReviewer) => onboardingReviewer.id === reviewer.id).length
  );

  return (
    <Col md="12" lg="12" className="p-0 ml-0">
      <Card className="border-0 mb-0">
        <CardBody className="onboarding-create-feature_body">
          <Row>
            <Col md={4}>
              <Row className="mb-2">
                <Col>
                  <div className="survey-assign_body_select-label">Select dForm</div>
                  <DeprecatedNmpSelect
                    disabled={!isCreate}
                    styles={selectStyles}
                    value={prepareDFormSelect(manager.onboarding.d_form ? [manager.onboarding.d_form] : [])[0]}
                    options={prepareDFormSelect(dForms).sort(sortByLabel)}
                    onChange={(value) => {
                      onSelectDFormChange(value);
                    }}
                  />
                </Col>
              </Row>
              <Row>
                <Col>
                  <div className="survey-assign_body_select-label">Select workflow</div>
                  <DeprecatedNmpSelect
                    disabled={!isCreate}
                    styles={selectStyles}
                    value={prepareDFormSelect(manager.onboarding.workflow ? [manager.onboarding.workflow] : [])[0]}
                    options={prepareDFormSelect(dFormWorkFlows).sort(sortByLabel)}
                    onChange={(value) => {
                      onSelectWorkflowChange(value);
                    }}
                  />
                </Col>
              </Row>
            </Col>
            <Col>
              <div className="mb-2">
                <div className="survey-assign_body_select-label">Who will review the results?</div>
                <div className="survey-assign_body_reviewers-select_container">
                  <div className="survey-assign_body_reviewers-select_container_select">
                    <DeprecatedNmpSelect
                      value={selectedReviewer}
                      styles={selectStyles}
                      options={
                        isReviewersLimitNotExceed ? prepareSelectReviewers(availableReviewers).sort(sortByLabel) : []
                      }
                      noOptionsMessage={() =>
                        isReviewersLimitNotExceed ? "No options" : "Maximum reviewers count is 5"
                      }
                      onChange={(value) => {
                        setSelectedReviewer(value);
                      }}
                    />
                  </div>
                  <button
                    onClick={() => {
                      handleReviewerAdd();
                    }}
                  >
                    <Plus />
                  </button>
                </div>
              </div>
              <Row>
                <Col>
                  <div className="survey-assign_body_reviewers">
                    {manager.onboarding.reviewers.map((reviewer) => (
                      <div className="reviewer-tile" key={reviewer.id}>
                        <div className="reviewer-tile_name">{`${reviewer.first_name} ${reviewer.last_name}`}</div>
                        <div className="reviewer-tile_cross" onClick={() => handleReviewerRemove(reviewer)}>
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
                  disabled={!isCreate || manager?.onboarding?.d_form?.is_private}
                  size="sm"
                  color="primary"
                  icon={<Check className="vx-icon" size={12} />}
                  label=""
                  checked={manager?.onboarding?.d_form?.is_private || manager?.onboarding?.is_internal}
                  onChange={(event) =>
                    dispatch(
                      setManagerOnboardingProperty({
                        is_internal: event.target.checked,
                      })
                    )
                  }
                />
              </div>
              <UncontrolledTooltip placement="right" target="onboarding-create-config-is-internal">
                For reviewers only
              </UncontrolledTooltip>
            </div>

            <div>
              {isCreate ? (
                <div>
                  <DeprecatedNmpButton
                    className="px-4"
                    color="primary"
                    loading={isOnboardingCreateLoading}
                    onClick={createOnboarding}
                  >
                    Create
                  </DeprecatedNmpButton>
                </div>
              ) : (
                <div>
                  <Button disabled={!!!manager.onboarding.id} color="danger" onClick={deleteOnboarding}>
                    Delete onboarding
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardBody>
      </Card>
    </Col>
  );
};

export default UserOnboardingCreate;
