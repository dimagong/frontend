import React from 'react'
import CloseIcon from '@material-ui/icons/Close';
import SaveIcon from "@material-ui/icons/Save";
import {useDispatch} from "react-redux";
import appSlice from "app/slices/appSlice";
import {toast} from "react-toastify";
import CreatableSelect from "react-select/creatable";
const {postFilterRequest, deleteFilterRequest, patchFilterRequest} = appSlice.actions;

const SavedFilters = ({ userFilters, filter, setFilter, initialFilter, changeFooter, activeFilter, setActiveFilter, filterName, setFilterName }) => {
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
      try{
        dispatch(patchFilterRequest({id: activeFilter.id, filter_name: activeFilter.filter_name,
                                     newFilter: filter}));
        setActiveFilter(filter);
      } catch (err) {
        //TODO temporary fix
        dispatch(patchFilterRequest({id: activeFilter.id, filter_name: activeFilter.filter_name,
        newFilter: filter}));
        setActiveFilter(filter);
      }
      toast.success(`The filter set '${filterName}' was updated`);
    } else {
      postFilter(filterName ? filterName : 'filter set');
    }
  }

  const postFilter = (newFilterName) => {
    try {
      let isUnique = !!filter;
      userFilters.forEach(item => {
        if (filter.roles.size === item.data.roles.size && [...filter.roles].every(value => item.data.roles.has(value)) &&
          filter.organizations.size === item.data.organizations.size && [...filter.organizations].every(value => item.data.organizations.has(value))) {
          isUnique = false;
        }
      })
      if (isUnique) {
        dispatch(postFilterRequest({filter_name: newFilterName, data: filter}));
        toast.success(`The filter set '${newFilterName}' was added`);
        setActiveFilter(filter);
      }
    } catch (err) { console.log(err) }
  }

  const handleDelete = () => {
    if (activeFilter) {
      if (!window.confirm(`Are you sure you want to delete filter set: ${activeFilter.filter_name}?`)) {
        return;
      }
      try {
        dispatch(deleteFilterRequest(activeFilter.id))
      } catch (err) {
        console.log(err)
      }
      handleChange(null, {action: 'clear'});
    }
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
  return <span className={'saved-filters'}>
    <CreatableSelect
      isClearable
      onChange={handleChange}
      options={options}
      value={filterName !== '' ? {label: filterName} : null}
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
  </span>
}

export default SavedFilters;
