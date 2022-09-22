import "./styles.scss";

import React from "react";

import { Modal } from "antd";
import NpmButton from "./../NpmButton";

interface IProps {
  isModalOpen?: boolean;
  handleCancel?: () => void;
  okText?: string;
  title?: string;
  showModal?: () => void;
  children?: any;
  btnNameModal?: string;
}

const NpmModal = (props: IProps): JSX.Element => {
  const { btnNameModal, handleCancel, okText, title, isModalOpen, showModal }: IProps = props;

  return (
    <>
      <NpmButton onClick={showModal}>{btnNameModal}</NpmButton>
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
