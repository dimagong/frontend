import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import {
  Card,
  CardBody,
  Spinner,
} from 'reactstrap'

import {logos} from 'constants/organizations'

import {
  getOrganizationsRequest,
  setContext,
  setSelectedOrganizationIdAndType,
} from 'app/slices/appSlice'

import instance from 'api'

import { selectOrganizations } from 'app/selectors/groupSelector'

import './styles.scss'


const OrganizationCard = ({org, onSelect}) => {

  const [logo, setLogo] = useState("")
  const [isLoading, setLoading] = useState(false)

  const getBase64 = async (url, mime_type, id) => {
    return await instance
      .get(url, {
        responseType: 'arraybuffer'
      })
      .then(response => {
        const base64 = new Buffer(response.data, 'binary').toString('base64')
        const dataUrl = `data:${mime_type};base64, ${base64}`

        setLogo(dataUrl)
        setLoading(false)
      })
  }

  const getLogo = (logo) => {

    getBase64(`${process.env.REACT_APP_API_URL}/api/file/${logo?.id}`, logo.mime_type, logo.id)
  }

  useEffect(() => {
    if (org.logo && !logo) {
      setLoading(true)
      getLogo(org.logo)
    }

  }, [org.logo])

  return (
    <Card key={org.name} style={{ minHeight: "120px"}}>
      <CardBody className="organizations-context-search_organization-card" onClick={() => {onSelect(org.id, org.type)}}>
        {!!logo && (
          <img src={logo} alt={org.logo.name} />
        ) || isLoading && (
          <div
            className="user-edit__user-avatar_spinner-wrapper"
          >
            <Spinner color="primary" />
          </div>
        ) || (
          <div>{org.name}</div>
        )}
      </CardBody>
    </Card>
  )
}

const Organizations = () => {
  const dispatch = useDispatch()

  const organizationsData = useSelector(selectOrganizations)

  const selectOrganization = (id, type) => {
    dispatch(setSelectedOrganizationIdAndType({id, type}))
    dispatch(setContext("Organization"))
  }

  useEffect(() => {
    dispatch(getOrganizationsRequest())
  }, [])

  return (
    <div className={"home__card-wrapper organizations-context-search"}>
      {organizationsData.map((org) => (
        <OrganizationCard key={org.id} org={org} onSelect={() => {selectOrganization(org.id, org.type)}} />
      ))}
    </div>
  )
}

export default Organizations;
