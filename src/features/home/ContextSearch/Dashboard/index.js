import React, {Fragment, useState} from 'react'
import './styles.scss'
import {Row} from "react-bootstrap";
import LineChart from "./LineChart";
import {Button} from "reactstrap";

const Dashboard = ({ }) => {
  const [data, setData] = useState(0);
  return (<div className={'activity-dashboard'}>
    <h1>Dashboard</h1>
    <Row className={'dashboard-charts'}>
      <LineChart chartId={'chart1'} data={data}/>
    </Row>
    <Row className={'dashboard-activities'}>
      <LineChart chartId={'chart2'} data={data}/>
    </Row>
  </div>)
}

export default Dashboard

