import React, {useEffect, useState} from 'react'
import {ChevronLeft, ChevronRight} from 'react-feather'
import {
  Pagination,
  PaginationLink,
  PaginationItem,
} from 'reactstrap';

import './styles.scss'

const Tabs = ({tabs, onChange, active, tabId = 'id', tabName, withIcons = false, scrollOnStart = false}) => {

  const [isScrolled, setIsScrolled] = useState(false);
  const tabsByKey = tabs.map((tab => tab[tabId]));

  const handlePrevSelect = () => {
    const tabIndex = tabsByKey.indexOf(active);
    if (~tabIndex && tabIndex !== 0) {
      handleTabChange(tabs[tabIndex - 1])
    }
  };

  const handleNextSelect = () => {
    const tabIndex = tabsByKey.indexOf(active);
    if (~tabIndex && tabIndex !== tabsByKey.length - 1) {
      handleTabChange(tabs[tabIndex + 1])
    }
  };

  const scrollIntoContainerView = (tab) => {
    const element = document.getElementById(tab);
    const container = document.getElementById("tabs-container");

    const viewPosition = container.offsetWidth + container.scrollLeft;
    // container.offsetLeft is width from tabs container to pagination left border
    // (left arrow and gap between items and arrow)
    const elementLeftOffset = element.offsetLeft - container.offsetLeft;

    // if item overflow right border
    if (viewPosition - (elementLeftOffset + element.offsetWidth) < 0) {
      container.scrollLeft += -(viewPosition - (elementLeftOffset + element.offsetWidth))
    }

    // if item overflow left border
    if (elementLeftOffset < container.scrollLeft) {
      container.scrollLeft = elementLeftOffset
    }
  };

  const handleTabChange = (tab) => {
    if (tab[tabId] !== active) {
      onChange(tab);
      scrollIntoContainerView(tab[tabId])
    }
  };

  const renderTabsWithoutIcons = () => {

    return (
      tabs.map((item) => (
        <span key={item[tabId]} className="custom-tabs_tab" id={item[tabId]}>
            <PaginationItem
              active={item[tabId] === active}
            >
              <PaginationLink onClick={() => {
                handleTabChange(item)
              }}>
                {tabName(item)}
              </PaginationLink>
            </PaginationItem>
          </span>
      ))
    )

  }

  const renderTabsWithIcons = () => {
    return (
      tabs.map((item) => (
          !item.isHidden && (
            <span key={item[tabId]} className="custom-tabs_tab with-icon" id={item[tabId]}>
              <PaginationItem
                active={item[tabId] === active}
              >
                <PaginationLink onClick={() => {
                  handleTabChange(item)
                }}>
                  <div className="icon-container">
                    <img src={item.icon} alt="" onError="this.style.display = 'none'"/>
                  </div>
                  <div>
                    {tabName(item)}
                  </div>
                </PaginationLink>
              </PaginationItem>
            </span>
          )
        )
      )
    )
  }

  useEffect(() => {
    if (scrollOnStart && tabs[0].id !== active && !isScrolled && document.getElementById(active)) {
      scrollIntoContainerView(active)
      setIsScrolled(true);
    }
  }, [active, document.getElementById(active)])

  //** TODO add mt-1 to other sections
  return (
    <Pagination className=" justify-content-center custom-tabs">
      <PaginationItem href="#" className="prev-item">
        <PaginationLink onClick={handlePrevSelect} first>
          <ChevronLeft/>{" "}
        </PaginationLink>
      </PaginationItem>
      <div className="custom-tabs_tabs" id={"tabs-container"}>
        {withIcons ? renderTabsWithIcons(tabs) : renderTabsWithoutIcons(tabs)}
      </div>
      <PaginationItem href="#" className="next-item">
        <PaginationLink onClick={handleNextSelect} last>
          <ChevronRight/>
        </PaginationLink>
      </PaginationItem>
    </Pagination>
  )
};

export default Tabs;
