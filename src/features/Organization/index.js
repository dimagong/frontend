import React, { useState, useEffect } from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {toast} from "react-toastify"
import * as yup from 'yup';

import {Row, Col, Button} from 'reactstrap'

import FileInput from 'components/formElements/FileInput'

import {
  selectOrganizations,
  selectSelectedOrganizationIdAndType,
} from 'app/selectors/groupSelector'

import {selectLoading} from 'app/selectors'

import {
  createOrganizationRequest,
  updateOrganizationRequest,
} from 'app/slices/appSlice'

import './styles.scss'

import Editor from 'components/FormCreate/Custom/WysiwygEditor'

const organizationTemplate = {
  type: "network",
  name: "",
  intro_title: "",
  intro_text: "",
  logo: null,
  brochure: null,
}

const organizationValidation = yup.object().shape({
  type: yup.string().required("Corporation type is required. Please contact tech support if you see this message"),
  name: yup.string().required("Name is required"),
  intro_text: yup.string().required("Intro text is required"),
  intro_title: yup.string().required("Intro title is required"),
  logo: yup.mixed().required("Logo is required"),
  brochure: yup.mixed().required("Brochure is required"),
})

const Organization = ({ create = false }) => {
  const dispatch = useDispatch();

  const selectedOrganizationIdAndType = useSelector(selectSelectedOrganizationIdAndType);
  const organizations = useSelector(selectOrganizations);

  const isLoading = useSelector(selectLoading)

  let selectedOrganizationData = organizations.filter((org) => (
    org.id === selectedOrganizationIdAndType.id &&
    org.type === selectedOrganizationIdAndType.type
  ))[0]

  const [organizationData, setOrganizationData] = useState( create ? organizationTemplate : selectedOrganizationData)

  const [isFilesLoading, setIsFilesLoading] = useState(false)

  const fetchFile = async (file) => {
    let response = await fetch(`${process.env.REACT_APP_API_URL}/api/file/${file.id}`, {
      headers: new Headers({
        'Authorization': 'Bearer ' + localStorage.getItem("token"),
      }),
    });
    let data = await response.blob();
    let metadata = {
      type: file.mime_type
    };

    return new File([data], file.name, metadata);
  }

  const createFiles = async (file) => {
    setIsFilesLoading(true)

    const fetchedFile = await fetchFile(file)

    setIsFilesLoading(false)

    return fetchedFile
  }

  const handleSubmit = async () => {

    const isValid = await organizationValidation.validate(organizationData).catch((err) => {toast.error(err.message)})

    if (!isValid) {
      return
    }

    const dataToSubmit = new FormData();

    Object.keys(organizationTemplate).map((field) => {dataToSubmit.append(field, organizationData[field])})

    if (!(organizationData.logo instanceof File) && organizationData.logo?.name) {
      const logo = await createFiles(selectedOrganizationData.logo)
      dataToSubmit.append("logo", logo)
    }

    if (!(organizationData.brochure instanceof File) && organizationData.brochure?.name) {
      const brochure = await createFiles(selectedOrganizationData.brochure)
      dataToSubmit.append("brochure", brochure)
    }



    if (create) {
      dispatch(createOrganizationRequest(dataToSubmit))
    } else {
      dataToSubmit.append("id", organizationData.id)
      dispatch(updateOrganizationRequest(dataToSubmit))
    }
  }

  const handleFieldValueChange = (field, value) => {

    setOrganizationData({
      ...organizationData,
      [field]: value,
    })
  }

  useEffect(() => {
    if(!create) {
      setOrganizationData(selectedOrganizationData)
      setIsFilesLoading(false)
    }
  }, [selectedOrganizationIdAndType])

  useEffect(() => {
    if(create) {
      setOrganizationData(organizationTemplate)
      setIsFilesLoading(false)
    }
  }, [create])

  return (
    <Row>
      <Col sm={6} className={"organization-form"}>
        <h1>Organizations</h1>
        <div className={"field"}>
          <div className={"label"}>
            <label htmlFor="title">
              Title
            </label>
          </div>
          <div className={"form-element"}>
            <input
              type="text"
              name={"title"}
              id={"title"}
              className={"text-input"}
              value={organizationData.name || ""}
              disabled={isFilesLoading || isLoading}
              onChange={(e) => {handleFieldValueChange("name", e.target.value)}}
            />
          </div>
        </div>
        <div className={"field"}>
          <div className={"label"}>
            <label htmlFor="title">
              Intro title
            </label>
          </div>
          <div className={"form-element"}>
            <input
              type="text"
              name={"intro-title"}
              id={"intro-title"}
              className={"text-input"}
              value={organizationData.intro_title || ""}
              disabled={isFilesLoading || isLoading}
              onChange={(e) => {handleFieldValueChange("intro_title", e.target.value)}}
            />
          </div>
        </div>
        <div className="field">
          <div className="label">
            Logo
          </div>
          <div className="form-element">
            <FileInput
              acceptTypes={["image/png", "image/jpeg"]}
              value={organizationData.logo}
              preview={organizationData.logo?.base64 || organizationData.logo instanceof File && URL.createObjectURL(organizationData.logo)}
              onChange={(file) => {handleFieldValueChange("logo", file)}}
              loading={isFilesLoading || isLoading}
              disabled={isFilesLoading || isLoading}
            />
          </div>
        </div>
        <div className="field">
          <div className="label">
            Intro Text
          </div>
          <div className="form-element">
            <div className="editor-wrapper">
              <Editor id={`editor`}
                      orgPage
                      disabled={isLoading}
                      type={"text"}
                      orgId={create ? "create" : organizationData.name+organizationData.id}
                      data={organizationData.intro_text || ""}
                      onChange={({rich, raw}) => handleFieldValueChange("intro_text", raw === "" ? "" : rich)} />
            </div>
          </div>
        </div>
        <div className="field">
          <div className="label">
            Brochure
          </div>
          <div className="form-element">
            <FileInput
              acceptTypes={["application/pdf"]}
              value={organizationData.brochure}
              onChange={(file) => {handleFieldValueChange("brochure", file)}}
              loading={isFilesLoading || isLoading}
              disabled={isFilesLoading || isLoading}
            />
          </div>
        </div>
        <div className="field">
          <div className="label" />
          <div className="form-element d-flex justify-content-end">
            <Button disabled={isFilesLoading || isLoading} onClick={handleSubmit} className={"organization-form_submit-button"} color="primary">
              {create ? "Save new organization" : "Save" }
            </Button>
          </div>
        </div>
      </Col>
    </Row>
  )
}

export default Organization;
