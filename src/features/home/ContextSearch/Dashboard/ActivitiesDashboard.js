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
  setManager,
  setContext,
} = appSlice.actions;

const ActivitiesDashboard = ({ usersActivities, isActivitiesShown, setIsActivitiesShown, wrapperRefFilterButton, filter, setFilter, isFilterBoxOpen, setIsFilterBoxOpen, tabLabel, setTabLabel, isFilterTagOpen, setIsFilterTagOpen }) => {
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
    dispatch(getDashboardDataRequest({page: usersActivities.current_page + 1, filter: filter}))
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
    if ( currAction.action_type.name === 'Application was updated'
      || currAction.action_type.name === 'Application state change'
      || currAction.action_type.name === 'New application added to user') {
      selectedInfo = {type: 'onboarding', value: parseOnboardingName(currAction.description)};
    } else if (currAction.action_type.name === 'Application was deleted') {
      selectedInfo = {type: 'onboarding'};
    } else if (currAction.action_type.name === userProfileUpdated) {
      selectedInfo = {type: 'userEdit'};
    }
    let newManager = selectedInfo
      ? {selectedInfo: selectedInfo, ...manager}
      : {...manager}
    dispatch(setManager(newManager));
    dispatch(setContext('User'));
  }

  if (!isActivitiesShown) return null;


  return (
    <div>
      <span className={'arrow-close-activities'} onClick={() => setIsActivitiesShown(false)}>
        <img src={ArrowUp}/>
      </span>
      {isFilterBoxOpen &&
        <span ref={wrapperRefFilterBox}>
          <FilterBox
            managers={managers}
            filter={filter}
            setFilter={setFilter}
            setIsFilterBoxOpen={setIsFilterBoxOpen}
            setIsFilterTagOpen={setIsFilterTagOpen}
            setTabLabel={setTabLabel}
          />
        </span>
      }
      {(!activities || activities.length === 0)
        ? <h1 style={{margin: '50px 0px 20px 15px', padding: '5vh 0'}}>No activities found</h1>
        : <Scrollbars style={{height: 450, width: Math.round(window.innerWidth * 0.43), marginTop: 50, fontsize: 'small'}}>
          {managers.length > 0 && activities.map(item =>
            <div>
              <div className={'action-date'}>{item.date}</div>
              {item.data.map(currAction => {
                let manager = managers.find(item => item.id === currAction.user_id);
                let description = activityTypes.find(item => item === currAction.action_type_id)?.name === userProfileUpdated
                  ? getEditMessage(currAction)
                  : parseTextToComponent(currAction.description)
                if (description) {
                  return <div onClick={() => handleActionClick(manager, currAction)} className={'dashboard-action'}>
                    <img src={manager.url ? manager.url : noneAvatar} className={"action-user-avatar"}/>
                    <span className={'action-user-name'}>
                      {manager.first_name + ' ' + manager.last_name}
                    </span>
                    <span className={'action-user-org'}>{manager?.permissions?.organization}</span>
                    <span className={'action-user-description'}>{description}</span>
                    <span className={'action-user-time'}>
                  {item.date === 'Today'
                    ? moment(currAction.created_at).fromNow()
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

