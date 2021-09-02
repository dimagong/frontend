import React, {useEffect, useState} from 'react'
import './styles.scss'
import CombinedDashboardComponent from "./CombinedDashboardComponent";
import {useDispatch, useSelector} from "react-redux";
import appSlice from "app/slices/appSlice";
import {selectDashboardDForms, selectDashboardSettings} from "app/selectors/userSelectors";
import Select from "react-select";
import {Button} from "reactstrap";
import {Plus} from "react-feather";
import {toast} from "react-toastify";

const {
  getSettingsRequest,
  postSettingsRequest,
  patchSettingsRequest,
  getActivityTypesRequest,
  getDashboardDFormsRequest,
} = appSlice.actions;

const Dashboard = ({ }) => {
  const dispatch = useDispatch();
  const dashboardSettings = useSelector(selectDashboardSettings)
  const dashboardDForms = useSelector(selectDashboardDForms)
  const [componentToAdd, setComponentToAdd] = useState(null);

  const updateSettings = (newSettings) => {
    if (dashboardSettings.hasOwnProperty('id')) {
      let changeSettingsIndex = dashboardSettings.value.findIndex(item => item.key === newSettings.key);
      let newDashboardSettings = [...dashboardSettings.value];
      newDashboardSettings[changeSettingsIndex] = newSettings;
      dispatch(patchSettingsRequest({value: newDashboardSettings, id: dashboardSettings.id}));
    } else {
      let initialSettings = [{state: 'large', title: 'Activities', daysNumber: 7, filter: null, key: 0},
        {state: 'large', title: 'Applications', daysNumber: 7, filter: null, key: 1}]
      let changeSettingsIndex = initialSettings.findIndex(item => item.key === newSettings.key);
      initialSettings[changeSettingsIndex] = newSettings;
      dispatch(postSettingsRequest(initialSettings))
    }
  }

  const deleteComponent = (key) => {
    if (dashboardSettings.value.length <= 1) {
      return;
    }
    let newDashboardSettings = [...dashboardSettings.value];
    newDashboardSettings = newDashboardSettings.filter(item => item.key !== key);
    if (dashboardSettings?.id) {
      dispatch(patchSettingsRequest({value: newDashboardSettings, id: dashboardSettings.id}));
    } else {
      dispatch(postSettingsRequest(newDashboardSettings))
    }
  }

  const handleChange = (newValue, actionMeta) => {
    if (actionMeta.action === 'select-option') {
      setComponentToAdd(newValue.value)
    }

    if (actionMeta.action === 'clear') {
      setComponentToAdd(null)
    }
  };

  const addComponent = () => {
    try {
      let newDashboardSettings = [...dashboardSettings.value];
      newDashboardSettings.push(componentToAdd)
      newDashboardSettings[newDashboardSettings.length - 1].key = newDashboardSettings.length > 1
        ? newDashboardSettings[newDashboardSettings.length - 2].key + 1
        : 0;
      dispatch(patchSettingsRequest({value: newDashboardSettings, id: dashboardSettings.id}));
      setComponentToAdd({...componentToAdd})
    }
    catch (err) {
      toast.error('Please choose component to add')
    }
  }

  useEffect(() => {
    dispatch(getSettingsRequest());
    dispatch(getActivityTypesRequest());
    dispatch(getDashboardDFormsRequest());
  }, []);

  const options = [{label: "Application", value: {
      daysNumber: 7,
      state: 'large',
      filter: null,
      label: 'Application',
      title: "Applications",
      dForm: null
    }},
    {label: "Applications Snapshot", value: {
      daysNumber: 7,
      state: 'large',
      filter: null,
      label: 'Applications Snapshot',
      title: "Applications",
      dForm: {name: 'Applications Snapshot'}
    }},
    {
        label: "Activities", value: {
        daysNumber: 7,
        state: 'large',
        filter: null,
        label: 'Activities',
        title: "Activities",
      }}];


  const selectStyles = {
    container: styles => ({ ...styles, width: '320px', display: 'inline-block', marginRight: '30px' }),
    menu: styles => ({...styles, zIndex: 1000}),
    menuList: styles => ({ ...styles, maxHeight: '165px'}),
  };

  return (<div className={'activity-dashboard'}>
    <div className={'dashboard-header'}>
      <h1 style={{fontWeight: 'bolder', color: '#707070', marginBottom: '2vh'}}>Dashboard</h1>
      <span className={'add-dashboard-component'}>
        <Select
              className="basic-single"
              classNamePrefix="select"
              isClearable
              isSearchable
              name="Add component"
              options={options}
              onChange={handleChange}
              styles={selectStyles}
              placeholder={'New component'}
              value={componentToAdd?.label ? {label: componentToAdd?.label} : undefined}
            />
        <Button
          onClick={addComponent}
          color="primary"
          className="add-icon p-0"
        >
          <Plus size={28}/>
        </Button>
      </span>
    </div>
    {
      dashboardSettings?.value && dashboardSettings.value.map((item, key) => item &&
        <CombinedDashboardComponent
          chartId={`chart-${key}`}
          chartType={item.title}
          dashboardSettings={item}
          updateSettings={updateSettings}
          dForms={dashboardDForms}
          deleteComponent={deleteComponent}
          allTitleNames={dashboardSettings ? dashboardSettings.value.map(item => item.titleName) : []}
        />
      )
    }
  </div>)
}

export default Dashboard

