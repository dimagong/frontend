import "./styles.scss";

import moment from "moment";
import { Col, Row } from "reactstrap";
import React, { useMemo, useState } from "react";
import Scrollbars from "react-custom-scrollbars";

import NmpButton from "components/nmp/NmpButton";
import NmpSelect from "components/nmp/NmpSelect";

import FileInfoFolderContentTemplate from "../FileInfoFolderContentTemplate";

const getFileLabel = (file) => `${file.name} v${moment(file.updated_at).format("YYYY.MM.DD HH:mm:ss")}`;

const getOptionFromFile = (file) => ({ label: getFileLabel(file), value: file });

const getOptionFromType = (type) => ({ label: `MS.ValidPath.profile.${type}`, value: type });

const MSMapping = ({ files, document, versions }) => {
  const fileOptions = useMemo(() => files.map(getOptionFromFile), [files]);
  const [file, setFile] = useState(fileOptions[0]);

  const typeOptions = useMemo(() => document.types.map(getOptionFromType), [document.types]);

  if (!document) {
    return <FileInfoFolderContentTemplate title="Document Mapping" noDataTitle="No connections found" />;
  }

  return (
    <FileInfoFolderContentTemplate title="Document Mapping">
      <div className="mb-2">
        <NmpSelect options={fileOptions} value={file} onChange={setFile} backgroundColor="transparent" />
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
                  menuPosition="fixed"
                />
              </div>
            </Col>
          </Row>
        ))}
      </Scrollbars>

      <div className="ms-mapping__preview d-flex justify-content-end pb-2 mb-2">
        <div className="flex-grow-1 px-2">
          <NmpSelect
            value={null}
            options={typeOptions}
            backgroundColor="transparent"
            placeholder="Select a user to preview prefilled document against"
            menuPosition="fixed"
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
