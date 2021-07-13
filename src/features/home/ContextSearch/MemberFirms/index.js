import React, { Fragment } from 'react';
import MemberFirmsContent from "./MemberFirmsContent";
import {selectManagers} from "app/selectors";
import {useSelector} from "react-redux";
import './index.scss';

const MemberFirmsContainer = () => {
  const managers = useSelector(selectManagers)
  return (
    <Fragment>
      <MemberFirmsContent
        managers={managers}
      />
    </Fragment>
  )
};

export default MemberFirmsContainer;
