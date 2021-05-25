import React, {Fragment, useEffect, useState} from 'react'
import './styles.scss'
import LineChart from "./LineChart";
import appSlice from "app/slices/appSlice";
import {useDispatch, useSelector} from "react-redux";
import {selectDashboardData} from "app/selectors/userSelectors";
import ActivitiesDashboard from "./ActivitiesDashboard";
import ArrowDown from "assets/img/svg/arrow_down.svg";
import ArrowLeft from "assets/img/svg/arrow_left.svg";
import ArrowRight from "assets/img/svg/arrow_right.svg";
import CloseChart from "assets/img/svg/closeChart.svg";

const {
  getDashboardDataRequest,
  getActivityTypesRequest
} = appSlice.actions;

const Dashboard = ({ }) => {
  const dispatch = useDispatch();
  const dashboardData = useSelector(selectDashboardData)
  const [isActivitiesShown, setIsActivitiesShown] = useState(true);
  const [isChartShown, setIsChartShown] = useState(true);
  const [isOneChartShown, setIsOneChartShown] = useState(true);
  const [daysNumber, setDaysNumber] = useState(7)

  useEffect(() => {
    dispatch(getDashboardDataRequest({page: 1}));
    dispatch(getActivityTypesRequest());
  }, []);

  if (!isChartShown && !isActivitiesShown) {
    return null
  }

  return (<div className={'activity-dashboard'}>
    <h1 style={{fontWeight: 'bolder', color: '#707070'}}>Dashboard</h1>
    {isChartShown && <div className={'dashboard-charts'}>
      <div style={isOneChartShown ? {width: '45%', background: 'white'} : {width: '22.5%', background: 'white'}} className={'dashboard-one-chart'}>
            <span className={'arrow-left'}>
              <img src={isOneChartShown ? ArrowLeft : ArrowRight} onClick={() => setIsOneChartShown(!isOneChartShown)}/>
              <img src={CloseChart} className={'close-chart'} onClick={() => setIsChartShown(false)}/>
            </span>
            <span className={'change-chart-days ' + (!isOneChartShown ? ' change-chart-days-smaller' : '')}>
              {[{label: 'y', daysNumber: 365}, {label: 'm', daysNumber: 28}, {label: 'w', daysNumber: 7}].map(item => {
                return <span onClick={() => setDaysNumber(item.daysNumber)}
                             className={'chart-days ' + (daysNumber === item.daysNumber ? 'active-days' : '')}>
                  {item.label}
                </span>
              })}
            </span>
            {!isActivitiesShown && isOneChartShown &&
              <span className={'arrow-open-activities'} onClick={() => setIsActivitiesShown(true)}>
                <img src={ArrowDown}/>
              </span>}
            <LineChart
              chartId={'chart-1'}
              data={dashboardData?.usersActivitiesSchedule}
              aspectRatio={isOneChartShown ? 3 : 1.5}
              daysNumber={daysNumber}
            />
      </div>
    </div>}
    {isActivitiesShown &&
    <div style={isChartShown ? {borderTopColor: '#7367f0', background: 'white'} : {borderTopColor: '#707070', background: 'white'}} className={'dashboard-activities'}>
      <h3 className={'users-activities-title'}>Users activities</h3>
      <ActivitiesDashboard
        usersActivities={dashboardData?.usersActivities}
        isActivitiesShown={isActivitiesShown}
        setIsActivitiesShown={setIsActivitiesShown}
      />
    </div>}
  </div>)
}

export default Dashboard

