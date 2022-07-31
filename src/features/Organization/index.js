import "./styles.scss";

import * as yup from "yup";
import { toast } from "react-toastify";
import { Row, Col, Button } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import React, { useState, useEffect } from "react";

import appSlice from "app/slices/appSlice";
import { readBlobAsDataURL } from "utility/file";
import FileInput from "components/formElements/FileInput";
import IntroPageForm from "./Components/IntroPageForm";
import { selectOrganizations, selectSelectedOrganizationIdAndType } from "app/selectors/groupSelector";
import { useOrganizationLogoQuery, useOrganizationBrochureQuery } from "api/file/useOrganizationFileQueries";

import ContextTemplate from "../../components/ContextTemplate";
import ContextFeatureTemplate from "../../components/ContextFeatureTemplate";

import WelcomePageComponent from "../onboarding/components/WeclomePage";
import Select, { components } from "react-select";
import { ChevronDown, Plus } from "react-feather";
import { useGenericMutation } from "../../api/useGenericMutation";
import { createQueryKey } from "../../api/createQueryKey";
import { useGenericQuery } from "../../api/useGenericQuery";

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
  logo: { file: null, url: null },
});

const ORGANIZATION_TEMPLATE = getOrganizationData({
  type: "network",
  name: "",
});

const INTRO_PAGE_TEMPLATE = {
  is_default: false,
  intro_title: "Title example",
  intro_text: "Intro text example",
  download_text: "Download text example",
  brochure: { file: null, url: null },
  new: true,
};

const organizationValidation = yup.object().shape({
  type: yup.string().required("Corporation type is required. Please contact tech support if you see this message"),
  name: yup.string().required("Name is required"),
  logo: yup.object().shape({
    url: yup.string().nullable().required("Logo is required"),
    file: yup.mixed().nullable().required("Logo is required"),
  }),
});

const introPageValidation = yup.object().shape({
  is_default: yup.boolean().required("Default is required"),
  intro_text: yup.string().required("Intro text is required"),
  intro_title: yup.string().required("Intro title is required"),
  brochure: yup.object().shape({
    url: yup.string().nullable().required("Brochure is required"),
    file: yup.mixed().nullable().required("Brochure is required"),
  }),
});

const filterOrganizationByTypeAndId = (organizations, type, id) => {
  return organizations.filter((organization) => organization.id === id && organization.type === type);
};

const IntroPageKey = createQueryKey("Intro page");

const IntroPageKeys = {
  all: (organizationId, organizationType) => [IntroPageKey, { organizationId, organizationType }],
};

export const useIntroPages = ({ organizationType, organizationId }, options) => {
  return useGenericQuery(
    {
      queryKey: IntroPageKeys.all(organizationId, organizationType),
      url: `api/organization/${organizationType}/${organizationId}/intro`,
    },
    options
  );
};

export const useIntroPageCreate = ({ organizationType, organizationId }, options) => {
  return useGenericMutation(
    {
      url: `/api/organization/${organizationType}/${organizationId}/intro`,
      method: "post",
      queryKey: IntroPageKeys.all(organizationId, organizationType),
    },
    {
      ...options,
    }
  );
};

export const useIntroPageUpdate = ({ organizationType, organizationId, introPageId }, options) => {
  return useGenericMutation(
    {
      url: `/api/organization/${organizationType}/${organizationId}/intro/${introPageId}`,
      method: "post",
      queryKey: IntroPageKeys.all(organizationId, organizationType),
    },
    {
      ...options,
    }
  );
};

export const useIntroPageDelete = ({ organizationType, organizationId, introPageId }, options) => {
  return useGenericMutation(
    {
      url: `/api/organization/${organizationType}/${organizationId}/intro/${introPageId}`,
      method: "delete",
      queryKey: IntroPageKeys.all(organizationId, organizationType),
    },
    {
      ...options,
    }
  );
};

const Organization = ({ create = false }) => {
  const dispatch = useDispatch();

  const organizations = useSelector(selectOrganizations);
  const { type: selectedType, id: selectedId } = useSelector(selectSelectedOrganizationIdAndType);

  const organization = filterOrganizationByTypeAndId(organizations, selectedType, selectedId)[0];
  const organizationQueryArg = { organizationId: organization?.id, organizationType: organization?.type };

  const [introPages, setIntroPages] = useState([]);
  const [selectedIntroPage, setSelectedIntroPage] = useState(null);

  useIntroPages(organizationQueryArg, {
    enabled: !create && Boolean(selectedType) && Boolean(selectedId),

    refetchOnWindowFocus: false,

    onSuccess: (introPages) => {
      setIntroPages(introPages);

      if (introPages.length) {
        setSelectedIntroPage(
          selectedIntroPage ? introPages.find(({ id }) => selectedIntroPage.id === id) : introPages[0]
        );
        brochureQuery.data && setBrochureField(brochureQuery.data.file);
      } else {
        setSelectedIntroPage(INTRO_PAGE_TEMPLATE);
      }
    },
  });

  const createIntroPage = useIntroPageCreate(organizationQueryArg, {
    onSuccess: (introPage) => {
      setSelectedIntroPage(introPage);
      toast.success("Intro page created successfully.");
    },
  });

  const updateIntroPage = useIntroPageUpdate(
    { ...organizationQueryArg, introPageId: selectedIntroPage?.id },
    { onSuccess: () => toast.success("Intro page saved successfully.") }
  );

  const deleteIntroPage = useIntroPageDelete(
    { ...organizationQueryArg, introPageId: selectedIntroPage?.id },
    {
      onSuccess: () => {
        setSelectedIntroPage(null);
        toast.success("Intro page removed successfully.");
      },
    }
  );

  const logoQuery = useOrganizationLogoQuery(organizationQueryArg, {
    enabled: !create && Boolean(organization?.logo?.id),
    onSuccess: ({ file }) => setLogoField(file),
  });
  const brochureQuery = useOrganizationBrochureQuery(
    { introPageId: selectedIntroPage?.id },
    {
      enabled: !create && Boolean(selectedIntroPage?.id),
      onSuccess: ({ file }) => setBrochureField(file),
    }
  );

  const [organizationData, setOrganizationData] = useState(
    create ? ORGANIZATION_TEMPLATE : getOrganizationData(organization)
  );

  const setIntroPageField = (name, value) => setSelectedIntroPage((prev) => ({ ...prev, [name]: value }));

  const handleSubmit = async () => {
    const isValid = await organizationValidation.validate(organizationData).catch((err) => {
      toast.error(err.message);
    });

    if (!isValid) {
      // If some files was removed than recover them for better UX when form validation fails
      if (organizationData.logo.file === null) {
        setLogoField(logoQuery.data.file);
      }
      return;
    }

    const formData = new FormData();

    formData.set("type", organizationData.type);
    formData.set("name", organizationData.name);
    formData.set("logo", organizationData.logo.file);

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

  const setBrochureField = (file) => {
    if (!file) {
      setIntroPageField("brochure", { file: null, url: null });
      return;
    }

    readBlobAsDataURL(file).then((url) => setIntroPageField("brochure", { file, url }));
  };

  const setIntroPagesFields = (name, value) => {
    switch (name) {
      case "brochure":
        setBrochureField(value);
        break;
      default:
        setIntroPageField(name, value);
    }
  };

  const initNewIntroPage = () => {
    if (selectedIntroPage && (selectedIntroPage.new || selectedIntroPage.edited)) {
      toast.warn("Save current changes of intro page before you can create new");
    } else {
      setSelectedIntroPage(INTRO_PAGE_TEMPLATE);
    }
  };

  const handleIntroPageSave = async () => {
    const isValid = await introPageValidation.validate(selectedIntroPage).catch((err) => {
      toast.error(err.message);
    });

    if (!isValid) {
      // If some files was removed than recover them for better UX when form validation fails
      if (selectedIntroPage.brochure.file === null) {
        setBrochureField(brochureQuery.data.file);
      }
      return;
    }

    const formData = new FormData();

    formData.set("is_default", Number(selectedIntroPage.is_default));
    formData.set("intro_title", selectedIntroPage.intro_title);
    formData.set("intro_text", selectedIntroPage.intro_text);
    formData.set("download_text", selectedIntroPage.download_text);
    formData.set("brochure", selectedIntroPage.brochure.file);
    formData.set("_method", "PUT");

    updateIntroPage.mutate(formData);
  };

  const handleIntroPageCreate = async () => {
    const isValid = await introPageValidation.validate(selectedIntroPage).catch((err) => {
      toast.error(err.message);
    });

    if (!isValid) {
      // If some files was removed than recover them for better UX when form validation fails
      if (selectedIntroPage.brochure.file === null) {
        setBrochureField(brochureQuery.data.file);
      }
      return;
    }

    const formData = new FormData();

    formData.set("is_default", Number(selectedIntroPage.is_default));
    formData.set("intro_title", selectedIntroPage.intro_title);
    formData.set("intro_text", selectedIntroPage.intro_text);
    formData.set("download_text", selectedIntroPage.download_text);
    formData.set("brochure", selectedIntroPage.brochure.file);

    createIntroPage.mutate(formData);
  };

  const handlerIntroPageDelete = () => {
    const sure = window.confirm("Are you sure you want to delete ?");

    if (sure) {
      deleteIntroPage.mutate();
    }
  };

  useEffect(() => {
    if (!create) {
      setOrganizationData(getOrganizationData(organization));
    }
  }, [selectedType, selectedId, create, organization]);

  useEffect(() => {
    if (create) {
      setOrganizationData(ORGANIZATION_TEMPLATE);
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
                  loading={logoQuery.isLoading}
                  disabled={logoQuery.isLoading}
                  accept="image/png, image/jpeg"
                />
              </div>
            </div>
            <div className="field">
              <div className="label" />
              <div className="form-element d-flex justify-content-end">
                <Button
                  disabled={logoQuery.isLoading || brochureQuery.isLoading}
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

        {!create ? (
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
                    onChange={(option) => setSelectedIntroPage(option.value)}
                  />
                </div>
                <button onClick={() => initNewIntroPage()}>
                  <Plus />
                </button>
              </div>
            </div>

            {selectedIntroPage ? (
              <IntroPageForm
                data={selectedIntroPage}
                isBrochureLoading={brochureQuery.isLoading}
                create={create}
                onFieldChange={setIntroPagesFields}
                onIntroPageSave={handleIntroPageSave}
                onIntroPageCreate={handleIntroPageCreate}
                onIntroPageDelete={handlerIntroPageDelete}
                isSomethingLoading={createIntroPage.isLoading || updateIntroPage.isLoading || deleteIntroPage.isLoading}
              />
            ) : null}
          </>
        ) : null}
      </ContextTemplate>

      {!create && selectedIntroPage ? (
        <ContextFeatureTemplate contextFeatureTitle="Intro page preview">
          <WelcomePageComponent
            onSubmit={() => {}}
            introText={selectedIntroPage.intro_text}
            introTitle={selectedIntroPage.intro_title}
            downloadText={selectedIntroPage.download_text}
            isOnboardingExist={true}
            brochureUrl={selectedIntroPage.brochure.url}
            brochureName={selectedIntroPage.brochure?.file?.name}
            organization={organizationData}
            preview
          />
        </ContextFeatureTemplate>
      ) : null}
    </div>
  );
};

export default Organization;
