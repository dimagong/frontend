import React, {useState, useEffect} from 'react'
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

import { useDispatch, useSelector } from "react-redux";
import { X, Check } from "react-feather"
import {selectCurrentManager} from 'app/selectors/userSelectors'

import {setUser, updateUserRequest, setContext} from "app/slices/appSlice";
import {selectError} from "app/selectors";

import UserInvitationsCreate from '../userInvitations/UserInvitationsCreate'
import Checkbox from 'components/@vuexy/checkbox/CheckboxesVuexy'

const UserProfileEdit = ({manager, onEditClose}) => {
  const errors = useSelector(selectError) || {};
  const dispatch = useDispatch();

  const [managerState, setManagerState] = useState(manager);

  const onSubmit = e => {
    e.preventDefault();
    dispatch(updateUserRequest(managerState))
  };

  const handleCardClose = () => {
    onEditClose()
  };

  const handleFieldChange = (fieldName, fieldValue) => {
    setManagerState({
      ...managerState,
      [fieldName]: fieldValue,
    })
  };

  useEffect(() => {
    setManagerState(manager)
  }, [manager]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-weight-bold">User Edit</CardTitle>
        <div>
          <X size={15} className="cursor-pointer mr-1" onClick={() => {
            handleCardClose()
          }}/>
        </div>
      </CardHeader>
      <CardBody>
        <Form
          // onSubmit={(event) => this.formSubmit(event)}
          className="user-create"
        >
          <Row>
            <Col sm="6">
              <FormGroup>
                <Label for="nameVertical">First Name</Label>
                <Input
                  type="text"
                  name="name"
                  id="nameVertical"
                  placeholder="First Name"
                  value={managerState.first_name}
                  onChange={(event) => handleFieldChange("first_name", event.target.value)}

                  {...{invalid: errors['first_name']}}
                />
                <FormFeedback>{errors['first_name'] ? errors['first_name'] : ''}</FormFeedback>
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
                  value={managerState.last_name}
                  onChange={(event) => handleFieldChange("last_name", event.target.value)}
                  {...{invalid: errors['last_name']}}
                />
                <FormFeedback>{errors['last_name'] ? errors['last_name'] : ''}</FormFeedback>
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
                  value={managerState.email}
                  onChange={(event) => handleFieldChange("email", event.target.value)}
                  {...{invalid: errors['email']}}
                />
                <FormFeedback>{errors['email'] ? errors['email'] : ''}</FormFeedback>
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
                  value={managerState.number}
                  onChange={(event) => handleFieldChange("number", event.target.value)}
                  {...{invalid: errors['number']}}
                />
                <FormFeedback>{errors['number'] ? errors['number'] : ''}</FormFeedback>
              </FormGroup>
            </Col>
            <Col sm="12">
              <FormGroup>
                <Checkbox
                  color="primary"
                  icon={<Check className="vx-icon" size={16} />}
                  label="Show intro page"
                  checked={+managerState.notify === 1 ? true : false}
                  onClick={() => {
                    handleFieldChange("notify", Number(!managerState.notify));
                  }}
                />
              </FormGroup>
            </Col>
            <Col sm="6">
              <FormGroup>
                <Label for="" style={{marginBottom: 5}}>Portal access:</Label>
                <div>
                  {
                    manager.invited && !manager.invited.revoked_at ?
                      <UserInvitationsCreate user={manager} send={false} resend={true} trash={true}
                                             invitationText="Resend invitation"/> :
                      manager.invited && !manager.invited.accepted_at ?
                        <UserInvitationsCreate user={manager} send={false} resend={true} trash={true}
                                               invitationText="Resend invitation"/> :
                        manager?.permissions?.ability !== "lead" && manager?.permissions?.ability !== "suspect" && manager.groups.length ?
                          <UserInvitationsCreate send={true} resend={false} trash={false}
                                                 user={manager}/>
                          : <p style={{paddingLeft: "0.2rem"}}>User cannot be invited</p>
                  }

                </div>
              </FormGroup>
            </Col>
            <Col className="d-flex justify-content-end flex-wrap" sm="12">
              <FormGroup>
                <Button.Ripple
                  color="primary"
                  type="submit"
                  className="mr-1"
                  onClick={onSubmit}
                >
                  Save
                </Button.Ripple>
              </FormGroup>
            </Col>
          </Row>
        </Form>
      </CardBody>
    </Card>
  )
};

export default UserProfileEdit;