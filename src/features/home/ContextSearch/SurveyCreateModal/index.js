import React, { useState, useEffect } from 'react';
import * as yup from 'yup'
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { createLoadingSelector } from "app/selectors/loadingSelector";
import { selectOrganizations } from "app/selectors/groupSelector";
import { selectError } from "app/selectors";
import { usePrevious } from "hooks/common";
import { Input, Select } from "features/Surveys/Components/SurveyFormComponents";
import SurveyModal from "features/Surveys/Components/SurveyModal";

import appSlice from "app/slices/appSlice";

import './styles.scss'

const {
  createSurveyRequest,
  changeSurveyTitleAndDescription,
} = appSlice.actions;

const editSurveyValidation = yup.object().shape({
  description: yup.string().trim().required("Please, provide some description"),
  title: yup.string().trim().required("Title is required"),
});

const createSurveyValidation = yup.object().shape({
  organization: yup.object().typeError('Select organisation for survey'),
  description: yup.string().trim().required("Please, provide some description"),
  title: yup.string().trim().required("Title is required"),
});

const SurveyCreateModal = ({isOpen, onClose, isEdit, surveyData}) => {

  const dispatch = useDispatch();

  const [surveyTitle, setSurveyTitle] = useState("");
  const [surveyDescription, setSurveyDescription] = useState("");
  const [surveyOrganization, setSurveyOrganization] = useState(null);

  const isLoading = useSelector(createLoadingSelector([createSurveyRequest.type], true));
  const error = useSelector(selectError);
  const organizations = useSelector(selectOrganizations);

  const prevLoadingValue = usePrevious(isLoading);

  const handleModalClose = () => {

    if (!isLoading) {
      setSurveyTitle("");
      setSurveyDescription("");
      setSurveyOrganization(null);

      onClose()
    }
  };

  const handleSubmit = async () => {

    const surveyData = {
      title: surveyTitle,
      description: surveyDescription,
      organization: !isEdit && surveyOrganization && {
        id: surveyOrganization.value.id,
        type: surveyOrganization.value.type,
      }
    };

    const validationSchema = isEdit ? editSurveyValidation : createSurveyValidation;

    const isValid = await validationSchema
                          .validate(surveyData)
                          .catch((err) => { toast.error(err.message) });

    if (!isValid) return;

    if (isEdit) {
      dispatch(changeSurveyTitleAndDescription(surveyData));
      handleModalClose();
    } else {
      dispatch(createSurveyRequest(surveyData));
    }
  };

  const handleOrganizationSelect = (option) => {
    setSurveyOrganization(option)
  };

  const formatOrganizations = (organizations) => (
    organizations.map((organization) => ({
      value: organization,
      label: organization.name,
    }))
  );

  // Close modal after user hit submit and request ends with no error
  useEffect(() => {
    if (!error && prevLoadingValue === true && !isLoading) {
      handleModalClose()
    }
  }, [isLoading]);

  useEffect(() => {
    if (isEdit && isOpen) {
      setSurveyTitle(surveyData.latest_version.title);
      setSurveyDescription(surveyData.latest_version.description);
    }
  }, [isEdit, isOpen]);

  return (
    <SurveyModal
      className="survey-create-modal"
      title={"Edit Survey"}
      isOpen={isOpen}
      onClose={handleModalClose}
      submitBtnText={isEdit ? "Save" : "Create"}
      onSubmit={handleSubmit}
      isSubmitProceed={isLoading}
    >
      <Input
        label={"Survey title"}
        name={"Survey title"}
        value={surveyTitle}
        onChange={(e) => setSurveyTitle(e.target.value)}
      />
      <Input
        label={"Description"}
        name={"Survey description"}
        value={surveyDescription}
        onChange={(e) => setSurveyDescription(e.target.value)}
      />
      {!isEdit && (
        <div className="survey-create-modal_select">
          <label htmlFor="organization">
            Organisation
          </label>
          <Select
            onChange={handleOrganizationSelect}
            value={surveyOrganization}
            options={formatOrganizations(organizations)}
          />
        </div>
      )}

    </SurveyModal>
  )
};

export default SurveyCreateModal;
