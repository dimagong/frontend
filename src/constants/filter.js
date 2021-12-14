import React, {useSelector} from "react-redux";
import {selectOrganizations} from "../app/selectors/groupSelector";
import {getMemberFirms} from "../app/selectors/memberFirmsSelector";

export const FilterRolesOptions = () =>
  ['Admin', 'Corporation manager', 'Prospect', 'Suspect', 'Archived', 'Network manager', 'Member', 'Lead'];

export const FilterOrganizationsOptions = () => {
  const organizationsObjects = useSelector(selectOrganizations);
  return organizationsObjects.map(item => item.name.replace('_', ' '))
}

export const FilterMemberFirmsOptions = () => {
  const memberFirmsObjects = useSelector(getMemberFirms);
  return memberFirmsObjects?.length > 0 ? memberFirmsObjects.map(item => item?.main_fields.name) : []
}
