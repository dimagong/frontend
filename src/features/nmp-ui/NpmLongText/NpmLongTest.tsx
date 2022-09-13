import React from "react";

//import { DFormFieldLabel } from "";
//"../DFormFieldLabel";

import NpmModal from "./../NpmModal";

import NpmEditor from "./../NpmEditor";

interface IProps {
  isModalOpen: boolean;
  handleModalClose?: Function;
  showModal?: Function;
  okText?: string;
  title?: string;
  btnNameModal?: string;
  inputValue?: string;
  onEditChange?: Function;
  isLabelShowing?: boolean;
  label?: string;
  isError?: boolean;
  isRequired?: boolean;
  wrapperClassName?: string;
}

const NpmLongText = ({
  isModalOpen,
  handleModalClose = () => {},
  showModal = () => {},
  okText = "Close",
  title = "Extended input",
  btnNameModal = "Expand text area",
  inputValue,
  onEditChange = () => {},
  isLabelShowing,
  label,
  isError,
  isRequired,
  wrapperClassName = "",
}: IProps) => {
  return (
    <>
      <NpmModal
        showModal={() => showModal()}
        isModalOpen={isModalOpen}
        handleCancel={() => handleModalClose()}
        okText={okText}
        title={title}
        btnNameModal={btnNameModal}
      >
        <div className="pb-2">
          {/* {isLabelShowing ? (
            <DFormFieldLabel label={label} isError={isError} isRequired={isRequired} className="modal-label" />
          ) : null} */}

          <NpmEditor
            data={inputValue}
            toolbar={{
              options: ["inline", "list", "textAlign", "link"],
              inline: {
                inDropdown: false,
                options: ["bold", "italic", "underline"],
              },
              textAlign: {
                inDropdown: false,
                options: ["indent", "outdent"],
              },
            }}
            onChange={onEditChange}
            // wrapperClassName="dform-long-text-widget__editor"
            wrapperClassName={wrapperClassName}
          />
        </div>
      </NpmModal>
    </>
  );
};

export default NpmLongText;
