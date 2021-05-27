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
  const [isChartShown, setIsChartShown] = useState([true, true]);
  const [isBigChartShown, setIsBigChartShown] = useState([true, true]);
  const [daysNumber, setDaysNumber] = useState([7, 7])

  const handleChangeChart = () => {
    if (isBigChartShown[0]) {
      setIsActivitiesShown(false);
    }
    setIsBigChartShown([!isBigChartShown[0], isBigChartShown[1]]);
  }

  useEffect(() => {
    dispatch(getDashboardDataRequest({page: 1}));
    dispatch(getActivityTypesRequest());
  }, []);

  if (!isChartShown && !isActivitiesShown) {
    return null
  }

  return (<div className={'activity-dashboard'}>
    <h1 style={{fontWeight: 'bolder', color: '#707070', marginBottom: '3vh'}}>Dashboard</h1>
    {(isChartShown[0]) && <div className={'dashboard-charts'}>
      {isChartShown[0] &&
      <div style={isBigChartShown[0] ? {width: '45%', background: 'white', marginRight: '1%'} : {width: '22%', background: 'white', marginRight: '1%'}}
           className={'dashboard-one-chart'}>
            <span className={'arrow-left'}>
              <img src={isBigChartShown[0] ? ArrowLeft : ArrowRight}
                   onClick={handleChangeChart}/>
              <img src={CloseChart} className={'close-chart'}
                   onClick={() => setIsChartShown([false, isChartShown[1]])}/>
            </span>
        <span className={'change-chart-days ' + (!isBigChartShown[0] ? ' change-chart-days-smaller' : '')}>
              {[{label: 'y', daysNumber: 365}, {label: 'm', daysNumber: 28}, {label: 'w', daysNumber: 7}].map(item => {
                return <span onClick={() => setDaysNumber([item.daysNumber, daysNumber[1]])}
                             className={'chart-days ' + (daysNumber[0] === item.daysNumber ? 'active-days' : '')}>
                  {item.label}
                </span>
              })}
            </span>
        {!isActivitiesShown && isBigChartShown[0] &&
        <span className={'arrow-open-activities'} onClick={() => setIsActivitiesShown(true)}>
                <img src={ArrowDown}/>
              </span>}
        <LineChart
          title={'Actions'}
          chartId={'chart-1'}
          data={dashboardData?.usersActivitiesSchedule}
          aspectRatio={isBigChartShown[0] ? 3 : 1.46}
          daysNumber={daysNumber[0]}
        />
      </div>}
    </div>}
    {isActivitiesShown &&
    <div style={isChartShown ? {borderTopColor: '#7367f0', background: 'white'} : {
      borderTopColor: '#707070',
      background: 'white'
    }} className={'dashboard-activities'}>
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

