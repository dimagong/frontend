import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import {
  Card,
  CardBody
} from 'reactstrap'

import {logos} from 'constants/organizations'

import {
  getOrganizationsRequest,
  setContext,
  setSelectedOrganizationIdAndType,
} from 'app/slices/appSlice'

import { selectOrganizations } from 'app/selectors/groupSelector'

import './styles.scss'

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
        <Card key={org.name} style={{ minHeight: "120px"}}>
          <CardBody className="organizations-context-search_organization-card" onClick={() => {selectOrganization(org.id, org.type)}}>
            {(logos[org.name] && <img src={logos[org.name]} alt=""/>) || <div><img src={`${process.env.REACT_APP_API_URL}/api/file/${org?.logo?.id}`} /></div>}
          </CardBody>
        </Card>
      ))}
    </div>
  )
}

export default Organizations;
