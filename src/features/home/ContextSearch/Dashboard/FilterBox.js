import React, {useState} from 'react'
import {Nav, Button, Card} from "react-bootstrap";
import Select from "react-select";
import {useDispatch, useSelector} from "react-redux";
import {selectActivityTypes} from "app/selectors/userSelectors";
import appSlice from "app/slices/appSlice";

const { getDashboardDataRequest } = appSlice.actions;

const FilterBox = ({ managers, filter, setFilter, setIsFilterBoxOpen, setIsFilterTagOpen, setTabLabel }) => {
  const dispatch = useDispatch();
  const [selectedOption, setSelectedOption] = useState('managers');
  const [selectValue, setSelectValue] = useState({active: false, label: ''});
  const activityTypes = useSelector(selectActivityTypes)
  const styles = {
    position: 'absolute',
    top: '45px',
    left: '185px',
    zIndex: 10,
    width: '20vw',
  }

  const handleChange = (newValue, actionMeta) => {
    if (actionMeta.action === 'select-option') {
      if (selectedOption === 'managers') {
        setFilter({type: 'user_id', value: newValue.value.id,
        label:newValue.value.first_name + ' ' +  newValue.value.last_name})
        setSelectValue({active: true, label: newValue.value.first_name + ' ' +  newValue.value.last_name})
      } else {
        setFilter({type: 'action_type_id', value: newValue.value.id,
        label:newValue.value.name});
        setSelectValue({active: true, label: newValue.value.name})

      }
    }

    if (actionMeta.action === 'clear') {
      setFilter(null)
    }
  };

  const selectStyles = {
    menuList: styles => ({ ...styles, maxHeight: '165px' }),
  };


  const managersData = [];
  managers.forEach(item => managersData.push({label: item.first_name + ' ' + item.last_name, value: item}))
  const activityData = [];
  activityTypes.forEach(item => activityData.push({label: item.name, value: item}))

  const handleApply = () => {
    if (filter?.type) {
      dispatch(getDashboardDataRequest({page: 1, filter: filter}))
      setIsFilterBoxOpen(false);
      setIsFilterTagOpen(true);
      setTabLabel(selectValue.label)
    } else {
      setIsFilterTagOpen(false);
      setIsFilterBoxOpen(false);
      setTabLabel(undefined)
    }
  }

  const handleChangeType = (newType) => {
    if (newType !== selectedOption) {
      setSelectedOption(newType);
      setSelectValue({active: !selectValue.active, label: selectValue.label})
    }
  }

  return (
    <Card
      style={styles}
    >
      <Card.Header>
        <Nav variant="tabs" defaultActiveKey="#managers" style={{width: '100%'}}>
          <Nav.Item style={{width: '50%', textAlign: 'center'}}>
            <Nav.Link onSelect={() => handleChangeType('managers')} href="#managers">Managers</Nav.Link>
          </Nav.Item>
          <Nav.Item style={{width: '50%', textAlign: 'center'}}>
            <Nav.Link onSelect={() => handleChangeType('activities')} href="#activities">Activity types</Nav.Link>
          </Nav.Item>
        </Nav>
      </Card.Header>
      <Card.Body>
        <Card.Title>Filter activities dashboard</Card.Title>
        <Card.Text>
          You can filter actions that is shown on the activities dashboard by selecting {selectedOption}
        </Card.Text>
        <Select
          className="basic-single"
          classNamePrefix="select"
          isClearable
          isSearchable
          name="Filter by"
          options={selectedOption === 'managers' ? managersData : activityData}
          onChange={handleChange}
          styles={selectStyles}
          value={filter?.label ? filter : undefined}
          placeholder={`Name of ${selectedOption} to filter`}
        />
        <div style={{marginTop: '20px'}}>
          <Button onClick={() => setIsFilterBoxOpen(false)} style={{float: 'left'}} variant="secondary">Cancel</Button>
          <Button onClick={handleApply} style={{float: 'right'}} variant="primary">Apply</Button>
        </div>
      </Card.Body>
    </Card>
  )
}

export default FilterBox
