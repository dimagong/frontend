import React from "react";
import {BreadcrumbItem, Breadcrumb} from 'reactstrap'
import './index.scss'

export default function Breadcrumbs(props) {
  return <Breadcrumb className="detail-navigation">
    {
      !props.list ? null : props.list.map((element, index) => <BreadcrumbItem key={index}>
        <div key={index} style={index ? { fontWeight: 'normal' } : { fontWeight: 'bold' }}>{element}</div>
      </BreadcrumbItem>)
    }
  </Breadcrumb>
}
