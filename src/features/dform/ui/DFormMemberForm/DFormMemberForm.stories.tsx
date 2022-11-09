import React, { useEffect } from "react";
import { QueryClientProvider, QueryClient } from "react-query";

import { DformAccessTypes } from "../../types";
import { DFormMemberForm } from "./DFormMemberForm";
import { mockBlocks, mockGroups, mockSections } from "../../data/models/mockSchema";

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
      <DFormMemberForm
        blocks={props.blocks}
        groups={props.groups}
        dformId={props.dformId}
        sections={props.sections}
        dformName={props.dformName}
        accessType={props.accessType}
        relatedSectionsIds={props.sections.map(({ id }) => id)}
      />
    </QueryClientProvider>
  );
};

export const Base = Template.bind({});
Base.args = {
  blocks: mockBlocks,
  groups: mockGroups,
  dformId: 0,
  sections: mockSections,
  dformName: "Succession Feasibility",
  accessType: DformAccessTypes.UserUnlock,
};
