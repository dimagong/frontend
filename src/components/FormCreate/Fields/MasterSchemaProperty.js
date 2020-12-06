import React, {useEffect, useState} from "react";
import {Col, FormFeedback, FormGroup, Row, Alert} from "reactstrap";
import Select from "react-select";
import masterSchemaService from "../../../views/pages/master-schema/services/masterSchema.service";
import {isEmpty, isObject, first} from 'lodash'

class CustomSelect extends React.Component {
  render() {
    const {
      invalid
    } = this.props;

    const customStyles = {
      control: (base, state) => ({
        ...base,
        // state.isFocused can display different borderColor if you need it
        borderColor: state.isFocused ?
          '#ddd' : !invalid ? '#ddd' : '#dc3545',
        // overwrittes hover style
        '&:hover': {
          borderColor: state.isFocused ? '#ddd' : !invalid ? '#ddd' : 'red'
        }
      })
    };
    return <Select styles={customStyles} {...this.props}/>
  }
}

export default function MasterSchemaProperty(props) {

  const [organizations, setOrganizations] = useState([]);
  const [currentField, setCurrentField] = useState({});
  const [searchableValue, setSearchableValue] = useState('');

  useEffect(() => {
    getOrganizations();
  }, []);

  useEffect(() => {
    if (!isEmpty(currentField)) {
      props.onChangeFieldId(currentField.value);
    }
  }, [currentField]);

  const convertMasterSchemaToFieldsList = (node, list, path = '') => {
    for (let field of node.fields) {
      list[field.id] = path + '.' + field.name;
    }

    for (let group of node.groups) {
      convertMasterSchemaToFieldsList(group, list, path + '.' + group.name);
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
        masterSchemaFields: list
      };
    });
  };

  const initCurrentStateField = (formattedOrganizations) => {

    if (!isEmpty(props.fieldId)) {
      const formattedOrganization = formattedOrganizations.find((formattedOrganization) => {
        return parseInt(props.fieldId) in formattedOrganization.masterSchemaFields;
      });

      let label = 'MasterSchema';
      label += '.' + formattedOrganization.masterSchemaFields[props.fieldId];

      setCurrentField({
        label: label,
        value: props.fieldId
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

  const getAddNewOption = () => {
    const masterSchemaName = organizations.find((formattedOrganization) => {
      return formattedOrganization.organization.master_schema?.root?.name;
    });

    if(!masterSchemaName) return [];

    const searchValue = searchableValue ? searchableValue : '<newField>';
    return [{
      label: 'MasterSchema.' + masterSchemaName.organization.master_schema.root.name + '.Unapproved.' + searchValue, value: {
        isNew: true,
        name: searchableValue
      }
    }]
  };

  const getFieldsSelect = () => {
    let masterSchemaFields = organizations.map((formattedOrganization) => {
      return Object.keys(formattedOrganization.masterSchemaFields).map((masterSchemaFieldId) => {
        let label = 'MasterSchema';
        label += '.' + formattedOrganization.masterSchemaFields[masterSchemaFieldId];
        return {
          label: label,
          value: masterSchemaFieldId
        }
      })
    });

    if (masterSchemaFields.length) {
      masterSchemaFields = masterSchemaFields.reduce((state, next) => state.concat(next));
    }
    console.log('masterSchemaFields', masterSchemaFields);



    return <FormGroup>
      <CustomSelect
        id="select-ms-property"
        options={masterSchemaFields.concat(getAddNewOption())}
        value={currentField}
        onChange={(event) => {
          if(isObject(event.value) && event.value.isNew) {
            if(window.confirm(`Are you sure you want to create a field: "${event.label}"?`)) {
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
      ></CustomSelect>
      {
        !props.invalid ? null : <Alert className="mt-1" color="danger">
          {props.errorMsg}
        </Alert>
      }
    </FormGroup>
  };

  return <Row>
    <Col md="12">
      <label for="select-ms-property">Property</label>
      {getFieldsSelect()}
    </Col>
  </Row>

}
