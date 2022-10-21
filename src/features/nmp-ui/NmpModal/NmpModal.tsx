import "./styles.scss";

import React from "react";
import { Modal } from "antd";
import type { FC } from "react";
import classnames from "classnames";
import type { ModalProps } from "antd";
import type { ModalFunc } from "antd/lib/modal/confirm";

import { NmpButton } from "../NmpButton";
import type { NmpButtonProps } from "../NmpButton";

type ModalOpenProps = Omit<Parameters<ModalFunc>[0], "okButtonProps" | "cancelButtonProps" | "cancelText"> & {
  footer?: ModalProps["footer"];
  okButtonProps?: NmpButtonProps;
};

type ModalOpenFunc = (props: ModalOpenProps) => ReturnType<ModalFunc>;

type Props = ModalProps;

type _FC = FC<Props> & {
  open: ModalOpenFunc;
  info: typeof Modal.info;
  success: typeof Modal.success;
  error: typeof Modal.error;
  warning: typeof Modal.warning;
  confirm: typeof Modal.confirm;

  useModal: typeof Modal.useModal;
  destroyAll: typeof Modal.destroyAll;
  config: typeof Modal.config;
};

export const NmpModal: _FC = ({ className, ...props }) => {
  return <Modal zIndex={1000} {...props} className={classnames("nmp-modal", className)} />;
};

NmpModal.open = (props) => {
  const { content, footer, wrapClassName, okButtonProps, okText, ...rest } = props;

  const defaultConfig = {
    wrapClassName: classnames("nmp-modal", wrapClassName),
  };

  const defaultFooter = (
    <NmpButton type="nmp-primary" onClick={() => modal.destroy()} {...okButtonProps}>
      {okText ?? "Close"}
    </NmpButton>
  );

  const modal = Modal.info({
    ...rest,
    ...defaultConfig,
    content: (
      <>
        <div className="nmp-modal__content">{content}</div>
        <div className="nmp-modal__footer">{footer ?? defaultFooter}</div>
      </>
    ),
  });

  return modal;
};

NmpModal.info = Modal.info;
NmpModal.success = Modal.success;
NmpModal.error = Modal.error;
NmpModal.warning = Modal.warning;
NmpModal.confirm = Modal.confirm;

NmpModal.useModal = Modal.useModal;
NmpModal.destroyAll = Modal.destroyAll;
NmpModal.config = Modal.config;
