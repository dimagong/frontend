import React, {useEffect, useState} from 'react';
import { useSelector, useDispatch } from "react-redux";
import { createLoadingSelector } from "app/selectors/loadingSelector";
import { selectError } from "app/selectors";
import * as yup from "yup";
import { toast } from "react-toastify";
import {usePrevious} from "hooks/common";

import SurveyModal from "features/Surveys/Components/SurveyModal";
import { Input } from "features/Surveys/Components/SurveyFormComponents";

import appSlice from "app/slices/appSlice";

const {
  createFolderRequest,
} = appSlice.actions;

const createFolderValidationSchema = yup.string().trim().required("Please, provide folder name");

const FolderCreateModal = ({title, isOpen, onClose }) => {

  const dispatch = useDispatch();

  const [folderName, setFolderName] = useState("");

  const isLoading = useSelector(createLoadingSelector([createFolderRequest.type], true));
  const error = useSelector(selectError);

  const prevLoadingValue = usePrevious(isLoading);

  const handleModalClose = () => {
    if (!isLoading) {
      setFolderName("");
      onClose();
    }
  };

  const handleSubmit = async () => {
    const isValid = await createFolderValidationSchema
                          .validate(folderName)
                          .catch((err) => { toast.error(err.message) });

    if (!isValid) return;

    dispatch(createFolderRequest({name: folderName}))
  };

  useEffect(() => {
    if (!error && prevLoadingValue === true && !isLoading) {
      handleModalClose()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);


  return (
    <SurveyModal
      title={title}
      isOpen={isOpen}
      onClose={handleModalClose}
      submitBtnText={"Submit"}
      onSubmit={handleSubmit}
      isSubmitProceed={isLoading}
    >
      <Input
        label={"Folder name"}
        name={"Folder name"}
        value={folderName}
        onChange={(e) => setFolderName(e.target.value)}
      />
    </SurveyModal>
  )
};

export default FolderCreateModal;
