import React from 'react'
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

const dateFormat = 'DD/MM/YYYY';

const { getDashboardDataRequest } = appSlice.actions;

const ActivitiesDashboard = ({ usersActivities, isActivitiesShown, setIsActivitiesShown }) => {
  const dispatch = useDispatch();
  const isLoadingData = useSelector(selectLoading)
  const managers = useSelector(selectManagers)

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
    dispatch(getDashboardDataRequest({page: usersActivities.current_page + 1}))
  }

  if (!isActivitiesShown) return null;

  return (
    <div>
      <span className={'arrow-close-activities'} onClick={() => setIsActivitiesShown(false)}>
        <img src={ArrowUp}/>
      </span>
      <Scrollbars style={{ height: 450, width: window.innerWidth * 0.94, marginTop: 40 }}>
        {managers.length > 0 && activities.map(item =>
          <div>
            <div className={'action-date'}>{item.date}</div>
            {item.data.map(currAction => {
              let manager = managers.find(item => item.id === currAction.user_id);
              let description = currAction.action_type.name === userProfileUpdated
                    ? getEditMessage(currAction)
                    : parseTextToComponent(currAction.description)
              if (description) {
                return <div className={'dashboard-action'}>
                  <img src={manager.url ? manager.url : noneAvatar} className={"action-user-avatar"}/>
                  <span className={'action-user-name'}>{manager.first_name + ' ' + manager.last_name}</span>
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
    </div>
  )
}

export default ActivitiesDashboard

