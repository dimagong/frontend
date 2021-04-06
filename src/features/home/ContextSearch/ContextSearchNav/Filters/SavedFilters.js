import React, {useState} from 'react'
import CloseIcon from '@material-ui/icons/Close';
import {Dropdown, SplitButton} from "react-bootstrap";
import SaveIcon from "@material-ui/icons/Save";
import {useDispatch, useSelector} from "react-redux";
import {selectProfile} from "app/selectors";
import appSlice from "app/slices/appSlice";
const {postFilterRequest, deleteFilterRequest, patchFilterRequest} = appSlice.actions;

const SavedFilters = ({ userFilters, filter, setFilter, initialFilter, changeFooter }) => {
  const [initialization, setInitialization] = useState(false);
  const [savedFilters, setSavedFilters] = useState([]);
  const [activeFilter, setActiveFilter] = useState();
  const profile = useSelector(selectProfile);
  const dispatch = useDispatch();
  if (!initialization && userFilters.length > 0 && userFilters.length !== savedFilters.length) {
    let filters = userFilters.filter(item => item.user_id === profile.id);
    setSavedFilters(filters);
    setInitialization(true);
  }

  const handleSave = () => {
    let filter_name = document.getElementById('filter-set-name').value;
    if (activeFilter && activeFilter.filter_name === filter_name) {
      try{
        dispatch(patchFilterRequest({id: activeFilter.id, filter_name: activeFilter.filter_name,
                                     newFilter: filter}));
      } catch (err) { dispatch(patchFilterRequest({id: activeFilter.id, filter_name: activeFilter.filter_name,
        newFilter: filter})); }
    } else {
      if (!filter_name) {
        filter_name = 'saved filter';
      }
      try {
        dispatch(postFilterRequest({filter_name: filter_name, data: filter}));
      } catch (err) { console.log(err) }
      setInitialization(false);
    }
  }

  const handleDisable = () => {
    document.getElementById('filter-set-name').value = null;
    setActiveFilter(null);
    initialFilter();
  }

  const makeActive = (newFilter) => {
    document.getElementById('filter-set-name').value = newFilter.filter_name;
    setActiveFilter(newFilter);
    setFilter(newFilter.data);
    changeFooter(newFilter.data);
  }

  const handleDelete = (del) => {
    console.log('del', del);
    try {
      dispatch(deleteFilterRequest(del.id))
    } catch (err) { console.log(err) }
    if (savedFilters.length === 1) {
      setSavedFilters([]);
    } else {
      setInitialization(false);
    }
  }

  return <span className={'saved-filters'}>
    <SplitButton drop='down' id={`dropdown-button-drop-down`}
                 title={<input id={'filter-set-name'} type={'text'} placeholder={'Name of the filter set'}/>}>
      {savedFilters.length > 0 ?
        savedFilters.map(item => <Dropdown.Item>
          <span className={'filter-name'} onClick={() => makeActive(item)}>{item.filter_name}</span>
          <span className={'right-col'}><span className={'delete-filter'} onClick={() => handleDelete(item)}><CloseIcon/></span></span>
        </Dropdown.Item>) :
        <Dropdown.Item>You do not have any saved filter sets</Dropdown.Item>
      }
    </SplitButton>
    <span onClick={handleSave} className={'filter-save'}><SaveIcon/></span>
    <span onClick={handleDisable} className={'filter-remove-save'}><CloseIcon/></span>
  </span>
}

export default SavedFilters;
