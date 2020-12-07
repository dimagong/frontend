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
  Nav,
  NavItem,
  NavLink,
  TabPane,
  Button,
  TabContent,
  Pagination,
  PaginationItem,
  PaginationLink,
  UncontrolledButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Table,
} from "reactstrap"
import DataTable from "react-data-table-component"
import Flatpickr from "react-flatpickr";
import Select, {components} from "react-select"
import classnames from "classnames"
import moment from 'moment';
import {toast} from "react-toastify"
import {User, X, Check, Plus, Edit2, RefreshCw, EyeOfxf, Eye, ChevronRight, ChevronLeft} from "react-feather"
import {colourStyles} from "utility/select/selectSettigns";
import {DropdownIndicator} from 'components/MultiSelect/multiSelect'
// import InvitationCreate from '../invitation/InvitationCreate'
import { useDispatch, useSelector } from "react-redux";
import {
  selectGroups,
  selectRoles,
  selectManager,
  selectManagers,
  selectModules,
  selectUserDForms,
  selectUserWorkfows, selectUserReviewers
} from "app/selectors";
import {
  setManager,
  updateUserRequest,
  getRolesRequest,
  getGroupsRequest,
  setContext,
  setManagerOnboarding, getUserOnboardingRequest
} from "app/slices/appSlice";
import {useOutsideAlerter} from 'hooks/useOutsideAlerter'
import UserEditAvatar from "./UserEditAvatar"
import UserEditSelects from './UserEditSelects';
import UserOnboarding from '../userOnboarding/UserOnboarding';
import UserInvitationsCreate from '../userInvitations/UserInvitationsCreate';
import {columnDefs} from '../userOnboarding/gridSettings'
import UserOnboardingForm from '../userOnboarding/UserOnboardingForm'
import UserOnboardingDForm from '../userOnboarding/UserOnboardingDForm'

import UserCardTemplate from 'features/home/ContextSearch/CardTemplates/userCard'
import CustomTabs from 'components/Tabs'
import Timeline from 'components/Timeline'
import UserRoles from 'components/UserRoles'
import {selectUserOrganizations} from 'app/selectors/userSelectors'
import masterSchemaService from '../../../views/pages/master-schema/services/masterSchema.service'
import Breadcrumbs from '../../../views/pages/master-schema/Breadcrumbs'
import MasterSchemaTree from '../../../views/pages/master-schema/MasterSchemaTree/MasterSchemaTree'
import GroupEdit from '../../../views/pages/master-schema/GroupEdit'
import FieldEdit from '../../../views/pages/master-schema/FieldEdit'

import Tabs from '../../../components/Tabs/index.js'
import rfdc from 'rfdc'

const clone = rfdc();

const UserEdit = (props, context) => {

  const tabs = ["Activity", "Master Schema", "Applications", "Permissions"];

  const manager = useSelector(selectManager);
  const [editField, setEditField] = useState(null);
  const [errors, setErrors] = useState({});
  const [activeTab, setActiveTab] = useState("1")
  const [activeModuleTab, setActiveModuleTab] = useState(tabs[0])
  const dispatch = useDispatch();
  const titleRef = useRef(null);
  const validUntilRef = useRef(null)
  const numberRef = useRef(null)
  const emailRef = useRef(null)


  const modules = useSelector(selectModules);
  const dForms = useSelector(selectUserDForms)
  const workflows = useSelector(selectUserWorkfows)
  const reviewers = useSelector(selectUserReviewers)
  const userOrganizations = useSelector(selectUserOrganizations(manager.id))
  const isCreate = useRef(false)

  const initOnboarding = {
    d_form: null,
    is_internal: false,
    reviewers: [],
    user_id: manager.id,
    workflow: null,
  }

  const isOnboarding = () => manager && modules.length && manager.modules.find((module) => module.name === 'Onboarding')

  const isUserHasModules = manager && manager.modules && manager.modules.length > 0;

  const createViewOnboarding = () => {
    dispatch(setManagerOnboarding(initOnboarding));
    isCreate.current = true;
  }

  const handleRowClick = (onboarding) => {
    dispatch(setManagerOnboarding(onboarding));
    isCreate.current = false;
  }

  useEffect(() => {
    if (!dForms.length && !reviewers.length && !workflows.length) {
    }
    // user onboarding
    dispatch(getUserOnboardingRequest({userId: manager.id}))
  }, [manager.groups]);

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


  // Master schema data =================================================================================================================
  const [masterSchemaIsLoading, setMasterSchemaIsLoading] = useState(false);
  const [organization, setOrganization] = useState();
  const [masterSchema, setMasterSchema] = useState();
  const [masterSchemaTreebeard, setMasterSchemaTreebeard] = useState();
  const [organizations, setOrganizations] = useState([]);
  const [cursor, setCursor] = useState(false);


  const getOrganizations = async () => {
    const response = await masterSchemaService.getOrganizations();
    const organizationsByType = response.data.data;
    let organizations = []
      .concat(organizationsByType.corporation)
      .concat(organizationsByType.network)
      .concat(organizationsByType.member_firm);
    setOrganizations(organizations);
  };

  useEffect(() => {
    getOrganizations();
  }, []);

  useEffect(() => {
    setMasterSchemaTreebeard(null);
    closeElement();
    getCurrentMasterSchema();
  }, [organization]);

  useEffect(() => {
    if (masterSchema) {
      parseToFormatTreebeard();
    }

  }, [masterSchema]);


  const getCurrentMasterSchema = () => {
    if (organization && organization.value) {
      getMasterSchemaByType(organization.value.type, organization.value.id);
    }
  };

  const closeElement = () => {
    if (cursor) {
      cursor.active = false;
      setMasterSchemaTreebeard(Object.assign({}, masterSchemaTreebeard));
      setCursor(null);
    }
  };

  const recursiveMap = (node, path = []) => {

    if (!node) return null;

    node.children = [];
    node.children = node.fields;
    node.toggled = true;

    if (cursor) {
      if (
        node.id === cursor.id && cursor.children && node.children
      ) {
        node.active = true;
        setCursor(node);
      }
    }

    node.children.forEach((child) => {
      let nodePath = path.slice();
      nodePath.push(child.name);
      child.path = nodePath;


      // set previous cursor
      if (cursor) {
        if (
          child.id === cursor.id && !cursor.children && !child.children
        ) {
          child.active = true;
          setCursor(child);
        }
      }
    });

    if (node.groups.length) {

      for (let group of node.groups) {
        let nodePath = path.slice();
        nodePath.push(group.name);
        group.path = nodePath;
        group = recursiveMap(group, nodePath);
      }
      node.children = node.children.concat(node.groups);
    }

    return node;
  };
  const parseToFormatTreebeard = () => {
    const rootPath = [masterSchema.root.name];
    const root = recursiveMap(clone(masterSchema.root), rootPath);
    root.path = rootPath;
    setMasterSchemaTreebeard(root);
  };

  const createMasterSchema = async () => {
    const response = await masterSchemaService.create(organization.value.type, organization.value.id);
    setMasterSchema(response.data.data);
  };

  const getMasterSchemaByType = async (type, id) => {
    try {
      const response = await masterSchemaService.getByOrganization(type, id);
      setMasterSchema(response.data.data);
    } catch (exception) {
      console.log(exception);
    } finally {
      setMasterSchemaIsLoading(false)
    }
  };


  const onToggle = (node, toggled) => {
    if (cursor) {
      cursor.active = false;
      masterSchemaTreebeard.active = false;
    }
    node.active = true;

    setCursor(node);
    setMasterSchemaTreebeard(Object.assign({}, masterSchemaTreebeard))
  };

  const isNeedToCreateMS = () => {
    return !masterSchema && organization;
  };

  const outputTreeColumn = (node, data = []) => {
    data.push(node);
    if (node.children) {
      node.children.forEach(child => outputTreeColumn(child, data))
    }
    return data;
  };

  // ======================================================================================================================================




    return (
      <Row className="user-managment">
        <Col sm="12" md="12" lg="12" xl="6">
          <UserCardTemplate className="mb-2" oneColumn={false} onClick={() => {}} {...manager}/>
          <CustomTabs
            active={activeModuleTab}
            onChange={setActiveModuleTab}
            tabs={tabs}
          />
          <TabContent activeTab={activeModuleTab}>
            <TabPane tabId="Activity">
              <Timeline />
            </TabPane>
            <TabPane tabId="Master Schema">
            {/* ========================================================================================================= */}
              <Row>
                <Col md="12">
                  <Card>
                    <CardHeader>
                      <CardTitle>
                        <Breadcrumbs list={['Master schema', 'Organization view']} />
                      </CardTitle>
                    </CardHeader>
                    <CardBody>
                      <Row>
                        <Col md="3" sm="6">
                          <Select
                            className="React"
                            classNamePrefix="select"
                            name="color"
                            value={organization}
                            options={organizations.map(organization => {
                              return {label: organization.name, value: organization}
                            })}
                            onChange={(event) => {
                              setMasterSchemaIsLoading(true);
                              setOrganization(event)
                            }}
                          />
                        </Col>
                      </Row>
                      <Row className="mt-1">
                        <Col>
                          {
                            masterSchemaIsLoading || !isNeedToCreateMS() ? null :
                              <div>
                                <Button.Ripple onClick={() => createMasterSchema()} color="success">Create Master
                                  Schema</Button.Ripple>
                              </div>
                          }
                        </Col>
                      </Row>

                      {
                        !masterSchemaTreebeard ? null :
                          <div>
                            <Table responsive bordered>
                              <thead>
                              <tr>
                                <th>Element name</th>
                                <th>Captured in</th>
                              </tr>
                              </thead>
                              <tbody>
                              <tr>
                                <td className="w-50">
                                  <MasterSchemaTree data={masterSchemaTreebeard} cursor={cursor} onToggle={onToggle}/>
                                </td>
                                <td className="w-50">
                                  {
                                    outputTreeColumn(masterSchemaTreebeard).map(element => {
                                      if(element.children) {
                                        return <div className="ms-tree-column">
                                          <div></div>
                                        </div>
                                      }
                                      return (
                                        <div className="ms-tree-column">
                                          <Tabs
                                            className="w-100"
                                            onChange={() => {}}
                                            tabs={element.d_form_names}
                                          />
                                        </div>
                                      )
                                    })
                                  }
                                </td>
                              </tr>
                              </tbody>
                            </Table>
                            <div className="dropright mr-1 mb-1 d-inline-block">
                              <UncontrolledButtonDropdown direction="right">
                                <DropdownToggle color="primary" className="add-icon btn-add-ms-element ms-btn-element">
                                  <Plus size={28}/>
                                </DropdownToggle>
                                <DropdownMenu>
                                  <DropdownItem tag="a">Category</DropdownItem>
                                  <DropdownItem tag="a">Element</DropdownItem>
                                </DropdownMenu>
                              </UncontrolledButtonDropdown>
                            </div>
                          </div>
                      }
                    </CardBody>
                  </Card>
                </Col>
                {/*<Col md="6">*/}
                {/*  {*/}
                {/*    !cursor ? null : <Card>*/}
                {/*      <CardHeader>*/}
                {/*        <CardTitle>*/}
                {/*          <Breadcrumbs list={cursor.path}/>*/}
                {/*        </CardTitle>*/}
                {/*        <X size={15} className="cursor-pointer mr-1" onClick={event => closeElement()}/>*/}
                {/*      </CardHeader>*/}
                {/*      <CardBody>*/}
                {/*        {*/}
                {/*          'children' in cursor ?*/}
                {/*            <GroupEdit data={cursor} onChange={(group) => {*/}
                {/*              getCurrentMasterSchema();*/}
                {/*            }} onNewField={(newField) => {*/}
                {/*              getCurrentMasterSchema();*/}
                {/*            }} onNewGroup={(newGroup) => {*/}
                {/*              getCurrentMasterSchema();*/}
                {/*            }}/>*/}
                {/*            :*/}
                {/*            <FieldEdit data={cursor} onChange={(field) => {*/}
                {/*              getCurrentMasterSchema();*/}
                {/*            }}/>*/}
                {/*        }*/}
                {/*      </CardBody>*/}
                {/*    </Card>*/}
                {/*  }*/}
                {/*</Col>*/}
              </Row>
            {/* ========================================================================================================= */}
            </TabPane>
            <TabPane tabId="Applications">
              <Card>
                <CardBody>
                  <Row className="mx-0" col="12">
                    <Col md="12" className="ml-0 pl-0">
                      <DataTable
                        data={manager.onboardings}
                        columns={columnDefs}
                        Clicked
                        onRowClicked={handleRowClick}
                        conditionalRowStyles={[
                          {
                            when: row => manager.onboarding ? row.id === manager.onboarding.id : false,
                            style: row => ({
                              backgroundColor: '#7367f0',
                              color: 'white'
                            }),
                          }
                        ]}
                        noHeader
                      />
                    </Col>
                    <Col md="12" className="ml-0 pl-0">
                      <div className="onboarding-create" onClick={createViewOnboarding}>
                        <Button
                          onClick={() => {}}
                          className="action-button"
                        >
                          <Plus size={22}/>
                        </Button>
                        <div>
                          Create new onboarding
                        </div>
                      </div>
                      {/*<div className="d-flex justify-content-end flex-wrap mt-2">*/}
                      {/*  <Button className="mt-1" color="primary" onClick={createViewOnboarding}>Create</Button>*/}
                      {/*</div>*/}
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </TabPane>
            <TabPane tabId="Permissions">
              <UserRoles manager={manager} userOrganizations={userOrganizations} />
            </TabPane>
          </TabContent>


          {/*<Card className={"card-action user-managment__edit"}>*/}
            {/*<CardHeader className="user-managment__edit_header">*/}
            {/*  <CardTitle className="font-weight-bold">*/}
            {/*    <div className="d-flex edit-btn-trigger">*/}
            {/*      <div className="user-managment__edit_header_user-info-container" ref={titleRef}>*/}
            {/*        {*/}
            {/*          editField === "name" ?*/}
            {/*            <FormGroup className="position-absolute input-divider-right user-managment__edit_header_form" >*/}
            {/*              <Input*/}
            {/*                autoFocus*/}
            {/*                type="text"*/}
            {/*                name="name"*/}
            {/*                id="mobileVertical"*/}
            {/*                placeholder="Mobile"*/}
            {/*                value={manager.first_name}*/}
            {/*                onChange={(event) => handleManager({first_name: event.target.value})}*/}
            {/*                {...{invalid: errors['name'] }}*/}
            {/*              />*/}
            {/*              <div className="form-control-position input-divider-right user-managment__edit_header_form_check"*/}
            {/*                   onClick={editFieldSave}>*/}
            {/*                <Check className="bg-hover-icon" size={15}/>*/}
            {/*              </div>*/}
            {/*              <div className="form-control-position input-divider-right user-managment__edit_header_form_cross"*/}
            {/*                   onClick={editFieldClose}>*/}
            {/*                <X className="bg-hover-icon" size={15}/>*/}
            {/*              </div>*/}
            {/*              <FormFeedback>{errors['name'] ? errors['name'] : ''}</FormFeedback>*/}
            {/*            </FormGroup>*/}
            {/*            : <div onClick={() => setEditField('name')}>{manager.first_name} <Edit2 className="edit-btn" size={15}/></div>*/}
            {/*        }*/}
            {/*      </div>*/}
            {/*    </div>*/}
            {/*  </CardTitle>*/}
            {/*  <X size={15} onClick={removeCard}/>*/}
            {/*</CardHeader>*/}
            {/*  */}
            {/*<CardBody className="user-managment__edit_body">*/}

            {/*  {isUserHasModules && (*/}
            {/*    <Row>*/}
            {/*      <Col>*/}
            {/*        <Nav tabs className="mt-2">*/}
            {/*          <NavItem>*/}
            {/*            <NavLink*/}
            {/*              className={classnames({*/}
            {/*                active: activeTab === "1"*/}
            {/*              })}*/}
            {/*              onClick={() => {*/}
            {/*                setActiveTab("1")*/}
            {/*              }}*/}
            {/*            >*/}
            {/*              <User size={16}/>*/}
            {/*              <span className="align-middle ml-50">Onboarding</span>*/}
            {/*            </NavLink>*/}
            {/*          </NavItem>*/}
            {/*        </Nav>*/}
            {/*        <TabContent activeTab={activeTab}>*/}
            {/*          <TabPane tabId="1">*/}
            {/*            <Row className="mx-0" col="12">*/}
            {/*              <Col md="12" className="ml-0 pl-0">*/}
            {/*                <div className="d-flex justify-content-end flex-wrap mt-2">*/}
            {/*                  <Button className="mt-1" color="primary" onClick={createViewOnboarding}>Create</Button>*/}
            {/*                </div>*/}
            {/*              </Col>*/}
            {/*              <Col md="12" className="ml-0 pl-0">*/}
            {/*                <DataTable*/}
            {/*                  data={manager.onboardings}*/}
            {/*                  columns={columnDefs}*/}
            {/*                  Clicked*/}
            {/*                  onRowClicked={handleRowClick}*/}
            {/*                  conditionalRowStyles={[*/}
            {/*                    {*/}
            {/*                      when: row => manager.onboarding ? row.id === manager.onboarding.id : false,*/}
            {/*                      style: row => ({*/}
            {/*                        backgroundColor: '#007bff',*/}
            {/*                        color: 'white'*/}
            {/*                      }),*/}
            {/*                    }*/}
            {/*                  ]}*/}
            {/*                  noHeader*/}
            {/*                />*/}
            {/*              </Col>*/}

            {/*            </Row>*/}
            {/*          </TabPane>*/}
            {/*        </TabContent>*/}
            {/*      </Col>*/}
            {/*    </Row>*/}
            {/*  )}*/}
            {/*</CardBody>*/}
          {/*</Card>*/}
        </Col>
        <Col xs="6">
          <Card>
            {
              manager.onboarding
                ? <UserOnboardingForm isCreate={isCreate}/>
                : null
            }
            {
              manager.onboarding && !isCreate.current
                ? <UserOnboardingDForm />
                : null
            }

            {activeModuleTab === "Master Schema" && (


              cursor && (
                <Card>
                  <CardHeader>
                    <CardTitle>
                      <Breadcrumbs list={cursor.path}/>
                    </CardTitle>
                    <X size={15} className="cursor-pointer mr-1" onClick={event => closeElement()}/>
                  </CardHeader>
                  <CardBody>
                    {
                      'children' in cursor ?
                        <GroupEdit data={cursor} onChange={(group) => {
                          getCurrentMasterSchema();
                        }} onNewField={(newField) => {
                          getCurrentMasterSchema();
                        }} onNewGroup={(newGroup) => {
                          getCurrentMasterSchema();
                        }}/>
                        :
                        <FieldEdit data={cursor} onChange={(field) => {
                          getCurrentMasterSchema();
                        }}/>
                    }
                  </CardBody>
                </Card>
              )


            )}
          </Card>
        </Col>
      </Row>
    )
}

export default UserEdit
