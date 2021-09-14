import React, { useState, useEffect } from 'react';
import * as yup from 'yup'
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { createLoadingSelector } from "app/selectors/loadingSelector";
import { selectOrganizations } from "app/selectors/groupSelector";
import { selectError } from "app/selectors";
import { usePrevious } from "hooks/common";
import { Input, Select, Checkbox, TextArea } from "features/Surveys/Components/SurveyFormComponents";
import SurveyModal from "features/Surveys/Components/SurveyModal";

import appSlice from "app/slices/appSlice";

import './styles.scss'

const {
  createSurveyRequest,
  updateSurveyMainDataRequest,
} = appSlice.actions;


const editSurveyValidation = yup.object().shape({
  min_percent_pass: yup.number().transform(Number).min(50, "Percent to pass should not be lower then 50").max(100, "Percent to pass should not be higher then 100"),
  description: yup.string().trim().required("Please, provide some description"),
  title: yup.string().trim().required("Title is required"),
});

const createSurveyValidation = yup.object().shape({
  organization: yup.object().typeError('Select organisation for survey'),
  min_percent_pass: yup.number().transform(Number).min(50, "Percent to pass should not be lower then 50").max(100, "Percent to pass should not be higher then 100"),
  description: yup.string().trim().required("Please, provide some description"),
  title: yup.string().trim().required("Title is required"),
});

const SurveyCreateModal = ({isOpen, onClose, isEdit, surveyData}) => {

  const dispatch = useDispatch();

  const [surveyTitle, setSurveyTitle] = useState("");
  const [surveyDescription, setSurveyDescription] = useState("");
  const [surveyOrganization, setSurveyOrganization] = useState(null);
  const [isUserAbleToGoBackDuringSurvey, setIsUserAbleToGoBackDuringSurvey] = useState(false);
  const [minPercentToPass, setMinPercentToPass] = useState("50");

  const isSurveyCreating = useSelector(createLoadingSelector([createSurveyRequest.type], true));
  const isSurveyUpdating = useSelector(createLoadingSelector([updateSurveyMainDataRequest.type], true));

  const error = useSelector(selectError);
  const organizations = useSelector(selectOrganizations);

  const prevSurveyCreateLoadingValue = usePrevious(isSurveyCreating);
  const prevSurveyUpdateLoadingValue = usePrevious(isSurveyUpdating);

  const handleModalClose = () => {

    if (!isSurveyCreating) {
      setSurveyTitle("");
      setSurveyDescription("");
      setSurveyOrganization(null);
      setIsUserAbleToGoBackDuringSurvey(false);
      setMinPercentToPass("50");

      onClose()
    }
  };

  const handleSubmit = async () => {

    const surveyRequestData = {
      title: surveyTitle,
      description: surveyDescription,
      is_can_return: isUserAbleToGoBackDuringSurvey,
      min_percent_pass: minPercentToPass,
      organization: !isEdit && surveyOrganization && {
        id: surveyOrganization.value.id,
        type: surveyOrganization.value.type,
      }
    };

    const validationSchema = isEdit ? editSurveyValidation : createSurveyValidation;

    const isValid = await validationSchema
                          .validate(surveyRequestData)
                          .catch((err) => { toast.error(err.message) });

    if (!isValid) return;

    if (isEdit) {
      surveyRequestData.interaction_id = surveyData.latest_version.interaction_id;

      dispatch(updateSurveyMainDataRequest({surveyId: surveyData.latest_version.id, data: surveyRequestData}));
    } else {
      dispatch(createSurveyRequest(surveyRequestData));
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

  const handleMinPercentToPassChange = (e) => {
    if(/[^0-9]/g.test(e.target.value)) return;

    let value = e.target.value.toString();

    // Value in range 0-99
    if (value[0] === "0" && value.length > 1) {
      value = value.substring(1)
    } else if (value.length > 2) {
      value = "100"
    } else if (value.length === 0) {
      value = "0"
    }

    setMinPercentToPass(value);
  };

  // Close modal after user hit submit and request ends with no error
  useEffect(() => {
    if (!error && prevSurveyCreateLoadingValue === true && !isSurveyCreating) {
      handleModalClose()
    }
  }, [isSurveyCreating]);

  useEffect(() => {
    if (!error && prevSurveyUpdateLoadingValue === true && !isSurveyUpdating) {
      handleModalClose()
    }
  }, [isSurveyUpdating]);

  useEffect(() => {
    if (isEdit && isOpen) {
      const {title, description, is_can_return, min_percent_pass} = surveyData.latest_version;
      setSurveyTitle(title);
      setSurveyDescription(description);
      setIsUserAbleToGoBackDuringSurvey(is_can_return);
      setMinPercentToPass(min_percent_pass);
    }
  }, [isEdit, isOpen]);

  return (
    <SurveyModal
      className="survey-create-modal"
      title={isEdit ? "Edit Survey" : "Create Survey"}
      isOpen={isOpen}
      onClose={handleModalClose}
      submitBtnText={isEdit ? "Save" : "Create"}
      onSubmit={handleSubmit}
      isSubmitProceed={isSurveyCreating || isSurveyUpdating}
    >
      <Input
        label={"Survey title"}
        name={"Survey title"}
        value={surveyTitle}
        onChange={(e) => setSurveyTitle(e.target.value)}
      />
      <TextArea
        className="survey-create-modal-guidance"
        height={6}
        label={"Guidance"}
        name={"Survey description"}
        value={surveyDescription}
        onChange={(e) => setSurveyDescription(e.target.value)}
      />
      <div className="survey-create-modal-min_percent">
        <label
          className="survey-input-component_label"
          htmlFor={"Survey description"}
        >
          Minimum % to pass
        </label>
        <Input
          className="survey-create-modal-min_percent-input"
          name={"Survey description"}
          value={minPercentToPass}
          onChange={handleMinPercentToPassChange}
        />
        <span>%</span>
      </div>
      <Checkbox
        className={"survey-create-modal-checkbox"}
        onChange={(e) => setIsUserAbleToGoBackDuringSurvey(e.target.checked)}
        name="Is user able to go back during survey"
        checked={isUserAbleToGoBackDuringSurvey}
        label="User can go back during survey"
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
