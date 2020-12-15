import React, {useEffect, useState} from "react";
import {Col, FormGroup, Input, Label, Button, InputGroup, InputGroupAddon} from "reactstrap";
import masterSchemaService from './services/masterSchema.service'

export default function FieldEdit({data, onChange}) {

  const [field, setField] = useState({});

  useEffect(() => {
    setField(data);
  }, [data]);

  const fieldSave = async () => {
    try {
      const response = await masterSchemaService.updateField(field);
      const updatedField = response.data.data;
      onChange(updatedField);
      setField(updatedField);
    } catch (exception) {
      console.log(exception);
    }
  };

  const fieldDelete = async () => {
    try {
      const response = await masterSchemaService.deleteField(field);
      onChange(null);
    } catch (exception) {
      console.log(exception);
    }
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

    <div className="d-flex justify-content-between mt-1">
      <Button.Ripple outline onClick={() => {
        window.confirm('Are you sure?') && fieldDelete()
      }} color="danger">Delete</Button.Ripple>
      <Button.Ripple outline onClick={() => {
        fieldSave()
      }} color="primary">Save</Button.Ripple>
    </div>

  </div>
}
