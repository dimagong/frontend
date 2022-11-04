import { v4 } from "uuid";
import React from "react";

import { NmpUpload } from "./NmpUpload";

const storySettings = {
  title: "Nmp/Upload",
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
  },
};

export default storySettings;

const TemplateNmpUpload = (props: any) => <NmpUpload {...props} />;

export const Base = TemplateNmpUpload.bind({});

Base.args = {
  fileList: Array(3)
    .fill(null)
    .map((_, index) => ({ uid: v4(), name: `Filename${index}.test` })),
};
