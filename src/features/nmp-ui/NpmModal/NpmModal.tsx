import React from "react";
import classnames from "classnames";
import { Modal, ModalProps } from "antd";

type Props = ModalProps;

const NpmModal: React.FC<Props> = ({ className, ...props }) => {
  return <Modal zIndex={1000} {...props} className={classnames("nmp-modal", className)} />;
};

export default NpmModal;
