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

const {
  getDashboardDataRequest,
  getActivityTypesRequest
} = appSlice.actions;

const Dashboard = ({ }) => {
  const dispatch = useDispatch();
  const dashboardData = useSelector(selectDashboardData)
  const [isActivitiesShown, setIsActivitiesShown] = useState(true);
  const [isOneChartShown, setIsOneChartShown] = useState(true);
  const [daysNumber, setDaysNumber] = useState([7, 7])

  useEffect(() => {
    dispatch(getDashboardDataRequest({page: 1}));
    dispatch(getActivityTypesRequest());
  }, []);

  return (<div className={'activity-dashboard'}>
    <h1 style={{fontWeight: 'bolder', color: '#707070'}}>Dashboard</h1>
    <div className={'dashboard-charts'}>
      {isOneChartShown
        ? <div className={'dashboard-one-chart'}>
            <span className={'arrow-left'} onClick={() => setIsOneChartShown(false)}>
              <img src={ArrowLeft}/>
            </span>
            <span className={'change-chart-days'}>
              {[{label: 'y', daysNumber: 365}, {label: 'm', daysNumber: 28}, {label: 'w', daysNumber: 7}].map(item => {
                return <span onClick={() => setDaysNumber([item.daysNumber, daysNumber[1]])}
                             className={'chart-days ' + (daysNumber[0] === item.daysNumber ? 'active-days' : '')}>
                  {item.label}
                </span>
              })}
            </span>
            <LineChart
              chartId={'one-chart'}
              data={dashboardData?.usersActivitiesSchedule}
              aspectRatio={4}
              daysNumber={daysNumber[0]}
            />
          </div>
        : <div>
            {[0, 1].map(item =>
              <div style={item === 0 ? {marginRight: '2%'} : {}} className={'dashboard-chart-parts'}>
                <span className={'arrow-left'}
                      onClick={() => {setDaysNumber([daysNumber[item], daysNumber[(item + 1) % 2]]); setIsOneChartShown(true)}}>
                  <img src={ArrowRight}/>
                </span>
                <span className={'change-chart-days multiple-change-chart-days'}>
                  {[{label: 'y', daysNumber: 365}, {label: 'm', daysNumber: 28}, {label: 'w', daysNumber: 7}].map(itemDays => {
                    return <span onClick={() => {
                              let copyArr = daysNumber.slice();
                              copyArr[item] = itemDays.daysNumber;
                              setDaysNumber(copyArr)}}
                                 className={'chart-days ' + (daysNumber[item] === itemDays.daysNumber ? 'active-days' : '')}>
                      {itemDays.label}
                    </span>
                  })}
                </span>
                <LineChart
                  chartId={'chart-' + item.toString()}
                  data={dashboardData?.usersActivitiesSchedule}
                  aspectRatio={2}
                  daysNumber={daysNumber[item]}
                />
              </div>)}
          </div>

      }
      {!isActivitiesShown &&
      <span className={'arrow-open-activities'} onClick={() => setIsActivitiesShown(true)}>
        <img src={ArrowDown}/>
      </span>}
    </div>
    <div className={'dashboard-activities'}>
      <h3 className={'users-activities-title'}>Users activities</h3>
      <ActivitiesDashboard
        usersActivities={dashboardData?.usersActivities}
        isActivitiesShown={isActivitiesShown}
        setIsActivitiesShown={setIsActivitiesShown}
      />
    </div>
  </div>)
}

export default Dashboard

