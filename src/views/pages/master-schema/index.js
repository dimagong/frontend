import React, {useState, useEffect} from 'react';

import {Card, CardBody, CardHeader, CardTitle, Row, Col, Button, Table} from 'reactstrap'
import masterSchemaService from './services/masterSchema.service'
import Select from "react-select"
import {X, Plus} from "react-feather";
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
    setCursor(null);
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

  const recursiveMap = (node) => {

    if (!node) return null;

    node.children = [];
    node.children = node.fields;
    node.toggled = true;

    if(cursor) {
      if(
        node.id === cursor.id && cursor.children && node.children
      ) {
        node.active = true;
        setCursor(node);
      }
    }

    node.children.forEach((child) => {
      if(cursor) {
        if(
          child.id === cursor.id && !cursor.children && !child.children
        ) {
          child.active = true;
          setCursor(child);
        }
      }
    });

    if (node.groups.length) {

      for (let group of node.groups) {
        group = recursiveMap(group);
      }
      node.children = node.children.concat(node.groups);
    }

    return node;
  };
  const parseToFormatTreebeard = () => {
    const root = recursiveMap(clone(masterSchema.root));
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
    if(cursor) {
      cursor.active = false;
      masterSchemaTreebeard.active = false;
    }
    node.active = true;

    console.log(node, masterSchemaTreebeard);
    setCursor(node);
    setMasterSchemaTreebeard(Object.assign({}, masterSchemaTreebeard))
  };

  const isNeedToCreateMS = () => {
    return !masterSchema && organization;
  };

  const outputTreeColumn = (node, data = []) => {
    data.push(node);
    if(node.children) {
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
                          outputTreeColumn(masterSchemaTreebeard).map(element => <div className="ms-tree-column">
                            <Tabs className="w-100" onChange={() => {}} tabs={[element.name, element.name]}></Tabs>
                          </div>)
                        }
                      </td>
                    </tr>
                    </tbody>
                  </Table>

                  <Button
                    onClick={() => {
                    }}
                    color="primary"
                    className="add-icon btn-add-ms-element p-0"
                  >
                    <Plus size={28}/>
                  </Button>
                </div>
            }
          </CardBody>
        </Card>
      </Col>
      <Col md="6">
        {
          !cursor ? null : <Card>
            <CardHeader>
              <CardTitle>{cursor.name}</CardTitle>
              <X size={15} className="cursor-pointer mr-1" onClick={event => setCursor(null)}/>
            </CardHeader>
            <CardBody>
              {
                'children' in cursor ?
                  <GroupEdit data={cursor} onChange={(group) => {
                    setCursor(recursiveMap(group));
                    getCurrentMasterSchema();
                  }} onNewField={(newField) => {
                    getCurrentMasterSchema();
                  }} onNewGroup={(newGroup) => {
                    getCurrentMasterSchema();
                  }}/>
                  :
                  <FieldEdit data={cursor} onChange={(field) => {
                    setCursor(field);
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

