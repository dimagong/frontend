import React from "react"
import rfdc from "rfdc"
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
  Button,
  FormFeedback,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Media, Spinner
} from "reactstrap"
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/light.css";
import "../../../assets/scss/plugins/forms/flatpickr/flatpickr.scss"
import Select, {components} from "react-select"
import classnames from "classnames"
import GroupService from '../../../services/group.service'
import RoleService from '../../../services/role.service'
import UserService from '../../../services/user.service'
import moment from 'moment';
import {toast} from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import "../../../assets/scss/plugins/extensions/toastr.scss"
import {User, X, Check, Plus, Edit2, RefreshCw, EyeOff, Eye} from "react-feather"
import {store} from '../../../redux/storeConfig/store'
import {setEditUser} from '../../../redux/actions/user-management/userEditActions'
import InvitationCreate from '../invitation/InvitationCreate'
import {connect} from "react-redux"
import {setUserList} from '../../../redux/actions/user/userActions'
import {bindActionCreators} from "redux"
import userImg from "../../../assets/img/portrait/small/avatar-s-18.jpg"
import workflowService from "../../../services/workflow.service";
import FormCreate from "../onboarding/FormCreate/FormCreate";
import {debounce, isEmpty} from 'lodash';
import {colourStyles} from "utility/select/selectSettigns";
import {prepareSelectData} from "utility/select/prepareSelectData";

const clone = rfdc();

const colorMultiSelect = '#007bff'; //#7367f0

const DropdownIndicator = props => {
  return components.DropdownIndicator && (
    <components.DropdownIndicator {...props}>
      {/* <FontAwesomeIcon icon={props.selectProps.menuIsOpen ? "caret-up" : "caret-down"}/> */}
      <Plus className="plus-select" size={15}/>
    </components.DropdownIndicator>
  )
};

const DropdownIndicatorClear = props => {
  return null;
};

const groupTypes = {
  'App\\Admin': 'admin',
  'App\\Corporation': 'corporation',
  'App\\Network': 'network',
  'App\\MemberFirm': 'member_firm',
};

class UserEdit extends React.Component {
  state = {
    id: -1,
    name: '',
    email: '',
    number: '',
    valid_until: moment().format('YYYY-MM-DD HH:mm:ss'),
    password: '',
    groups: [],
    roles: [],
    onboarding: {
      d_form: {},
      workflow: {},
      reviewers: []
    },
    invited: null,
    activeTab: "1",
    selectOptions: {
      groups: [],
      roles: [],
    },
    default: {
      groups: [],
      roles: [],
    },
    modules: [],
    dFormSelects: [],
    workflowSelects: [],
    reviewersSelect: [],
    moduleSelects: [],
    reviewer: [{
      value: 'Manager',
      label: 'Manager',
      color: colorMultiSelect
    }],
    workflow: [{
      value: 'Onboarding',
      label: 'Onboarding',
      color: colorMultiSelect
    }],
    dForms: [],
    editField: null,
    errors: {},
    updatedAtText: '',
    refreshOnboarding: false,
    isStateConfig: false
  };

  constructor(props) {
    super(props);

    this.rfdc = new rfdc();
    this.groups = [];
    this.requestTimeout = null;
    this.onboardingTemplate = {
      d_form: {},
      workflow: {},
      reviewers: []
    };
    this.debounceOnSave = debounce(async (formData) => {
      this.submitOnboardingForm(formData)
    }, 1500);
  }

  toggle = tab => {
    this.setState({
      activeTab: tab
    })
  };

  removeCard = () => {
    const emptyUser = {id: -1};
    store.dispatch(setEditUser(emptyUser));
  };

  async getDForms() {
    const response = await workflowService.getDFormTemplateAll();
    const dForms = response.data.data;
    this.setState({dForms: dForms});
    const dFormSelects = this.getCustomSelects(dForms);
    this.setState({dFormSelects: dFormSelects})
  }

  async getWorkflows() {
    const response = await workflowService.getWorkflows();
    const workflows = response.data.data;
    this.setState({workflows: workflows});
    const workflowSelects = this.getCustomSelects(workflows);
    this.setState({workflowSelects: workflowSelects})
  }

  async getReviwers() {
    const response = await UserService.getAll();
    const reviewers = response.data.data;
    this.setState({reviewers: reviewers});
    const reviewersSelect = this.getCustomSelects(reviewers);
    this.setState({reviewersSelect: reviewersSelect})
  }

  async getModules() {
    const response = await workflowService.getModules();
    const modules = response.data.data;
    const moduleSelects = this.getCustomSelects(modules);
    this.setState({moduleSelects: moduleSelects});
  }

  getCustomSelect(obj, by = 'name') {
    return {
      value: obj,
      label: obj[by],
      color: colorMultiSelect
    }
  }

  getCustomSelectedValues(stateObj) {
    if (!stateObj || !Object.keys(stateObj).length) return [];
    return [
      this.getCustomSelect(stateObj)
    ]
  }

  getCustomSelects(arrValues) {
    return arrValues.map((value) => {
      return this.getCustomSelect(value);
    });
  }

  setDForm(values) {

    if (Array.isArray(values) && values.length) {
      values = values.pop().value;
    } else {
      values = {};
    }

    this.setState({onboarding: {...this.state.onboarding, d_form: values}}, () => {
    })
  }

  setWorkflow(values) {
    if (Array.isArray(values) && values.length) {
      values = values.pop().value;
    } else {
      values = {};
    }
    this.setState({onboarding: {...this.state.onboarding, workflow: values}})
  }

  setModules(values) {
    if (!Array.isArray(values)) {
      values = [];
    } else {
      values = values.map((value) => value.value);
    }
    this.setState({modules: values}, () => {
      this.submitData();
    });
  }

  setReviewers(values) {
    if (!Array.isArray(values)) {
      values = [];
    } else {
      values = values.map((value) => value.value);
    }
    this.setState({onboarding: {...this.state.onboarding, reviewers: values}})
  }

  async componentDidMount() {
    await this.getRoles();
    await this.getGroups();
    this.getUser();

    // onboarding
    await this.getDForms();
    await this.getWorkflows();
    await this.getReviwers();
    await this.getModules();
  }

  mapSelectValues = (selectValues) => {
    if (!selectValues) return [];
    return selectValues.map(select => select.value);
  }

  async componentDidUpdate(prevProps) {
    if (prevProps !== this.props) {
      await this.getUser();
    }
  }

  getUser = async () => {
    const user = this.props.user;

    const defaultGroups = user.groups.map(group => {
      return {
        value: {
          group_id: group.group_id,
          type: groupTypes[group.group_type]
        },
        label: this.getGroupName(this.groups, group.group_id, groupTypes[group.group_type]),
        color: colorMultiSelect
      }
    });

    const defaultRoles = user.roles.map((role) => {
      return {
        value: role,
        label: role,
        color: colorMultiSelect
      }
    });

    this.setState({
      ...this.state,
      ...user,
      onboarding: user.onboarding ? user.onboarding : this.onboardingTemplate,
      groups: defaultGroups,
      roles: defaultRoles
    })
  }

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

    this.setState({...this.state, selectOptions: {...this.state.selectOptions, roles: multiSelectRoles}})
  }

  getGroups = async () => {
    const response = await GroupService.getAll();
    const groups = response.data.data;

    this.groups = groups;

    const multiSelectGroups = prepareSelectData(groups)

    this.setState({...this.state, selectOptions: {...this.state.selectOptions, groups: multiSelectGroups}})
  }


  getGroupName = (groups, groupId, groupType) => {

    for (let admin of groups) {
      if (groupType === 'admin' && groupId === admin.id) {
        return `${admin.name}`
        // return `${admin.name}(${admin.id})`
      }

      for (let corporation of admin.corporations) {
        if (groupType === 'corporation' && groupId === corporation.id) {
          return `${corporation.name}`
          // return `${admin.name}(${admin.id})->${corporation.name}(${corporation.id})`
        }

        for (let network of corporation.networks) {
          if (groupType === 'network' && groupId === network.id) {
            return `${network.name}`
            // return `${admin.name}(${admin.id})->${corporation.name}(${corporation.id})->${network.name}(${network.id})`
          }

          for (let memberFirm of network.member_firms) {
            if (groupType === 'member_firm' && groupId === memberFirm.id) {
              return `${memberFirm.name}`
              // return `${admin.name}(${admin.id})->${corporation.name}(${corporation.id})->${network.name}(${network.id})->${memberFirm.name}(${memberFirm.id})`
            }
          }
          ;
        }
        ;
      }
      ;
    }
    return null;
  }

  getSelectRolesData = (user) => {
    return user.roles.map((role) => {
      return role.value;
    })
  }


  getSelectGroupsData = (user) => {
    return user.groups.map((group) => {
      return {
        ...group.value
      }
    });
  }

  getUserForSend = () => {
    let user = this.rfdc(this.state);
    user.groups = user.groups ? user.groups : []
    user.roles = user.roles ? user.roles : []
    user.groups = this.getSelectGroupsData(user);
    user.roles = this.getSelectRolesData(user);
    return user;
  }

  dispatchUserList = async () => {
    const nav = store.getState().user.list.nav;
    const response = await UserService.getByEmail(nav.searchVal, nav.currPage);
    const users = response.data.data;
    this.props.setUserList(users, nav);
  }

  dispatchEditUser = async () => {
    const userId = store.getState().userManagement.userEditing.id;
    if (userId > 0) {
      const response = await UserService.getUserById(userId);
      const user = response.data.data;
      store.dispatch(setEditUser(user));
    }
  }

  formSubmit = async (event) => {
    event.preventDefault();
    this.submitData();
  }

  formRolesSubmit = async () => {
    try {
      let user = this.getUserForSend();
      const response = await UserService.updateRoles(user);
      const updatedUser = response.data.data;
      store.dispatch(setEditUser(updatedUser));
      await this.dispatchUserList();
      toast.success('success')
      this.setState({...this.state, errors: {}})
    } catch (responseError) {
      this.getUser();
      // const errorStatus = responseError.response.status;
      const error = responseError.response.data.error;
      toast.error(error.message)
    }
  }

  async deleteOnboarding() {
    await workflowService.onboardingDelete(this.state.onboarding);
    this.dispatchUserList();
    this.dispatchEditUser();
  }

  submitData = async () => {
    try {
      let user = this.getUserForSend();
      const response = await UserService.updateUser(user);
      const updatedUser = response.data.data;
      store.dispatch(setEditUser(updatedUser));
      await this.dispatchUserList();
      toast.success('success')
      this.setState({...this.state, errors: {}})
    } catch (responseError) {
      if ('response' in responseError) {
        // const errorStatus = responseError.response.status;
        const error = responseError.response.data.error;
        this.getUser();
        toast.error(error.message);
        this.setState({...this.state, errors: {...error.errors}})
      } else {
        console.log(responseError);
      }
    }
  }

  async submitOnboardingForm(formData) {

    if (isEmpty(this.props.user.onboarding)) {
      return;
    }

    this.setState({
      updatedAtText: (
        <div className="d-flex">
          <div>Saving progress..</div>
          {<Spinner className="ml-1" color="success"/>}
        </div>
      )
    });
    const response = await workflowService.submitData(this.props.user.onboarding.d_form, formData);
    await this.dispatchUserList();
    this.setState({updatedAtText: `Progress saved: ${moment(response.data.updated_at).format('YYYY-MM-DD HH:mm:ss')}`});
    toast.success('success')
  }

  changeStateConfig(toggle) {
    this.setState({isStateConfig: toggle})
  }

  getDefaultUpdatedAtText() {
    return `Progress saved: ${moment(this.props.user.onboarding.d_form.updated_at).format('YYYY-MM-DD HH:mm:ss')}`;
  }

  async statusChanged(status) {
    await workflowService.changeStatus(this.props.user.onboarding.d_form, status);
    await this.dispatchUserList();
    toast.success('success')
  }

  formGroupsSubmit = async () => {
    try {
      let user = this.getUserForSend();
      const response = await UserService.updateGroups(user);
      const updatedUser = response.data.data;
      store.dispatch(setEditUser(updatedUser));
      await this.dispatchUserList();

      toast.success('success')
      this.setState({...this.state, errors: {}})
    } catch (responseError) {
      this.getUser();
      // const errorStatus = responseError.response.status;
      const error = responseError.response.data.error;
      toast.error(error.message)
    }
  }

  editField = (fieldName) => {
    this.setState({editField: fieldName});
  }

  isFieldEdit = (field) => {
    return this.state.editField === field;
  }

  editFieldSave = () => {
    this.submitData();
    this.setState({editField: null});
  }

  editFieldClose = () => {
    this.setState({...this.state, [this.state.editField]: this.props.user[this.state.editField]}, () => {
      this.setState({editField: null});
    });
  }

  onSelectRolesChange = (values) => {
    this.setState({roles: values}, () => {
      this.formRolesSubmit();
    })
  }

  refreshOnboarding() {

    this.setState({refreshOnboarding: true}, async () => {
      await this.dispatchUserList();
      await this.dispatchEditUser();
      this.setState({refreshOnboarding: false});
      this.reInitForm();
    });
  }

  onSelectGroupsChange = (values) => {

    this.setState({groups: values}, () => {
      this.formGroupsSubmit();
    })
  };

  selectNoRepeat(options, values) {
    return options.filter(select => !values.find((selectValue) => {
      return select.value.id === selectValue.value.id
    }))
  }

  cardClicked(event) {
    if (!this.state.editField) return;

    const editClicked = document.querySelectorAll('.edit-clicked');
    let isClose = true;
    for (let key in Object.keys(editClicked)) {
      if (editClicked[key].contains(event.target)) {
        isClose = false;
      }
    }
    if (isClose) {
      if (this.state.editField) {
        this.setState({[this.state.editField]: this.props.user[this.state.editField]});
      }

      this.setState({editField: null});
    }
  }

  async submitDForm(dForm, {name, description}) {

    const dFormChanges = clone(dForm);
    dFormChanges.name = name;
    dFormChanges.description = description;

    try {
      await workflowService.updateDForm(dFormChanges);
      toast.success('Success')
    } catch (error) {
      if ('response' in error) {
        if ('error' in error.response.data) {
          toast.error(error.response.data.error.message)
        }
      }
    }

  }

  modulesRender() {
    if (this.state.id !== this.props.user.id) return null;

    return (
      this.props.user && this.props.user.modules.length && this.props.user.modules.find((module) => module.name === 'Onboarding') ?
        <Row>
          <Col>
            <Nav tabs className="mt-2">
              <NavItem>
                <NavLink
                  className={classnames({
                    active: this.state.activeTab === "1"
                  })}
                  onClick={() => {
                    this.toggle("1")
                  }}
                >
                  <User size={16}/>
                  <span className="align-middle ml-50">Onboarding</span>
                </NavLink>
              </NavItem>
            </Nav>
            <TabContent activeTab={this.state.activeTab}>
              <TabPane tabId="1">
                <Row className="mx-0" col="12">
                  <Col className="pl-0" sm="12">
                    <Media className="d-sm-flex d-block">
                      <Media body>
                        <Row className="mt-1">
                          <Col md="12" lg="6">
                            <div className="users-page-view-table">
                              <div className="d-flex mb-1">
                                <div className="font-weight-bold column-sizing">dForm</div>
                                <div className="full-width">

                                  <Select
                                    isDisabled={!!this.props.user.onboarding}
                                    components={{DropdownIndicator: DropdownIndicatorClear}}
                                    value={this.getCustomSelectedValues(this.state.onboarding.d_form)}
                                    maxMenuHeight={200}
                                    isMulti
                                    isClearable={false}
                                    styles={colourStyles}
                                    options={this.selectNoRepeat(this.state.dFormSelects, this.getCustomSelectedValues(this.state.onboarding.d_form))}
                                    className="fix-margin-select"
                                    onChange={(values) => {
                                      this.setDForm(values)
                                    }}
                                    classNamePrefix="select"
                                    id="languages"
                                  />
                                </div>
                              </div>
                              <div className="d-flex mb-1">
                                <div className="font-weight-bold column-sizing">Reviewer</div>
                                <div className="full-width">

                                  <Select
                                    isDisabled={!!this.props.user.onboarding}
                                    components={{DropdownIndicator}}
                                    value={this.getCustomSelects(this.state.onboarding.reviewers)}
                                    maxMenuHeight={200}
                                    isMulti
                                    isClearable={false}
                                    styles={colourStyles}
                                    options={this.selectNoRepeat(this.state.reviewersSelect, this.getCustomSelects(this.state.onboarding.reviewers))}
                                    onChange={(values) => {
                                      this.setReviewers(values)
                                    }}
                                    className="fix-margin-select"
                                    classNamePrefix="select"
                                    id="languages"
                                  />

                                </div>
                              </div>
                              <div className="d-flex">
                                <div className="font-weight-bold column-sizing">Workflow</div>
                                <div className="full-width">

                                  <Select
                                    isDisabled={!!this.props.user.onboarding}
                                    components={{DropdownIndicator: DropdownIndicatorClear}}
                                    value={this.getCustomSelectedValues(this.state.onboarding.workflow)}
                                    maxMenuHeight={200}
                                    isMulti
                                    isClearable={false}
                                    styles={colourStyles}
                                    options={this.selectNoRepeat(this.state.workflowSelects, this.getCustomSelectedValues(this.state.onboarding.workflow))}
                                    onChange={(values) => {
                                      this.setWorkflow(values)
                                    }}
                                    className="fix-margin-select"
                                    classNamePrefix="select"
                                    id="languages"
                                  />

                                </div>
                              </div>

                            </div>
                          </Col>
                          <Col>
                            {
                              this.props.user.onboarding ? null :
                                <div className="d-flex justify-content-end flex-wrap mt-2">
                                  <Button className="mt-1" color="primary" onClick={() => {
                                    this.submitData()
                                  }}>Save</Button>
                                </div>
                            }
                            {
                              !this.props.user.onboarding ? null :
                                <div className="d-flex justify-content-end flex-wrap mt-2">
                                  <Button className="mt-1" color="danger" onClick={() => {
                                    this.deleteOnboarding()
                                  }}>Delete onboarding</Button>
                                </div>
                            }
                          </Col>

                          {
                            this.props.user.onboarding && this.props.user.onboarding.d_form ?
                              <Col md="12" className="mt-2 mb-4">
                                <Card className="border">
                                  <CardHeader className="m-0">
                                    <CardTitle>
                                      Onboarding dForm
                                    </CardTitle>
                                    <div>
                                      {
                                        this.state.isStateConfig ?
                                          <EyeOff size={15} className="cursor-pointer mr-1"
                                                  onClick={() => this.changeStateConfig(false)}/>
                                          :
                                          <Eye size={15} className="cursor-pointer mr-1"
                                               onClick={() => this.changeStateConfig(true)}/>
                                      }
                                      <RefreshCw
                                        className={`bg-hover-icon${this.state.refreshOnboarding ? ' rotating' : ''}`}
                                        size={15} onClick={(event) => {
                                        this.refreshOnboarding();
                                      }}/>
                                    </div>
                                  </CardHeader>
                                  <CardBody className="pt-0">
                                    <hr/>
                                    {
                                      // this.state.refreshOnboarding ?
                                      //   null :
                                      <FormCreate
                                        fileLoader={true}
                                        reInit={(reInit, context) => {
                                          this.reInitForm = reInit.bind(context)
                                        }}
                                        submitDForm={(dForm, data) => this.submitDForm(dForm, data)}
                                        liveValidate={false}
                                        inputDisabled={false}
                                        fill={true}
                                        onSaveButtonHidden={true}
                                        statusChanged={(value) => {
                                          this.statusChanged(value)
                                        }}
                                        onChange={(formData) => this.debounceOnSave(formData)}
                                        dForm={this.props.user.onboarding.d_form}
                                        isStateConfig={this.state.isStateConfig}
                                        updatedAtText={this.state.updatedAtText ? this.state.updatedAtText : this.getDefaultUpdatedAtText()}
                                      />
                                    }

                                  </CardBody>
                                </Card>
                              </Col>
                              :
                              null
                          }

                        </Row>

                      </Media>
                    </Media>
                  </Col>
                </Row>
              </TabPane>
            </TabContent>
          </Col>
        </Row>
        : null
    );
  }

  render() {

    const {
      name,
      email,
      number,
      valid_until,
      // password,
      // invited,
      // onboarding
    } = this.state;

    return <Card
      onClick={(event) => this.cardClicked(event)}
      className={classnames("card-action", {
        "d-none": this.props.user.id < 0 || !this.props.user.id
      })}>
      <CardHeader style={{'height': '68px'}}>
        <CardTitle className="font-weight-bold">
          <div className="d-flex edit-btn-trigger">
            <div className="edit-container edit-clicked">
              {
                this.isFieldEdit('name') ?
                  <FormGroup className="position-absolute input-divider-right" style={{
                    'margin-bottom': '0',
                    'padding': 0,
                    top: '-9px',
                    left: '-2px',
                    'min-width': '240px'
                  }}>
                    <Input
                      style={{'padding-right': 'calc(1.25 * 1em + 1.4rem + 1px + 32px)'}}
                      autoFocus
                      type="text"
                      name="name"
                      id="mobileVertical"
                      placeholder="Mobile"
                      value={name}
                      onChange={(event) => this.setState({name: event.target.value})}
                      {...{invalid: 'name' in this.state.errors}}
                    />
                    <div className="form-control-position" style={{'margin-bottom': '0', 'padding': 0}}
                         onClick={() => this.editFieldSave()}>
                      <Check className="bg-hover-icon" size={15}/>
                    </div>
                    <div className="form-control-position"
                         style={{'margin-bottom': '0', 'padding': 0, 'margin-right': '32px'}}
                         onClick={() => this.editFieldClose()}>
                      <X className="bg-hover-icon" size={15}/>
                    </div>
                    <FormFeedback>{'name' in this.state.errors ? this.state.errors['name'] : ''}</FormFeedback>
                  </FormGroup>
                  : <div onClick={() => this.editField('name')}>{name} <Edit2 className="edit-btn" size={15}/></div>
              }
            </div>
          </div>
        </CardTitle>
        <X size={15} onClick={this.removeCard}/>
      </CardHeader>
      <CardBody className="card-top-padding">
        <Form onSubmit={(event) => this.formSubmit(event)}>
          <Row className="mx-0" col="12">
            <Col className="pl-0" sm="12">
              <Media className="d-sm-flex d-block">
                <Media className="mt-md-1 mt-0" left>
                  <Media
                    className="rounded mr-2"
                    object
                    src={userImg}
                    alt="Generic placeholder image"
                    height="112"
                    width="112"
                  />
                </Media>
                <Media className="edit-clicked" body>
                  <Row className="mt-1">
                    <Col sm="9" md="6" lg="6">
                      <div className="users-page-view-table">
                        <div className="d-flex edit-btn-trigger">
                          <div className="font-weight-bold-lighter column-sizing-user-info"
                               onClick={() => this.editField('number')}>Number
                          </div>
                          <div className="edit-container">
                            {
                              this.isFieldEdit('number') ?
                                <FormGroup className="position-absolute input-divider-right"
                                           style={{'margin-bottom': '0', 'padding': 0, top: '-9px', left: '-2px'}}>
                                  <Input
                                    style={{'padding-right': 'calc(1.25 * 1em + 1.4rem + 1px + 32px)'}}
                                    autoFocus
                                    type="text"
                                    name="number"
                                    id="mobileVertical"
                                    placeholder="Mobile"
                                    value={number}
                                    onChange={(event) => this.setState({number: event.target.value})}
                                    {...{invalid: 'number' in this.state.errors}}
                                  />
                                  <div className="form-control-position" style={{'margin-bottom': '0', 'padding': 0}}
                                       onClick={() => this.editFieldSave()}>
                                    <Check className="bg-hover-icon" size={15}/>
                                  </div>
                                  <div className="form-control-position"
                                       style={{'margin-bottom': '0', 'padding': 0, 'margin-right': '32px'}}
                                       onClick={() => this.editFieldClose()}>
                                    <X className="bg-hover-icon" size={15}/>
                                  </div>
                                  <FormFeedback>{'number' in this.state.errors ? this.state.errors['number'] : ''}</FormFeedback>
                                </FormGroup>
                                : <div onClick={() => this.editField('number')}>{number} <Edit2 className="edit-btn"
                                                                                                size={15}/></div>
                            }
                          </div>
                        </div>
                        <div className="d-flex edit-btn-trigger">
                          <div className="font-weight-bold-lighter column-sizing-user-info"
                               onClick={() => this.editField('email')}>Email
                          </div>
                          <div className="edit-container">
                            {
                              this.isFieldEdit('email') ?
                                <FormGroup className="position-absolute input-divider-right"
                                           style={{'margin-bottom': '0', 'padding': 0, top: '-9px', left: '-2px'}}>
                                  <Input
                                    style={{'padding-right': 'calc(1.25 * 1em + 1.4rem + 1px + 32px)'}}
                                    autoFocus
                                    type="email"
                                    name="email"
                                    id="EmailVertical"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(event) => this.setState({email: event.target.value})}
                                    {...{invalid: 'email' in this.state.errors}}
                                  />
                                  <div className="form-control-position" style={{'margin-bottom': '0', 'padding': 0}}
                                       onClick={() => this.editFieldSave()}>
                                    <Check className="bg-hover-icon" size={15}/>
                                  </div>
                                  <div className="form-control-position"
                                       style={{'margin-bottom': '0', 'padding': 0, 'margin-right': '32px'}}
                                       onClick={() => this.editFieldClose()}>
                                    <X className="bg-hover-icon" size={15}/>
                                  </div>
                                  <FormFeedback>{'email' in this.state.errors ? this.state.errors['email'] : ''}</FormFeedback>
                                </FormGroup>
                                : <div onClick={() => this.editField('email')}>{email}<Edit2 className="edit-btn"
                                                                                             size={15}/></div>
                            }
                          </div>
                        </div>
                        <div className="d-flex edit-btn-trigger">
                          <div className="font-weight-bold-lighter column-sizing-user-info"
                               onClick={() => this.editField('valid_until')}>Valid until
                          </div>
                          <div className="edit-container">
                            {
                              this.isFieldEdit('valid_until') ?
                                <FormGroup className="position-absolute input-divider-right"
                                           style={{'margin-bottom': '0', 'padding': 0, top: '-9px', left: '-2px'}}>
                                  <Flatpickr
                                    style={{'padding-right': 'calc(1.25 * 1em + 1.4rem + 1px + 32px)'}}
                                    autoFocus
                                    name="valid_until"
                                    className="form-control"
                                    data-enable-time
                                    value={this.state.valid_until}
                                    onChange={date => {
                                      this.setState({valid_until: moment(date[0]).format('YYYY-MM-DD HH:mm:ss')});
                                    }}
                                  />
                                  <div className="form-control-position" style={{'margin-bottom': '0', 'padding': 0}}
                                       onClick={() => this.editFieldSave()}>
                                    <Check className="bg-hover-icon" size={15}/>
                                  </div>
                                  <div className="form-control-position"
                                       style={{'margin-bottom': '0', 'padding': 0, 'margin-right': '32px'}}
                                       onClick={() => this.editFieldClose()}>
                                    <X className="bg-hover-icon" size={15}/>
                                  </div>
                                  <FormFeedback>{'valid_until' in this.state.errors ? this.state.errors['valid_until'] : ''}</FormFeedback>
                                </FormGroup>
                                :
                                <div onClick={() => this.editField('valid_until')}>{valid_until}<Edit2
                                  className="edit-btn" size={15}/></div>
                            }

                          </div>
                        </div>
                        <div className="d-flex">
                          <div className="font-weight-bold-lighter column-sizing-user-info">Portal access</div>
                          <div>
                            {
                              this.props.user.invited && !this.props.user.invited.revoked_at ?
                                <InvitationCreate user={this.props.user} send={false} resend={true} trash={true}
                                                  invitationText="Resend invitation"/> :
                                this.props.user.invited && !this.props.user.invited.accepted_at ?
                                  <InvitationCreate user={this.props.user} send={false} resend={true} trash={true}
                                                    invitationText="Resend invitation"/> :
                                  this.props.user.invited && this.props.user.invited.accepted_at ? 'Invitation accepted' :
                                    this.props.user.roles.indexOf('prospect') === -1 && this.props.user.roles.length && this.props.user.groups.length ?
                                      'Allowed'
                                      : this.props.user.roles.indexOf('prospect') !== -1 && !this.props.user.groups.length ?
                                      <InvitationCreate send={true} resend={false} trash={false}
                                                        user={this.props.user}/>
                                      : 'User cannot be invited'
                            }

                          </div>
                        </div>
                      </div>
                    </Col>
                    <Col md="12" lg="6" className="mt-md-2 mt-lg-0 mb-sm-2">
                      <div className="users-page-view-table">
                        <div className="d-flex mb-1">
                          <div className="font-weight-bold column-sizing">Roles</div>
                          <div className="full-width">
                            {/* <Form onSubmit={(event) => this.formRolesSubmit(event)}>
                                                            <FormGroup> */}
                            <Select
                              components={{DropdownIndicator}}
                              value={this.state.roles}
                              maxMenuHeight={200}
                              isMulti
                              isClearable={false}
                              styles={colourStyles}
                              options={this.state.selectOptions.roles}
                              className="fix-margin-select"
                              onChange={(values) => {
                                this.onSelectRolesChange(values)
                              }}
                              classNamePrefix="select"
                              id="languages"
                            />
                            {/* </FormGroup>
                                                        </Form> */}
                          </div>
                        </div>
                        <div className="d-flex mb-1">
                          <div className="font-weight-bold column-sizing">Organisations</div>
                          <div className="full-width">
                            {/* <Form onSubmit={(event) => this.formGroupsSubmit(event)}>
                                                            <FormGroup> */}
                            {/* <h5 className="text-bold-500">Groups</h5> */}
                            <Select
                              components={{DropdownIndicator}}
                              value={this.state.groups}
                              maxMenuHeight={200}
                              isMulti
                              isClearable={false}
                              styles={colourStyles}
                              options={this.state.selectOptions.groups}
                              onChange={(values) => {
                                this.onSelectGroupsChange(values)
                              }}
                              className="fix-margin-select"
                              classNamePrefix="select"
                              id="languages"
                            />
                            {/* </FormGroup>
                                                        </Form> */}
                          </div>
                        </div>
                        <div className="d-flex">
                          <div className="font-weight-bold column-sizing">Modules</div>
                          <div className="full-width">

                            <Select
                              disabled={true}
                              components={{DropdownIndicator: DropdownIndicatorClear}}
                              value={this.getCustomSelects(this.state.modules)}
                              maxMenuHeight={200}
                              isMulti
                              isClearable={false}
                              styles={colourStyles}
                              options={this.selectNoRepeat(this.state.moduleSelects, this.getCustomSelects(this.state.modules))}
                              className="fix-margin-select"
                              onChange={(values) => {
                                this.setModules(values)
                              }}
                              classNamePrefix="select"
                              id="languages"
                            />
                          </div>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Media>
              </Media>
            </Col>
          </Row>
        </Form>
        {this.modulesRender()}

      </CardBody>
    </Card>
  }
}

const mapStateToProps = state => {
  return {
    user: state.userManagement.userEditing,
  }
};
const mapActionsToProps = (dispatch) => {
  return {
    setUserList: bindActionCreators(setUserList, dispatch)
  }
};
export default connect(mapStateToProps, mapActionsToProps)(UserEdit)
