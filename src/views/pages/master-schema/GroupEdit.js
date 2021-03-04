import React, {useEffect, useState} from "react";
import masterSchemaService from './services/masterSchema.service'
import {
  Input,
  UncontrolledCollapse,
  Label,
  Button,
  CardTitle,
  CardHeader,
  CardBody,
  Card,
  InputGroup, InputGroupAddon
} from "reactstrap";
import Select from "react-select"
import {isEmpty} from 'lodash'

export default function GroupEdit({data, onChange, groupsList}) {

  const [group, setGroup] = useState({});
  const [parentGroup, setParentGroup] = useState({});

  useEffect(() => {
    setGroup(data);
  }, [data]);

  useEffect(() => {
    let tempParentGroup = getGroupSelectOptions().find((nextGroup) => {
      return nextGroup.value.id === group.parent_id;
    });
    setParentGroup(tempParentGroup);
  }, [group]);

  const groupSave = async () => {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await masterSchemaService.updateGroup(group);
        setGroup(response.data.data);
        resolve(response.data.data);
      } catch (exception) {
        reject();
        console.log(exception);
      }
    });
  };

  const groupDelete = async () => {
    try {
      const response = await masterSchemaService.deleteGroup(group);
      onChange(null);
    } catch (exception) {
      console.log(exception);
    }
  };

  const handleChangeParent = async () => {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await masterSchemaService.masterSchemaGroupMakeParent(group.id, parentGroup.value.id);
        resolve(response.data.data);
      } catch (exception) {
        reject();
        console.log(exception);
      }
    });
  };

  const getElementDist = () => {
    if (!Array.isArray(group.path)) {
      return '';
    }
    let path = group.path.slice();
    path.pop();
    if (!path.length) {
      path.push('Root');
    }
    return path.join('.') + '.';
  };

  if (!group) {
    return <div></div>;
  }

  const getGroupSelectOptions = () => {
    return groupsList.map(group => {
      return {
        label: group.path.join('.'),
        value: group
      }
    });
  };

  const saveData = async () => {
    let updatedGroup;
    try {
      updatedGroup = await groupSave();
      updatedGroup = await handleChangeParent();
      onChange(updatedGroup);
    } catch (exception) {
      if(updatedGroup) {
        onChange(updatedGroup);
      }
      console.log(exception);
    }
  };

  return <div>
    <Label>Category name</Label>
    <InputGroup>
      <InputGroupAddon addonType="prepend">{getElementDist()}</InputGroupAddon>
      <Input
        value={group.name}
        onChange={(event) => {
          setGroup({...group, name: event.target.value})
        }}
      />
    </InputGroup>

    {
      group.parent_id ? <div>
        <Label>Parent category</Label>
        {
          isEmpty(groupsList) || !group ? null :
            <Select
              id="select-ms-property"
              options={getGroupSelectOptions()}
              value={parentGroup}
              onChange={(event) => setParentGroup(event)}
              onInputChange={(event) => {

              }}></Select>
        }
      </div> : null
    }


    <div className="d-flex justify-content-between mt-1">
      <Button.Ripple outline onClick={() => {
        window.confirm('Are you sure?') && groupDelete()
      }} color="danger">Delete</Button.Ripple>
      <Button.Ripple outline onClick={() => {
        saveData();
      }} color="primary">Save</Button.Ripple>
    </div>

  </div>
};
