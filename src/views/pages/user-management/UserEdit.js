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
  Media, Spinner,
  UncontrolledTooltip,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
} from "reactstrap"
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/light.css";
import "../../../assets/scss/plugins/forms/flatpickr/flatpickr.scss"
import Select, {components} from "react-select"
import classnames from "classnames"
import GroupService from '../../../services/group.service'
import RoleService from '../../../services/role.service'
import UserService from '../../../services/user.service'
import groupsRelationsService from '../../../services/groupsRelations.service'
import moment from 'moment';
import {toast} from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import "../../../assets/scss/plugins/extensions/toastr.scss"
import {User, X, Check, Plus, Edit2, RefreshCw, EyeOff, Eye} from "react-feather"
import {store} from '../../../redux/storeConfig/store'
import {setEditUser} from '../../../redux/actions/user-management/userEditActions'
import InvitationCreate from '../invitation/InvitationCreate'
import {connect} from "react-redux"
import {setUserList, setUserProfile} from '../../../redux/actions/user/userActions'
import {bindActionCreators} from "redux"
import workflowService from "../../../services/workflow.service";
import FormCreate from "../onboarding/FormCreate/FormCreate";
import {debounce, isEmpty} from 'lodash';
import {colourStyles} from "utility/select/selectSettigns";
import {prepareSelectData} from "utility/select/prepareSelectData";
import DataTable, {createTheme} from "react-data-table-component"
import Checkbox from "../../../components/@vuexy/checkbox/CheckboxesVuexy";
import UserAvatar from "./User/UserAvatar"
import {MultiSelectOrganization} from "../../../components/MultiSelect/MultiSelectOrganizations";
import OrganizationPermissionsModal from '../../../components/modals/OrganizationPermissionsModal'

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
    first_name: '',
    last_name: '',
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
    // managersSelect: [],
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
    selectedOrganization: {},
    userAvatar: '',
    onboardingTemplate: {},
    onboardingViewState: '',
    selectedOnboarding: {},
    dForms: [],
    editField: null,
    errors: {},
    updatedAtText: '',
    refreshOnboarding: false,
    isStateConfig: false,
    isDisabledGroups: false
  };

  constructor(props) {
    super(props);

    this.rfdc = new rfdc();
    this.groups = [];
    this.requestTimeout = null;
    this.onboardingTemplate = {
      d_form: {},
      workflow: {},
      reviewers: [],
      is_internal: false,
      // managers: [],
    };
    this.debounceOnSave = debounce(async (formData) => {
      this.submitOnboardingForm(formData)
    }, 1500);

    this.onboardingColumnDefs = {
      sortable: true,
      suppressSizeToFit: false,
      resizable: true,
    };
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
    const response = await workflowService.getDFormTemplateAllowed();
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
    // todo separate managers
    this.setState({reviewers: reviewers});
    const reviewersSelect = this.getCustomSelects(reviewers, ['first_name', 'last_name']);
    this.setState({reviewersSelect: reviewersSelect})
  }

  async getModules() {
    const response = await workflowService.getModules();
    const modules = response.data.data;
    const moduleSelects = this.getCustomSelects(modules);
    this.setState({moduleSelects: moduleSelects});
  }

  getCustomSelect(obj, by = 'name') {

    let label = '';

    if (Array.isArray(by)) {
      label = by.map(nextBy => obj[nextBy]).join(' ');
    } else {
      label = obj[by];
    }

    return {
      value: obj,
      label: label,
      color: colorMultiSelect
    }
  }

  getCustomSelectedValues(stateObj) {
    if (!stateObj || !Object.keys(stateObj).length) return [];
    return [
      this.getCustomSelect(stateObj)
    ]
  }

  getCustomSelects(arrValues, keyProp = 'name') {
    return arrValues.map((value) => {
      return this.getCustomSelect(value, keyProp);
    });
  }

  setDFormCreate(values) {

    if (Array.isArray(values) && values.length) {
      values = values.pop().value;
    } else {
      values = {};
    }

    this.setState({onboardingTemplate: {...this.state.onboardingTemplate, d_form: values}}, () => {
    })
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

  setWorkflowCreate(values) {
    if (Array.isArray(values) && values.length) {
      values = values.pop().value;
    } else {
      values = {};
    }
    this.setState({onboardingTemplate: {...this.state.onboardingTemplate, workflow: values}})
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

  setReviewersCreate(values) {
    if (!Array.isArray(values)) {
      values = [];
    } else {
      values = values.map((value) => value.value);
    }
    this.setState({onboardingTemplate: {...this.state.onboardingTemplate, reviewers: values}})
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

    await this.getGroupsRelations();
    // await this.getDForms();
    // await this.getWorkflows();
    await this.getReviwers();
    await this.getModules();
  }

  async getGroupsRelations() {
    const response = await groupsRelationsService.getByUserId(this.props.user.id);
    const dForms = response.data.data.dForms;
    const workflows = response.data.data.workflows;
    this.setState({dForms, workflows});
    const dFormSelects = this.getCustomSelects(dForms);
    const workflowSelects = this.getCustomSelects(workflows);
    this.setState({dFormSelects, workflowSelects})
  }

  mapSelectValues = (selectValues) => {
    if (!selectValues) return [];
    return selectValues.map(select => select.value);
  };

  async componentDidUpdate(prevProps) {
    if (prevProps !== this.props) {
      if (prevProps.user.id !== this.props.user.id) {
        await this.getUser();
        this.setState({onboardingViewState: '', selectedOnboarding: {}})
      }
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

    this.setState({...this.state, selectOptions: {...this.state.selectOptions, roles: multiSelectRoles}})
  };

  getGroups = async () => {
    const response = await GroupService.getAll();
    const groups = response.data.data;

    this.groups = groups;

    const multiSelectGroups = prepareSelectData(groups);

    this.setState({...this.state, selectOptions: {...this.state.selectOptions, groups: multiSelectGroups}})
  };


  getGroupName = (groups, groupId, groupType) => {


    for (let corporation of groups) {
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

      }


    }
    return null;
  };

  getSelectRolesData = (user) => {
    return user.roles.map((role) => {
      return role.value;
    })
  };


  getSelectGroupsData = (user) => {
    return user.groups.map((group) => {
      return {
        ...group.value
      }
    });
  };

  getUserForSend = () => {
    let user = this.rfdc(this.state);
    user.groups = user.groups ? user.groups : [];
    user.roles = user.roles ? user.roles : [];
    user.groups = this.getSelectGroupsData(user);
    user.roles = this.getSelectRolesData(user);
    return user;
  };

  dispatchUserList = async () => {
    const nav = store.getState().user.list.nav;
    const response = await UserService.getByEmail(nav.searchVal, nav.currPage);
    const users = response.data.data;
    this.props.setUserList(users, nav);
  };

  dispatchEditUser = async () => {
    const userId = store.getState().userManagement.userEditing.id;
    if (userId > 0) {
      const response = await UserService.getUserById(userId);
      const user = response.data.data;
      store.dispatch(setEditUser(user));
      if (this.props.userProfile.id === user.id) {
        store.dispatch(setUserProfile(user));
      }
    }
  };

  formSubmit = async (event) => {
    event.preventDefault();
    this.submitData();
  };

  formRolesSubmit = async () => {
    try {
      let user = this.getUserForSend();
      const response = await UserService.updateRoles(user);
      const updatedUser = response.data.data;
      store.dispatch(setEditUser(updatedUser));
      await this.dispatchUserList();
      toast.success('success');
      this.setState({...this.state, errors: {}})
    } catch (responseError) {
      this.getUser();
      // const errorStatus = responseError.response.status;
      const error = responseError.response.data.error;
      toast.error(error.message)
    }
  };

  async deleteOnboarding() {
    await workflowService.onboardingDelete(this.state.selectedOnboarding);
    this.dispatchUserList();
    this.dispatchEditUser();
    this.setState({onboardingViewState: '', onboardingTemplate: this.onboardingTemplate, selectedOnboarding: {}})
  }

  async createOnboarding() {
    try {
      await workflowService.onboardingCreate({user_id: this.props.user.id, ...this.state.onboardingTemplate});
      await this.dispatchUserList();
      await this.dispatchEditUser();
      this.setState({onboardingViewState: '', onboardingTemplate: this.onboardingTemplate, selectedOnboarding: {}})
    } catch (responseError) {
      if ('response' in responseError) {
        const error = responseError.response.data.error;
        toast.error(error.message);
      }
    }
  }

  submitData = async () => {
    try {
      let user = this.getUserForSend();
      const response = await UserService.updateUser(user);
      const updatedUser = response.data.data;
      store.dispatch(setEditUser(updatedUser));
      await this.dispatchUserList();
      toast.success('success');
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
      throw responseError;
    }
  };

  async submitOnboardingForm(formData) {

    if (isEmpty(this.props.user.onboardings)) {
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
    const response = await workflowService.submitData(this.state.selectedOnboarding.d_form, formData);
    await this.dispatchUserList();
    await this.dispatchEditUser();
    this.setState({updatedAtText: `Progress saved: ${moment(response.data.updated_at).format('YYYY-MM-DD HH:mm:ss')}`});
    toast.success('success')
  }

  changeStateConfig(toggle) {
    this.setState({isStateConfig: toggle})
  }

  getDefaultUpdatedAtText() {
    return `Progress saved: ${moment(this.state.selectedOnboarding.d_form.updated_at).format('YYYY-MM-DD HH:mm:ss')}`;
  }

  async statusChanged(status) {
    await workflowService.changeStatus(this.state.selectedOnboarding.d_form, status);
    await this.dispatchUserList();
    toast.success('success')
  }

  submitAddGroup = async (group) => {
    let user = this.getUserForSend();
    const response = await UserService.addGroup(user.id, group);
    const updatedUser = response.data.data;
    store.dispatch(setEditUser(updatedUser));
    await this.dispatchUserList();
    await this.getGroupsRelations();
    toast.success('success');
    this.setState({...this.state, errors: {}})
  };

  submitRemoveGroup = async (group) => {
    let user = this.getUserForSend();
    const response = await UserService.removeGroup(user.id, group);
    const updatedUser = response.data.data;
    store.dispatch(setEditUser(updatedUser));
    await this.dispatchUserList();
    await this.getGroupsRelations();
    toast.success('success');
    this.setState({...this.state, errors: {}})
  };

  createViewOnboarding() {
    this.setState({onboardingViewState: 'create', onboardingTemplate: this.onboardingTemplate, selectedOnboarding: {}})
  }

  closeCreateOnboarding() {
    this.setState({onboardingViewState: '', onboardingTemplate: this.onboardingTemplate})
  }

  editField = (fieldName) => {
    this.setState({editField: fieldName});
  };

  isFieldEdit = (field) => {
    let editedField = this.state.editField,
      currField = field;
    if (Array.isArray(field)) {
      currField = field.join();
    }
    if (Array.isArray(this.state.editField)) {
      editedField = this.state.editField.join();
    }

    return editedField === currField;
  };

  editFieldSave = async () => {
    try {
      await this.submitData();
      this.setState({editField: null});
      await this.dispatchEditUser();
    } catch (e) {
      return false;
    }
  };

  setEmptyEditField() {
    this.setState({editField: null});
  }

  editFieldClose = () => {
    if (Array.isArray(this.state.editField)) {
      let editingData = {};
      this.state.editField.forEach((editField) => {
        editingData[editField] = this.props.user[editField];
      });
      this.setState({...this.state, ...editingData}, () => {
        this.setEmptyEditField();
      });
    } else {
      this.setState({...this.state, [this.state.editField]: this.props.user[this.state.editField]}, () => {
        this.setEmptyEditField();
      });
    }
  };

  onSelectRolesChange = (values) => {
    this.setState({roles: values}, () => {
      this.formRolesSubmit();
    })
  };

  refreshOnboarding() {

    this.setState({refreshOnboarding: true}, async () => {
      await this.dispatchUserList();
      await this.dispatchEditUser();
      this.updateSelectedOnboarding();
      this.setState({refreshOnboarding: false});
      this.reInitForm();
    });
  }

  updateSelectedOnboarding() {
    let updatedCurrOnboarding = this.props.user.onboardings.find(onboarding => onboarding.id === this.state.selectedOnboarding.id);
    if (!updatedCurrOnboarding) {
      return;
    }
    this.setState({selectedOnboarding: updatedCurrOnboarding})
  }

  refreshOnboardingState() {

    this.setState({refreshOnboarding: true}, async () => {
      this.setState({refreshOnboarding: false});
      this.reInitForm();
    });
  }

  onSelectGroupsChange = async (values) => {

    this.setState({isDisabledGroups: true});

    let deleted = [];
    let added = [];
    let group;

    let isAdd = false;

    if (!values) {
      group = this.state.groups[0].value;
      isAdd = false;
    } else if ((Array.isArray(this.state.groups) && !this.state.groups.length) || !this.state.groups) {
      group = values[0].value;
      isAdd = true;
    } else {
      added = values.filter(next => !this.state.groups.includes(next));
      deleted = this.state.groups.filter(next => !values.includes(next));
      if (added.length) {
        group = added[0].value;
        isAdd = true;
      } else {
        group = deleted[0].value;
        isAdd = false;
      }
    }

    try {
      if (isAdd) {
        await this.submitAddGroup(group);
      } else {
        await this.submitRemoveGroup(group);
      }
      this.setState({groups: values})
    } catch (responseError) {
      this.getUser();
      const error = responseError.response.data.error;
      toast.error(error.message)
    } finally {
      this.setState({isDisabledGroups: false})
    }
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

  async submitDForm(dForm, {name, description, protected_properties}) {

    const dFormChanges = clone(dForm);
    dFormChanges.name = name;
    dFormChanges.description = description;
    dFormChanges.protected_properties = protected_properties;

    try {
      await workflowService.updateDForm(dFormChanges);
      toast.success('Success');
      this.dispatchUserList();
      this.dispatchEditUser();
    } catch (error) {
      if ('response' in error) {
        if ('error' in error.response.data) {
          toast.error(error.response.data.error.message)
        }
      }
    }

  }

  closeOnboarding() {
    this.setState({selectedOnboarding: {}, onboardingViewState: '', onboardingTemplate: this.onboardingTemplate});
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
                  <Col md="12" className="ml-0 pl-0">
                    <div className="d-flex justify-content-end flex-wrap mt-2">
                      <Button className="mt-1" color="primary" onClick={() => {
                        this.createViewOnboarding()
                      }}>Create</Button>
                    </div>
                  </Col>
                  <Col md="12" className="ml-0 pl-0">
                    <DataTable
                      data={this.props.user.onboardings}
                      columns={[
                        // {
                        //   name: "Id",
                        //   selector: "id",
                        //   sortable: true
                        // },
                        {
                          name: 'DForm',
                          cell: (onboarding) => {
                            return onboarding.d_form.name
                          }
                        },
                        {
                          name: 'Reviewers',
                          cell: (onboarding) => {
                            return onboarding.reviewers.map(reviewer => reviewer.first_name + ' ' + reviewer.last_name).join(', ')
                          }
                        },
                        {
                          name: 'Workflow',
                          cell: (onboarding) => {
                            return onboarding.workflow.name;
                          }
                        },
                        // {
                        //   name: 'Allowed',
                        //   cell: (onboarding) => {
                        //     if(!onboarding.managers.length) {
                        //       return 'Visible to all managers'
                        //     }
                        //     return onboarding.managers.map(manager => manager.name).join(', ')
                        //   }
                        // },
                        {
                          name: 'Private',
                          cell: (onboarding) => {
                            if (onboarding.is_internal) {
                              return 'For reviewers only'
                            }
                            return ''
                          }
                        },
                      ]}
                      Clicked
                      onRowClicked={(onboarding) => {
                        this.setState({selectedOnboarding: clone(onboarding), onboardingViewState: 'edit'}, () => {
                          this.refreshOnboardingState();
                          this.setState({onboardingViewState: 'edit'})
                        })
                      }}
                      conditionalRowStyles={[
                        {
                          when: row => row.id === this.state.selectedOnboarding.id,
                          style: row => ({
                            backgroundColor: '#007bff',
                            color: 'white'
                          }),
                        }
                      ]}
                      noHeader
                    />
                  </Col>
                  {
                    this.state.onboardingViewState !== 'create' ? null :
                      <Col md="12" lg="12" className="pl-0 ml-0 mt-2">
                        <Card className="border mb-0">
                          <CardHeader className="m-0">
                            <CardTitle>
                              Onboarding create
                            </CardTitle>
                            <X size={15} onClick={() => this.closeCreateOnboarding()}/>
                          </CardHeader>
                          <CardBody className="pt-0">
                            <hr/>
                            <div className="mt-3">
                              <div className="users-page-view-table">
                                <div className="d-flex mb-1">
                                  <div className="font-weight-bold column-sizing">dForm</div>
                                  <div className="full-width">

                                    <Select
                                      components={{DropdownIndicator: DropdownIndicatorClear}}
                                      value={this.getCustomSelectedValues(this.state.onboardingTemplate.d_form)}
                                      maxMenuHeight={200}
                                      isMulti
                                      isClearable={false}
                                      styles={colourStyles}
                                      options={this.selectNoRepeat(this.state.dFormSelects, this.getCustomSelectedValues(this.state.onboardingTemplate.d_form))}
                                      className="fix-margin-select"
                                      onChange={(values) => {
                                        this.setDFormCreate(values)
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
                                      components={{DropdownIndicator}}
                                      value={this.getCustomSelects(this.state.onboardingTemplate.reviewers, ['first_name', 'last_name'])}
                                      maxMenuHeight={200}
                                      isMulti
                                      isClearable={false}
                                      styles={colourStyles}
                                      options={this.selectNoRepeat(this.state.reviewersSelect, this.getCustomSelects(this.state.onboardingTemplate.reviewers, ['first_name', 'last_name']))}
                                      onChange={(values) => {
                                        this.setReviewersCreate(values)
                                      }}
                                      className="fix-margin-select"
                                      classNamePrefix="select"
                                      id="languages"
                                    />

                                  </div>
                                </div>
                                <div className="d-flex mb-1">
                                  <div className="font-weight-bold column-sizing">Workflow</div>
                                  <div className="full-width">

                                    <Select
                                      components={{DropdownIndicator: DropdownIndicatorClear}}
                                      value={this.getCustomSelectedValues(this.state.onboardingTemplate.workflow)}
                                      maxMenuHeight={200}
                                      isMulti
                                      isClearable={false}
                                      styles={colourStyles}
                                      options={this.selectNoRepeat(this.state.workflowSelects, this.getCustomSelectedValues(this.state.onboardingTemplate.workflow))}
                                      onChange={(values) => {
                                        this.setWorkflowCreate(values)
                                      }}
                                      className="fix-margin-select"
                                      classNamePrefix="select"
                                      id="languages"
                                    />

                                  </div>
                                </div>
                                <div className="d-flex">
                                  <div className="font-weight-bold column-sizing">Private</div>
                                  <div className="" id="onboarding-create-config-is-internal">
                                    <Checkbox
                                      size="sm"
                                      color="primary"
                                      icon={<Check className="vx-icon" size={12}/>}
                                      label=""
                                      checked={this.state.onboardingTemplate.is_internal}
                                      onChange={(event) => this.setState({
                                        onboardingTemplate: {
                                          ...this.state.onboardingTemplate,
                                          is_internal: event.target.checked
                                        }
                                      })}
                                    />

                                  </div>
                                  <UncontrolledTooltip placement="right" target="onboarding-create-config-is-internal">
                                    For reviewers only
                                  </UncontrolledTooltip>
                                </div>

                                {/*<div className="d-flex">*/}
                                {/*  <div className="font-weight-bold column-sizing">Allowed</div>*/}
                                {/*  <div className="full-width">*/}
                                {/*    <Select*/}
                                {/*      components={{DropdownIndicator}}*/}
                                {/*      value={this.getCustomSelects(this.state.onboardingTemplate.managers)}*/}
                                {/*      maxMenuHeight={200}*/}
                                {/*      isMulti*/}
                                {/*      isClearable={false}*/}
                                {/*      styles={colourStyles}*/}
                                {/*      options={this.selectNoRepeat(this.state.managersSelect, this.getCustomSelects(this.state.onboardingTemplate.managers))}*/}
                                {/*      onChange={(values) => {*/}
                                {/*        this.setManagerCreate(values)*/}
                                {/*      }}*/}
                                {/*      className="fix-margin-select"*/}
                                {/*      classNamePrefix="select"*/}
                                {/*      id="languages"*/}
                                {/*    />*/}
                                {/*  </div>*/}
                                {/*</div>*/}

                              </div>
                              <div>
                                {
                                  <div className="d-flex justify-content-end flex-wrap mt-2">
                                    <Button className="mt-1" color="primary" onClick={() => {
                                      this.createOnboarding()
                                    }}>Save</Button>
                                  </div>
                                }
                              </div>
                            </div>

                          </CardBody>
                        </Card>
                      </Col>
                  }
                  {
                    isEmpty(this.state.selectedOnboarding) || this.state.onboardingViewState !== 'edit' ? null :
                      <Col md="12" lg="12" className="pl-0 ml-0 mt-2">
                        <Card className="border mb-0">
                          <CardHeader className="m-0">
                            <CardTitle>
                              Onboarding settings
                            </CardTitle>
                            <X size={15} onClick={() => this.closeOnboarding()}/>
                          </CardHeader>
                          <CardBody className="pt-0">
                            <hr/>
                            <div className="mt-3">
                              <div className="users-page-view-table">
                                <div className="d-flex mb-1">
                                  <div className="font-weight-bold column-sizing">dForm</div>
                                  <div className="full-width">

                                    <Select
                                      isDisabled={true}
                                      components={{DropdownIndicator: DropdownIndicatorClear}}
                                      value={this.getCustomSelectedValues(this.state.selectedOnboarding.d_form)}
                                      maxMenuHeight={200}
                                      isMulti
                                      isClearable={false}
                                      styles={colourStyles}
                                      options={this.selectNoRepeat(this.state.dFormSelects, this.getCustomSelectedValues(this.state.selectedOnboarding.d_form))}
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
                                      isDisabled={true}
                                      components={{DropdownIndicator}}
                                      value={this.getCustomSelects(this.state.selectedOnboarding.reviewers, ['first_name', 'last_name'])}
                                      maxMenuHeight={200}
                                      isMulti
                                      isClearable={false}
                                      styles={colourStyles}
                                      options={this.selectNoRepeat(this.state.reviewersSelect, this.getCustomSelects(this.state.selectedOnboarding.reviewers, ['first_name', 'last_name']))}
                                      onChange={(values) => {
                                        this.setReviewers(values)
                                      }}
                                      className="fix-margin-select"
                                      classNamePrefix="select"
                                      id="languages"
                                    />

                                  </div>
                                </div>
                                <div className="d-flex mb-1">
                                  <div className="font-weight-bold column-sizing">Workflow</div>
                                  <div className="full-width">

                                    <Select
                                      isDisabled={true}
                                      components={{DropdownIndicator: DropdownIndicatorClear}}
                                      value={this.getCustomSelectedValues(this.state.selectedOnboarding.workflow)}
                                      maxMenuHeight={200}
                                      isMulti
                                      isClearable={false}
                                      styles={colourStyles}
                                      options={this.selectNoRepeat(this.state.workflowSelects, this.getCustomSelectedValues(this.state.selectedOnboarding.workflow))}
                                      onChange={(values) => {
                                        this.setWorkflow(values)
                                      }}
                                      className="fix-margin-select"
                                      classNamePrefix="select"
                                      id="languages"
                                    />

                                  </div>
                                </div>
                                <div className="d-flex">
                                  <div className="font-weight-bold column-sizing">Private</div>
                                  <div className="" id="onboarding-edit-config-is-internal">

                                    <Checkbox
                                      disabled={true}
                                      size="sm"
                                      color="primary"
                                      icon={<Check className="vx-icon" size={12}/>}
                                      label=""
                                      checked={this.state.selectedOnboarding.is_internal}
                                      onChange={(event) => this.setState({
                                        selectedOnboarding: {
                                          ...this.state.selectedOnboarding,
                                          is_internal: event.target.checked
                                        }
                                      })}
                                    />

                                  </div>
                                  <UncontrolledTooltip placement="right" target="onboarding-edit-config-is-internal">
                                    For reviewers only
                                  </UncontrolledTooltip>
                                </div>
                                {/*<div className="d-flex mb-1">*/}
                                {/*  <div className="font-weight-bold column-sizing">Allowed</div>*/}
                                {/*  <div className="full-width">*/}

                                {/*    <Select*/}
                                {/*      isDisabled={true}*/}
                                {/*      components={{DropdownIndicator}}*/}
                                {/*      value={this.getCustomSelects(this.state.selectedOnboarding.managers)}*/}
                                {/*      maxMenuHeight={200}*/}
                                {/*      isMulti*/}
                                {/*      isClearable={false}*/}
                                {/*      styles={colourStyles}*/}
                                {/*      options={this.selectNoRepeat(this.state.managersSelect, this.getCustomSelects(this.state.selectedOnboarding.managers))}*/}
                                {/*      onChange={(values) => {*/}
                                {/*        this.setManagers(values)*/}
                                {/*      }}*/}
                                {/*      className="fix-margin-select"*/}
                                {/*      classNamePrefix="select"*/}
                                {/*      id="languages"*/}
                                {/*    />*/}

                                {/*  </div>*/}
                                {/*</div>*/}

                              </div>
                              <div>
                                {
                                  isEmpty(this.state.selectedOnboarding) ? null :
                                    <div className="d-flex justify-content-end flex-wrap mt-2">
                                      <Button className="mt-1" color="danger" onClick={() => {
                                        window.confirm("Are you sure?") && this.deleteOnboarding()
                                      }}>Delete onboarding</Button>
                                    </div>
                                }
                              </div>
                            </div>

                          </CardBody>
                        </Card>
                      </Col>
                  }
                  {
                    isEmpty(this.state.selectedOnboarding) || this.state.onboardingViewState !== 'edit' ? null :
                      <Col className="pl-0" sm="12">
                        <Media className="d-sm-flex d-block">
                          <Media body>
                            <Row className="mt-1">
                              {
                                !isEmpty(this.state.selectedOnboarding) && !isEmpty(this.state.selectedOnboarding.d_form) ?
                                  <Col md="12" className="mb-4">
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
                                          isEmpty(this.state.selectedOnboarding) ? null :
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
                                              dForm={this.state.selectedOnboarding.d_form}
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
                  }

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
      first_name,
      last_name,
      email,
      number,
      valid_until,
      postcode
      // password,
      // invited,
      // onboarding
    } = this.state;

    const CustomOptionComponent = ({innerProps, innerRef}) =>
      (<div className="test123" ref={innerRef} {...innerProps} />);


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
                this.isFieldEdit(['first_name', 'last_name']) ?
                  <FormGroup className="position-absolute input-divider-right z-index" style={{
                    'margin-bottom': '0',
                    'padding': 0,
                    top: '-9px',
                    left: '-2px',
                    'min-width': '480px',
                  }}>
                    <div className="d-flex">
                      <InputGroup>
                        <InputGroupAddon addonType="prepend">First name</InputGroupAddon>
                        <Input
                          autoFocus
                          type="text"
                          name="name"
                          id="mobileVertical"
                          placeholder="First name"
                          value={first_name}
                          onChange={(event) => this.setState({first_name: event.target.value})}
                          {...{invalid: 'first_name' in this.state.errors}}
                          style={{
                            'border-radius': '0 0 2px 2px'
                          }}
                        />
                      </InputGroup>
                      <InputGroup>
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText style={{
                            'border-radius': '2px 2px 0 0'
                          }}>
                            Last name
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input
                          style={{'padding-right': 'calc(1.25 * 1em + 1.4rem + 1px + 32px)'}}
                          autoFocus
                          type="text"
                          name="name"
                          id="mobileVertical"
                          placeholder="Last name"
                          value={last_name}
                          onChange={(event) => this.setState({last_name: event.target.value})}
                          {...{invalid: 'last_name' in this.state.errors}}

                        />
                      </InputGroup>
                    </div>

                    <div className="form-control-position z-index-9" style={{'margin-bottom': '0', 'padding': 0}}
                         onClick={() => this.editFieldSave()}>
                      <Check className="bg-hover-icon" size={15}/>
                    </div>
                    <div className="form-control-position z-index-9"
                         style={{'margin-bottom': '0', 'padding': 0, 'margin-right': '32px'}}
                         onClick={() => this.editFieldClose()}>
                      <X className="bg-hover-icon" size={15}/>
                    </div>
                    <FormFeedback>{'first_name' in this.state.errors ? this.state.errors['first_name'] : ''}</FormFeedback>
                  </FormGroup>
                  :
                  <div
                    onClick={() => this.editField(['first_name', 'last_name'])}>{(first_name || 'No name') + ' ' + (last_name || '')}
                    <Edit2
                      className="edit-btn" size={15}/></div>
              }

            </div>
          </div>
        </CardTitle>
        <X size={15} className="x-close-position" onClick={this.removeCard}/>
      </CardHeader>
      <CardBody className="card-top-padding">
        <Form onSubmit={(event) => this.formSubmit(event)}>
          <Row className="mx-0" col="12">
            <Col className="pl-0" sm="12">
              <Media className="d-sm-flex d-block">
                <UserAvatar avatar={this.props.user.avatar} userId={this.props.user.id}/>
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
                                    placeholder="Phone number"
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
                               onClick={() => this.editField('postcode')}>Postcode
                          </div>
                          <div className="edit-container">
                            {
                              this.isFieldEdit('postcode') ?
                                <FormGroup className="position-absolute input-divider-right"
                                           style={{'margin-bottom': '0', 'padding': 0, top: '-9px', left: '-2px'}}>
                                  <Input
                                    style={{'padding-right': 'calc(1.25 * 1em + 1.4rem + 1px + 32px)'}}
                                    autoFocus
                                    type="text"
                                    name="postcode"
                                    id="mobileVertical"
                                    placeholder="Postcode"
                                    value={postcode}
                                    onChange={(event) => this.setState({postcode: event.target.value})}
                                    {...{invalid: 'postcode' in this.state.errors}}
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
                                  <FormFeedback>{'postcode' in this.state.errors ? this.state.errors['postcode'] : ''}</FormFeedback>
                                </FormGroup>
                                : <div onClick={() => this.editField('postcode')}>{postcode} <Edit2 className="edit-btn"
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
                            {/*<Select*/}
                            {/*  components={{DropdownIndicator, MultiValue: CustomOptionComponent}}*/}
                            {/*  value={this.state.groups}*/}
                            {/*  maxMenuHeight={200}*/}
                            {/*  isMulti*/}
                            {/*  isClearable={false}*/}
                            {/*  styles={colourStyles}*/}
                            {/*  options={this.state.selectOptions.groups}*/}
                            {/*  onChange={(values) => {*/}
                            {/*    this.onSelectGroupsChange(values)*/}
                            {/*  }}*/}
                            {/*  className="fix-margin-select"*/}
                            {/*  classNamePrefix="select"*/}
                            {/*  id="languages"*/}
                            {/*/>*/}
                            <MultiSelectOrganization
                              isDisabled={this.state.isDisabledGroups}
                              value={this.state.groups}
                              options={this.state.selectOptions.groups}
                              onChange={(values) => {
                                this.onSelectGroupsChange(values)
                              }}
                              onSelectElement={(organization) => {
                                this.setState({selectedOrganization: organization});
                              }}
                            />

                            <OrganizationPermissionsModal
                              isOpen={!isEmpty(this.state.selectedOrganization)}
                              organization={this.state.selectedOrganization}
                              onClose={() => this.setState({selectedOrganization: {}})}
                              user={this.props.user}
                            />

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
    userProfile: state.user.profile
  }
};
const mapActionsToProps = (dispatch) => {
  return {
    setUserList: bindActionCreators(setUserList, dispatch)
  }
};
export default connect(mapStateToProps, mapActionsToProps)(UserEdit)
