import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import OrganizationCard from "components/OrganizationCard";

import { selectOrganizations } from "app/selectors/groupSelector";

import "./styles.scss";

import appSlice from "app/slices/appSlice";

const { getOrganizationsRequest, setContext, setSelectedOrganizationIdAndType } = appSlice.actions;

const Organizations = () => {
  const dispatch = useDispatch();

  const organizationsData = useSelector(selectOrganizations);

  const selectOrganization = (id, type) => {
    dispatch(setSelectedOrganizationIdAndType({ id, type }));
    dispatch(setContext("Organization"));
  };

  useEffect(() => {
    dispatch(getOrganizationsRequest());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={"home__card-wrapper organizations-context-search"}>
      {organizationsData.map((org) => (
        <OrganizationCard
          key={org.id + org.type}
          org={org}
          onSelect={() => {
            selectOrganization(org.id, org.type);
          }}
        />
      ))}
    </div>
  );
};

export default Organizations;
