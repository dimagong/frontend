import React, {useMemo, useState} from 'react';
import PropTypes from "prop-types";
import {Card, CardBody, CardHeader, CardTitle, Col, Label, Row} from "reactstrap";

import { useFormField, useFormGroup, Validators } from "hooks/use-form";

import MSESelectField from "./mse-select-field";

import MSEButton from "./mse-button";
import './styles.scss';
import {get} from "lodash/fp";
import {useSelector} from "react-redux";
import {selectMasterSchemaOfSelectedOrganization} from "../../../app/selectors/masterSchemaSelectors";
import {preventDefault} from "../../../utility/event-decorators";

const nodeToOption = (node) => ({ label: node.path.join("."), value: node });

const MSEApproveElements = ({ submitting, onSubmit: propOnSubmit, elements, ...attrs }) => {
  const [approveIntoGroup, setApproveIntoGroup] = useState({});
  const { root } = useSelector(selectMasterSchemaOfSelectedOrganization);
  const locationOptions = useMemo(() => [root, ...root.children].filter(get("containable"))
    .map(nodeToOption), [root]).filter(item => item.value.name !== "Unapproved");


  const onSubmit = () => propOnSubmit(elements, approveIntoGroup)


  return (
      <MSESelectField
        name="elementLocation"
        placeholder="Choose location"
        options={locationOptions}
        onChange={setApproveIntoGroup}
        label={(id) => (
          <Label for={id}>
            <CardTitle className={'mse-approve-element-title'}>Approve selected fields</CardTitle>
            <CardTitle className={'mse-approve-element-subtitle'}>{elements.length
              ? `Which brand should the selected ${elements.length} element${elements.length > 1 && 's'} be approved into?`
              : 'Please select the unapproved elements'}</CardTitle>
          </Label>
        )}
      >
        {({ select, label, error }) => (
          <Card tag="form" onSubmit={preventDefault(onSubmit)} {...attrs}>
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
