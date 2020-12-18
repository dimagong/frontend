import React, {useState, useEffect} from 'react';
import {
  Input,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Row,
  Col,
  Button,
  Table,
  UncontrolledButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap'
import masterSchemaService from './services/masterSchema.service'
import Select from "react-select"
import {X, Plus, ChevronDown} from "react-feather";
import rfdc from "rfdc";
import FieldEdit from "./FieldEdit";
import GroupEdit from "./GroupEdit";
import './index.scss';
import MasterSchemaTree from "./MasterSchemaTree/MasterSchemaTree";
import Breadcrumbs from './Breadcrumbs/index'
import {Treebeard} from "react-treebeard";
import {styleLight} from "./MasterSchemaTree/styles/style";
import {styleColumn} from "./MasterSchemaTree/styles/styleColumn";
import {Scrollbars} from 'react-custom-scrollbars'
import Tabs from '../../../components/Tabs/index.js'
import GroupCreate from "./GroupCreate";
import FieldCreate from "./FieldCreate";
import useEventListener from "../../../app/helpers/useEventListener";
import Search from "./Search";
import {isEmpty} from 'lodash'

const clone = rfdc();

function MasterSchema() {

  const CTRL = 17;

  const [masterSchemaIsLoading, setMasterSchemaIsLoading] = useState(false);
  const [organization, setOrganization] = useState();
  const [masterSchema, setMasterSchema] = useState();
  const [masterSchemaTreebeard, setMasterSchemaTreebeard] = useState();
  const [organizations, setOrganizations] = useState([]);
  const [cursor, setCursor] = useState(false);
  const [rightCardState, setRightCardState] = useState('');

  const [ctrlState, setCtrlState] = useState(false);
  const [searchValue, setSearchValue] = useState(null);

  const [groupsList, setGroupsList] = useState([]);

  useEffect(() => {
    if (searchValue === null || isEmpty(masterSchemaTreebeard)) return;
    parseToFormatTreebeard();
  }, [searchValue]);

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
    // let selectedNodes = [];
    // getSelectedList(masterSchemaTreebeard, selectedNodes);

    let groupsListBuffer = [];
    createGroupsList(masterSchemaTreebeard, groupsListBuffer);
    setGroupsList(groupsListBuffer);
  }, [masterSchemaTreebeard]);

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
      setRightCardState('');
    }
  };

  const getSelectedList = (node, selectedNodes = []) => {

    if (!node) return null;
    if (node.selected) {
      selectedNodes.push(node);
    }

    if (node.children) {
      for (let next of node.children) {
        getSelectedList(next, selectedNodes);
      }
    }
  };

  const createGroupsList = (node, selectedNodes = []) => {
    if (!node) return null;
    if (node.children) {
      selectedNodes.push(node);
    }

    if (node.children) {
      for (let next of node.children) {
        createGroupsList(next, selectedNodes);
      }
    }
  };

  const recursiveShowGroups = (node) => {
    if (node.parent) {
      recursiveShowGroups(node.parent);
    }

    node.isVisible = true;
  };

  const recursiveMap = (node, path = []) => {

    if (!node) return null;

    node.children = [];
    node.children = node.fields;

    node.children = node.children.map((nextNode) => {
      nextNode.parent = node;
      return nextNode;
    });

    if (searchValue && node.children && node.children.length) {
      node.children = node.children.filter(nextNode => nextNode.name.indexOf(searchValue) !== -1);

      node.children.forEach((nextNode) => {
        nextNode.isVisible = true;
        recursiveShowGroups(nextNode.parent);
      });
    } else if (node.children && node.children.length && !searchValue) {
      node.children.forEach((nextNode) => {
        nextNode.isVisible = true;
        recursiveShowGroups(nextNode.parent);
      });
    } else if(!searchValue){
      recursiveShowGroups(node);
    }

    node.toggled = true;

    if (cursor) {
      if (
        node.id === cursor.id && cursor.children && node.children
      ) {
        node.active = true;
        setCursor(node);
      }
    }

    if (Array.isArray(node.children)) {
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
    }

    if (node.groups.length) {

      for (let group of node.groups) {
        let nodePath = path.slice();
        nodePath.push(group.name);
        group.path = nodePath;
        group.parent = node;
        group = recursiveMap(group, nodePath);
      }
      node.children = node.children.concat(node.groups);
    }

    return node;
  };
  const parseToFormatTreebeard = () => {
    const rootPath = [masterSchema.root.name];
    let cloneRoot = clone(masterSchema.root);
    const root = recursiveMap(cloneRoot, rootPath);
    console.log('rooot', root);
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
    // if(ctrlState) {
    //   node.selected = !node.selected;
    // }
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

  const renderCreateElements = () => {
    switch (rightCardState) {
      case 'create-category': {

        return <GroupCreate data={cursor} onNewGroup={(newGroup) => {
          getCurrentMasterSchema();
          setRightCardState('');
          console.log('recursiveMap(newGroup)', recursiveMap(newGroup));
          setCursor(recursiveMap(newGroup));
        }}></GroupCreate>
      }
      case 'create-element': {

        return <FieldCreate data={cursor} onNewField={(newField) => {
          getCurrentMasterSchema();
          setRightCardState('');
          setCursor(newField);
        }}></FieldCreate>
      }
      default:
        return false;
    }
  };

  const renderOptionsEditForCurrentElement = () => {
    return 'children' in cursor ?
      <GroupEdit
        data={cursor}
        onChange={(group) => {
          getCurrentMasterSchema();
        }}
        groupsList={groupsList}
      />
      :
      <FieldEdit
        data={cursor}
        onChange={(field) => {
          getCurrentMasterSchema();
        }}
        groupsList={groupsList}
      />
  };

  const renderRightCard = () => {
    return renderCreateElements() || renderOptionsEditForCurrentElement();
  };


  useEventListener('keydown', (event) => {
    if (event.keyCode === 17) {
      setCtrlState(true);
    }
  });
  useEventListener('keyup', (event) => {
    if (event.keyCode === 17) {
      setCtrlState(false);
    }
  });

  const getBreadCrumbs = () => {
    if (!cursor) return [];

    if (rightCardState && cursor.path.length > 1) {
      return cursor.path.slice(0, -1);
    }
    return cursor.path;
  };

  return (
    <Row className="master-schema">
      <Col md="6">
        <Card>
          <CardHeader>
            <CardTitle>
              <Breadcrumbs list={['Master schema', 'Organization view']}></Breadcrumbs>
            </CardTitle>
          </CardHeader>
          <CardBody>
            <Row>
              <Col md={{ size: 6}} sm={{ size: 6}}>
                <Select
                  className="React"
                  classNamePrefix="select"
                  name="color"
                  value={organization}
                  menuPortalTarget={document.body}
                  styles={{
                    menu: provided => ({...provided, zIndex: 9999}),
                    menuPortal: base => ({...base, zIndex: 9999})
                  }}
                  options={organizations.map(organization => {
                    return {label: organization.name, value: organization}
                  })}
                  onChange={(event) => {
                    setMasterSchemaIsLoading(true);
                    setOrganization(event)
                  }}
                />
              </Col>
              <Col md={{ size: 6}} sm={{ size: 6}}>
              </Col>
              <Col md="6" sm="6" className="mt-1">
                <Search onChange={(value) => {
                  setSearchValue(value)
                }}/>
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
                  <div className="dependencies-table">

                    <div className="table-item table-header">
                      <div className="w-50 column">Element name</div>
                      <div className="w-50 column">Captured in</div>
                    </div>

                    <div style={{marginBottom: "20px"}}>
                      <Scrollbars autoHeight autoHeightMax={500}>
                        <div className="table-content">


                          <div className="w-50 column">
                            <MasterSchemaTree data={masterSchemaTreebeard} cursor={cursor} onToggle={onToggle}/>
                          </div>
                          <div className="w-50 column">
                            {
                              outputTreeColumn(masterSchemaTreebeard).map(element => {
                                if(!element.isVisible) return <></>;
                                if (element.children) {
                                  return <div className="ms-tree-column">
                                    <div></div>
                                  </div>
                                }
                                return (
                                  <div className="ms-tree-column">
                                    {element.d_form_names && !!element.d_form_names.length && (
                                      <Tabs
                                        className="w-100"
                                        onChange={() => {
                                        }}
                                        tabs={element.d_form_names}
                                      />
                                    )}
                                  </div>
                                )
                              })
                            }
                          </div>
                        </div>

                      </Scrollbars>
                    </div>


                  </div>
                  <div className="dropright mr-1 mb-1 d-inline-block">
                    <UncontrolledButtonDropdown direction="right">
                      <DropdownToggle disabled={!cursor} color="primary"
                                      className="add-icon btn-add-ms-element ms-btn-element">
                        <Plus size={28}/>
                      </DropdownToggle>
                      <DropdownMenu>
                        <DropdownItem tag="a" onClick={() => {
                          setRightCardState('create-category')
                        }}>Category</DropdownItem>
                        <DropdownItem tag="a" onClick={() => {
                          setRightCardState('create-element')
                        }}>Element</DropdownItem>
                      </DropdownMenu>
                    </UncontrolledButtonDropdown>
                  </div>
                </div>
            }
          </CardBody>
        </Card>
      </Col>
      <Col md="6">
        {
          !cursor ? null : <Card>
            <CardHeader>
              <CardTitle>
                <Breadcrumbs list={getBreadCrumbs()}/>
              </CardTitle>
              <X size={15} className="cursor-pointer mr-1" onClick={event => closeElement()}/>
            </CardHeader>
            <CardBody>
              {
                renderRightCard()
              }
            </CardBody>
          </Card>
        }
      </Col>
    </Row>
  )
}


export default MasterSchema;


