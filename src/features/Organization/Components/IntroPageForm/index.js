import React from "react";
import { Button, Col, Row } from "reactstrap";
import Editor from "../../../../components/FormCreate/Custom/WysiwygEditor";
import FileInput from "../../../../components/formElements/FileInput";

const IntroPageForm = ({
  data,
  onFieldChange,
  isBrochureLoading,
  isSomethingLoading,
  onIntroPageSave,
  create,
  onIntroPageCreate,
}) => {
  return (
    <Row>
      <Col className={"organization-form"}>
        <div className={"field"}>
          <div className={"label"}>
            <label htmlFor="title">Intro title</label>
          </div>
          <div className={"form-element"}>
            <input
              type="text"
              name={"intro-title"}
              id={"intro-title"}
              className={"text-input"}
              value={data.intro_title || ""}
              // disabled={isFilesLoading || isLoading}
              onChange={(e) => onFieldChange("intro_title", e.target.value)}
            />
          </div>
        </div>
        <div className="field">
          <div className="label">Intro Text</div>
          <div className="form-element">
            <div className="editor-wrapper">
              <Editor
                id={`editor`}
                orgPage
                // disabled={isLoading}
                type={"text"}
                orgId={data.id}
                data={data.intro_text || ""}
                onChange={({ rich, raw }) => onFieldChange("intro_text", raw === "" ? "" : rich)}
              />
            </div>
          </div>
        </div>
        <div className="field">
          <div className="label">Brochure</div>
          <div className="form-element">
            <FileInput
              value={data.brochure.file}
              onChange={(file) => onFieldChange("brochure", { file: file, url: null })}
              loading={isBrochureLoading}
              disabled={isBrochureLoading}
              accept="application/pdf"
            />
          </div>
        </div>
        <div className="field">
          <div className="label" />
          <div className="form-element d-flex justify-content-end">
            <Button
              disabled={isSomethingLoading}
              onClick={data.new ? onIntroPageCreate : onIntroPageSave}
              className={"organization-form_submit-button"}
              color="primary"
            >
              {data.new ? "Save new intro page" : "Save"}
            </Button>
          </div>
        </div>
      </Col>
    </Row>
  );
};

export default IntroPageForm;
