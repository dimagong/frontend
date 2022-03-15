import "./styles.scss";

import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import React, { useState, useEffect } from "react";

import { usePrevious } from "hooks/common";

import AddButton from "components/AddButton";
import CustomModal from "components/CustomModal";
import FileInput from "components/formElements/FileInput";

import appSlice from "app/slices/appSlice";
import { selectError } from "app/selectors";
import { createLoadingSelector } from "app/selectors/loadingSelector";

import PreviousVersions from "./PreviousVersions";

const { uploadResourceRequest } = appSlice.actions;

const HEADERS = ["Action", "Version", "Users", "Date", "Author"];

const PreviousVersionsCF = ({ versions, selectableNodes, onResourceUpload, onTemplateDownload }) => {
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const error = useSelector(selectError);
  const isUploadInProgress = useSelector(createLoadingSelector([uploadResourceRequest.type], true));
  const isUploadInProgressPrevValue = usePrevious(isUploadInProgress);

  const { latestVersion, previousVersions } = React.useMemo(() => {
    const previousVersions = [...versions];
    const latestVersion = previousVersions.shift();
    return { latestVersion, previousVersions };
  }, [versions]);

  const handleResourceUpload = () => {
    if (selectedFile) {
      onResourceUpload(selectedFile);
    } else {
      toast.warn("Please select file to upload");
    }
  };

  useEffect(() => {
    if (!error && isUploadInProgressPrevValue === true && !isUploadInProgress) {
      setIsAddModalVisible(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUploadInProgress]);

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

        <PreviousVersions
          latestVersion={latestVersion}
          previousVersions={previousVersions}
          selectableNodes={selectableNodes}
        />

        <div className="d-flex justify-content-end py-2">
          <AddButton
            onClick={() => {
              setIsAddModalVisible(true);
            }}
          />
        </div>
      </div>

      <CustomModal
        isSubmitProceed={isUploadInProgress}
        isOpen={isAddModalVisible}
        title="Upload file"
        submitBtnText="Submit"
        onClose={() => setIsAddModalVisible(false)}
        onSubmit={handleResourceUpload}
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

export default PreviousVersionsCF;
