import React, {useEffect} from 'react'
import {
    Col,
  } from "reactstrap"
  import Select, {components} from "react-select"
import {DropdownIndicator} from 'components/MultiSelect/multiSelect'
import {colourStyles, colorMultiSelect} from "utility/select/selectSettigns";
import {  getRolesRequest, getGroupsRequest, getModulesRequest, setUserGroups,
    setUserModules,
    setUserRoles, } from "app/slices/appSlice";
import { useDispatch, useSelector } from "react-redux";
import { selectGroups, selectRoles, selectModules, selectManager } from "app/selectors";
import {groupTypes} from 'constants/group'
import MultiSelect from "components/MultiSelect/multiSelect";
import {prepareSelectOptions, normalizeGroups, getGroupName} from "utility/select/prepareSelectData";

const UserEditSelects = () => {
    const groups = useSelector(selectGroups);
    const roles = useSelector(selectRoles);
    const modules = useSelector(selectModules);
  const manager = useSelector(selectManager);
  const dispatch = useDispatch();

    useEffect(()=>{
        !roles.length && dispatch(getRolesRequest());
        !groups.length && dispatch(getGroupsRequest());
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
        dispatch(setUserRoles([]))
    }


    const onSelectModulesChange = (values) => {
        dispatch(setUserModules([]))
        
    }
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
                        <MultiSelect groups={prepareSelectGroups(manager.groups)} setGroups={setUserGroups}/>
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
