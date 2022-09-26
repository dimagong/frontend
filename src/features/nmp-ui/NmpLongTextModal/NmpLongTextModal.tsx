import React from "react";

import { NpmModal, NpmEditor, NpmButton } from "features/nmp-ui";

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
    <NpmModal
      visible={isModalOpen}
      title="Extended input"
      onCancel={onCancel}
      footer={
        <NpmButton type="nmp-primary" onClick={onCancel}>
          Close
        </NpmButton>
      }
    >
      <div className="pb-2">
        <NpmEditor
          data={value}
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
    </NpmModal>
  );
};
