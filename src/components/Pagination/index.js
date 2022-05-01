import React from "react";

import "./styles.scss";
import { Button, PaginationItem, PaginationLink, Pagination } from "reactstrap";
import { ChevronLeft, ChevronRight } from "react-feather";

const CustomPagination = ({ totalPages, currentPage, setPage }) => {
  const getPagination = () => {
    return Array.from(Array(totalPages));
  };

  return (
    <div className="custom_pagination">
      <Button
        className="custom_pagination-arrow"
        onClick={() => {
          if (currentPage !== 0) setPage(currentPage - 1);
        }}
      >
        <ChevronLeft size={28} color="#707070" />
      </Button>
      <Pagination aria-label="Page navigation">
        {getPagination().map((_, index) => (
          <PaginationItem key={index} active={currentPage === index}>
            <PaginationLink
              onClick={() => {
                setPage(index);
              }}
            >
              {index + 1}
            </PaginationLink>
          </PaginationItem>
        ))}
      </Pagination>
      <Button
        className="custom_pagination-arrow"
        onClick={() => {
          if (currentPage !== getPagination().length - 1) setPage(currentPage + 1);
        }}
      >
        <ChevronRight size={28} color="#707070" />
      </Button>
    </div>
  );
};

export default CustomPagination;
