import React from 'react'
import './styles.scss'
import CombinedDashboardComponent from "./CombinedDashboardComponent";


const Dashboard = ({ }) => {

  return (<div className={'activity-dashboard'}>
    <h1 style={{fontWeight: 'bolder', color: '#707070', marginBottom: '3vh'}}>Dashboard</h1>
    <CombinedDashboardComponent
      chartId={'chart-1'}
      chartType={'Activities'}
    />
    <CombinedDashboardComponent
      chartId={'chart-2'}
      chartType={'Applications'}
    />
  </div>)
}

export default Dashboard

