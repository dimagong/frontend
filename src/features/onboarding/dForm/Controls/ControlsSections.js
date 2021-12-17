import React from "react";
import { Col, Row } from "reactstrap";
import { Plus} from "react-feather";
import Constants from './utils/constants'
import { elementsByGroups } from "./utils/group";
import ControlsSection from './ControlsSection'
import { useSelector } from "react-redux";
import { selectdForm } from "app/selectors/onboardingSelectors";

const ControlsSections = ({sectionName}) => {
  const dForm = useSelector(selectdForm);
  const {schema} = dForm;
    const groupedFieldsKeys = Object.keys(schema.uiSchema.groups)
    const propertiesKeys = Object.keys(schema.schema.properties);
    const sectionGroupsKeys = Object.keys(schema.uiSchema.sectionGroups);
    const groupedElements = elementsByGroups({schema, propertiesKeys, groupedFieldsKeys});
    const groupedElementsKeys = Object.keys(groupedElements);

    const isSectionHaveOneElement = (elements, sectionName) => {
        const fieldsNames = Object.keys(elements);
        const found = fieldsNames.some(fieldName =>  schema.uiSchema.sections[fieldName] === sectionName);
        return !!found;
      };

      const isElementInSection = (elementContentKey, sectionName) => {
        return elementContentKey in schema.uiSchema.sections && schema.uiSchema.sections[elementContentKey] === sectionName;
      };

  return sectionGroupsKeys.map(
    (groupName, index) => {
        const groupedElementKeys = Object.keys(groupedElements[groupName] || {})
      if (groupedElementsKeys.indexOf(groupName) !== -1) {
        if (!isSectionHaveOneElement(groupedElements[groupName], sectionName)) {
          return null;
        }
        // console.log(groupedElements, "groupedElements")
        // TODO: RENDER FIELDS IN SECTION GROUP

        const elementContent = groupedElementKeys.map(
          (key) => {
            if (isElementInSection(key, sectionName)) {
                return <ControlsSection objKey={key} index={index}/>
            }
            return null;
          }
        );

        if (groupName.indexOf("WITHOUT_GROUP") !== -1) {
          return null;
        }

        return (
          <div className="border px-2" key={sectionName + "_" + groupName}>
            <div className="title pt-2 pb-0">
              <span className="text-bold-500 font-medium-2 ml-50">
                {groupName}
                <div className="float-right">
                  {this.modalEditDependencies("groups", groupName)}
                </div>
              </span>
              <hr />
            </div>
            <Row>{elementContent}</Row>
            <Row>
              <Col md="12">
                <div className="form-group pull-right-icons">
                  <select
                    className="form-control"
                    value={Constants.FIELD_TYPES}
                    onChange={(event) =>
                      this.setState({ type: event.target.value })
                    }
                  >
                    {Constants.FIELD_TYPE_TEXT.map((type, indexType) => (
                      <option key={indexType}>{type}</option>
                    ))}
                  </select>
                </div>
                <div className="d-flex dform-input-setting">
                  <div className="vertical-center dform-input">
                    <Plus
                      size={20}
                      onClick={() => this.addControl(sectionName, groupName)}
                      className="cursor-pointer"
                    />
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        );
      }

      if (schema.uiSchema.sectionGroups[groupName] !== sectionName)
        return null;

      return (
        <div
          className="border px-2 form-create__group-min-height "
          key={sectionName + "_" + groupName}
        >
          <div className="title pt-2 pb-0">
            <span className="text-bold-500 font-medium-2 ml-50">
              {groupName}
              <div className="float-right">
                {this.modalEditDependencies("groups", groupName)}
              </div>
            </span>
            <hr />
          </div>
          <Row>
            <Col md="12">
              <div className="form-group pull-right-icons">
                <select
                  className="form-control"
                  value={Constants.FIELD_TYPE_TEXT}
                  onChange={(event) =>
                    this.setState({ type: event.target.value })
                  }
                >
                  {Constants.FIELD_TYPES.map((type, indexType) => (
                    <option key={indexType}>{type}</option>
                  ))}
                </select>
              </div>
              <div className="d-flex dform-input-setting">
                <div className="vertical-center dform-input">
                  <Plus
                    size={20}
                    onClick={() => this.addControl(sectionName, groupName)}
                    className="cursor-pointer"
                  />
                </div>
              </div>
            </Col>
          </Row>
        </div>
      );
    }
  );
};

export default ControlsSections;
