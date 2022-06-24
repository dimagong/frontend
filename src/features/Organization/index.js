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
import IntroPageForm from "./Components/IntroPageForm";
import { selectOrganizations, selectSelectedOrganizationIdAndType } from "app/selectors/groupSelector";
import { useOrganizationLogoQuery, useOrganizationBrochureQuery } from "api/file/useOrganizationFileQueries";

import ContextTemplate from "../../components/ContextTemplate";
import ContextFeatureTemplate from "../../components/ContextFeatureTemplate";

import WelcomePageComponent from "../onboarding/components/WeclomePage";
import { useQuery } from "react-query";
import { clientAPI } from "../../api/clientAPI";
import Select, { components } from "react-select";
import { prepareSelectReviewers } from "../../utility/select/prepareSelectData";
import { ChevronDown, Plus } from "react-feather";
import { useGenericMutation } from "../../api/useGenericMutation";
import { authDTO } from "../../api/Auth/authDTO";
import { loginWithSecretCodeQueryKeys } from "../../api/Auth/authQuery";

const { createOrganizationRequest, updateOrganizationRequest } = appSlice.actions;

const selectStyles = {
  control: (styles) => ({
    ...styles,
    backgroundColor: "white",
    border: "1px solid rgba(34, 60, 80, 0.2)",
    borderRadius: "8px",
    // This line disable the blue border
    boxShadow: "none",
    minHeight: "auto",
    cursor: "pointer",
    padding: "0 0 0 7px",
    fontSize: "11px",
    fontFamily: "Montserrat",
  }),
  placeholder: (styles) => ({
    ...styles,
    color: "#4B484D",
  }),
  input: (styles) => ({
    ...styles,

    padding: "6px 7px 6px 0",
  }),

  indicatorSeparator: () => ({ display: "none" }),
};

const DropdownIndicator = (props) => {
  return (
    <components.DropdownIndicator {...props}>
      <ChevronDown />
    </components.DropdownIndicator>
  );
};

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
});

const INTRO_PAGE_TEMPLATE = {
  intro_title: "Title example",
  intro_text: "Intro text example",
  brochure: { file: null, url: null },
  new: true,
};

const organizationValidation = yup.object().shape({
  type: yup.string().required("Corporation type is required. Please contact tech support if you see this message"),
  name: yup.string().required("Name is required"),
  // intro_text: yup.string().required("Intro text is required"),
  // intro_title: yup.string().required("Intro title is required"),
  logo: yup.object().shape({
    url: yup.string().nullable().required("Logo is required"),
    file: yup.mixed().nullable().required("Logo is required"),
  }),
  // brochure: yup.object().shape({
  //   url: yup.string().nullable().required("Brochure is required"),
  //   file: yup.mixed().nullable().required("Brochure is required"),
  // }),
});

const filterOrganizationByTypeAndId = (organizations, type, id) => {
  return organizations.filter((organization) => organization.id === id && organization.type === type);
};

const useIntroPages = (organizationType, organizationId, options = {}) => {
  return useQuery({
    queryKey: ["intro-pages", organizationId],
    queryFn: ({ signal }) => clientAPI.get(`api/organization/${organizationType}/${organizationId}/intro`, { signal }),
    ...options,
  });
};

const useIntroPageCreate = (type, id, options) => {
  return useGenericMutation(
    {
      url: `/api/organization/${type}/${id}/intro`,
      method: "post",
      queryKey: ["intro-page-create"],
    },
    {
      ...options,
    }
  );
};

const useIntroPageUpdate = (type, id, introId, options) => {
  return useGenericMutation(
    {
      url: `/api/organization/${type}/${id}/intro/${introId}`,
      method: "post",
      queryKey: ["intro-page-update"],
    },
    {
      ...options,
    }
  );
};

const Organization = ({ create = false }) => {
  const dispatch = useDispatch();

  const isLoading = useSelector(selectLoading);
  const organizations = useSelector(selectOrganizations);
  const { type: selectedType, id: selectedId } = useSelector(selectSelectedOrganizationIdAndType);

  const [introPages, setIntroPages] = useState([]);
  const [selectedIntroPage, setSelectedIntroPage] = useState(null);

  useIntroPages(selectedType, selectedId, {
    enabled: Boolean(selectedType) && Boolean(selectedId),
    staleTime: Infinity,
    onSuccess: (introPages) => {
      setIntroPages(introPages);
      if (introPages.length) {
        setSelectedIntroPage(introPages[0]);
      } else {
        setSelectedIntroPage(INTRO_PAGE_TEMPLATE);
      }
    },
  });

  const organization = useMemo(
    () => filterOrganizationByTypeAndId(organizations, selectedType, selectedId)[0],
    [organizations, selectedType, selectedId]
  );

  const createIntroPage = useIntroPageCreate(organization?.type, organization?.id, {
    onSuccess: () => {},
  });

  const updateIntroPage = useIntroPageUpdate(organization?.type, organization?.id, selectedIntroPage?.id, {
    onSuccess: () => {},
  });

  const organizationQueryArg = { organizationId: organization?.id, organizationType: organization?.type };

  const logoQuery = useOrganizationLogoQuery(organizationQueryArg, {
    enabled: Boolean(organization?.logo?.id),
    onSuccess: ({ file }) => setLogoField(file),
  });
  const brochureQuery = useOrganizationBrochureQuery(organizationQueryArg, {
    enabled: Boolean(selectedIntroPage?.brochure?.id),
    onSuccess: ({ file }) => console.log(file),
  });

  const [isFilesLoading, setIsFilesLoading] = useState(false);
  const [organizationData, setOrganizationData] = useState(
    create ? ORGANIZATION_TEMPLATE : getOrganizationData(organization)
  );

  const recoverRemovedFilesData = () => {
    if (organizationData.logo.file === null) {
      setLogoField(logoQuery.data.file);
    }

    if (organizationData.brochure.file === null) {
      setBrochureField(brochureQuery.data.file);
    }
  };

  const setIntroPageField = (name, value) => setSelectedIntroPage((prev) => ({ ...prev, [name]: value }));

  const handleSubmit = async () => {
    const isValid = await organizationValidation.validate(organizationData).catch((err) => {
      toast.error(err.message);
    });

    if (!isValid) {
      // If some files was removed than recover them for better UX when form validation fails
      recoverRemovedFilesData();
      return;
    }

    const formData = new FormData();

    formData.set("type", organizationData.type);
    formData.set("name", organizationData.name);
    // formData.set("intro_title", organizationData.intro_title);
    // formData.set("intro_text", organizationData.intro_text);
    formData.set("logo", organizationData.logo.file);
    // formData.set("brochure", organizationData.brochure.file);

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

  const initNewIntroPage = () => {
    if (selectedIntroPage && (selectedIntroPage.new || selectedIntroPage.edited)) {
      toast.warn("Save current changes of intro page before you can create new");
    } else {
      setSelectedIntroPage(INTRO_PAGE_TEMPLATE);
    }
  };

  const handleIntroPageSave = () => {};

  const handleIntroPageCreate = () => {};

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
    <div className={"d-flex"}>
      <ContextTemplate contextTitle={"Organization"}>
        <Row>
          <Col md={12} className={"organization-form"}>
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
        {!create && (
          <>
            <div className="mt-3 mb-2 d-flex justify-content-between align-items-center">
              <h2>Intro pages</h2>
              <div className="survey-assign_body_reviewers-select_container">
                <div className="survey-assign_body_reviewers-select_container_select">
                  <Select
                    components={{ DropdownIndicator }}
                    value={{ value: selectedIntroPage, label: selectedIntroPage?.intro_title }}
                    styles={selectStyles}
                    options={introPages.map((introPage) => ({ value: introPage, label: introPage.intro_title })) || []}
                    noOptionsMessage={() => "There are no created intro pages"}
                    onChange={(value) => {
                      setSelectedIntroPage(value.value);
                    }}
                  />
                </div>
                <button
                  onClick={() => {
                    initNewIntroPage();
                  }}
                >
                  <Plus />
                </button>
              </div>
            </div>
            {selectedIntroPage && (
              <IntroPageForm
                data={selectedIntroPage}
                isBrochureLoading={isFilesLoading || isLoading || brochureQuery.isLoading}
                create={create}
                onFieldChange={setIntroPageField}
                onIntroPageSave={handleIntroPageSave}
                onIntroPageCreate={handleIntroPageCreate}
              />
            )}
          </>
        )}
      </ContextTemplate>
      {!create && selectedIntroPage && (
        <ContextFeatureTemplate contextFeatureTitle="Intro page preview">
          <WelcomePageComponent
            onSubmit={() => {}}
            introText={selectedIntroPage.intro_text}
            introTitle={selectedIntroPage.intro_title}
            isOnboardingExist={true}
            brochureUrl={selectedIntroPage.brochure.url}
            brochureName={selectedIntroPage.brochure?.file?.name}
            organization={organizationData}
            preview
          />
        </ContextFeatureTemplate>
      )}
    </div>
  );
};

export default Organization;
