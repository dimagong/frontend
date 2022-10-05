import React from "react";

import { NpmMenu, NmpTag } from "features/nmp-ui";

import { OnboardingsTypes } from "../../onboarding/utils/collectApplicationsUser";

import { findStatusSurvey } from "../data/helpers/findStatusSurvey";

import { statusConstants } from "features/members/data/constants/statusConstants";

const getKey = (type, id) => `${type}-${id}`;

const parseKey = (key) => {
  const [type, id] = key.split("-");
  return { type, id };
};

const selectStatusColor = (status) => {
  let selectedColor = null;
  switch (status) {
    case statusConstants.IN_PROGRESS:
    case statusConstants.STARTED:
      selectedColor = "#5186C3";
      break;
    case statusConstants.REJECTED:
      selectedColor = "#1E6E2B";
      break;
    case statusConstants.SUBMITTED:
      selectedColor = "#E9A800";
      break;
    case statusConstants.APPROVED:
      selectedColor = "#20B036";
      break;
    case statusConstants.UNSUBMITTED:
      selectedColor = "#3059C4";
      break;
    default:
      selectedColor = "#474747";
  }
  return selectedColor;
};

const menuBaseItem = (name, status) => (
  <div className="membercomponent-menu__submenu-item">
    <span className="membercomponent-menu__item-name">{name}</span>
    <NmpTag
      color="white"
      style={{ borderColor: `${selectStatusColor(status)}` }}
      className="membercomponent-menu__item-status-dform"
    >
      <span
        style={{ backgroundColor: `${selectStatusColor(status)}` }}
        className="membercomponent-menu__item-status-dform__dot"
      ></span>
      <span style={{ color: `${selectStatusColor(status)}` }}>{status}</span>
    </NmpTag>
  </div>
);

const menuCategoryItem = (categoryName) => (
  <div className="membercomponent-menu__category-item">
    <span className="membercomponent-menu__category-item__name">{categoryName}</span>
  </div>
);

const menuCategoryTitle = (name, count) => (
  <span className="membercomponent-menu__category-title">
    <span>{name}</span>
    <span>{count ? `(${count})` : ""}</span>
  </span>
);

const menuDFormItems = (dforms) => {
  return dforms.map((dform) => {
    const id = dform.dform_id ?? dform.id;
    const name = dform.dform_name ?? dform.name;
    const status = dform.dform_status ?? dform.status;
    return {
      label: menuBaseItem(name, status),
      key: getKey(OnboardingsTypes.DForm, id),
    };
  });
};

const menuSurveysItems = (surveys) => {
  return surveys.map(({ id, title, started_at, finished_at, graded_at }) => {
    const status = findStatusSurvey(started_at, finished_at, graded_at, false);
    return {
      label: menuBaseItem(title, status),
      key: getKey(OnboardingsTypes.Survey, id),
    };
  });
};

const menuDFormsGroup = (dforms) => {
  return [
    {
      className: "membercomponent-menu__group-items",
      label: menuCategoryTitle(`Applications (${dforms.length})`),
      type: "group",
      children: menuDFormItems(dforms),
    },
  ];
};

const menuSurveysGroup = (surveys) => {
  return [
    {
      className: "membercomponent-menu__group-items",
      label: menuCategoryTitle(`Surveys (${surveys.length})`),
      type: "group",
      children: menuSurveysItems(surveys),
    },
  ];
};

export const MemberMenuView = ({ dforms, dFormsCategories, surveys, onboardings, activeOnboarding, onMenuChange }) => {
  console.log("dforms", dforms);
  const selectDFormsCategory = (data) => {
    const dformsList = [];
    data.forEach(({ dform_id, dform_name, dform_status }) => {
      if (!dformsList.find((el) => el.dform_id === dform_id)) {
        dformsList.push({ dform_id, dform_name, dform_status });
      }
    });
    return dformsList;
  };

  const categoriesList = [];
  dFormsCategories.forEach(({ category_id, category_name }) => {
    if (!categoriesList.find((el) => el.category_id === category_id)) {
      categoriesList.push({ category_id, category_name });
    }
  });

  const items = [
    {
      key: "applications",
      label: "Applications",
      children: !dFormsCategories.length
        ? menuDFormsGroup(dforms)
        : [
            {
              label: menuCategoryTitle("Categories", dFormsCategories.length),
              type: "group",
              className: "membercomponent-menu__category",
              children: categoriesList.map(({ category_id, category_name }) => {
                const findCategories = dFormsCategories.filter((category) => category.category_id === category_id);
                return {
                  label: menuCategoryItem(category_name),
                  key: `${category_id}-${category_name}`,
                  children: findCategories.length ? menuDFormsGroup(selectDFormsCategory(findCategories)) : [],
                };
              }),
            },
          ],

      className: "membercomponent-menu__item",
    },
    {
      key: "surveys",
      label: "Surveys",
      children: menuSurveysGroup(surveys),
      className: "membercomponent-menu__item survey-item",
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
