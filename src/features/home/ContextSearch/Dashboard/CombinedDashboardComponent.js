import React, {useEffect, useRef, useState} from 'react'
import LineChart from "./DashboardCharts/LineChart";
import appSlice from "app/slices/appSlice";
import {useDispatch, useSelector} from "react-redux";
import {
  selectDashboardDataByKey,
  selectDashboardDForms,
  selectManagers
} from "app/selectors/userSelectors";
import ActivitiesDashboard from "./ActivitiesDashboard";
import CreateIcon from '@material-ui/icons/Create';
import ArrowDown from "assets/img/svg/arrow_down.svg";
import ArrowLeft from "assets/img/svg/arrow_left.svg";
import ArrowRight from "assets/img/svg/arrow_right.svg";
import CloseChart from "assets/img/svg/closeChart.svg";
import FilterIcon from "assets/img/svg/filter.svg";
import moment from "moment";
import FilterBox from "./FilterBox";
import {Button, Modal, ModalBody} from "reactstrap";
import {InputGroup, FormControl} from "react-bootstrap";
import {toast} from "react-toastify";


const {
  getDashboardDataRequest,
  getDashboardActivityRequest,
  getDashboardSnapshotDataRequest
} = appSlice.actions;

const CombinedDashboardComponent = ({ chartId, chartType, dashboardSettings, updateSettings, deleteComponent, dForms, allTitleNames }) => {
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
  const dashboardData = useSelector(selectDashboardDataByKey(settings.key))

  const wrapperRefFilterButton = useRef(null);
  const [isFilterBoxOpen, setIsFilterBoxOpen] = useState(false);
  const [isMapFilterBoxOpen, setIsMapFilterBoxOpen] = useState(false);
  const [tabLabel, setTabLabel] = useState('')
  const [isFilterTagOpen, setIsFilterTagOpen] = useState(false)
  const [filter, setFilter] = useState({Roles: [], Organizations: [], 'Activity types': [], Application: []})
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [newChartTitle, setNewChartTitle] = useState('');
  const managers = useSelector(selectManagers);
  const dashboardDForms = useSelector(selectDashboardDForms)

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
    setIsFilterBoxOpen(!isFilterBoxOpen);
  }

  const handleRenameChart = () => {
    if (newChartTitle.length === 0) {
      toast.warn("Please input the new title for the chart");
      return;
    }
    if (allTitleNames.findIndex(item => item === newChartTitle) !== -1) {
      toast.error("This title is already in use. Please input another one");
      return;
    }
    settings.titleName = newChartTitle;
    updateSettings(settings);
    setNewChartTitle('');
    setIsRenameModalOpen(false);
  }

  useEffect(() => {
    if (!(settings && dashboardDForms && managers?.length > 0)) {
      return;
    }
    if (settings.filter) {
      setFilter(JSON.parse(JSON.stringify(settings.filter)));
    }

    if (chartType === 'Applications') {
        if (settings.dForm?.name === 'Applications Snapshot') {
          dispatch(getDashboardSnapshotDataRequest({
            key: settings.key,
            page: 1,
            'from': moment().subtract(settings.daysNumber, 'days').format('YYYY-MM-DD'),
            dForm: settings.dForm,
            settings: settings
          }))
        } else {
          dispatch(getDashboardDataRequest({
            key: settings.key,
            page: 1,
            'from': moment().subtract(settings.daysNumber, 'days').format('YYYY-MM-DD'),
            dForm: settings.dForm,
            settings: settings
          }))
        }
      } else {
        dispatch(getDashboardActivityRequest({
          key: settings.key,
          page: 1,
          'from': moment().subtract(settings.daysNumber, 'days').format('YYYY-MM-DD'),
          settings: settings}))
      }
  }, [settings.daysNumber, settings['filter[value]'], settings.dForm, settings.user_groups, settings.ability_user_ids, dashboardDForms, managers?.length]);


  return (<div className={'combined-dashboard-component ' + (isFilterBoxOpen ? 'combined-dashboard-component-filtered' : '')} style={settings.state === 'small'
                                                ? {width: '22%', marginRight: '1%'}
                                                : {width: '45%', marginRight: '1%'}}>
    <div className={'dashboard-charts'} style={settings.state === 'large' ? {backgroundImage: 'linear-gradient(to bottom, rgba(0,0,0,0) 20%, white 20%)'} : {}}>
      <div style={{width: '100%'}}
           className={'dashboard-one-chart'}>
            <span className={'arrow-left'}>
              <img src={settings.state !== 'small' ? ArrowLeft : ArrowRight} alt={'arrow'}
                   onClick={handleChangeChart}/>
              <img src={CloseChart} className={'close-chart'} alt={'cross'}
                   onClick={() => deleteComponent(settings.key)}/>
            </span>
        <span className={'change-chart-days ' + (settings.state === 'small' ? ' change-chart-days-smaller' : '')}>
          {chartType === 'Applications' && settings.dForm !== 'Unselected application' && settings.dForm?.id &&
                    <span>
                      <span style={{marginRight: '20px'}} className={'edit-chart-icon'} onClick={() => {setIsRenameModalOpen(!isRenameModalOpen)}}>
                        <CreateIcon/>
                      </span>
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
                        filter={filter}
                        setFilter={setFilter}
                      />}
                    </span>}
          {chartType === 'Activities' &&
            <span>
              <span style={{marginRight: '20px'}} className={'edit-chart-icon'} onClick={() => {setIsRenameModalOpen(!isRenameModalOpen)}}>
                <CreateIcon/>
              </span>
            </span>
          }
              {settings?.dForm?.name !== 'Applications Snapshot' && [{label: 'y', daysNumber: 365}, {label: 'm', daysNumber: 28}, {label: 'w', daysNumber: 7}].map(item => {
                return <span onClick={() => handleChangeDate(item.daysNumber)}
                             className={'chart-days ' + (settings.daysNumber === item.daysNumber ? 'active-days' : '')}>
                  {item.label}
                </span>
              })}
            </span>
        {chartType === 'Applications' && (settings.dForm === 'Unselected application' || !settings.dForm?.id) &&
          <span className={'no-application ' + (settings.state === 'small' ? 'no-application-small' : '')}>
            Please select an application to see the info about it
          </span>}
        {settings.state === 'middle' &&
        <span className={'arrow-open-activities'} onClick={handleChangeList}>
                <img src={ArrowDown} alt={'arrow-down'}/>
              </span>}
        <LineChart
          settings={settings}
          title={chartType}
          chartId={chartId}
          data={chartType === 'Activities' ? dashboardData?.usersActivitiesSchedule : dashboardData?.userDFormActivitiesSchedule}
        />
      </div>
    </div>

    <div style={{background: 'white', zIndex: 100 - settings.key}} className={'dashboard-activities ' + (settings.state === 'large' ? 'dashboard-activities-open' : 'dashboard-activities-closed')}>
      <ActivitiesDashboard
        usersActivities={(chartType === 'Applications' && !(settings.dForm?.id)) ? []
          : chartType === 'Applications' ? dashboardData?.userDFormActivities : dashboardData?.usersActivities}
        settings={settings}
        handleChangeList={handleChangeList}
        wrapperRefFilterButton={wrapperRefFilterButton}
        isFilterBoxOpen={isFilterBoxOpen}
        setIsFilterBoxOpen={setIsFilterBoxOpen}
        handleFilterBox={handleFilterBox}
        dForms={dForms}
        updateSettings={updateSettings}
        filter={filter}
        setFilter={setFilter}
      />
    </div>

    <Modal className={"chart-rename-modal"} isOpen={isRenameModalOpen} fade={false} toggle={()=>{setIsRenameModalOpen(false)}}>
        <ModalBody>
          <div style={{marginTop: '2vh', textAlign: 'center'}}>
            <span style={{fontSize: "22px"}}>
            Input a new title to the "{settings.titleName ? settings.titleName : settings.title}" chart
          </span>
          </div>
          <div style={{marginTop: '5vh'}}>
            <InputGroup className="mb-3">
              <FormControl
                id={`${chartId}-rename-input`}
                placeholder={settings.titleName ? settings.titleName : settings.title}
                aria-label="Title"
                aria-describedby="basic-addon1"
                onChange={e => setNewChartTitle(e.target.value)}
              />
            </InputGroup>
          </div>
          <div className={"chart-rename-modal_action-buttons"}>
            <Button className={"cancel-button"} onClick={() => {
              setIsRenameModalOpen(false);
              setNewChartTitle('');
            }}>
              Cancel
            </Button>
            <Button className={"rename-button"} onClick={handleRenameChart}>
              Rename
            </Button>
          </div>
        </ModalBody>
      </Modal>
  </div>)
}

export default CombinedDashboardComponent;

