import "./styles.scss";

import PropTypes from "prop-types";
import { toast } from "react-toastify";
import React, { useState } from "react";
import { useMutation, useQueryClient } from "react-query";

import AddButton from "components/AddButton";
import CustomModal from "components/CustomModal";
import FileInput from "components/formElements/FileInput";

import { resourceManagerService } from "api/resourceManager";

import PreviousVersions from "./PreviousVersions";

const HEADERS = ["Action", "Version", "Users", "Date", "Author"];

const PreviousVersionsCF = ({ versions, field }) => {
  const queryClient = useQueryClient();

  const [selectedFile, setSelectedFile] = useState(null);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);

  const { latestVersion, previousVersions } = React.useMemo(() => {
    const previousVersions = [...versions];
    const latestVersion = previousVersions.shift();
    return { latestVersion, previousVersions };
  }, [versions]);

  const uploadResource = useMutation((newResource) => resourceManagerService.uploadResource(newResource), {
    onSettled: () => setIsAddModalVisible(false),
    onSuccess: () => queryClient.invalidateQueries(["resource-manager-field-versions", field.id]),
  });

  const onResourceUploadSubmit = (resource) => {
    if (selectedFile) {
      const formData = new FormData();

      formData.append("file", selectedFile);
      formData.append("field_id", field.id);

      uploadResource.mutate(formData);
    } else {
      toast.warn("Please select file to upload");
    }
  };

  return (
    <div>
      <div className="d-flex align-items-center">
        <div className="title">Parent File Version</div>
      </div>
      <div>
        <div className="list-header">
          {HEADERS.map((header) => (
            <div key={header}>{header}</div>
          ))}
        </div>

        <PreviousVersions field={field} latestVersion={latestVersion} previousVersions={previousVersions} />

        <div className="d-flex justify-content-end py-2">
          <AddButton
            onClick={() => {
              setIsAddModalVisible(true);
            }}
          />
        </div>
      </div>

      <CustomModal
        isSubmitProceed={uploadResource.isLoading}
        isOpen={isAddModalVisible}
        title="Upload file"
        submitBtnText="Submit"
        onClose={() => setIsAddModalVisible(false)}
        onSubmit={onResourceUploadSubmit}
      >
        <div className={"pb-2"}>
          <FileInput
            acceptTypes={["application/pdf", "application/msword"]}
            onChange={(file) => setSelectedFile(file)}
            value={selectedFile}
            loading={false}
          />
        </div>
      </CustomModal>
    </div>
  );
};

PreviousVersionsCF.propTypes = {
  field: PropTypes.object.isRequired,
  versions: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default PreviousVersionsCF;
