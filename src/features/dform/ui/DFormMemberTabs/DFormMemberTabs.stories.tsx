import React from "react";

import { DFormMemberTabs } from "./DFormMemberTabs";
import { DformSectionId } from "../../data/models";

export default {
  title: "DForm/MemberTabs",
  component: DFormMemberTabs,
};

const items = [
  {
    key: "0",
    label: "Finished + viewed",
    progress: 100,
    isViewed: true,
  },
  {
    key: "1",
    label: "Finished + viewed",
    progress: 100,
    isViewed: true,
  },
  {
    key: "2",
    label: "Progress(70) + viewed",
    progress: 70,
    isViewed: true,
  },
  {
    key: "3",
    label: "Progress(70) + viewed Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequatur, illum!",
    progress: 70,
    isViewed: true,
  },
  {
    key: "4",
    label:
      "Progress(0) + not viewed Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci animi cupiditate dicta eaque eius fugiat maxime numquam quod repudiandae voluptate.",
    progress: 0,
    isViewed: false,
  },
  {
    key: "5",
    label: "Progress(0) + not viewed",
    progress: 0,
    isViewed: false,
  },
  {
    key: "6",
    label: "Progress(0) + not viewed",
    progress: 0,
    isViewed: false,
  },
  {
    key: "7",
    label: "Progress(0) + not viewed",
    progress: 0,
    isViewed: false,
  },
  {
    key: "8",
    label: "Progress(0) + not viewed",
    progress: 0,
    isViewed: false,
  },
  {
    key: "9",
    label: "Progress(0) + not viewed",
    progress: 0,
    isViewed: false,
  },
];

const Template = (props) => {
  return (
    <DFormMemberTabs
      items={items.map((item) => ({
        ...item,
        children: (
          <div>
            <h3>Content from tab labeled as "{item.label}"</h3>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium amet autem consequatur deserunt
              dolorum eaque, eligendi eos, esse eum impedit iusto labore laborum minus molestias necessitatibus nihil
              provident quidem reiciendis similique sunt ullam ut vero. Animi cupiditate dolorum eos eum facere magnam
              nesciunt non officia perspiciatis? Accusantium adipisci architecto, aspernatur eaque fugit in labore
              laborum nesciunt numquam officiis quas quibusdam, ratione reprehenderit, repudiandae rerum? Accusamus
              amet, animi, assumenda, at autem cupiditate dolor eaque enim eveniet excepturi expedita hic illum in
              inventore labore laborum maxime mollitia natus neque nisi nostrum odit pariatur quae quo ratione rerum
              sapiente sequi suscipit tempora totam!
            </p>
          </div>
        ),
      }))}
      activeKey={props.activeKey}
      defaultActiveKey={props.defaultActiveKey}
      onTabClick={props.onTabClick}
    />
  );
};

export const Base = Template.bind({});
Base.args = {
  activeKey: undefined,
  defaultActiveKey: "3",
};
