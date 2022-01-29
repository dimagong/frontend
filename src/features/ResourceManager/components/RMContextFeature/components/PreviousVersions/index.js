import React, {useState, useEffect} from 'react';
import {useSelector} from "react-redux";
import {createLoadingSelector} from "app/selectors/loadingSelector";
import {Scrollbars} from "react-custom-scrollbars";
import AddButton from "components/AddButton";
import SurveyModal from "../../../../../Surveys/Components/SurveyModal";
import FileInput from "../../../../../../components/formElements/FileInput";
import {toast} from "react-toastify";
import {usePrevious} from "hooks/common";
import { selectError } from "app/selectors";
import moment from "moment";
import appSlice from "app/slices/appSlice";
import { useToggleable } from "hooks/use-toggleable";
import EditIcon from 'assets/img/icons/edit.png';
import DownloadIcon from 'assets/img/icons/cloud-download.png';
import DeleteIcon from "assets/img/icons/x.png";

import './styles.scss';

const {
  uploadResourceRequest,
} = appSlice.actions;

const HEADERS = ["Action", "Version", "Users", "Date", "Author"];

const PreviousVersions = ({
  previousVersions,
  onResourceUpload,
  onTemplateDownload,
  onTemplateRemove,
}) => {
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const error = useSelector(selectError);
  const isUploadInProgress = useSelector(createLoadingSelector([uploadResourceRequest.type], true));
  const isUploadInProgressPrevValue = usePrevious(isUploadInProgress);

  const expandedItems = useToggleable([]);

  const handleResourceUpload = () => {
    if (selectedFile) {
      onResourceUpload(selectedFile)
    } else {
      toast.warn("Please select file to upload")
    }
  };

  const handleListItemExpand = (itemId) => {
    expandedItems.setKeys([itemId])
  };

  useEffect(() => {
    if (!error && isUploadInProgressPrevValue === true && !isUploadInProgress) {
      setIsAddModalVisible(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUploadInProgress]);

  return (
    <div>
      <div className="d-flex align-items-center">
        <div className="title">
          Parent File Version
        </div>

      </div>
      <div>


        <div className="list-header">
          {HEADERS.map((header) => (
            <div>
              {header}
            </div>
          ))}
        </div>

        <Scrollbars  autoHeight autoHeightMax={350}>
          {!previousVersions?.length ? (
            <div className="d-flex justify-content-center pt-5 text-black-50 font-large-1 pb-5">
              No versions found
            </div>
          ) : (
            <div className="items-list">
              {previousVersions.map((item, index) => (
                <div className={"expandable_item_container"} onClick={() => handleListItemExpand(item.id)}>
                  <div
                    className={`list_item selected`}
                    key={` ${index}`}
                  >
                    <div className="list_item_name">
                      {item.status}
                    </div>
                    <div className="list_item_description">
                      {"v"+moment(item.created_at).format('YYYY.DD.MM')}
                    </div>
                    <div className="list_item_description">
                      0
                    </div>
                    <div className="list_item_description">
                      {moment(item.updated_at).format('DD/MM/YYYY')}
                    </div>
                    <div className="list_item_description">
                      {item.provided.first_name}
                    </div>
                  </div>
                  <div className={`list_actions d-flex justify-content-end ${expandedItems.includes(item.id) ? "expanded" : ""}`}>
                    <img onClick={() => onTemplateDownload(item.id, item.name)} className="mr-1" src={DownloadIcon} alt="Download"/>
                    <img className="mr-1" src={EditIcon} alt="Edit"/>
                    {index === 0 && (
                      <img onClick={() => onTemplateRemove(item.id)} className="mr-1" src={DeleteIcon} alt="Delete"/>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Scrollbars>
        <div className="d-flex justify-content-end py-2">
          <AddButton onClick={() => {setIsAddModalVisible(true)}} />
        </div>
      </div>

      <SurveyModal
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
      </SurveyModal>
    </div>
  )
};

export default PreviousVersions;
