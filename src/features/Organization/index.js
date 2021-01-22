import React, { useState, useEffect } from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {toast} from "react-toastify"
import * as yup from 'yup';

import {Row, Col, Button} from 'reactstrap'

import FileInput from 'components/formElements/FileInput'
import TextArea from 'components/formElements/TextArea'

import {
  selectOrganizationEdit, selectSelectedOrganizationIdAndType
} from 'app/selectors/groupSelector'

import {
  createOrganizationRequest,
  updateOrganizationRequest,
} from 'app/slices/appSlice'

import './styles.scss'

const organizationTemplate = {
  type: "network",
  name: "",
  intro_text: "",
  logo: null,
  brochure: null,
}

const organizationValidation = yup.object().shape({
  type: yup.string().required("Corporation type is required. Please contact tech support if you see this message"),
  name: yup.string().required("Name is required"),
  intro_text: yup.string().required("Intro text is required"),
  logo: yup.mixed().required("Logo is required"),
  brochure: yup.mixed().required("Brochure is required"),
})

const Organization = ({ create = false }) => {
  const dispatch = useDispatch();

  const test = useSelector(selectSelectedOrganizationIdAndType)
  const selectedOrganizationData = useSelector(selectOrganizationEdit);

  const [organizationData, setOrganizationData] = useState( create ? organizationTemplate : selectedOrganizationData)

  const [isFilesLoading, setIsFilesLoading] = useState(organizationData.logo !== null)

  const handleSubmit = async () => {

    const isValid = await organizationValidation.validate(organizationData).catch((err) => {toast.error(err.message)})

    if (!isValid) {
      return
    }

    const dataToSubmit = new FormData();

    Object.keys(organizationTemplate).map((field) => {dataToSubmit.append(field, organizationData[field])})

    if (create) {
      dispatch(createOrganizationRequest(dataToSubmit))
    } else {
      dataToSubmit.append("id", organizationData.id)
      dispatch(updateOrganizationRequest(dataToSubmit))
    }
  }

  const handleFieldValueChange = (field, value) => {
    console.log("filed" , organizationData)
    setOrganizationData({
      ...organizationData,
      [field]: value,
    })
  }


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

  const createFiles = async (logo, brochure) => {
    setIsFilesLoading(true)

    const logoFile = await fetchFile(logo)
    const brochureFile = await fetchFile(brochure)

    setOrganizationData({
      ...organizationData,
      logo: logoFile,
      brochure: brochureFile,
    })

    setIsFilesLoading(false)
  }

  useEffect(() => {
    if (!(organizationData.logo instanceof File) && organizationData.logo?.name) {
      createFiles(organizationData.logo, organizationData.brochure)
    }
  }, [selectedOrganizationData])

  console.log(organizationData)

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
              value={organizationData.name}
              disabled={isFilesLoading}
              onChange={(e) => {handleFieldValueChange("name", e.target.value)}}
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
              onChange={(file) => {handleFieldValueChange("logo", file)}}
              loading={isFilesLoading}
              disabled={isFilesLoading}
            />
          </div>
        </div>
        <div className="field">
          <div className="label">
            Intro Text
          </div>
          <div className="form-element">
            <TextArea
              value={organizationData.intro_text}
              onChange={(e) => {handleFieldValueChange("intro_text", e.target.value)}}
              disabled={isFilesLoading}
            />
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
              loading={isFilesLoading}
              disabled={isFilesLoading}
            />
          </div>
        </div>
        <div className="field">
          <div className="label" />
          <div className="form-element d-flex justify-content-end">
            <Button disabled={isFilesLoading} onClick={handleSubmit} className={"organization-form_submit-button"} color="primary">
              {create ? "Save new organization" : "Save" }
            </Button>
          </div>
        </div>
      </Col>
    </Row>
  )
}

export default Organization;
