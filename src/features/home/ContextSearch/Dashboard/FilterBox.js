import React, {useEffect, useState} from 'react'
import {Button, Card} from "react-bootstrap";
import Select from "react-select";

const FilterBox = ({isMap, settings, updateSettings, dForms, setIsFilterBoxOpen}) => {
  const [selectedOption, setSelectedOption] = useState('managers');
  const [selectValue, setSelectValue] = useState({active: false, label: ''});
  const [selectedDForm, setSelectDForm] = useState('');
  const styles = !isMap ? {
    position: 'absolute',
    top: '60px',
    left: '100px',
    zIndex: 10,
    width: '20vw',
  } : {
    position: 'absolute',
    top: '30px',
    left: '-350px',
    zIndex: 10,
    width: '20vw',
  }

  const handleChange = (newValue, actionMeta) => {
    if (actionMeta.action === 'select-option') {
      setSelectDForm(newValue.value)
    }

    if (actionMeta.action === 'clear') {
      setSelectDForm(null)
    }
  };

  const selectStyles = {
    menuList: styles => ({ ...styles, maxHeight: '165px' }),
  };

  const handleApply = () => {
    settings.dForm = selectedDForm;
    updateSettings(settings);
    setIsFilterBoxOpen(false);
  }

  const handleChangeType = (newType) => {
    if (newType !== selectedOption) {
      setSelectedOption(newType);
      setSelectValue({active: !selectValue.active, label: selectValue.label})
    }
  }

   useEffect(() => {
    setSelectDForm(settings.dForm);
  }, [settings]);
  const options = dForms.map(item => {return {label: item.d_form.name, value: item.d_form}});
  return (
    <Card
      style={styles}
    >
      <Card.Body>
        <Card.Title>Application dashboard filter</Card.Title>
        <Card.Text>
          You can choose the application to be shown on the chart.
        </Card.Text>
        <Select
          className="basic-single"
          classNamePrefix="select"
          isClearable
          isSearchable
          name="Choose application"
          options={dForms ? options : []}
          onChange={handleChange}
          styles={selectStyles}
          value={selectedDForm ? {label: selectedDForm.name} : undefined}
          placeholder={'Choose application'}
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
