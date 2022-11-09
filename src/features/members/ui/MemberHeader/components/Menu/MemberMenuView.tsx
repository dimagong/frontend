import React from "react";

import { NpmMenu, NmpTag } from "features/nmp-ui";
import { OnboardingsTypes } from "features/onboarding/utils/collectApplicationsUser";
import { findStatusSurvey } from "features/members/data/helpers/findStatusSurvey";
import { Status } from "features/members/data/constants/statusConstants";
import { Survey, DForm, DFormCategory } from "features/members/data/models/models";

const getKey = (type: string, id: number) => `${type}-${id}`;

const parseKey = (key: string) => {
  const [type, id] = key.split("-");
  return { type, id };
};

const selectStatusColor = (status: string) => {
  let selectedColor: null | string = null;
  switch (status) {
    case Status.IN_PROGRESS:
    case Status.STARTED:
      selectedColor = "#5186C3";
      break;
    case Status.REJECTED:
      selectedColor = "#1E6E2B";
      break;
    case Status.SUBMITTED:
      selectedColor = "#E9A800";
      break;
    case Status.APPROVED:
      selectedColor = "#20B036";
      break;
    case Status.UNSUBMITTED:
      selectedColor = "#3059C4";
      break;
    default:
      selectedColor = "#474747";
  }
  return selectedColor;
};

const menuBaseItem = (name: string, status: string, statusColor: string): JSX.Element => (
  <div className="member-menu__submenu-item">
    <span className="member-menu__item-name">{name}</span>
    <NmpTag color="white" style={{ borderColor: statusColor }} className="member-menu__item-status-dform">
      <span style={{ backgroundColor: statusColor }} className="member-menu__item-status-dform__dot"></span>
      <span style={{ color: statusColor }}>{status}</span>
    </NmpTag>
  </div>
);

const menuCategoryItem = (categoryName: string = ""): JSX.Element => (
  <div className="member-menu__category-item">
    <span className="member-menu__category-item__name">{categoryName}</span>
  </div>
);

const menuCategoryTitle = (name: string, count: number): JSX.Element => (
  <span className="member-menu__category-title">
    <span>{name}</span>
    <span>{count >= 0 ? `(${count})` : ""}</span>
  </span>
);

const menuDFormItems = (dforms: Partial<DFormCategory>[] | Partial<DForm>[]) => {
  return dforms.map((dform) => {
    const id = dform.dform_id ?? dform.id;
    const name = dform.dform_name ?? dform.name;
    const status = dform.dform_status ?? dform.status;
    const statusColor = selectStatusColor(status);
    return {
      label: menuBaseItem(name, status, statusColor),
      key: getKey(OnboardingsTypes.DForm, id),
    };
  });
};

const menuSurveysItems = (surveys) => {
  return surveys.map(({ id, title, started_at, finished_at, graded_at }) => {
    const status = findStatusSurvey(started_at, finished_at, graded_at, false);
    const statusColor = selectStatusColor(status);
    return {
      label: menuBaseItem(title, status, statusColor),
      key: getKey(OnboardingsTypes.Survey, id),
    };
  });
};

const menuDFormsGroup = (dforms: Partial<DFormCategory>[] | Partial<DForm>[]) => {
  return [
    {
      className: "member-menu__group-items",
      label: menuCategoryTitle(`Forms`, dforms.length),
      type: "group",
      children: menuDFormItems(dforms),
    },
  ];
};

const menuSurveysGroup = (surveys: Survey[]) => {
  return [
    {
      className: "member-menu__group-items",
      label: menuCategoryTitle(`Surveys`, surveys.length),
      type: "group",
      children: menuSurveysItems(surveys),
    },
  ];
};

export const MemberMenuView = ({ dforms, dFormsCategories, surveys, onboardings, activeOnboarding, onMenuChange }) => {
  console.log("dforms", dforms);

  const selectDFormsCategory = (categories: DFormCategory[]): Partial<DFormCategory>[] => {
    const dformsList: Partial<DFormCategory>[] = [];
    categories.forEach(({ dform_id, dform_name, dform_status }) => {
      if (!dformsList.find((el) => el.dform_id === dform_id) && dform_id) {
        dformsList.push({
          dform_id,
          dform_name: dform_name || "no application name",
          dform_status: dform_status || Status.NO_STATUS,
        });
      }
    });
    return dformsList;
  };

  const categoriesList: Partial<DFormCategory>[] = [];
  if (dFormsCategories) {
    dFormsCategories.forEach(({ category_id, category_name }) => {
      if (!categoriesList.find((el) => el.category_id === category_id) && category_id) {
        categoriesList.push({ category_id, category_name: category_name || "no category name" });
      }
    });
  }

  const items = [
    {
      key: "forms",
      label: "Forms",
      children: !dFormsCategories?.length
        ? menuDFormsGroup(dforms)
        : [
            {
              label: menuCategoryTitle("Categories", dFormsCategories.length),
              type: "group",
              className: "member-menu__category",
              children: categoriesList.map(({ category_id, category_name }) => {
                const findCategories = dFormsCategories.filter(
                  (category: DFormCategory) => category.category_id === category_id
                );
                return {
                  label: menuCategoryItem(category_name),
                  key: `${category_id}-${category_name}`,
                  children: findCategories.length ? menuDFormsGroup(selectDFormsCategory(findCategories)) : [],
                };
              }),
            },
          ],

      className: "member-menu__item",
    },
    {
      key: "surveys",
      label: "Surveys",
      children: menuSurveysGroup(surveys),
      className: "member-menu__item survey-item",
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
