import "./styles.scss";

import React from "react";
import type { FC } from "react";
import type { Location } from "history";
import { useRouteMatch, useLocation } from "react-router-dom";

import { history } from "routes/history";
import { memberPath } from "constants/paths";
import { NpmMenu, NmpTag } from "features/nmp-ui";

import { Survey } from "../../data/models/models";
import { Status } from "../../data/constants/statusConstants";
import { findStatusSurvey } from "../../data/helpers/findStatusSurvey";
import { OnboardingsTypes } from "../../utils/collectApplicationsUser";

const getKey = (type: string, id: string) => `${type}-${id}`;

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

const makeCategoryHierarchy = (dFormsCategories) => {
  let topLevel = dFormsCategories.find((category) => category.category_parent === null);

  if (!topLevel) {
    return [];
  }

  topLevel.forms = [];

  for (let childForm of dFormsCategories) {
    if (!childForm.dform_id) {
      continue;
    }
    if (childForm.category_id === topLevel.category_id) {
      topLevel.forms.push({
        dform_id: childForm.dform_id,
        dform_name: childForm.dform_name,
        dform_description: childForm.dform_description,
        dform_status: childForm.dform_status,
        dform_access_type: childForm.dform_access_type,
        category_parent: childForm.category_parent,
        dform_created_at: childForm.dform_created_at,
        dform_updated_at: childForm.dform_updated_at,
      });
    }
  }

  const hierarchyRecursion = (category, categories) => {
    for (let childCategory of categories) {
      if (childCategory.category_parent === category.category_id) {
        category.categories = [];
        let forms: any[] = [];

        for (let childForm of categories) {
          if (!childForm.dform_id) {
            continue;
          }
          if (childForm.category_id === childCategory.category_id) {
            forms.push({
              dform_id: childForm.dform_id,
              dform_name: childForm.dform_name,
              dform_description: childForm.dform_description,
              dform_status: childForm.dform_status,
              dform_access_type: childForm.dform_access_type,
              category_parent: childForm.category_parent,
              dform_created_at: childForm.dform_created_at,
              dform_updated_at: childForm.dform_updated_at,
            });
          }
        }
        let tempCategory = {
          category_id: childCategory.category_id,
          category_name: childCategory.category_name,
          category_parent: childCategory.category_parent,
          forms: forms,
          categories: [],
        };

        category.categories.push(tempCategory);

        hierarchyRecursion(tempCategory, categories);
      }
    }
  };

  hierarchyRecursion(topLevel, dFormsCategories);

  return topLevel;
};

const makeViewHierarchy = (topLevelCategory) => {
  let viewHierarchy = topLevelCategory?.forms?.length
    ? [
        {
          className: "member-menu__category",
          label: menuCategoryTitle("Forms", topLevelCategory.forms.length),
          key: "default-zero-forms",
          type: "group",
          children: topLevelCategory.forms.map((form) => {
            return {
              label: menuBaseItem(form.dform_name, form.dform_status, selectStatusColor(form.dform_status)),
              key: getKey(OnboardingsTypes.DForm, form.dform_id),
            };
          }),
        },
      ]
    : [];

  const makeViewHierarchy = (topLevelCategory, viewHierarchy) => {
    if (!topLevelCategory?.categories?.length) {
      return [];
    }
    let infoCategories: any = {
      className: "member-menu__category",
      label: menuCategoryTitle("Categories", topLevelCategory.categories.length),
      key: topLevelCategory.id + "-categories",
      type: "group",
      children: [],
    };
    viewHierarchy.unshift(infoCategories);

    for (let category of topLevelCategory.categories) {
      let temp = {
        className: "member-menu__group-items",
        label: menuCategoryItem(category.category_name),
        key: category.category_id,
        children: [
          {
            className: "member-menu__category",
            label: menuCategoryTitle("Forms", category.forms.length),
            key: topLevelCategory.id + "-form",
            type: "group",
            children: [],
          },
        ].concat(
          category.forms.map((form) => {
            return {
              label: menuBaseItem(form.dform_name, form.dform_status, selectStatusColor(form.dform_status)),
              key: getKey(OnboardingsTypes.DForm, form.dform_id),
            };
          })
        ),
      };

      infoCategories.children.push(temp);
      makeViewHierarchy(category, temp.children);
    }
  };

  makeViewHierarchy(topLevelCategory, viewHierarchy);

  return viewHierarchy;
};

type RouteParams = { formId: string; surveyId: string };

const getActiveOnboardingByLocation = (location: Location<unknown>) => {
  if (location.pathname.includes(OnboardingsTypes.DForm)) {
    const id = location.pathname.replace(`${memberPath}/${OnboardingsTypes.DForm}/`, "");

    return { type: OnboardingsTypes.DForm, id };
  } else if (location.pathname.includes(OnboardingsTypes.Survey)) {
    const id = location.pathname.replace(`${memberPath}/${OnboardingsTypes.Survey}/`, "");

    return { type: OnboardingsTypes.Survey, id };
  }

  return null;
};

type MemberMenuProps = {
  surveys: any[];
  dFormsCategories: any[];
  dFormsCategoriesRegister: any[];
};

export const MemberMenu: FC<MemberMenuProps> = (props) => {
  const { surveys, dFormsCategories, dFormsCategoriesRegister } = props;

  const location = useLocation();
  const { path } = useRouteMatch<RouteParams>();

  let zeroCategory: any = [
    {
      className: "member-menu__category",
      label: menuCategoryTitle("Forms", 0),
      key: "default-zero-forms",
      type: "group",
      children: [],
    },
  ];

  let commonCategory: any = [];
  let registerCategory: any = [];

  if (dFormsCategories.length) {
    commonCategory = makeViewHierarchy(makeCategoryHierarchy(dFormsCategories));
  }

  if (dFormsCategoriesRegister.length) {
    registerCategory = makeViewHierarchy(makeCategoryHierarchy(dFormsCategoriesRegister));
  }

  const items = [
    {
      label: "Forms",
      key: "Forms",
      className: "member-menu__item",
      children: commonCategory.length ? commonCategory : zeroCategory,
    },
    {
      key: "surveys",
      label: "Surveys",
      children: menuSurveysGroup(surveys),
      className: "member-menu__item survey-item",
    },
    {
      label: "Register",
      key: `Register`,
      className: "member-menu__item",
      children: registerCategory.length ? registerCategory : zeroCategory,
    },
  ];

  const activeOnboarding = getActiveOnboardingByLocation(location);
  const selectedKeys = activeOnboarding ? [getKey(activeOnboarding.type, activeOnboarding.id)] : [];

  const onSelect = ({ key }: { key: string }) => {
    const { type, id } = parseKey(key);

    history.push(`${path}/${type}/${id}`);
  };

  return (
    <div className="member-menu">
      <NpmMenu mode="horizontal" items={items} selectedKeys={selectedKeys} onSelect={onSelect} />
    </div>
  );
};
