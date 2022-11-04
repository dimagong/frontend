import React from "react";

import { NmpUploadItem, NmpUploadItemProps, FileStatusTypes } from "./NmpUploadItem";

const storySettings = {
  title: "Nmp/UploadItem",
  component: NmpUploadItem,
};

export default storySettings;

const defaultFilename = "Filename.test";

const Template = ({ filename = defaultFilename, ...props }: NmpUploadItemProps) => (
  <NmpUploadItem filename={filename} {...props} />
);

export const Uploading = Template.bind({});

Uploading.args = {
  status: FileStatusTypes.Uploading,
};

export const Done = Template.bind({});

Done.args = {
  status: FileStatusTypes.Done,
};

export const Removable = Template.bind({});

Removable.args = {
  isRemovable: true,
  status: FileStatusTypes.Done,
};
