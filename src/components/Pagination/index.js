import React, {useState} from 'react';

import './styles.scss'
import {Button, PaginationItem, PaginationLink, Pagination} from "reactstrap";
import {ChevronLeft, ChevronRight} from "react-feather";

const CustomPagination = ({ totalPages, currentPage }) => {

  const getPagination = () => {
    return Array.from(Array(totalPages))
  };

  return (
    <div className="custom_pagination">
      <Button
        className="custom_pagination-arrow"
        onClick={() => {
          // if (page !== 0) setPage(page - 1)
        }}
      >
        <ChevronLeft size={28} color="#707070"/>
      </Button>
      <Pagination aria-label="Page navigation">
        {getPagination().map( (_, index) => (
          <PaginationItem key={index} active={currentPage - 1 === index}>
            <PaginationLink onClick={() => {
              // setPage(index)
            }}>
              {index + 1}
            </PaginationLink>
          </PaginationItem>
        ))}
      </Pagination>
      <Button
        className="custom_pagination-arrow"
        onClick={() => {
          // if (page !== getPagination().length -1) setPage(page + 1)
        }}
      >
        <ChevronRight size={28} color="#707070"/>
      </Button>
    </div>
  )
};

export default CustomPagination;
