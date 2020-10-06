import React, { useEffect } from 'react'
import Select, {components} from "react-select"
import { Plus } from "react-feather"
import {colourStyles} from "utility/select/selectSettigns";
import {prepareSelectOptions, normalizeGroups} from "utility/select/prepareSelectData";
import _ from "lodash";
import { useDispatch, useSelector } from "react-redux";
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
  }

export const MultiSelect = ({groups:  selectedGroups, setGroups}) =>  {
const initGroups = useSelector(selectGroups) || []
const groups = prepareSelectOptions(initGroups)
  const dispatch = useDispatch();
    
// TODO: remove choosen options for select options
    const filtredSelectOptions = () => {
      return groups
      .filter( groupSelect => !selectedGroups
        .some( group =>  group.value.group_id === groupSelect.value.group_id && group.value.type === groupSelect.value.type ))
    }

    useEffect(()=>{
      !groups.length && dispatch(getGroupsRequest())
    },[])
    // console.log("initGroups", initGroups)
    // console.log("normalizeGroups", normalizeGroups(initGroups))
// TODO: set groups in to parrent component
      const onSelectGroupsChange = (values) => {
        values ? dispatch(setGroups(normalizeGroups(initGroups).filter( group => values.some( value => value.label === group.name)))) : dispatch(setGroups([]))
      };

    return (
          <div className="d-flex mb-1">
            <div className="font-weight-bold column-sizing" style={{padding: 5}}>Organisations</div>
                <div className="w-100">
                    <Select
                        components={{DropdownIndicator}}
                        value={selectedGroups}
                        maxMenuHeight={200}
                        isMulti
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
}

export default MultiSelect
