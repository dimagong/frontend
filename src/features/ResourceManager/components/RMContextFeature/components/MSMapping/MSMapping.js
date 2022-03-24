import "./styles.scss";

import { Col, Row } from "reactstrap";
import React, { useMemo } from "react";
import Scrollbars from "react-custom-scrollbars";

import NmpButton from "components/nmp/NmpButton";
import NmpSelect from "components/nmp/NmpSelect";

import FileInfoFolderContentTemplate from "../FileInfoFolderContentTemplate";

const typeToOption = (type) => ({ label: `MS.ValidPath.profile.${type}`, value: type });

const versionToOption = (version) => ({ label: `${version.name} ${version.version}`, value: version });

const MSMapping = ({ document, versions }) => {
  const typeOptions = useMemo(() => document.types.map(typeToOption), [document.types]);
  const versionOptions = useMemo(() => versions.map(versionToOption), [versions]);

  if (!document) {
    return <FileInfoFolderContentTemplate title="Document Mapping" noDataTitle="No connections found" />;
  }

  return (
    <FileInfoFolderContentTemplate title="Document Mapping">
      <div className="mb-2">
        <NmpSelect options={versionOptions} value={versionOptions[0]} backgroundColor="transparent" />
      </div>

      <Scrollbars className="mb-2" autoHeight autoHeightMax={350}>
        {document.types.map((element) => (
          <Row className="py-1" noGutters>
            <Col xs="4">
              <div
                className="ms-mapping__template-key py-2 px-1 bg-white"
                title={`{{ msRef: ${element} }}`}
              >{`{{ msRef: ${element} }}`}</div>
            </Col>

            <Col className="d-flex align-items-center" xs="8">
              <div className="full-width pl-2">
                <NmpSelect
                  options={typeOptions}
                  value={typeOptions[0]}
                  backgroundColor="transparent"
                  placeholder="Select a MasterSchema reference"
                />
              </div>
            </Col>
          </Row>
        ))}
      </Scrollbars>

      <div className="ms-mapping__preview d-flex justify-content-end pb-2 mb-2">
        <div className="flex-grow-1 px-2">
          <NmpSelect
            options={typeOptions}
            value={typeOptions[0]}
            backgroundColor="transparent"
            placeholder="Select a user to preview prefilled document against"
          />
        </div>

        <NmpButton color="white">Preview</NmpButton>
      </div>

      <div className="d-flex justify-content-end">
        <NmpButton color="primary">Save</NmpButton>
      </div>
    </FileInfoFolderContentTemplate>
  );
};

export default MSMapping;
