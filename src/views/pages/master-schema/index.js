import React, {useState, useEffect} from 'react';
import {
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
import {X, Plus, ChevronDown } from "react-feather";
import rfdc from "rfdc";
import FieldEdit from "./FieldEdit";
import GroupEdit from "./GroupEdit";
import './index.scss';
import MasterSchemaTree from "./MasterSchemaTree/MasterSchemaTree";
import Breadcrumbs from './Breadcrumbs/index'
import {Treebeard} from "react-treebeard";
import {styleLight} from "./MasterSchemaTree/styles/style";
import {styleColumn} from "./MasterSchemaTree/styles/styleColumn";
import Tabs from '../../../components/Tabs/index.js'

const clone = rfdc();

function MasterSchema() {

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

  return (
    <Row>
      <Col md="6">
        <Card>
          <CardHeader>
            <CardTitle>
              <Breadcrumbs list={['Master schema', 'Organization view']}></Breadcrumbs>
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
                            return <div className="ms-tree-column">
                              <Tabs className="w-100" onChange={() => {
                              }} tabs={['Onboarding']}></Tabs>
                            </div>
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
      <Col md="6">
        {
          !cursor ? null : <Card>
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
        }
      </Col>
    </Row>
  )
}


export default MasterSchema;

