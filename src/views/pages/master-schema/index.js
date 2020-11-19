import React, {useState, useEffect} from 'react';
import {Treebeard, decorators} from 'react-treebeard';
import {styleLight} from "./styles/style"
import {Card, CardBody, CardHeader, CardTitle, Row, Col, Button} from 'reactstrap'
import masterSchemaService from './services/masterSchema.service'
import Select from "react-select"
import {X} from "react-feather";
import rfdc from "rfdc";

const clone = rfdc();

const colourOptions = [
  {value: "ocean", label: "Ocean"},
  {value: "blue", label: "Blue"},
  {value: "purple", label: "Purple"},
  {value: "red", label: "Red"},
  {value: "orange", label: "Orange"}
];

const dataDefault = {
  name: 'root',
  toggled: true,
  children: [
    {
      name: 'parent',
      children: [
        {name: 'child1'},
        {name: 'child2'}
      ]
    },
    {name: 'nested child 2'},
    {
      name: 'loading parent',
      loading: true,
      children: []
    },
    {
      name: 'parent',
      children: [
        {
          name: 'nested parent',
          children: [
            {name: <div><h1>123</h1></div>},
            {name: 'nested child 2'}
          ]
        }
      ]
    }
  ]
};

const organizationTypesData = [
  {value: "corporation", label: "Corporation"},
  {value: "network", label: "Network"},
  {value: "member_firm", label: "Member firm"},
];

function MasterSchema() {

  const [masterSchemaIsLoading, setMasterSchemaIsLoading] = useState(false);
  const [organization, setOrganization] = useState();
  const [masterSchema, setMasterSchema] = useState();
  const [masterSchemaTreebeard, setMasterSchemaTreebeard] = useState();
  const [organizationType, setOrganizationType] = useState();
  const [organizations, setOrganizations] = useState([]);
  const [cursor, setCursor] = useState(false);

  decorators.Header = (props) => {

    return <div onClick={() => {
      console.log(111111111222222222, props);
    }} style={props.style.base}>
      <div style={props.style.title}>{props.node.name}</div>
    </div>
  };

  // ---

  const getOrganizations = async () => {
    const response = await masterSchemaService.getOrganizations();
    let organizations = response.data.data;
    setOrganizations(organizations);
    console.log(response.data.data);
  };

  useEffect(() => {
    console.log('cursor', cursor);
  }, [cursor]);

  useEffect(() => {
    getOrganizations();
  }, []);

  useEffect(() => {
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

  const parseToFormatTreebeard = () => {

    const recursiveMap = (node) => {
      node.children = [];
      node.children = node.fields;

      if (node.groups.length) {
        for (let group of node.groups) {
          group = recursiveMap(group);
        }
        node.children = node.children.concat(node.groups);
      }

      return node;
    };

    const root = recursiveMap(clone(masterSchema.root));
    console.log(root);

    masterSchema.children = [];
    masterSchema.children.push(root);

    setMasterSchemaTreebeard(masterSchema);
  };

  const createMasterSchema = async () => {
    const response = await masterSchemaService.create(organization.value.type, organization.value.id);
    setMasterSchema(response.data.data);
    console.log(response.data.data);
  };

  const getOrganizationsByType = () => {
    if (!organizationType) return [];
    // console.log(123123, organizations, organizationType);
    return organizations[organizationType.value].map((organization) => {
      return {
        value: organization,
        label: organization.name
      }
    });
  };

  const getMasterSchemaByType = async (type, id) => {
    try {
      const response = await masterSchemaService.getByOrganization(type, id);
      setMasterSchema(response.data.data);
    } catch (exception) {

    } finally {
      setMasterSchemaIsLoading(false)
    }
  };


  const onToggle = (node, toggled) => {
    if (cursor) {
      cursor.active = false;
    }
    node.active = true;
    if (node.children) {
      node.toggled = toggled;
    }
    setCursor(node);
    setMasterSchemaTreebeard(Object.assign({}, masterSchemaTreebeard))
  };

  const isNeedToCreateMS = () => {
    return !masterSchema && organization;
  };

  return (
    <Row>
      <Col md="6">
        <Card>
          <CardHeader>
            <CardTitle>Master schema</CardTitle>
          </CardHeader>
          <CardBody>
            <Row>
              <Col md="3" sm="6">
                <h5 className="my-1 text-bold-600">Organization type</h5>
                <Select
                  className="React"
                  classNamePrefix="select"
                  name="color"
                  options={organizationTypesData}
                  value={organizationType}
                  onChange={(event) => {
                    setOrganizationType(event);
                    setOrganization(null);
                    setMasterSchema(null);
                  }}
                />
              </Col>

              <Col md="3" sm="6">
                <h5 className="my-1 text-bold-600">Organization</h5>
                <Select
                  className="React"
                  classNamePrefix="select"
                  name="color"
                  value={organization}
                  options={getOrganizationsByType()}
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

            {!masterSchemaTreebeard ? null :
              <Treebeard style={styleLight} data={masterSchemaTreebeard} onToggle={onToggle}/>}
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
            </CardBody>
          </Card>
        }
      </Col>
    </Row>
  )
}


export default MasterSchema;
