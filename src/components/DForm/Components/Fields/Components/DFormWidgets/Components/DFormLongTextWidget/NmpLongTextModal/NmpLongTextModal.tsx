import React from "react";

import { NmpModal, NmpWysiwygEditor, NmpButton } from "features/nmp-ui";

type Props = {
  value?: string;
  isModalOpen?: boolean;
  editorClassName?: string;
  onCancel?: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  onEditChange?: (v: any) => void;
};

export const NmpLongTextModal: React.FC<Props> = (props) => {
  const { value, isModalOpen = false, editorClassName, onCancel, onEditChange } = props;

  return (
    <NmpModal
      open={isModalOpen}
      title="Extended input"
      onCancel={onCancel}
      footer={
        <NmpButton type="nmp-primary" onClick={onCancel}>
          Close
        </NmpButton>
      }
    >
      <div className="pb-2">
        <NmpWysiwygEditor
          value={value}
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
          wrapperClassName={editorClassName}
        />
      </div>
    </NmpModal>
  );
};
