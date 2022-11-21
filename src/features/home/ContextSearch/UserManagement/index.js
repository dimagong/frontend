import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { X } from "react-feather";

import UserEditPreview from "features/user/userEdit/userEditPreview";
import { NmpPagination } from "features/nmp-ui";

import { Row, Col, Button } from "reactstrap";
import useWindowSize from "hooks/windowWidth";
import UserCardTemplate from "../CardTemplates/userCard";
import { selectPreview } from "app/selectors/layoutSelector";

import appSlice from "app/slices/appSlice";

const { setManager, setPreview } = appSlice.actions;

const UserManagement = ({ allManagers, managers, handleContextChange }) => {
  const dispatch = useDispatch();
  const preview = useSelector(selectPreview);
  const [page, setPage] = useState(1);

  const closePreview = () => {
    dispatch(setPreview(null));
    setPage(1);
  };

  const width = useWindowSize();

  let itemsPerPage = width <= 1400 ? 6 : 9;

  itemsPerPage = preview ? 3 : itemsPerPage;

  const oneColumn = !!preview;

  const renderContent = (data, page) => {
    if (data.length === 0 && data.length !== allManagers.length) {
      return <h1 className={"no-managers"}>There are no such managers</h1>;
    }

    const pageData = data.slice(itemsPerPage * (page - 1), itemsPerPage * page);

    return pageData.map((elData, idx) => (
      <UserCardTemplate
        className="cursor-pointer"
        oneColumn={oneColumn}
        onClick={(e, user) => {
          if (e.ctrlKey) {
            dispatch(setPreview({ type: "user", id: user.id }));
          } else {
            dispatch(setManager(user));
            handleContextChange("User");
          }
        }}
        {...elData}
        key={idx}
      />
    ));
  };

  const onPreviewExpand = () => {
    const previewedManager = managers.filter(({ id }) => id === preview.id)[0];
    dispatch(setManager(previewedManager));
    handleContextChange("User");
  };

  const onPaginationChange = (page) => {
    setPage(page);
  };

  return (
    <Row>
      <Col
        className={`home__card-wrapper ${preview ? "preview-visible" : ""}`}
        sm={preview ? (oneColumn ? "5" : "8") : "12"}
      >
        {managers ? (
          <>
            {renderContent(managers, page)}
            <NmpPagination
              current={page}
              total={managers.length}
              pageSize={itemsPerPage}
              onChange={onPaginationChange}
              showSizeChanger={false}
              hideOnSinglePage
              className="search-context-pagination"
            />
          </>
        ) : null}
      </Col>
      {preview && (
        <Col sm={oneColumn ? "7" : "4"} className="preview">
          <UserEditPreview />

          <div className="preview-action-buttons">
            <Button style={{ borderRadius: "5rem" }} onClick={onPreviewExpand}>
              Expand
            </Button>
            <Button style={{ borderRadius: "5rem", padding: "10px" }} onClick={closePreview}>
              <X size={20} />
            </Button>
          </div>
        </Col>
      )}
    </Row>
  );
};

export default UserManagement;
