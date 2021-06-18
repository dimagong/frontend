import React, {useEffect, useState} from 'react'
import {Button, Card} from "react-bootstrap";
import Select from "react-select";
import {Col, ListGroup, ListGroupItem, Row} from "reactstrap";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import FilterOptionsDashboard from "./FilterOptionsDashboard";
import '../ContextSearchNav/styles.scss'
import {useSelector} from "react-redux";
import {selectOrganizations} from "app/selectors/groupSelector";
import {selectActivityTypes, selectDashboardDForms, selectManagers} from "app/selectors/userSelectors";

const FilterBox = ({isMap, settings, updateSettings, dForms, setIsFilterBoxOpen, isApplication, removeFilterPart, isFilterBoxOpen, filter, setFilter}) => {
  let roles = ['Admin', 'Corporation manager', 'Prospect', 'Suspect', 'Network manager', 'Member', 'Lead'].map(item => {return {name: item}})
  const [selectedOption, setSelectedOption] = useState('managers');
  const [selectValue, setSelectValue] = useState({active: false, label: ''});
  const [selectedDForm, setSelectDForm] = useState('');
  //const [filter, setFilter] = useState({Roles: [], Organizations: [], 'Activity types': [], Application: []})
  const [currTab, setCurrTab] = useState(isApplication ? 'Application': 'Activity types');
  const organizationsObjects = useSelector(selectOrganizations);
  const activityTypes = useSelector(selectActivityTypes);
  const managers = useSelector(selectManagers);
  const dashboardDForms = useSelector(selectDashboardDForms)
  const filterOptions = {Application: [], 'Activity types': activityTypes, Roles: roles, Organizations: organizationsObjects,}
  const styles = {
    marginBottom: 0
  }

  const handleChange = (newValue, actionMeta) => {
    if (actionMeta.action === 'select-option') {
      //setSelectDForm(newValue.value)
      let newFilter = {...filter}
      if (currTab === 'Application') {
        if (settings?.dForm?.name !== 'Applications Snapshot') {
          newFilter.Application = [newValue.value]
        } else {
          if (filter[currTab].findIndex(curr => curr.name === newValue.value.name) === -1) {
            newFilter[currTab].push(newValue.value)
          }
        }
      }
      else if (currTab === 'Activity types') {
        if (filter[currTab].findIndex(curr => curr.name === newValue.value.name) === -1) {
          newFilter[currTab].push(newValue.value)
        }
      }
      setFilter(newFilter);
    }

    if (actionMeta.action === 'clear') {
      setSelectDForm(null)
      let newFilter = {...filter}
      if (currTab === 'Application') {
        newFilter.Application = []
        setFilter(newFilter);
      }
    }
  };

  const selectStyles = {
    menuList: styles => ({ ...styles, maxHeight: '165px' }),
    container: styles => ({...styles, marginBottom: '20px'}),
  };

  const handleApplyFilter = () => {
    Object.keys(filter).forEach(item => {
      switch (item) {
        case 'Roles': {
          if (filter['Roles'].length > 0) {
            settings.ability_user_ids = [];
            filter['Roles'].forEach(role => {
              managers.forEach(item => {
                if (item?.permissions?.ability === role.name.toLowerCase().replace(' ', '_')) {
                  settings.ability_user_ids.push(item.id)
                }
              })
            })
          } else {
            settings.ability_user_ids = null;
          }
          break;
        }

        case 'Organizations': {
          if (filter['Organizations'].length > 0) {
            settings.user_groups = filter[item].map(item => {
              return {
                group_type: 'App\\' + item.type.charAt(0).toUpperCase() + item.type.slice(1),
                group_id: item.id
              }
            });
          } else {
            settings.user_groups = null;
          }
          break;
        }

        case 'Activity types': {
          if (filter['Activity types'].length > 0) {
            settings['filter[type]'] = 'action_type_id';
            settings['filter[value]'] = filter[item].map(type => type.id)
          } else {
            settings['filter[type]'] = null;
            settings['filter[value]'] = null
          }
          break;
        }

        case 'Application': {
          if (settings?.dForm?.name !== 'Applications Snapshot') {
            if (filter['Application'].length > 0) {
              settings.dForm = filter['Application'][0];
            } else {
              settings.dForm = null;
            }
          } else {
            let res = [];
            filter['Application'].forEach(item => {
              if (item.name !== 'Applications Snapshot')  {
                res = item.id.concat(res)
              }})
            settings.dForm = {name: 'Applications Snapshot', id: res}
          }

        }
      }
    });
    updateSettings(settings);
    setIsFilterBoxOpen(false);
  }

  const options = [];
  if (dForms) {
    Object.keys(dForms).forEach(item => {
      options.push({label: item, value: {id: dForms[item], name: item}})
    })
  }

  if (!isFilterBoxOpen) return <span/>;

  return ( <span style={ !isMap ? {left: 110, top: 65} :
      settings?.dForm?.name !== 'Applications Snapshot' ? {top: 30, right: 125, left: "unset"}
        : {top: 30, right: 40, left: "unset"}} className={'filter-box'}>
          <Card style={styles}>
              <ListGroup variant="flush">
                <ListGroupItem style={{textAlign: 'left'}} className={'filter-header'}>{isApplication ? 'Application filter' : 'Activities filter'}</ListGroupItem>
                <ListGroupItem>
                  <Row>
                    <Col className={'left'}>
                      {Object.keys(filterOptions).map(item =>
                        ((isApplication && item !== 'Activity types') || (!isApplication && item !== 'Application')) &&
                      <Button onClick={() => {setCurrTab(item)}} variant="secondary" className={currTab === item ? 'active' : 'not-active'}>
                        <span className={'filter-name'}>{item} ({filterOptions[item].length > 0 ? filterOptions[item].length : options.length})</span>
                        {currTab === item && <span className={'filter-right'}><ArrowForwardIosIcon/></span>}
                      </Button>
                      )}

                    </Col>
                    <Col className={'right'} id={'filter-options-right'} style={{paddingLeft: 0}}>
                      <span>
                        {currTab === 'Application'
                          && <Select
                              className="basic-single"
                              classNamePrefix="select"
                              isSearchable
                              name="Choose application"
                              options={dForms ? options : []}
                              onChange={handleChange}
                              styles={selectStyles}
                              value={(isApplication && settings?.dForm?.name !== 'Applications Snapshot')
                                ? filter['Application'].length > 0 ?{label: filter['Application'][0].name} : undefined
                                : {label: settings.dForm.name}}
                              placeholder={'Choose application'}
                            />}
                        {currTab === 'Activity types'
                          && <Select
                              className="basic-single"
                              classNamePrefix="select"
                              isSearchable
                              name="Choose activity type"
                              options={activityTypes ? activityTypes.map(item => {return {label: item.name, value: item}}) : []}
                              onChange={handleChange}
                              styles={selectStyles}
                              value={{label: 'Choose activity type'}}
                              placeholder={'Choose activity type'}
                            />}
                          <FilterOptionsDashboard
                            currTab={currTab}
                            list={currTab !== 'Application' ? filterOptions[currTab] : options.map(item => item.value)}
                            filter={filter}
                            setFilter={setFilter}
                            isSnapshot={!(settings?.dForm?.name !== 'Applications Snapshot')}
                          />
                      </span>
                    </Col>
                  </Row>
                </ListGroupItem>
                <ListGroupItem>
                  <div className={'filter-footer'}>
                    <Button variat="success" onClick={handleApplyFilter}>Apply filter</Button>
                  </div>
                  </ListGroupItem>
              </ListGroup>
          </Card>
      </span>
  )
}

export default FilterBox