import React, {useState} from 'react'
import CloseIcon from '@material-ui/icons/Close';
import SaveIcon from "@material-ui/icons/Save";
import {useDispatch} from "react-redux";
import appSlice from "app/slices/appSlice";
import {toast} from "react-toastify";
import CreatableSelect from "react-select/creatable";
import {Button, Modal, ModalBody} from "reactstrap";
const {postFilterRequest, deleteFilterRequest, patchFilterRequest} = appSlice.actions;

const SavedFilters = ({ userFilters, filter, setFilter, initialFilter, changeFooter, activeFilter, setActiveFilter, filterName, setFilterName, isDeleteModalOpen, setIsDeleteModalOpen }) => {
  const dispatch = useDispatch();
  if (activeFilter && !activeFilter.hasOwnProperty('id')) {
    userFilters.forEach(item => {
      if (activeFilter.roles.size === item.data.roles.size && [...activeFilter.roles].every(value => item.data.roles.has(value)) &&
        activeFilter.organizations.size === item.data.organizations.size && [...activeFilter.organizations].every(value => item.data.organizations.has(value))) {
        setActiveFilter(item);
      }
    })
  }
  const handleSave = () => {
    if (activeFilter && activeFilter.filter_name === filterName) {
      if (!(filter.roles.size === activeFilter.data.roles.size && [...filter.roles].every(value => activeFilter.data.roles.has(value)) &&
        filter.organizations.size === activeFilter.data.organizations.size && [...filter.organizations].every(value => activeFilter.data.organizations.has(value)))) {
          dispatch(patchFilterRequest({id: activeFilter.id, filter_name: activeFilter.filter_name,
            newFilter: filter}));
      }

      setActiveFilter(filter);
    } else {
      postFilter(filterName ? filterName : 'filter set');
    }
  }

  const postFilter = (newFilterName) => {
      let isUnique = !!filter;
      userFilters.forEach(item => {
        if (filter.roles.size === item.data.roles.size && [...filter.roles].every(value => item.data.roles.has(value)) &&
          filter.organizations.size === item.data.organizations.size && [...filter.organizations].every(value => item.data.organizations.has(value))) {
          isUnique = false;
        }
      })
      if (isUnique) {
        dispatch(postFilterRequest({filter_name: newFilterName, data: filter}));
        setActiveFilter(filter);
        setFilterName(newFilterName);
      } else {
        toast.success(`You already have this filter set`);
        setFilterName('');
      }
  }

  const handleDelete = () => {
    if (activeFilter) {
      setIsDeleteModalOpen(true);
    }
  }

  const handleFilterDelete = () => {
    dispatch(deleteFilterRequest(activeFilter))
    handleChange(null, {action: 'clear'});
    setIsDeleteModalOpen(false);
  }

  const handleChange = (newValue, actionMeta) => {
    if (actionMeta.action === 'select-option') {
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

    if (actionMeta.action === 'create-option') {
      setFilterName(newValue.label);
      postFilter(newValue.label);
    }

    if (actionMeta.action === 'clear') {
      setActiveFilter(null);
      setFilterName('');
      initialFilter();
    }
  };

  let options = [];
  userFilters.forEach(item => options.push({value: item, label: item.filter_name}));

  const selectStyles = {
    container: styles => ({ ...styles, width: '320px', display: 'inline-block' }),
    menuList: styles => ({ ...styles, maxHeight: '165px' }),
  };

  return <span className={'saved-filters'}>
    <CreatableSelect
      isClearable
      onChange={handleChange}
      options={options}
      value={activeFilter ? undefined : filterName !== '' ? {label: filterName} : null}
      styles={selectStyles}
      placeholder={'Name of filter set'}
    />
    <span onClick={handleSave} className={'filter-save'}>
      <SaveIcon/>
    </span>
    <span onClick={handleDelete} className={'filter-remove-save'}>
      <CloseIcon/>
    </span>
    <span className={'unsaved'}>
      {activeFilter && activeFilter.data && !(activeFilter.data.roles.size === filter.roles.size && [...activeFilter.data.roles].every(value => filter.roles.has(value)) &&
      activeFilter.data.organizations.size === filter.organizations.size && [...activeFilter.data.organizations].every(value => filter.organizations.has(value)))
      && 'Unsaved'}
    </span>

    <Modal className={"organization-remove-modal"} isOpen={isDeleteModalOpen} fade={false} toggle={()=>{setIsDeleteModalOpen(false)}}>
        <ModalBody>
          <div>
            <span style={{fontSize: "22px"}}>
            Are you sure you want to delete filter set: {activeFilter && activeFilter.filter_name}?
          </span>
          </div>
          <div className={"organization-remove-modal_action-buttons"}>
            <Button className={"remove-button"} onClick={() => {handleFilterDelete()}}>
              Remove
            </Button>
            <Button className={"cancel-button"} onClick={() => {setIsDeleteModalOpen(false)}}>
              Cancel
            </Button>
          </div>
        </ModalBody>
      </Modal>
  </span>
}

export default SavedFilters;
