import React, {useEffect} from 'react'
import Select, {components} from "react-select"
import {Plus} from "react-feather"
import {colourStyles} from "utility/select/selectSettigns";
import {prepareSelectOptions, prepareNotNestedSelectOptions, normalizeGroups} from "utility/select/prepareSelectData";
import _ from "lodash";
import {useDispatch, useSelector} from "react-redux";
import {
  getGroupsRequest,
} from "app/slices/appSlice";
import {selectGroups} from 'app/selectors/groupSelector'

export const DropdownIndicator = props => {
  return components.DropdownIndicator && (
    <components.DropdownIndicator {...props}>
      {/* <FontAwesomeIcon icon={props.selectProps.menuIsOpen ? "caret-up" : "caret-down"}/> */}
      <Plus className="plus-select" size={15}/>
    </components.DropdownIndicator>
  )
};

export const MultiSelect = ({groups: selectedGroups, setGroups, single}) => {
  const initGroups = useSelector(selectGroups) || [];
  // const groups = prepareSelectOptions(initGroups);
   const groups = prepareNotNestedSelectOptions(initGroups);
  const dispatch = useDispatch();

// TODO: remove choosen options for select options
  const filtredSelectOptions = () => {
    return groups
      .filter(groupSelect => !selectedGroups
        .some(group => group.value.group_id === groupSelect.value.group_id && group.value.type === groupSelect.value.type))
  };

  useEffect(() => {
    !groups.length && dispatch(getGroupsRequest())
  }, []);
// TODO: set groups in to parrent component
  const onSelectGroupsChange = (values) => {
    if(single) {
      values = [values]
    }
    values ? dispatch(setGroups(normalizeGroups(initGroups).filter(group => values.some(value => value.label === group.name)))) : dispatch(setGroups([]))
  };
  return (
    <div className="d-flex mb-1">
      <div className="font-weight-bold column-sizing" style={{padding: 4}}>Organisations</div>
      <div className="w-100">
        <Select
          components={{DropdownIndicator: null,}}
          value={selectedGroups}
          maxMenuHeight={200}
          isMulti={!single}
          isClearable={false}
          styles={colourStyles}
          options={filtredSelectOptions()}
          onChange={(values) => {
            onSelectGroupsChange(values)
          }}
          classNamePrefix="select"
          id="languages"
        />
      </div>
    </div>
  )
};

export default MultiSelect
