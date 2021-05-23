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

const dateFormat = 'DD/MM/YYYY';

const { getDashboardDataRequest } = appSlice.actions;

const ActivitiesDashboard = ({ usersActivities, isActivitiesShown, setIsActivitiesShown }) => {
  const dispatch = useDispatch();
  const isLoadingData = useSelector(selectLoading)
  const managers = useSelector(selectManagers)
  const wrapperRefFilterBox = useRef(null), wrapperRefFilterButton = useRef(null);
  useOutsideAlerter([wrapperRefFilterBox, wrapperRefFilterButton], () => {if (isFilterBoxOpen) setIsFilterBoxOpen(false)});

  const [filter, setFilter] = useState({type: undefined, value: undefined})
  const [isFilterBoxOpen, setIsFilterBoxOpen] = useState(false)
  const [isFilterTagOpen, setIsFilterTagOpen] = useState(false)
  const [tabLabel, setTabLabel] = useState('')

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

  const removeFilter = () => {
    setFilter({type: undefined, value: undefined})
    dispatch(getDashboardDataRequest({page: 1}))
    setIsFilterTagOpen(false);
    setTabLabel('')
  }

  const handleFilterBox = () => {
    if (!isFilterBoxOpen) {
      setFilter({type: filter?.type, value: filter?.value, label: tabLabel})
    }
    setIsFilterBoxOpen(!isFilterBoxOpen);
  }

  if (!isActivitiesShown) return null;


  return (
    <div>
      <span className={'arrow-close-activities'} onClick={() => setIsActivitiesShown(false)}>
        <img src={ArrowUp}/>
      </span>
      {managers?.length > 0 && activities?.length > 0 && <div className={'dashboard-titles'}>
        <span style={{width: '150px', marginLeft: '35px', paddingLeft: '35px'}} className={'dashboard-column-title'}><h5>Name</h5></span>
        <span style={{width: '250px'}} className={'dashboard-column-title'}><h5>Organization</h5></span>
        <span className={'dashboard-column-title'}><h5>Action</h5></span>
      </div>}
      <span className={'filter-icon-box'} onClick={handleFilterBox} ref={wrapperRefFilterButton}>
        <img className={'filter-icon'} src={FilterIcon} alt={'filter-icon'}/>
      </span>
      {isFilterTagOpen && <Button className={'filter-tab'} variant={'dark'}>
            <span className={'nav-text'}>{tabLabel}</span>
            <span onClick={removeFilter}
                  className={'close-nav'}><CloseIcon/></span>
          </Button>}
      <span>
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
        ? <h1 style={{margin: '50px 0px 20px 15px'}}>No activities found</h1>
        : <Scrollbars style={{height: 450, width: window.innerWidth * 0.94, marginTop: 80}}>
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

