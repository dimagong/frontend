import React, { Component } from 'react'
import Select, {components} from "react-select"
import { Plus } from "react-feather"
import {colourStyles} from "utility/select/selectSettigns";
import GroupService from 'services/group.service'
import {prepareSelectData} from "utility/select/prepareSelectData";
import _ from "lodash";

const colorMultiSelect = '#007bff'; //#7367f0

const DropdownIndicator = props => {
    return components.DropdownIndicator && (
      <components.DropdownIndicator {...props}>
        {/* <FontAwesomeIcon icon={props.selectProps.menuIsOpen ? "caret-up" : "caret-down"}/> */}
        <Plus className="plus-select" size={15}/>
      </components.DropdownIndicator>
    )
  }

export class MultiSelect extends Component {

    state = {
        selectOptions: {
            groups: [],
          },
        groups: [],
        
    }

    updateOptions = () => {
      const groups = this.state.selectOptions.groups
      .filter( groupSelect => !this.state.groups
        .some( group =>  group.value.group_id === groupSelect.value.group_id && group.value.type === groupSelect.value.type ))
        return groups
    }

    componentDidMount() {
      this.getGroups();
      this.setState({groups: this.props.groups.map(group => {
        return {
              value: {
                group_id: group.id,
                type: group.type
              },
              label: group.name,
              color: colorMultiSelect
            }
      })})
      }

      componentDidUpdate(prevProps, prevState){
      if(!_.isEqual(prevProps.groups, this.props.groups) ){
          this.setState({groups:this.props.groups.map(group => {
            return {
                  value: {
                    group_id: group.id,
                    type: group.type
                  },
                  label: group.name,
                  color: colorMultiSelect
                }
          })})
          
        }
     
      }
    
    getGroups = async () => {
        const response = await GroupService.getAll();
        const groups = response.data.data;
    
        this.groups = groups;
        const multiSelectGroups = prepareSelectData(groups)
    
        this.setState({...this.state, selectOptions: {...this.state.selectOptions, groups: multiSelectGroups}})
      }

    onSelectGroupsChange = (values) => {
        this.setState({ groups: values })
      };

    getMultiSelectState = () => {
        return this.state.groups.map(select => select.value);
    }
    render() {
    console.log('this.state.groups', this.state.groups)
    return (
            <div className="d-flex mb-1">
            <div className="font-weight-bold column-sizing" style={{padding: 5}}>Organisations</div>
                <div className="w-100">
                    <Select
                        components={{DropdownIndicator}}
                        value={this.state.groups}
                        maxMenuHeight={200}
                        isMulti
                        isClearable={false}
                        styles={colourStyles}
                        options={this.updateOptions()}
                        onChange={(values) => {
                            this.onSelectGroupsChange(values)
                        }}
                        classNamePrefix="select"
                        id="languages"
                        />
                </div>
            </div>
        )
    }
}

export default MultiSelect
