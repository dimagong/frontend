import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Col, FormGroup, Row, Alert } from "reactstrap";
import masterSchemaService from "../../../services/masterSchema.service";
import { isEmpty, isObject } from "lodash";
import { CustomSelect } from "./Parts/CustomSelect";

import appSlice from "app/slices/appSlice";

const { getMasterSchemaFieldsRequest } = appSlice.actions;

export default function MasterSchemaProperty(props) {
  const [organizations, setOrganizations] = useState([]);
  const [currentField, setCurrentField] = useState({});
  const [searchableValue, setSearchableValue] = useState("");

  const dispatch = useDispatch();

  useEffect(() => {
    initOrganizations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isEmpty(currentField)) {
      props.onChangeFieldId(currentField.value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      const formattedOrganization = formattedOrganizations.find((formattedOrganization) => {
        return parseInt(props.fieldId) in formattedOrganization.masterSchemaFields;
      });

      let label = "MasterSchema";
      label += "." + formattedOrganization.masterSchemaFields[props.fieldId];

      setCurrentField({
        label: label,
        value: props.fieldId,
      });
    }
  };

  const getOrganizations = async () => {
    if (!props.organizations.length) return;

    const organization = props.organizations[0];
    const response = await masterSchemaService.getByOrganization(organization.type, organization.id);
    const organizationResponse = response.data.data;

    let organizations = [];
    organizations.push(organizationResponse);

    return organizations;
  };

  const initOrganizations = async () => {
    try {
      const organizations = await getOrganizations();
      const formattedOrganizations = formatOrganizationMasterSchema(organizations);

      setOrganizations(formattedOrganizations);
      initCurrentStateField(formattedOrganizations);
    } catch (exception) {
      console.log(exception);
    }
  };

  const getAddNewOption = () => {
    const formattedOrganization = organizations.find((formattedOrganization) => {
      return formattedOrganization.organization.master_schema?.root?.name;
    });

    if (!formattedOrganization) return [];

    const searchValue = searchableValue ? searchableValue : "<newField>";
    return [
      {
        label:
          "MasterSchema." + formattedOrganization.organization.master_schema.root.name + ".Unapproved." + searchValue,
        value: {
          isNew: true,
          name: searchableValue,
          organization: formattedOrganization.organization,
        },
      },
    ];
  };

  const createUnapprovedField = async (organization, fieldName) => {
    try {
      const response = await masterSchemaService.createUnapprovedField(organization.id, organization.type, fieldName);
      const field = response.data.data;

      // setup
      const organizations = await getOrganizations();
      const formattedOrganizations = formatOrganizationMasterSchema(organizations);
      setOrganizations(formattedOrganizations);

      const masterSchemaFields = transformToSelectFields(formattedOrganizations);

      masterSchemaFields.some((masterSchemaField) => {
        if (parseInt(masterSchemaField.value) === parseInt(field.id)) {
          setCurrentField(masterSchemaField);
          dispatch(getMasterSchemaFieldsRequest());
          return true;
        }
        return false;
      });
    } catch (exception) {
      console.log(exception);
    }
  };

  const transformToSelectFields = (organizationList) => {
    let masterSchemaFields = organizationList.map((formattedOrganization) => {
      return Object.keys(formattedOrganization.masterSchemaFields).map((masterSchemaFieldId) => {
        let label = "MasterSchema";
        label += "." + formattedOrganization.masterSchemaFields[masterSchemaFieldId];
        return {
          label: label,
          value: masterSchemaFieldId,
        };
      });
    });

    if (masterSchemaFields.length) {
      masterSchemaFields = masterSchemaFields.reduce((state, next) => state.concat(next));
    }

    return masterSchemaFields;
  };

  const getFieldsSelect = () => {
    const masterSchemaFields = transformToSelectFields(organizations);
    return (
      <>
        <CustomSelect
          id={props.id}
          options={masterSchemaFields.concat(getAddNewOption())}
          value={masterSchemaFields.find((next) => parseInt(next.value) === parseInt(props.fieldId)) || null}
          onChange={(event) => {
            if (isObject(event.value) && event.value.isNew) {
              if (!searchableValue) {
                return;
              }
              if (window.confirm(`Are you sure you want to create a field: "${event.label}"?`)) {
                const { name, organization } = event.value;
                createUnapprovedField(organization, name);
                return;
              }
              return;
            }
            setCurrentField(event);
          }}
          invalid={props.invalid}
          onInputChange={(event) => {
            setSearchableValue(event);
          }}
        />
        {!props.invalid ? null : (
          <Alert className="mt-1" color="danger">
            {props.errorMsg}
          </Alert>
        )}
      </>
    );
  };

  return (
    <Row>
      <Col md="12">
        {/*<label for="select-ms-property">Property</label>*/}
        {getFieldsSelect()}
      </Col>
    </Row>
  );
}
