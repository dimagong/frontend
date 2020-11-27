import React from 'react'
import {ChevronLeft, ChevronRight} from 'react-feather'
import {
  Pagination,
  PaginationLink,
  PaginationItem,
} from 'reactstrap';

import './styles.scss'

const Tabs = ({tabs, onChange, active}) => {

  const handlePrevSelect = () => {
    const tabIndex = tabs.indexOf(active)
    if (~tabIndex && tabIndex !== 0) {
      handleTabChange(tabs[tabIndex-1])
    }
  }

  const handleNextSelect = () => {
    const tabIndex = tabs.indexOf(active)
    if (~tabIndex && tabIndex !== tabs.length - 1) {
      handleTabChange(tabs[tabIndex + 1])
    }
  }

  const scrollIntoContainerView = (tab) => {
    const element = document.getElementById(tab);
    const container = document.getElementById("tabs-container")

    const viewPosition = container.offsetWidth + container.scrollLeft;

    // container.offsetLeft is width from tabs container to pagination left border
    // (left arrow and gap between items and arrow)
    const elementLeftOffset = element.offsetLeft - container.offsetLeft;

    // if item overflow right border
    if(viewPosition - (elementLeftOffset + element.offsetWidth) < 0) {
      container.scrollLeft += -(viewPosition - (elementLeftOffset + element.offsetWidth))
    }

    // if item overflow left border
    if(elementLeftOffset < container.scrollLeft) {
      container.scrollLeft = elementLeftOffset
    }
  }

  const handleTabChange = (tab) => {
    onChange(tab);
    scrollIntoContainerView(tab)
  }

  return (
    <Pagination className=" justify-content-center mt-1 custom-tabs">
      <PaginationItem href="#" className="prev-item" onClick={handlePrevSelect}>
        <PaginationLink href="#" first>
          <ChevronLeft />{" "}
        </PaginationLink>
      </PaginationItem>
      <div className="custom-tabs_tabs" id={"tabs-container"}>
        {tabs.map((item) => (
          <span key={item} className="custom-tabs_tab" id={item}>
            <PaginationItem
              active={item === active}
              onClick={() => {handleTabChange(item)}}
            >
              <PaginationLink href={"#"}>
                {item}
              </PaginationLink>
            </PaginationItem>
          </span>
        ))}
      </div>
      <PaginationItem href="#" className="next-item" onClick={handleNextSelect}>
        <PaginationLink href="#" last>
          <ChevronRight />
        </PaginationLink>
      </PaginationItem>
    </Pagination>
  )
}

export default Tabs;
