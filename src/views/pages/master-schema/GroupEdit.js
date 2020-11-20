import React, {useEffect, useState} from "react";
import masterSchemaService from './services/masterSchema.service'
import {Input, UncontrolledCollapse, Label, Button, CardTitle, CardHeader, CardBody, Card} from "reactstrap";

export default function GroupEdit({data, onChange, onNewGroup, onNewField}) {

  const [group, setGroup] = useState({});
  const [newField, setNewField] = useState({});
  const [newGroup, setNewGroup] = useState({});

  useEffect(() => {
    setGroup(data);
  }, [data]);

  const groupSave = async () => {
    try {
      const response = await masterSchemaService.updateGroup(group);
      setGroup(response.data.data);
      onChange(response.data.data);
    } catch (exception) {
      console.log(exception);
    }
  };

  const groupDelete = async () => {
    try {
      const response = await masterSchemaService.deleteGroup(group);
      onChange(null);
    } catch (exception) {
      console.log(exception);
    }
  };

  if (!group) {
    return <div></div>;
  }

  const onAddNewGroup = async () => {
    try {
      const response = await masterSchemaService.addGroup({...newGroup, parent_id: group.id});
      onNewGroup(response.data.data);
      setNewGroup({
        name: ''
      });
    } catch (exception) {
      console.log(exception);
    }

  };

  const onAddNewField = async () => {
    try {
      const response = await masterSchemaService.addField({...newField, master_schema_group_id: group.id});
      onNewField(response.data.data);
      setNewField({
        name: ''
      });
    } catch (exception) {
      console.log(exception);
    }
  };

  return <div>
    <Label>Name</Label>
    <Input
      value={group.name}
      onChange={(event) => {
        setGroup({...group, name: event.target.value})
      }}
    />
    <div className="collapse-bordered vx-collapse collapse-icon accordion-icon-rotate collapse-border mt-1">
      <Card>
        <CardHeader id="item-1">
          <CardTitle className="collapse-title collapsed">
            Add group
          </CardTitle>
        </CardHeader>
        <UncontrolledCollapse toggler="#item-1">
          <CardBody>
            <Input
              value={newGroup.name}
              onChange={(event) => {
                setNewGroup({...newGroup, name: event.target.value})
              }}
            />
            <div className="d-flex justify-content-between mt-1">
              <Button onClick={onAddNewGroup} color="success">Add group</Button>
              <Button onClick={() => {
                setNewGroup({
                  name: ''
                });
              }} color="light">Clear</Button>
            </div>
          </CardBody>
        </UncontrolledCollapse>
      </Card>
      <Card>
        <CardHeader id="item-2">
          <CardTitle className="collapse-title collapsed">
            Add field
          </CardTitle>
        </CardHeader>
        <UncontrolledCollapse toggler="#item-2">
          <CardBody>
            <Input
              value={newField.name}
              onChange={(event) => {
                setNewField({...newField, name: event.target.value})
              }}
            />
            <div className="d-flex justify-content-between mt-1">
              <Button onClick={onAddNewField} color="success">Add field</Button>
              <Button onClick={() => {
                setNewField({
                  name: ''
                });
              }} color="light">Clear</Button>
            </div>
          </CardBody>
        </UncontrolledCollapse>
      </Card>
    </div>
    <div className="d-flex justify-content-between mt-1">
      <Button onClick={groupSave} color="primary">Save</Button>
      <Button onClick={() => {
        window.confirm('Are you sure?') && groupDelete()
      }} color="danger">Delete</Button>
    </div>

  </div>
}
