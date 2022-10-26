import React from "react";

import { NmpUpload } from "./NmpUpload";
import { NmpUploadItem, FileStatusTypes } from "./../NmpUploadItem";

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
            isRemovable={true}
            onRemove={remove}
            onDownload={download}
            percent={100}
            status={FileStatusTypes.Done}
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
  itemRender: (_, file, fileList, { download, remove }, isRemovable) => (
    <NmpUploadItem
      filename={"the file is still uploading"}
      isRemovable={isRemovable}
      onRemove={() => {}}
      onDownload={() => {}}
      status={FileStatusTypes.Uploading}
      percent={99}
    />
  ),
};

export const NmpUploadFinished = TemplateNmpUpload.bind({});

NmpUploadFinished.args = {
  isRemovable: true,
  itemRender: (_, file, fileList, { download, remove }) => (
    <NmpUploadItem
      filename={"the file uploaded successfully"}
      isRemovable={true}
      onRemove={() => {}}
      onDownload={() => {}}
      percent={100}
      status={FileStatusTypes.Done}
    />
  ),
};
