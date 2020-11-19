import React, {useState} from "react";
import {Col, FormGroup, Input, Label} from "reactstrap";
import {Button} from "react-bootstrap";

export default function FieldEdit({data, onChange}) {

  console.log('>>>>>>>', data);

  const [field, setField] = useState(data);

  return <div>
    <Label>Name</Label>
    <Input
      value={field.name}
      onChange={(event) => {
        setField({...field, name: event.target.value})
      }}
    />
    <div className="d-flex justify-content-between mt-1">
        <Button className="j" onClick={() => {}} variant="primary">Save</Button>
        <Button onClick={() => {}} variant="danger">Delete</Button>
    </div>

  </div>
}
