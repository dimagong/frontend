import React from "react"
import {
  FormGroup,
  Row,
  Col,
  Input,
  Form,
  Button,
  Label,
  FormFeedback,
} from "reactstrap"
import {Check, Lock} from "react-feather"
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/light.css";
import "../../../assets/scss/plugins/forms/flatpickr/flatpickr.scss"
import Select from "react-select"

import chroma from "chroma-js"
import GroupService from '../../../services/group.service'
import RoleService from '../../../services/role.service'
import UserService from '../../../services/user.service'
import moment from 'moment';
import {toast} from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import "../../../assets/scss/plugins/extensions/toastr.scss"

import {connect} from "react-redux"
import {setUserList} from '../../../redux/actions/user/userActions'
import {bindActionCreators} from "redux"
import {store} from '../../../redux/storeConfig/store'
import Checkbox from "../../../components/@vuexy/checkbox/CheckboxesVuexy";

const colorMultiSelect = '#007bff'; //#7367f0
const colourStyles = {
  control: styles => ({...styles, backgroundColor: "white"}),
  option: (styles, {data, isDisabled, isFocused, isSelected}) => {
    const color = data.color ? chroma(data.color) : colorMultiSelect
    return {
      ...styles,
      backgroundColor: isDisabled
        ? null
        : isSelected
          ? data.color
          : isFocused
            ? color.alpha(0.1).css()
            : null,
      color: isDisabled
        ? "#ccc"
        : isSelected
          ? chroma.contrast(color, "white") > 2
            ? "white"
            : "black"
          : data.color,
      cursor: isDisabled ? "not-allowed" : "default",

      ":active": {
        ...styles[":active"],
        backgroundColor: !isDisabled && (isSelected ? data.color : "white")
      }
    }
  },
  multiValue: (styles, {data}) => {
    const color = data.color ? chroma(data.color) : colorMultiSelect
    return {
      ...styles,
      backgroundColor: color.alpha(0.1).css()
    }
  },
  multiValueLabel: (styles, {data}) => ({
    ...styles,
    color: data.color ? data.color : colorMultiSelect
  }),
  multiValueRemove: (styles, {data}) => ({
    ...styles,
    color: data.color,
    ":hover": {
      backgroundColor: data.color ? data.color : colorMultiSelect,
      color: "white"
    }
  })
}

class UserCreate extends React.Component {
  state = {
    first_name: '',
    last_name: '',
    email: '',
    postcode: '',
    number: '',
    valid_until: null,
    password: '',
    groups: [],
    roles: [],
    default: {
      groups: [],
      roles: []
    },
    errors: {}
  };

  initState() {
    return {
      name: '',
      email: '',
      number: '',
      valid_until: null,
      password: '',
      groups: [],
      roles: [],
      errors: {}
    };
  }

  async componentDidMount() {
    this.getGroups();
    this.getRoles();
  }

  getCustomSelect(value, label) {
    return {
      value: value,
      label: label,
      color: colorMultiSelect
    }
  }

  mapSelectValues = (selectValues) => {
    if (!selectValues) return [];
    return selectValues.map(select => select.value);
  };

  getRoles = async () => {
    const response = await RoleService.getAll();
    const roles = response.data.data;

    const multiSelectRoles = roles.map((role) => {
      return {
        value: role,
        label: role,
        color: colorMultiSelect
      }
    });

    this.setState({...this.state, default: {...this.state.default, roles: multiSelectRoles}})
  }

  getGroups = async () => {
    const response = await GroupService.getAll();
    const groups = response.data.data;

    const multiSelectGroups = this.getListByTreeGroups(groups)

    this.setState({...this.state, default: {...this.state.default, groups: multiSelectGroups}})
  }

  dispatchUserList = async () => {
    const nav = store.getState().user.list.nav;
    const response = await UserService.getByEmail(nav.searchVal, nav.currPage);
    const users = response.data.data;
    this.props.setUserList(users, nav);
  }

  getListByTreeGroups = (groups) => {

    let groupsMultiSelect = [];

    if (!groups) return groupsMultiSelect;

    groups.forEach(admin => {
      groupsMultiSelect.push({
        value: {
          group_id: admin.id,
          type: 'admin'
        },
        //label: `${admin.name}(${admin.id})`,
        label: `${admin.name}`,
        color: colorMultiSelect
      });
      admin.corporations.forEach(corporation => {
        groupsMultiSelect.push({
          value: {
            group_id: corporation.id,
            type: 'corporation'
          },
          //label: `${admin.name}(${admin.id})->${corporation.name}(${corporation.id})`,
          label: `${corporation.name}`,
          color: colorMultiSelect
        });
        corporation.networks.forEach(network => {
          groupsMultiSelect.push({
            value: {
              group_id: network.id,
              type: 'network'
            },
            // label: `${admin.name}(${admin.id})->${corporation.name}(${corporation.id})->${network.name}(${network.id})`,
            label: `${network.name}`,
            color: colorMultiSelect
          });
          network.member_firms.forEach(memberFirm => {
            groupsMultiSelect.push({
              value: {
                group_id: memberFirm.id,
                type: 'member_firm'
              },
              // label: `${admin.name}(${admin.id})->${corporation.name}(${corporation.id})->${network.name}(${network.id})->${memberFirm.name}(${memberFirm.id})`,
              label: `${memberFirm.name}`,
              color: colorMultiSelect
            });
          });
        });
      });
    });

    return groupsMultiSelect;
  }

  formSubmit = async (event) => {
    event.preventDefault();
    try {
      await UserService.createUser(this.state);
      this.dispatchUserList();
      toast.success('success');
      this.setState({...this.initState()});
    } catch (responseError) {
      // const errorStatus = responseError.response.status;
      const error = responseError.response.data.error;

      toast.error(error.message)
      this.setState({...this.state, errors: {...error.errors}})
    }
  }

  render() {

    const {
      first_name,
      last_name,
      postcode,
      email,
      number,
      // valid_until,
      password
    } = this.state;

    return (<Form onSubmit={(event) => this.formSubmit(event)}>
      <Row>
        <Col sm="6">
          <FormGroup>
            <Label for="nameVertical">First Name</Label>
            <Input
              type="text"
              name="first_name"
              id="nameVertical"
              placeholder="First name"
              value={first_name}
              onChange={(event) => this.setState({first_name: event.target.value})}
              {...{invalid: 'first_name' in this.state.errors}}
            />
            <FormFeedback>{'first_name' in this.state.errors ? this.state.errors['first_name'] : ''}</FormFeedback>
          </FormGroup>
        </Col>
        <Col sm="6">
          <FormGroup>
            <Label for="nameVertical">Last Name</Label>
            <Input
              type="text"
              name="last_name"
              id="nameVertical"
              placeholder="Last name"
              value={last_name}
              onChange={(event) => this.setState({last_name: event.target.value})}
              {...{invalid: 'last_name' in this.state.errors}}
            />
            <FormFeedback>{'last_name' in this.state.errors ? this.state.errors['last_name'] : ''}</FormFeedback>
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
              value={email}
              onChange={(event) => this.setState({email: event.target.value})}
              {...{invalid: 'email' in this.state.errors}}
            />
            <FormFeedback>{'email' in this.state.errors ? this.state.errors['email'] : ''}</FormFeedback>
          </FormGroup>
        </Col>
        <Col sm="6">
          <FormGroup>
            <Label for="EmailVertical">Postcode</Label>
            <Input
              type="text"
              name="postcode"
              placeholder="Postcode"
              value={postcode}
              onChange={(event) => this.setState({postcode: event.target.value})}
              {...{invalid: 'postcode' in this.state.errors}}
            />
            <FormFeedback>{'postcode' in this.state.errors ? this.state.errors['postcode'] : ''}</FormFeedback>
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
              value={number}
              onChange={(event) => this.setState({number: event.target.value})}
              {...{invalid: 'number' in this.state.errors}}
            />
            <FormFeedback>{'number' in this.state.errors ? this.state.errors['number'] : ''}</FormFeedback>
          </FormGroup>
        </Col>
        <Col sm="6">
          <FormGroup>
            <Label for="">Password</Label>
            <Input
              type="password"
              name="password"
              id="passwordVertical"
              placeholder="Password"
              value={password}
              onChange={(event) => this.setState({password: event.target.value})}
              {...{invalid: 'password' in this.state.errors}}
            />
            <FormFeedback>{'password' in this.state.errors ? this.state.errors['password'] : ''}</FormFeedback>
          </FormGroup>
        </Col>
        <Col md="12" sm="12">
          <FormGroup>
            <div className="d-flex">
              <Checkbox
                size="sm"
                color="primary"
                icon={<Check className="vx-icon" size={12}/>}
                label="Valid until"
                checked={this.state.valid_until ? true : false}
                onChange={date => {
                  this.setState({valid_until: !this.state.valid_until ? moment(date[0]).format('YYYY-MM-DD HH:mm:ss') : null});
                }}
              />
            </div>

            {
              this.state.valid_until ?
                <Flatpickr
                  className="form-control"
                  data-enable-time
                  value={this.state.valid_until}
                  onChange={date => {
                    this.setState({valid_until: moment(date[0]).format('YYYY-MM-DD HH:mm:ss')});
                  }}
                />
                :
                null
            }

            <FormFeedback>{'valid_until' in this.state.errors ? this.state.errors['valid_until'] : ''}</FormFeedback>
          </FormGroup>
        </Col>
        <Col sm="12">
          <div className="permissions border px-2">
            <div className="title pt-2 pb-0">
              <Lock size={19}/>
              <span className="text-bold-500 font-medium-2 ml-50">Permissions</span>
              <hr/>
              <FormGroup>
                <Label for="">Organisations</Label>
                <Select
                  value={
                    this.state.default.groups
                      .filter(group => {
                          return !!this.state.groups.find(stateGroup => stateGroup.group_id === group.value.group_id && stateGroup.type === group.value.type)
                        }
                      ).map(group => this.getCustomSelect(group.value, group.label))
                  }
                  maxMenuHeight={200}
                  isMulti
                  isClearable={true}
                  styles={colourStyles}
                  options={this.state.default.groups}
                  onChange={(values) => {
                    this.setState({groups: this.mapSelectValues(values)})
                  }}
                  className=""
                  classNamePrefix="select"
                />
              </FormGroup>
              <FormGroup>
                <Label for="">Roles</Label>
                <Select
                  value={
                    this.state.default.roles
                      .filter(role => {
                          return this.state.roles.indexOf(role.value) !== -1;
                        }
                      ).map(role => this.getCustomSelect(role.value, role.label))
                  }
                  maxMenuHeight={200}
                  isMulti
                  isClearable={true}
                  styles={colourStyles}
                  options={this.state.default.roles}
                  className=""
                  onChange={(values) => {
                    this.setState({roles: this.mapSelectValues(values)})
                  }}
                  classNamePrefix="select"
                />
              </FormGroup>
            </div>
          </div>
        </Col>
        <Col className="d-flex justify-content-end flex-wrap mt-2" sm="12">
          <FormGroup>
            <Button.Ripple
              color="primary"
              type="submit"
              className="mr-1 mb-1"
            >
              Submit
            </Button.Ripple>
          </FormGroup>
        </Col>
      </Row>
    </Form>)
  }
}

const mapStateToProps = state => {
  return {}
}
const mapActionsToProps = (dispatch) => {
  return {
    setUserList: bindActionCreators(setUserList, dispatch)
  }
}
export default connect(mapStateToProps, mapActionsToProps)(UserCreate)
