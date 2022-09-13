import "./styles.scss";

import React from "react";

import { Button, Modal } from "antd";
import NpmButton from "./../NpmButton";

// className={"long-text-modal-window"}
//         isOpen={isModalOpened}
//         onClose={handleModalClose}
//         submitBtnText={"Close"}
//         onSubmit={handleModalClose}
//         title={"Extended input"}

interface IProps {
  isModalOpen?: boolean;
  handleCancel?: () => void;
  okText?: string;
  title?: string;
  showModal?: () => void;
  children: any;
  btnNameModal?: string;
}

const NpmModal = (props: IProps): JSX.Element => {
  const { btnNameModal, isModalOpen, handleCancel, okText, title, showModal }: IProps = props;
  return (
    <>
      <NpmButton onClick={showModal}>Hello</NpmButton>
      <Modal
        title={title}
        visible={isModalOpen}
        okText={okText}
        onOk={handleCancel}
        onCancel={handleCancel}
        zIndex={1000}
      >
        {props.children}
      </Modal>
    </>
  );
};

export default NpmModal;
