import React, {useEffect, useRef, useState} from 'react'
import LineChart from "./DashboardCharts/LineChart";
import appSlice from "app/slices/appSlice";
import {useDispatch, useSelector} from "react-redux";
import {selectDashboardData} from "app/selectors/userSelectors";
import ActivitiesDashboard from "./ActivitiesDashboard";
import ArrowDown from "assets/img/svg/arrow_down.svg";
import ArrowLeft from "assets/img/svg/arrow_left.svg";
import ArrowRight from "assets/img/svg/arrow_right.svg";
import CloseChart from "assets/img/svg/closeChart.svg";
import {title} from "react-bootstrap-sweetalert/dist/styles/SweetAlertStyles";
import FilterIcon from "../../../../assets/img/svg/filter.svg";
import {Button} from "react-bootstrap";
import CloseIcon from "@material-ui/icons/Close";

const {
  getDashboardDataRequest,
  getActivityTypesRequest
} = appSlice.actions;

const CombinedDashboardComponent = ({ chartId, chartType }) => {
  const dispatch = useDispatch();
  const dashboardData = useSelector(selectDashboardData)
  const [isActivitiesShown, setIsActivitiesShown] = useState(true);
  const [isChartShown, setIsChartShown] = useState(true);
  const [isBigChartShown, setIsBigChartShown] = useState(true);
  const [daysNumber, setDaysNumber] = useState(7);

  const wrapperRefFilterButton = useRef(null);
  const [filter, setFilter] = useState({type: undefined, value: undefined});
  const [isFilterBoxOpen, setIsFilterBoxOpen] = useState(false);
  const [tabLabel, setTabLabel] = useState('')
  const [isFilterTagOpen, setIsFilterTagOpen] = useState(false)

  const handleChangeChart = () => {
    if (isBigChartShown) {
      setIsActivitiesShown(false);
    }
    setIsBigChartShown(!isBigChartShown);
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

  useEffect(() => {
    dispatch(getDashboardDataRequest({page: 1, title: chartType === 'Activities' ? chartType.toLowerCase(): 'application'}));
    dispatch(getActivityTypesRequest());
  }, []);

  if (!isChartShown) {
    return null
  }

  return (<div className={'combined-dashboard-component'} style={isBigChartShown ? {width: '45%', background: 'white', marginRight: '1%'} : {width: '22%', background: 'white', marginRight: '1%'}}>
    <div className={'dashboard-charts'}>
      <div style={{width: '100%'}}
           className={'dashboard-one-chart'}>
            <span className={'arrow-left'}>
              <img src={isBigChartShown ? ArrowLeft : ArrowRight}
                   onClick={handleChangeChart}/>
              <img src={CloseChart} className={'close-chart'}
                   onClick={() => setIsChartShown(false)}/>
            </span>
        <span className={'change-chart-days ' + (!isBigChartShown ? ' change-chart-days-smaller' : '')}>
              {[{label: 'y', daysNumber: 365}, {label: 'm', daysNumber: 28}, {label: 'w', daysNumber: 7}].map(item => {
                return <span onClick={() => setDaysNumber(item.daysNumber)}
                             className={'chart-days ' + (daysNumber === item.daysNumber ? 'active-days' : '')}>
                  {item.label}
                </span>
              })}
            </span>
        {!isActivitiesShown && isBigChartShown &&
        <span className={'arrow-open-activities'} onClick={() => setIsActivitiesShown(true)}>
                <img src={ArrowDown}/>
              </span>}
        <LineChart
          title={chartType}
          chartId={chartId}
          data={dashboardData?.userDFormActivitiesSchedule}
          isSmall={!isBigChartShown}
          daysNumber={daysNumber}
        />
      </div>
    </div>
    {isActivitiesShown &&
    <div style={isChartShown ? {borderTopColor: '#7367f0', background: 'white'} : {
      borderTopColor: '#707070',
      background: 'white'
    }} className={'dashboard-activities'}>
      <h3 className={'users-activities-title'}>
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
      </h3>
      <ActivitiesDashboard
        usersActivities={dashboardData?.userDFormActivities}
        isActivitiesShown={isActivitiesShown}
        setIsActivitiesShown={setIsActivitiesShown}
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

