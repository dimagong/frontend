import React from "react";

import { NpmModal, NpmEditor } from "features/nmp-ui";

type Props = {
  value?: string;
  isModalOpen?: boolean;
  editorClassName?: string;
  onCancel?: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  onEditChange?: (v: any) => void;
};

const NpmLongText: React.FC<Props> = (props) => {
  const { value, isModalOpen = false, editorClassName = "", onCancel, onEditChange } = props;

  // ToDo: make ok cancel button by design
  return (
    <NpmModal visible={isModalOpen} title="Extended input" okText="Close" onCancel={onCancel} onOk={onCancel}>
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

export default NpmLongText;
