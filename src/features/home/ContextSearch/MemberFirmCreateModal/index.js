import React, { useState, useEffect } from 'react';
import * as yup from 'yup'
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { createLoadingSelector } from "app/selectors/loadingSelector";
import { selectChildOrganizations } from "app/selectors/groupSelector";
import { selectError } from "app/selectors";
import { usePrevious } from "hooks/common";
import { Input, Select } from "features/Surveys/Components/SurveyFormComponents";

import appSlice from "app/slices/appSlice";

import './styles.scss'
import CustomModal from "../../../../components/CustomModal";

const {
  createMemberFirmRequest,
} = appSlice.actions;

const editMemberFirmValidation = yup.object().shape({
  name: yup.string().trim().required("Title is required"),
});

const createMemberFirmValidation = yup.object().shape({
  name: yup.string().trim().required("Title is required"),
  network_id: yup.number().required("Select organisation for member firm"),
});

const MemberFirmCreateModal = ({isOpen, onClose, isEdit}) => {

  const dispatch = useDispatch();

  const [memberFirmTitle, setMemberFirmTitle] = useState("");

  const [memberFirmOrganization, setMemberFirmOrganization] = useState(null);

  const error = useSelector(selectError);
  const organizations = useSelector(selectChildOrganizations);

  const isMemberFirmCreationProceeding = useSelector(createLoadingSelector([createMemberFirmRequest.type], true));
  const prevMemberFirmCreationLoadingState = usePrevious(isMemberFirmCreationProceeding);

  const handleModalClose = () => {
    if (!isMemberFirmCreationProceeding) {
      setMemberFirmTitle("");
      setMemberFirmOrganization(null);

      onClose()
    }
  };

  const handleSubmit = async () => {

    const memberFirmData = {
      name: memberFirmTitle,
      network_id: memberFirmOrganization?.value?.id,
    };

    const validationSchema = isEdit ? editMemberFirmValidation : createMemberFirmValidation;

    const isValid = await validationSchema
      .validate(memberFirmData)
      .catch((err) => { toast.error(err.message) });

    if (!isValid) return;

    if (isEdit) {

      console.error("Handle member firm edit");

      handleModalClose();
    } else {
      // Modal will be closed automatically in case of successful creation
      dispatch(createMemberFirmRequest(memberFirmData));
    }
  };

  const handleOrganizationSelect = (option) => {
    setMemberFirmOrganization(option)
  };

  const formatOrganizations = (organizations) => (
    organizations.map((organization) => ({
      value: organization,
      label: organization.name,
    }))
  );

  // Close modal after user hit submit and request ends with no error
  useEffect(() => {
    if (!error && prevMemberFirmCreationLoadingState === true && !isMemberFirmCreationProceeding) {
      handleModalClose()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMemberFirmCreationProceeding]);

  // useEffect(() => {
  //   if (isEdit && isOpen) {
  //     setMemberFirmTitle(memberFirmData.latest_version.title);
  //   }
  // }, [isEdit, isOpen]);

  return (
    <CustomModal
      className="survey-create-modal"
      title={isEdit ? "Edit member firm" : "New member firm"}
      isOpen={isOpen}
      onClose={handleModalClose}
      submitBtnText={isEdit ? "Save" : "Create"}
      onSubmit={handleSubmit}
      isSubmitProceed={isMemberFirmCreationProceeding}
    >
      <Input
        label={"Enter new name"}
        name={"Member firm title"}
        value={memberFirmTitle}
        onChange={(e) => setMemberFirmTitle(e.target.value)}
      />
      {!isEdit && (
        <div className="survey-create-modal_select">
          <label htmlFor="organization">
            Organisation
          </label>
          <Select
            onChange={handleOrganizationSelect}
            value={memberFirmOrganization}
            options={formatOrganizations(organizations)}
          />
        </div>
      )}

    </CustomModal>
  )
};

export default MemberFirmCreateModal;
