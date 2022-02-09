import React, { useEffect, useState, useRef } from "react";
import { ChevronLeft, ChevronRight } from "react-feather";
import { Pagination, PaginationLink, PaginationItem } from "reactstrap";

import icon from "../../assets/img/icons/new-check.png";
import appsIcon from "../../assets/img/icons/apps.png";
import surveyIcon from "../../assets/img/icons/survey.png";

import { useOutsideClick, useOutsideFocus } from "hooks/use-outside-event";

import "./styles.scss";

const Tabs = ({ tabs, onChange, active, tabId = "id", tabName, withIcons = false, scrollOnStart = false }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isShowApps, setIsShowApps] = useState(false);
  const [isShowSurveys, setIsShowSurveys] = useState(false);

  const navRef = useRef();

  const apps = tabs.filter((tab) => tab.hasOwnProperty("d_form_id"));
  const surveys = tabs.filter((tab) => !tab.hasOwnProperty("d_form_id"));
  const tabsByKey = tabs.map((tab) => tab[tabId]);

  const handlePrevSelect = () => {
    const tabIndex = tabsByKey.indexOf(active);
    if (~tabIndex && tabIndex !== 0) {
      handleTabChange(tabs[tabIndex - 1]);
    }
  };

  const handleNextSelect = () => {
    const tabIndex = tabsByKey.indexOf(active);
    if (~tabIndex && tabIndex !== tabsByKey.length - 1) {
      handleTabChange(tabs[tabIndex + 1]);
    }
  };

  const handleTogle = (display) => {
    if (display === "apps") {
      setIsShowApps(true);
      setIsShowSurveys(false);
    } else if (display === "surveys") {
      setIsShowSurveys(true);
      setIsShowApps(false);
    } else {
      setIsShowApps(false);
      setIsShowSurveys(false);
    }
  };

  useOutsideClick(navRef, handleTogle);
  useOutsideFocus(navRef, handleTogle);

  const scrollIntoContainerView = (tab) => {
    const element = document.getElementById(tab);
    const container = document.getElementById("tabs-container");

    const viewPosition = container.offsetWidth + container.scrollLeft;
    // container.offsetLeft is width from tabs container to pagination left border
    // (left arrow and gap between items and arrow)
    const elementLeftOffset = element.offsetLeft - container.offsetLeft;

    // if item overflow right border
    if (viewPosition - (elementLeftOffset + element.offsetWidth) < 0) {
      container.scrollLeft += -(viewPosition - (elementLeftOffset + element.offsetWidth));
    }

    // if item overflow left border
    if (elementLeftOffset < container.scrollLeft) {
      container.scrollLeft = elementLeftOffset;
    }
  };

  const handleTabChange = (tab) => {
    if (tab[tabId] !== active) {
      onChange(tab);
      scrollIntoContainerView(tab[tabId]);
    }
  };

  const renderTabsWithoutIcons = (tabs) => {
    return tabs.map((item) => (
      <span key={item[tabId]} className="custom-tabs_tab" id={item[tabId]}>
        <PaginationItem active={item[tabId] === active}>
          <PaginationLink
            onClick={() => {
              handleTabChange(item);
            }}
          >
            {tabName(item)}
          </PaginationLink>
        </PaginationItem>
      </span>
    ));
  };

  const renderTabsWithIcons = (tabs) => {
    return tabs.map(
      (item) =>
        !item.isHidden && (
          <span key={item[tabId]} className="new-custom-tabs_tab with-icon" id={item[tabId]}>
            <PaginationItem active={item[tabId] === active}>
              <PaginationLink
                onClick={() => {
                  handleTabChange(item);
                }}
              >
                <div className={item.icon == "null" ? "icon-container icon-none" : "icon-container"}>
                  <img src={item.icon == "null" ? "null" : icon} alt="" onError="this.style.display = 'none'" />
                </div>
                <div className={"tabs-text-container"}>{tabName(item)}</div>
              </PaginationLink>
            </PaginationItem>
          </span>
        )
    );
  };

  useEffect(() => {
    if (scrollOnStart && tabs[0].id !== active && !isScrolled && document.getElementById(active)) {
      scrollIntoContainerView(active);
      setIsScrolled(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, document.getElementById(active)]);
  //** TODO add mt-1 to other sections
  return (
    <>
      <div className="nav-column">
        <div className="nav-column-item" onClick={() => (!isShowApps ? handleTogle("apps") : handleTogle())}>
          <img src={appsIcon} />
        </div>
        <div className="nav-column-item" onClick={() => (!isShowSurveys ? handleTogle("surveys") : handleTogle())}>
          <img src={surveyIcon} />
        </div>
      </div>
      {isShowApps && (
        <div ref={navRef}>
          <Pagination className="new-custom-tabs">
            <span className="title">
              Applications
              <span className={"title-number"}>
                {" "}
                {apps.filter((app) => app.icon !== "null").length}/{apps.length}
              </span>
            </span>
            <div className="new-custom-tabs_tabs" id={"tabs-container"}>
              {withIcons ? renderTabsWithIcons(apps) : renderTabsWithoutIcons(apps)}
            </div>
          </Pagination>
        </div>
      )}
      {isShowSurveys && (
        <div ref={navRef}>
          <Pagination className="new-custom-tabs new-custom-tabs__surveys">
            <span className="title">
              Surveys{" "}
              <span className={"title-number"}>
                {" "}
                {surveys.filter((survey) => survey.finished_at !== null).length}/{surveys.length}
              </span>
            </span>
            <div className="new-custom-tabs_tabs" id={"tabs-container"}>
              {withIcons ? renderTabsWithIcons(surveys) : renderTabsWithoutIcons(surveys)}
            </div>
          </Pagination>
        </div>
      )}
    </>
  );
};

export default Tabs;
