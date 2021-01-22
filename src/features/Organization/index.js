import React, { useState } from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {toast} from "react-toastify"
import * as yup from 'yup';

import {Row, Col, Button} from 'reactstrap'

import FileInput from 'components/formElements/FileInput'
import TextArea from 'components/formElements/TextArea'

import {
  selectOrganizationEdit,
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

  const selectedOrganizationData = useSelector(selectOrganizationEdit);

  const [organizationData, setOrganizationData] = useState( create ? organizationTemplate : selectedOrganizationData)

  const handleSubmit = async () => {
    const isValid = await organizationValidation.isValid(organizationData)
    console.log(isValid)
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
    setOrganizationData({
      ...organizationData,
      [field]: value,
    })
  }

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
            />
          </div>
        </div>
        <div className="field">
          <div className="label" />
          <div className="form-element d-flex justify-content-end">
            <Button onClick={handleSubmit} className={"organization-form_submit-button"} color="primary">
              {create ? "Save new organization" : "Save" }
            </Button>
          </div>
        </div>
      </Col>
    </Row>
  )
}

export default Organization;
