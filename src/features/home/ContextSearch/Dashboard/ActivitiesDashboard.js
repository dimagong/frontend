import React, {useRef, useState} from 'react'
import '../ContextSearchNav/styles.scss'
import moment from "moment";
import {useDispatch, useSelector} from "react-redux";
import {selectLoading, selectManagers} from "app/selectors";
import noneAvatar from 'assets/img/portrait/none-avatar.png';
import { Scrollbars } from 'react-custom-scrollbars';
import {parseTextToComponent, getEditMessage} from 'components/Timeline/index.js';
import {userProfileUpdated} from "constants/activity";
import SpinnerIcon from "assets/img/svg/spinner.svg";
import ArrowUp from "assets/img/svg/arror_up.svg";
import {Button} from "react-bootstrap";
import appSlice from "app/slices/appSlice";
import CloseIcon from "@material-ui/icons/Close";
import FilterIcon from "assets/img/svg/filter.svg";
import FilterBox from "./FilterBox";
import {useOutsideAlerter} from "hooks/useOutsideAlerter";
import {selectActivityTypes, selectCurrentManager} from "app/selectors/userSelectors";

const dateFormat = 'DD/MM/YYYY';

const {
  getDashboardDataRequest,
  getDashboardActivityRequest,
  getDashboardSnapshotDataRequest,
  setManager,
  setContext,
} = appSlice.actions;

const ActivitiesDashboard = ({updateSettings, dForms, handleFilterBox, settings, usersActivities, handleChangeList, wrapperRefFilterButton, filter, setFilter, isFilterBoxOpen, setIsFilterBoxOpen, tabLabel, setTabLabel, isFilterTagOpen, setIsFilterTagOpen }) => {
  const dispatch = useDispatch();
  const isLoadingData = useSelector(selectLoading);
  const managers = useSelector(selectManagers);
  const activityTypes = useSelector(selectActivityTypes);
  const wrapperRefFilterBox = useRef(null);
  useOutsideAlerter([wrapperRefFilterBox, wrapperRefFilterButton], () => {if (isFilterBoxOpen) setIsFilterBoxOpen(false)});


  let activities = []
  let data = usersActivities?.data

  if (data) {
    for (let i = 0; i < data.length; ++i) {
      let currDate;
      switch (moment(data[i].created_at).format(dateFormat)) {
        case moment().format(dateFormat): {
          currDate = 'Today';
          break;
        }
        case moment().subtract(1, 'days').format(dateFormat): {
          currDate = 'Yesterday';
          break;
        }
        default:
          currDate = moment(data[i].created_at).format(dateFormat)
      }
      let addActivityIndex = activities.findIndex(item => item.date === currDate);
      if (addActivityIndex === -1) {
        activities.push({date: currDate, data: []});
        activities[activities.length - 1].data.push(data[i])
      } else {
        activities[addActivityIndex].data.push(data[i])
      }
    }
  }

  const loadMoreData = () => {
    if (settings.title === 'Activities') {
      if (settings?.dForm?.name === 'Applications Snapshot') {
        dispatch(getDashboardSnapshotDataRequest({key: settings.key, page: usersActivities.current_page + 1, 'from': moment().subtract(settings.daysNumber, 'days').format('YYYY-MM-DD'), settings: settings}))
      } else {
        dispatch(getDashboardActivityRequest({key: settings.key, page: usersActivities.current_page + 1, 'from': moment().subtract(settings.daysNumber, 'days').format('YYYY-MM-DD'), settings: settings}))
      }
    } else {
      dispatch(getDashboardDataRequest({key: settings.key, page: usersActivities.current_page + 1, dForm: settings?.dForm?.id, 'from': moment().subtract(settings.daysNumber, 'days').format('YYYY-MM-DD'), settings: settings}))
    }
  }

  const parseOnboardingName = (description) => {
    let results = [];
    for (let i = 1; i < description.length; ++i) {
      if (description[i] === '>' && description[i - 1] === 'b') {
        results.push(i);
      }
    }
    return description.slice(results[2] + 1, results[3] - 3);
  }

  const handleActionClick = (manager, currAction) => {
    let selectedInfo = undefined;
    let name = activityTypes.find(item => item.id === currAction.action_type_id)?.name;
    if ( name === 'Application was updated'
      || name === 'Application state change'
      || name === 'User submitted Dform'
      || name === 'New application added to user') {
      selectedInfo = {type: 'onboarding', value: parseOnboardingName(currAction.description)};
    } else if (name === 'Application was deleted') {
      selectedInfo = {type: 'onboarding'};
    } else if (name === userProfileUpdated) {
      selectedInfo = {type: 'userEdit'};
    }
    let newManager = selectedInfo
      ? {selectedInfo: selectedInfo, ...manager}
      : {...manager}
    dispatch(setManager(newManager));
    dispatch(setContext('User'));
  }

  const removeFilterPart = (key) => {
    let newFilter = {...filter}
    newFilter[key] = []
    setFilter(newFilter);
    switch (key) {
        case 'Activity types': {
          settings['filter[type]'] = null;
          settings['filter[value]'] = null;
          break;
        }
        case 'Organizations': {
          settings.user_groups = null;
          break;
        }
        case 'Roles': {
          settings.ability_user_ids = null;
          break;
        }
        case 'Application': {
            settings.dForm = {name: settings.dForm?.name, id: null};
          break;
        }
      }
    settings.filter = JSON.parse(JSON.stringify(newFilter));
    updateSettings(settings);
  }

  const checkDate = (date) => {
    let checkDateData = activities.find(item => item.date === date)
    if (checkDateData && checkDateData.hasOwnProperty('data')) {
      for (let i = 0; i < checkDateData.data.length; ++i) {
        if (checkDateData.data[i]?.options?.show_in_dashboard === 1) {
          return true;
        }
      }
    }
    return false;
  }

  const getFirstCheckedDate = () => {
    for (let i = 0; i < activities.length; ++i) {
      if (checkDate(activities[i].date)) {
        return i;
      }
    }
    return 0;
  }


  if (settings.state !== 'large') return null;


  return (
    <div>
      { <span ref={wrapperRefFilterBox}>
          <FilterBox
            setIsFilterBoxOpen={setIsFilterBoxOpen}
            dForms={dForms}
            updateSettings={updateSettings}
            settings={settings}
            isApplication={settings.title === 'Applications'}
            isFilterBoxOpen={isFilterBoxOpen}
            filter={filter}
            setFilter={setFilter}
          />
        </span>
      }
      {(!activities || activities.length === 0)
        ? <span style={{position: 'relative'}}>
            <div className={'action-date'} style={{position: 'relative', paddingLeft: 5}}>
                {'Today'}
                  <span>
                    {<span className={'filter-icon-box'} onClick={handleFilterBox} ref={wrapperRefFilterButton}>
                      <img className={'filter-icon'} src={FilterIcon} alt={'filter-icon'}/>
                    </span>}
                    {settings.filter && Object.keys(settings.filter).map(key => {
                      if ((key !== 'Application' || settings?.dForm?.name === 'Applications Snapshot') && Array.isArray(settings.filter[key]) && settings.filter[key].length > 0) {
                        return <Button style={{zIndex: 1000000}} className={'filter-tab'} variant={'dark'}>
                          {key === 'Application'
                            ? <span className={'nav-text'}>{settings.filter[key].length} {settings.filter[key].length > 1 ? key.toLowerCase() + 's' : key.toLowerCase()}</span>
                            : <span className={'nav-text'}>{settings.filter[key].length} {settings.filter[key].length > 1 ? key.toLowerCase() : key.toLowerCase().slice(0, -1)}</span>}
                      <span onClick={() => removeFilterPart(key)} className={'close-nav'}><CloseIcon/></span>
                    </Button>
                      }
                    })}
                    <span className={'arrow-close-activities'} onClick={handleChangeList}>
                      <img src={ArrowUp}/>
                    </span>
                  </span>
              </div>
          <div style={{textAlign: "center", paddingTop: 50}}>
            <h1 style={{padding: '5vh 5px'}}>No activities found</h1>
          </div>
          </span>
        : <Scrollbars style={{height: 350, width: Math.round(window.innerWidth * 0.43), fontsize: 'small'}}>
          {managers.length > 0 && activities.map((item, key) =>
            <div style={{paddingLeft: '5px'}}>
              <div className={'action-date'} style={{position: 'relative'}}>
                {checkDate(item.date) && item.date}
                {key === getFirstCheckedDate() &&
                  <span>
                    {<span className={'filter-icon-box'} onClick={handleFilterBox} ref={wrapperRefFilterButton}>
                      <img className={'filter-icon'} src={FilterIcon} alt={'filter-icon'}/>
                    </span>}
                    {settings.filter && Object.keys(settings.filter).map(key => {
                     if ((key !== 'Application' || settings?.dForm?.name === 'Applications Snapshot') && Array.isArray(settings.filter[key]) && settings.filter[key].length > 0) {
                        return <Button style={{zIndex: 1000000}} className={'filter-tab'} variant={'dark'}>
                      {key === 'Application'
                            ? <span className={'nav-text'}>{settings.filter[key].length} {settings.filter[key].length > 1 ? key.toLowerCase() + 's' : key.toLowerCase()}</span>
                            : <span className={'nav-text'}>{settings.filter[key].length} {settings.filter[key].length > 1 ? key.toLowerCase() : key.toLowerCase().slice(0, -1)}</span>}
                      <span onClick={() => removeFilterPart(key)} className={'close-nav'}><CloseIcon/></span>
                    </Button>
                      }
                    })}
                    <span className={'arrow-close-activities'} onClick={handleChangeList}>
                      <img src={ArrowUp}/>
                    </span>
                  </span>}
              </div>
              {item.data.map(currAction => {
                if (!currAction.options.hasOwnProperty('show_in_dashboard') || !currAction.options.show_in_dashboard) {
                  return;
                }
                let manager = managers.find(item => item.id === currAction.user_id);
                let description = activityTypes.find(item => item.id === currAction.action_type_id)?.name === userProfileUpdated
                  ? getEditMessage(currAction)
                  : parseTextToComponent(currAction.description)
                if (description) {
                  return <div onClick={() => handleActionClick(manager, currAction)} className={'dashboard-action'}>
                    <img src={manager.url ? manager.url : noneAvatar} className={"action-user-avatar"}/>
                    <span className={'action-user-name'}>
                      {manager.first_name + ' ' + manager.last_name}
                    </span>
                    <span className={'action-user-org'}>{manager?.permissions?.organization}</span>
                    <span style={{width: window.innerWidth * 0.43 - 370}} className={'action-user-description'}>{description}</span>
                    <span className={'action-user-time'}>
                  {item.date === 'Today'
                    ? moment(currAction.created_at).fromNow() === 'a few seconds ago' ? 'now' : moment(currAction.created_at).fromNow()
                    : moment(currAction.created_at).format('HH:MM')
                  }
                </span>
                  </div>
                }
              })}
            </div>
          )}
          {usersActivities?.next_page_url &&
          <div className={'activity-load-more'}>
            {isLoadingData ?
              <img src={SpinnerIcon} alt={'spinner'}/> :
              <Button onClick={loadMoreData}>Load more</Button>
            }

          </div>}
        </Scrollbars>
      }
    </div>
  )
}

export default ActivitiesDashboard

