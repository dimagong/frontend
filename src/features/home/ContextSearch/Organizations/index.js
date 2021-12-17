import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import {
  Card,
  CardBody,
  Spinner,
} from 'reactstrap'

import { selectOrganizations } from 'app/selectors/groupSelector'

import './styles.scss'

import appSlice from 'app/slices/appSlice'

const {
  getOrganizationsRequest,
  setContext,
  setSelectedOrganizationIdAndType,
} = appSlice.actions;

const OrganizationCard = ({org, onSelect}) => {

  const handleOrgSelect = () => {
    if(org.logo && !org.logo.isLoading){
      onSelect(org.id, org.type)
    }

    //Some orgs currently have logo === null, that case would be impossible in future. remove it then
    if(org.logo === null) {
      onSelect(org.id, org.type)
    }
  }

  return (
    <Card key={org.name} style={{ minHeight: "120px"}}>
      <CardBody className="organizations-context-search_organization-card" onClick={handleOrgSelect}>
        {/* eslint-disable-next-line no-mixed-operators */}
        {!!org.logo?.base64 && (
          <img src={org.logo.base64} alt={org.logo.name} />
          // eslint-disable-next-line no-mixed-operators
        ) || org.logo?.isLoading && (
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className={"home__card-wrapper organizations-context-search"}>
      {organizationsData.map((org) => (
        <OrganizationCard key={org.id+org.type} org={org} onSelect={() => {selectOrganization(org.id, org.type)}} />
      ))}
    </div>
  )
}

export default Organizations;
