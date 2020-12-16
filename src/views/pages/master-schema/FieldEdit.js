import React, {useEffect, useState} from "react";
import {Col, FormGroup, Input, Label, Button, InputGroup, InputGroupAddon} from "reactstrap";
import masterSchemaService from './services/masterSchema.service'
import {isEmpty} from "lodash";
import Select from "react-select";

export default function FieldEdit({data, onChange, groupsList}) {

  const [field, setField] = useState({});
  const [parentGroup, setParentGroup] = useState({});

  useEffect(() => {
    setField(data);
  }, [data]);
  useEffect(() => {
    let tempParentGroup = getGroupSelectOptions().find((nextGroup) => {
      return nextGroup.value.id === field.master_schema_group_id;
    });
    setParentGroup(tempParentGroup);
  }, [field]);

  const fieldSave = async () => {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await masterSchemaService.updateField(field);
        const updatedField = response.data.data;
        setField(updatedField);
        resolve(updatedField);
      } catch (exception) {
        reject();
        console.log(exception);
      }
    });
  };

  const fieldDelete = async () => {
    try {
      const response = await masterSchemaService.deleteField(field);
      onChange(null);
    } catch (exception) {
      console.log(exception);
    }
  };

  const handleChangeParent = async () => {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await masterSchemaService.masterSchemaFieldMakeParent(field.id, parentGroup.value.id);
        resolve(response.data.data);
      } catch (exception) {
        reject();
        console.log(exception);
      }
    });
  };

  if (!field) {
    return <div></div>;
  }

  const getElementDist = () => {
    if (!Array.isArray(field.path)) {
      return '';
    }
    let path = field.path.slice();
    path.pop();
    return path.join('.') + '.';
  };

  const getGroupSelectOptions = () => {
    return groupsList.map(group => {
      return {
        label: group.path.join('.'),
        value: group
      }
    });
  };

  const saveData = async () =>{
    let updatedField = await fieldSave();
    updatedField = await handleChangeParent();
    onChange(updatedField);
  };

  return <div>
    <Label>Element name</Label>
    <InputGroup>
      <InputGroupAddon addonType="prepend">{getElementDist()}</InputGroupAddon>
      <Input
        value={field.name}
        onChange={(event) => {
          setField({...field, name: event.target.value})
        }}
      />
    </InputGroup>
    <Label>Parent category</Label>
    {
      isEmpty(groupsList) || !field ? null :
        <Select
          id="select-ms-property"
          options={getGroupSelectOptions()}
          value={parentGroup}
          onChange={(event) => setParentGroup(event)}
          onInputChange={(event) => {

          }}></Select>
    }

    <div className="d-flex justify-content-between mt-1">
      <Button.Ripple outline onClick={() => {
        window.confirm('Are you sure?') && fieldDelete()
      }} color="danger">Delete</Button.Ripple>
      <Button.Ripple outline onClick={() => {
        saveData();
      }} color="primary">Save</Button.Ripple>
    </div>

  </div>
}
