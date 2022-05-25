import "./styles.scss";

import * as yup from "yup";
import { toast } from "react-toastify";
import { Row, Col, Button } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import React, { useState, useEffect, useMemo } from "react";

import appSlice from "app/slices/appSlice";
import { selectLoading } from "app/selectors";
import { readBlobAsDataURL } from "utility/file";
import FileInput from "components/formElements/FileInput";
import Editor from "components/FormCreate/Custom/WysiwygEditor";
import { selectOrganizations, selectSelectedOrganizationIdAndType } from "app/selectors/groupSelector";
import { useOrganizationLogoQuery, useOrganizationBrochureQuery } from "api/file/useOrganizationFileQueries";

const { createOrganizationRequest, updateOrganizationRequest } = appSlice.actions;

const getOrganizationData = (organization) => ({
  id: organization.id,
  type: organization.type,
  name: organization.name,
  intro_title: organization.intro_title,
  intro_text: organization.intro_text,
  logo: { file: null, url: null },
  brochure: { file: null, url: null },
});

const ORGANIZATION_TEMPLATE = getOrganizationData({
  type: "network",
  name: "",
  intro_title: "",
  intro_text: "",
});

const organizationValidation = yup.object().shape({
  type: yup.string().required("Corporation type is required. Please contact tech support if you see this message"),
  name: yup.string().required("Name is required"),
  intro_text: yup.string().required("Intro text is required"),
  intro_title: yup.string().required("Intro title is required"),
  logo: yup.mixed().required("Logo is required"),
  brochure: yup.mixed().required("Brochure is required"),
});

const filterOrganizationByTypeAndId = (organizations, type, id) => {
  return organizations.filter((organization) => organization.id === id && organization.type === type);
};

const Organization = ({ create = false }) => {
  const dispatch = useDispatch();

  const isLoading = useSelector(selectLoading);
  const organizations = useSelector(selectOrganizations);
  const { type: selectedType, id: selectedId } = useSelector(selectSelectedOrganizationIdAndType);

  const organization = useMemo(
    () => filterOrganizationByTypeAndId(organizations, selectedType, selectedId)[0],
    [organizations, selectedType, selectedId]
  );

  const organizationQueryArg = { organizationId: organization.id, organizationType: organization.type };

  const logoQuery = useOrganizationLogoQuery(organizationQueryArg, {
    enabled: Boolean(organization.logo?.id),
    onSuccess: ({ file }) => setLogoField(file),
  });
  const brochureQuery = useOrganizationBrochureQuery(organizationQueryArg, {
    enabled: Boolean(organization.brochure?.id),
    onSuccess: ({ file }) => setBrochureField(file),
  });

  const [isFilesLoading, setIsFilesLoading] = useState(false);
  const [organizationData, setOrganizationData] = useState(
    create ? ORGANIZATION_TEMPLATE : getOrganizationData(organization)
  );

  const handleSubmit = async () => {
    const isValid = await organizationValidation.validate(organizationData).catch((err) => {
      toast.error(err.message);
    });

    if (!isValid) {
      return;
    }

    const formData = new FormData();

    formData.set("type", organizationData.type);
    formData.set("name", organizationData.name);
    formData.set("intro_title", organizationData.intro_title);
    formData.set("intro_text", organizationData.intro_text);
    formData.set("logo", organizationData.logo.file);
    formData.set("brochure", organizationData.brochure.file);

    if (create) {
      dispatch(createOrganizationRequest(formData));
    } else {
      formData.set("id", organizationData.id);
      dispatch(updateOrganizationRequest(formData));
    }
  };

  const setOrganizationField = (name, value) => setOrganizationData((prev) => ({ ...prev, [name]: value }));

  const setOrganizationFileField = (name, file) => {
    if (!file) {
      setOrganizationField(name, { file: null, url: null });
      return;
    }

    readBlobAsDataURL(file).then((url) => setOrganizationField(name, { file, url }));
  };

  const setLogoField = (file) => setOrganizationFileField("logo", file);

  const setBrochureField = (file) => setOrganizationFileField("brochure", file);

  useEffect(() => {
    if (!create) {
      setOrganizationData(getOrganizationData(organization));
      setIsFilesLoading(false);
    }
  }, [selectedType, selectedId, create, organization]);

  useEffect(() => {
    if (create) {
      setOrganizationData(ORGANIZATION_TEMPLATE);
      setIsFilesLoading(false);
    }
  }, [create]);

  return (
    <Row>
      <Col sm={6} className={"organization-form"}>
        <h1>Organizations</h1>
        <div className={"field"}>
          <div className={"label"}>
            <label htmlFor="title">Title</label>
          </div>
          <div className={"form-element"}>
            <input
              type="text"
              name={"title"}
              id={"title"}
              className={"text-input"}
              value={organizationData.name || ""}
              disabled={isFilesLoading || isLoading}
              onChange={(e) => setOrganizationField("name", e.target.value)}
            />
          </div>
        </div>
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
              value={organizationData.intro_title || ""}
              disabled={isFilesLoading || isLoading}
              onChange={(e) => setOrganizationField("intro_title", e.target.value)}
            />
          </div>
        </div>
        <div className="field">
          <div className="label">Logo</div>
          <div className="form-element">
            <FileInput
              value={organizationData.logo.file}
              preview={organizationData.logo.url}
              onChange={setLogoField}
              loading={isFilesLoading || isLoading || logoQuery.isLoading}
              disabled={isFilesLoading || isLoading || logoQuery.isLoading}
              accept="image/png, image/jpeg"
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
                disabled={isLoading}
                type={"text"}
                orgId={create ? "create" : organizationData.name + organizationData.id}
                data={organizationData.intro_text || ""}
                onChange={({ rich, raw }) => setOrganizationField("intro_text", raw === "" ? "" : rich)}
              />
            </div>
          </div>
        </div>
        <div className="field">
          <div className="label">Brochure</div>
          <div className="form-element">
            <FileInput
              value={organizationData.brochure.file}
              onChange={setBrochureField}
              loading={isFilesLoading || isLoading || brochureQuery.isLoading}
              disabled={isFilesLoading || isLoading || brochureQuery.isLoading}
              accept="application/pdf"
            />
          </div>
        </div>
        <div className="field">
          <div className="label" />
          <div className="form-element d-flex justify-content-end">
            <Button
              disabled={isFilesLoading || isLoading}
              onClick={handleSubmit}
              className={"organization-form_submit-button"}
              color="primary"
            >
              {create ? "Save new organization" : "Save"}
            </Button>
          </div>
        </div>
      </Col>
    </Row>
  );
};

export default Organization;
