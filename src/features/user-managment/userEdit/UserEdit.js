import React, {useState, useRef} from 'react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  FormGroup,
  Row,
  Col,
  Input,
  Form,
  FormFeedback,
  Media,
} from "reactstrap"
import Flatpickr from "react-flatpickr";
import Select, {components} from "react-select"
import classnames from "classnames"
import moment from 'moment';
import {toast} from "react-toastify"
import {User, X, Check, Plus, Edit2, RefreshCw, EyeOfxf, Eye} from "react-feather"
import {colourStyles} from "utility/select/selectSettigns";
import {DropdownIndicator} from 'components/MultiSelect/multiSelect'
// import InvitationCreate from '../invitation/InvitationCreate'
import { useDispatch, useSelector } from "react-redux";
import { selectGroups, selectRoles, selectManager, selectManagers } from "app/selectors";
import {setManager, updateUserRequest, getRolesRequest, getGroupsRequest, setContext} from "app/slices/appSlice";
import {useOutsideAlerter} from 'hooks/useOutsideAlerter'
import UserEditAvatar from "./UserEditAvatar"
import UserEditSelects from './UserEditSelects';
import UserOnboarding from '../userOnboarding/UserOnboarding';
import UserInvitationsCreate from '../userInvitations/UserInvitationsCreate';

const UserEdit = () => {
  const manager = useSelector(selectManager);
  const [editField, setEditField] = useState(null);
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const titleRef = useRef(null);
  const validUntilRef = useRef(null)
  const numberRef = useRef(null)
  const emailRef = useRef(null)
  useOutsideAlerter([titleRef, validUntilRef, numberRef, emailRef], () => setEditField(null));


  const handleManager = (managerValue) => {
    dispatch(setManager({ ...manager, ...managerValue }));
  };

  const editFieldClose = () => {
    setEditField(null)
  }
  const editFieldSave = () => {
    setEditField(null)
    dispatch(updateUserRequest(manager))
  }

  const removeCard = () => {
    dispatch(setContext(null))
    dispatch(setManager(null));
  }

  const formSubmit =() => {
      // dispatch(createUserOnboardingRequset())
  }

    return (
      <Row className="user-managment">
        <Col sm="12" md="12" lg="12" xl="7">
          <Card className={"card-action user-managment__edit"}>
            <CardHeader className="user-managment__edit_header">
              <CardTitle className="font-weight-bold">
                <div className="d-flex edit-btn-trigger">
                  <div className="user-managment__edit_header_user-info-container" ref={titleRef}>
                    {
                      editField === "name" ?
                        <FormGroup className="position-absolute input-divider-right user-managment__edit_header_form" >
                          <Input
                            autoFocus
                            type="text"
                            name="name"
                            id="mobileVertical"
                            placeholder="Mobile"
                            value={manager.first_name}
                            onChange={(event) => handleManager({name: event.target.value})}
                            {...{invalid: errors['name'] }}
                          />
                          <div className="form-control-position input-divider-right user-managment__edit_header_form_check"
                               onClick={editFieldSave}>
                            <Check className="bg-hover-icon" size={15}/>
                          </div>
                          <div className="form-control-position input-divider-right user-managment__edit_header_form_cross"
                               onClick={editFieldClose}>
                            <X className="bg-hover-icon" size={15}/>
                          </div>
                          <FormFeedback>{errors['name'] ? errors['name'] : ''}</FormFeedback>
                        </FormGroup>
                        : <div onClick={() => setEditField('name')}>{manager.first_name} <Edit2 className="edit-btn" size={15}/></div>
                    }
                  </div>
                </div>
              </CardTitle>
              <X size={15} onClick={removeCard}/>
            </CardHeader>
            {/*  */}
            <CardBody className="user-managment__edit_body">
              <Form onSubmit={(event) => formSubmit(event)}>
                <Row className="mx-0" col="12">
                  <Col className="pl-0" sm="12">
                    <Media className="d-sm-flex d-block">
                      <UserEditAvatar />
                      <Media className="edit-clicked" body>
                        <Row className="mt-1">
                          <Col sm="9" md="6" lg="6">
                            <div className="user-managment__edit_body_user-info">
                              <div className="d-flex edit-btn-trigger">
                                <div className="font-weight-bold-lighter column-sizing-user-info"
                                     onClick={() => setEditField('number')}>Number
                                </div>
                                <div className="user-managment__edit_body_user-info-container" ref={numberRef}>
                                  {
                                    editField ==='number' ?
                                      <FormGroup className="input-divider-right user-managment__edit_body_form">
                                        <Input
                                          autoFocus
                                          type="text"
                                          name="number"
                                          id="mobileVertical"
                                          placeholder="Mobile"
                                          value={manager.number}
                                          onChange={(event) => handleManager({number: event.target.value})}
                                          {...{invalid: errors['number']}}
                                        />
                                        <div className="form-control-position user-managment__edit_body_form_check"
                                             onClick={editFieldSave}>
                                          <Check className="bg-hover-icon" size={15}/>
                                        </div>
                                        <div className="form-control-position form-control-position user-managment__edit_body_form_cross"
                                             onClick={editFieldClose}>
                                          <X className="bg-hover-icon" size={15}/>
                                        </div>
                                        <FormFeedback>{errors['number'] ? errors['number'] : ''}</FormFeedback>
                                      </FormGroup>
                                      : <div onClick={() => setEditField('number')} className=" user-managment__edit_body_form_text"><span>{manager.number} </span><Edit2 className="edit-btn"
                                                                                                                                                                          size={15}/></div>
                                  }
                                </div>
                              </div>
                              <div className="d-flex edit-btn-trigger">
                                <div className="font-weight-bold-lighter column-sizing-user-info"
                                     onClick={() => setEditField('email')}>Email
                                </div>
                                <div className="user-managment__edit_body_user-info-container" ref={emailRef}>
                                  {
                                    editField === 'email' ?
                                      <FormGroup className="input-divider-right user-managment__edit_body_form">
                                        <Input
                                          autoFocus
                                          type="email"
                                          name="email"
                                          id="EmailVertical"
                                          placeholder="Email"
                                          value={manager.email}
                                          onChange={(event) => handleManager({email: event.target.value})}
                                          {...{invalid: errors['email']}}
                                        />
                                        <div className="form-control-position form-control-position user-managment__edit_body_form_check"
                                             onClick={editFieldSave}>
                                          <Check className="bg-hover-icon" size={15}/>
                                        </div>
                                        <div className="form-control-position form-control-position user-managment__edit_body_form_cross"
                                             onClick={editFieldClose}>
                                          <X className="bg-hover-icon" size={15}/>
                                        </div>
                                        <FormFeedback>{ errors['email'] ?  errors['email'] : ''}</FormFeedback>
                                      </FormGroup>
                                      : <div onClick={() => setEditField('email')} className="user-managment__edit_body_form_text"><span>{manager.email}</span><Edit2 className="edit-btn"
                                                                                                                                                                      size={15}/></div>
                                  }
                                </div>
                              </div>
                              <div className="d-flex edit-btn-trigger">
                                <div className="font-weight-bold-lighter column-sizing-user-info"
                                     onClick={() => setEditField('valid_until')}>Valid until
                                </div>
                                <div className="user-managment__edit_body_user-info-container" ref={validUntilRef}>
                                  {
                                    editField === 'valid_until' ?
                                      <FormGroup className="input-divider-right user-managment__edit_body_form">
                                        <Flatpickr
                                          autoFocus
                                          name="valid_until"
                                          className="form-control"
                                          data-enable-time
                                          value={manager.valid_until}
                                          onChange={date => {
                                            handleManager({valid_until: moment(date[0]).format('YYYY-MM-DD HH:mm:ss')});
                                          }}
                                        />
                                        <div className="form-control-position form-control-position user-managment__edit_body_form_check"
                                             onClick={editFieldSave}>
                                          <Check className="bg-hover-icon" size={15}/>
                                        </div>
                                        <div className="form-control-position form-control-position user-managment__edit_body_form_cross"
                                             onClick={editFieldClose}>
                                          <X className="bg-hover-icon" size={15}/>
                                        </div>
                                        <FormFeedback>{ errors['valid_until']  ? errors['valid_until'] : ''}</FormFeedback>
                                      </FormGroup>
                                      :
                                      <div onClick={() => setEditField('valid_until')} className="user-managment__edit_body_form_text"><span>{manager.valid_until}</span><Edit2
                                        className="edit-btn" size={15}/></div>
                                  }

                                </div>
                              </div>
                              <div className="d-flex">
                                <div className="font-weight-bold-lighter column-sizing-user-info">Portal access</div>
                                <div>
                                  {
                                    manager.invited && !manager.invited.revoked_at ?
                                      <UserInvitationsCreate user={manager} send={false} resend={true} trash={true}
                                                             invitationText="Resend invitation"/> :
                                      manager.invited && !manager.invited.accepted_at ?
                                        <UserInvitationsCreate user={manager} send={false} resend={true} trash={true}
                                                               invitationText="Resend invitation"/> :
                                        manager.invited && manager.invited.accepted_at ? 'Invitation accepted' :
                                          manager.roles.indexOf('prospect') === -1 && manager.roles.length && manager.groups.length ?
                                            'Allowed'
                                            : manager.roles.indexOf('prospect') !== -1 && !manager.groups.length ?
                                            <UserInvitationsCreate send={true} resend={false} trash={false}
                                                                   user={manager}/>
                                            : 'User cannot be invited'
                                  }

                                </div>
                              </div>
                            </div>
                          </Col>
                          <UserEditSelects/>
                        </Row>
                      </Media>
                    </Media>
                  </Col>
                </Row>
              </Form>
              <UserOnboarding/>
            </CardBody>
          </Card>
        </Col>
      </Row>
    )
}

export default UserEdit
