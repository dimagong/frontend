import React, { useEffect, useState, useRef } from "react";
import { Pagination, PaginationLink, PaginationItem } from "reactstrap";

import icon from "assets/img/icons/new-check.png";
import appsIcon from "assets/img/icons/apps.png";
import surveyIcon from "assets/img/icons/survey.png";

import { useOutsideClick, useOutsideFocus } from "hooks/use-outside-event";

import "./styles.scss";

const NavMenu = ({ tabs, onChange, active, tabId = "id", tabName }) => {
  const [shownMenu, setShownMenu] = useState("none");

  const navRef = useRef();

  const apps = tabs.filter((tab) => tab.hasOwnProperty("d_form_id"));
  const surveys = tabs.filter((tab) => !tab.hasOwnProperty("d_form_id"));

  const menus = [
    {
      id: "surveys",
      title: "Surveys",
      className: "nav-menu-tabs__surveys",
      items: surveys,
      itemsCount: `${surveys.filter((survey) => survey.finished_at !== null).length}/${surveys.length}`,
    },
    {
      id: "apps",
      title: "Applications",
      className: "",
      items: apps,
      itemsCount: `${apps.filter((app) => app.icon !== "null").length}/${apps.length}`,
    },
  ];

  const showMenu = (menuName) => {
    setShownMenu(menuName === shownMenu ? "none" : menuName);
  };

  useOutsideClick(navRef, (e) => (e.target.className.includes("ref") ? null : showMenu(shownMenu)));
  useOutsideFocus(navRef, (e) => (e.target.className.includes("ref") ? null : showMenu(shownMenu)));

  const handleTabChange = (tab) => {
    if (tab[tabId] !== active) {
      onChange(tab);
    }
  };

  const renderTabsWithIcons = (tabs) => {
    return tabs.map(
      (item) =>
        !item.isHidden && (
          <span key={item[tabId]} className="nav-menu-tabs_tab with-icon" id={item[tabId]}>
            <li className={`nav-menu-pagination-page_item ${item[tabId] === active ? "active" : ""}`}>
              <button className="nav-menu-pagination-page_link" onClick={() => handleTabChange(item)}>
                <div className={item.icon == "null" ? "icon-container icon-none" : "icon-container"}>
                  <img
                    src={item.icon == "null" ? "null" : icon}
                    alt=""
                    onError={(event) => (event.target.style.display = "none")}
                  />
                </div>
                <div className={"tabs-text-container"}>{tabName(item)}</div>
              </button>
            </li>
          </span>
        )
    );
  };

  //** TODO add mt-1 to other sections
  return (
    <>
      <div className="nav-column">
        <div className="nav-column-item ref" onClick={() => showMenu("apps")}>
          <img src={appsIcon} className={"ref"} />
        </div>
        <div className="nav-column-item ref" onClick={() => showMenu("surveys")}>
          <img src={surveyIcon} className={"ref"} />
        </div>
      </div>
      {menus
        .filter((menu) => menu.id === shownMenu)
        .map((menu) => (
          <div ref={navRef}>
            <nav className={`nav-menu-tabs ${menu.className || ""}`}>
              <ul className="nav-menu-pagination">
                <span className="title">
                  {menu.title}
                  <span className={"title-number"}> {menu.itemsCount}</span>
                </span>
                <div className="nav-menu-tabs_tabs" id={"tabs-container"}>
                  {renderTabsWithIcons(menu.items)}
                </div>
              </ul>
            </nav>
          </div>
        ))}
    </>
  );
};

export default NavMenu;
