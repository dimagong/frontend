import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  Row,
  Col, Badge,
} from "reactstrap";
import { X } from "react-feather";

import { useDispatch, useSelector } from "react-redux";

import { setPreview } from "app/slices/appSlice";


import {selectPreview} from 'app/selectors/layoutSelector'
import {selectdForms} from '../../../app/selectors'

const DFormFormPreview = () => {
  const preview = useSelector(selectPreview);
  const dForms = useSelector(selectdForms)
  const dispatch = useDispatch();

  const dForm = dForms.filter(({id}) => id === preview.id)[0]

  const closeDForm = () => {
    dispatch(setPreview(null))
  };

  if(!dForm) return null;

  return (
    <Row>
      <Col sm="8" className={"pt-4"}>
        <Card className="dform border">
          <CardHeader>
            <CardTitle className="font-weight-bold">DForm</CardTitle>
            <div>
              <X size={15} className="cursor-pointer mr-1" onClick={closeDForm} />
            </div>
          </CardHeader>
          <CardBody className="card-top-padding">
            <div className="mt-2">
              <div className="d-flex mb-1 align-items-center">
                <div className="width-100">
                  Organisations
                </div>
                {dForm.groups && dForm.groups.length ? (
                  dForm.groups.map((group) =>
                    <Badge className="custom-badge" color="primary">
                      {group.name}
                    </Badge>
                  )
                ) : (
                  <span>No roles</span>
                )}
              </div>
            </div>
            <div className="d-flex mb-1">
              <div className="font-weight-bold-lighter column-sizing-user-info width-100">
                Name
              </div>
              <div className="user-managment__edit_body_user-info-container">
                <div className=" user-managment__edit_body_form_text">
                  <span>{dForm.name} </span>
                </div>
              </div>
            </div>
            <div className="d-flex mb-1">
              <div className="font-weight-bold-lighter column-sizing-user-info width-100">
                Description
              </div>
              <div className="user-managment__edit_body_user-info-container">
                <div className=" user-managment__edit_body_form_text">
                  <span>{dForm.description}</span>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};

export default DFormFormPreview;
