import React from "react";
import { useDispatch } from "react-redux";
import SaveIcon from "@material-ui/icons/Save";
import CloseIcon from "@material-ui/icons/Close";
import { Button, Modal, ModalBody } from "reactstrap";

import appSlice from "app/slices/appSlice";

import NmpSelect from "components/nmp/DeprecatedNmpSelect";

const { postFilterRequest, patchFilterRequest, deleteFilterRequest } = appSlice.actions;

const areSetsEqual = (arr1, arr2) => {
  let set1 = new Set(arr1);
  let set2 = new Set(arr2);
  return set1.size === set2.size && [...set1].every((value) => set2.has(value));
};

const areFiltersEqual = (filter1, filter2) => {
  let isEqual = true;
  Object.keys(filter1).forEach((key) => {
    if (key !== "type" && !areSetsEqual(filter1[key], filter2[key])) {
      isEqual = false;
    }
  });
  return isEqual;
};

const SavedFilters = ({
  userFilters,
  filter,
  setFilter,
  initialFilter,
  changeFooter,
  activeFilter,
  setActiveFilter,
  filterName,
  setFilterName,
  isDeleteModalOpen,
  setIsDeleteModalOpen,
  userFiltersId,
}) => {
  const dispatch = useDispatch();
  if (activeFilter) {
    userFilters.forEach((item) => {
      if (activeFilter === item.filterName && !areFiltersEqual(activeFilter.data, item.data)) {
        setActiveFilter(item);
      }
    });
  }
  const handleSave = () => {
    const newUserFilter = userFilters.filter((item) => item.filter_name !== filterName);
    setActiveFilter({ filter_name: filterName, data: filter });
    newUserFilter.push({ filter_name: filterName, data: filter });
    dispatch(
      patchFilterRequest({ id: userFiltersId, value: newUserFilter, message: "updated", filterName: filterName })
    );
  };

  const postFilter = (newFilterName) => {
    const newUserFilter = [...userFilters];
    setActiveFilter({ filter_name: filterName, data: filter });
    newUserFilter.push({ filter_name: newFilterName, data: filter });
    if (userFilters.length === 0) {
      dispatch(
        postFilterRequest({
          value: newUserFilter,
        })
      );
    } else {
      dispatch(
        patchFilterRequest({
          id: userFiltersId,
          value: newUserFilter,
          message: "added",
          filterName: newFilterName,
        })
      );
    }
  };

  const handleDelete = () => {
    if (activeFilter) {
      setIsDeleteModalOpen(true);
    }
  };

  const handleFilterDelete = () => {
    const newUserFilter = userFilters.filter((item) => item.filter_name !== filterName);
    if (newUserFilter.length === 0) {
      dispatch(deleteFilterRequest({ id: userFiltersId, filterName: filterName }));
    } else {
      dispatch(
        patchFilterRequest({ id: userFiltersId, value: newUserFilter, message: "deleted", filterName: filterName })
      );
    }
    handleChange(null, { action: "clear" });
    setIsDeleteModalOpen(false);
  };

  const handleChange = (newValue, actionMeta) => {
    if (actionMeta.action === "select-option") {
      if (newValue) {
        setActiveFilter(newValue.value);
        setFilter(newValue.value.data);
        changeFooter(newValue.value.data);
        setFilterName(newValue.value.filter_name);
      } else {
        setActiveFilter(null);
        initialFilter();
      }
    }

    if (actionMeta.action === "create-option") {
      setFilterName(newValue.label);
      postFilter(newValue.label);
    }

    if (actionMeta.action === "clear") {
      setActiveFilter(null);
      setFilterName("");
      initialFilter();
    }
  };

  let options = [];
  userFilters.forEach((item) => options.push({ value: item, label: item.filter_name }));

  const selectStyles = {
    container: (styles) => ({ ...styles, width: "320px", display: "inline-block" }),
    menuList: (styles) => ({ ...styles, maxHeight: "165px" }),
  };

  return (
    <span className={"saved-filters"}>
      <NmpSelect
        clearable
        isCreatable
        onChange={handleChange}
        options={options}
        value={activeFilter ? undefined : filterName !== "" ? { label: filterName } : null}
        styles={selectStyles}
        placeholder={"Name of filter set"}
      />
      <span onClick={handleSave} className={"filter-save"}>
        <SaveIcon />
      </span>
      <span onClick={handleDelete} className={"filter-remove-save"}>
        <CloseIcon />
      </span>
      <span className={"unsaved"}>
        {activeFilter?.data && !areFiltersEqual(activeFilter.data, filter) && "Unsaved"}
      </span>

      <Modal
        className={"organization-remove-modal"}
        isOpen={isDeleteModalOpen}
        fade={false}
        toggle={() => {
          setIsDeleteModalOpen(false);
        }}
      >
        <ModalBody>
          <div>
            <span style={{ fontSize: "22px" }}>
              Are you sure you want to delete filter set: {activeFilter?.filter_name}?
            </span>
          </div>
          <div className={"organization-remove-modal_action-buttons"}>
            <Button
              className={"remove-button"}
              onClick={() => {
                handleFilterDelete();
              }}
            >
              Remove
            </Button>
            <Button
              className={"cancel-button"}
              onClick={() => {
                setIsDeleteModalOpen(false);
              }}
            >
              Cancel
            </Button>
          </div>
        </ModalBody>
      </Modal>
    </span>
  );
};

export default SavedFilters;
