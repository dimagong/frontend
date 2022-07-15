import React from "react";
import { Modal, ModalBody } from "reactstrap";
import LoadingButton from "components/LoadingButton";
import { X } from "react-feather";

import "./styles.scss";
import PropTypes from "prop-types";

const CustomModal = ({
  isOpen,
  onClose,
  title,
  footerDisabled,
  children,
  submitBtnText,
  onSubmit,
  isSubmitProceed,
  deleteBtnText,
  onDelete,
  isDeleteProceed,
  CustomButton = LoadingButton,
  hiddenSubmitButton = false,
  ...attrs
}) => {
  return (
    <Modal {...attrs} isOpen={isOpen} toggle={onClose}>
      <ModalBody className={"custom-modal"}>
        <div className="custom-modal_header">
          <div className="custom-modal_header_title">{title}</div>
          <div className={"custom-modal_header_cross"}>
            <X size={26} className={"custom-modal_header_cross-icon"} onClick={onClose} />
          </div>
        </div>
        <div className={"custom-modal_body"}>{children}</div>
        {!footerDisabled && (
          <div className={"custom-modal_actions"}>
            <div>
              {!!deleteBtnText && !!onDelete && (
                <CustomButton
                  onClick={onDelete}
                  className={"custom-modal_actions_delete-btn px-4"}
                  isLoading={isDeleteProceed}
                  value={deleteBtnText}
                />
              )}
            </div>
            <div>
              {hiddenSubmitButton ? null : (
                <CustomButton
                  className={"px-4"}
                  onClick={onSubmit}
                  color="primary"
                  isLoading={isSubmitProceed}
                  value={submitBtnText}
                />
              )}
            </div>
          </div>
        )}
      </ModalBody>
    </Modal>
  );
};

CustomModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string,
  footerDisabled: PropTypes.bool,

  submitBtnText: PropTypes.string,
  onSubmit: PropTypes.func,
  isSubmitProceed: PropTypes.bool,

  deleteBtnText: PropTypes.string,
  onDelete: PropTypes.func,
  isDeleteProceed: PropTypes.bool,
};

export default CustomModal;
