import React from "react";

import { NpmMenu, NmpTag } from "features/nmp-ui";

import { OnboardingsTypes } from "../../onboarding/utils/collectApplicationsUser";

import { findStatusSurvey } from "../data/helpers/findStatusSurvey";

const getKey = (type, id) => `${type}-${id}`;

const parseKey = (key) => {
  const [type, id] = key.split("-");
  return { type, id };
};

export const MemberMenuView = ({ dforms, surveys, onboardings, activeOnboarding, onMenuChange }) => {
  const items = [
    {
      key: "applications",
      label: "Applications",
      children: dforms.map(({ id, name, status }) => ({
        className: "membercomponent-menu__submenu-item",
        label: (
          <span className="membercomponent-menu__submenu-item">
            <span className="membercomponent-menu__item-name">{name}</span>
            <NmpTag color="#22776D" className="membercomponent-menu__item-status">
              {status}
            </NmpTag>
          </span>
        ),
        key: getKey(OnboardingsTypes.DForm, id),
      })),
      className: "membercomponent-menu__item",
    },
    {
      key: "surveys",
      label: "Surveys",
      children: surveys.map(({ id, title, started_at, finished_at, graded_at }) => ({
        className: "membercomponent-menu__submenu-item",
        label: (
          <span className="membercomponent-menu__submenu-item">
            <span className="membercomponent-menu__item-name">{title}</span>
            <NmpTag color="#22776D" className="membercomponent-menu__item-status">
              {findStatusSurvey(started_at, finished_at, graded_at, false)}
            </NmpTag>
          </span>
        ),
        key: getKey(OnboardingsTypes.Survey, id),
      })),
      className: "membercomponent-menu__item",
    },
  ];

  const selectedKeys = [getKey(activeOnboarding.type, activeOnboarding.id)];

  const onSelect = ({ key }) => {
    const { type, id } = parseKey(key);
    const onboarding = onboardings.find((onboarding) => onboarding.id === Number(id) && onboarding.type === type);

    onMenuChange(onboarding);
  };

  return <NpmMenu mode="horizontal" items={items} selectedKeys={selectedKeys} onSelect={onSelect}></NpmMenu>;
};
