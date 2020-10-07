import React, {useEffect} from 'react'
import {
    Col,
  } from "reactstrap"
  import Select, {components} from "react-select"
import {DropdownIndicator} from 'components/MultiSelect/multiSelect'
import {colourStyles, colorMultiSelect} from "utility/select/selectSettigns";
import {  
    getRolesRequest, 
    getGroupsRequest, 
    getModulesRequest, 
    setUserGroups,
    setUserModules, 
    updateUserRolesRequest,
    setUserRoles,
    updateUserGroupsRequest ,
    updateUserModulesRequest
  } from "app/slices/appSlice";
import { useDispatch, useSelector } from "react-redux";
import { selectGroups, selectRoles, selectModules, selectManager } from "app/selectors";
import {groupTypes} from 'constants/group'
import {prepareSelectOptions, normalizeGroups, getGroupName} from "utility/select/prepareSelectData";

const UserEditSelects = () => {
    const groups = useSelector(selectGroups);
    const roles = useSelector(selectRoles);
    const modules = useSelector(selectModules);
    const manager = useSelector(selectManager);
    const dispatch = useDispatch();

    useEffect(()=>{
        
        !modules.length && dispatch(getModulesRequest());
      },[])

      
    const prepareModulesSelect = (modules) => {
        return modules.map((value) => {
          return {
            value: value,
            label: value["name"],
            color: colorMultiSelect
          };
        });
      } 
  
    const prepareRolesSelect = (roles) => {
       return roles.map((role) => {
            return {
              value: role,
              label: role,
              color: colorMultiSelect
            }
          })
    }

    const onSelectRolesChange = (values) => {
        values 
        ? dispatch(updateUserRolesRequest({id: manager.id, roles : roles.filter( role =>  values.some(value => value.value === role))})) 
        : dispatch(updateUserRolesRequest({id: manager.id, roles :[]}))
    }


    const onSelectModulesChange = (values) => {
      values 
      ? dispatch(updateUserModulesRequest({...manager, modules : modules.filter( module =>  values.some(value => value.value.id === module.id))})) 
      : dispatch(updateUserModulesRequest({...manager, modules :[]}))
        
    }

    const onSelectGroupsChange = (values) => {
      values 
      ? dispatch(updateUserGroupsRequest({id: manager.id, groups: normalizeGroups(groups).filter( group => values.some( value => value.label === group.name))})) 
      : dispatch(updateUserGroupsRequest({id: manager.id, groups:[]}))
    };

    const prepareSelectGroups  = selectedGroups => {
      return selectedGroups.map(group => {
        return {
          value: {
            group_id: group.group_id,
            type: groupTypes[group.group_type]
          },
          label: getGroupName(groups, group.group_id, groupTypes[group.group_type]),
          color: colorMultiSelect
        }
      });
    }

    const filtredSelectOptions = () => {
      return prepareSelectOptions(groups)
      .filter( groupSelect => !prepareSelectGroups(manager.groups)
        .some( group =>  group.value.group_id === groupSelect.value.group_id && group.value.type === groupSelect.value.type ))
    }

    return roles.length && groups.length &&  modules.length  ? (
        <Col md="12" lg="6" className="mt-md-2 mt-lg-0 mb-sm-2">
                      <div className="user-managment__edit_body_form__select-wrapper">
                        <div className="user-managment__edit_body_form__select mb-1">
                          <div className="font-weight-bold column-sizing">Roles</div>
                          <div className="full-width">
                            <Select
                              components={{DropdownIndicator}}
                              value={prepareRolesSelect(manager.roles)}
                              maxMenuHeight={200}
                              isMulti
                              isClearable={false}
                              styles={colourStyles}
                              options={prepareRolesSelect(roles)}
                              className="fix-margin-select"
                              onChange={(values) => {
                                onSelectRolesChange(values)
                              }}
                              classNamePrefix="select"
                              id="languages"
                            />
                          </div>
                        </div>
                        <div className="d-flex mb-1">
                          <div className="font-weight-bold column-sizing" style={{padding: 5}}>Organisations</div>
                              <div className="w-100">
                                  <Select
                                      components={{DropdownIndicator}}
                                      value={prepareSelectGroups(manager.groups)}
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
                        <div className="user-managment__edit_body_form__select">
                          <div className="font-weight-bold column-sizing">Modules</div>
                          <div className="full-width">
                            <Select
                              disabled={true}
                              components={{DropdownIndicator: null}}
                              value={prepareModulesSelect(manager.modules)}
                              maxMenuHeight={200}
                              isMulti
                              isClearable={false}
                              styles={colourStyles}
                              options={prepareModulesSelect(modules)}
                              className="fix-margin-select"
                              onChange={(values) => {
                                onSelectModulesChange(values)
                              }}
                              classNamePrefix="select"
                              id="languages"
                            />
                          </div>
                        </div>
                      </div>
                    </Col>
    ) : null
}

export default UserEditSelects
