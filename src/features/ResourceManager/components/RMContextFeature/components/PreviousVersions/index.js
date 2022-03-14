import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { createLoadingSelector } from "app/selectors/loadingSelector";
import { Scrollbars } from "react-custom-scrollbars";
import AddButton from "components/AddButton";
import FileInput from "../../../../../../components/formElements/FileInput";
import { toast } from "react-toastify";
import { usePrevious } from "hooks/common";
import { selectError } from "app/selectors";
import moment from "moment";
import appSlice from "app/slices/appSlice";
import { useToggleable } from "hooks/use-toggleable";
import EditIcon from "assets/img/icons/edit.png";
import DownloadIcon from "assets/img/icons/cloud-download.png";
import DeleteIcon from "assets/img/icons/x.png";

import "./styles.scss";
import CustomModal from "../../../../../../components/CustomModal";
import resourceManagerApi from "../../../../../../api/resourceManager";
import NmpButton from "components/nmp/NmpButton";

const { uploadResourceRequest } = appSlice.actions;

const HEADERS = ["Action", "Version", "Users", "Date", "Author"];

const PreviousVersions = ({ previousVersions, onResourceUpload, onTemplateDownload, onTemplateRemove }) => {
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileEditLoading, setFileEditLoading] = useState(false);

  const error = useSelector(selectError);
  const isUploadInProgress = useSelector(createLoadingSelector([uploadResourceRequest.type], true));
  const isUploadInProgressPrevValue = usePrevious(isUploadInProgress);
  const [allVersions, setAllVersions] = useState([]);

  const expandedItems = useToggleable([]);
  const editingItems = useToggleable([]);

  const handleResourceUpload = () => {
    if (selectedFile) {
      onResourceUpload(selectedFile);
    } else {
      toast.warn("Please select file to upload");
    }
  };

  const handleListItemExpand = (itemId) => {
    expandedItems.setKeys([itemId]);
  };

  const onEditField = (fieldId) => {
    editingItems.setKeys([...editingItems.keys, fieldId]);
    setFileEditLoading(true);
    resourceManagerApi
      .postFieldEdit({ fieldId: fieldId })
      .then((response) => {
        if (response.status === "forbidden") {
          window.open(response.message, "_blank");
        } else {
          window.open(response.google_drive_doc.file.webViewLink, "_blank");
        }
      })
      .catch((error) => toast.error(error))
      .finally(() => setFileEditLoading(false));
  };

  const openResourceFileEditLink = (fieldId) => {
    resourceManagerApi
      .postEndFieldEdit({ fieldId: fieldId })
      .then((response) => {
        setAllVersions([response, ...allVersions]);
        toast.success("File was successfully edited");
      })
      .catch((error) => toast.error(error))
      .finally(() => setFileEditLoading(false));
  };

  const onFinishEditField = (fieldId) => {
    editingItems.setKeys([...editingItems.keys.filter((item) => item !== fieldId)]);
    setFileEditLoading(true);
    openResourceFileEditLink(fieldId);
  };

  useEffect(() => {
    setAllVersions(previousVersions);
  }, [previousVersions]);

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
            <div>{header}</div>
          ))}
        </div>

        <Scrollbars autoHeight autoHeightMax={350}>
          {!allVersions?.length ? (
            <div className="d-flex justify-content-center pt-5 text-black-50 font-large-1 pb-5">No versions found</div>
          ) : (
            <div className="items-list">
              {allVersions.map((version, index) => (
                <div className={"expandable_item_container"} onClick={() => handleListItemExpand(version.id)}>
                  <div className={`list_item selected`} key={` ${index}`}>
                    <div className="list_item_name">{version.status}</div>
                    <div className="list_item_description">{"v" + moment(version.created_at).format("YYYY.DD.MM")}</div>
                    <div className="list_item_description">0</div>
                    <div className="list_item_description">{moment(version.updated_at).format("DD/MM/YYYY")}</div>
                    <div className="list_item_description">{version.provided.first_name}</div>
                  </div>
                  {editingItems.includes(version.id) ? (
                    <div
                      className={`list_actions d-flex justify-content-end ${
                        expandedItems.includes(version.id) ? "expanded" : ""
                      }`}
                    >
                      <NmpButton
                        className={"expandable_item_container-finish-edit"}
                        onClick={() => onFinishEditField(version.id)}
                        variant="primary"
                        loading={fileEditLoading}
                      >
                        Finish editing
                      </NmpButton>
                    </div>
                  ) : (
                    <div
                      className={`list_actions d-flex justify-content-end ${
                        expandedItems.includes(version.id) ? "expanded" : ""
                      }`}
                    >
                      <img
                        onClick={() => onTemplateDownload(version.id, version.name)}
                        className="mr-1"
                        src={DownloadIcon}
                        alt="Download"
                      />
                      {index === 0 && (
                        <span>
                          <img onClick={() => onEditField(version.id)} className="mr-1" src={EditIcon} alt="Edit" />
                          <img
                            onClick={() => onTemplateRemove(version.id)}
                            className="mr-1"
                            src={DeleteIcon}
                            alt="Delete"
                          />
                        </span>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </Scrollbars>
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

export default PreviousVersions;
