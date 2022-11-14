import React from "react";
import {
  FormGroup,
  Row,
  Col,
  Input,
  Form,
  Button,
  Label,
  FormFeedback,
  CardTitle,
  CardHeader,
  CardBody,
  Card,
} from "reactstrap";
import Checkbox from "../../../components/@vuexy/checkbox/CheckboxesVuexy";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "app/selectors";
import { Check, X } from "react-feather";
import Flatpickr from "react-flatpickr";
import moment from "moment";
import { selectError } from "app/selectors";

import appSlice from "app/slices/appSlice";

const { setUser, createUserRequest, setContext } = appSlice.actions;

const UserCreate = () => {
  const user = useSelector(selectUser);
  const errors = useSelector(selectError) || {};
  const dispatch = useDispatch();

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(createUserRequest(user));
  };

  const handleCardClose = () => {
    dispatch(setContext(null));
  };

  return (
    <Row>
      <Col sm="12" md="12" lg="12" xl="5">
        <Card>
          <CardHeader>
            <CardTitle className="font-weight-bold">User Create</CardTitle>
            <div>
              <X
                size={15}
                className="cursor-pointer mr-1"
                onClick={() => {
                  handleCardClose();
                }}
              />
            </div>
          </CardHeader>
          <CardBody>
            <Form className="user-create">
              <Row>
                <Col sm="6">
                  <FormGroup>
                    <Label for="nameVertical">First Name</Label>
                    <Input
                      type="text"
                      name="name"
                      id="nameVertical"
                      placeholder="First Name"
                      value={user.first_name}
                      onChange={(event) => dispatch(setUser({ ...user, first_name: event.target.value }))}
                      {...{ invalid: errors["first_name"] }}
                    />
                    <FormFeedback>{errors["first_name"] ? errors["first_name"] : ""}</FormFeedback>
                  </FormGroup>
                </Col>
                <Col sm="6">
                  <FormGroup>
                    <Label for="lastNameVertical">Last Name</Label>
                    <Input
                      type="text"
                      name="last_name"
                      id="lastNameVertical"
                      placeholder="Last Name"
                      value={user.last_name}
                      onChange={(event) => dispatch(setUser({ ...user, last_name: event.target.value }))}
                      {...{ invalid: errors["last_name"] }}
                    />
                    <FormFeedback>{errors["last_name"] ? errors["last_name"] : ""}</FormFeedback>
                  </FormGroup>
                </Col>
                <Col sm="6">
                  <FormGroup>
                    <Label for="EmailVertical">Email</Label>
                    <Input
                      type="email"
                      name="Email"
                      id="EmailVertical"
                      placeholder="Email"
                      value={user.email}
                      onChange={(event) => dispatch(setUser({ ...user, email: event.target.value }))}
                      {...{ invalid: errors["email"] }}
                    />
                    <FormFeedback>{errors["email"] ? errors["email"] : ""}</FormFeedback>
                  </FormGroup>
                </Col>
                <Col sm="6">
                  <FormGroup>
                    <Label for="">Number</Label>
                    <Input
                      type="text"
                      name="number"
                      id="mobileVertical"
                      placeholder="Mobile"
                      value={user.number}
                      onChange={(event) => dispatch(setUser({ ...user, number: event.target.value }))}
                      {...{ invalid: errors["number"] }}
                    />
                    <FormFeedback>{errors["number"] ? errors["number"] : ""}</FormFeedback>
                  </FormGroup>
                </Col>

                <Col md="12" sm="12">
                  <FormGroup>
                    <div className="d-flex">
                      <Checkbox
                        size="sm"
                        color="primary"
                        icon={<Check className="vx-icon" size={12} />}
                        label="Valid until"
                        checked={!!user.valid_until}
                        onChange={(date) => {
                          dispatch(
                            setUser({
                              ...user,
                              valid_until: !user.valid_until ? moment(date[0]).format("YYYY-MM-DD HH:mm:ss") : null,
                            })
                          );
                        }}
                      />
                    </div>

                    {user.valid_until ? (
                      <Flatpickr
                        className="form-control"
                        data-enable-time
                        value={user.valid_until}
                        onChange={(date) => {
                          dispatch(setUser({ ...user, valid_until: moment(date[0]).format("YYYY-MM-DD HH:mm:ss") }));
                        }}
                      />
                    ) : null}

                    <FormFeedback>{errors["valid_until"] ? errors["valid_until"] : ""}</FormFeedback>
                  </FormGroup>
                </Col>
                {/*<Col sm="12">*/}
                {/*  <div className="permissions border px-2">*/}
                {/*    <div className="title pt-2 pb-0">*/}
                {/*      <Lock size={19}/>*/}
                {/*      <span className="text-bold-500 font-medium-2 ml-50">Permissions</span>*/}
                {/*      <hr/>*/}
                {/*      <FormGroup>*/}
                {/*        <Label for="">Organisations</Label>*/}
                {/*        <Select*/}
                {/*          value={prepareSelectGroups(user.groups)}*/}
                {/*          maxMenuHeight={200}*/}
                {/*          isMulti*/}
                {/*          isClearable={true}*/}
                {/*          styles={colourStyles}*/}
                {/*          options={filtredSelectOptions()}*/}
                {/*          onChange={onSelectGroupsChange}*/}
                {/*          className=""*/}
                {/*          classNamePrefix="select"*/}
                {/*        />*/}
                {/*      </FormGroup>*/}
                {/*      <FormGroup>*/}
                {/*        <Label for="">Roles</Label>*/}
                {/*        <Select*/}
                {/*          value={prepareRolesSelect(user.roles)}*/}
                {/*          maxMenuHeight={200}*/}
                {/*          isMulti*/}
                {/*          isClearable={true}*/}
                {/*          styles={colourStyles}*/}
                {/*          options={prepareRolesSelect(roles)}*/}
                {/*          className=""*/}
                {/*          onChange={onSelectRolesChange}*/}
                {/*          classNamePrefix="select"*/}
                {/*        />*/}
                {/*      </FormGroup>*/}
                {/*    </div>*/}
                {/*  </div>*/}
                {/*</Col>*/}
                <Col className="d-flex justify-content-end flex-wrap" sm="12">
                  <FormGroup>
                    <Button color="primary" type="submit" className="mr-1" onClick={onSubmit}>
                      Submit
                    </Button>
                  </FormGroup>
                </Col>
              </Row>
            </Form>
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};

export default UserCreate;
