import { toast } from "react-toastify";
import React, { useEffect, useState } from "react";

import { IdType } from "utility/prop-types";
import { useBoolean } from "hooks/use-boolean";

import AddButton from "components/AddButton";
import CustomModal from "components/CustomModal";
import FileInput from "components/formElements/FileInput";

import { useUploadRMFile } from "api/resourceManager/useRMFieldFiles";

const UploadRMFileModal = ({ fieldId }) => {
  const [file, setFile] = useState(null);
  const [isModalOpen, openModal, closeModal] = useBoolean(false);

  const uploadResource = useUploadRMFile({ fieldId }, { onSettled: () => closeModal() });

  const onResourceUploadSubmit = (resource) => {
    if (file) {
      const formData = new FormData();

      formData.append("file", file);
      formData.append("field_id", fieldId);

      uploadResource.mutate(formData);
    } else {
      toast.warn("Please select file to upload");
    }
  };

  useEffect(() => setFile(null), [isModalOpen]);

  return (
    <>
      <div className="d-flex justify-content-end py-2">
        <AddButton onClick={openModal} />
      </div>

      <CustomModal
        isSubmitProceed={uploadResource.isLoading}
        isOpen={isModalOpen}
        title="Upload file"
        submitBtnText="Submit"
        onClose={closeModal}
        onSubmit={onResourceUploadSubmit}
      >
        <div className="pb-2">
          <FileInput
            onChange={setFile}
            value={file}
            loading={false}
            accept=".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,.pdf"
          />
        </div>
      </CustomModal>
    </>
  );
};

UploadRMFileModal.propTypes = {
  fieldId: IdType.isRequired,
};

export default UploadRMFileModal;
