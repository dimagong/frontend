import React from "react";
import { RightOutlined, LeftOutlined, DownOutlined } from "@ant-design/icons";

import { NmpUpload } from "./NmpUpload";
import { NmpUploadItem, FileStatusTypes } from "./../NmpUploadItem";

import fileloading from "features/members/ui/icons/FileLoading.svg";
import { CloseCircleFilled } from "@ant-design/icons";

const image = {
  src: fileloading,
  alt: "file-onloading",
};
const icons = {
  [FileStatusTypes.Idle]: <CloseCircleFilled style={{ fontSize: 21 }} />,
  [FileStatusTypes.Uploading]: <img src={image.src} alt={image.alt} />,
};

const storySettings = {
  title: "NmpUpload",
  component: NmpUpload,
  argTypes: {
    isRemovable: {
      name: "isRemovable",
      type: { name: "boolean", required: false },
      defaultValue: false,
    },
    isDisabled: {
      name: "isDisabled",
      type: { name: "boolean", required: false },
      defaultValue: false,
    },
    isMultiple: {
      name: "isMultiple",
      type: { name: "boolean", required: false },
      defaultValue: false,
    },
    itemRender: {
      name: "itemRender",
      type: { name: "function", required: false },
      defaultValue: (_, file, fileList, { download, remove }) => {
        return (
          <NmpUploadItem
            filename={file.name}
            isRemovable={false}
            onRemove={remove}
            onDownload={download}
            status={FileStatusTypes.Idle}
            icons={icons}
          />
        );
      },
    },
  },
};

export default storySettings;

const TemplateNmpUpload = (props: any) => <NmpUpload {...props} />;

export const Types = TemplateNmpUpload.bind({});

export const NmpUploadProcess = TemplateNmpUpload.bind({});

NmpUploadProcess.args = {
  isRemovable: false,
  itemRender: () => (
    <NmpUploadItem
      filename={"file"}
      isRemovable={false}
      onRemove={() => {}}
      onDownload={() => {}}
      progressloading={10}
    />
  ),
};

// export const Ellipse = Template.bind({});

// Ellipse.args = {
//   type: "nmp-primary",
//   shape: "nmp-ellipse",
//   icon: <DownOutlined />,
//   children: undefined,
// };
