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

export default function GroupEdit({data, onChange}) {

  const [group, setGroup] = useState({});

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
    {/*<div className="collapse-bordered vx-collapse collapse-icon accordion-icon-rotate collapse-border mt-1">*/}
    {/*  <Card>*/}
    {/*    <CardHeader id="item-2">*/}
    {/*      <CardTitle className="collapse-title collapsed">*/}
    {/*        Add field*/}
    {/*      </CardTitle>*/}
    {/*    </CardHeader>*/}
    {/*    <UncontrolledCollapse toggler="#item-2">*/}
    {/*      */}
    {/*    </UncontrolledCollapse>*/}
    {/*  </Card>*/}
    {/*</div>*/}
    <div className="d-flex justify-content-between mt-1">
      <Button.Ripple outline onClick={() => {
        window.confirm('Are you sure?') && groupDelete()
      }} color="danger">Delete</Button.Ripple>
      <Button.Ripple outline onClick={groupSave} color="primary">Save</Button.Ripple>
    </div>

  </div>
}
