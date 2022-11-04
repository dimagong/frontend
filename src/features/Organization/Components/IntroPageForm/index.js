import React from "react";
import { Button, Col, Row } from "reactstrap";
import Editor from "../../../../components/FormCreate/Custom/WysiwygEditor";
import FileInput from "../../../../components/formElements/FileInput";
import { Check } from "react-feather";
import Checkbox from "../../../../components/@vuexy/checkbox/CheckboxesVuexy";

const IntroPageForm = ({
  data,
  onFieldChange,
  isBrochureLoading,
  isSomethingLoading,
  onIntroPageSave,
  create,
  onIntroPageCreate,
  onIntroPageDelete,
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
              onChange={(e) => onFieldChange("intro_title", e.target.value)}
            />
          </div>
        </div>
        <div className="field">
          <div className="label">Intro Text</div>
          <div className="form-element">
            <div className="editor-wrapper">
              <Editor data={data.intro_text} onChange={(htmlString) => onFieldChange("intro_text", htmlString)} />
            </div>
          </div>
        </div>
        <div className={"field"}>
          <div className={"label"}>
            <label htmlFor="title">Download text</label>
          </div>
          <div className={"form-element"}>
            <input
              type="text"
              name={"intro-title"}
              id={"download-text"}
              className={"text-input"}
              value={data.download_text || ""}
              onChange={(e) => onFieldChange("download_text", e.target.value)}
            />
          </div>
        </div>
        <div className="field">
          <div className="label">Brochure</div>
          <div className="form-element">
            <FileInput
              value={data.brochure.file}
              onChange={(file) => onFieldChange("brochure", file)}
              loading={isBrochureLoading}
              disabled={isBrochureLoading}
              accept="application/pdf"
            />
          </div>
        </div>
        <div className="field">
          <div className="label">Default</div>
          <div className="form-element">
            <Checkbox
              color="primary"
              icon={<Check className="vx-icon" size={16} />}
              label="Default organization intro page"
              onChange={({ target }) => onFieldChange("is_default", target.checked)}
              checked={data.is_default}
            />
          </div>
        </div>
        <div className="field">
          <div className="label" />
          <div className="form-element d-flex justify-content-between">
            {data.new ? null : (
              <Button
                disabled={isSomethingLoading}
                onClick={onIntroPageDelete}
                className={"organization-form_submit-button"}
                color="danger"
              >
                Remove
              </Button>
            )}

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
