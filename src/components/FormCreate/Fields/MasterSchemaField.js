import React, { useEffect, useState } from "react";
import { Col, FormGroup, Row } from "reactstrap";
import Select from "react-select";
import masterSchemaService from "../../../services/masterSchema.service";
import { isEmpty } from "lodash";

export default function MasterSchemaField(props) {
  const [organizations, setOrganizations] = useState([]);
  const [currentOrganization, setCurrentOrganization] = useState({});
  const [currentField, setCurrentField] = useState({});

  useEffect(() => {
    getOrganizations();
  }, []);

  useEffect(() => {
    setCurrentField(null);
  }, [currentOrganization]);

  useEffect(() => {
    if (!isEmpty(currentField)) {
      props.onChangeFieldId(currentField.value);
    }
  }, [currentField]);

  const convertMasterSchemaToFieldsList = (node, list, path = "") => {
    for (let field of node.fields) {
      list[field.id] = path + "." + field.name;
    }

    for (let group of node.groups) {
      convertMasterSchemaToFieldsList(group, list, path + "." + group.name);
    }
  };

  const formatOrganizationMasterSchema = (organizations) => {
    return organizations.map((organization) => {
      let list = {};
      if (organization.master_schema) {
        convertMasterSchemaToFieldsList(organization.master_schema.root, list, organization.master_schema.root.name);
      }
      return {
        organization: organization,
        masterSchemaFields: list,
      };
    });
  };

  const initCurrentStateField = (formattedOrganizations) => {
    if (!isEmpty(props.fieldId)) {
      const formattedOrganizaiton = formattedOrganizations.find((formattedOrganization) => {
        return parseInt(props.fieldId) in formattedOrganization.masterSchemaFields;
      });

      setCurrentOrganization({
        label: formattedOrganizaiton.organization.name,
        value: formattedOrganizaiton,
      });

      setCurrentField({
        label: formattedOrganizaiton.masterSchemaFields[props.fieldId],
        value: props.fieldId,
      });
    }
  };

  const getOrganizations = async () => {
    try {
      const response = await masterSchemaService.getOrganizations();
      const organizationsByType = response.data.data;
      let organizations = []
        .concat(organizationsByType.corporation)
        .concat(organizationsByType.network)
        .concat(organizationsByType.member_firm);

      const formattedOrganizations = formatOrganizationMasterSchema(organizations);

      setOrganizations(formattedOrganizations);
      initCurrentStateField(formattedOrganizations);
    } catch (exception) {
      console.log(exception);
    }
  };

  return (
    <Row>
      <Col md="12">
        <FormGroup>
          <label>Organization</label>
          <Select
            options={organizations.map((formattedOrganization) => {
              return {
                label: formattedOrganization.organization.name,
                value: formattedOrganization,
              };
            })}
            value={currentOrganization}
            onChange={(event) => {
              setCurrentOrganization(event);
            }}
          ></Select>
        </FormGroup>
        {!isEmpty(currentOrganization.value) ? (
          <FormGroup>
            <label>Field</label>
            <Select
              options={Object.keys(currentOrganization.value.masterSchemaFields).map((masterSchemaFieldId) => {
                return {
                  label: currentOrganization.value.masterSchemaFields[masterSchemaFieldId],
                  value: masterSchemaFieldId,
                };
              })}
              value={currentField}
              onChange={(event) => {
                setCurrentField(event);
              }}
            ></Select>
          </FormGroup>
        ) : null}
      </Col>
    </Row>
  );
}
