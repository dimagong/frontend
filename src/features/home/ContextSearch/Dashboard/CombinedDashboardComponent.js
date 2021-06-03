import React, {useEffect, useRef, useState} from 'react'
import LineChart from "./DashboardCharts/LineChart";
import appSlice from "app/slices/appSlice";
import {useDispatch, useSelector} from "react-redux";
import {selectDashboardData, selectDashboardSettings} from "app/selectors/userSelectors";
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

const {
  getDashboardDataRequest,
  getDashboardActivityRequest
} = appSlice.actions;

const CombinedDashboardComponent = ({ chartId, chartType, dashboardSettings, updateSettings }) => {
  let settings;
  if (dashboardSettings) {
    settings = {...dashboardSettings}
  } else {
    settings = {
      daysNumber: -1,
      state: 'large',
      filter: null,
      title: chartType
    }
  }
  const dispatch = useDispatch();
  const dashboardData = useSelector(selectDashboardData)

  const [isChartShown, setIsChartShown] = useState(true);

  const wrapperRefFilterButton = useRef(null);
  const [filter, setFilter] = useState({type: undefined, value: undefined});
  const [isFilterBoxOpen, setIsFilterBoxOpen] = useState(false);
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
      setFilter({type: filter?.type, value: filter?.value, label: tabLabel})
    }
    setIsFilterBoxOpen(!isFilterBoxOpen);
  }

  const removeFilter = () => {
    setFilter({type: undefined, value: undefined})
    dispatch(getDashboardDataRequest({page: 1, title: chartType === 'Activities' ? chartType.toLowerCase(): 'application'}))
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
        dispatch(getDashboardDataRequest({page: 1, 'from': moment().subtract(settings.daysNumber, 'days').format('YYYY-MM-DD')}))
      } else {
        dispatch(getDashboardActivityRequest({page: 1,'from': moment().subtract(settings.daysNumber, 'days').format('YYYY-MM-DD')}))
      }
  }, [settings.daysNumber, settings.nothing]);

  if (!isChartShown) {
    return null
  }

  return (<div className={'combined-dashboard-component'} style={settings.state === 'small'
                                                ? {width: '22%', marginRight: '1%'}
                                                : {width: '45%', marginRight: '1%'}}>
    <div className={'dashboard-charts'} style={settings.state === 'large' ? {background: 'white'} : {}}>
      <div style={{width: '100%'}}
           className={'dashboard-one-chart'}>
            <span className={'arrow-left'}>
              <img src={settings.state !== 'small' ? ArrowLeft : ArrowRight}
                   onClick={handleChangeChart}/>
              {false && <img src={CloseChart} className={'close-chart'}
                   onClick={() => setIsChartShown(false)}/>}
            </span>
        <span className={'change-chart-days ' + (settings.state === 'small' ? ' change-chart-days-smaller' : '')}>
              {[{label: 'y', daysNumber: 365}, {label: 'm', daysNumber: 28}, {label: 'w', daysNumber: 7}].map(item => {
                return <span onClick={() => handleChangeDate(item.daysNumber)}
                             className={'chart-days ' + (settings.daysNumber === item.daysNumber ? 'active-days' : '')}>
                  {item.label}
                </span>
              })}
            </span>
        {settings.state === 'middle' &&
        <span className={'arrow-open-activities'} onClick={handleChangeList}>
                <img src={ArrowDown}/>
              </span>}
        <LineChart
          title={chartType}
          chartId={chartId}
          data={chartType === 'Activities' ? dashboardData?.usersActivitiesSchedule : dashboardData?.userDFormActivitiesSchedule}
          isSmall={settings.state === 'small'}
          daysNumber={settings.daysNumber}
        />
      </div>
    </div>
    {settings.state === 'large' &&
    <div style={isChartShown ? {borderTopColor: '#7367f0', background: 'white'} : {
      borderTopColor: '#707070',
      background: 'white'
    }} className={'dashboard-activities'}>
      {false && <h3 className={'users-activities-title'}>
        Users {chartType.toLowerCase()}
        <span className={'filter-icon-box'} onClick={handleFilterBox} ref={wrapperRefFilterButton}>
          <img className={'filter-icon'} src={FilterIcon} alt={'filter-icon'}/>
        </span>

        {isFilterTagOpen && <Button className={'filter-tab'} variant={'dark'}>
              <span className={'nav-text'}>{tabLabel}</span>
              <span onClick={removeFilter}
                    className={'close-nav'}><CloseIcon/></span>
            </Button>
        }
      </h3>}
      <ActivitiesDashboard
        usersActivities={chartType === 'Applications' ? dashboardData?.userDFormActivities : dashboardData?.usersActivities}
        settings={dashboardSettings}
        handleChangeList={handleChangeList}
        wrapperRefFilterButton={wrapperRefFilterButton}
        filter={filter}
        setFilter={setFilter}
        isFilterBoxOpen={isFilterBoxOpen}
        setIsFilterBoxOpen={setIsFilterBoxOpen}
        tabLabel={tabLabel}
        setTabLabel={setTabLabel}
        isFilterTagOpen={isFilterTagOpen}
        setIsFilterTagOpen={setIsFilterTagOpen}
      />
    </div>}
  </div>)
}

export default CombinedDashboardComponent;

