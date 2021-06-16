import React, {useRef, useState} from 'react'
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
      dispatch(getDashboardActivityRequest({key: settings.key, page: usersActivities.current_page + 1, 'from': moment().subtract(settings.daysNumber, 'days').format('YYYY-MM-DD')}))
    } else {
      dispatch(getDashboardDataRequest({key: settings.key, page: usersActivities.current_page + 1, dForm: settings?.dForm?.id, 'from': moment().subtract(settings.daysNumber, 'days').format('YYYY-MM-DD')}))
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

  if (settings.state !== 'large') return null;


  return (
    <div>
      {isFilterBoxOpen &&
        <span ref={wrapperRefFilterBox}>
          <FilterBox
            setIsFilterBoxOpen={setIsFilterBoxOpen}
            dForms={dForms}
            updateSettings={updateSettings}
            settings={settings}
          />
        </span>
      }
      {(!activities || activities.length === 0)
        ? <span style={{position: 'relative'}}>
            <div className={'action-date'} style={{position: 'relative', paddingLeft: 5}}>
                {'Today'}
                  <span>
                    {settings.title !== 'Activities' && settings?.dForm?.name !== 'Applications Snapshot' && <span className={'filter-icon-box'} onClick={handleFilterBox} ref={wrapperRefFilterButton}>
                      <img className={'filter-icon'} src={FilterIcon} alt={'filter-icon'}/>
                    </span>}
                    <span className={'arrow-close-activities'} onClick={handleChangeList}>
                      <img src={ArrowUp}/>
                    </span>
                  </span>
              </div>
          <h1 style={{padding: '5vh 5px'}}>No activities found</h1>
          </span>
        : <Scrollbars style={{height: 350, width: Math.round(window.innerWidth * 0.43), fontsize: 'small'}}>
          {managers.length > 0 && activities.map((item, key) =>
            <div style={{paddingLeft: '5px'}}>
              <div className={'action-date'} style={{position: 'relative'}}>
                {item.date}
                {key === 0 &&
                  <span>
                    {settings.title !== 'Activities' && settings?.dForm?.name !== 'Applications Snapshot' && <span className={'filter-icon-box'} onClick={handleFilterBox} ref={wrapperRefFilterButton}>
                      <img className={'filter-icon'} src={FilterIcon} alt={'filter-icon'}/>
                    </span>}
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

