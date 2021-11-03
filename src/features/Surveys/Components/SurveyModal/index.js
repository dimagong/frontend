import React from "react";
import {
  Modal,
  ModalBody,
} from "reactstrap";
import LoadingButton from "components/LoadingButton";
import {X} from "react-feather";

import './styles.scss'

const SurveyModal = ({
  isOpen,
  onClose,
  title,
  children,
  submitBtnText,
  onSubmit,
  deleteBtnText,
  onDelete,
  isSubmitProceed,
  isDeleteProceed,
  className,
}) => {

  return (
    <Modal className={className} isOpen={isOpen} toggle={onClose}>
      <ModalBody className={"survey-modal"}>
        <div className="survey-modal_header">
          <div className="survey-modal_header_title">
            {title}
          </div>
          <div className={"survey-modal_header_cross"}>
            <X
              size={26}
              className={"survey-modal_header_cross-icon"}
              onClick={onClose}
            />
          </div>
        </div>
        <div className={"survey-modal_body"}>

          {children}

        </div>
        <div className={"survey-modal_actions"}>
          <div>
            {!!deleteBtnText && !!onDelete && (
              <LoadingButton
                onClick={onDelete}
                className={"survey-modal_actions_delete-btn px-4"}
                isLoading={isDeleteProceed}
                value={deleteBtnText}
              />
            )}
          </div>
          <div>
            <LoadingButton
              className={"px-4"}
              onClick={onSubmit}
              color="primary"
              isLoading={isSubmitProceed}
              value={submitBtnText}
            />
          </div>
        </div>
      </ModalBody>
    </Modal>
  )
};

export default SurveyModal;
