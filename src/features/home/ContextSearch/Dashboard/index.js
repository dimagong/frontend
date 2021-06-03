import React, {useEffect} from 'react'
import './styles.scss'
import CombinedDashboardComponent from "./CombinedDashboardComponent";
import {useDispatch, useSelector} from "react-redux";
import appSlice from "app/slices/appSlice";
import {selectDashboardSettings} from "../../../../app/selectors/userSelectors";

const {
  getSettingsRequest,
  postSettingsRequest,
  patchSettingsRequest,
  getActivityTypesRequest,
} = appSlice.actions;

const Dashboard = ({ }) => {
  const dispatch = useDispatch();
  const dashboardSettings = useSelector(selectDashboardSettings)

  const updateSettings = (newSettings) => {
    if (dashboardSettings.hasOwnProperty('id')) {
      let changeSettingsIndex = dashboardSettings.value.findIndex(item => item.title === newSettings.title);
      let newDashboardSettings = [...dashboardSettings.value];
      newDashboardSettings[changeSettingsIndex] = newSettings;
      dispatch(patchSettingsRequest({value: newDashboardSettings, id: dashboardSettings.id}));
    } else {
      let initialSettings = [{state: 'large', title: 'Activities', daysNumber: 7, filter: null},
        {state: 'large', title: 'Applications', daysNumber: 7, filter: null}]
      let changeSettingsIndex = initialSettings.findIndex(item => item.title === newSettings.title);
      initialSettings[changeSettingsIndex] = newSettings;
      dispatch(postSettingsRequest(initialSettings))
    }
  }

  useEffect(() => {
    dispatch(getSettingsRequest());
    dispatch(getActivityTypesRequest());
  }, []);

  return (<div className={'activity-dashboard'}>
    <h1 style={{fontWeight: 'bolder', color: '#707070', marginBottom: '3vh'}}>Dashboard</h1>
    <CombinedDashboardComponent
      chartId={'chart-1'}
      chartType={'Activities'}
      dashboardSettings={dashboardSettings.hasOwnProperty('value') && dashboardSettings.value[0]}
      updateSettings={updateSettings}
    />
    <CombinedDashboardComponent
      chartId={'chart-2'}
      chartType={'Applications'}
      dashboardSettings={dashboardSettings.hasOwnProperty('value') && dashboardSettings.value[1]}
      updateSettings={updateSettings}
    />
  </div>)
}

export default Dashboard

