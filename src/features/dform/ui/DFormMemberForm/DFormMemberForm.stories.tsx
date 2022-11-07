import React, { useEffect } from "react";
import { QueryClientProvider, QueryClient } from "react-query";

import { DFormMemberForm } from "./DFormMemberForm";
import { DFormBlockSizeTypes, DFormBlockTypes, DFormFieldTypes } from "../../types";

export default {
  title: "DForm/MemberForm",
  component: DFormMemberForm,
};

const Template = (props) => {
  useEffect(() => {
    const body = document.querySelector("body");
    if (body) {
      body.style.backgroundColor = "#f4f4f4";
    }
  }, []);

  return (
    <QueryClientProvider client={new QueryClient()}>
      <DFormMemberForm {...props} />
    </QueryClientProvider>
  );
};

const blockTemplate = [
  {
    id: "0",
    helpText: "<h2>Help text block</h2>",
    blockType: DFormBlockTypes.HelpText,
    blockSize: DFormBlockSizeTypes.Full,
  },
  {
    id: "1",
    label: "Text field",
    blockType: DFormBlockTypes.Field,
    fieldType: DFormFieldTypes.Text,
    blockSize: DFormBlockSizeTypes.Half,
    isRequired: true,
    isDisabled: false,
    isLabelShowing: true,
    masterSchemaFieldId: 1,
  },
  {
    id: "2",
    label: "File field",
    blockType: DFormBlockTypes.Field,
    fieldType: DFormFieldTypes.File,
    blockSize: DFormBlockSizeTypes.Half,
    isRequired: true,
    isDisabled: false,
    isLabelShowing: true,
    masterSchemaFieldId: 2,
  },
];

const defaultArgs = {
  sections: Array(2)
    .fill(null)
    .map((_, index) => ({
      id: `-s${index}`,
      name: `Section ${index}`,
      relatedGroups: [`-g${index * 3 + 1}`, `-g${index * 3 + 2}`, `-g${index * 3 + 3}`],
    })),

  groups: Array(6)
    .fill(null)
    .map((_, index) => ({
      id: `-g${index + 1}`,
      name: `Group ${index + 1}`,
      relatedBlocks: [`-b${index * 3 + 1}`, `-b${index * 3 + 2}`, `-b${index * 3 + 3}`],
    })),

  blocks: Array(18)
    .fill(null)
    .map((_, index) => {
      const template = blockTemplate[index % 3];
      return {
        ...template,
        id: `-b${index + 1}`,
        ...(template.masterSchemaFieldId ? { masterSchemaFieldId: Number(index + 1) } : {}),
      };
    }),
};

export const Base = Template.bind({});
Base.args = {
  ...defaultArgs,
  dformId: 0,
  dformName: "Succession Feasibility",
};
