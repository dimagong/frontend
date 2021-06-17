import React, {useEffect, useRef, useState} from 'react'
import LineChart from "./DashboardCharts/LineChart";
import appSlice from "app/slices/appSlice";
import {useDispatch, useSelector} from "react-redux";
import {selectDashboardDataByKey, selectDashboardSettings} from "app/selectors/userSelectors";
import ActivitiesDashboard from "./ActivitiesDashboard";
import ArrowDown from "assets/img/svg/arrow_down.svg";
import ArrowLeft from "assets/img/svg/arrow_left.svg";
import ArrowRight from "assets/img/svg/arrow_right.svg";
import CloseChart from "assets/img/svg/closeChart.svg";
import {title} from "react-bootstrap-sweetalert/dist/styles/SweetAlertStyles";
import FilterIcon from "../../../../assets/img/svg/filter.svg";
import {Button} from "react-bootstrap";
import CloseIcon from "@material-ui/icons/Close";
import moment from "moment";
import FilterBox from "./FilterBox";

const {
  getDashboardDataRequest,
  getDashboardActivityRequest
} = appSlice.actions;

const CombinedDashboardComponent = ({ chartId, chartType, dashboardSettings, updateSettings, deleteComponent, dForms, allApplications }) => {
  let settings;
  if (dashboardSettings) {
    settings = {...dashboardSettings}
  } else {
    settings = {
      daysNumber: -1,
      state: 'large',
      filter: null,
      title: chartType,
      dForm: 'Unselected application'
    }
  }
  const dispatch = useDispatch();
  //const dashboardData = useSelector(selectDashboardData)
  const dashboardData = useSelector(selectDashboardDataByKey(settings.key))

  const wrapperRefFilterButton = useRef(null);
  //const [filter, setFilter] = useState({Roles: [], Organizations: [], 'Activity types': [], Application: []})
  const [isFilterBoxOpen, setIsFilterBoxOpen] = useState(false);
  const [isMapFilterBoxOpen, setIsMapFilterBoxOpen] = useState(false);
  const [tabLabel, setTabLabel] = useState('')
  const [isFilterTagOpen, setIsFilterTagOpen] = useState(false)

  const handleChangeChart = () => {
    settings.state = settings.state === 'small' ? 'middle' : 'small';
    updateSettings(settings);
  }

  const handleChangeList = () => {
    settings.state = settings.state === 'large' ? 'middle' : 'large';
    updateSettings(settings);
  }

  const handleChangeDate = (days) => {
    settings.daysNumber = days;
    updateSettings(settings);
  }

  const handleFilterBox = () => {
    if (!isFilterBoxOpen) {
      //setFilter({type: filter?.type, value: filter?.value, label: tabLabel})
    }
    setIsFilterBoxOpen(!isFilterBoxOpen);
  }

  const removeFilter = () => {
    //setFilter({type: undefined, value: undefined})
    dispatch(getDashboardDataRequest({key: settings.key, page: 1, title: chartType === 'Activities' ? chartType.toLowerCase(): 'application'}))
    setIsFilterTagOpen(false);
    setTabLabel('')
  }

  /*useEffect(() => {
    if (chartType === 'Activities') {
      dispatch(getDashboardActivityRequest({
        page: 1,
        title: chartType.toLowerCase()
      }));
    } else {
      dispatch(getDashboardDataRequest({
        page: 1,
        title: 'application'
      }));
    }
  }, []);*/

  useEffect(() => {
    if (chartType === 'Applications') {
        dispatch(getDashboardDataRequest({key: settings.key, page: 1, 'from': moment().subtract(settings.daysNumber, 'days').format('YYYY-MM-DD'), dForm: settings.dForm, allApplications: allApplications, settings: settings}))
      } else {
        dispatch(getDashboardActivityRequest({key: settings.key, page: 1,'from': moment().subtract(settings.daysNumber, 'days').format('YYYY-MM-DD'), settings: settings}))
      }
  }, [settings.daysNumber, settings['filter[value]'], settings.dForm, settings.user_groups, settings.ability_user_ids]);


  return (<div className={'combined-dashboard-component'} style={settings.state === 'small'
                                                ? {width: '22%', marginRight: '1%'}
                                                : {width: '45%', marginRight: '1%'}}>
    <div className={'dashboard-charts'} style={settings.state === 'large' ? {backgroundImage: 'linear-gradient(to bottom, rgba(0,0,0,0) 20%, white 20%)'} : {}}>
      <div style={{width: '100%'}}
           className={'dashboard-one-chart'}>
            <span className={'arrow-left'}>
              <img src={settings.state !== 'small' ? ArrowLeft : ArrowRight}
                   onClick={handleChangeChart}/>
              <img src={CloseChart} className={'close-chart'}
                   onClick={() => deleteComponent(settings.key)}/>
            </span>
        <span className={'change-chart-days ' + (settings.state === 'small' ? ' change-chart-days-smaller' : '')}>
          {chartType === 'Applications' && settings.dForm !== 'Unselected application' && settings.dForm?.name &&
                    <span>
                      <span style={{marginRight: '20px'}} className={'filter-icon-box'} onClick={() => setIsMapFilterBoxOpen(!isMapFilterBoxOpen)} ref={wrapperRefFilterButton}>
                        <img className={'filter-icon'} src={FilterIcon} alt={'filter-icon'}/>
                      </span>
                      {isMapFilterBoxOpen && <FilterBox
                        setIsFilterBoxOpen={setIsMapFilterBoxOpen}
                        dForms={dForms}
                        updateSettings={updateSettings}
                        settings={settings}
                        isMap={true}
                        isApplication={settings.title === 'Applications'}
                        isFilterBoxOpen={isMapFilterBoxOpen}
                      />}
                    </span>}
              {settings?.dForm?.name !== 'Applications Snapshot' && [{label: 'y', daysNumber: 365}, {label: 'm', daysNumber: 28}, {label: 'w', daysNumber: 7}].map(item => {
                return <span onClick={() => handleChangeDate(item.daysNumber)}
                             className={'chart-days ' + (settings.daysNumber === item.daysNumber ? 'active-days' : '')}>
                  {item.label}
                </span>
              })}
            </span>
        {chartType === 'Applications' && (settings.dForm === 'Unselected application' || !settings.dForm) &&
          <span className={'no-application ' + (settings.state === 'small' ? 'no-application-small' : '')}>
            Please select an application to see the info about it
          </span>}
        {settings.state === 'middle' &&
        <span className={'arrow-open-activities'} onClick={handleChangeList}>
                <img src={ArrowDown}/>
              </span>}
        <LineChart
          settings={settings}
          title={chartType}
          chartId={chartId}
          data={chartType === 'Activities' ? dashboardData?.usersActivitiesSchedule : dashboardData?.userDFormActivitiesSchedule}
        />
      </div>
    </div>
    {settings.state === 'large' &&
    <div style={{background: 'white'}} className={'dashboard-activities'}>
      <ActivitiesDashboard
        usersActivities={(chartType === 'Applications' && (!settings.dForm || settings.dForm === 'Unselected application')) ? []
          : chartType === 'Applications' ? dashboardData?.userDFormActivities : dashboardData?.usersActivities}
        settings={settings}
        handleChangeList={handleChangeList}
        wrapperRefFilterButton={wrapperRefFilterButton}
        isFilterBoxOpen={isFilterBoxOpen}
        setIsFilterBoxOpen={setIsFilterBoxOpen}
        tabLabel={tabLabel}
        setTabLabel={setTabLabel}
        isFilterTagOpen={isFilterTagOpen}
        setIsFilterTagOpen={setIsFilterTagOpen}
        handleFilterBox={handleFilterBox}
        dForms={dForms}
        updateSettings={updateSettings}
      />
    </div>}
  </div>)
}

export default CombinedDashboardComponent;

