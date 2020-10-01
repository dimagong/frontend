import React, {useState, useRef, useEffect} from 'react'
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
import { setUser, updateUserRequest, getRolesRequest, getGroupsRequest } from "app/slices/appSlice";
import {useOutsideAlerter} from 'hooks/useOutsideAlerter'
import UserEditAvatar from "./UserEditAvatar"
import UserEditSelects from './UserEditSelects';

const UserEdit = () => {
  const manager = useSelector(selectManager);
  const [editField, setEditField] = useState(null);
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const nameFieldRef = useRef(null);
  useOutsideAlerter(nameFieldRef, () => setEditField(null));



  const handleManager = (managerValue) => {
    dispatch(setUser({ ...manager, ...managerValue }));
  };

  const editFieldClose = () => {
    setEditField(null)
  }
  const editFieldSave = () => {
    setEditField(null)
    // dispatch(updateUserRequest(manager))

  }

  const removeCard = () => {

  }
  
  const formSubmit =() => {
      
  }

    return (
        <Card
    //   onClick={(event) => this.cardClicked(event)}
      className={classnames("card-action user-managment__edit",)
    //   {
    //     "d-none": this.props.user.id < 0 || !this.props.user.id
    //   })
      }>
      <CardHeader className="user-managment__edit_header">
        <CardTitle className="font-weight-bold">
          <div className="d-flex edit-btn-trigger">
            <div className="user-managment__edit_header_user-info-container" ref={nameFieldRef}>
              {
                editField === "name" ?
                  <FormGroup className="position-absolute input-divider-right user-managment__edit_header_form" >
                    <Input
                      autoFocus
                      type="text"
                      name="name"
                      id="mobileVertical"
                      placeholder="Mobile"
                      value={manager.name}
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
                  : <div onClick={() => setEditField('name')}>{manager.name} <Edit2 className="edit-btn" size={15}/></div>
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
                          <div className="user-managment__edit_body_user-info-container">
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
                          <div className="user-managment__edit_body_user-info-container">
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
                          <div className="user-managment__edit_body_user-info-container">
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
                            {/* {
                              manager.invited && !manager.invited.revoked_at ?
                                <InvitationCreate user={manager} send={false} resend={true} trash={true}
                                                  invitationText="Resend invitation"/> :
                                manager.invited && !manager.invited.accepted_at ?
                                  <InvitationCreate user={manager} send={false} resend={true} trash={true}
                                                    invitationText="Resend invitation"/> :
                                  manager.invited && manager.invited.accepted_at ? 'Invitation accepted' :
                                    manager.roles.indexOf('prospect') === -1 && manager.roles.length && manager.groups.length ?
                                      'Allowed'
                                      : manager.roles.indexOf('prospect') !== -1 && !manager.groups.length ?
                                      <InvitationCreate send={true} resend={false} trash={false}
                                                        user={manager}/>
                                      : 'User cannot be invited'
                            } */}

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
        {/* {this.modulesRender()} */}

      </CardBody>
    </Card>
    )
}

export default UserEdit
