import React, {useEffect, useState} from 'react'
import masterSchemaService from "./services/masterSchema.service";
import { useDispatch, useSelector } from "react-redux";
import {Button, CardBody, Input, InputGroup, InputGroupAddon, Label} from "reactstrap";
import { getSelectedMemberFirmId } from "app/selectors/memberFirmsSelector";
import appSlice from "../../../app/slices/appSlice";

const {
  getMasterSchemaFieldsForMemberFirmRequest,
} = appSlice.actions;

export default function FieldCreate({data, onNewField}) {
  const dispatch = useDispatch();

  const selectedMemberFirmId = useSelector(getSelectedMemberFirmId);

  const [newField, setNewField] = useState({});
  const [selectedElement, setSelectedElement] = useState({});

  useEffect(() => {

    setSelectedElement(data);
  }, [data]);

  const onAddNewField = async () => {
    try {
      let parentGroupId = -1;

      // is category
      if('children' in selectedElement) {
        parentGroupId = selectedElement.id;
      } else {
        // is field
        parentGroupId = selectedElement.master_schema_group_id;
      }

      const response = await masterSchemaService.addField({...newField, master_schema_group_id: parentGroupId});
      onNewField(response.data.data);
      setNewField({
        name: ''
      });
    } catch (exception) {
      console.log(exception);
    }

    if (selectedMemberFirmId) {
      dispatch(getMasterSchemaFieldsForMemberFirmRequest(selectedMemberFirmId))
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
    <Label>Element name</Label>
    <InputGroup>
      <InputGroupAddon addonType="prepend">{getElementDist()}</InputGroupAddon>
      <Input
        value={newField.name}
        onChange={(event) => {
          setNewField({...newField, name: event.target.value})
        }}
      />
    </InputGroup>

    <div className="d-flex justify-content-between mt-1">
      <Button.Ripple outline  onClick={() => {
        setNewField({
          name: ''
        });
      }} color="light">Clear</Button.Ripple>
      <Button.Ripple outline onClick={onAddNewField} color="primary">Add element</Button.Ripple>
    </div>
  </div>
}
