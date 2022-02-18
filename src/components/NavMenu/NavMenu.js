import React, { useEffect, useState, useRef } from "react";
import { Pagination, PaginationLink, PaginationItem } from "reactstrap";
import { stopPropagation } from "utility/event-decorators";

import icon from "assets/img/icons/new-check.png";
import appsIcon from "assets/img/svg/apps.svg";
import surveyIcon from "assets/img/svg/survey.svg";

import { useOutsideClick, useOutsideFocus } from "hooks/use-outside-event";

import "./styles.scss";

const NavMenu = ({ tabs, onChange, active, tabId = "id", tabName }) => {
  const [shownMenu, setShownMenu] = useState("none");

  const navRef = useRef();

  const apps = React.useMemo(() => tabs.filter((tab) => tab.hasOwnProperty("d_form_id")), [tabs]);
  const surveys = React.useMemo(() => tabs.filter((tab) => !tab.hasOwnProperty("d_form_id")), [tabs]);

  const menus = React.useMemo(
    () => [
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
    ],
    [apps, surveys]
  );

  const showMenu = React.useCallback(
    (menuName) => setShownMenu(menuName === shownMenu ? "none" : menuName),
    [shownMenu]
  );

  const closeMenu = React.useCallback(() => setShownMenu("none"), []);

  const handleTabChange = React.useCallback(
    (tab) => {
      if (tab[tabId] !== active) {
        closeMenu();
        onChange(tab);
      }
    },
    [active, closeMenu, onChange, tabId]
  );

  useOutsideClick(navRef, (e) => showMenu(shownMenu));
  useOutsideFocus(navRef, (e) => showMenu(shownMenu));

  const renderTabsWithIcons = (tabs) => {
    return tabs.map(
      (item) =>
        !item.isHidden && (
          <li key={item[tabId]} className="nav-menu-tabs_tab with-icon" id={item[tabId]}>
            <div className={`nav-menu-pagination-page_item ${item[tabId] === active ? "active" : ""}`}>
              <button className="btn nav-menu-pagination-page_link" onClick={() => handleTabChange(item)}>
                <div className={item.icon == "null" ? "icon-container icon-none" : "icon-container"}>
                  <img
                    src={item.icon == "null" ? "null" : icon}
                    alt=""
                    onError={(event) => (event.target.style.display = "none")}
                  />
                </div>
                <div className={"tabs-text-container"}>{tabName(item)}</div>
              </button>
            </div>
          </li>
        )
    );
  };

  //** TODO add mt-1 to other sections
  return (
    <div ref={navRef}>
      <div className="nav-column">
        <div
          className={`nav-column-item ${shownMenu === "apps" ? "active" : ""}`}
          onClick={stopPropagation(() => showMenu("apps"))}
        >
          <svg
            width="20"
            className={"nav-column-item__icon_fill"}
            height="28"
            viewBox="0 0 20 28"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4.54322 13.0093H5.62346V11.9074H4.54322V13.0093ZM4.54322 16.3148H5.62346V15.213H4.54322V16.3148ZM4.54322 9.70373H5.62346V8.60188H4.54322V9.70373ZM4.54322 19.6204H5.62346V18.5185H4.54322V19.6204ZM4.54322 22.926H5.62346V21.8241H4.54322V22.926ZM6.70371 16.3148H15.3457V15.213H6.70371V16.3148ZM6.70371 9.70373H15.3457V8.60188H6.70371V9.70373ZM15.2787 0.888916H0.222229V27.3334H19.6667V5.29632L15.2787 0.888916ZM17.5062 25.0613H2.38272V3.09262H13.1852V6.32986H17.5062V25.0613ZM6.70371 19.6204H15.3457V18.5185H6.70371V19.6204ZM6.70371 13.0093H15.3457V11.9074H6.70371V13.0093ZM6.70371 22.926H15.3457V21.8241H6.70371V22.926Z"
              fill="white"
            />
          </svg>
        </div>
        <div
          className={`nav-column-item ${shownMenu === "surveys" ? "active" : ""}`}
          onClick={stopPropagation(() => showMenu("surveys"))}
        >
          <svg className="nav-column-item__icon_stroke" width="23" height="28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16.26 14.813a.383.383 0 1 0-.545.54l.656.657-.657.656a.378.378 0 0 0 .005.538c.151.15.394.148.54 0l.652-.652.654.655c.15.15.394.151.543.002a.383.383 0 0 0 .002-.543l-.656-.656.656-.657a.378.378 0 0 0-.004-.538.384.384 0 0 0-.54 0l-.652.652-.655-.654ZM13.931 1.218v1.098c0 .283.23.53.508.549.06.02.129.028.197.028h2.067v2.273H6.317v-2.27H8.38c.07 0 .14-.01.198-.029a.558.558 0 0 0 .508-.549V1.22c1.615-.002 3.23-.002 4.845-.002Zm3.05 5.077c.23 0 .448-.099.597-.246.02-.02.029-.04.049-.06a.846.846 0 0 0 .198-.529V4.343h3.11c.029 0 .07.009.09.04.02.021.04.06.04.09v21.386c0 .04-.01.068-.04.088a.125.125 0 0 1-.09.04H2.083a.125.125 0 0 1-.09-.04c-.028-.02-.04-.049-.04-.088V4.472c0-.028.02-.068.04-.088.02-.028.06-.04.09-.04h3.11v1.119c0 .195.08.382.198.529.02.02.029.04.049.06.15.146.367.245.596.245 3.649-.002 7.298-.002 10.947-.002Zm3.945 20.8c.338 0 .657-.136.884-.362.229-.226.367-.53.367-.872V4.472c0-.342-.138-.648-.367-.872a1.243 1.243 0 0 0-.884-.362h-3.11V2.63a.847.847 0 0 0-.846-.834h-1.926v-.763a.907.907 0 0 0-.278-.647.926.926 0 0 0-.654-.275H8.909a.93.93 0 0 0-.657.275.907.907 0 0 0-.278.647v.765H6.047a.847.847 0 0 0-.845.834v.608h-3.11a1.24 1.24 0 0 0-.884.363c-.229.226-.367.529-.367.871v21.387c0 .343.138.648.367.872.23.226.548.362.884.362h18.835Zm-15.74-5.112a.562.562 0 0 1-.566-.558c0-.303.25-.558.565-.558h7.523a.56.56 0 0 1 .565.558.56.56 0 0 1-.565.558H5.186Zm0-10.716a.562.562 0 0 1-.566-.558c0-.303.25-.558.565-.558h7.523a.56.56 0 0 1 .565.558.56.56 0 0 1-.565.558H5.186Zm0 5.285a.562.562 0 0 1-.566-.557c0-.303.25-.558.565-.558h7.523a.56.56 0 0 1 .565.558.56.56 0 0 1-.565.557H5.186Zm12.9 4.845a.492.492 0 0 0-.139-.688.506.506 0 0 0-.696.137l-.274.4-1.083-1.303a.506.506 0 0 0-.706-.068.49.49 0 0 0-.069.696l1.5 1.8a.506.506 0 0 0 .816-.024l.65-.95Zm0-10.161a.492.492 0 0 0-.139-.688.506.506 0 0 0-.696.137l-.274.4-1.083-1.303a.506.506 0 0 0-.706-.068.49.49 0 0 0-.069.696l1.5 1.8a.506.506 0 0 0 .816-.024l.65-.95Z" fill="#0070B8" stroke="#0070B8"/>
          </svg>
        </div>
      </div>
      {menus
        .filter((menu) => menu.id === shownMenu)
        .map((menu) => (
          <nav className={`nav-menu-tabs ${menu.className || ""}`}>
            <ul className="nav-menu-pagination">
              <li className="title">
                {menu.title}
                <span className={"title-number"}> {menu.itemsCount}</span>
              </li>
              <ul className="nav-menu-tabs_tabs" id={"tabs-container"}>
                {menu.items.length !== 0 ? (
                  renderTabsWithIcons(menu.items)
                ) : (
                  <span className="nav-menu-tab_not-assigned">
                    {`There are no assigned ${menu.title.toLocaleLowerCase()}`}
                  </span>
                )}
              </ul>
            </ul>
          </nav>
        ))}
    </div>
  );
};

export default NavMenu;
