import React, {useEffect, useState} from 'react'
import masterSchemaService from "./services/masterSchema.service";
import {Button, CardBody, FormGroup, Input, InputGroup, InputGroupAddon, Label} from "reactstrap";
import {isObject} from "lodash";

export default function GroupCreate({data, onNewGroup}) {

  const [newGroup, setNewGroup] = useState({});
  const [selectedElement, setSelectedElement] = useState({});

  useEffect(() => {
    setSelectedElement(data);
  }, [data]);

  const onAddNewGroup = async () => {
    try {
      let parentGroupId = -1;

      // is category
      if('children' in selectedElement) {
        parentGroupId = selectedElement.id;
      } else {
        // is field
        parentGroupId = selectedElement.master_schema_group_id;
      }
      const response = await masterSchemaService.addGroup({...newGroup, parent_id: parentGroupId});
      onNewGroup(response.data.data);
      setNewGroup({
        name: ''
      });
    } catch (exception) {
      console.log(exception);
    }

  };

  const getElementDist = () => {
    if(!Array.isArray(selectedElement.path)) {
      return '';
    }

    let path = selectedElement.path.slice();

    // is category
    if('children' in selectedElement) {
      return path.join('.') + '.';
    } else {
      // is field
      path.pop();
      return path.join('.') + '.';
    }
  };


  return <div>
    <Label>Category name</Label>
    <InputGroup>
      <InputGroupAddon addonType="prepend">{getElementDist()}</InputGroupAddon>
      <Input
        value={newGroup.name}
        onChange={(event) => {
          setNewGroup({...newGroup, name: event.target.value})
        }}
      />
    </InputGroup>

    <div className="d-flex justify-content-between mt-1">
      <Button.Ripple outline  onClick={() => {
        setNewGroup({
          name: ''
        });
      }} color="light">Clear</Button.Ripple>
      <Button.Ripple outline  onClick={onAddNewGroup} color="primary">Add category</Button.Ripple>
    </div>
  </div>
}
