import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  ChevronLeft,
  ChevronRight,
  X,
} from 'react-feather'
import UserEditPreview from 'features/user-managment/userEdit/userEditPreview'

import {
  Row,
  Col,
  Pagination,
  PaginationItem,
  PaginationLink,
  Button,
} from 'reactstrap'
import useWindowSize from 'hooks/windowWidth'
import UserCardTemplate from '../CardTemplates/userCard'
import { selectPreview } from 'app/selectors/layoutSelector'

import appSlice from 'app/slices/appSlice'

const {
  setManager,
  setPreview,
  getOnboardingsByUserRequest,
} = appSlice.actions;

const UserManagement = ({ managers, handleContextChange }) => {

  const dispatch = useDispatch()
  const preview = useSelector(selectPreview)
  const [page, setPage] = useState(0);

  const closePreview = () => {
    dispatch(setPreview(null))
    setPage(0)
  }

  const width = useWindowSize()

  let itemsPerPage = width <= 1400 ? 6 : 9;

  itemsPerPage = preview ? 3 : itemsPerPage;
  const oneColumn = !!preview

  const renderContent = (data, page) => {

    const pageData = data.slice(itemsPerPage * page, itemsPerPage * (page + 1))

    return pageData.map((elData) => (
      <UserCardTemplate
        className="cursor-pointer"
        oneColumn={oneColumn}
        onClick={(e, user) => {
          if (e.ctrlKey) {
            dispatch(setPreview({type: "user", id: user.id}))
          } else {
            dispatch(setManager(user));
            dispatch(getOnboardingsByUserRequest(user));
            handleContextChange("User")
          }
        }}
        {...elData}
      />
    ))
  }

  const getPagination = () => {
    return Array.from(Array(Math.ceil(managers.length/itemsPerPage)))
  }

  const onPreviewExpand = () => {
    const previewedManager = managers.filter(({ id }) => id === preview.id)[0]
    dispatch(setManager(previewedManager))
    handleContextChange("User")
  }



  return (
    <Row>
      <Col className={`home__card-wrapper ${preview ? "preview-visible" : ""}`} sm={preview ? oneColumn ? "5" : "8" : "12"}>
        {managers && renderContent(managers, page)}
        {managers && getPagination().length > 1 && (
          <div className="search-context-pagination">
            <Button
              className="pagination-arrow"
              onClick={() => {
                if (page !== 0) setPage(page - 1)
              }}
            >
              <ChevronLeft size={28} color="#707070"/>
            </Button>
            <Pagination aria-label="Page navigation">
              {getPagination().map( (_, index) => (
                <PaginationItem key={index} active={page === index}>
                  <PaginationLink onClick={() => {
                    setPage(index)
                  }}>
                    {index + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
            </Pagination>
            <Button
              className="pagination-arrow"
              onClick={() => {
                if (page !== getPagination().length -1) setPage(page + 1)
              }}
            >
              <ChevronRight size={28} color="#707070"/>
            </Button>
          </div>
        )}
      </Col>
      {preview && (
        <Col sm={oneColumn ? "7" : "4"} className="preview">

          <UserEditPreview />

          <div className="preview-action-buttons">
            <Button style={{borderRadius: "5rem"}} onClick={onPreviewExpand}>
              Expand
            </Button>
            <Button style={{borderRadius: "5rem", padding: "10px"}} onClick={closePreview}>
              <X size={20}/>
            </Button>
          </div>
        </Col>
      )}
    </Row>
  )
}

export default UserManagement

