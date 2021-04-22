import React, {useEffect, useState} from 'react'
import {
  Card,
  CardBody,
} from 'reactstrap'

import './styles.scss'

import ArrowBoldUp from 'assets/img/icons/arrow-bold-up.png'
import CheckMarkSuccess from 'assets/img/icons/checkmark3.png'
import { Scrollbars } from 'react-custom-scrollbars'
import {useDispatch, useSelector} from "react-redux";
import appSlice from "app/slices/appSlice";
import {selectUserActivity} from "app/selectors/userSelectors";

const { getActivitiesRequest } = appSlice.actions;


const Timeline = ({managerId}) => {
  const dispatch = useDispatch();

  const Delimiter = () => (
    <div className="timeline-component_item timeline-component_item-delimiter">
      <div className="vertical-delimiter"/>
    </div>
  )

  const icons = {
    success: {
      icon: CheckMarkSuccess,
      iconStyles: {},
    },
    upload: {
      icon: ArrowBoldUp,
      iconStyles: {},
    }
  }

  const data = useSelector(selectUserActivity(managerId));
  const [showedActivitiesSize, setShowedActivitiesSize] = useState(4);

  const addData = (scroll) => {
    if (scroll.top > 0.95) {
     if (data.length > showedActivitiesSize) {
        setShowedActivitiesSize(showedActivitiesSize + 1);
      }
    }
  }

  const getTimePassed = (inputTime) => {
    let time = new Date(inputTime);
    let seconds = Math.floor((Date.now() - time) / 1000);
    if (seconds < 60) {
      return `${seconds} seconds ago`;
    }
    else if (seconds < 3600) {
      return `${Math.floor((seconds) / 60)} minute` + (Math.floor((seconds) / 60) > 1 ? `s` : ``) + ` ago`;
    }
    else if (seconds < 86400) {
      return `${Math.floor((seconds) / 3600)} hour` + (Math.floor((seconds) / 3600) > 1 ? `s` : ``) + ` ago`;
    }
    else {
      let days = Math.floor((seconds) / 86400);
      if (days < 30) {
        return `${days} day` + (days > 1 ? `s` : ``) + ` ago`;
      }
      else if (days < 365) {
        return `${Math.floor((days) / 30)} month` + (Math.floor((days) / 30) > 1 ? `s` : ``) + ` ago`;
      }
      else return time.toDateString().split(' ').slice(1).join(' ');
    }
  }

  useEffect(() => {
    dispatch(getActivitiesRequest(managerId))
    setShowedActivitiesSize(4);
  }, [managerId]);

  if (data && data.length < showedActivitiesSize) {
    setShowedActivitiesSize(data.length);
  }

  if (data && data.length === 0) {
    return <h1 className={'no-activities'}>This manager has no activities yet</h1>
  }

  return (
    <Card>
      <CardBody>
        <Scrollbars autoHeight autoHeightMax={500} onScrollFrame={addData}>
          <div className="timeline-component">

            <div className="timeline-component_item">
              <div className="left">
                <div className="start" >Now</div>
              </div>
            </div>
            <Delimiter />
            {data && data.slice(0).reverse().slice(0, showedActivitiesSize).map((item, index) => {
              return (
                <>
                  <div key={index} className="timeline-component_item">
                    <div className="left">
                      {getTimePassed(item.created_at)}
                    </div>
                    <div className="center">
                      <div className="horizontal-delimiter">
                        <div className={`status-circle status-success`} />
                      </div>
                    </div>
                    <div className="right">
                      <div className="right-content">
                        <div className="icon">
                          <img src={icons['success'].icon} alt="icon"/>
                        </div>
                        <div className="description">
                          {item.description}
                        </div>
                      </div>
                    </div>
                  </div>
                  <Delimiter />
                </>
              )
            })}

          </div>
        </Scrollbars>
      </CardBody>
    </Card>
  )
}


export default Timeline;
