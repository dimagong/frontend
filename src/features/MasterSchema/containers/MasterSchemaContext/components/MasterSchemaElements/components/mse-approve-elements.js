import React from 'react';
import PropTypes from "prop-types";
import {Card, CardBody, CardHeader, CardTitle, Col, Label, Row} from "reactstrap";

import { useFormField, useFormGroup, Validators } from "hooks/use-form";

import MSESelectField from "./mse-select-field";

import MSEButton from "./mse-button";
import './styles.scss';

const MSEApproveElements = ({ submitting, onSubmit: propOnSubmit, groups, elements, ...attrs }) => {
  const [elementLocation, setElementLocation] = useFormField(groups, [Validators.required]);

  const onSubmit = () => propOnSubmit(elements);

  console.log('elementLocation', elementLocation)
  console.log('groups', groups)

  return (
      <MSESelectField
        name="elementLocation"
        placeholder="ValidPath.FCA"
        options={groups.map(item => {return {label: item.name, value: item}})}
        onChange={setElementLocation}
        label={(id) => (
          <Label for={id}>
            <CardTitle className={'mse-approve-element-title'}>Approve selected fields</CardTitle>
            <CardTitle className={'mse-approve-element-subtitle'}>{elements.length
              ? `Which brand should the selected ${elements.length} elements be approved into?`
              : 'Please select the unapproved elements'}</CardTitle>
          </Label>
        )}
      >
        {({ select, label, error }) => (
          <Card tag="form" onSubmit={onSubmit} {...attrs}>
            <CardHeader>{label}</CardHeader>
            <CardBody>
              <Row>
                <Col xs={12}>{select}</Col>
              </Row>
              <MSEButton
                className={`w-100 mse-approve-elements-btn ${!elements.length && 'mse-approve-elements-btn-disabled'}`}
                backgroundColor={elements.length ? "#7367f0" : '#ABABAB4D'}
                textColor={elements.length ? "#fff" : '#a9a9a9'}
                type="submit"
                disabled={!elements.length}
                loading={submitting}
              >
                Approve and move
              </MSEButton>
            </CardBody>
          </Card>
      )}
      </MSESelectField>



  );
};

MSEApproveElements.propTypes = {
  submitting: PropTypes.bool.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default MSEApproveElements;
